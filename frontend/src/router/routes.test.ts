import { createMemoryHistory } from "vue-router";
import { describe, expect, it } from "vitest";

import { TransitionRuntime } from "../runtime/transitionRuntime";
import {
  createCosmosRouter,
  shouldEnqueueRuntimeTransition,
} from "./index";
import { routeRecords } from "./routes";

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
    const kinds: string[] = [];
    const enqueue = transitions.enqueue.bind(transitions);
    transitions.enqueue = (request) => {
      kinds.push(request.kind);
      return enqueue(request);
    };

    await router.push("/base");
    await router.push("/base/rooms/main");

    expect(router.currentRoute.value.meta.environment).toBe("room");
    expect(kinds).toEqual(["environment", "environment"]);
    expect(transitions.active).toBeNull();
  });

  it("returns unknown locations to Cosmos", async () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });

    await router.push("/not-a-cosmos-location");

    expect(router.currentRoute.value.name).toBe("cosmos");
  });

  it("keeps the Base Builder preview isolated from the Base environment route", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/base-builder");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-base-builder",
    );
    const baseRecord = routeRecords.find((record) => record.name === "base");

    expect(preview.name).toBe("dev-base-builder");
    expect(preview.meta).toMatchObject({
      environment: "development",
      developmentPreview: true,
    });
    expect(previewRecord?.component).not.toBe(baseRecord?.component);
    expect(String(previewRecord?.component)).not.toContain("BaseView");
  });

  it("does not enqueue Runtime transitions into or out of the Development Preview", () => {
    expect(
      shouldEnqueueRuntimeTransition(
        { developmentPreview: true },
        { developmentPreview: false },
      ),
    ).toBe(false);
    expect(
      shouldEnqueueRuntimeTransition(
        { developmentPreview: false },
        { developmentPreview: true },
      ),
    ).toBe(false);
    expect(shouldEnqueueRuntimeTransition({}, {})).toBe(true);
  });
});
