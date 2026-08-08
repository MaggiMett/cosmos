import type { DeepReadonly } from "vue";
import type { Router } from "vue-router";

import type { BaseRuntime, BaseSnapshot } from "../../runtime/baseRuntime";
import type { BaseWorkspaceSlotPresentation } from "./baseRuntimeProjection";

type BaseSelectionRuntime = Readonly<Pick<BaseRuntime, "select">>;
type BaseNavigationRouter = Readonly<Pick<Router, "push">>;

export async function navigateFromBase(router: BaseNavigationRouter): Promise<void> {
  await router.push("/");
}

export async function navigateToBaseRoom(
  router: BaseNavigationRouter,
  runtime: BaseSelectionRuntime,
  snapshot: DeepReadonly<BaseSnapshot>,
  targetRoomId: string,
): Promise<boolean> {
  const targetRoom = snapshot.rooms.find((room) => room.objectId === targetRoomId);
  if (!targetRoom) return false;

  runtime.select(null);
  await router.push(targetRoom.slug === "main" ? "/base" : `/base/rooms/${targetRoom.slug}`);
  return true;
}

export async function navigateToBaseWorkspace(
  router: BaseNavigationRouter,
  runtime: BaseSelectionRuntime,
  slot: Readonly<BaseWorkspaceSlotPresentation>,
): Promise<boolean> {
  runtime.select(slot.slotObjectId);
  if (!slot.workspaceObjectId) return false;

  await router.push(`/workspaces/${encodeURIComponent(slot.workspaceObjectId)}`);
  return true;
}
