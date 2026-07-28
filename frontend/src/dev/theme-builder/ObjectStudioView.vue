<template>
  <ThemeBuilderShell active-studio="templates" studio-label="Object Studio">
    <div class="object-studio-workspace" data-testid="object-studio-view">
      <ObjectStudioContextPanel />
      <ObjectStudioCanvas />
      <div class="object-studio-workspace__shelf">
        <AssetShelfBar />
      </div>
    </div>

    <template #context>
      <ObjectStudioInspector />
    </template>
  </ThemeBuilderShell>
</template>

<script setup lang="ts">
import "./themeBuilder.css";

import AssetShelfBar from "./components/AssetShelfBar.vue";
import ObjectStudioCanvas from "./components/ObjectStudioCanvas.vue";
import ObjectStudioContextPanel from "./components/ObjectStudioContextPanel.vue";
import ObjectStudioInspector from "./components/ObjectStudioInspector.vue";
import ThemeBuilderShell from "./components/ThemeBuilderShell.vue";
</script>

<style scoped>
.object-studio-workspace {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  grid-template-columns: 286px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) 50px;
}

.object-studio-workspace > :deep(.object-context) {
  grid-row: 1 / -1;
}

.object-studio-workspace__shelf {
  min-width: 0;
  padding: 0 12px 6px;
}

@media (max-width: 1280px) {
  .object-studio-workspace {
    grid-template-columns: 250px minmax(0, 1fr);
  }
}
</style>
