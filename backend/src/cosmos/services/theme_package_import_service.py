from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
import stat
import tempfile
import zipfile
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path, PurePosixPath

from cosmos.domain.objects import JSONValue
from cosmos.persistence import AssetCatalogRepository, SQLitePersistence, ThemePackageRepository
from cosmos.runtime import RuntimeContext
from cosmos.services.asset_catalog_validation import (
    expected_visual_asset_path,
    validate_asset_catalog_promotion,
)
from cosmos.services.errors import RuntimeServiceError, require_permission
from cosmos.services.theme_package_service import (
    canonical_manifest_digest,
    validate_prevalidated_install_record,
)

THEME_PACKAGE_DESCRIPTOR_PATH = "cosmos-theme-package.json"
THEME_MANIFEST_PATH = "theme-manifest.json"
CORE_THEME_ID = "cosmos.theme.cosmos"
THEME_ENGINE_VERSION = "1.0.0"
COSMOS_VERSION = "1.0.0"

_ID = re.compile(r"^[a-z0-9]+(?:[._-][a-z0-9]+)+$")
_SEMVER = re.compile(
    r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)"
    r"(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$"
)
_DIGEST = re.compile(r"^[a-f0-9]{64}$")
_REQUIRED_GROUPS = {
    "world",
    "map",
    "base-entry",
    "base-interior",
    "room",
    "workspace",
    "window",
    "companion",
    "icon",
    "node",
    "connection",
    "label",
    "status",
}
_PRESENTATION_GROUPS = _REQUIRED_GROUPS | {"ambient"}
_TOKEN_TYPES = {
    "color",
    "length",
    "number",
    "duration",
    "shadow",
    "font-family",
    "opacity",
    "string",
    "boolean",
}
_FORBIDDEN_KEYS = {
    "code",
    "eventhandler",
    "eventhandlers",
    "executable",
    "handler",
    "html",
    "javascript",
    "onclick",
    "onerror",
    "python",
    "script",
    "scripts",
    "shader",
    "typescript",
}
_FORBIDDEN_TEXT = (
    re.compile(r"<\s*script\b", re.IGNORECASE),
    re.compile(r"<\s*(?:iframe|object|embed|foreignObject)\b", re.IGNORECASE),
    re.compile(r"\bjavascript\s*:", re.IGNORECASE),
    re.compile(r"\bdata\s*:\s*text/html", re.IGNORECASE),
    re.compile(r"\bon(?:click|error|load|pointer\w*)\s*=", re.IGNORECASE),
)


@dataclass(frozen=True, slots=True)
class ThemePackageImportLimits:
    maximum_archive_bytes: int = 256 * 1024 * 1024
    maximum_uncompressed_bytes: int = 256 * 1024 * 1024
    maximum_asset_bytes: int = 16 * 1024 * 1024
    maximum_metadata_bytes: int = 1024 * 1024
    maximum_files: int = 256


class ThemePackageImportError(RuntimeServiceError):
    def __init__(
        self,
        code: str,
        message: str,
        *,
        package_id: str | None = None,
        package_version: str | None = None,
        theme_id: str | None = None,
        theme_name: str | None = None,
        archive_digest: str | None = None,
        manifest_digest: str | None = None,
        asset_count: int = 0,
    ) -> None:
        super().__init__(code, message)
        self.package_id = package_id
        self.package_version = package_version
        self.theme_id = theme_id
        self.theme_name = theme_name
        self.archive_digest = archive_digest
        self.manifest_digest = manifest_digest
        self.asset_count = asset_count

    def result(self) -> dict[str, JSONValue]:
        return {
            "success": False,
            "packageId": self.package_id,
            "packageVersion": self.package_version,
            "themeId": self.theme_id,
            "themeName": self.theme_name,
            "installStatus": "rejected",
            "diagnostics": [{"code": self.code, "message": str(self)}],
            "assets": {"total": self.asset_count, "installed": 0, "reused": 0},
            "integrity": {
                "status": "rejected",
                "archiveSha256": self.archive_digest,
                "manifestSha256": self.manifest_digest,
            },
            "runtimeRegistration": "not-registered",
        }


@dataclass(slots=True)
class _AssetPromotion:
    visual_asset: dict[str, JSONValue]
    catalog_entry: dict[str, JSONValue]
    content: bytes
    resource_path: str
    final_path: Path
    reused: bool = False
    staged_path: Path | None = None


