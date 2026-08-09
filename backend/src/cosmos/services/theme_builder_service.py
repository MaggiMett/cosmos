from __future__ import annotations

import re
from copy import deepcopy
from datetime import UTC, datetime
from uuid import uuid4

from cosmos.domain import CosmosObject, ObjectIdentity
from cosmos.domain.objects import JSONValue
from cosmos.runtime import RuntimeContext
from cosmos.services.errors import RuntimeServiceError, require_permission
from cosmos.services.object_service import CreateObjectCommand, ObjectService
from cosmos.services.resource_service import ResourceService

THEME_BUILDER_PROJECT_TAG = "ThemeBuilderProject"
THEME_BUILDER_CONTRACT_VERSION = "1.0.0"
THEME_ENGINE_CONTRACT_VERSION = "1.0.0"
INITIAL_ARTIFACT_VERSION = "0.1.0"
BUILDER_DOCUMENT_PROPERTY = "builder_document"
REVISION_CONFLICT = "theme_builder_project_revision_conflict"

_NAMESPACED_ID = re.compile(r"^[a-z0-9]+(?:[._-][a-z0-9]+)+$")
_SEMVER = re.compile(
    r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)"
    r"(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$"
)


class ThemeBuilderService:
    """Authoritative Object-Service boundary for versioned Theme Builder projects."""

    def __init__(self, objects: ObjectService, resources: ResourceService) -> None:
        self._objects = objects
        self._resources = resources

    def create(
        self,
        *,
        name: str,
        description: str,
        author: str,
        context: RuntimeContext,
    ) -> dict[str, JSONValue]:
        require_permission(context.permissions, "drafts.write")
        metadata = _metadata(name, description, author)
        identity_suffix = uuid4().hex
        builder_project_id = f"user.theme-builder-project.{identity_suffix}"
        theme_id = f"user.theme.{identity_suffix}"
        package_id = f"user.theme-package.{identity_suffix}"
        now = datetime.now(UTC).isoformat()
        document: dict[str, JSONValue] = {
            "schemaVersion": 1,
            "builderProjectId": builder_project_id,
            "revision": 1,
            "createdAt": now,
            "updatedAt": now,
            "contractVersions": {
                "themeBuilder": THEME_BUILDER_CONTRACT_VERSION,
                "themeEngine": THEME_ENGINE_CONTRACT_VERSION,
            },
            "themeId": theme_id,
            "packageId": package_id,
            "name": metadata["name"],
            "description": metadata["description"],
            "author": metadata["author"],
            "packageType": "full-theme",
            "themeVersion": INITIAL_ARTIFACT_VERSION,
            "packageVersion": INITIAL_ARTIFACT_VERSION,
            "manifestDraft": _manifest_draft(theme_id, metadata),
            "artifacts": {
                "skinPacks": [],
                "roomShells": [],
                "catalogObjects": [],
            },
            "assetRefs": [],
        }
        _validate_document(document, builder_project_id)
        value = self._objects.create(
            CreateObjectCommand(
                identity=ObjectIdentity(
                    object_id=builder_project_id,
                    display_name=str(metadata["name"]),
                    description=str(metadata["description"]),
                    creator="cosmos.theme-builder",
                    lifecycle_state="draft",
                    created_at=datetime.now(UTC),
                ),
                system_tags=frozenset({THEME_BUILDER_PROJECT_TAG}),
                properties={BUILDER_DOCUMENT_PROPERTY: document},
            ),
            context,
        )
        return _document_payload(value)

    def get(self, builder_project_id: str, context: RuntimeContext) -> dict[str, JSONValue]:
        require_permission(context.permissions, "drafts.read")
        return _document_payload(self._project(builder_project_id, context))

    def list(self, context: RuntimeContext) -> list[dict[str, JSONValue]]:
        require_permission(context.permissions, "drafts.read")
        return sorted(
            (
                _document_payload(value)
                for value in self._objects.list(context, system_tag=THEME_BUILDER_PROJECT_TAG)
            ),
            key=lambda document: (str(document["createdAt"]), str(document["builderProjectId"])),
        )

    def save_draft(
        self,
        builder_project_id: str,
        *,
        expected_revision: int,
        name: str,
        description: str,
        author: str,
        asset_refs: list[object],
        context: RuntimeContext,
    ) -> dict[str, JSONValue]:
        require_permission(context.permissions, "drafts.write")
        if (
            isinstance(expected_revision, bool)
            or not isinstance(expected_revision, int)
            or expected_revision < 1
        ):
            raise RuntimeServiceError(
                "theme_builder_project_invalid",
                "expectedRevision must be a positive integer.",
            )
        metadata = _metadata(name, description, author)
        value = self._project(builder_project_id, context)
        current = _document_payload(value)
        if current["revision"] != expected_revision:
            raise RuntimeServiceError(
                REVISION_CONFLICT,
                f"Theme Builder Project revision conflict: expected {expected_revision}.",
            )

        validated_asset_refs = self._validated_asset_refs(
            current.get("assetRefs"),
            asset_refs,
            context,
        )

        updated = deepcopy(current)
        updated["revision"] = expected_revision + 1
        updated["updatedAt"] = datetime.now(UTC).isoformat()
        updated["name"] = metadata["name"]
        updated["description"] = metadata["description"]
        updated["author"] = metadata["author"]
        updated["assetRefs"] = validated_asset_refs
        manifest = updated["manifestDraft"]
        if not isinstance(manifest, dict):
            raise RuntimeServiceError("theme_builder_project_invalid", "Manifest draft is invalid.")
        manifest["displayName"] = metadata["name"]
        manifest["description"] = metadata["description"]
        if metadata["author"]:
            manifest["author"] = {"name": metadata["author"]}
        else:
            manifest.pop("author", None)
        _validate_document(updated, builder_project_id)

        saved = self._objects.compare_and_swap_property(
            builder_project_id,
            property_name=BUILDER_DOCUMENT_PROPERTY,
            expected_value=current,
            replacement_value=updated,
            display_name=str(metadata["name"]),
            description=str(metadata["description"]),
            conflict_code=REVISION_CONFLICT,
            context=context,
        )
        return _document_payload(saved)

    def _validated_asset_refs(
        self,
        current_value: JSONValue | None,
        proposed_value: list[object],
        context: RuntimeContext,
    ) -> list[JSONValue]:
        current = _asset_references(current_value)
        proposed = _asset_references(proposed_value)
        current_keys = {(str(item["id"]), str(item["version"])) for item in current}
        added_keys = {
            (str(item["id"]), str(item["version"]))
            for item in proposed
            if (str(item["id"]), str(item["version"])) not in current_keys
        }
        if not added_keys:
            return proposed

        catalog: dict[tuple[str, str], tuple[bool, bool]] = {}
        for record in self._resources.list_asset_catalog(context):
            entry = record.get("catalogEntry")
            resource = record.get("resource")
            if not isinstance(entry, dict) or not isinstance(resource, dict):
                continue
            reference = entry.get("visualAssetRef")
            if not isinstance(reference, dict):
                continue
            asset_id = reference.get("id")
            version = reference.get("version")
            if isinstance(asset_id, str) and isinstance(version, str):
                catalog[(asset_id, version)] = (
                    entry.get("deprecated") is not True,
                    resource.get("available") is True,
                )

        for key in sorted(added_keys):
            state = catalog.get(key)
            if state is None:
                raise RuntimeServiceError(
                    "theme_builder_asset_reference_invalid",
                    f'Visual Asset "{key[0]}@{key[1]}" is not cataloged.',
                )
            if not all(state):
                raise RuntimeServiceError(
                    "theme_builder_asset_reference_unavailable",
                    f'Visual Asset "{key[0]}@{key[1]}" is not currently usable.',
                )
        return proposed

    def _project(self, builder_project_id: str, context: RuntimeContext) -> CosmosObject:
        try:
            value = self._objects.get(builder_project_id, context)
        except RuntimeServiceError as error:
            if error.code == "object_not_found":
                raise RuntimeServiceError(
                    "theme_builder_project_not_found",
                    f"Theme Builder Project not found: {builder_project_id}",
                ) from error
            raise
        if THEME_BUILDER_PROJECT_TAG not in value.system_tags:
            raise RuntimeServiceError(
                "theme_builder_project_not_found",
                f"Theme Builder Project not found: {builder_project_id}",
            )
        return value


