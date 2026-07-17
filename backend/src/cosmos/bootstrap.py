from __future__ import annotations

from dataclasses import dataclass

from cosmos.config import RuntimeSettings
from cosmos.persistence import SQLitePersistence
from cosmos.runtime import EventDispatcher, ProviderRuntime, Registry


@dataclass(slots=True)
class CosmosRuntime:
    settings: RuntimeSettings
    persistence: SQLitePersistence
    registry: Registry
    events: EventDispatcher
    providers: ProviderRuntime
    initialized: bool = False

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
        self.settings.runtime_path.mkdir(parents=True, exist_ok=True)
        self.persistence.initialize()
        self.initialized = True

    def ready(self) -> bool:
        return self.initialized and self.persistence.is_ready()