class ThemePackageImportService:
    """Quarantines, validates and atomically installs one declarative Theme ZIP."""

    def __init__(
        self,
        persistence: SQLitePersistence,
        package_repository: ThemePackageRepository,
        asset_catalog: AssetCatalogRepository,
        runtime_path: Path,
        limits: ThemePackageImportLimits | None = None,
    ) -> None:
        self._persistence = persistence
        self._package_repository = package_repository
        self._asset_catalog = asset_catalog
        self._resource_root = Path(runtime_path) / "Resources"
        self._quarantine_root = Path(runtime_path) / "Quarantine" / "ThemePackages"
        self.limits = limits or ThemePackageImportLimits()

    @property
    def maximum_archive_bytes(self) -> int:
        return self.limits.maximum_archive_bytes

    def import_archive(
        self,
        archive_bytes: bytes,
        context: RuntimeContext,
    ) -> dict[str, JSONValue]:
        require_permission(context.permissions, "resources.write")
        archive_digest = hashlib.sha256(archive_bytes).hexdigest()
        identity: dict[str, str | None] = {
            "packageId": None,
            "packageVersion": None,
            "themeId": None,
            "themeName": None,
            "manifestDigest": None,
        }
        asset_count = 0
        if len(archive_bytes) > self.limits.maximum_archive_bytes:
            raise ThemePackageImportError(
                "theme_package_too_large",
                "Theme Package archive exceeds the 256 MiB intake limit.",
                archive_digest=archive_digest,
            )

        quarantine_path = self._write_quarantine(archive_bytes)
        try:
            try:
                with zipfile.ZipFile(quarantine_path) as archive:
                    entries = self._inspect_archive(archive)
                    descriptor = self._read_json_entry(
                        archive,
                        entries,
                        THEME_PACKAGE_DESCRIPTOR_PATH,
                        "Theme Package descriptor",
                    )
                    package_id, package_version, manifest_reference, assets = _validate_descriptor(descriptor)
                    identity["packageId"] = package_id
                    identity["packageVersion"] = package_version
                    asset_count = len(assets)

                    manifest = self._read_json_entry(
                        archive,
                        entries,
                        manifest_reference["path"],
                        "Theme Manifest",
                    )
                    _validate_theme_manifest(manifest)
                    theme_id = _required_string(manifest, "themeId", "Theme Manifest")
                    identity["themeId"] = theme_id
                    identity["themeName"] = _required_string(
                        manifest,
                        "displayName",
                        "Theme Manifest",
                    )
                    manifest_digest = canonical_manifest_digest(manifest)
                    identity["manifestDigest"] = manifest_digest
                    self._validate_package_identity(
                        package_id,
                        package_version,
                        manifest,
                        manifest_reference,
                        manifest_digest,
                    )
                    promotions = self._validate_assets(
                        archive,
                        entries,
                        assets,
                        theme_id,
                    )
                    self._validate_expected_paths(entries, promotions)
            except zipfile.BadZipFile as error:
                raise RuntimeServiceError(
                    "theme_package_archive_invalid",
                    "Theme Package is not a valid ZIP archive.",
                ) from error

            record = validate_prevalidated_install_record(
                {
                    "schemaVersion": 1,
                    "packageId": package_id,
                    "packageVersion": package_version,
                    "manifestDigest": manifest_digest,
                    "manifest": manifest,
                    "source": {
                        "kind": "prevalidated",
                        "provenance": f"theme-package-import:sha256:{archive_digest}",
                    },
                }
            )
            installed, reused = self._install(record, promotions)
            return {
                "success": True,
                "packageId": package_id,
                "packageVersion": package_version,
                "themeId": theme_id,
                "themeName": identity["themeName"],
                "installStatus": "installed",
                "diagnostics": [],
                "assets": {
                    "total": len(promotions),
                    "installed": installed,
                    "reused": reused,
                },
                "integrity": {
                    "status": "verified",
                    "archiveSha256": archive_digest,
                    "manifestSha256": manifest_digest,
                },
                "runtimeRegistration": "next-startup",
            }
        except ThemePackageImportError:
            raise
        except RuntimeServiceError as error:
            raise ThemePackageImportError(
                error.code,
                str(error),
                package_id=identity["packageId"],
                package_version=identity["packageVersion"],
                theme_id=identity["themeId"],
                theme_name=identity["themeName"],
                archive_digest=archive_digest,
                manifest_digest=identity["manifestDigest"],
                asset_count=asset_count,
            ) from error
        except (OSError, RuntimeError, ValueError) as error:
            raise ThemePackageImportError(
                "theme_package_archive_invalid",
                "Theme Package archive could not be safely inspected.",
                package_id=identity["packageId"],
                package_version=identity["packageVersion"],
                theme_id=identity["themeId"],
                theme_name=identity["themeName"],
                archive_digest=archive_digest,
                manifest_digest=identity["manifestDigest"],
                asset_count=asset_count,
            ) from error
        finally:
            quarantine_path.unlink(missing_ok=True)

    def _write_quarantine(self, content: bytes) -> Path:
        self._quarantine_root.mkdir(parents=True, exist_ok=True)
        descriptor, temporary_name = tempfile.mkstemp(
            prefix="theme-package-",
            suffix=".quarantine",
            dir=self._quarantine_root,
        )
        path = Path(temporary_name)
        try:
            with os.fdopen(descriptor, "wb") as stream:
                stream.write(content)
                stream.flush()
                os.fsync(stream.fileno())
        except Exception:
            path.unlink(missing_ok=True)
            raise
        return path

    def _inspect_archive(self, archive: zipfile.ZipFile) -> dict[str, zipfile.ZipInfo]:
        infos = archive.infolist()
        if len(infos) > self.limits.maximum_files:
            raise RuntimeServiceError(
                "theme_package_too_many_files",
                f"Theme Package contains more than {self.limits.maximum_files} entries.",
            )

        entries: dict[str, zipfile.ZipInfo] = {}
        seen: set[str] = set()
        total_size = 0
        for info in infos:
            path = _validate_archive_path(info.filename, info.is_dir())
            collision_key = path.rstrip("/").casefold()
            if collision_key in seen:
                raise RuntimeServiceError(
                    "theme_package_path_collision",
                    f'Theme Package contains a duplicate or colliding path: "{path}".',
                )
            seen.add(collision_key)
            _validate_zip_entry_type(info)
            if info.flag_bits & 0x1:
                raise RuntimeServiceError(
                    "theme_package_encrypted_entry",
                    "Encrypted Theme Package entries are not supported.",
                )
            if info.compress_type not in {zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED}:
                raise RuntimeServiceError(
                    "theme_package_compression_unsupported",
                    "Theme Package uses an unsupported compression method.",
                )
            if not info.is_dir():
                total_size += info.file_size
                maximum = (
                    self.limits.maximum_metadata_bytes
                    if path in {THEME_PACKAGE_DESCRIPTOR_PATH, THEME_MANIFEST_PATH}
                    else self.limits.maximum_asset_bytes
                )
                if info.file_size > maximum:
                    raise RuntimeServiceError(
                        "theme_package_entry_too_large",
                        f'Theme Package entry "{path}" exceeds its intake limit.',
                    )
                entries[path] = info

        if total_size > self.limits.maximum_uncompressed_bytes:
            raise RuntimeServiceError(
                "theme_package_too_large",
                "Theme Package uncompressed content exceeds the 256 MiB package limit.",
            )
        return entries

    def _read_json_entry(
        self,
        archive: zipfile.ZipFile,
        entries: dict[str, zipfile.ZipInfo],
        path: str,
        label: str,
    ) -> dict[str, JSONValue]:
        info = entries.get(path)
        if info is None:
            code = (
                "theme_package_descriptor_missing"
                if path == THEME_PACKAGE_DESCRIPTOR_PATH
                else "theme_package_manifest_missing"
            )
            raise RuntimeServiceError(code, f"{label} is missing from the package root.")
        content = _read_bounded(archive, info, self.limits.maximum_metadata_bytes)
        try:
            value = json.loads(content.decode("utf-8-sig"), object_pairs_hook=_unique_json_object)
        except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as error:
            raise RuntimeServiceError(
                "theme_package_json_invalid",
                f"{label} is not valid unambiguous UTF-8 JSON.",
            ) from error
        if not isinstance(value, dict):
            raise RuntimeServiceError(
                "theme_package_json_invalid",
                f"{label} must contain one JSON object.",
            )
        return value

    def _validate_package_identity(
        self,
        package_id: str,
        package_version: str,
        manifest: dict[str, JSONValue],
        manifest_reference: dict[str, str],
        manifest_digest: str,
    ) -> None:
        theme_id = _required_string(manifest, "themeId", "Theme Manifest")
        theme_version = _required_string(manifest, "version", "Theme Manifest")
        if package_version != theme_version:
            raise RuntimeServiceError(
                "theme_package_identity_mismatch",
                "Package version must equal Theme Manifest version.",
            )
        if manifest_reference["path"] != THEME_MANIFEST_PATH:
            raise RuntimeServiceError(
                "theme_package_manifest_path_invalid",
                f'Theme Manifest must use the package-root path "{THEME_MANIFEST_PATH}".',
            )
        if manifest_reference["sha256"] != manifest_digest:
            raise RuntimeServiceError(
                "theme_package_integrity_failed",
                "Theme Package manifest digest does not match the canonical Theme Manifest.",
            )
        if theme_id == CORE_THEME_ID:
            raise RuntimeServiceError(
                "theme_package_core_conflict",
                "Installed Theme Packages cannot overwrite the code-native Cosmos Core Theme.",
            )
        if self._package_repository.exists(package_id, package_version):
            raise RuntimeServiceError(
                "theme_package_conflict",
                f'Theme Package "{package_id}@{package_version}" is already installed.',
            )

    def _validate_assets(
        self,
        archive: zipfile.ZipFile,
        entries: dict[str, zipfile.ZipInfo],
        assets: list[dict[str, JSONValue]],
        theme_id: str,
    ) -> list[_AssetPromotion]:
        promotions: list[_AssetPromotion] = []
        asset_ids: set[tuple[object, object]] = set()
        entry_ids: set[tuple[object, object]] = set()
        resource_paths: set[str] = set()
        for index, item in enumerate(assets):
            if set(item) != {"visualAsset", "catalogEntry"}:
                raise RuntimeServiceError(
                    "theme_package_descriptor_invalid",
                    f"assets[{index}] must contain visualAsset and catalogEntry only.",
                )
            visual_value = item["visualAsset"]
            catalog_value = item["catalogEntry"]
            if not isinstance(visual_value, dict) or not isinstance(catalog_value, dict):
                raise RuntimeServiceError(
                    "theme_package_descriptor_invalid",
                    f"assets[{index}] declarations must be objects.",
                )
            resource_path_value = visual_value.get("path")
            if not isinstance(resource_path_value, str):
                raise RuntimeServiceError(
                    "theme_package_descriptor_invalid",
                    f"assets[{index}].visualAsset.path must be a string.",
                )
            info = entries.get(resource_path_value)
            if info is None:
                raise RuntimeServiceError(
                    "theme_package_asset_missing",
                    f'Declared Theme asset "{resource_path_value}" is missing.',
                )
            content = _read_bounded(archive, info, self.limits.maximum_asset_bytes)
            visual_asset, catalog_entry = validate_asset_catalog_promotion(
                visual_value,
                catalog_value,
                content,
            )
            if catalog_entry.get("scope") != "theme" or catalog_entry.get("theme") != theme_id:
                raise RuntimeServiceError(
                    "theme_package_asset_scope_invalid",
                    "Imported Theme assets must use theme scope and reference the package Theme ID.",
                )
            asset_key = (visual_asset["id"], visual_asset["version"])
            entry_key = (catalog_entry["id"], catalog_entry["version"])
            resource_path = expected_visual_asset_path(visual_asset)
            if asset_key in asset_ids or entry_key in entry_ids or resource_path.casefold() in resource_paths:
                raise RuntimeServiceError(
                    "theme_package_asset_conflict",
                    "Theme Package contains duplicate Asset Catalog identities or Resource paths.",
                )
            asset_ids.add(asset_key)
            entry_ids.add(entry_key)
            resource_paths.add(resource_path.casefold())
            promotions.append(
                _AssetPromotion(
                    visual_asset=visual_asset,
                    catalog_entry=catalog_entry,
                    content=content,
                    resource_path=resource_path,
                    final_path=self._resolve_resource(resource_path),
                )
            )
        return promotions

    def _validate_expected_paths(
        self,
        entries: dict[str, zipfile.ZipInfo],
        promotions: list[_AssetPromotion],
    ) -> None:
        allowed = {
            THEME_PACKAGE_DESCRIPTOR_PATH,
            THEME_MANIFEST_PATH,
            *(promotion.resource_path for promotion in promotions),
        }
        unexpected = sorted(set(entries) - allowed)
        if unexpected:
            root_manifests = [path for path in unexpected if PurePosixPath(path).name == THEME_MANIFEST_PATH]
            if root_manifests:
                raise RuntimeServiceError(
                    "theme_package_manifest_conflict",
                    "Theme Package contains multiple competing Theme Manifest files.",
                )
            raise RuntimeServiceError(
                "theme_package_unexpected_file",
                f'Theme Package contains an undeclared file: "{unexpected[0]}".',
            )

    def _resolve_resource(self, resource_path: str) -> Path:
        root = self._resource_root.resolve()
        candidate = (root / Path(resource_path)).resolve()
        if candidate == root or root not in candidate.parents:
            raise RuntimeServiceError(
                "asset_path_escape",
                "Theme Package Asset Resource path escaped the Runtime Resource root.",
            )
        return candidate

    def _install(
        self,
        record: dict[str, JSONValue],
        promotions: list[_AssetPromotion],
    ) -> tuple[int, int]:
        self._classify_existing_assets(promotions)
        new_promotions = [promotion for promotion in promotions if not promotion.reused]
        for promotion in new_promotions:
            promotion.staged_path = self._stage_resource(promotion)

        installed_at = datetime.now(UTC)
        finalized: list[Path] = []
        try:
            with self._persistence.connect() as connection:
                connection.execute("BEGIN")
                self._package_repository.insert(record, installed_at, connection)
                for promotion in new_promotions:
                    self._asset_catalog.insert_promotion(
                        promotion.visual_asset,
                        promotion.catalog_entry,
                        promotion.resource_path,
                        installed_at,
                        connection,
                    )
                for promotion in new_promotions:
                    if promotion.staged_path is None:
                        continue
                    os.replace(promotion.staged_path, promotion.final_path)
                    promotion.staged_path = None
                    finalized.append(promotion.final_path)
                connection.commit()
        except sqlite3.IntegrityError as error:
            for path in finalized:
                path.unlink(missing_ok=True)
            raise RuntimeServiceError(
                "theme_package_conflict",
                "Theme Package or one of its Asset Catalog identities is already installed.",
            ) from error
        except sqlite3.Error as error:
            for path in finalized:
                path.unlink(missing_ok=True)
            raise RuntimeServiceError(
                "theme_package_storage_failed",
                "Theme Package metadata could not be committed; no package was installed.",
            ) from error
        except OSError as error:
            for path in finalized:
                path.unlink(missing_ok=True)
            raise RuntimeServiceError(
                "theme_package_storage_failed",
                "Theme Package Resources could not be installed; no package was committed.",
            ) from error
        finally:
            for promotion in new_promotions:
                if promotion.staged_path is not None:
                    promotion.staged_path.unlink(missing_ok=True)
        return len(new_promotions), len(promotions) - len(new_promotions)

    def _classify_existing_assets(self, promotions: list[_AssetPromotion]) -> None:
        for promotion in promotions:
            visual = promotion.visual_asset
            catalog = promotion.catalog_entry
            existing_visual = self._asset_catalog.get_visual_asset(
                str(visual["id"]),
                str(visual["version"]),
            )
            existing_catalog = self._asset_catalog.get_catalog_entry(
                str(catalog["id"]),
                str(catalog["version"]),
            )
            if existing_visual is None and existing_catalog is None:
                if promotion.final_path.exists() and _file_hash(promotion.final_path) != visual["sha256"]:
                    raise RuntimeServiceError(
                        "resource_conflict",
                        "Canonical Theme asset path already contains different bytes.",
                    )
                continue
            if (
                existing_visual is None
                or existing_catalog is None
                or existing_visual.get("visualAsset") != visual
                or existing_visual.get("resourcePath") != promotion.resource_path
                or existing_catalog.get("visualAsset") != visual
                or existing_catalog.get("catalogEntry") != catalog
                or existing_catalog.get("resourcePath") != promotion.resource_path
                or not promotion.final_path.is_file()
                or _file_hash(promotion.final_path) != visual["sha256"]
            ):
                raise RuntimeServiceError(
                    "theme_package_asset_conflict",
                    "Existing Asset Catalog identity does not match the Theme Package declaration.",
                )
            promotion.reused = True

    @staticmethod
    def _stage_resource(promotion: _AssetPromotion) -> Path | None:
        if promotion.final_path.exists():
            return None
        promotion.final_path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary_name = tempfile.mkstemp(
            prefix=f".{promotion.final_path.name}.",
            dir=promotion.final_path.parent,
        )
        path = Path(temporary_name)
        try:
            with os.fdopen(descriptor, "wb") as stream:
                stream.write(promotion.content)
                stream.flush()
                os.fsync(stream.fileno())
        except Exception:
            path.unlink(missing_ok=True)
            raise
        return path


