import { describe, expect, it, vi } from "vitest";

import type {
  BaseObjectSummary,
  BaseRoom,
  BaseSnapshot,
  WorkspaceSlot,
} from "../../runtime/baseRuntime";
import { loadBaseRuntimeSnapshot, projectBaseRuntimeState } from "./baseRuntimeProjection";

describe("real Base Runtime projection", () => {
  it("projects the real Main Room and preserves authoritative IDs", () => {
    const state = projectBaseRuntimeState("ready", snapshot(), null);

    expect(state.phase).toBe("success");
    if (state.phase !== "success") throw new Error("Expected Base success.");
    expect(state.currentLocation).toBe("Home Base · Central Room");
    expect(state.room.objectId).toBe("room.central.real");
    expect(state.room.baseObjectId).toBe("base.real");
    expect(state.room.atmosphere).toBe("Calm");
  });

  it("projects real occupied and empty Workspace Slots without inventing Workspaces", () => {
    const state = projectBaseRuntimeState("ready", snapshot(), null);
    if (state.phase !== "success") throw new Error("Expected Base success.");

    expect(state.room.workspaceSlots).toHaveLength(2);
    expect(state.room.workspaceSlots[0]).toMatchObject({
      slotObjectId: "slot.research.real",
      workspaceObjectId: "workspace.research.real",
      displayName: "Research Desk",
      sourceProjectId: "project.research.real",
      occupied: true,
      side: "left",
    });
    expect(state.room.workspaceSlots[1]).toMatchObject({
      slotObjectId: "slot.empty.real",
      workspaceObjectId: null,
      occupied: false,
      side: "right",
    });
  });

  it("supports a real Main Room without Workspace Slots", () => {
    const value = snapshot();
    value.rooms[0] = room("room.central.real", "Central Room", "main", []);

    const state = projectBaseRuntimeState("ready", value, null);
    expect(state.phase).toBe("success");
    if (state.phase !== "success") throw new Error("Expected Base success.");
    expect(state.room.workspaceSlots).toEqual([]);
    expect(state.room.knowledgeWorkspace).toBeNull();
    expect(state.room.creationWorkspace).toBeNull();
  });

  it("projects only the real Door and its existing Room target", () => {
    const state = projectBaseRuntimeState("ready", snapshot(), null);
    if (state.phase !== "success") throw new Error("Expected Base success.");

    expect(state.room.doorTargets).toEqual([
      {
        objectId: "door.real",
        displayName: "Studio Door",
        description: "Connects the central room and studio.",
        targetRoomId: "room.studio.real",
        targetRoomName: "Studio",
        side: "right",
      },
    ]);
    expect(state.room.rooms.map((roomValue) => roomValue.objectId)).toEqual([
      "room.central.real",
      "room.studio.real",
    ]);
  });

  it("projects a present Companion and degrades quietly when it is absent", () => {
    const present = projectBaseRuntimeState("ready", snapshot(), null);
    if (present.phase !== "success") throw new Error("Expected Base success.");
    expect(present.room.companion).toMatchObject({
      objectId: "companion.real",
      displayName: "Guide",
      notificationAvailable: true,
    });

    const { companion: _companion, ...missing } = snapshot();
    const absent = projectBaseRuntimeState("ready", missing as BaseSnapshot, null);
    if (absent.phase !== "success") throw new Error("Expected Base success.");
    expect(absent.room.companion).toBeNull();
  });

  it("returns a quiet Empty state for a Base without Rooms or Main Room", () => {
    const noRooms = snapshot();
    noRooms.rooms = [];
    expect(projectBaseRuntimeState("ready", noRooms, null)).toMatchObject({
      phase: "empty",
      message: "No rooms are available in Base.",
    });

    const noMain = snapshot();
    noMain.rooms = [room("room.studio.real", "Studio", "workshop", [])];
    expect(projectBaseRuntimeState("ready", noMain, null)).toMatchObject({
      phase: "empty",
      message: "Main Room is not available.",
    });
  });

  it("preserves Loading and Error states without fallback data", () => {
    expect(projectBaseRuntimeState("loading", null, null)).toEqual({
      phase: "loading",
      roomCount: 0,
      currentLocation: "Base",
    });
    expect(projectBaseRuntimeState("failed", null, "Base service offline")).toEqual({
      phase: "error",
      roomCount: 0,
      currentLocation: "Base",
      message: "Base service offline",
    });
  });

  it("loads exclusively through the existing read-only BaseRuntime load path", async () => {
    const runtime = { load: vi.fn().mockResolvedValue(undefined) };

    await expect(loadBaseRuntimeSnapshot(runtime)).resolves.toBeUndefined();
    expect(runtime.load).toHaveBeenCalledOnce();
    expect(Object.keys(runtime)).toEqual(["load"]);
  });
});

function snapshot(): BaseSnapshot {
  const researchSlot: WorkspaceSlot = {
    ...summary("slot.research.real", "Research Slot", ["WorkspaceSlot"]),
    placement: "rear_left",
    skin: "ResearchSurface",
    workspace: {
      ...summary("workspace.research.real", "Research Desk", ["Workspace"]),
      description: "A real research Workspace.",
      icon: "Knowledge",
      overlay: "ResearchOverlay",
      sourceProjectId: "project.research.real",
    },
  };
  const emptySlot: WorkspaceSlot = {
    ...summary("slot.empty.real", "Unassigned Slot", ["WorkspaceSlot"]),
    placement: "rear_right",
    skin: "EmptySurface",
    workspace: null,
  };
  return {
    base: summary("base.real", "Home Base", ["Base"]),
    rooms: [
      room("room.central.real", "Central Room", "main", [researchSlot, emptySlot]),
      room("room.studio.real", "Studio", "workshop", []),
    ],
    door: {
      ...summary("door.real", "Studio Door", ["Door"]),
      description: "Connects the central room and studio.",
      roomAId: "room.central.real",
      roomBId: "room.studio.real",
    },
    cockpit: {
      ...summary("cockpit.real", "Flight Deck", ["Cockpit"]),
      roomId: "room.central.real",
    },
    companion: {
      ...summary("companion.real", "Guide", ["Companion"]),
      description: "A real Base companion.",
      notificationAvailable: true,
    },
    pet: summary("pet.real", "Resident", ["Pet"]),
    unassignedWorkspaces: [],
  };
}

function room(
  objectId: string,
  displayName: string,
  slug: BaseRoom["slug"],
  workspaceSlots: WorkspaceSlot[],
): BaseRoom {
  return {
    ...summary(objectId, displayName, ["Room"]),
    slug,
    order: slug === "main" ? 0 : 1,
    atmosphere: slug === "main" ? "Calm" : "Focused",
    workspaceSlots,
  };
}

function summary(objectId: string, displayName: string, systemTags: string[]): BaseObjectSummary {
  return { objectId, displayName, description: "", systemTags, userTags: [] };
}
