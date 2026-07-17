from cosmos.domain import ObjectContract, PropertyDefinition, PropertyKind, PropertySchema


def create_version_one_object_contract() -> ObjectContract:
    contract = ObjectContract()
    contract.register_system_tag(
        "Project",
        PropertySchema(
            "cosmos.schema.project",
            1,
            (
                PropertyDefinition("vision", PropertyKind.STRING, ""),
                PropertyDefinition("project_color", PropertyKind.STRING, "#8b5cf6"),
            ),
        ),
    )
    contract.register_system_tag(
        "Node",
        PropertySchema(
            "cosmos.schema.node",
            1,
            (
                PropertyDefinition("position_x", PropertyKind.NUMBER, 0.0),
                PropertyDefinition("position_y", PropertyKind.NUMBER, 0.0),
                PropertyDefinition("parent_object_id", PropertyKind.STRING, ""),
                PropertyDefinition("hierarchy_level", PropertyKind.STRING, "Object"),
                PropertyDefinition("skin", PropertyKind.STRING, "Star"),
            ),
        ),
    )
    contract.register_system_tag("ProjectRoot")
    contract.register_system_tag("Domain")
    contract.register_system_tag("Cluster")
    contract.register_system_tag("Detail")
    contract.register_system_tag("System")
    contract.register_system_tag(
        "Entity",
        PropertySchema(
            "cosmos.schema.entity",
            1,
            (
                PropertyDefinition("runtime_scope", PropertyKind.STRING, "Global"),
                PropertyDefinition("avatar_id", PropertyKind.STRING, "cosmos.avatar.companion.astronaut"),
                PropertyDefinition("behaviour_profile_id", PropertyKind.STRING, "cosmos.behaviour.calm"),
                PropertyDefinition("runtime_state", PropertyKind.STRING, "Idle"),
                PropertyDefinition("visible", PropertyKind.BOOLEAN, True),
            ),
        ),
    )
    contract.register_system_tag(
        "Companion",
        PropertySchema(
            "cosmos.schema.companion",
            1,
            (
                PropertyDefinition(
                    "personality_profile_id", PropertyKind.STRING, "cosmos.personality.default"
                ),
                PropertyDefinition("notification_available", PropertyKind.BOOLEAN, False),
            ),
        ),
    )
    contract.register_system_tag(
        "Base",
        PropertySchema(
            "cosmos.schema.base",
            1,
            (PropertyDefinition("main_room_id", PropertyKind.STRING, ""),),
        ),
    )
    contract.register_system_tag(
        "Room",
        PropertySchema(
            "cosmos.schema.room",
            1,
            (
                PropertyDefinition("base_object_id", PropertyKind.STRING, ""),
                PropertyDefinition("room_slug", PropertyKind.STRING, ""),
                PropertyDefinition("room_order", PropertyKind.INTEGER, 0),
                PropertyDefinition("atmosphere", PropertyKind.STRING, "Calm"),
            ),
        ),
    )
    contract.register_system_tag(
        "Door",
        PropertySchema(
            "cosmos.schema.door",
            1,
            (
                PropertyDefinition("base_object_id", PropertyKind.STRING, ""),
                PropertyDefinition("room_a_id", PropertyKind.STRING, ""),
                PropertyDefinition("room_b_id", PropertyKind.STRING, ""),
            ),
        ),
    )
    contract.register_system_tag(
        "Cockpit",
        PropertySchema(
            "cosmos.schema.cockpit",
            1,
            (
                PropertyDefinition("base_object_id", PropertyKind.STRING, ""),
                PropertyDefinition("room_id", PropertyKind.STRING, ""),
            ),
        ),
    )
    contract.register_system_tag(
        "Workspace",
        PropertySchema(
            "cosmos.schema.workspace",
            1,
            (
                PropertyDefinition("icon", PropertyKind.STRING, "Workspace"),
                PropertyDefinition("overlay", PropertyKind.STRING, "Desk"),
                PropertyDefinition("default_layout", PropertyKind.OBJECT, {}),
                PropertyDefinition("context_configuration", PropertyKind.OBJECT, {}),
                PropertyDefinition("assigned_tool_ids", PropertyKind.ARRAY, []),
                PropertyDefinition("theme_override", PropertyKind.STRING, ""),
                PropertyDefinition("source_project_id", PropertyKind.STRING, ""),
            ),
        ),
    )
    contract.register_system_tag(
        "WorkspaceSlot",
        PropertySchema(
            "cosmos.schema.workspace-slot",
            1,
            (
                PropertyDefinition("room_id", PropertyKind.STRING, ""),
                PropertyDefinition("workspace_definition_id", PropertyKind.STRING, ""),
                PropertyDefinition("placement", PropertyKind.STRING, ""),
                PropertyDefinition("slot_skin", PropertyKind.STRING, "Workbench"),
            ),
        ),
    )
    contract.register_system_tag(
        "Pet",
        PropertySchema(
            "cosmos.schema.pet",
            1,
            (PropertyDefinition("base_object_id", PropertyKind.STRING, ""),),
        ),
    )
    return contract