def _validate_descriptor(
    value: dict[str, JSONValue],
) -> tuple[str, str, dict[str, str], list[dict[str, JSONValue]]]:
    if set(value) != {"schemaVersion", "packageId", "packageVersion", "manifest", "assets"}:
        raise RuntimeServiceError(
            "theme_package_descriptor_invalid",
            "Theme Package descriptor has missing or unsupported fields.",
        )
    if value["schemaVersion"] != 1:
        raise RuntimeServiceError(
            "theme_package_contract_unsupported",
            "Theme Package descriptor schemaVersion is not supported.",
        )
    package_id = _namespaced_id(value["packageId"], "packageId")
    package_version = _semver(value["packageVersion"], "packageVersion")
    manifest_value = value["manifest"]
    if not isinstance(manifest_value, dict) or set(manifest_value) != {"path", "sha256"}:
        raise RuntimeServiceError(
            "theme_package_descriptor_invalid",
            "Theme Package manifest reference requires path and sha256.",
        )
    manifest_path = _string(manifest_value["path"], "manifest.path")
    manifest_digest = _digest(manifest_value["sha256"], "manifest.sha256")
    assets_value = value["assets"]
    if not isinstance(assets_value, list) or any(not isinstance(item, dict) for item in assets_value):
        raise RuntimeServiceError(
            "theme_package_descriptor_invalid",
            "Theme Package assets must be an array of declaration objects.",
        )
    return (
        package_id,
        package_version,
        {"path": manifest_path, "sha256": manifest_digest},
        assets_value,
    )


