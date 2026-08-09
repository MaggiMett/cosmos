import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileScript, compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./RoomCompositionPreviewView.vue",
  "./RoomCompositionShadowRenderer.vue",
  "./RoomShadowShape.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Room Composition Shadow Preview boundary", () => {
  it.each(files)("compiles %s without script or template errors", (path) => {
    const descriptor = parse(sourceFor(path), { filename: path }).descriptor;
    if (descriptor.scriptSetup) compileScript(descriptor, { id: `room-shadow-${path}` });
    if (!descriptor.template) throw new Error(`${path} template missing.`);
    expect(compileTemplate({
      id: `room-shadow-${path}`,
      filename: path,
      source: descriptor.template.content,
    }).errors).toEqual([]);
  });

  it("keeps the Renderer API limited to ImmutableRoomSnapshot", () => {
    const renderer = sourceFor("./RoomCompositionShadowRenderer.vue");

    expect(renderer).toContain("snapshot: Readonly<ImmutableRoomSnapshot>");
    expect(renderer).toContain("projectRoomCompositionForShadowRender(props.snapshot)");
    expect(renderer).not.toContain("useCosmosRuntime");
    expect(renderer).not.toContain("BaseSnapshot");
    expect(renderer).not.toContain("runtimeBindings");
    expect(renderer).not.toContain("useRouter");
  });

  it("makes all rendered Composition content passive and inaccessible as controls", () => {
    const renderer = sourceFor("./RoomCompositionShadowRenderer.vue");

    expect(renderer).toContain('aria-hidden="true"');
    expect(renderer).toContain('focusable="false"');
    expect(renderer).toContain("pointer-events: none");
    expect(renderer).not.toContain("<button");
    expect(renderer).not.toContain("tabindex");
    expect(renderer).not.toMatch(/@(click|keydown|pointer|contextmenu)/);
  });

  it("uses only the real Base load → Shadow resolver → Snapshot renderer flow", () => {
    const view = sourceFor("./RoomCompositionPreviewView.vue");

    expect(view).toContain("loadBaseRuntimeSnapshot(runtime.base)");
    expect(view).toContain("runBaseMainRoomShadowMode({ baseSnapshot: snapshot })");
    expect(view).toContain(':snapshot="shadow.snapshot"');
    expect(view).not.toContain("fixture");
    expect(view).not.toContain("fetch(");
  });

  it("does not expose Runtime writes, navigation, Persistence or interaction handlers", () => {
    const combined = files.map(sourceFor).join("\n");

    for (const forbidden of [
      "runtime.base.select",
      "runtime.base.setNotificationAvailable",
      "useRouter",
      "router.push",
      "openWorkspace",
      "openCompanion",
      "openContextMenu",
      "localStorage",
      "sessionStorage",
      "POST",
      "PATCH",
      "DELETE",
    ]) {
      expect(combined).not.toContain(forbidden);
    }
  });

  it("keeps the productive Base Presenter independent from the Preview", () => {
    const presenter = readFileSync(
      fileURLToPath(new URL("../../views/BasePresenterView.vue", import.meta.url)),
      "utf8",
    );
    const productive = readFileSync(
      fileURLToPath(new URL("../base-runtime/BaseRuntimeView.vue", import.meta.url)),
      "utf8",
    );

    expect(presenter).not.toContain("room-composition-preview");
    expect(productive).not.toContain("RoomCompositionShadowRenderer");
    expect(productive).not.toContain("RoomCompositionPreviewView");
  });
});
