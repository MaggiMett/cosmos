import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./ThemeBoardView.vue",
  "./components/ThemeBuilderShell.vue",
  "./components/BuilderTopNavigation.vue",
  "./components/StudioRail.vue",
  "./components/HeroCard.vue",
  "./components/MoodboardGrid.vue",
  "./components/ContinueWorking.vue",
  "./components/ThemeCoverage.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Theme Board vertical slice", () => {
  it.each(files)("compiles %s without template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `theme-board-${path}`,
      filename: path,
      source: template.content,
    });

    expect(compiled.errors).toEqual([]);
  });

  it("composes the required visual architecture from reusable components", () => {
    const source = sourceFor("./ThemeBoardView.vue");

    expect(source).toContain("<ThemeBuilderShell");
    expect(source).toContain("<HeroCard");
    expect(source).toContain("<MoodboardGrid");
    expect(source).toContain("<ContinueWorking");
    expect(source).toContain("<ThemeCoverage");
    expect(source).toContain('studio-label="Theme Board"');
  });

  it("keeps the Builder shell separate from Runtime navigation and state", () => {
    const source = sourceFor("./components/ThemeBuilderShell.vue");
    const railSource = sourceFor("./components/StudioRail.vue");
    const topbarSource = sourceFor("./components/BuilderTopNavigation.vue");

    expect(source).toContain('data-testid="theme-builder-shell"');
    expect(railSource).toContain('data-testid="studio-rail"');
    expect(topbarSource).toContain('data-testid="builder-top-navigation"');
    expect(source).toContain('data-testid="right-context-panel"');
    expect(source).not.toContain("ApplicationShell");
    expect(source).not.toContain("CosmosNavigation");
    expect(source).not.toContain("useCosmosRuntime");
  });

  it("uses explicit neutral presentation data without asset or backend wiring", () => {
    const source = sourceFor("./ThemeBoardView.vue");

    expect(source).toContain("Open draft");
    expect(source).toContain("Current session");
    expect(source).toContain("fallback");
    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("/api");
    expect(source).not.toContain("AssetCatalogRegistry");
  });
});
