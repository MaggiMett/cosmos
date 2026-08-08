import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileScript, compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./ThemeLibraryView.vue",
  "./components/ThemeLibrarySystemHeader.vue",
  "./components/ThemeLibraryHero.vue",
  "./components/ThemeLibraryFilters.vue",
  "./components/ThemeLibraryGallery.vue",
  "./components/ThemeLibraryDetails.vue",
  "./components/ThemeLibraryEmptyState.vue",
  "./components/ThemeLibraryVisual.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Cosmos Theme Library vertical slice", () => {
  it.each(files)("compiles %s without script or template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    if (descriptor.scriptSetup) compileScript(descriptor, { id: `theme-library-${path}` });
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `theme-library-${path}`,
      filename: path,
      source: template.content,
    });
    expect(compiled.errors).toEqual([]);
  });

  it("reuses the normal Cosmos navigation and excludes Builder infrastructure", () => {
    const combined = files.map(sourceFor).join("\n");
    const header = sourceFor("./components/ThemeLibrarySystemHeader.vue");

    expect(header).toContain("<CosmosNavigation");
    expect(combined).not.toContain("ThemeBuilderShell");
    expect(combined).not.toContain("StudioRail");
    expect(combined).not.toContain("BuilderTopNavigation");
    expect(combined).not.toContain("themeBuilder.css");
  });

  it("contains active theme identity and all hero actions", () => {
    const hero = sourceFor("./components/ThemeLibraryHero.vue");

    expect(hero).toContain("Active Theme");
    expect(hero).toContain("Cosmos Reference");
    expect(hero).toContain("Version");
    expect(hero).toContain("Author");
    expect(hero).toContain("Customize Theme");
    expect(hero).toContain("Preview");
    expect(hero).toContain("Duplicate");
    expect(hero).toContain("Export");
  });

  it("contains search and the complete filter set", () => {
    const filters = sourceFor("./components/ThemeLibraryFilters.vue");

    expect(filters).toContain("Search installed themes");
    for (const label of ["Category", "Installed", "Favorites", "Recently Used", "Creator"]) {
      expect(filters).toContain(label);
    }
  });

  it("contains six themes and all requested status variants", () => {
    const view = sourceFor("./ThemeLibraryView.vue");

    for (const label of ["Cosmos Reference", "Minimal", "Nebula Garden", "Industrial", "Fantasy", "Pixel"]) {
      expect(view).toContain(label);
    }
    expect(view).toContain('status: "Active"');
    expect(view).toContain('status: "Installed"');
    expect(view).toContain('status: "Inactive"');
  });

  it("contains selected-theme details and actions", () => {
    const details = sourceFor("./components/ThemeLibraryDetails.vue");

    for (const label of ["Screenshots", "Included Content", "Version", "Author", "Changes", "Compatibility"]) {
      expect(details).toContain(label);
    }
    for (const action of ["Activate", "Customize", "Duplicate", "Export"]) {
      expect(details).toContain(action);
    }
  });

  it("implements the empty state on the same route", () => {
    const view = sourceFor("./ThemeLibraryView.vue");
    const empty = sourceFor("./components/ThemeLibraryEmptyState.vue");

    expect(view).toContain('route.query.state === "empty"');
    expect(view).toContain("0 themes");
    expect(empty).toContain("Create your first world.");
    expect(empty).toContain("New Theme");
    expect(empty).toContain("Import Theme Pack");
  });

  it("remains a static, asset-free system UI", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("Marketplace");
    expect(combined).not.toContain("Community");
  });
});