def _validate_theme_manifest(value: dict[str, JSONValue]) -> None:
    required = {
        "schemaVersion",
        "themeId",
        "version",
        "displayName",
        "packageKind",
        "compatibility",
        "groups",
        "packRefs",
        "tokens",
        "systemTerms",
    }
    optional = {
        "$schema",
        "description",
        "defaultCompositionRef",
        "dependencies",
        "author",
        "license",
        "metadata",
    }
    _strict_fields(value, required, optional, "Theme Manifest")
    if "$schema" in value:
        _bounded_string(value["$schema"], "$schema", 2000)
    if value["schemaVersion"] != 1:
        raise RuntimeServiceError(
            "theme_package_contract_unsupported",
            "Theme Manifest schemaVersion is not supported.",
        )
    _namespaced_id(value["themeId"], "themeId")
    _semver(value["version"], "version")
    _bounded_string(value["displayName"], "displayName", 120)
    if "description" in value:
        _bounded_string(value["description"], "description", 2000)
    if value["packageKind"] != "full-theme":
        raise RuntimeServiceError(
            "theme_package_kind_unsupported",
            "Theme Package import currently accepts full-theme manifests only.",
        )
    compatibility = _object(value["compatibility"], "compatibility")
    _strict_fields(compatibility, {"themeEngine"}, {"cosmos"}, "compatibility")
    if not _version_satisfies(THEME_ENGINE_VERSION, _string(compatibility["themeEngine"], "themeEngine")):
        raise RuntimeServiceError(
            "theme_package_incompatible",
            f"Theme Package is incompatible with Theme Engine {THEME_ENGINE_VERSION}.",
        )
    if "cosmos" in compatibility and not _version_satisfies(
        COSMOS_VERSION,
        _string(compatibility["cosmos"], "cosmos"),
    ):
        raise RuntimeServiceError(
            "theme_package_incompatible",
            f"Theme Package is incompatible with Cosmos {COSMOS_VERSION}.",
        )
    groups = value["groups"]
    if (
        not isinstance(groups, list)
        or not groups
        or any(group not in _PRESENTATION_GROUPS for group in groups)
        or len(set(groups)) != len(groups)
        or not _REQUIRED_GROUPS.issubset(groups)
    ):
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            "Full Theme Manifest must declare every required presentation group exactly once.",
        )
    _versioned_refs(value["packRefs"], "packRefs")
    if "defaultCompositionRef" not in value:
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            "Full Theme Manifest requires defaultCompositionRef.",
        )
    _versioned_ref(value["defaultCompositionRef"], "defaultCompositionRef")
    _dependencies(value.get("dependencies", []))
    _tokens(value["tokens"])
    _system_terms(value["systemTerms"])
    if "author" in value:
        author = _object(value["author"], "author")
        _strict_fields(author, {"name"}, {"url"}, "author")
        _bounded_string(author["name"], "author.name", 120)
        if "url" in author:
            _bounded_string(author["url"], "author.url", 2000)
    if "license" in value:
        _bounded_string(value["license"], "license", 200)
    if "metadata" in value:
        metadata = _object(value["metadata"], "metadata")
        _strict_fields(metadata, set(), {"createdAt", "updatedAt", "keywords"}, "metadata")
        for field in ("createdAt", "updatedAt"):
            if field in metadata:
                timestamp = _bounded_string(metadata[field], f"metadata.{field}", 100)
                try:
                    datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
                except ValueError as error:
                    raise RuntimeServiceError(
                        "theme_package_manifest_invalid",
                        f"metadata.{field} must be an ISO 8601 date-time.",
                    ) from error
        if "keywords" in metadata:
            keywords = metadata["keywords"]
            if (
                not isinstance(keywords, list)
                or len(keywords) > 32
                or any(not isinstance(keyword, str) for keyword in keywords)
                or len(set(keywords)) != len(keywords)
            ):
                raise RuntimeServiceError(
                    "theme_package_manifest_invalid",
                    "metadata.keywords must contain at most 32 unique strings.",
                )
            for index, keyword in enumerate(keywords):
                text = _bounded_string(keyword, f"metadata.keywords[{index}]", 40)
                if not text.strip():
                    raise RuntimeServiceError(
                        "theme_package_manifest_invalid",
                        f"metadata.keywords[{index}] must not be empty.",
                    )
    _reject_executable_content(value)


