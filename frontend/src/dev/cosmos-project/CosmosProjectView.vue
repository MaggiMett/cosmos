<template>
  <section
    class="cosmos-project-view environment-view"
    :aria-label="`${presentation.projectName} Project Cosmos`"
    data-testid="cosmos-project-view"
  >
    <div class="cosmos-project-view__stars cosmos-project-view__stars--distant" aria-hidden="true" />
    <div class="cosmos-project-view__stars cosmos-project-view__stars--near" aria-hidden="true" />
    <AsteriaConstellation v-if="visibleProject" :project="visibleProject" />

    <div
      v-if="presentation.phase !== 'success'"
      class="cosmos-project-view__state"
      :class="`cosmos-project-view__state--${presentation.phase}`"
      :role="presentation.phase === 'error' ? 'alert' : 'status'"
      aria-live="polite"
      data-testid="project-cosmos-state"
    >
      <span aria-hidden="true" />
      <small>Cosmos · Project</small>
      <strong v-if="presentation.phase === 'loading'">Loading project cosmos</strong>
      <template v-else-if="presentation.phase === 'error'">
        <strong>Project cosmos is temporarily unavailable</strong>
        <p>{{ presentation.message }}</p>
      </template>
      <template v-else-if="presentation.phase === 'not-found'">
        <strong>Project not found</strong>
        <p>The requested Project is not available in this cosmos.</p>
      </template>
      <template v-else>
        <strong>This project is quiet</strong>
        <p>No project nodes are available yet.</p>
      </template>
    </div>

    <ProjectCosmosChrome
      :project-name="presentation.projectName"
      :object-count="presentation.objectCount"
      :phase="presentation.phase"
    />
    <ProjectCosmosControls
      :project-name="presentation.projectName"
      :zoom-label="presentation.zoomLabel"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useCosmosRuntime } from "../../runtime/plugin";
import AsteriaConstellation from "./components/AsteriaConstellation.vue";
import ProjectCosmosChrome from "./components/ProjectCosmosChrome.vue";
import ProjectCosmosControls from "./components/ProjectCosmosControls.vue";
import {
  loadProjectCosmosSnapshot,
  projectIdFromQuery,
  projectProjectCosmosState,
} from "./projectCosmosProjection";

const runtime = useCosmosRuntime();
const route = useRoute();
const mapState = runtime.cosmosMap.state;
const requestedProjectId = computed(() => projectIdFromQuery(route.query.projectId));
const presentation = computed(() =>
  projectProjectCosmosState(
    mapState.phase,
    mapState.snapshot,
    mapState.error,
    requestedProjectId.value,
  ),
);
const visibleProject = computed(() => {
  const state = presentation.value;
  return state.phase === "success" || state.phase === "empty-project" ? state.project : null;
});

onMounted(() => {
  void loadProjectCosmosSnapshot(runtime.cosmosMap).catch(() => undefined);
});
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

.cosmos-project-view__state {
  position: absolute;
  z-index: 8;
  top: 50%;
  left: 50%;
  display: grid;
  width: min(390px, calc(100vw - 48px));
  transform: translate(-50%, -50%);
  place-items: center;
  color: var(--cosmos-color-muted);
  text-align: center;
  gap: 9px;
}

.cosmos-project-view__state--empty-project {
  top: auto;
  bottom: 102px;
  transform: translateX(-50%);
}

.cosmos-project-view__state > span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cosmos-color-accent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--cosmos-color-accent) 52%, transparent);
  opacity: 0.72;
}

.cosmos-project-view__state small {
  color: var(--cosmos-color-faint);
  font-size: 0.57rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cosmos-project-view__state strong {
  color: var(--cosmos-color-text);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.3rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.cosmos-project-view__state p {
  max-width: 340px;
  margin: 0;
  color: var(--cosmos-color-muted);
  font-size: 0.68rem;
  line-height: 1.55;
}

.cosmos-project-view__state--loading > span {
  animation: project-cosmos-pulse 1.8s ease-in-out infinite;
}

.cosmos-project-view__state--error > span {
  background: #c79578;
  box-shadow: 0 0 16px rgba(199, 149, 120, 0.32);
}

@keyframes project-cosmos-pulse {
  50% { opacity: 0.28; transform: scale(0.72); }
}

@media (prefers-reduced-motion: reduce) {
  .cosmos-project-view__state--loading > span { animation: none; }
}
</style>
