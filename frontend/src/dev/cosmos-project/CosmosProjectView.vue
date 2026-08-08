<template>
  <section class="cosmos-project-view environment-view" aria-label="Asteria Project Cosmos" data-testid="cosmos-project-view">
    <div class="cosmos-project-view__stars cosmos-project-view__stars--distant" aria-hidden="true" />
    <div class="cosmos-project-view__stars cosmos-project-view__stars--near" aria-hidden="true" />
    <AsteriaConstellation />
    <ProjectCosmosChrome />
    <ProjectCosmosControls />
  </section>
</template>

<script setup lang="ts">
import AsteriaConstellation from "./components/AsteriaConstellation.vue";
import ProjectCosmosChrome from "./components/ProjectCosmosChrome.vue";
import ProjectCosmosControls from "./components/ProjectCosmosControls.vue";
</script>

<style scoped>
.cosmos-project-view {
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 49%, rgba(33, 80, 103, 0.13), transparent 39%),
    radial-gradient(ellipse at 68% 28%, rgba(47, 62, 101, 0.08), transparent 30%),
    linear-gradient(145deg, #010309, #030811 54%, #010308);
  color: var(--cosmos-color-text);
}

.cosmos-project-view::after {
  position: absolute;
  z-index: 20;
  inset: 0;
  background: radial-gradient(ellipse at 50% 49%, transparent 45%, rgba(0, 2, 7, 0.32) 100%);
  content: "";
  pointer-events: none;
}

.cosmos-project-view__stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cosmos-project-view__stars--distant {
  background-image:
    radial-gradient(circle, rgba(226, 236, 243, 0.58) 0 0.65px, transparent 1px),
    radial-gradient(circle, rgba(111, 180, 214, 0.34) 0 0.7px, transparent 1.1px),
    radial-gradient(circle, rgba(210, 217, 222, 0.22) 0 0.6px, transparent 1px);
  background-position: 8px 18px, 58px 72px, 106px 31px;
  background-size: 67px 67px, 113px 113px, 173px 173px;
  opacity: 0.62;
}

.cosmos-project-view__stars--near {
  background-image: radial-gradient(circle, rgba(244, 249, 252, 0.84) 0 1px, transparent 1.55px);
  background-position: 31px 12px;
  background-size: 209px 209px;
  opacity: 0.34;
}
</style>
