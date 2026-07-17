<template>
  <section
    ref="viewportElement"
    class="cosmos-map environment-view"
    :class="{ 'cosmos-map--interacting': cameraDrag || nodeDrag }"
    aria-label="Cosmos Map"
    tabindex="0"
    @pointerdown="startCameraPan"
    @pointermove="continuePointerInteraction"
    @pointerup="finishPointerInteraction"
    @pointercancel="cancelPointerInteraction"
    @wheel.prevent="zoomAtPointer"
  >
    <div class="cosmos-map__stars cosmos-map__stars--distant" aria-hidden="true" />
    <div class="cosmos-map__stars cosmos-map__stars--near" aria-hidden="true" />

    <div v-if="state.phase === 'loading' || state.phase === 'idle'" class="map-status" role="status">
      <span class="map-status__orbit" aria-hidden="true" />
      <p>Charting your Cosmos…</p>
    </div>
    <div v-else-if="state.phase === 'failed'" class="map-status" role="alert">
      <p>{{ state.error }}</p>
      <button type="button" @click="load">Try again</button>
    </div>

    <template v-if="snapshot">
      <div class="cosmos-world" :style="worldStyle" aria-label="Project galaxies">
        <svg class="cosmos-connections" aria-hidden="true">
          <defs>
            <linearGradient
              v-for="connection in renderedConnections"
              :id="`gradient-${connection.objectId}`"
              :key="`gradient-${connection.objectId}`"
              gradientUnits="userSpaceOnUse"
              :x1="connection.x1"
              :y1="connection.y1"
              :x2="connection.x2"
              :y2="connection.y2"
            >
              <stop offset="0" :stop-color="connection.colorA" />
              <stop offset="1" :stop-color="connection.colorB" />
            </linearGradient>
          </defs>
          <path
            v-for="connection in renderedConnections"
            :key="connection.objectId"
            class="cosmos-connection"
            :class="`cosmos-connection--${connection.provenance}`"
            :d="connection.path"
            :stroke="`url(#gradient-${connection.objectId})`"
          />
        </svg>

        <article
          v-for="project in snapshot.projects"
          :key="project.objectId"
          class="project-galaxy"
          :class="{
            'project-galaxy--active': snapshot.focusedProjectId === project.objectId,
            'project-galaxy--selected': state.selectedObjectId === project.objectId,
          }"
          :style="projectStyle(project)"
          :aria-label="`${project.displayName} Project galaxy`"
        >
          <div class="project-galaxy__nebula" aria-hidden="true" />
          <button
            v-for="node in visibleNodes(project)"
            :key="node.objectId"
            class="cosmos-node"
            :class="[
              `cosmos-node--${node.hierarchyLevel.toLowerCase()}`,
              { 'cosmos-node--selected': state.selectedObjectId === node.objectId },
            ]"
            :style="nodeStyle(node, project)"
            type="button"
            :aria-label="`${node.displayName}, ${node.hierarchyLevel} Node`"
            :aria-pressed="state.selectedObjectId === node.objectId"
            @pointerdown.stop="startNodeDrag($event, node)"
            @click="activateNode($event, node)"
          >
            <span class="cosmos-node__hitbox">
              <span class="cosmos-node__star" aria-hidden="true" />
            </span>
            <span class="cosmos-node__label">{{ node.displayName }}</span>
          </button>
        </article>
      </div>

      <CosmosNavigation
        :current-location="currentLocation"
        :left-neighbor="neighbors.left"
        :right-neighbor="neighbors.right"
        :quick-travel-open="quickTravelOpen"
        @travel="travelToProject"
        @toggle-quick-travel="quickTravelOpen = !quickTravelOpen"
      />

      <aside v-if="quickTravelOpen" id="quick-travel" class="quick-travel" aria-label="Quick Travel">
        <header>
          <span>Quick Travel</span>
          <button type="button" aria-label="Close Quick Travel" @click="quickTravelOpen = false">×</button>
        </header>
        <button type="button" :aria-current="!snapshot.focusedProjectId" @click="travelToCosmos">
          <i class="quick-travel__cosmos" aria-hidden="true" />
          <span><strong>Cosmos</strong><small>Global view</small></span>
        </button>
        <button
          v-for="project in snapshot.projects"
          :key="project.objectId"
          type="button"
          :aria-current="snapshot.focusedProjectId === project.objectId"
          @click="travelToProject(project.objectId)"
        >
          <i :style="{ background: project.color, boxShadow: `0 0 14px ${project.color}` }" aria-hidden="true" />
          <span><strong>{{ project.displayName }}</strong><small>{{ project.vision }}</small></span>
        </button>
      </aside>

      <CosmosHomeHub @companion="openCompanion" @ship="openBase" />

      <CompanionConversation
        v-if="conversationWindow"
        :bounds="conversationWindow.bounds"
        :current-location="currentLocation"
        @close="closeCompanion"
        @focus="focusCompanion"
        @move="moveCompanion"
        @resize="resizeCompanion"
      />

      <p class="navigation-help" :class="{ 'navigation-help--visible': spaceHeld }">
        Hold Space and drag to move · Scroll to zoom
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import CompanionConversation from "../components/cosmos/CompanionConversation.vue";
import CosmosHomeHub from "../components/cosmos/CosmosHomeHub.vue";
import CosmosNavigation from "../components/cosmos/CosmosNavigation.vue";
import type { CosmosMapSnapshot, MapNode, MapProject } from "../runtime/cosmosMapRuntime";
import { useCosmosRuntime } from "../runtime/plugin";
import type { WindowBounds, WindowInstance } from "../runtime/windowRuntime";

