import { createMemoryHistory, type Router } from "vue-router";
import { describe, expect, it, vi } from "vitest";

import { createCosmosRouter } from "../router";
import {
  globalCosmosRoute,
  navigateToGlobal,
  navigateToProject,
  projectCosmosRoute,
} from "./cosmosNavigation";

describe("Global to Project Cosmos navigation", () => {
  it("builds a canonical Project URL from each supplied real Project ID", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });

    expect(router.resolve(projectCosmosRoute("project.real-alpha")).fullPath).toBe(
      "/dev/cosmos-project?projectId=project.real-alpha",
    );
    expect(router.resolve(projectCosmosRoute("project.real-beta")).fullPath).toBe(
      "/dev/cosmos-project?projectId=project.real-beta",
    );
  });

  it("uses only the activated Project ID and the existing named routes", async () => {
    const push = vi.fn().mockResolvedValue(undefined);
    const router = { push } as unknown as Pick<Router, "push">;

    await navigateToProject(router, "project.from-snapshot");
    expect(push).toHaveBeenLastCalledWith({
      name: "dev-cosmos-project",
      query: { projectId: "project.from-snapshot" },
    });

    await navigateToProject(router, "project.second-snapshot-id");
    expect(push).toHaveBeenLastCalledWith({
      name: "dev-cosmos-project",
      query: { projectId: "project.second-snapshot-id" },
    });

    await navigateToGlobal(router);
    expect(push).toHaveBeenLastCalledWith({ name: "dev-cosmos-global" });
  });

  it("preserves valid and unknown Project IDs in direct deep links", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const valid = router.resolve(
      "/dev/cosmos-project?projectId=cosmos.project.system.knowledge",
    );
    const unknown = router.resolve(
      "/dev/cosmos-project?projectId=project.unknown",
    );

    expect(valid.name).toBe("dev-cosmos-project");
    expect(valid.query.projectId).toBe("cosmos.project.system.knowledge");
    expect(unknown.name).toBe("dev-cosmos-project");
    expect(unknown.query.projectId).toBe("project.unknown");
  });

  it("resolves the same Project ID after a router remount", () => {
    const url = "/dev/cosmos-project?projectId=cosmos.project.system.creation";
    const initialRouter = createCosmosRouter({ history: createMemoryHistory() });
    const initialRoute = initialRouter.resolve(url);

    const remountedRouter = createCosmosRouter({ history: createMemoryHistory() });
    const remountedRoute = remountedRouter.resolve(initialRoute.fullPath);

    expect(remountedRoute.fullPath).toBe(url);
    expect(remountedRoute.query.projectId).toBe(
      "cosmos.project.system.creation",
    );
  });

  it("does not expose fixture defaults or Cosmos runtime mutations", () => {
    const combined = [
      projectCosmosRoute.toString(),
      globalCosmosRoute.toString(),
      navigateToProject.toString(),
      navigateToGlobal.toString(),
    ].join("\n");

    for (const fixture of ["Asteria", "Forge", "Atlas", "Mettventures", "Archive", "Sandbox"]) {
      expect(combined).not.toContain(fixture);
    }
    for (const mutation of [
      "focusProject",
      "select(",
      "moveNode",
      "persist",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ]) {
      expect(combined).not.toContain(mutation);
    }
  });
});
