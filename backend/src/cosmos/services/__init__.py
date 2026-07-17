"""Authoritative business-service boundary.

Feature services are intentionally absent in Sprint 0. Future Commands and Queries
enter Persistence, Registries, Events, Jobs, and Providers only through this package.
"""

from cosmos.services.companion_service import COMPANION_ID, CompanionReply, CompanionService
from cosmos.services.cosmos_map_service import CosmosMapService
from cosmos.services.errors import RuntimeServiceError
from cosmos.services.object_service import CreateObjectCommand, ObjectService
from cosmos.services.project_service import PREPARED_AREAS, CreateProjectCommand, ProjectService
from cosmos.services.relationship_service import RelationshipService
from cosmos.services.schemas import create_version_one_object_contract

__all__ = [
    "COMPANION_ID",
    "PREPARED_AREAS",
    "CompanionReply",
    "CompanionService",
    "CosmosMapService",
    "CreateObjectCommand",
    "CreateProjectCommand",
    "ObjectService",
    "ProjectService",
    "RelationshipService",
    "RuntimeServiceError",
    "create_version_one_object_contract",
]
