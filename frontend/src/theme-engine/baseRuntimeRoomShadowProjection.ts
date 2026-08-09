import type { DeepReadonly } from "vue";

import type {
  BaseRoom,
  BaseSnapshot,
  WorkspaceSlot,
} from "../runtime/baseRuntime";
import {
  adaptBaseMainRoomV1,
  type BaseRoomCompatibilityProjection,
  type CompatibilityBoundsRecord,
} from "./baseRoomCompatibilityAdapter";
import { cloneAndFreeze, deepClone } from "./immutable";
import type { RoomParityDifference, RoomParityResult } from "./roomParity";
import type { ImmutableRoomSnapshot } from "./roomSnapshotResolver";
import type {
  FunctionContainerInstance,
  ObjectInstance,
  RoomConnection,
} from "./roomCompositionTypes";

export type BaseRuntimeShadowBindingKind =
  | "workspace"
  | "room-transition"
  | "companion"
  | "base-exit";

export interface BaseRuntimeShadowBinding {
  kind: BaseRuntimeShadowBindingKind;
  descriptorRole: string;
  objectInstanceId: string;
  containerInstanceId: string;
  representedObjectId: string;
  targetObjectId: string | null;
}

export interface BaseRuntimeMainRoomReference {
  baseObjectId: string;
  roomId: string;
  roomName: string;
  workspaceSlotIds: readonly string[];
  workspaceTargetIds: readonly (string | null)[];
  doorId: string | null;
  doorTargetRoomId: string | null;
  companionId: string | null;
  petId: string | null;
  bindings: readonly Readonly<BaseRuntimeShadowBinding>[];
}

export interface BaseRuntimeMainRoomShadowProjection {
  source: Readonly<BaseRuntimeMainRoomReference>;
  compatibility: Readonly<BaseRoomCompatibilityProjection>;
  runtimeBindings: readonly Readonly<BaseRuntimeShadowBinding>[];
}

export class BaseRuntimeRoomShadowProjectionError extends Error {
  readonly code = "base_runtime_room_shadow_projection_invalid";
}

interface BindingAssignment {
  record: CompatibilityBoundsRecord;
  binding: BaseRuntimeShadowBinding;
}

/**
 * Projects authoritative Base identities onto the existing compatibility
 * geometry. The result is ephemeral, immutable and has no Runtime write path.
 */
export function projectBaseMainRoomToRoomCompositionShadow(
  snapshot: DeepReadonly<BaseSnapshot>,
): Readonly<BaseRuntimeMainRoomShadowProjection> {
  const room = snapshot.rooms.find((candidate) => candidate.slug === "main");
  if (!room) {
    throw new BaseRuntimeRoomShadowProjectionError(
      "The Base Snapshot has no Main Room",
    );
  }

  const compatibility = adaptBaseMainRoomV1();
  const assignments = assignRuntimeBindings(snapshot, room, compatibility);
  const projected = remapCompatibilityProjection(
    snapshot,
    room,
    compatibility,
    assignments,
  );
  const runtimeBindings = assignments.map((assignment) => assignment.binding);
  const sourceBindings = expectedRuntimeBindings(snapshot, room, compatibility);

  return cloneAndFreeze({
    source: {
      baseObjectId: snapshot.base.objectId,
      roomId: room.objectId,
      roomName: room.displayName,
      workspaceSlotIds: room.workspaceSlots.map((slot) => slot.objectId),
      workspaceTargetIds: room.workspaceSlots.map(
        (slot) => slot.workspace?.objectId ?? null,
      ),
      doorId: connectedDoorTarget(snapshot, room.objectId)
        ? snapshot.door.objectId
        : null,
      doorTargetRoomId: connectedDoorTarget(snapshot, room.objectId),
      companionId: snapshot.companion?.objectId ?? null,
      petId: snapshot.pet?.objectId ?? null,
      bindings: sourceBindings,
    },
    compatibility: projected,
    runtimeBindings,
  });
}

