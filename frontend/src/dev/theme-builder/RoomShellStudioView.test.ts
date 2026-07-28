import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./RoomShellStudioView.vue",
  "./components/BuilderSegmentedControl.vue",
  "./components/BuilderAccordionSection.vue",
  "./components/NeutralVisualPlaceholder.vue",
  "./components/AssetShelfBar.vue",
  "./components/RoomShellContextPanel.vue",
  "./components/RoomShellCanvas.vue",
  "./components/RoomShellInspector.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Room Shell Studio vertical slice", () => {
  it.each(files)("compiles %s without template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `room-shell-${path}`,
      filename: path,
      source: template.content,
    });

    expect(compiled.errors).toEqual([]);
  });

  it("reuses the existing Builder shell and studio rail selection", () => {
    const source = sourceFor("./RoomShellStudioView.vue");

    expect(source).toContain("<ThemeBuilderShell");
    expect(source).toContain('active-studio="templates"');
    expect(source).toContain('studio-label="Room Shell Studio"');
    expect(source).not.toContain("<StudioRail");
    expect(source).not.toContain("<BuilderTopNavigation");
  });

  it("composes the binding context, canvas, inspector, and closed shelf", () => {
    const source = sourceFor("./RoomShellStudioView.vue");
    const context = sourceFor("./components/RoomShellContextPanel.vue");
    const canvas = sourceFor("./components/RoomShellCanvas.vue");
    const inspector = sourceFor("./components/RoomShellInspector.vue");

    expect(source).toContain("<RoomShellContextPanel");
    expect(source).toContain("<RoomShellCanvas");
    expect(source).toContain("<RoomShellInspector");
    expect(source).toContain("<AssetShelfBar");
    expect(context).toContain("Room Shells");
    expect(context).toContain("Layer Bands");
    expect(context).toContain("Perspective Family");
    expect(canvas).toContain('active-option="Art"');
    expect(canvas).toContain("Structure");
    expect(canvas).toContain("Responsive");
    expect(canvas).toContain("100%");
    expect(inspector).toContain('title="Appearance"');
    expect(inspector).toContain('title="Layout"');
    expect(inspector).toContain('title="Surfaces"');
    expect(inspector).toContain('title="Background"');
    expect(inspector).toContain('title="Materials"');
  });

  it("keeps the slice presentation-only and free of generated assets", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("AssetCatalogRegistry");
    expect(combined).not.toContain("InteractionZone");
    expect(combined).not.toContain("FunctionBinding");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("background-image:");
  });
});
