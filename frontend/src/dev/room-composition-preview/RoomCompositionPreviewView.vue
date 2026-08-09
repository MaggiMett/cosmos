<template>
  <section
    class="room-composition-preview environment-view"
    aria-label="Room Composition Shadow Preview"
    data-testid="room-composition-preview"
  >
    <header class="room-composition-preview__header">
      <span>
        <small>Development Diagnostics</small>
        <strong>Room Composition Shadow Preview</strong>
      </span>
      <p>Read-only · Non-authoritative · Core fallback</p>
    </header>

    <div
      v-if="phase !== 'ready' || !shadow"
      class="room-composition-preview__state"
      :role="phase === 'error' ? 'alert' : 'status'"
      aria-live="polite"
    >
      <span aria-hidden="true" />
      <strong>{{ phase === "error" ? "Shadow preview unavailable" : "Resolving Main Room" }}</strong>
      <p v-if="error">{{ error }}</p>
    </div>

    <template v-else>
      <main class="room-composition-preview__stage">
        <RoomCompositionShadowRenderer :snapshot="shadow.snapshot" />
      </main>

      <aside class="room-composition-preview__diagnostics" aria-label="Shadow diagnostics">
        <dl>
          <div><dt>Room</dt><dd>{{ shadow.snapshot.roomId }}</dd></div>
          <div><dt>Parity</dt><dd :data-parity="shadow.parity.status">{{ shadow.parity.status }}</dd></div>
          <div><dt>Surfaces</dt><dd>{{ shadow.snapshot.surfaces.length }}</dd></div>
          <div><dt>Functions</dt><dd>{{ shadow.snapshot.functionContainers.length }}</dd></div>
          <div><dt>Visual source</dt><dd>{{ fallbackLabel }}</dd></div>
        </dl>
        <ul aria-label="Stable Runtime bindings">
          <li v-for="binding in shadow.runtimeBindings ?? []" :key="binding.containerInstanceId">
            <span>{{ binding.kind }}</span>
            <strong>{{ bindingLabel(binding) }}</strong>
          </li>
        </ul>
      </aside>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";

import { loadBaseRuntimeSnapshot } from "../base-runtime/baseRuntimeProjection";
import RoomCompositionShadowRenderer from "./RoomCompositionShadowRenderer.vue";
import { useCosmosRuntime } from "../../runtime/plugin";
import {
  runBaseMainRoomShadowMode,
  type BaseRuntimeShadowBinding,
  type RoomShadowModeResult,
} from "../../theme-engine";

const runtime = useCosmosRuntime();
const phase = ref<"loading" | "ready" | "error">("loading");
const error = ref<string | null>(null);
const shadow = shallowRef<Readonly<RoomShadowModeResult> | null>(null);

const fallbackLabel = computed(() =>
  shadow.value?.snapshot.objectInstances.some(
    (object) =>
      object.propertyResolution.skin.source === "core-default" ||
      object.propertyResolution.skin.fallback,
  )
    ? "Core fallback"
    : "Resolved Skin",
);

function bindingLabel(binding: Readonly<BaseRuntimeShadowBinding>): string {
  if (binding.kind === "workspace") {
    return `${binding.workspaceSlotId} → ${binding.workspaceId ?? "unavailable"}`;
  }
  if (binding.kind === "room-transition") {
    return `${binding.doorId} → ${binding.targetRoomId}`;
  }
  if (binding.kind === "companion") return binding.companionId;
  return binding.baseId;
}

async function loadPreview(): Promise<void> {
  phase.value = "loading";
  error.value = null;
  try {
    await loadBaseRuntimeSnapshot(runtime.base);
    const snapshot = runtime.base.state.snapshot;
    if (!snapshot) throw new Error("Base returned no snapshot.");
    shadow.value = runBaseMainRoomShadowMode({ baseSnapshot: snapshot });
    phase.value = "ready";
  } catch (cause: unknown) {
    shadow.value = null;
    error.value = cause instanceof Error ? cause.message : "Shadow preview could not resolve.";
    phase.value = "error";
  }
}

onMounted(() => {
  void loadPreview();
});
</script>

<style scoped>
.room-composition-preview {
  display: grid;
  overflow: hidden;
  grid-template-rows: 68px minmax(0, 1fr);
  background:
    radial-gradient(circle at 50% 42%, rgba(37, 74, 98, 0.16), transparent 46%),
    var(--cosmos-color-background, #02040a);
  color: var(--cosmos-color-text, #e5edf2);
}

.room-composition-preview__header {
  z-index: 5;
  display: flex;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--cosmos-color-border, rgba(181, 211, 225, 0.14));
  background: rgba(4, 8, 14, 0.88);
}

.room-composition-preview__header span {
  display: grid;
  gap: 3px;
}

.room-composition-preview__header small,
.room-composition-preview__diagnostics dt {
  color: var(--cosmos-color-faint, #52636e);
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.room-composition-preview__header strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1rem;
  font-weight: 400;
}

.room-composition-preview__header p {
  margin: 0;
  color: var(--cosmos-color-muted, #83949f);
  font-size: 0.65rem;
  letter-spacing: 0.06em;
}

.room-composition-preview__stage {
  min-width: 0;
  min-height: 0;
  padding: 24px;
}

.room-composition-preview__diagnostics {
  position: absolute;
  z-index: 6;
  right: 38px;
  bottom: 38px;
  width: 300px;
  max-height: 320px;
  overflow: hidden;
  padding: 14px;
  border: 1px solid var(--cosmos-color-border-strong, rgba(190, 224, 238, 0.28));
  border-radius: var(--cosmos-radius-window, 10px);
  background: rgba(5, 11, 18, 0.88);
  box-shadow: var(--cosmos-window-shadow, 0 28px 90px rgba(0, 0, 0, 0.58));
  backdrop-filter: blur(var(--cosmos-surface-blur, 18px));
}

.room-composition-preview__diagnostics dl {
  display: grid;
  margin: 0;
  grid-template-columns: 1fr 1fr;
  gap: 8px 14px;
}

.room-composition-preview__diagnostics dl div {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.room-composition-preview__diagnostics dd {
  overflow: hidden;
  margin: 0;
  color: var(--cosmos-color-text, #e5edf2);
  font-size: 0.65rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.room-composition-preview__diagnostics dd[data-parity="equal"] {
  color: var(--cosmos-color-green, #75cfa9);
}

.room-composition-preview__diagnostics ul {
  display: grid;
  max-height: 150px;
  margin: 12px -4px -4px;
  padding: 10px 4px 4px;
  overflow: auto;
  border-top: 1px solid var(--cosmos-color-border, rgba(181, 211, 225, 0.14));
  list-style: none;
  gap: 6px;
}

.room-composition-preview__diagnostics li {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.room-composition-preview__diagnostics li span {
  color: var(--cosmos-color-faint, #52636e);
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.room-composition-preview__diagnostics li strong {
  overflow: hidden;
  color: var(--cosmos-color-muted, #83949f);
  font-size: 0.58rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.room-composition-preview__state {
  display: grid;
  place-content: center;
  place-items: center;
  color: var(--cosmos-color-muted, #83949f);
  text-align: center;
  gap: 9px;
}

.room-composition-preview__state span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--cosmos-color-accent, #62c8ea);
  box-shadow: var(--cosmos-glow-cyan, 0 0 24px rgba(74, 184, 224, 0.14));
}

.room-composition-preview__state strong {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}

.room-composition-preview__state p {
  margin: 0;
  font-size: 0.68rem;
}
</style>