/** Adds Runtime identity parity to the existing geometry/function comparator. */
export function compareBaseRuntimeRoomShadowProjection(
  projection: Readonly<BaseRuntimeMainRoomShadowProjection>,
  snapshot: Readonly<ImmutableRoomSnapshot>,
  structuralParity: Readonly<RoomParityResult>,
): Readonly<RoomParityResult> {
  const differences: RoomParityDifference[] = structuralParity.differences.map(
    (difference) => ({ ...difference }),
  );
  if (projection.source.roomId !== snapshot.roomId) {
    differences.push({
      severity: "blocking-difference",
      category: "room-transition",
      legacyId: projection.source.roomId,
      snapshotId: snapshot.roomId,
      message: `Room identity differs: Runtime "${projection.source.roomId}", snapshot "${snapshot.roomId}"`,
    });
  }

  const projectedBindings = new Map(
    projection.runtimeBindings.map((binding) => [binding.representedObjectId, binding]),
  );
  const snapshotFunctions = new Map(
    snapshot.functionContainers.map((container) => [
      container.instance.containerInstanceId,
      container,
    ]),
  );

  for (const expected of projection.source.bindings) {
    const actual = projectedBindings.get(expected.representedObjectId);
    if (!actual) {
      differences.push({
        severity: "blocking-difference",
        category: categoryFor(expected.kind),
        legacyId: expected.representedObjectId,
        message: `Runtime function "${expected.representedObjectId}" has no projected binding`,
      });
      continue;
    }
    if (
      actual.objectInstanceId !== expected.objectInstanceId ||
      actual.targetObjectId !== expected.targetObjectId
    ) {
      differences.push({
        severity: "blocking-difference",
        category: categoryFor(expected.kind),
        legacyId: expected.representedObjectId,
        snapshotId: actual.objectInstanceId,
        message: `Runtime target differs for "${expected.representedObjectId}": expected "${formatTarget(expected.targetObjectId)}", projected "${formatTarget(actual.targetObjectId)}"`,
      });
    }
    const container = snapshotFunctions.get(actual.containerInstanceId);
    if (
      !container ||
      container.attachedObjectInstanceId !== actual.objectInstanceId ||
      container.descriptorRole !== expected.descriptorRole ||
      container.actionRole !== expected.descriptorRole
    ) {
      differences.push({
        severity: "blocking-difference",
        category: categoryFor(expected.kind),
        legacyId: expected.representedObjectId,
        snapshotId: actual.objectInstanceId,
        message: `Runtime binding for "${expected.representedObjectId}" is not preserved by the resolved Function Container`,
      });
    }
  }

  for (const binding of projection.runtimeBindings) {
    if (
      projection.source.bindings.some(
        (expected) => expected.representedObjectId === binding.representedObjectId,
      )
    ) {
      continue;
    }
    differences.push({
      severity: "blocking-difference",
      category: categoryFor(binding.kind),
      snapshotId: binding.objectInstanceId,
      message: `Shadow projection adds unknown Runtime binding "${binding.representedObjectId}"`,
    });
  }

  differences.sort(compareDifference);
  return cloneAndFreeze({
    status: differences.some(
      (difference) => difference.severity === "blocking-difference",
    )
      ? "blocking-difference"
      : differences.length > 0
        ? "compatible-difference"
        : "equal",
    differences,
    comparedFunctionalObjects: projection.source.bindings.length,
  });
}

