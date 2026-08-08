<template>
  <ThemeBuilderShell
    class="release-shell"
    active-studio="release"
    studio-label="Release"
  >
    <div class="release-studio" data-testid="release-studio-view">
      <ReleasePackHero />

      <section class="release-studio__section" aria-labelledby="included-content-title">
        <h2 id="included-content-title" class="builder-serif">Included Content</h2>
        <ReleaseContentGrid :items="contentItems" />
      </section>

      <section class="release-studio__section" aria-labelledby="validation-title">
        <h2 id="validation-title" class="builder-serif">Validation</h2>
        <ReleaseValidationGrid :items="validationItems" />
      </section>

      <section class="release-studio__section" aria-labelledby="release-notes-title">
        <h2 id="release-notes-title" class="builder-serif">Release Notes</h2>
        <ReleaseNotesPanel />
      </section>
    </div>
  </ThemeBuilderShell>
</template>

<script setup lang="ts">
import "./themeBuilder.css";

import ReleaseContentGrid, {
  type ReleaseContentItem,
} from "./components/ReleaseContentGrid.vue";
import ReleaseNotesPanel from "./components/ReleaseNotesPanel.vue";
import ReleasePackHero from "./components/ReleasePackHero.vue";
import ReleaseValidationGrid, {
  type ReleaseValidationItem,
} from "./components/ReleaseValidationGrid.vue";
import ThemeBuilderShell from "./components/ThemeBuilderShell.vue";

const contentItems: readonly ReleaseContentItem[] = [
  { label: "Room Shells", count: 3, icon: "room" },
  { label: "Object Templates", count: 8, icon: "object" },
  { label: "Looks", count: 6, icon: "looks" },
  { label: "Materials", count: 14, icon: "material" },
  { label: "Animations", count: 3, icon: "motion" },
  { label: "Assets", count: 42, icon: "library" },
];

const validationItems: readonly ReleaseValidationItem[] = [
  {
    label: "Must Fix",
    description: "Nothing is blocking this release.",
    action: false,
    clear: true,
  },
  {
    label: "Needs Attention",
    description: "One background still uses the Core version.",
    action: true,
  },
  {
    label: "Recommendations",
    description: "Add a Hover look to Meridian Console.",
    action: true,
  },
  {
    label: "Uses Core Fallback",
    description: "Pearl Glass is used in one optional slot.",
    action: true,
  },
];
</script>

<style scoped>
.release-shell {
  grid-template-columns: 72px minmax(0, 1fr) 0;
}

.release-shell :deep(.builder-shell__canvas) {
  overflow: hidden;
}

.release-shell :deep(.builder-shell__context) {
  display: none;
}

.release-studio {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 14px 16px 16px;
  box-sizing: border-box;
  grid-template-rows:
    minmax(250px, 1.45fr)
    minmax(170px, 1fr)
    minmax(95px, 0.55fr)
    minmax(112px, 0.65fr);
  gap: 10px;
}

.release-studio__section {
  display: grid;
  min-width: 0;
  min-height: 0;
  grid-template-rows: 24px minmax(0, 1fr);
  gap: 4px;
}

.release-studio__section h2 {
  margin: 0 0 0 3px;
  align-self: center;
  color: var(--builder-text);
  font-size: 1.04rem;
  font-weight: 400;
  line-height: 1;
}
</style>
