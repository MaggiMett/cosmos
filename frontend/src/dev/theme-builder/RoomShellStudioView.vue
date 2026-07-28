<template>
  <ThemeBuilderShell active-studio="templates" studio-label="Room Shell Studio">
    <div class="room-shell-workspace" data-testid="room-shell-studio-view">
      <RoomShellContextPanel />
      <RoomShellCanvas />
      <div class="room-shell-workspace__shelf">
        <AssetShelfBar />
      </div>
    </div>

    <template #context>
      <RoomShellInspector />
    </template>
  </ThemeBuilderShell>
</template>

<script setup lang="ts">
import "./themeBuilder.css";

import AssetShelfBar from "./components/AssetShelfBar.vue";
import RoomShellCanvas from "./components/RoomShellCanvas.vue";
import RoomShellContextPanel from "./components/RoomShellContextPanel.vue";
import RoomShellInspector from "./components/RoomShellInspector.vue";
import ThemeBuilderShell from "./components/ThemeBuilderShell.vue";
</script>

<style scoped>
.room-shell-workspace {
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) 50px;
}

.room-shell-workspace > :deep(.room-shell-context) {
  grid-row: 1 / -1;
}

.room-shell-workspace__shelf {
  min-width: 0;
  padding: 0 12px 6px;
}

@media (max-width: 1280px) {
  .room-shell-workspace {
    grid-template-columns: 218px minmax(0, 1fr);
  }
}
</style>
