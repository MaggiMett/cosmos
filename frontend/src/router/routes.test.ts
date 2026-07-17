import { createMemoryHistory } from "vue-router";
import { describe, expect, it } from "vitest";

import { TransitionRuntime } from "../runtime/transitionRuntime";
import { createCosmosRouter } from "./index";

describe("Cosmos routing", () => {
  it("resolves the spatial environment hierarchy without page-style feature routes", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });

    expect(router.resolve({ name: "cosmos" }).path).toBe("/");
    expect(router.resolve({ name: "base" }).path).toBe("/base");
    expect(router.resolve({ name: "room", params: { roomId: "main" } }).path).toBe(
      "/base/rooms/main",
    );
    expect(
      router.resolve({ name: "workspace", params: { workspaceId: "knowledge" } }).path,
    ).toBe("/workspaces/knowledge");
  });

  it("serializes navigation through the shared Shell transition runtime", async () => {
    const transitions = new TransitionRuntime();
    const router = createCosmosRouter({ history: createMemoryHistory(), transitions });

    await router.push("/base");
    await router.push("/base/rooms/main");

    expect(router.currentRoute.value.meta.environment).toBe("room");
    expect(transitions.active).toBeNull();
  });

  it("returns unknown locations to Cosmos", async () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });

    await router.push("/not-a-cosmos-location");

    expect(router.currentRoute.value.name).toBe("cosmos");
  });
});
