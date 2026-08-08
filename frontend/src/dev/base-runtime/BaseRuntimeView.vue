<template>
  <section class="base-runtime-view environment-view" aria-label="Base Main Room Runtime" data-testid="base-runtime-view">
    <BaseRoomScene />
    <BaseRuntimeChrome />
    <BaseKnowledgeWindow class="base-runtime-view__knowledge" />
    <BaseCaptureWindow class="base-runtime-view__capture" />
  </section>
</template>

<script setup lang="ts">
import BaseCaptureWindow from "./components/BaseCaptureWindow.vue";
import BaseKnowledgeWindow from "./components/BaseKnowledgeWindow.vue";
import BaseRoomScene from "./components/BaseRoomScene.vue";
import BaseRuntimeChrome from "./components/BaseRuntimeChrome.vue";
</script>

<style scoped>
.base-runtime-view {
  overflow: hidden;
  background: #07090b;
  color: var(--cosmos-color-text);
}

.base-runtime-view__knowledge,
.base-runtime-view__capture {
  position: absolute;
  z-index: 22;
}

.base-runtime-view__knowledge {
  top: 126px;
  left: clamp(110px, 10.3vw, 165px);
  width: 298px;
  height: 370px;
}

.base-runtime-view__capture {
  top: 130px;
  right: clamp(108px, 10.2vw, 164px);
  width: 250px;
  height: 266px;
}
</style>