def _tokens(value: JSONValue) -> None:
    tokens = _object(value, "tokens")
    for token_id, token_value in tokens.items():
        _namespaced_id(token_id, "token ID")
        token = _object(token_value, f"tokens.{token_id}")
        _strict_fields(token, {"type", "value"}, {"description"}, f"tokens.{token_id}")
        token_type = token["type"]
        if token_type not in _TOKEN_TYPES:
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f'Theme token "{token_id}" has an unsupported type.',
            )
        typed_value = token["value"]
        if token_type in {"number", "opacity"}:
            if isinstance(typed_value, bool) or not isinstance(typed_value, (int, float)):
                raise RuntimeServiceError(
                    "theme_package_manifest_invalid",
                    f'Theme token "{token_id}" requires a numeric value.',
                )
        elif token_type == "boolean":
            if not isinstance(typed_value, bool):
                raise RuntimeServiceError(
                    "theme_package_manifest_invalid",
                    f'Theme token "{token_id}" requires a boolean value.',
                )
        elif not isinstance(typed_value, str) or len(typed_value) > 1000:
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f'Theme token "{token_id}" requires a bounded string value.',
            )
        if "description" in token:
            _bounded_string(token["description"], f"tokens.{token_id}.description", 500)


def _system_terms(value: JSONValue) -> None:
    terms = _object(value, "systemTerms")
    for key, translations_value in terms.items():
        if not key.startswith("system.") or _ID.fullmatch(key) is None:
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f'Invalid system term key "{key}".',
            )
        translations = _object(translations_value, f"systemTerms.{key}")
        if not translations:
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f'System term "{key}" requires at least one locale.',
            )
        for locale, translation in translations.items():
            if re.fullmatch(r"[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*", locale) is None:
                raise RuntimeServiceError(
                    "theme_package_manifest_invalid",
                    f'System term "{key}" has an invalid locale.',
                )
            _bounded_string(translation, f"systemTerms.{key}.{locale}", 200)


