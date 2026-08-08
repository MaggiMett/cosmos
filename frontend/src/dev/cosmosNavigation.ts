import type { RouteLocationRaw, Router } from "vue-router";

export type CosmosNavigationScope = "development" | "production";

export function projectCosmosRoute(
  projectId: string,
  scope: CosmosNavigationScope = "development",
): RouteLocationRaw {
  if (scope === "production") {
    return { name: "cosmos", query: { projectId } };
  }
  return {
    name: "dev-cosmos-project",
    query: { projectId },
  };
}

export function globalCosmosRoute(
  scope: CosmosNavigationScope = "development",
): RouteLocationRaw {
  return scope === "production" ? { name: "cosmos" } : { name: "dev-cosmos-global" };
}

export function navigateToProject(
  router: Readonly<Pick<Router, "push">>,
  projectId: string,
  scope: CosmosNavigationScope = "development",
): ReturnType<Router["push"]> {
  return router.push(projectCosmosRoute(projectId, scope));
}

export function navigateToGlobal(
  router: Readonly<Pick<Router, "push">>,
  scope: CosmosNavigationScope = "development",
): ReturnType<Router["push"]> {
  return router.push(globalCosmosRoute(scope));
}
