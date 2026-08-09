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
  FunctionType,
  ObjectInstance,
  RoomConnection,
} from "./roomCompositionTypes";

type ReadonlySnapshotValue<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer Item)[]
    ? readonly ReadonlySnapshotValue<Item>[]
    : T extends object
      ? { readonly [Key in keyof T]: ReadonlySnapshotValue<T[Key]> }
      : T;

export type BaseRuntimeSnapshotReadModel = ReadonlySnapshotValue<BaseSnapshot>;

interface BaseRuntimeShadowBindingBase {
  descriptorRole: string;
  objectInstanceId: string;
  containerInstanceId: string;
}

export interface BaseRuntimeWorkspaceBinding
  extends BaseRuntimeShadowBindingBase {
  kind: "workspace";
  descriptorRole: "workspace.open";
  functionContainerRole: Extract<
    FunctionType,
    "knowledge-workspace" | "creation-workspace"
  >;
  workspaceSlotId: string;
  workspaceId: string | null;
}

export interface BaseRuntimeRoomTransitionBinding
  extends BaseRuntimeShadowBindingBase {
  kind: "room-transition";
  descriptorRole: "base.open" | "room.transition";
  functionContainerRole: "room-transition";
  doorId: string;
  targetRoomId: string;
}

export interface BaseRuntimeCompanionBinding
  extends BaseRuntimeShadowBindingBase {
  kind: "companion";
  descriptorRole: "companion.open";
  functionContainerRole: "companion-interaction";
  companionId: string;
}

export interface BaseRuntimeBaseExitBinding
  extends BaseRuntimeShadowBindingBase {
  kind: "base-exit";
  descriptorRole: "base.close";
  functionContainerRole: "base-exit";
  baseId: string;
}

export type BaseRuntimeShadowBinding =
  | BaseRuntimeWorkspaceBinding
  | BaseRuntimeRoomTransitionBinding
  | BaseRuntimeCompanionBinding
  | BaseRuntimeBaseExitBinding;

export type BaseRuntimeShadowBindingKind = BaseRuntimeShadowBinding["kind"];