def _dependencies(value: JSONValue) -> None:
    if not isinstance(value, list):
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            "dependencies must be an array.",
        )
    for index, dependency_value in enumerate(value):
        dependency = _object(dependency_value, f"dependencies[{index}]")
        _strict_fields(
            dependency,
            {"id", "versionRange", "kind"},
            {"optional"},
            f"dependencies[{index}]",
        )
        _namespaced_id(dependency["id"], f"dependencies[{index}].id")
        _version_range(dependency["versionRange"], f"dependencies[{index}].versionRange")
        if dependency["kind"] not in {
            "theme",
            "skin-pack",
            "template-pack",
            "renderer-pack",
        }:
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f"dependencies[{index}].kind is invalid.",
            )
        if "optional" in dependency and not isinstance(dependency["optional"], bool):
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f"dependencies[{index}].optional must be boolean.",
            )


def _versioned_refs(value: JSONValue, field: str) -> None:
    if not isinstance(value, list):
        raise RuntimeServiceError("theme_package_manifest_invalid", f"{field} must be an array.")
    seen: set[tuple[str, str]] = set()
    for index, item in enumerate(value):
        reference = _versioned_ref(item, f"{field}[{index}]")
        pair = (reference["id"], reference["versionRange"])
        if pair in seen:
            raise RuntimeServiceError(
                "theme_package_manifest_invalid",
                f"{field} must not contain duplicate references.",
            )
        seen.add(pair)


