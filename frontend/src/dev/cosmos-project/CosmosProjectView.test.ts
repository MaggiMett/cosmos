import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileScript, compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./CosmosProjectView.vue",
  "./components/ProjectCosmosChrome.vue",
  "./components/ProjectCosmosControls.vue",
  "./components/AsteriaConstellation.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Project Cosmos visual slice", () => {
  it.each(files)("compiles %s without script or template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    if (descriptor.scriptSetup) compileScript(descriptor, { id: `cosmos-project-${path}` });
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);
    const compiled = compileTemplate({
      id: `cosmos-project-${path}`,
      filename: path,
      source: template.content,
    });
    expect(compiled.errors).toEqual([]);
  });

  it("reuses Cosmos navigation and excludes Builder infrastructure", () => {
    const combined = files.map(sourceFor).join("\n");
    const chrome = sourceFor("./components/ProjectCosmosChrome.vue");

    expect(chrome).toContain("<CosmosNavigation");
    expect(combined).not.toContain("ThemeBuilderShell");
    expect(combined).not.toContain("StudioRail");
    expect(combined).not.toContain("BuilderTopNavigation");
    expect(combined).not.toContain("themeBuilder.css");
  });

  it("projects the requested real Project context into the existing edge chrome", () => {
    const view = sourceFor("./CosmosProjectView.vue");
    const chrome = sourceFor("./components/ProjectCosmosChrome.vue");
    const controls = sourceFor("./components/ProjectCosmosControls.vue");

    expect(view).toContain("route.query.projectId");
    expect(view).toContain("projectIdFromQuery");
    expect(chrome).toContain(":current-location=\"projectName\"");
    expect(chrome).toContain(':left-neighbor="globalNeighbor"');
    expect(chrome).toContain("@travel=\"$emit('back-to-global')\"");
    expect(view).toContain('@back-to-global="backToGlobal"');
    expect(view).toContain("navigateToGlobal(router)");
    expect(chrome).toContain("Local · Synced");
    expect(chrome).toContain("objectStatus");
    expect(controls).toContain("zoomLabel");
    expect(controls).toContain("projectName");
    expect(controls).toContain("Fit");
    expect(controls).toContain("Search / Focus");
  });

  it("renders only projected Project, Node and Selection data", () => {
    const constellation = sourceFor("./components/AsteriaConstellation.vue");

    expect(constellation).toContain("project.displayName");
    expect(constellation).toContain('v-for="node in project.nodes"');
    expect(constellation).toContain("node.isSelected");
    expect(constellation).toContain("project.isFocused");
    for (const name of ["Research", "Design", "Assets", "Build", "Notes", "Archive"]) {
      expect(constellation).not.toContain(name);
    }
  });

  it("projects real SVG connection paths without introducing graph behavior", () => {
    const constellation = sourceFor("./components/AsteriaConstellation.vue");

    expect(constellation).toContain("<svg");
    expect(constellation).toContain('v-for="connection in project.connections"');
    expect(constellation).toContain(":d=\"connection.path\"");
    expect(constellation).toContain("project-connection--semantic");
    expect(constellation).toContain("project-connection--structural");
    expect(constellation).not.toContain("@click");
    expect(constellation).not.toContain("@pointer");
  });

  it("loads through CosmosMapRuntime while remaining asset-free and read-only", () => {
    const combined = files.map(sourceFor).join("\n");
    const view = sourceFor("./CosmosProjectView.vue");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(view).toContain("useCosmosRuntime");
    expect(view).toContain("loadProjectCosmosSnapshot(runtime.cosmosMap)");
    expect(view).not.toContain("persistCamera");
    expect(view).not.toContain("persistNodePosition");
    expect(view).not.toContain("persistSelection");
    expect(view).not.toContain("focusProject");
    expect(view).not.toContain("focusCosmos");
    expect(view).not.toContain(".select(");
    expect(view).not.toContain(".setCamera(");
    expect(view).not.toContain(".moveNodeLocally(");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("drag");
    expect(combined).not.toContain("contextmenu");
    expect(combined).not.toContain("Workspace");
  });

  it("contains quiet Loading, Error, Not Found and Empty Project states", () => {
    const view = sourceFor("./CosmosProjectView.vue");

    expect(view).toContain("Loading project cosmos");
    expect(view).toContain("Project cosmos is temporarily unavailable");
    expect(view).toContain("Project not found");
    expect(view).toContain("No project nodes are available yet.");
  });
});
