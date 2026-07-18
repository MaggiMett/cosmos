<template>
  <div class="dialog-attention" :style="ownerStyle" @pointerdown.self="$emit('cancel')">
    <section class="cosmos-dialog" role="alertdialog" aria-modal="true" :aria-labelledby="titleId">
      <header>
        <span :id="titleId">{{ title }}</span>
        <button v-if="dismissible" type="button" aria-label="Close" @click="$emit('cancel')">×</button>
      </header>
      <p>{{ message }}</p>
      <footer>
        <button v-if="dismissible" ref="cancelButton" type="button" @click="$emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button class="cosmos-dialog__primary" type="button" @click="$emit('confirm')">
          {{ confirmLabel }}
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import type { WindowBounds } from "../../runtime/windowRuntime";

const props = withDefaults(
  defineProps<{
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    dismissible?: boolean;
    ownerBounds?: WindowBounds;
  }>(),
  { confirmLabel: "Continue", cancelLabel: "Cancel", dismissible: true },
);
defineEmits<{ confirm: []; cancel: [] }>();
const cancelButton = ref<HTMLButtonElement | null>(null);
const titleId = `dialog-title-${crypto.randomUUID()}`;
const ownerStyle = computed(() =>
  props.ownerBounds
    ? {
        left: `${props.ownerBounds.x}px`,
        top: `${props.ownerBounds.y}px`,
        width: `${props.ownerBounds.width}px`,
        height: `${props.ownerBounds.height}px`,
      }
    : undefined,
);

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && props.dismissible) {
    event.preventDefault();
    cancelButton.value?.click();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
  void nextTick(() => cancelButton.value?.focus());
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKeyDown));
</script>

<style scoped>
.dialog-attention {
  position: fixed;
  z-index: 190;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  padding: 24px;
  place-items: center;
  background: rgba(1, 4, 12, 0.48);
  backdrop-filter: blur(4px);
  animation: dialog-veil 140ms ease both;
}

.cosmos-dialog {
  width: min(440px, 100%);
  overflow: hidden;
  border: 1px solid rgba(210, 221, 242, 0.22);
  border-radius: 16px;
  background: rgba(9, 14, 31, 0.97);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.62);
  color: #e5edf8;
  animation: dialog-open 160ms cubic-bezier(0.22, 0.78, 0.18, 1) both;
}

.cosmos-dialog header {
  display: flex;
  min-height: 48px;
  padding: 0 12px 0 18px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(220, 232, 248, 0.09);
  font-size: 0.8rem;
  font-weight: 650;
}

.cosmos-dialog header button {
  width: 30px;
  height: 30px;
  border: 0;
  background: transparent;
  color: #a8b4c8;
  cursor: pointer;
}

.cosmos-dialog p { margin: 0; padding: 20px 20px 22px; color: #aab8cc; line-height: 1.55; }
.cosmos-dialog footer { display: flex; padding: 12px 16px 16px; justify-content: flex-end; gap: 8px; }
.cosmos-dialog footer button { min-height: 38px; padding: 0 15px; border: 1px solid rgba(220, 232, 248, 0.16); border-radius: 9px; background: rgba(255, 255, 255, 0.04); cursor: pointer; }
.cosmos-dialog footer .cosmos-dialog__primary { border-color: rgba(139, 202, 238, 0.42); background: rgba(85, 166, 213, 0.16); color: #edf8ff; }

@keyframes dialog-veil { from { opacity: 0; } }
@keyframes dialog-open { from { transform: scale(0.98); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .dialog-attention, .cosmos-dialog { animation-duration: 1ms; } }
</style>