def _versioned_ref(value: JSONValue, field: str) -> dict[str, str]:
    reference = _object(value, field)
    _strict_fields(reference, {"id", "versionRange"}, set(), field)
    return {
        "id": _namespaced_id(reference["id"], f"{field}.id"),
        "versionRange": _version_range(reference["versionRange"], f"{field}.versionRange"),
    }


def _version_satisfies(version: str, range_value: str) -> bool:
    normalized = range_value.strip()
    if normalized in {"*", "latest"}:
        return True
    operator = normalized[0] if normalized[:1] in {"^", "~"} else ""
    candidate = normalized[1:] if operator else normalized
    parsed_version = _parse_version(version)
    parsed_candidate = _parse_version(candidate)
    if parsed_version is None or parsed_candidate is None or parsed_version < parsed_candidate:
        return False
    if not operator:
        return parsed_version == parsed_candidate
    if operator == "~":
        return parsed_version[:2] == parsed_candidate[:2]
    if parsed_candidate[0] > 0:
        return parsed_version[0] == parsed_candidate[0]
    if parsed_candidate[1] > 0:
        return parsed_version[:2] == parsed_candidate[:2]
    return parsed_version == parsed_candidate


def _parse_version(value: str) -> tuple[int, int, int] | None:
    match = _SEMVER.fullmatch(value)
    if match is None:
        return None
    return int(match[1]), int(match[2]), int(match[3])


