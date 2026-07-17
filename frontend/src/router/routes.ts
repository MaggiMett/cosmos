import type { RouteRecordRaw } from "vue-router";

import EnvironmentView from "../views/EnvironmentView";

export type EnvironmentKind = "cosmos" | "base" | "room" | "workspace";

export const routeRecords = [
  {
    path: "/",
    name: "cosmos",
    component: EnvironmentView,
    meta: { title: "Cosmos", environment: "cosmos" },
  },
  {
    path: "/base",
    name: "base",
    component: EnvironmentView,
    meta: { title: "Base", environment: "base" },
  },
  {
    path: "/base/rooms/:roomId",
    name: "room",
    component: EnvironmentView,
    meta: { title: "Room", environment: "room" },
  },
  {
    path: "/workspaces/:workspaceId",
    name: "workspace",
    component: EnvironmentView,
    meta: { title: "Workspace", environment: "workspace" },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
] satisfies RouteRecordRaw[];
