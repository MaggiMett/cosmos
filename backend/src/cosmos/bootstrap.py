from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime
from enum import StrEnum

from cosmos.config import RuntimeSettings
from cosmos.persistence import SQLitePersistence
from cosmos.runtime import EventDispatcher, ProviderRuntime, Registry


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
    startup: StartupReport = StartupReport(phase=StartupPhase.CREATED)

    @classmethod
    def build(cls, settings: RuntimeSettings) -> CosmosRuntime:
        registry = Registry()
        return cls(
            settings=settings,
            persistence=SQLitePersistence(settings.database_path),
            registry=registry,
            events=EventDispatcher(),
            providers=ProviderRuntime(registry),
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
