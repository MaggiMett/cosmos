import {
  adaptBaseMainRoomV1,
  type BaseRoomCompatibilityAdapterInput,
} from "./baseRoomCompatibilityAdapter";
import { cloneAndFreeze } from "./immutable";
import {
  compareLegacyBaseToRoomSnapshot,
  type RoomParityResult,
} from "./roomParity";
import {
  createRoomCompositionRegistries,
  type RoomCompositionRegistries,
} from "./roomRegistries";
import {
  RoomCompositionResolver,
  type ImmutableRoomSnapshot,
  type RoomSkinResolutionInput,
} from "./roomSnapshotResolver";
import type { BaseComposition } from "./roomCompositionTypes";

export interface RunBaseRoomShadowModeInput {
  legacy?: BaseRoomCompatibilityAdapterInput;
  skins?: RoomSkinResolutionInput;
}

export interface RoomShadowModeResult {
  mode: "shadow";
  authoritativeRuntime: "legacy-base";
  snapshot: Readonly<ImmutableRoomSnapshot>;
  parity: Readonly<RoomParityResult>;
  diagnostics: readonly string[];
}

export function runBaseMainRoomShadowMode(
  input: RunBaseRoomShadowModeInput = {},
): Readonly<RoomShadowModeResult> {
  const legacy = adaptBaseMainRoomV1(input.legacy);
  const registries = createRoomCompositionRegistries();
  registerCompatibilityProjection(registries, legacy);
  const resolver = new RoomCompositionResolver(registries);
  const snapshot = resolver.resolve({
    roomComposition: legacy.roomComposition,
    presetRef: {
      id: legacy.preset.presetId,
      versionRange: legacy.preset.version,
    },
    skins: input.skins ?? compatibilitySkinResolution(legacy),
  });
  const parity = compareLegacyBaseToRoomSnapshot(legacy, snapshot);
  const diagnostics = [
    ...snapshot.validationStatus.warnings.map(
      (warning) => `snapshot-warning: ${warning}`,
    ),
    ...snapshot.validationStatus.conflicts.map(
      (conflict) => `snapshot-conflict: ${conflict}`,
    ),
    ...parity.differences.map(
      (difference) => `${difference.severity}: ${difference.message}`,
    ),
  ].sort(compareText);
  return cloneAndFreeze({
    mode: "shadow" as const,
    authoritativeRuntime: "legacy-base" as const,
    snapshot,
    parity,
    diagnostics,
  });
}

function registerCompatibilityProjection(
  registries: RoomCompositionRegistries,
  legacy: ReturnType<typeof adaptBaseMainRoomV1>,
): void {
  registries.shells.register(legacy.shell);
  registries.presets.register(legacy.preset);
  registries.catalogObjects.registerMany(legacy.catalogObjects);
  registries.functionContainers.registerMany(legacy.functionContainers);
  const base: BaseComposition = {
    schemaVersion: 1,
    baseId: "core.base.shadow-compatibility",
    version: "1.0.0",
    rooms: [legacy.roomComposition],
    connections: [],
    entryRoomId: legacy.roomComposition.roomId,
    presentationOverrides: [],
    revision: { revisionId: "shadow-read-only" },
  };
  registries.baseCompositions.register(base);
}

function compatibilitySkinResolution(
  legacy: ReturnType<typeof adaptBaseMainRoomV1>,
): RoomSkinResolutionInput {
  const coreSkins = new Map<string, { skinId: string; version: string }>();
  for (const object of legacy.catalogObjects) {
    const reference = object.skinCompatibility.coreFallbackSkinRef;
    coreSkins.set(reference.id, {
      skinId: reference.id,
      version: "1.0.0",
    });
  }
  return {
    availableSkins: [...coreSkins.values()].sort((left, right) =>
      compareText(left.skinId, right.skinId),
    ),
    assignments: [],
  };
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
