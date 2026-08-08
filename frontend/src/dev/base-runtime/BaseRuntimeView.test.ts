import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileScript, compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./BaseRuntimeView.vue",
  "./components/BaseRuntimeChrome.vue",
  "./components/BaseRuntimeWindow.vue",
  "./components/BaseKnowledgeWindow.vue",
  "./components/BaseCaptureWindow.vue",
  "./components/BaseCompanionPresence.vue",
  "./components/BaseRoomScene.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Base Main Room Runtime visual slice", () => {
  it.each(files)("compiles %s without script or template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    if (descriptor.scriptSetup) compileScript(descriptor, { id: `base-runtime-${path}` });
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);
    const compiled = compileTemplate({
      id: `base-runtime-${path}`,
      filename: path,
      source: template.content,
    });
    expect(compiled.errors).toEqual([]);
  });

  it("reuses Cosmos navigation and excludes Builder infrastructure", () => {
    const combined = files.map(sourceFor).join("\n");
    const chrome = sourceFor("./components/BaseRuntimeChrome.vue");

    expect(chrome).toContain("<CosmosNavigation");
    expect(combined).not.toContain("ThemeBuilderShell");
    expect(combined).not.toContain("StudioRail");
    expect(combined).not.toContain("BuilderTopNavigation");
    expect(combined).not.toContain("themeBuilder.css");
  });

  it("projects real location, Room target and Companion state into existing edge chrome", () => {
    const view = sourceFor("./BaseRuntimeView.vue");
    const chrome = sourceFor("./components/BaseRuntimeChrome.vue");

    expect(view).toContain(':current-location="presentation.currentLocation"');
    expect(view).toContain(':right-neighbor="rightNeighbor"');
    expect(view).toContain("presentation.room.companion");
    expect(chrome).toContain("Local · Synced");
    expect(chrome).toContain("roomStatus");
    expect(chrome).toContain("Companion unavailable");
    expect(chrome).toContain("disabled");
  });

  it("keeps the room primary while rendering only projected Runtime entities", () => {
    const room = sourceFor("./components/BaseRoomScene.vue");

    expect(room).toContain(':data-room-id="room.objectId"');
    expect(room).toContain('v-if="room.cockpit"');
    expect(room).toContain('v-for="door in room.doorTargets"');
    expect(room).toContain(':data-door-id="door.objectId"');
    expect(room).toContain(':data-target-room-id="door.targetRoomId"');
    expect(room).toContain('v-for="slot in room.workspaceSlots"');
    expect(room).toContain(':data-slot-id="slot.slotObjectId"');
    expect(room).toContain(':data-workspace-id="slot.workspaceObjectId"');
    expect(room).toContain(':companion="room.companion"');
  });

  it("uses real Workspace summaries in the existing Knowledge and Capture windows", () => {
    const knowledge = sourceFor("./components/BaseKnowledgeWindow.vue");
    const capture = sourceFor("./components/BaseCaptureWindow.vue");

    expect(knowledge).toContain("workspace.displayName");
    expect(knowledge).toContain("workspace.sourceProjectId");
    expect(knowledge).toContain("Knowledge Workspace unavailable");
    expect(capture).toContain("workspace.displayName");
    expect(capture).toContain("workspace.sourceProjectId");
    expect(capture).toContain("Creation Workspace unavailable");
    for (const fixture of [
      "Orbital Architecture",
      "Recent Research",
      "Habitat Materials",
      "Celestial Mechanics",
      "Material Study 07",
    ]) {
      expect(`${knowledge}\n${capture}`).not.toContain(fixture);
    }
  });

  it("loads through useCosmosRuntime but remains read-only and asset-free", () => {
    const combined = files.map(sourceFor).join("\n");
    const view = sourceFor("./BaseRuntimeView.vue");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(view).toContain("useCosmosRuntime");
    expect(view).toContain("loadBaseRuntimeSnapshot(runtime.base)");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("@pointerdown");
    expect(combined).not.toContain("@click");
    expect(combined).not.toContain("router.push");
    expect(combined).not.toContain("runtime.base.select");
    expect(combined).not.toContain("runtime.windows");
    expect(combined).not.toContain("runtime.workspaces");
    expect(combined).not.toContain("runtime.transitions");
    expect(combined).not.toContain("runtime.objectInteractions");
    expect(combined).not.toContain("CosmosMapRuntime");
    expect(combined).not.toContain("moveNode");
  });

  it("contains quiet Loading, Error and Empty states", () => {
    const view = sourceFor("./BaseRuntimeView.vue");

    expect(view).toContain("Loading Base");
    expect(view).toContain("Base is unavailable");
    expect(view).toContain("Base is quiet");
    expect(view).toContain("presentation.phase === 'success'");
  });
});
