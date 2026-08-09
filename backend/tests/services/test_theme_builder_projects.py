import sqlite3
from pathlib import Path

from starlette.testclient import TestClient

from cosmos.api import create_app
from cosmos.config import RuntimeSettings


def test_theme_builder_project_persists_real_empty_draft_across_restart(tmp_path: Path) -> None:
    settings = RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0)
    with TestClient(create_app(settings)) as client:
        created = client.post(
            "/theme-builder/projects",
            json={"name": "Quiet Orbit", "description": "A real draft.", "author": "Max"},
        )
        project = created.json()
        listed = client.get("/theme-builder/projects").json()["items"]

    with TestClient(create_app(settings)) as restarted:
        restored = restarted.get(f"/theme-builder/projects/{project['builderProjectId']}")

    assert created.status_code == 201
    assert project["builderProjectId"].startswith("user.theme-builder-project.")
    assert project["themeId"].startswith("user.theme.")
    assert project["packageId"].startswith("user.theme-package.")
    assert project["revision"] == 1
    assert project["artifacts"] == {"skinPacks": [], "roomShells": [], "catalogObjects": []}
    assert project["assetRefs"] == []
    assert listed == [project]
    assert restored.status_code == 200
    assert restored.json() == project


def test_metadata_save_is_revisioned_atomic_and_does_not_install_a_theme(tmp_path: Path) -> None:
    settings = RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0)
    with TestClient(create_app(settings)) as client:
        project = _create(client)
        saved = client.put(
            f"/theme-builder/projects/{project['builderProjectId']}",
            json={
                "expectedRevision": 1,
                "metadata": {
                    "name": "Revised Orbit",
                    "description": "Still a draft.",
                    "author": "Cosmos Team",
                },
            },
        )
        packages = client.get("/theme-packages")

    assert saved.status_code == 200
    document = saved.json()
    assert document["revision"] == 2
    assert document["name"] == "Revised Orbit"
    assert document["manifestDraft"]["displayName"] == "Revised Orbit"
    assert document["manifestDraft"]["author"] == {"name": "Cosmos Team"}
    assert packages.json() == {"items": []}


def test_stale_revision_conflict_never_overwrites_authoritative_document(tmp_path: Path) -> None:
    settings = RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0)
    with TestClient(create_app(settings)) as client:
        project = _create(client)
        path = f"/theme-builder/projects/{project['builderProjectId']}"
        first = client.put(
            path,
            json={"expectedRevision": 1, "metadata": {"name": "First", "description": "", "author": ""}},
        )
        stale = client.put(
            path,
            json={"expectedRevision": 1, "metadata": {"name": "Stale", "description": "", "author": ""}},
        )
        authoritative = client.get(path)

    assert first.status_code == 200
    assert stale.status_code == 409
    assert stale.json()["code"] == "theme_builder_project_revision_conflict"
    assert authoritative.json()["revision"] == 2
    assert authoritative.json()["name"] == "First"


def test_builder_foundation_reuses_normalized_object_tables(tmp_path: Path) -> None:
    settings = RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0)
    with TestClient(create_app(settings)) as client:
        _create(client)
    with sqlite3.connect(settings.database_path) as connection:
        tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")}
        record = connection.execute(
            "SELECT object_id FROM objects WHERE object_id LIKE 'user.theme-builder-project.%'"
        ).fetchone()

    assert record is not None
    assert "theme_builder_projects" not in tables
    assert "theme_builder_drafts" not in tables


def _create(client: TestClient) -> dict:
    response = client.post(
        "/theme-builder/projects",
        json={"name": "Orbit", "description": "", "author": ""},
    )
    assert response.status_code == 201
    return response.json()