def _version_range(value: JSONValue, field: str) -> str:
    text = _string(value, field)
    normalized = text.strip()
    candidate = normalized[1:] if normalized[:1] in {"^", "~"} else normalized
    if normalized not in {"*", "latest"} and _SEMVER.fullmatch(candidate) is None:
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} contains an unsupported semantic version range.",
        )
    return text


def _reject_executable_content(value: JSONValue) -> None:
    if isinstance(value, str):
        if any(pattern.search(value) for pattern in _FORBIDDEN_TEXT):
            raise RuntimeServiceError(
                "theme_package_executable_content",
                "Theme Manifest contains executable or active content.",
            )
        return
    if isinstance(value, list):
        for entry in value:
            _reject_executable_content(entry)
        return
    if isinstance(value, dict):
        for key, entry in value.items():
            normalized = key.replace("-", "").replace("_", "").replace(".", "").lower()
            if normalized in _FORBIDDEN_KEYS:
                raise RuntimeServiceError(
                    "theme_package_executable_content",
                    "Theme Manifest contains a forbidden executable property.",
                )
            _reject_executable_content(entry)


def _validate_archive_path(value: str, directory: bool) -> str:
    if not value or "\x00" in value or "\\" in value:
        raise RuntimeServiceError(
            "theme_package_path_invalid",
            "Theme Package entry path is invalid.",
        )
    normalized = value[:-1] if directory and value.endswith("/") else value
    path = PurePosixPath(normalized)
    if (
        not normalized
        or normalized.startswith("/")
        or re.match(r"^[A-Za-z]:", normalized)
        or "://" in normalized
        or "?" in normalized
        or "#" in normalized
        or any(part in {"", ".", ".."} for part in path.parts)
        or path.as_posix() != normalized
    ):
        raise RuntimeServiceError(
            "theme_package_path_invalid",
            f'Theme Package entry path "{value}" is not a safe relative path.',
        )
    return f"{normalized}/" if directory else normalized


def _validate_zip_entry_type(info: zipfile.ZipInfo) -> None:
    mode = (info.external_attr >> 16) & 0xFFFF
    entry_type = stat.S_IFMT(mode)
    if entry_type and entry_type not in {stat.S_IFREG, stat.S_IFDIR}:
        raise RuntimeServiceError(
            "theme_package_link_forbidden",
            f'Theme Package entry "{info.filename}" is a link or unsupported filesystem object.',
        )


def _read_bounded(archive: zipfile.ZipFile, info: zipfile.ZipInfo, maximum: int) -> bytes:
    with archive.open(info) as stream:
        content = stream.read(maximum + 1)
        if len(content) > maximum or stream.read(1):
            raise RuntimeServiceError(
                "theme_package_entry_too_large",
                f'Theme Package entry "{info.filename}" exceeds its intake limit.',
            )
    if len(content) != info.file_size:
        raise RuntimeServiceError(
            "theme_package_archive_invalid",
            f'Theme Package entry "{info.filename}" size does not match its archive metadata.',
        )
    return content


def _unique_json_object(pairs: list[tuple[str, JSONValue]]) -> dict[str, JSONValue]:
    result: dict[str, JSONValue] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate JSON property: {key}")
        result[key] = value
    return result


def _strict_fields(
    value: dict[str, JSONValue],
    required: set[str],
    optional: set[str],
    field: str,
) -> None:
    missing = required - value.keys()
    unknown = value.keys() - required - optional
    if missing or unknown:
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} has missing or unsupported fields.",
        )


def _object(value: object, field: str) -> dict[str, JSONValue]:
    if not isinstance(value, dict) or any(not isinstance(key, str) for key in value):
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} must be an object.",
        )
    return value


def _required_string(value: dict[str, JSONValue], key: str, field: str) -> str:
    return _string(value.get(key), f"{field}.{key}")


def _namespaced_id(value: object, field: str) -> str:
    text = _string(value, field)
    if len(text) > 200 or _ID.fullmatch(text) is None:
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} must be a namespaced identifier.",
        )
    return text


def _semver(value: object, field: str) -> str:
    text = _string(value, field)
    if _SEMVER.fullmatch(text) is None:
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} must be a semantic version.",
        )
    return text


def _digest(value: object, field: str) -> str:
    text = _string(value, field)
    if _DIGEST.fullmatch(text) is None:
        raise RuntimeServiceError(
            "theme_package_integrity_failed",
            f"{field} must be a lower-case SHA-256 digest.",
        )
    return text


def _bounded_string(value: object, field: str, maximum: int) -> str:
    text = _string(value, field)
    if len(text) > maximum:
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} exceeds {maximum} characters.",
        )
    return text


def _string(value: object, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise RuntimeServiceError(
            "theme_package_manifest_invalid",
            f"{field} must be a non-empty string.",
        )
    return value


def _file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()
