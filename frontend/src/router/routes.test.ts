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

  it("resolves the Asset Library as a separate isolated development preview", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/asset-library");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-asset-library",
    );
    const baseBuilderRecord = routeRecords.find(
      (record) => record.name === "dev-base-builder",
    );

    expect(preview.name).toBe("dev-asset-library");
    expect(preview.meta).toMatchObject({
      title: "Asset Library Development Preview",
      environment: "development",
      developmentPreview: true,
    });
    expect(previewRecord?.component).not.toBe(baseBuilderRecord?.component);
    expect(String(previewRecord?.component)).toContain("AssetLibraryView.vue");
  });

  it("resolves the Theme Board as an isolated Builder development preview", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/theme-board");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-theme-board",
    );

    expect(preview.name).toBe("dev-theme-board");
    expect(preview.meta).toMatchObject({
      title: "Theme Board Development Preview",
      environment: "development",
      developmentPreview: true,
    });
    expect(String(previewRecord?.component)).toContain("ThemeBoardView.vue");
  });

  it("resolves the Room Shell Studio with the shared Builder preview boundary", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/room-shell-studio");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-room-shell-studio",
    );

    expect(preview.name).toBe("dev-room-shell-studio");
    expect(preview.meta).toMatchObject({
      title: "Room Shell Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    });
    expect(String(previewRecord?.component)).toContain("RoomShellStudioView.vue");
  });

  it("resolves the Object Studio with the shared Builder preview boundary", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/object-studio");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-object-studio",
    );

    expect(preview.name).toBe("dev-object-studio");
    expect(preview.meta).toMatchObject({
      title: "Object Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    });
    expect(String(previewRecord?.component)).toContain("ObjectStudioView.vue");
  });

  it("resolves the Looks Studio with the shared Builder preview boundary", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/looks-studio");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-looks-studio",
    );

    expect(preview.name).toBe("dev-looks-studio");
    expect(preview.meta).toMatchObject({
      title: "Looks Studio Development Preview",
      environment: "development",
      developmentPreview: true,
    });
    expect(String(previewRecord?.component)).toContain("LooksStudioView.vue");
  });

  it("resolves Showcase with the shared Builder preview boundary", () => {
    const router = createCosmosRouter({ history: createMemoryHistory() });
    const preview = router.resolve("/dev/showcase");
    const previewRecord = routeRecords.find(
      (record) => record.name === "dev-showcase",
    );

    expect(preview.name).toBe("dev-showcase");
    expect(preview.meta).toMatchObject({
      title: "Showcase Development Preview",
      environment: "development",
      developmentPreview: true,
    });
    expect(String(previewRecord?.component)).toContain("ShowcaseView.vue");
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
