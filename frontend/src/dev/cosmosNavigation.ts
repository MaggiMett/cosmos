import type { RouteLocationRaw, Router } from "vue-router";

export function projectCosmosRoute(projectId: string): RouteLocationRaw {
  return {
    name: "dev-cosmos-project",
    query: { projectId },
  };
}

export function globalCosmosRoute(): RouteLocationRaw {
  return { name: "dev-cosmos-global" };
}

export function navigateToProject(
  router: Readonly<Pick<Router, "push">>,
  projectId: string,
): ReturnType<Router["push"]> {
  return router.push(projectCosmosRoute(projectId));
}

export function navigateToGlobal(
  router: Readonly<Pick<Router, "push">>,
): ReturnType<Router["push"]> {
  return router.push(globalCosmosRoute());
}
