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
    path: "/dev/theme-board",
    name: "dev-theme-board",
    component: () => import("../dev/theme-builder/ThemeBoardView.vue"),
    meta: {
      title: "Theme Board Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/room-shell-studio",
    name: "dev-room-shell-studio",
    component: () => import("../dev/theme-builder/RoomShellStudioView.vue"),
    meta: {
      title: "Room Shell Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/object-studio",
    name: "dev-object-studio",
    component: () => import("../dev/theme-builder/ObjectStudioView.vue"),
    meta: {
      title: "Object Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/looks-studio",
    name: "dev-looks-studio",
    component: () => import("../dev/theme-builder/LooksStudioView.vue"),
    meta: {
      title: "Looks Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/showcase",
    name: "dev-showcase",
    component: () => import("../dev/theme-builder/ShowcaseView.vue"),
    meta: {
      title: "Showcase Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/release-studio",
    name: "dev-release-studio",
    component: () => import("../dev/theme-builder/ReleaseStudioView.vue"),
    meta: {
      title: "Release Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    },
  },
  {
    path: "/dev/theme-library",
    name: "dev-theme-library",
    component: () => import("../dev/theme-library/ThemeLibraryView.vue"),
    meta: {
      title: "Theme Library",
      environment: "cosmos",
    },
  },
  {
    path: "/dev/base-runtime",
    name: "dev-base-runtime",
    component: () => import("../dev/base-runtime/BaseRuntimeView.vue"),
    meta: {
      title: "Base · Main Room",
      environment: "base",
    },
  },
  {
    path: "/dev/cosmos-project",
    name: "dev-cosmos-project",
    component: () => import("../dev/cosmos-project/CosmosProjectView.vue"),
    meta: {
      title: "Project Cosmos",
      environment: "cosmos",
    },
  },
  {
    path: "/dev/cosmos-global",
    name: "dev-cosmos-global",
    component: () => import("../dev/cosmos-global/CosmosGlobalView.vue"),
    meta: {
      title: "Global Cosmos View",
      environment: "cosmos",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
] satisfies RouteRecordRaw[];