def _manifest_draft(theme_id: str, metadata: dict[str, str]) -> dict[str, JSONValue]:
    manifest: dict[str, JSONValue] = {
        "schemaVersion": 1,
        "themeId": theme_id,
        "version": INITIAL_ARTIFACT_VERSION,
        "displayName": metadata["name"],
        "description": metadata["description"],
        "packageKind": "full-theme",
        "compatibility": {
            "themeEngine": f"^{THEME_ENGINE_CONTRACT_VERSION}",
            "cosmos": "^1.0.0",
        },
        "groups": [],
        "packRefs": [],
        "tokens": {},
        "systemTerms": {},
    }
    if metadata["author"]:
        manifest["author"] = {"name": metadata["author"]}
    return manifest


def _metadata(name: str, description: str, author: str) -> dict[str, str]:
    normalized = {
        "name": name.strip(),
        "description": description.strip(),
        "author": author.strip(),
    }
    if not normalized["name"]:
        raise RuntimeServiceError("theme_builder_project_invalid", "Theme name must not be empty.")
    if len(normalized["name"]) > 120:
        raise RuntimeServiceError("theme_builder_project_invalid", "Theme name is too long.")
    if len(normalized["description"]) > 2000:
        raise RuntimeServiceError("theme_builder_project_invalid", "Theme description is too long.")
    if len(normalized["author"]) > 120:
        raise RuntimeServiceError("theme_builder_project_invalid", "Theme author is too long.")
    return normalized


