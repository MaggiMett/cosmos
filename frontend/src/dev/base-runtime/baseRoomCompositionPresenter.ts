import {
  runBaseRoomShadowMode,
  type BaseRuntimeSnapshotReadModel,
  type RoomShadowModeResult,
} from "../../theme-engine";
import {
  createRoomCompositionInteractionDiagnostics,
  type RoomCompositionInteractionDiagnostics,
} from "../room-composition-preview/roomCompositionInteractionProjection";

export type BaseRoomCompositionFallbackReason =
  | "disabled"
  | "resolution-error"
  | "invalid-snapshot"
  | "blocking-room-parity"
  | "blocking-interaction-parity";

export type BaseRoomCompositionPresenterResult =
  | {
      status: "active";
      shadow: Readonly<RoomShadowModeResult>;
      interactions: Readonly<RoomCompositionInteractionDiagnostics>;
    }
  | {
      status: "fallback";
      reason: BaseRoomCompositionFallbackReason;
    };

interface BaseRoomCompositionDependencies {
  runShadow?: typeof runBaseRoomShadowMode;
  createInteractionDiagnostics?: typeof createRoomCompositionInteractionDiagnostics;
}

/**
 * Narrow safety gate for the optional productive renderer. It owns no Runtime
 * state and falls back before any Composition markup is mounted.
 */
export function resolveBaseRoomCompositionPresenter(
  enabled: boolean,
  baseSnapshot: BaseRuntimeSnapshotReadModel,
  roomId: string,
  dependencies: BaseRoomCompositionDependencies = {},
): Readonly<BaseRoomCompositionPresenterResult> {
  if (!enabled) return Object.freeze({ status: "fallback", reason: "disabled" });
  const runShadow = dependencies.runShadow ?? runBaseRoomShadowMode;
  const createDiagnostics =
    dependencies.createInteractionDiagnostics ??
    createRoomCompositionInteractionDiagnostics;
  try {
    const shadow = runShadow({ baseSnapshot, roomId });
    if (!shadow.snapshot.validationStatus.valid) {
      return Object.freeze({ status: "fallback", reason: "invalid-snapshot" });
    }
    if (shadow.parity.status === "blocking-difference") {
      return Object.freeze({
        status: "fallback",
        reason: "blocking-room-parity",
      });
    }
    const interactions = createDiagnostics(
      baseSnapshot,
      shadow.snapshot,
      shadow.runtimeBindings ?? [],
      roomId,
    );
    if (interactions.parity.status === "blocking-difference") {
      return Object.freeze({
        status: "fallback",
        reason: "blocking-interaction-parity",
      });
    }
    return Object.freeze({ status: "active", shadow, interactions });
  } catch {
    return Object.freeze({ status: "fallback", reason: "resolution-error" });
  }
}
