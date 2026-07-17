from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from enum import StrEnum

from cosmos.config import RuntimeSettings
from cosmos.persistence import (
    ObjectRepository,
    RelationshipRepository,
    RuntimeStateRepository,
    SQLitePersistence,
)
from cosmos.runtime import EventDispatcher, ProviderRuntime, Registry, RuntimeContext
from cosmos.services import (
    CompanionService,
    CosmosMapService,
    ObjectService,
    ProjectService,
    RelationshipService,
    create_version_one_object_contract,
)


class StartupPhase(StrEnum):
    CREATED = "created"
    INITIALIZING_PERSISTENCE = "initializing_persistence"
    VALIDATING_RUNTIME = "validating_runtime"
    READY = "ready"
    FAILED = "failed"
    STOPPED = "stopped"


@dataclass(frozen=True, slots=True)
class StartupReport:
    phase: StartupPhase
    started_at: datetime | None = None
    completed_at: datetime | None = None
    failure: str | None = None


@dataclass(slots=True)
class CosmosRuntime:
    settings: RuntimeSettings
    persistence: SQLitePersistence
    registry: Registry
    events: EventDispatcher
    providers: ProviderRuntime
    objects: ObjectService
    projects: ProjectService
    relationships: RelationshipService
    companion: CompanionService
    cosmos_map: CosmosMapService
    startup: StartupReport = StartupReport(phase=StartupPhase.CREATED)

    @classmethod
    def build(cls, settings: RuntimeSettings) -> CosmosRuntime:
        registry = Registry()
        persistence = SQLitePersistence(settings.database_path)
        events = EventDispatcher()
        objects = ObjectService(
            create_version_one_object_contract(),
            ObjectRepository(persistence),
            events,
        )
        relationships = RelationshipService(RelationshipRepository(persistence), objects, events)
        companion = CompanionService(objects)
        return cls(
            settings=settings,
            persistence=persistence,
            registry=registry,
            events=events,
            providers=ProviderRuntime(registry),
            objects=objects,
            projects=ProjectService(settings.runtime_path, persistence, objects, events),
            relationships=relationships,
            companion=companion,
            cosmos_map=CosmosMapService(
                objects,
                relationships,
                RuntimeStateRepository(persistence),
                companion,
            ),
        )

    def initialize(self) -> None:
        if self.startup.phase is StartupPhase.READY:
            return

        started_at = datetime.now(UTC)
        try:
            self.startup = StartupReport(
                phase=StartupPhase.INITIALIZING_PERSISTENCE,
                started_at=started_at,
            )
            self.settings.runtime_path.mkdir(parents=True, exist_ok=True)
            self.persistence.initialize()

            self.startup = StartupReport(
                phase=StartupPhase.VALIDATING_RUNTIME,
                started_at=started_at,
            )
            if not self.persistence.is_ready():
                raise RuntimeError("Persistence did not become ready during startup.")

            system_context = RuntimeContext(
                permissions=frozenset(
                    {
                        "objects.read",
                        "objects.write",
                        "projects.read",
                        "projects.write",
                        "relationships.read",
                        "relationships.write",
                        "runtime_state.read",
                        "runtime_state.write",
                    }
                )
            )
            self.projects.ensure_version_one_system_projects(system_context)
            self.companion.ensure_default(system_context)

            self.startup = StartupReport(
                phase=StartupPhase.READY,
                started_at=started_at,
                completed_at=datetime.now(UTC),
            )
        except Exception as error:
            self.startup = StartupReport(
                phase=StartupPhase.FAILED,
                started_at=started_at,
                completed_at=datetime.now(UTC),
                failure=str(error),
            )
            raise

    def shutdown(self) -> None:
        self.startup = StartupReport(
            phase=StartupPhase.STOPPED,
            started_at=self.startup.started_at,
            completed_at=datetime.now(UTC),
        )

    def ready(self) -> bool:
        return self.startup.phase is StartupPhase.READY and self.persistence.is_ready()