const runtime = useCosmosRuntime();
const router = useRouter();
const state = runtime.cosmosMap.state;
const snapshot = computed(() => state.snapshot as CosmosMapSnapshot | null);
const viewportElement = ref<HTMLElement | null>(null);
const viewport = reactive({ width: window.innerWidth, height: window.innerHeight });
const spaceHeld = ref(false);
const quickTravelOpen = ref(false);
const cameraDrag = ref<PointerDrag | null>(null);
const nodeDrag = ref<NodeDrag | null>(null);
const conversationWindow = ref<Readonly<WindowInstance> | null>(null);
let resizeObserver: ResizeObserver | null = null;
let cameraSaveTimer: ReturnType<typeof setTimeout> | null = null;

interface PointerDrag {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startCameraX: number;
  startCameraY: number;
}

interface NodeDrag {
  pointerId: number;
  objectId: string;
  hierarchyLevel: MapNode["hierarchyLevel"];
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  moved: boolean;
}

const worldStyle = computed(() => {
  const camera = snapshot.value?.camera ?? { x: 0, y: 0, zoom: 1 };
  return {
    transform: `translate(${viewport.width / 2 - camera.x * camera.zoom}px, ${viewport.height / 2 - camera.y * camera.zoom}px) scale(${camera.zoom})`,
  };
});

const currentProject = computed(
  () =>
    snapshot.value?.projects.find(
      (project) => project.objectId === snapshot.value?.focusedProjectId,
    ) ?? null,
);
const currentLocation = computed(() => currentProject.value?.displayName ?? "Cosmos");

const neighbors = computed(() => {
  const projects = [...(snapshot.value?.projects ?? [])].sort((left, right) => left.x - right.x);
  const cameraX = snapshot.value?.camera.x ?? 0;
  if (currentProject.value) {
    const index = projects.findIndex((project) => project.objectId === currentProject.value?.objectId);
    return { left: projects[index - 1] ?? null, right: projects[index + 1] ?? null };
  }
  return {
    left: projects.filter((project) => project.x < cameraX).at(-1) ?? null,
    right: projects.find((project) => project.x > cameraX) ?? null,
  };
});

