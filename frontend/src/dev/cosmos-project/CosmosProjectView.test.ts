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

  it("contains the Asteria project context and edge chrome", () => {
    const chrome = sourceFor("./components/ProjectCosmosChrome.vue");
    const controls = sourceFor("./components/ProjectCosmosControls.vue");

    expect(chrome).toContain("Asteria");
    expect(chrome).toContain("Global View");
    expect(chrome).toContain("Local · Synced");
    expect(chrome).toContain("32 objects");
    expect(controls).toContain("72%");
    expect(controls).toContain("Fit");
    expect(controls).toContain("Search / Focus");
  });

  it("presents every requested hierarchy example", () => {
    const constellation = sourceFor("./components/AsteriaConstellation.vue");

    expect(constellation).toContain("selected project core");
    expect(constellation).toContain("normal node");
    expect(constellation).toContain("focused node");
    expect(constellation).toContain("secondary node");
    for (const name of ["Research", "Design", "Assets", "Build", "Notes", "Archive"]) {
      expect(constellation).toContain(name);
    }
  });

  it("uses static SVG connections without introducing graph behavior", () => {
    const constellation = sourceFor("./components/AsteriaConstellation.vue");

    expect(constellation).toContain("<svg");
    expect(constellation).toContain("asteria-connection--primary");
    expect(constellation).toContain("asteria-connection--secondary");
    expect(constellation).not.toContain("v-for");
    expect(constellation).not.toContain("@click");
    expect(constellation).not.toContain("@pointer");
  });

  it("remains asset-free and disconnected from application behavior", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("useCosmosRuntime");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("drag");
    expect(combined).not.toContain("contextmenu");
    expect(combined).not.toContain("Workspace");
  });
});