export interface BaseRuntimeMainRoomReference {
  baseObjectId: string;
  roomId: string;
  roomName: string;
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
  snapshot: BaseRuntimeSnapshotReadModel,
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
    projection.runtimeBindings.map((binding) => [bindingIdentity(binding), binding]),
  );
  const snapshotFunctions = new Map(
    snapshot.functionContainers.map((container) => [
      container.instance.containerInstanceId,
      container,
    ]),
  );

  for (const expected of projection.source.bindings) {
    const expectedIdentity = bindingIdentity(expected);
    const actual = projectedBindings.get(expectedIdentity);
    if (!actual) {
      differences.push({
        severity: "blocking-difference",
        category: categoryFor(expected.kind),
        legacyId: expectedIdentity,
        message: `Runtime function "${expectedIdentity}" has no projected binding`,
      });
      continue;
    }
    if (!sameRuntimeBinding(expected, actual)) {
      differences.push({
        severity: "blocking-difference",
        category: categoryFor(expected.kind),
        legacyId: expectedIdentity,
        snapshotId: actual.objectInstanceId,
        message: `Runtime target differs for "${expectedIdentity}": expected "${formatBindingTarget(expected)}", projected "${formatBindingTarget(actual)}"`,
      });
    }
    const container = snapshotFunctions.get(actual.containerInstanceId);
    if (
      !container ||
      container.attachedObjectInstanceId !== actual.objectInstanceId ||
      container.descriptorRole !== expected.descriptorRole ||
      container.actionRole !== expected.descriptorRole ||
      container.definition.functionType !== expected.functionContainerRole
    ) {
      differences.push({
        severity: "blocking-difference",
        category: categoryFor(expected.kind),
        legacyId: expectedIdentity,
        snapshotId: actual.objectInstanceId,
        message: `Runtime binding for "${expectedIdentity}" is not preserved by the resolved Function Container`,
      });
    }
  }

  for (const binding of projection.runtimeBindings) {
    if (
      projection.source.bindings.some(
        (expected) => bindingIdentity(expected) === bindingIdentity(binding),
      )
    ) {
      continue;
    }
    differences.push({
      severity: "blocking-difference",
      category: categoryFor(binding.kind),
      snapshotId: binding.objectInstanceId,
      message: `Shadow projection adds unknown Runtime binding "${bindingIdentity(binding)}"`,
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
  snapshot: BaseRuntimeSnapshotReadModel,
  room: ReadonlySnapshotValue<BaseRoom>,
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
    const record = workspaces[index]!;
    assignments.push({
      record,
      binding: workspaceBinding(
        record,
        compatibility,
        slot,
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
      binding: roomTransitionBinding(snapshot.door.objectId, doorTargetRoomId),
    });
  }

  const companionRecord = records.find(
    (record) => record.descriptorRole === "companion.open",
  );
  if (snapshot.companion && companionRecord) {
    assignments.push({
      record: companionRecord,
      binding: companionBinding(snapshot.companion.objectId),
    });
  }

  const exitRecord = records.find(
    (record) => record.descriptorRole === "base.close",
  );
  if (exitRecord) {
    assignments.push({
      record: exitRecord,
      binding: baseExitBinding(snapshot.base.objectId),
    });
  }
  return assignments;
}

function expectedRuntimeBindings(
  snapshot: BaseRuntimeSnapshotReadModel,
  room: ReadonlySnapshotValue<BaseRoom>,
  compatibility: Readonly<BaseRoomCompatibilityProjection>,
): BaseRuntimeShadowBinding[] {
  const projected = assignRuntimeBindings(snapshot, room, compatibility).map(
    (assignment) => assignment.binding,
  );
  const representedIds = new Set(
    projected.map(bindingIdentity),
  );
  for (const slot of room.workspaceSlots) {
    if (representedIds.has(slot.objectId)) continue;
    const fallbackRecord = compatibility.parity.objects.find(
      (record) => record.descriptorRole === "workspace.open",
    );
    if (!fallbackRecord) continue;
    projected.push(workspaceBinding(fallbackRecord, compatibility, slot));
  }
  return projected.sort((left, right) =>
    compareText(bindingIdentity(left), bindingIdentity(right)),
  );
}

function remapCompatibilityProjection(
  snapshot: BaseRuntimeSnapshotReadModel,
  room: ReadonlySnapshotValue<BaseRoom>,
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
      legacyNodeId: bindingIdentity(assignment.binding),
      objectInstanceId: assignment.binding.objectInstanceId,
      descriptorId: bindingTarget(assignment.binding) ?? bindingIdentity(assignment.binding),
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

function workspaceBinding(
  record: CompatibilityBoundsRecord,
  compatibility: Readonly<BaseRoomCompatibilityProjection>,
  slot: ReadonlySnapshotValue<WorkspaceSlot>,
): BaseRuntimeWorkspaceBinding {
  const definition = compatibility.functionContainers.find(
    (container) => container.containerId === record.functionContainerId,
  );
  const functionContainerRole = definition?.functionType;
  if (
    functionContainerRole !== "knowledge-workspace" &&
    functionContainerRole !== "creation-workspace"
  ) {
    throw new BaseRuntimeRoomShadowProjectionError(
      `Workspace "${slot.objectId}" has no compatible Function Container role`,
    );
  }
  return {
    kind: "workspace",
    descriptorRole: "workspace.open",
    functionContainerRole,
    objectInstanceId: slot.objectId,
    containerInstanceId: `${slot.objectId}.shadow-function`,
    workspaceSlotId: slot.objectId,
    workspaceId: slot.workspace?.objectId ?? null,
  };
}

function roomTransitionBinding(
  doorId: string,
  targetRoomId: string,
): BaseRuntimeRoomTransitionBinding {
  return {
    kind: "room-transition",
    descriptorRole: "base.open",
    functionContainerRole: "room-transition",
    objectInstanceId: doorId,
    containerInstanceId: `${doorId}.shadow-function`,
    doorId,
    targetRoomId,
  };
}

function companionBinding(companionId: string): BaseRuntimeCompanionBinding {
  return {
    kind: "companion",
    descriptorRole: "companion.open",
    functionContainerRole: "companion-interaction",
    objectInstanceId: companionId,
    containerInstanceId: `${companionId}.shadow-function`,
    companionId,
  };
}

function baseExitBinding(baseId: string): BaseRuntimeBaseExitBinding {
  return {
    kind: "base-exit",
    descriptorRole: "base.close",
    functionContainerRole: "base-exit",
    objectInstanceId: baseId,
    containerInstanceId: `${baseId}.shadow-function`,
    baseId,
  };
}

function bindingIdentity(bindingValue: BaseRuntimeShadowBinding): string {
  if (bindingValue.kind === "workspace") return bindingValue.workspaceSlotId;
  if (bindingValue.kind === "room-transition") return bindingValue.doorId;
  if (bindingValue.kind === "companion") return bindingValue.companionId;
  return bindingValue.baseId;
}

function bindingTarget(bindingValue: BaseRuntimeShadowBinding): string | null {
  if (bindingValue.kind === "workspace") return bindingValue.workspaceId;
  if (bindingValue.kind === "room-transition") return bindingValue.targetRoomId;
  if (bindingValue.kind === "companion") return bindingValue.companionId;
  return bindingValue.baseId;
}

function sameRuntimeBinding(
  expected: BaseRuntimeShadowBinding,
  actual: BaseRuntimeShadowBinding,
): boolean {
  return (
    expected.kind === actual.kind &&
    expected.descriptorRole === actual.descriptorRole &&
    expected.functionContainerRole === actual.functionContainerRole &&
    expected.objectInstanceId === actual.objectInstanceId &&
    expected.containerInstanceId === actual.containerInstanceId &&
    bindingIdentity(expected) === bindingIdentity(actual) &&
    bindingTarget(expected) === bindingTarget(actual)
  );
}

function connectedDoorTarget(
  snapshot: BaseRuntimeSnapshotReadModel,
  roomId: string,
): string | null {
  if (!snapshot.door) return null;
  if (snapshot.door.roomAId === roomId) return snapshot.door.roomBId;
  if (snapshot.door.roomBId === roomId) return snapshot.door.roomAId;
  return null;
}

function roomConnection(
  snapshot: BaseRuntimeSnapshotReadModel,
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
  left: ReadonlySnapshotValue<WorkspaceSlot>,
  right: ReadonlySnapshotValue<WorkspaceSlot>,
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

function formatBindingTarget(bindingValue: BaseRuntimeShadowBinding): string {
  return bindingTarget(bindingValue) ?? "unavailable";
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