function assignRuntimeBindings(
  snapshot: DeepReadonly<BaseSnapshot>,
  room: DeepReadonly<BaseRoom>,
  compatibility: Readonly<BaseRoomCompatibilityProjection>,
): BindingAssignment[] {
  const records = compatibility.parity.objects;
  const workspaces = records
    .filter((record) => record.descriptorRole === "workspace.open")
    .sort((left, right) => left.depth - right.depth);
  const slots = [...room.workspaceSlots].sort(compareWorkspaceSlots);
  const assignments: BindingAssignment[] = [];

  for (let index = 0; index < Math.min(workspaces.length, slots.length); index += 1) {
    const slot = slots[index]!;
    assignments.push({
      record: workspaces[index]!,
      binding: binding(
        "workspace",
        "workspace.open",
        slot.objectId,
        slot.objectId,
        slot.workspace?.objectId ?? null,
      ),
    });
  }

  const doorTargetRoomId = connectedDoorTarget(snapshot, room.objectId);
  const doorRecord = records.find((record) =>
    record.legacyNodeId.includes("right-door"),
  );
  if (doorTargetRoomId && doorRecord) {
    assignments.push({
      record: doorRecord,
      binding: binding(
        "room-transition",
        "base.open",
        snapshot.door.objectId,
        snapshot.door.objectId,
        doorTargetRoomId,
      ),
    });
  }

  const companionRecord = records.find(
    (record) => record.descriptorRole === "companion.open",
  );
  if (snapshot.companion && companionRecord) {
    assignments.push({
      record: companionRecord,
      binding: binding(
        "companion",
        "companion.open",
        snapshot.companion.objectId,
        snapshot.companion.objectId,
        snapshot.companion.objectId,
      ),
    });
  }

  const exitRecord = records.find(
    (record) => record.descriptorRole === "base.close",
  );
  if (exitRecord) {
    assignments.push({
      record: exitRecord,
      binding: binding(
        "base-exit",
        "base.close",
        snapshot.base.objectId,
        snapshot.base.objectId,
        snapshot.base.objectId,
      ),
    });
  }
  return assignments;
}

function expectedRuntimeBindings(
  snapshot: DeepReadonly<BaseSnapshot>,
  room: DeepReadonly<BaseRoom>,
  compatibility: Readonly<BaseRoomCompatibilityProjection>,
): BaseRuntimeShadowBinding[] {
  const projected = assignRuntimeBindings(snapshot, room, compatibility).map(
    (assignment) => assignment.binding,
  );
  const representedIds = new Set(
    projected.map((bindingValue) => bindingValue.representedObjectId),
  );
  for (const slot of room.workspaceSlots) {
    if (representedIds.has(slot.objectId)) continue;
    projected.push(
      binding(
        "workspace",
        "workspace.open",
        slot.objectId,
        slot.objectId,
        slot.workspace?.objectId ?? null,
      ),
    );
  }
  return projected.sort((left, right) =>
    compareText(left.representedObjectId, right.representedObjectId),
  );
}

function remapCompatibilityProjection(
  snapshot: DeepReadonly<BaseSnapshot>,
  room: DeepReadonly<BaseRoom>,
  compatibility: Readonly<BaseRoomCompatibilityProjection>,
  assignments: readonly BindingAssignment[],
): BaseRoomCompatibilityProjection {
  const sourceObjects = new Map(
    compatibility.roomComposition.objectInstances.map((instance) => [
      instance.instanceId,
      instance,
    ]),
  );
  const sourceContainers = new Map(
    compatibility.roomComposition.functionContainers.map((container) => [
      container.attachedObjectInstanceId,
      container,
    ]),
  );
  const objectInstances: ObjectInstance[] = [];
  const containerInstances: FunctionContainerInstance[] = [];
  const parityObjects: CompatibilityBoundsRecord[] = [];

  for (const assignment of assignments) {
    const sourceObject = sourceObjects.get(assignment.record.objectInstanceId);
    const sourceContainer = sourceContainers.get(assignment.record.objectInstanceId);
    if (!sourceObject || !sourceContainer) {
      throw new BaseRuntimeRoomShadowProjectionError(
        `Compatibility record "${assignment.record.legacyNodeId}" is incomplete`,
      );
    }
    const instance = deepClone(sourceObject);
    instance.instanceId = assignment.binding.objectInstanceId;
    instance.functionContainerInstanceId = assignment.binding.containerInstanceId;
    objectInstances.push(instance);

    const container = deepClone(sourceContainer);
    container.containerInstanceId = assignment.binding.containerInstanceId;
    container.attachedObjectInstanceId = assignment.binding.objectInstanceId;
    containerInstances.push(container);

    parityObjects.push({
      ...deepClone(assignment.record),
      legacyNodeId: assignment.binding.representedObjectId,
      objectInstanceId: assignment.binding.objectInstanceId,
      descriptorId:
        assignment.binding.targetObjectId ?? assignment.binding.representedObjectId,
    });
  }

  const usedCatalogIds = new Set(
    objectInstances.map((instance) => instance.catalogObjectRef.id),
  );
  const usedContainerIds = new Set(
    containerInstances.map((instance) => instance.definitionRef.id),
  );
  const roomConnections = roomConnection(snapshot, room.objectId);
  const preset = {
    ...deepClone(compatibility.preset),
    displayName: room.displayName,
    objectInstances,
    functionContainers: containerInstances,
    connections: roomConnections,
  };
  const roomComposition = {
    ...deepClone(compatibility.roomComposition),
    roomId: room.objectId,
    objectInstances,
    functionContainers: containerInstances,
    connections: roomConnections,
    revision: { revisionId: `shadow:${room.objectId}` },
  };

  return {
    shell: deepClone(compatibility.shell),
    preset,
    catalogObjects: compatibility.catalogObjects
      .filter((object) => usedCatalogIds.has(object.catalogObjectId))
      .map(deepClone),
    functionContainers: compatibility.functionContainers
      .filter((container) => usedContainerIds.has(container.containerId))
      .map(deepClone),
    roomComposition,
    parity: {
      surfaces: deepClone(compatibility.parity.surfaces),
      objects: parityObjects,
    },
  };
}

