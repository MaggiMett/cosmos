import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./ShowcaseView.vue",
  "./components/ShowcaseTopActions.vue",
  "./components/ShowcasePreviewControls.vue",
  "./components/ShowcasePreview.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Showcase vertical slice", () => {
  it.each(files)("compiles %s without template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `showcase-${path}`,
      filename: path,
      source: template.content,
    });

    expect(compiled.errors).toEqual([]);
  });

  it("reuses the Builder shell and retains the Showcase rail location", () => {
    const source = sourceFor("./ShowcaseView.vue");

    expect(source).toContain("<ThemeBuilderShell");
    expect(source).toContain('active-studio="showcase"');
    expect(source).toContain('studio-label="Showcase"');
    expect(source).not.toContain("<StudioRail");
    expect(source).not.toContain("<BuilderTopNavigation");
  });

  it("renders the complete floating preview control and top action vocabulary", () => {
    const controls = sourceFor("./components/ShowcasePreviewControls.vue");
    const actions = sourceFor("./components/ShowcaseTopActions.vue");

    expect(controls).toContain("Cosmos");
    expect(controls).toContain("Base");
    expect(controls).toContain("Room");
    expect(controls).toContain("Object");
    expect(controls).toContain("Responsive");
    expect(actions).toContain("Compare Core Default");
    expect(actions).toContain("Focus Mode");
    expect(actions).toContain("Exit Preview");
  });

  it("does not render Builder side panels, inspectors, shelves, or drawers", () => {
    const source = sourceFor("./ShowcaseView.vue");

    expect(source).not.toContain("ContextPanel");
    expect(source).not.toContain("Inspector");
    expect(source).not.toContain("AssetShelfBar");
    expect(source).not.toContain("BottomDrawer");
    expect(source).not.toContain("<template #context>");
  });

  it("remains a neutral presentation-only preview", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).toContain("<NeutralVisualPlaceholder");
    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("background-image:");
    expect(combined).not.toContain("@click=");
    expect(combined).not.toContain("v-model");
  });
});
