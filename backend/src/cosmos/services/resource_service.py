from __future__ import annotations

import base64
import hashlib
import mimetypes
import os
import tempfile
from datetime import UTC, datetime
from pathlib import Path

from cosmos.domain.objects import JSONValue
from cosmos.runtime import ContextSnapshot, EventDispatcher, RuntimeContext, RuntimeEvent
from cosmos.services.errors import RuntimeServiceError, require_permission
from cosmos.services.object_service import ObjectService
from cosmos.services.project_service import ProjectService

_TEXT_EXTENSIONS = {
    ".css",
    ".csv",
    ".html",
    ".ini",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".markdown",
    ".py",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".vue",
    ".xml",
    ".yaml",
    ".yml",
}
_IMAGE_EXTENSIONS = {".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
_MAX_TEXT_BYTES = 1_000_000
_MAX_IMAGE_BYTES = 5_000_000


class ResourceService:
    """Authoritative project-scoped physical file command boundary."""

    def __init__(
        self,
        projects: ProjectService,
        objects: ObjectService,
        events: EventDispatcher,
    ) -> None:
        self._projects = projects
        self._objects = objects
        self._events = events

    def tree(self, context: RuntimeContext, query: str = "") -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.read")
        project_id, root = self._root(context)
        needle = query.strip().casefold()
        return {
            "projectId": project_id,
            "rootName": "Files",
            "query": query.strip(),
            "tree": self._directory_node(root, root, needle),
        }

    def read(self, relative_path: str, context: RuntimeContext) -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.read")
        project_id, root = self._root(context)
        path = self._resolve(root, relative_path)
        if not path.is_file():
            raise RuntimeServiceError("resource_not_found", f"Project file not found: {relative_path}")
        stat = path.stat()
        suffix = path.suffix.casefold()
        metadata = self._metadata(path, root)
        if suffix in _TEXT_EXTENSIONS:
            if stat.st_size > _MAX_TEXT_BYTES:
                return self._unsupported(project_id, metadata, "Text preview exceeds the 1 MB limit.")
            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                return self._unsupported(project_id, metadata, "File is not valid UTF-8 text.")
            return {
                "projectId": project_id,
                "metadata": metadata,
                "contentType": "text",
                "content": content,
                "dataUrl": None,
                "editable": True,
                "supported": True,
                "message": None,
            }
        if suffix in _IMAGE_EXTENSIONS and stat.st_size <= _MAX_IMAGE_BYTES:
            mime_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
            encoded = base64.b64encode(path.read_bytes()).decode("ascii")
            return {
                "projectId": project_id,
                "metadata": metadata,
                "contentType": "image",
                "content": None,
                "dataUrl": f"data:{mime_type};base64,{encoded}",
                "editable": False,
                "supported": True,
                "message": None,
            }
        return self._unsupported(project_id, metadata, "Preview is unavailable for this file type.")

    def create(self, relative_path: str, content: str, context: RuntimeContext) -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.write")
        project_id, root = self._root(context)
        path = self._resolve(root, relative_path)
        if path.exists():
            raise RuntimeServiceError("resource_exists", f"Project file already exists: {relative_path}")
        if not path.parent.is_dir():
            raise RuntimeServiceError("validation_failed", "The destination directory does not exist.")
        self._atomic_write(path, content)
        self._publish("ResourceCreated", project_id, relative_path, context)
        return self.read(relative_path, context)

    def edit(
        self,
        relative_path: str,
        content: str,
        expected_hash: str,
        context: RuntimeContext,
    ) -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.write")
        project_id, root = self._root(context)
        path = self._resolve(root, relative_path)
        if not path.is_file():
            raise RuntimeServiceError("resource_not_found", f"Project file not found: {relative_path}")
        if path.suffix.casefold() not in _TEXT_EXTENSIONS:
            raise RuntimeServiceError("validation_failed", "Only supported UTF-8 text files can be edited.")
        current_hash = _file_hash(path)
        if not expected_hash or current_hash != expected_hash:
            raise RuntimeServiceError(
                "resource_conflict", "The Project file changed after it was opened. Reload before saving."
            )
        self._atomic_write(path, content)
        self._publish("ResourceUpdated", project_id, relative_path, context)
        return self.read(relative_path, context)

    def move(
        self,
        source_path: str,
        destination_path: str,
        context: RuntimeContext,
    ) -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.write")
        project_id, root = self._root(context)
        source = self._resolve(root, source_path)
        destination = self._resolve(root, destination_path)
        if not source.is_file():
            raise RuntimeServiceError("resource_not_found", f"Project file not found: {source_path}")
        if destination.exists():
            raise RuntimeServiceError("resource_exists", f"Destination already exists: {destination_path}")
        if not destination.parent.is_dir():
            raise RuntimeServiceError("validation_failed", "The destination directory does not exist.")
        source.replace(destination)
        self._publish(
            "ResourceMoved",
            project_id,
            destination_path,
            context,
            {"sourcePath": source_path},
        )
        return self.read(destination_path, context)

    def delete(self, relative_path: str, context: RuntimeContext) -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.write")
        project_id, root = self._root(context)
        path = self._resolve(root, relative_path)
        if not path.is_file():
            raise RuntimeServiceError("resource_not_found", f"Project file not found: {relative_path}")
        path.unlink()
        self._publish("ResourceDeleted", project_id, relative_path, context)
        return {"projectId": project_id, "path": _normalize_relative(relative_path), "deleted": True}

    def _root(self, context: RuntimeContext) -> tuple[str, Path]:
        project_id = context.focused_project_id
        if project_id is None or project_id not in context.project_scope_ids:
            raise RuntimeServiceError(
                "project_context_required", "Files requires one focused Project in Runtime Context."
            )
        project = self._objects.get(project_id, context)
        if "Project" not in project.system_tags:
            raise RuntimeServiceError("validation_failed", "Focused Context Object is not a Project.")
        paths = self._projects.prepared_structures(project_id, context)
        root = paths.get("Files")
        if root is None:
            raise RuntimeServiceError("resource_root_not_found", "Project Files root is unavailable.")
        resolved = root.resolve()
        if not resolved.is_dir():
            raise RuntimeServiceError("resource_root_not_found", "Project Files root is unavailable.")
        return project_id, resolved

    @staticmethod
    def _resolve(root: Path, relative_path: str) -> Path:
        if not isinstance(relative_path, str) or "\x00" in relative_path:
            raise RuntimeServiceError("validation_failed", "Project file path is invalid.")
        normalized = relative_path.strip().replace("\\", "/")
        candidate_relative = Path(normalized)
        if not normalized or candidate_relative.is_absolute() or ".." in candidate_relative.parts:
            raise RuntimeServiceError("validation_failed", "Project file path must remain relative.")
        candidate = (root / candidate_relative).resolve()
        if candidate == root or root not in candidate.parents:
            raise RuntimeServiceError("validation_failed", "Project file path escaped the active Project.")
        return candidate

    def _directory_node(self, directory: Path, root: Path, query: str) -> dict[str, JSONValue]:
        children: list[dict[str, JSONValue]] = []
        for child in sorted(directory.iterdir(), key=lambda item: (not item.is_dir(), item.name.casefold())):
            try:
                resolved = child.resolve()
            except OSError:
                continue
            if resolved != root and root not in resolved.parents:
                continue
            if child.is_dir():
                node = self._directory_node(child, root, query)
                if not query or node["children"]:
                    children.append(node)
            elif child.is_file() and (not query or query in child.name.casefold()):
                children.append({**self._metadata(child, root), "children": None})
        return {
            "name": directory.name,
            "path": "" if directory == root else directory.relative_to(root).as_posix(),
            "type": "directory",
            "children": children,
        }

    @staticmethod
    def _metadata(path: Path, root: Path) -> dict[str, JSONValue]:
        stat = path.stat()
        return {
            "name": path.name,
            "path": path.relative_to(root).as_posix(),
            "type": "file",
            "sizeBytes": stat.st_size,
            "modifiedAt": datetime.fromtimestamp(stat.st_mtime, UTC).isoformat(),
            "extension": path.suffix.casefold(),
            "mimeType": mimetypes.guess_type(path.name)[0],
            "editable": path.suffix.casefold() in _TEXT_EXTENSIONS,
            "contentHash": _file_hash(path),
        }

    @staticmethod
    def _unsupported(project_id: str, metadata: dict[str, JSONValue], message: str) -> dict[str, JSONValue]:
        return {
            "projectId": project_id,
            "metadata": metadata,
            "contentType": "binary",
            "content": None,
            "dataUrl": None,
            "editable": False,
            "supported": False,
            "message": message,
        }

    @staticmethod
    def _atomic_write(path: Path, content: str) -> None:
        if not isinstance(content, str):
            raise RuntimeServiceError("validation_failed", "Project file content must be text.")
        descriptor, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
        temporary = Path(temporary_name)
        try:
            with os.fdopen(descriptor, "w", encoding="utf-8", newline="") as stream:
                stream.write(content)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            if temporary.exists():
                temporary.unlink()

    def _publish(
        self,
        event_type: str,
        project_id: str,
        relative_path: str,
        context: RuntimeContext,
        extra: dict[str, JSONValue] | None = None,
    ) -> None:
        self._events.publish(
            RuntimeEvent.create(
                event_type,
                context=ContextSnapshot.capture(context, "cosmos.local-owner"),
                origin_service="ResourceService",
                affected_object_ids=(project_id,),
                metadata={"path": _normalize_relative(relative_path), **(extra or {})},
            )
        )


def _file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _normalize_relative(value: str) -> str:
    return Path(value.replace("\\", "/")).as_posix()