function binding(
  kind: BaseRuntimeShadowBindingKind,
  descriptorRole: string,
  objectInstanceId: string,
  representedObjectId: string,
  targetObjectId: string | null,
): BaseRuntimeShadowBinding {
  return {
    kind,
    descriptorRole,
    objectInstanceId,
    containerInstanceId: `${objectInstanceId}.shadow-function`,
    representedObjectId,
    targetObjectId,
  };
}

function connectedDoorTarget(
  snapshot: DeepReadonly<BaseSnapshot>,
  roomId: string,
): string | null {
  if (!snapshot.door) return null;
  if (snapshot.door.roomAId === roomId) return snapshot.door.roomBId;
  if (snapshot.door.roomBId === roomId) return snapshot.door.roomAId;
  return null;
}

function roomConnection(
  snapshot: DeepReadonly<BaseSnapshot>,
  roomId: string,
): RoomConnection[] {
  const targetRoomId = connectedDoorTarget(snapshot, roomId);
  if (!targetRoomId) return [];
  return [{
    connectionId: `${snapshot.door.objectId}.shadow-connection`,
    fromRoomId: snapshot.door.roomAId,
    toRoomId: snapshot.door.roomBId,
    bidirectional: true,
    visualObjectInstanceIds: [snapshot.door.objectId],
  }];
}

function compareWorkspaceSlots(
  left: DeepReadonly<WorkspaceSlot>,
  right: DeepReadonly<WorkspaceSlot>,
): number {
  return (
    sideOrder(left.placement) - sideOrder(right.placement) ||
    compareText(left.objectId, right.objectId)
  );
}

function sideOrder(placement: string): number {
  const normalized = placement.toLocaleLowerCase();
  if (normalized.includes("left")) return 0;
  if (normalized.includes("right")) return 1;
  return 2;
}

function categoryFor(
  kind: BaseRuntimeShadowBindingKind,
): RoomParityDifference["category"] {
  if (kind === "workspace") return "workspace-assignment";
  if (kind === "room-transition") return "room-transition";
  if (kind === "companion") return "companion";
  return "base-exit";
}

function formatTarget(value: string | null): string {
  return value ?? "unavailable";
}

function compareDifference(
  left: RoomParityDifference,
  right: RoomParityDifference,
): number {
  return (
    severityOrder(left.severity) - severityOrder(right.severity) ||
    compareText(left.category, right.category) ||
    compareText(left.legacyId ?? "", right.legacyId ?? "") ||
    compareText(left.snapshotId ?? "", right.snapshotId ?? "") ||
    compareText(left.message, right.message)
  );
}

function severityOrder(
  severity: RoomParityDifference["severity"],
): number {
  return severity === "blocking-difference" ? 0 : 1;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
