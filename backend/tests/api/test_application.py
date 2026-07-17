from pathlib import Path

from starlette.testclient import TestClient

from cosmos.api import create_app
from cosmos.config import RuntimeSettings


def test_foundation_api_health_and_readiness(tmp_path: Path) -> None:
    settings = RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0)

    with TestClient(create_app(settings)) as client:
        health = client.get("/health")
        readiness = client.get("/ready")

    assert health.status_code == 200
    assert health.json() == {"service": "cosmos", "status": "ok", "version": "0.1.0"}
    assert readiness.status_code == 200
    assert readiness.json() == {"service": "cosmos", "status": "ready"}
    assert settings.database_path.exists()
