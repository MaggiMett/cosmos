<template>
  <section
    class="base-runtime-view environment-view"
    :aria-label="viewLabel"
    :aria-hidden="backgroundOnly ? 'true' : undefined"
    :inert="backgroundOnly || undefined"
    data-testid="base-runtime-view"
  >
    <BaseRoomScene
      v-if="presentation.phase === 'success'"
      :room="presentation.room"
      :selected-object-id="baseState.selectedObjectId"
      @travel-room="travelToRoom"
      @open-workspace="openWorkspace"
      @open-companion="openCompanion"
      @open-object-context-menu="openObjectContextMenu"
    />
    <div
      v-else
      class="base-runtime-view__state"
      :class="`base-runtime-view__state--${presentation.phase}`"
      :role="presentation.phase === 'error' ? 'alert' : 'status'"
      aria-live="polite"
      data-testid="base-runtime-state"
    >
      <span aria-hidden="true" />
      <small>Base · Runtime</small>
      <strong v-if="presentation.phase === 'loading'">Loading Base</strong>
      <template v-else>
        <strong>{{ stateTitle }}</strong>
        <p>{{ presentation.message }}</p>
        <button v-if="presentation.phase === 'error'" type="button" @click="loadBase">Try again</button>
      </template>
    </div>
    <BaseRuntimeChrome
      v-if="!backgroundOnly"
      :current-location="presentation.currentLocation"
      :room-count="presentation.roomCount"
      :companion="presentation.phase === 'success' ? presentation.room.companion : null"
      :right-neighbor="rightNeighbor"
      @travel-room="travelToRoom"
      @open-companion="openCompanion"
      @close-base="closeBase"
    />
    <template v-if="presentation.phase === 'success'">
      <BaseKnowledgeWindow
        v-if="!backgroundOnly && presentation.room.slug === 'main'"
        class="base-runtime-view__knowledge"
        :workspace="presentation.room.knowledgeWorkspace"
      />
      <BaseCaptureWindow
        v-if="!backgroundOnly && presentation.room.slug === 'main'"
        class="base-runtime-view__capture"
        :workspace="presentation.room.creationWorkspace"
      />
      <CompanionWindowHost
        v-if="!backgroundOnly"
        ref="companionWindowHost"
        :current-location="presentation.room.displayName"
        :context="{ roomId: presentation.room.objectId, objectId: baseState.selectedObjectId }"
        @destination="openObject"
      />
      <ObjectInteractionHost v-if="!backgroundOnly" ref="objectInteractionHost" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CompanionWindowHost from "../../components/cosmos/CompanionWindowHost.vue";
import ObjectInteractionHost from "../../components/windows/ObjectInteractionHost.vue";
import { useCosmosRuntime } from "../../runtime/plugin";
import BaseCaptureWindow from "./components/BaseCaptureWindow.vue";
import BaseKnowledgeWindow from "./components/BaseKnowledgeWindow.vue";
import BaseRoomScene from "./components/BaseRoomScene.vue";
import BaseRuntimeChrome from "./components/BaseRuntimeChrome.vue";
import type { BaseWorkspaceSlotPresentation } from "./baseRuntimeProjection";
import {
  loadBaseRuntimeSnapshot,
  projectBaseRuntimeState,
  routeRoomParameterToSnapshotId,
} from "./baseRuntimeProjection";
import {
  type BaseNavigationScope,
  navigateFromBase,
  navigateToBaseRoom,
  navigateToBaseWorkspace,
} from "./baseRuntimeInteractions";
import { scheduleBaseRoomShadowDiagnostics } from "./baseRoomShadowDiagnostics";

const props = withDefaults(defineProps<{
  navigationScope?: BaseNavigationScope;
  backgroundOnly?: boolean;
}>(), {
  navigationScope: "development",
  backgroundOnly: false,
});