const renderedConnections = computed(() => {
  if (!snapshot.value) return [];
  const endpoints = new Map<string, { x: number; y: number; color: string }>();
  for (const project of snapshot.value.projects) {
    for (const node of project.nodes) endpoints.set(node.objectId, { x: node.x, y: node.y, color: project.color });
  }
  return snapshot.value.connections.flatMap((connection) => {
    const start = endpoints.get(connection.endpointAId);
    const end = endpoints.get(connection.endpointBId);
    if (!start || !end) return [];
    const bend = Math.min(44, Math.hypot(end.x - start.x, end.y - start.y) * 0.09);
    return [
      {
        ...connection,
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        colorA: start.color,
        colorB: end.color,
        path: `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${(start.y + end.y) / 2 - bend} ${end.x} ${end.y}`,
      },
    ];
  });
});

function load() {
  void runtime.cosmosMap.load().catch(() => undefined);
}

function projectStyle(project: MapProject) {
  return {
    left: `${project.x}px`,
    top: `${project.y}px`,
    "--project-color": project.color,
  };
}

function nodeStyle(node: MapNode, project: MapProject) {
  return { left: `${node.x - project.x}px`, top: `${node.y - project.y}px` };
}

function visibleNodes(project: MapProject): MapNode[] {
  const root = project.nodes.filter((node) => node.objectId === project.objectId);
  const previews = project.nodes.filter((node) => node.objectId !== project.objectId);
  return snapshot.value?.focusedProjectId === project.objectId ? [...root, ...previews] : [...root, ...previews.slice(0, 9)];
}

function startCameraPan(event: PointerEvent) {
  if (event.button !== 0 || !spaceHeld.value || !snapshot.value) return;
  event.preventDefault();
  viewportElement.value?.setPointerCapture(event.pointerId);
  cameraDrag.value = {
    pointerId: event.pointerId,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startCameraX: snapshot.value.camera.x,
    startCameraY: snapshot.value.camera.y,
  };
}

function startNodeDrag(event: PointerEvent, node: MapNode) {
  if (event.button !== 0 || spaceHeld.value || !snapshot.value) return;
  event.preventDefault();
  runtime.cosmosMap.select(node.objectId);
  viewportElement.value?.setPointerCapture(event.pointerId);
  nodeDrag.value = {
    pointerId: event.pointerId,
    objectId: node.objectId,
    hierarchyLevel: node.hierarchyLevel,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startX: node.x,
    startY: node.y,
    moved: false,
  };
}

function activateNode(event: MouseEvent, node: MapNode) {
  if (event.detail !== 0) return;
  runtime.cosmosMap.select(node.objectId);
  if (node.hierarchyLevel === "ProjectRoot") travelToProject(node.objectId);
}

function continuePointerInteraction(event: PointerEvent) {
  if (!snapshot.value) return;
  if (cameraDrag.value?.pointerId === event.pointerId) {
    const drag = cameraDrag.value;
    runtime.cosmosMap.setCamera({
      x: drag.startCameraX - (event.clientX - drag.startClientX) / snapshot.value.camera.zoom,
      y: drag.startCameraY - (event.clientY - drag.startClientY) / snapshot.value.camera.zoom,
      zoom: snapshot.value.camera.zoom,
    });
  } else if (nodeDrag.value?.pointerId === event.pointerId) {
    const drag = nodeDrag.value;
    const deltaX = (event.clientX - drag.startClientX) / snapshot.value.camera.zoom;
    const deltaY = (event.clientY - drag.startClientY) / snapshot.value.camera.zoom;
    if (Math.hypot(deltaX, deltaY) > 3) drag.moved = true;
    runtime.cosmosMap.moveNodeLocally(drag.objectId, drag.startX + deltaX, drag.startY + deltaY);
  }
}

function finishPointerInteraction(event: PointerEvent) {
  if (cameraDrag.value?.pointerId === event.pointerId) {
    cameraDrag.value = null;
    scheduleCameraSave();
  }
  if (nodeDrag.value?.pointerId === event.pointerId) {
    const drag = nodeDrag.value;
    nodeDrag.value = null;
    if (drag.moved) {
      void runtime.cosmosMap.persistNodePosition(drag.objectId).catch(() => load());
    } else if (drag.hierarchyLevel === "ProjectRoot") {
      travelToProject(drag.objectId);
    }
  }
  if (viewportElement.value?.hasPointerCapture(event.pointerId)) {
    viewportElement.value.releasePointerCapture(event.pointerId);
  }
}

