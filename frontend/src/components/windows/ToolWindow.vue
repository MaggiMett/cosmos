<template>
  <section
    class="tool-window"
    role="dialog"
    :aria-label="title"
    :style="windowStyle"
    @pointerdown.stop="$emit('focus')"
  >
    <header class="tool-window__header" @pointerdown="startMove">
      <span>{{ title }}</span>
      <button type="button" aria-label="Close" title="Close" @pointerdown.stop @click="$emit('close')">
        <span aria-hidden="true">×</span>
      </button>
    </header>
    <div class="tool-window__content"><slot /></div>
    <button
      class="tool-window__resize"
      type="button"
      aria-label="Resize window"
      title="Resize window"
      @pointerdown.stop="startResize"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";

import type { WindowBounds } from "../../runtime/windowRuntime";

const props = defineProps<{
  title: string;
  bounds: WindowBounds;
  minimumSize?: { width: number; height: number };
}>();

const emit = defineEmits<{
  close: [];
  focus: [];
  move: [position: { x: number; y: number }];
  resize: [size: { width: number; height: number }];
}>();

let stopActivePointer: (() => void) | null = null;

const windowStyle = computed(() => ({
  left: `${props.bounds.x}px`,
  top: `${props.bounds.y}px`,
  width: `${props.bounds.width}px`,
  height: `${props.bounds.height}px`,
}));

function startMove(event: PointerEvent) {
  if (event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
  event.preventDefault();
  const origin = { x: event.clientX, y: event.clientY, left: props.bounds.x, top: props.bounds.y };
  trackPointer((moveEvent) => {
    emit("move", {
      x: clamp(origin.left + moveEvent.clientX - origin.x, 0, window.innerWidth - props.bounds.width),
      y: clamp(origin.top + moveEvent.clientY - origin.y, 0, window.innerHeight - 80),
    });
  });
}

function startResize(event: PointerEvent) {
  if (event.button !== 0) return;
  event.preventDefault();
  const minimum = props.minimumSize ?? { width: 320, height: 240 };
  const origin = {
    x: event.clientX,
    y: event.clientY,
    width: props.bounds.width,
    height: props.bounds.height,
  };
  trackPointer((moveEvent) => {
    emit("resize", {
      width: clamp(origin.width + moveEvent.clientX - origin.x, minimum.width, window.innerWidth - props.bounds.x),
      height: clamp(origin.height + moveEvent.clientY - origin.y, minimum.height, window.innerHeight - props.bounds.y),
    });
  });
}

function trackPointer(move: (event: PointerEvent) => void) {
  stopActivePointer?.();
  const stop = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
    window.removeEventListener("pointercancel", stop);
    if (stopActivePointer === stop) stopActivePointer = null;
  };
  stopActivePointer = stop;
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop, { once: true });
  window.addEventListener("pointercancel", stop, { once: true });
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

onBeforeUnmount(() => stopActivePointer?.());
</script>

<style scoped>
.tool-window {
  position: fixed;
  z-index: 40;
  display: flex;
  min-width: 320px;
  min-height: 240px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(196, 181, 253, 0.28);
  border-radius: 18px;
  background: rgba(8, 12, 28, 0.92);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.52), inset 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px);
}

.tool-window__header {
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 18px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.1);
  color: #f8fafc;
  font-size: 0.82rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: move;
  user-select: none;
}

.tool-window__header button {
  display: grid;
  width: 32px;
  height: 32px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(226, 232, 240, 0.14);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.tool-window__header button:hover,
.tool-window__header button:focus-visible {
  border-color: rgba(248, 250, 252, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.tool-window__content {
  min-height: 0;
  flex: 1;
}

.tool-window__resize {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: linear-gradient(135deg, transparent 45%, rgba(196, 181, 253, 0.72) 46% 53%, transparent 54% 64%, rgba(196, 181, 253, 0.52) 65% 72%, transparent 73%);
  cursor: nwse-resize;
}
</style>
