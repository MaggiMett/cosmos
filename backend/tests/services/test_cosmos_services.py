from datetime import UTC, datetime
from pathlib import Path

from cosmos.bootstrap import CosmosRuntime
from cosmos.config import RuntimeSettings
from cosmos.domain import ObjectIdentity
from cosmos.runtime import RuntimeContext
from cosmos.services import PREPARED_AREAS, CreateObjectCommand, CreateProjectCommand


def owner_context() -> RuntimeContext:
    return RuntimeContext(
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


def test_startup_creates_only_documented_system_projects_and_physical_prepared_structures(
    tmp_path: Path,
) -> None:
    runtime = CosmosRuntime.build(RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0))
    runtime.initialize()

    projects = runtime.objects.list(owner_context(), system_tag="Project")

    assert [project.identity.display_name for project in projects] == [
        "Knowledge Workspace",
        "Creation Workspace",
        "Graphics Workspace",
    ]
    assert all(project.system_tags == {"Node", "Project", "ProjectRoot", "System"} for project in projects)
    for project in projects:
        prepared = runtime.projects.prepared_structures(project.identity.object_id, owner_context())
        assert set(prepared) == set(PREPARED_AREAS)
        assert all(path.is_dir() for path in prepared.values())

    user_project = runtime.projects.create(
        CreateProjectCommand(
            display_name="A New World",
            description="A prepared user Project.",
            vision="Create a coherent new world.",
            color="#34d399",
            x=1400.0,
            y=220.0,
        ),
        owner_context(),
    )
    assert user_project.system_tags == {"Node", "Project", "ProjectRoot"}
    assert all(
        path.is_dir()
        for path in runtime.projects.prepared_structures(
            user_project.identity.object_id, owner_context()
        ).values()
    )


def test_nodes_relationships_camera_and_companion_share_runtime_contracts(tmp_path: Path) -> None:
    runtime = CosmosRuntime.build(RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0))
    runtime.initialize()
    context = owner_context()
    project = runtime.objects.list(context, system_tag="Project")[0]
    child = runtime.objects.create(
        CreateObjectCommand(
            identity=ObjectIdentity(
                object_id="cosmos.object.test-node",
                display_name="Test Node",
                description="A service integration node.",
                creator="cosmos.test",
                lifecycle_state="active",
                created_at=datetime.now(UTC),
            ),
            system_tags=frozenset({"Node"}),
            properties={
                "position_x": -540.0,
                "position_y": 30.0,
                "parent_object_id": project.identity.object_id,
                "hierarchy_level": "Object",
                "skin": "Star",
            },
            primary_project_id=project.identity.object_id,
        ),
        context,
    )
    relationship = runtime.relationships.create_related(
        project.identity.object_id,
        project.identity.object_id,
        child.identity.object_id,
        context,
    )

    moved = runtime.cosmos_map.move_node(child.identity.object_id, -510.0, 60.0, context)
    camera = runtime.cosmos_map.update_camera(-720.0, -80.0, 1.0, context)
    snapshot = runtime.cosmos_map.snapshot(context)

    assert moved.properties["position_x"] == -510.0
    assert camera == {"x": -720.0, "y": -80.0, "zoom": 1.0}
    assert snapshot["focusedProjectId"] == project.identity.object_id
    assert {connection["provenance"] for connection in snapshot["connections"]} == {
        "structural",
        "semantic",
    }
    assert any(
        connection["relationshipId"] == relationship.relationship_id for connection in snapshot["connections"]
    )
    assert snapshot["companion"]["systemTags"] == ["Companion", "Entity", "System"]
    assert runtime.companion.reply(
        "Where am I?",
        RuntimeContext(
            project_scope_ids=(project.identity.object_id,),
            focused_project_id=project.identity.object_id,
        ),
    ).message.startswith("You are focused")


def test_base_uses_tagged_rooms_slots_workspaces_cockpit_companion_and_pet(tmp_path: Path) -> None:
    runtime = CosmosRuntime.build(RuntimeSettings(runtime_path=tmp_path / "Runtime", port=0))
    runtime.initialize()

    snapshot = runtime.base.snapshot(owner_context())

    assert snapshot["base"]["systemTags"] == ["Base", "System"]
    assert [(room["slug"], len(room["workspaceSlots"])) for room in snapshot["rooms"]] == [
        ("main", 2),
        ("workshop", 4),
    ]
    assert all(slot["workspace"] is not None for slot in snapshot["rooms"][0]["workspaceSlots"])
    assert all(slot["workspace"] is None for slot in snapshot["rooms"][1]["workspaceSlots"])
    assert [workspace["displayName"] for workspace in snapshot["unassignedWorkspaces"]] == [
        "Graphics Workspace"
    ]
    assert snapshot["cockpit"]["roomId"] == "cosmos.room.main"
    assert snapshot["door"]["roomAId"] == "cosmos.room.main"
    assert snapshot["door"]["roomBId"] == "cosmos.room.workshop"
    assert snapshot["companion"]["objectId"] == "cosmos.entity.companion.default"
    assert snapshot["pet"]["systemTags"] == ["Entity", "Pet", "System"]