function cancelPointerInteraction(event: PointerEvent) {
  cameraDrag.value = null;
  if (nodeDrag.value?.pointerId === event.pointerId) {
    nodeDrag.value = null;
    load();
  }
}

function zoomAtPointer(event: WheelEvent) {
  if (!snapshot.value || !viewportElement.value) return;
  const rect = viewportElement.value.getBoundingClientRect();
  const camera = snapshot.value.camera;
  const cursorX = event.clientX - rect.left - rect.width / 2;
  const cursorY = event.clientY - rect.top - rect.height / 2;
  const worldX = camera.x + cursorX / camera.zoom;
  const worldY = camera.y + cursorY / camera.zoom;
  const zoom = camera.zoom * Math.exp(-event.deltaY * 0.0012);
  const constrainedZoom = Math.min(2.4, Math.max(0.35, zoom));
  runtime.cosmosMap.setCamera({
    x: worldX - cursorX / constrainedZoom,
    y: worldY - cursorY / constrainedZoom,
    zoom: constrainedZoom,
  });
  scheduleCameraSave();
}

function travelToProject(projectId: string) {
  quickTravelOpen.value = false;
  runtime.cosmosMap.focusProject(projectId, viewport);
  runtime.cosmosMap.select(projectId);
  scheduleCameraSave();
}

function travelToCosmos() {
  quickTravelOpen.value = false;
  runtime.cosmosMap.focusCosmos(viewport);
  runtime.cosmosMap.select(null);
  scheduleCameraSave();
}

function scheduleCameraSave() {
  if (cameraSaveTimer) clearTimeout(cameraSaveTimer);
  cameraSaveTimer = setTimeout(() => {
    cameraSaveTimer = null;
    void runtime.cosmosMap.persistCamera().catch(() => undefined);
  }, 260);
}

function openCompanion() {
  if (conversationWindow.value) {
    focusCompanion();
    return;
  }
  const width = Math.min(520, viewport.width - 40);
  const height = Math.min(560, viewport.height - 160);
  conversationWindow.value = runtime.windows.open({
    objectId: "cosmos.window.tool.companion-conversation",
    role: "tool",
    title: "Companion",
    bounds: { x: Math.max(20, viewport.width - width - 54), y: 92, width, height },
    minimumSize: { width: 360, height: 360 },
  });
}

function closeCompanion() {
  if (!conversationWindow.value) return;
  runtime.windows.close(conversationWindow.value.objectId);
  conversationWindow.value = null;
}

function focusCompanion() {
  if (conversationWindow.value) conversationWindow.value = runtime.windows.focus(conversationWindow.value.objectId);
}

function moveCompanion(position: { x: number; y: number }) {
  if (conversationWindow.value) conversationWindow.value = runtime.windows.move(conversationWindow.value.objectId, position);
}

function resizeCompanion(size: { width: number; height: number }) {
  if (conversationWindow.value) conversationWindow.value = runtime.windows.resize(conversationWindow.value.objectId, size);
}

function openBase() {
  void router.push("/base");
}

function onKeyDown(event: KeyboardEvent) {
  if (event.code !== "Space" || isTextInput(event.target)) return;
  event.preventDefault();
  spaceHeld.value = true;
}

function onKeyUp(event: KeyboardEvent) {
  if (event.code === "Space") spaceHeld.value = false;
}

function onWindowBlur() {
  spaceHeld.value = false;
}

function isTextInput(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, [contenteditable='true']"));
}

onMounted(() => {
  load();
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onWindowBlur);
  if (viewportElement.value) {
    resizeObserver = new ResizeObserver(([entry]) => {
      viewport.width = entry.contentRect.width;
      viewport.height = entry.contentRect.height;
    });
    resizeObserver.observe(viewportElement.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("blur", onWindowBlur);
  resizeObserver?.disconnect();
  if (cameraSaveTimer) clearTimeout(cameraSaveTimer);
  if (conversationWindow.value) closeCompanion();
});
</script>

<style scoped>
.cosmos-map {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 18%, rgba(57, 45, 108, 0.12), transparent 28%),
    radial-gradient(circle at 74% 68%, rgba(10, 83, 112, 0.1), transparent 32%),
    #03050d;
  outline: none;
  touch-action: none;
}

