<template>
  <ThemeBuilderShell active-studio="looks" studio-label="Looks Studio">
    <div class="looks-studio-workspace" data-testid="looks-studio-view">
      <LooksStudioContextPanel />
      <LooksStudioCanvas />
      <div class="looks-studio-workspace__shelf">
        <AssetShelfBar />
      </div>
    </div>

    <template #context>
      <LooksStudioInspector />
    </template>
  </ThemeBuilderShell>
</template>

<script setup lang="ts">
import "./themeBuilder.css";

import AssetShelfBar from "./components/AssetShelfBar.vue";
import LooksStudioCanvas from "./components/LooksStudioCanvas.vue";
import LooksStudioContextPanel from "./components/LooksStudioContextPanel.vue";
import LooksStudioInspector from "./components/LooksStudioInspector.vue";
import ThemeBuilderShell from "./components/ThemeBuilderShell.vue";
</script>

<style scoped>
.looks-studio-workspace {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  grid-template-columns: 286px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) 50px;
}

.looks-studio-workspace > :deep(.looks-context) {
  grid-row: 1 / -1;
}

.looks-studio-workspace__shelf {
  min-width: 0;
  padding: 0 12px 6px;
}

@media (max-width: 1280px) {
  .looks-studio-workspace {
    grid-template-columns: 250px minmax(0, 1fr);
  }
}
</style>
