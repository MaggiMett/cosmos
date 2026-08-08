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

  it("contains the complete edge chrome and Main Room location", () => {
    const chrome = sourceFor("./components/BaseRuntimeChrome.vue");

    expect(chrome).toContain("Base · Main Room");
    expect(chrome).toContain("Workshop");
    expect(chrome).toContain("Local · Synced");
    expect(chrome).toContain("Base · Quiet mode");
    expect(chrome).toContain("Open Companion");
  });

  it("keeps the room as the primary composition", () => {
    const room = sourceFor("./components/BaseRoomScene.vue");

    expect(room).toContain("Integrated cockpit workspace");
    expect(room).toContain("Knowledge Workspace");
    expect(room).toContain("Creation and Capture Workspace");
    expect(room).toContain("Companion area");
    expect(room).toContain("Closed left room transition");
    expect(room).toContain("Closed right room transition");
  });

  it("contains the requested Knowledge window structure", () => {
    const knowledge = sourceFor("./components/BaseKnowledgeWindow.vue");

    expect(knowledge).toContain("Search your knowledge");
    expect(knowledge).toContain("Orbital Architecture");
    expect(knowledge).toContain("Recent Research");
    expect(knowledge).toContain("Habitat Materials");
    expect(knowledge).toContain("Celestial Mechanics");
  });

  it("contains the requested Capture and Companion summaries", () => {
    const capture = sourceFor("./components/BaseCaptureWindow.vue");
    const companion = sourceFor("./components/BaseCompanionPresence.vue");

    expect(capture).toContain("Material Study 07");
    expect(capture).toContain("Saved");
    expect(capture).toContain("Open");
    expect(companion).toContain("Ready when you are");
  });

  it("remains static, asset-free and free of window manipulation", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("useCosmosRuntime");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("@pointerdown");
    expect(combined).not.toContain("resize");
    expect(combined).not.toContain("drag");
    expect(combined).not.toContain("Map");
    expect(combined).not.toContain("Project");
    expect(combined).not.toContain("Node");
  });
});