.cosmos-map__stars {
  position: absolute;
  inset: -12%;
  pointer-events: none;
}

.cosmos-map__stars--distant {
  opacity: 0.52;
  background-image:
    radial-gradient(circle, rgba(226, 232, 240, 0.62) 0 1px, transparent 1.4px),
    radial-gradient(circle, rgba(125, 211, 252, 0.38) 0 1px, transparent 1.5px);
  background-position: 8px 18px, 58px 72px;
  background-size: 91px 91px, 137px 137px;
}

.cosmos-map__stars--near {
  opacity: 0.34;
  background-image: radial-gradient(circle, rgba(248, 250, 252, 0.85) 0 1.2px, transparent 1.7px);
  background-position: 31px 12px;
  background-size: 211px 211px;
  animation: stellar-drift 80s linear infinite;
}

.cosmos-world {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  transform-origin: 0 0;
  transition: transform 620ms cubic-bezier(0.22, 0.78, 0.18, 1);
}

.cosmos-map--interacting .cosmos-world {
  transition: none;
}

.project-galaxy {
  --project-color: #8b5cf6;
  position: absolute;
  width: 0;
  height: 0;
}

.project-galaxy__nebula {
  position: absolute;
  top: -175px;
  left: -205px;
  width: 410px;
  height: 350px;
  transform: rotate(-7deg);
  border-radius: 61% 39% 54% 46% / 41% 54% 46% 59%;
  background:
    radial-gradient(ellipse at 52% 48%, color-mix(in srgb, var(--project-color) 25%, transparent), transparent 54%),
    radial-gradient(ellipse at 30% 62%, color-mix(in srgb, var(--project-color) 14%, transparent), transparent 55%),
    radial-gradient(ellipse at 72% 32%, rgba(255, 255, 255, 0.045), transparent 42%);
  filter: blur(3px);
  opacity: 0.72;
  transition: filter 240ms ease, opacity 240ms ease, transform 500ms ease;
  animation: nebula-breathe 11s ease-in-out infinite alternate;
  pointer-events: none;
}

.project-galaxy--active .project-galaxy__nebula,
.project-galaxy--selected .project-galaxy__nebula {
  filter: blur(1px) brightness(1.22);
  opacity: 1;
}

.cosmos-node {
  position: absolute;
  z-index: 2;
  display: grid;
  width: 80px;
  height: 80px;
  padding: 0;
  place-items: center;
  transform: translate(-50%, -50%);
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #f8fafc;
  cursor: grab;
}

.cosmos-node:active { cursor: grabbing; }

.cosmos-node__hitbox {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  border-radius: 50%;
}

.cosmos-node__star {
  width: 17px;
  height: 17px;
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 50%;
  background: #f8fafc;
  box-shadow:
    0 0 5px #fff,
    0 0 15px var(--project-color),
    0 0 38px color-mix(in srgb, var(--project-color) 72%, transparent);
  transition: transform 160ms ease, box-shadow 160ms ease;
  animation: node-pulse 4.8s ease-in-out infinite;
}

.cosmos-node--projectroot .cosmos-node__star {
  width: 34px;
  height: 34px;
  background: radial-gradient(circle at 38% 32%, #fff, var(--project-color) 44%, #1e1b4b 100%);
}

.cosmos-node--domain .cosmos-node__star,
.cosmos-node--cluster .cosmos-node__star {
  width: 23px;
  height: 23px;
}

.cosmos-node--detail .cosmos-node__star {
  width: 11px;
  height: 11px;
}

.cosmos-node:hover .cosmos-node__star,
.cosmos-node:focus-visible .cosmos-node__star {
  transform: scale(1.18);
  box-shadow: 0 0 8px #fff, 0 0 24px var(--project-color), 0 0 54px var(--project-color);
}

.cosmos-node--selected .cosmos-node__hitbox {
  outline: 1px solid color-mix(in srgb, var(--project-color) 76%, white);
  outline-offset: -8px;
}

.cosmos-node__label {
  position: absolute;
  top: calc(50% + 27px);
  left: 50%;
  width: max-content;
  max-width: 190px;
  transform: translateX(-50%);
  color: rgba(241, 245, 249, 0.86);
  font-size: 0.72rem;
  font-weight: 520;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 7px #020617;
}

.cosmos-node--projectroot .cosmos-node__label {
  top: calc(50% + 35px);
  font-size: 0.84rem;
  font-weight: 620;
}

.cosmos-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  overflow: visible;
  pointer-events: none;
}

