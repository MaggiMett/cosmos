<template>
  <ThemeBuilderShell
    class="showcase-shell"
    active-studio="showcase"
    studio-label="Showcase"
  >
    <ShowcaseTopActions />
    <ShowcasePreview />
  </ThemeBuilderShell>
</template>

<script setup lang="ts">
import "./themeBuilder.css";

import ShowcasePreview from "./components/ShowcasePreview.vue";
import ShowcaseTopActions from "./components/ShowcaseTopActions.vue";
import ThemeBuilderShell from "./components/ThemeBuilderShell.vue";
</script>

<style scoped>
.showcase-shell {
  position: relative;
  grid-template-columns: 72px minmax(0, 1fr) 0;
}

.showcase-shell :deep(.builder-shell__canvas) {
  overflow: visible;
}

.showcase-shell :deep(.builder-shell__context) {
  display: none;
}

.showcase-shell :deep(.builder-topbar__history),
.showcase-shell :deep(.builder-topbar__actions) {
  display: none;
}

.showcase-shell :deep(.builder-topbar) {
  grid-template-columns: minmax(260px, 1fr);
}
</style>