def _document_payload(value: CosmosObject) -> dict[str, JSONValue]:
    document = deepcopy(value.properties.get(BUILDER_DOCUMENT_PROPERTY))
    if not isinstance(document, dict):
        raise RuntimeServiceError("theme_builder_project_invalid", "Builder document is unavailable.")
    _validate_document(document, value.identity.object_id)
    return document


def _validate_document(document: dict[str, JSONValue], expected_id: str) -> None:
    required = {
        "schemaVersion",
        "builderProjectId",
        "revision",
        "createdAt",
        "updatedAt",
        "contractVersions",
        "themeId",
        "packageId",
        "name",
        "description",
        "author",
        "packageType",
        "themeVersion",
        "packageVersion",
        "manifestDraft",
        "artifacts",
        "assetRefs",
    }
    if set(document) != required or document.get("schemaVersion") != 1:
        _invalid("Builder document fields are invalid.")
    if document.get("builderProjectId") != expected_id:
        _invalid("Builder Project identity is inconsistent.")
    for key in ("builderProjectId", "themeId", "packageId"):
        value = document.get(key)
        if not isinstance(value, str) or not _NAMESPACED_ID.fullmatch(value):
            _invalid(f"{key} must be a namespaced ID.")
    revision = document.get("revision")
    if isinstance(revision, bool) or not isinstance(revision, int) or revision < 1:
        _invalid("Builder Project revision must be a positive integer.")
    for key in ("createdAt", "updatedAt"):
        value = document.get(key)
        if not isinstance(value, str):
            _invalid(f"{key} must be an ISO timestamp.")
        try:
            datetime.fromisoformat(value)
        except ValueError:
            _invalid(f"{key} must be an ISO timestamp.")
    versions = document.get("contractVersions")
    if versions != {
        "themeBuilder": THEME_BUILDER_CONTRACT_VERSION,
        "themeEngine": THEME_ENGINE_CONTRACT_VERSION,
    }:
        _invalid("Builder contract versions are invalid.")
    for key in ("name", "description", "author"):
        if not isinstance(document.get(key), str):
            _invalid(f"{key} must be a string.")
    _metadata(str(document["name"]), str(document["description"]), str(document["author"]))
    if document.get("packageType") not in {"full-theme", "group-pack"}:
        _invalid("packageType is invalid.")
    for key in ("themeVersion", "packageVersion"):
        value = document.get(key)
        if not isinstance(value, str) or not _SEMVER.fullmatch(value):
            _invalid(f"{key} must be a semantic version.")
    artifacts = document.get("artifacts")
    if not isinstance(artifacts, dict) or set(artifacts) != {
        "skinPacks",
        "roomShells",
        "catalogObjects",
    }:
        _invalid("Builder artifact collections are invalid.")
    if any(not isinstance(artifacts[key], list) for key in artifacts):
        _invalid("Builder artifact collections must be arrays.")
    _asset_references(document.get("assetRefs"))
    manifest = document.get("manifestDraft")
    if not isinstance(manifest, dict):
        _invalid("Manifest draft must be an object.")
    if (
        manifest.get("schemaVersion") != 1
        or manifest.get("themeId") != document.get("themeId")
        or manifest.get("version") != document.get("themeVersion")
        or manifest.get("displayName") != document.get("name")
        or manifest.get("description") != document.get("description")
        or manifest.get("packageKind") != document.get("packageType")
    ):
        _invalid("Manifest draft metadata is inconsistent with its Builder Project.")
    author = manifest.get("author")
    expected_author = document.get("author")
    if expected_author and author != {"name": expected_author}:
        _invalid("Manifest draft author is inconsistent with its Builder Project.")
    if not expected_author and author is not None:
        _invalid("Manifest draft author is inconsistent with its Builder Project.")


def _invalid(message: str) -> None:
    raise RuntimeServiceError("theme_builder_project_invalid", message)


def _asset_references(value: object) -> list[JSONValue]:
    if not isinstance(value, list):
        _invalid("assetRefs must be an array.")
    normalized: list[JSONValue] = []
    identities: set[tuple[str, str]] = set()
    for item in value:
        if not isinstance(item, dict) or set(item) != {"id", "version"}:
            _invalid("Each Builder Asset Reference must contain only id and version.")
        asset_id = item.get("id")
        version = item.get("version")
        if not isinstance(asset_id, str) or not _NAMESPACED_ID.fullmatch(asset_id):
            _invalid("Builder Asset Reference id must be namespaced.")
        if not isinstance(version, str) or not _SEMVER.fullmatch(version):
            _invalid("Builder Asset Reference version must be semantic.")
        identity = (asset_id, version)
        if identity in identities:
            raise RuntimeServiceError(
                "theme_builder_asset_reference_duplicate",
                f'Duplicate Builder Asset Reference: "{asset_id}@{version}".',
            )
        identities.add(identity)
        normalized.append({"id": asset_id, "version": version})
    return normalized
