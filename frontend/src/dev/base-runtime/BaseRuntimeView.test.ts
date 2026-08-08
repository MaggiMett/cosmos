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
  "./components/BasePetPresence.vue",
  "./components/BaseRoomScene.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Base Room Runtime visual slice", () => {
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

  it("resolves Main and Workshop exclusively from the route query and Base projection", () => {
    const view = sourceFor("./BaseRuntimeView.vue");

    expect(view).toContain("useRoute()");
    expect(view).toContain("route.query.roomId");
    expect(view).toContain("requestedRoomId.value");
    expect(view).toContain('presentation.value.phase === "not-found"');
    expect(view).toContain('return "Room not found"');
    expect(view).not.toContain("ref<string");
    expect(view).not.toContain("selectedRoomId");
  });

  it("keeps Door travel inside the development presenter", () => {
    const view = sourceFor("./BaseRuntimeView.vue");
    const interactions = readFileSync(
      fileURLToPath(new URL("./baseRuntimeInteractions.ts", import.meta.url)),
      "utf8",
    );

    expect(view).toContain("targetRoomId, props.navigationScope");
    expect(interactions).toContain('path: "/dev/base-runtime"');
    expect(interactions).toContain("roomId: targetRoom.objectId");
    expect(interactions).not.toContain("room.workshop");
  });

  it("keeps the room primary while rendering only projected Runtime entities", () => {
    const room = sourceFor("./components/BaseRoomScene.vue");

    expect(room).toContain(':data-room-id="room.objectId"');
    expect(room).toContain(':class="`base-room-scene--${room.slug}`"');
    expect(room).toContain('v-if="room.cockpit"');
    expect(room).toContain('v-for="door in room.doorTargets"');
    expect(room).toContain(':data-door-id="door.objectId"');
    expect(room).toContain(':data-target-room-id="door.targetRoomId"');
    expect(room).toContain('v-for="slot in room.workspaceSlots"');
    expect(room).toContain(':data-slot-id="slot.slotObjectId"');
    expect(room).toContain(':data-workspace-id="slot.workspaceObjectId"');
    expect(room).toContain(':companion="room.companion"');
    expect(room).toContain(':pet="room.pet"');
    expect(room).toContain("<button");
    expect(room).toContain("@click=\"door.targetRoomId && $emit('travel-room', door.targetRoomId)\"");
    expect(room).toContain("@click=\"$emit('open-workspace', slot)\"");
    expect(room).toContain(':aria-pressed="selectedObjectId === slot.slotObjectId"');
    expect(room).toContain("placementClass(slot.placement)");
  });

  it("uses real Workspace summaries in the existing Knowledge and Capture windows", () => {
    const view = sourceFor("./BaseRuntimeView.vue");
    const knowledge = sourceFor("./components/BaseKnowledgeWindow.vue");
    const capture = sourceFor("./components/BaseCaptureWindow.vue");

    expect(knowledge).toContain("workspace.displayName");
    expect(knowledge).toContain("workspace.sourceProjectId");
    expect(knowledge).toContain("Knowledge Workspace unavailable");
    expect(capture).toContain("workspace.displayName");
    expect(capture).toContain("workspace.sourceProjectId");
    expect(capture).toContain("Creation Workspace unavailable");
    expect(view.match(/v-if="!backgroundOnly && presentation\.room\.slug === 'main'"/g)).toHaveLength(2);
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
    expect(view).toContain("navigateFromBase(router)");
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

  it("reuses the server-driven Object Context Menu for Base and Workspace objects", () => {
    const view = sourceFor("./BaseRuntimeView.vue");
    const room = sourceFor("./components/BaseRoomScene.vue");

    expect(room).toContain("@contextmenu.self.prevent");
    expect(room).toContain("room.baseObjectId");
    expect(room).toContain("@contextmenu.prevent.stop");
    expect(room).toContain("slot.workspaceObjectId ?? slot.slotObjectId");
    expect(view).toContain("objectInteractionHost.value");
    expect(view).toContain("?.openContextMenu(objectId");
    expect(view).toContain("x: event.clientX, y: event.clientY");
    expect(view).not.toContain("ContextMenuState");
    expect(view).not.toContain("ObjectAction");
  });

  it("projects the real Pet and preserves the Legacy greeting behavior", () => {
    const pet = sourceFor("./components/BasePetPresence.vue");

    expect(pet).toContain(':data-pet-id="pet.objectId"');
    expect(pet).toContain('`Pet ${pet.displayName}`');
    expect(pet).toContain("const greeting = ref(false)");
    expect(pet).toContain("greetingTimer = setTimeout");
    expect(pet).toContain("}, 1600)");
    expect(pet).toContain("onBeforeUnmount");
    expect(pet).not.toContain("cosmos.entity");
    expect(pet).not.toContain("runtime.");
  });

  it("retains Legacy retry, return-to-Cosmos and selected empty-Slot feedback", () => {
    const view = sourceFor("./BaseRuntimeView.vue");
    const room = sourceFor("./components/BaseRoomScene.vue");
    const chrome = sourceFor("./components/BaseRuntimeChrome.vue");

    expect(view).toContain('presentation.phase === \'error\'');
    expect(view).toContain('@click="loadBase"');
    expect(view).toContain('@close-base="closeBase"');
    expect(chrome).toContain('aria-label="Return to Cosmos"');
    expect(room).toContain("selectedSlot");
    expect(room).toContain("Available for a future Workspace");
  });

  it("keeps keyboard activation native and visually distinguishes focus", () => {
    const room = sourceFor("./components/BaseRoomScene.vue");
    const companion = sourceFor("./components/BaseCompanionPresence.vue");
    const chrome = sourceFor("./components/BaseRuntimeChrome.vue");

    expect(room).toContain('type="button"');
    expect(companion).toContain('type="button"');
    expect(sourceFor("./components/BasePetPresence.vue")).toContain('type="button"');
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
    expect(view).toContain("Room not found");
    expect(view).toContain("presentation.phase === 'success'");
  });
});
