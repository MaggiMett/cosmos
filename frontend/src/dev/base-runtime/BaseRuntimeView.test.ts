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
    expect(chrome).toContain(':disabled="!companion"');
    expect(chrome).toContain("@travel=\"$emit('travel-room', $event)\"");
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
    expect(room).toContain("<button");
    expect(room).toContain("@click=\"door.targetRoomId && $emit('travel-room', door.targetRoomId)\"");
    expect(room).toContain("@click=\"$emit('open-workspace', slot)\"");
    expect(room).toContain(':disabled="!slot.workspaceObjectId"');
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

  it("uses only existing Router and Runtime interaction paths and remains asset-free", () => {
    const combined = files.map(sourceFor).join("\n");
    const view = sourceFor("./BaseRuntimeView.vue");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(view).toContain("useCosmosRuntime");
    expect(view).toContain("loadBaseRuntimeSnapshot(runtime.base)");
    expect(view).toContain("navigateToBaseRoom(router, runtime.base");
    expect(view).toContain("navigateToBaseWorkspace(router, runtime.base");
    expect(view).toContain("<CompanionWindowHost");
    expect(view).toContain("companionWindowHost.value?.open()");
    expect(view).toContain("<ObjectInteractionHost");
    expect(view).toContain('openObject(objectId, "details")');
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("@pointerdown");
    expect(combined).not.toContain("runtime.transitions");
    expect(combined).not.toContain("CosmosMapRuntime");
    expect(combined).not.toContain("moveNode");
  });

  it("keeps keyboard activation native and visually distinguishes focus", () => {
    const room = sourceFor("./components/BaseRoomScene.vue");
    const companion = sourceFor("./components/BaseCompanionPresence.vue");
    const chrome = sourceFor("./components/BaseRuntimeChrome.vue");

    expect(room).toContain('type="button"');
    expect(companion).toContain('type="button"');
    expect(room).toContain(":focus-visible");
    expect(companion).toContain(":focus-visible");
    expect(chrome).toContain(":focus-visible");
    expect(`${room}\n${companion}\n${chrome}`).not.toContain("tabindex");
    expect(`${room}\n${companion}\n${chrome}`).not.toContain("@keydown");
  });

  it("reuses the productive Workspace and Window lifecycle rather than duplicating it", () => {
    const view = sourceFor("./BaseRuntimeView.vue");
    const workspaceView = readFileSync(
      fileURLToPath(new URL("../../views/WorkspaceView.vue", import.meta.url)),
      "utf8",
    );
    const companionHost = readFileSync(
      fileURLToPath(new URL("../../components/cosmos/CompanionWindowHost.vue", import.meta.url)),
      "utf8",
    );

    expect(view).toContain("navigateToBaseWorkspace");
    expect(workspaceView).toContain("runtime.workspaces.open");
    expect(workspaceView).toContain("runtime.tools.loadDefinitions()");
    expect(workspaceView).toContain("runtime.tools");
    expect(companionHost).toContain("runtime.windows.open");
    expect(companionHost).toContain("runtime.windows.focus");
    expect(view).not.toContain("runtime.workspaces.open");
    expect(view).not.toContain("runtime.windows.open");
    expect(view).not.toContain("runtime.tools.open");
  });

  it("leaves the productive BaseView interaction contract intact", () => {
    const baseView = readFileSync(
      fileURLToPath(new URL("../../views/BaseView.vue", import.meta.url)),
      "utf8",
    );

    expect(baseView).toContain("runtime.base.select(objectId)");
    expect(baseView).toContain('router.push(`/workspaces/${slot.workspace.objectId}`)');
    expect(baseView).toContain("companionWindowHost.value?.open()");
    expect(baseView).toContain("travelThroughDoor");
  });

  it("contains quiet Loading, Error and Empty states", () => {
    const view = sourceFor("./BaseRuntimeView.vue");

    expect(view).toContain("Loading Base");
    expect(view).toContain("Base is unavailable");
    expect(view).toContain("Base is quiet");
    expect(view).toContain("presentation.phase === 'success'");
  });
});
