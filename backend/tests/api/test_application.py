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


def test_cosmos_map_api_restores_state_and_handles_companion_without_ai(tmp_path: Path) -> None:
    settings = RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0)

    with TestClient(create_app(settings)) as client:
        initial = client.get("/cosmos/map")
        camera = client.put("/cosmos/camera", json={"x": 0, "y": 140, "zoom": 1})
        focused = client.get("/cosmos/map")
        companion = client.post("/companion/messages", json={"message": "Hello"})
        invalid = client.put("/cosmos/camera", json={"x": 0, "y": 0, "zoom": 9})

    assert initial.status_code == 200
    assert len(initial.json()["projects"]) == 3
    assert camera.json() == {"x": 0.0, "y": 140.0, "zoom": 1.0}
    assert focused.json()["focusedProjectId"] == "cosmos.project.system.creation"
    assert companion.json() == {
        "message": "Hello. I'm here with you in Cosmos.",
        "mode": "deterministic",
    }
    assert invalid.status_code == 422
    assert invalid.json()["code"] == "validation_failed"
