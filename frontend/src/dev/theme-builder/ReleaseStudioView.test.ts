import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compileScript, compileTemplate, parse } from "vue/compiler-sfc";
import { describe, expect, it } from "vitest";

const files = [
  "./ReleaseStudioView.vue",
  "./components/ReleasePackHero.vue",
  "./components/ReleaseContentGrid.vue",
  "./components/ReleaseValidationGrid.vue",
  "./components/ReleaseNotesPanel.vue",
] as const;

function sourceFor(path: (typeof files)[number]): string {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
}

describe("Release Studio vertical slice", () => {
  it.each(files)("compiles %s without script or template errors", (path) => {
    const source = sourceFor(path);
    const descriptor = parse(source, { filename: path }).descriptor;
    if (descriptor.scriptSetup) compileScript(descriptor, { id: `release-${path}` });
    const template = descriptor.template;
    expect(template).toBeDefined();
    if (template === null) throw new Error(`${path} template missing.`);

    const compiled = compileTemplate({
      id: `release-${path}`,
      filename: path,
      source: template.content,
    });

    expect(compiled.errors).toEqual([]);
  });

  it("reuses the Builder shell and Release rail location", () => {
    const source = sourceFor("./ReleaseStudioView.vue");

    expect(source).toContain("<ThemeBuilderShell");
    expect(source).toContain('active-studio="release"');
    expect(source).toContain('studio-label="Release"');
    expect(source).not.toContain("<StudioRail");
    expect(source).not.toContain("<BuilderTopNavigation");
  });

  it("contains the complete pack identity and health summary", () => {
    const hero = sourceFor("./components/ReleasePackHero.vue");

    expect(hero).toContain("Theme Name");
    expect(hero).toContain("Version");
    expect(hero).toContain("Pack Type");
    expect(hero).toContain("Health");
    expect(hero).toContain("Ready for Release");
  });

  it("contains every included content category", () => {
    const source = sourceFor("./ReleaseStudioView.vue");

    for (const label of [
      "Room Shells",
      "Object Templates",
      "Looks",
      "Materials",
      "Animations",
      "Assets",
    ]) {
      expect(source).toContain(label);
    }
  });

  it("contains the curated validation vocabulary", () => {
    const source = sourceFor("./ReleaseStudioView.vue");

    expect(source).toContain("Must Fix");
    expect(source).toContain("Needs Attention");
    expect(source).toContain("Recommendations");
    expect(source).toContain("Uses Core Fallback");
  });

  it("provides release notes and the correct completion actions", () => {
    const notes = sourceFor("./components/ReleaseNotesPanel.vue");

    expect(notes).toContain("Save Draft");
    expect(notes).toContain("Export Theme Pack");
    expect(notes).not.toContain("Activate");
    expect(notes).not.toContain("Publish");
  });

  it("uses neutral placeholders and remains UI-only", () => {
    const combined = files.map(sourceFor).join("\n");

    expect(combined).toContain("<NeutralVisualPlaceholder");
    expect(combined).not.toContain("fetch(");
    expect(combined).not.toContain("/api");
    expect(combined).not.toContain("localStorage");
    expect(combined).not.toContain("sessionStorage");
    expect(combined).not.toContain("<img");
    expect(combined).not.toContain("@click=");
    expect(combined).not.toContain("v-model");
  });
});