const runtime = useCosmosRuntime();
const route = useRoute();
const router = useRouter();
const baseState = runtime.base.state;
const companionWindowHost = ref<InstanceType<typeof CompanionWindowHost> | null>(null);
const objectInteractionHost = ref<InstanceType<typeof ObjectInteractionHost> | null>(null);
const requestedRoomId = computed(() => {
  if (props.navigationScope === "development") {
    const value = route.query.roomId;
    return typeof value === "string" && value.length > 0 ? value : null;
  }
  return routeRoomParameterToSnapshotId(
    baseState.snapshot,
    route.meta.environment === "room" ? route.params.roomId : null,
  );
});
const presentation = computed(() =>
  projectBaseRuntimeState(
    baseState.phase,
    baseState.snapshot,
    baseState.error,
    requestedRoomId.value,
  ),
);
const viewLabel = computed(() =>
  presentation.value.phase === "success"
    ? `${presentation.value.room.displayName} Runtime`
    : "Base Runtime",
);
const stateTitle = computed(() => {
  if (presentation.value.phase === "error") return "Base is unavailable";
  if (presentation.value.phase === "not-found") return "Room not found";
  return "Base is quiet";
});
const rightNeighbor = computed(() => {
  const state = presentation.value;
  if (state.phase !== "success") return null;
  const target = state.room.doorTargets.find((door) => door.targetRoomId && door.targetRoomName);
  return target?.targetRoomId && target.targetRoomName
    ? { objectId: target.targetRoomId, displayName: target.targetRoomName }
    : null;
});

function travelToRoom(targetRoomId: string) {
  if (props.backgroundOnly) return;
  const snapshot = baseState.snapshot;
  if (!snapshot) return;
  void navigateToBaseRoom(router, runtime.base, snapshot, targetRoomId, props.navigationScope);
}

function closeBase() {
  if (props.backgroundOnly) return;
  void navigateFromBase(router);
}

function openWorkspace(slot: Readonly<BaseWorkspaceSlotPresentation>) {
  if (props.backgroundOnly) return;
  void navigateToBaseWorkspace(router, runtime.base, slot);
}

function openCompanion() {
  if (props.backgroundOnly) return;
  companionWindowHost.value?.open();
}

function openObject(objectId: string) {
  if (props.backgroundOnly) return;
  void objectInteractionHost.value?.openObject(objectId, "details").catch(() => undefined);
}

function openObjectContextMenu(event: MouseEvent, objectId: string) {
  if (props.backgroundOnly) return;
  void objectInteractionHost.value
    ?.openContextMenu(objectId, { x: event.clientX, y: event.clientY })
    .catch(() => undefined);
}

function loadBase() {
  void loadBaseRuntimeSnapshot(runtime.base)
    .then(() => {
      scheduleBaseRoomShadowDiagnostics(runtime.base);
    })
    .catch(() => undefined);
}

onMounted(() => {
  loadBase();
});
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

.base-runtime-view__state {
  position: absolute;
  z-index: 8;
  top: 50%;
  left: 50%;
  display: grid;
  width: min(380px, calc(100vw - 48px));
  transform: translate(-50%, -50%);
  place-items: center;
  color: var(--cosmos-color-muted);
  text-align: center;
  gap: 9px;
}

.base-runtime-view__state > span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cosmos-color-accent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--cosmos-color-accent) 52%, transparent);
}

.base-runtime-view__state small {
  color: var(--cosmos-color-faint);
  font-size: 0.57rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.base-runtime-view__state strong {
  color: var(--cosmos-color-text);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.3rem;
  font-weight: 400;
}

.base-runtime-view__state p {
  margin: 0;
  font-size: 0.68rem;
  line-height: 1.55;
}

.base-runtime-view__state button {
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--cosmos-color-border-strong);
  border-radius: var(--cosmos-radius-control);
  background: rgba(10, 18, 26, 0.82);
  color: var(--cosmos-color-text);
  cursor: pointer;
  font: inherit;
}

.base-runtime-view__state button:focus-visible {
  outline: 2px solid var(--cosmos-color-accent);
  outline-offset: 2px;
}

.base-runtime-view__state--loading > span {
  animation: base-runtime-pulse 1.8s ease-in-out infinite;
}

.base-runtime-view__state--error > span {
  background: #c79578;
}

@keyframes base-runtime-pulse {
  50% { opacity: 0.28; transform: scale(0.72); }
}

@media (prefers-reduced-motion: reduce) {
  .base-runtime-view__state--loading > span { animation: none; }
}
</style>
