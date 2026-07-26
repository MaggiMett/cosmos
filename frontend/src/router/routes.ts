import type { RouteRecordRaw } from "vue-router";

import EnvironmentView from "../views/EnvironmentView";

export type EnvironmentKind =
  | "cosmos"
  | "base"
  | "room"
  | "workspace"
  | "development";

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
    path: "/dev/base-builder",
    name: "dev-base-builder",
    component: () => import("../dev/base-builder/BaseBuilderView.vue"),
    meta: {
      title: "Base Builder Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/asset-library",
    name: "dev-asset-library",
    component: () => import("../dev/asset-library/AssetLibraryView.vue"),
    meta: {
      title: "Asset Library Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
] satisfies RouteRecordRaw[];
