import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./LooksStudioView.vue",
  "./components/LooksStudioContextPanel.vue",
  "./components/LooksStudioCanvas.vue",
  "./components/LooksStudioInspector.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Looks Studio vertical slice", () => {
  it.each(files)("compiles %s without template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `looks-studio-${path}`,
      filename: path,
      source: template.content,
    });

    expect(compiled.errors).toEqual([]);
  });

  it("uses the existing Builder shell and shared controls", () => {
    const source = sourceFor("./LooksStudioView.vue");
    const canvas = sourceFor("./components/LooksStudioCanvas.vue");
    const inspector = sourceFor("./components/LooksStudioInspector.vue");

    expect(source).toContain("<ThemeBuilderShell");
    expect(source).toContain("<AssetShelfBar");
    expect(source).toContain('active-studio="looks"');
    expect(source).toContain('studio-label="Looks Studio"');
    expect(canvas).toContain("<BuilderSegmentedControl");
    expect(canvas).toContain("<NeutralVisualPlaceholder");
    expect(inspector).toContain("<BuilderAccordionSection");
    expect(source).not.toContain("<StudioRail");
    expect(source).not.toContain("<BuilderTopNavigation");
  });

  it("renders all binding context groups, states, callouts, and inspector sections", () => {
    const context = sourceFor("./components/LooksStudioContextPanel.vue");
    const canvas = sourceFor("./components/LooksStudioCanvas.vue");
    const inspector = sourceFor("./components/LooksStudioInspector.vue");

    expect(context).toContain("Current Template");
    expect(context).toContain("Visual Slots");
    expect(context).toContain("Assigned Assets");
    expect(context).toContain("Variants");
    expect(context).toContain("States");
    expect(canvas).toContain("Frame");
    expect(canvas).toContain("Glass");
    expect(canvas).toContain("Light");
    expect(canvas).toContain("Decoration");
    expect(canvas).toContain("Default");
    expect(canvas).toContain("Hover");
    expect(canvas).toContain("Selected");
    expect(canvas).toContain("Disabled");
    expect(canvas).toContain("Idle");
    expect(canvas).toContain("100%");
    expect(inspector).toContain('title="Appearance"');
    expect(inspector).toContain("Material");
    expect(inspector).toContain("Finish");
    expect(inspector).toContain('title="Alignment"');
    expect(inspector).toContain('title="Fit"');
    expect(inspector).toContain('title="Overflow"');
    expect(inspector).toContain('title="Variant"');
    expect(inspector).toContain("Animate...");
  });

  it("remains presentation-only without assets, Runtime, persistence, or behavior", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("InteractionZone");
    expect(combined).not.toContain("FunctionBinding");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("background-image:");
    expect(combined).not.toContain("@drag");
    expect(combined).not.toContain("@click=");
    expect(combined).not.toContain("v-model");
  });
});