.cosmos-connection {
  fill: none;
  stroke-linecap: round;
  stroke-width: 2;
  opacity: 0.46;
  filter: drop-shadow(0 0 4px rgba(125, 211, 252, 0.32));
}

.cosmos-connection--semantic,
.cosmos-connection--discovery {
  stroke-width: 1;
  opacity: 0.2;
  stroke-dasharray: 7 8;
}

.map-status {
  position: absolute;
  z-index: 12;
  top: 50%;
  left: 50%;
  display: grid;
  transform: translate(-50%, -50%);
  place-items: center;
  color: #94a3b8;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}

.map-status__orbit {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(196, 181, 253, 0.32);
  border-top-color: #c4b5fd;
  border-radius: 50%;
  animation: orbit 1.2s linear infinite;
}

.map-status button {
  padding: 8px 13px;
  border: 1px solid rgba(226, 232, 240, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.quick-travel {
  position: fixed;
  z-index: 24;
  top: 88px;
  left: 50%;
  display: grid;
  width: min(390px, calc(100vw - 36px));
  max-height: min(520px, calc(100vh - 130px));
  padding: 8px;
  transform: translateX(-50%);
  overflow: auto;
  border: 1px solid rgba(226, 232, 240, 0.15);
  border-radius: 16px;
  background: rgba(7, 12, 29, 0.94);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(18px);
}

.quick-travel header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 9px 12px 13px;
  color: #94a3b8;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.quick-travel header button {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #cbd5e1;
  font-size: 1.1rem;
  cursor: pointer;
}

.quick-travel > button {
  display: grid;
  min-height: 58px;
  padding: 8px 10px;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 8px;
}

.quick-travel > button:hover,
.quick-travel > button:focus-visible,
.quick-travel > button[aria-current="true"] {
  border-color: rgba(196, 181, 253, 0.16);
  background: rgba(196, 181, 253, 0.07);
}

.quick-travel > button i {
  width: 9px;
  height: 9px;
  margin-left: 7px;
  border-radius: 50%;
}

.quick-travel__cosmos {
  border: 1px solid #94a3b8;
  background: transparent !important;
  box-shadow: 0 0 10px rgba(148, 163, 184, 0.4);
}

.quick-travel > button span {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.quick-travel strong,
.quick-travel small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-travel strong { font-size: 0.8rem; font-weight: 600; }
.quick-travel small { color: #64748b; font-size: 0.66rem; }

.navigation-help {
  position: fixed;
  z-index: 18;
  bottom: 24px;
  left: 50%;
  margin: 0;
  padding: 7px 12px;
  transform: translate(-50%, 8px);
  border: 1px solid rgba(226, 232, 240, 0.09);
  border-radius: 999px;
  background: rgba(3, 7, 18, 0.66);
  color: #64748b;
  font-size: 0.65rem;
  opacity: 0.44;
  transition: opacity 160ms ease, transform 160ms ease;
  pointer-events: none;
}

.navigation-help--visible {
  transform: translate(-50%, 0);
  color: #cbd5e1;
  opacity: 1;
}

@keyframes stellar-drift { to { transform: translate3d(80px, 46px, 0); } }
@keyframes nebula-breathe { to { transform: rotate(-4deg) scale(1.035); } }
@keyframes node-pulse { 50% { filter: brightness(1.18); } }
@keyframes orbit { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .cosmos-map__stars--near,
  .project-galaxy__nebula,
  .cosmos-node__star,
  .map-status__orbit {
    animation: none;
  }

  .cosmos-world {
    transition-duration: 1ms;
  }
}
</style>
