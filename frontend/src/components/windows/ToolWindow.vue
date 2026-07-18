<template>
  <section
    class="tool-window"
    :class="{ 'tool-window--active': active }"
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
      v-for="direction in resizeDirections"
      :key="direction"
      class="tool-window__resize"
      :class="`tool-window__resize--${direction}`"
      type="button"
      :aria-label="`Resize window ${direction}`"
      :title="`Resize ${direction}`"
      @pointerdown.stop="startResize($event, direction)"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";

import type { WindowBounds } from "../../runtime/windowRuntime";

const props = withDefaults(defineProps<{
  title: string;
  bounds: WindowBounds;
  minimumSize?: { width: number; height: number };
  focusOrder?: number;
  active?: boolean;
}>(), { focusOrder: 0, active: true });

const emit = defineEmits<{
  close: [];
  focus: [];
  move: [position: { x: number; y: number }];
  resize: [size: { width: number; height: number }];
}>();

let stopActivePointer: (() => void) | null = null;
type ResizeDirection = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
const resizeDirections: ResizeDirection[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const windowStyle = computed(() => ({
  left: `${props.bounds.x}px`,
  top: `${props.bounds.y}px`,
  width: `${props.bounds.width}px`,
  height: `${props.bounds.height}px`,
  zIndex: 40 + props.focusOrder,
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

function startResize(event: PointerEvent, direction: ResizeDirection) {
  if (event.button !== 0) return;
  event.preventDefault();
  const minimum = props.minimumSize ?? { width: 320, height: 240 };
  const origin = {
    x: event.clientX,
    y: event.clientY,
    width: props.bounds.width,
    height: props.bounds.height,
    left: props.bounds.x,
    top: props.bounds.y,
  };
  trackPointer((moveEvent) => {
    const deltaX = moveEvent.clientX - origin.x;
    const deltaY = moveEvent.clientY - origin.y;
    const west = direction.includes("w");
    const east = direction.includes("e");
    const north = direction.includes("n");
    const south = direction.includes("s");
    const width = west
      ? clamp(origin.width - deltaX, minimum.width, origin.left + origin.width)
      : east
        ? clamp(origin.width + deltaX, minimum.width, window.innerWidth - origin.left)
        : origin.width;
    const height = north
      ? clamp(origin.height - deltaY, minimum.height, origin.top + origin.height)
      : south
        ? clamp(origin.height + deltaY, minimum.height, window.innerHeight - origin.top)
        : origin.height;
    if (west || north) {
      emit("move", {
        x: west ? origin.left + origin.width - width : origin.left,
        y: north ? origin.top + origin.height - height : origin.top,
      });
    }
    emit("resize", {
      width,
      height,
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

.tool-window--active {
  border-color: rgba(196, 181, 253, 0.48);
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.6), 0 0 28px rgba(139, 92, 246, 0.08);
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
  padding: 0;
  border: 0;
  background: transparent;
}

.tool-window__resize--n, .tool-window__resize--s { right: 18px; left: 18px; height: 8px; }
.tool-window__resize--n { top: 0; cursor: ns-resize; }
.tool-window__resize--s { bottom: 0; cursor: ns-resize; }
.tool-window__resize--e, .tool-window__resize--w { top: 18px; bottom: 18px; width: 8px; }
.tool-window__resize--e { right: 0; cursor: ew-resize; }
.tool-window__resize--w { left: 0; cursor: ew-resize; }
.tool-window__resize--ne, .tool-window__resize--se, .tool-window__resize--sw, .tool-window__resize--nw { width: 18px; height: 18px; }
.tool-window__resize--ne { top: 0; right: 0; cursor: nesw-resize; }
.tool-window__resize--se { right: 0; bottom: 0; cursor: nwse-resize; background: linear-gradient(135deg, transparent 45%, rgba(196, 181, 253, 0.72) 46% 53%, transparent 54% 64%, rgba(196, 181, 253, 0.52) 65% 72%, transparent 73%); }
.tool-window__resize--sw { bottom: 0; left: 0; cursor: nesw-resize; }
.tool-window__resize--nw { top: 0; left: 0; cursor: nwse-resize; }
</style>
