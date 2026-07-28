import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./ObjectStudioView.vue",
  "./components/ObjectStudioContextPanel.vue",
  "./components/ObjectStudioCanvas.vue",
  "./components/ObjectStudioInspector.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Object Studio vertical slice", () => {
  it.each(files)("compiles %s without template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `object-studio-${path}`,
      filename: path,
      source: template.content,
    });

    expect(compiled.errors).toEqual([]);
  });

  it("uses only the existing Builder infrastructure around Object-specific regions", () => {
    const source = sourceFor("./ObjectStudioView.vue");

    expect(source).toContain("<ThemeBuilderShell");
    expect(source).toContain("<AssetShelfBar");
    expect(source).toContain('active-studio="templates"');
    expect(source).toContain('studio-label="Object Studio"');
    expect(source).not.toContain("<StudioRail");
    expect(source).not.toContain("<BuilderTopNavigation");
  });

  it("renders templates, layers, slots, variants, canvas modes and inspector sections", () => {
    const context = sourceFor("./components/ObjectStudioContextPanel.vue");
    const canvas = sourceFor("./components/ObjectStudioCanvas.vue");
    const inspector = sourceFor("./components/ObjectStudioInspector.vue");

    expect(context).toContain("Object Templates");
    expect(context).toContain("Layer");
    expect(context).toContain("Slots");
    expect(context).toContain("Variants");
    expect(context).toContain("Orbital Luminaire");
    expect(canvas).toContain("<BuilderSegmentedControl");
    expect(canvas).toContain('active-option="Art"');
    expect(canvas).toContain("Structure");
    expect(canvas).toContain("Responsive");
    expect(canvas).toContain("100%");
    expect(canvas).toContain("<NeutralVisualPlaceholder");
    expect(inspector).toContain('title="Appearance"');
    expect(inspector).toContain('title="Form"');
    expect(inspector).toContain('title="Materials"');
    expect(inspector).toContain('title="Surface Detail"');
    expect(inspector).toContain('title="Presentation"');
  });

  it("remains presentation-only without assets, Runtime, persistence, or behavior models", () => {
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
    expect(combined).not.toContain("Animation");
  });
});
