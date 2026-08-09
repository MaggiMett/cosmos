<template>
  <div
    class="room-composition-renderer"
    data-testid="room-composition-shadow-renderer"
    :data-room-id="model.roomId"
    aria-hidden="true"
  >
    <svg
      class="room-composition-renderer__canvas"
      :viewBox="`0 0 ${model.width} ${model.height}`"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
    >
      <defs>
        <linearGradient id="shadow-room-background" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#07101a" />
          <stop offset="1" stop-color="#111923" />
        </linearGradient>
        <radialGradient id="shadow-room-ambient">
          <stop offset="0" stop-color="#62c8ea" stop-opacity="0.12" />
          <stop offset="1" stop-color="#62c8ea" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="shadow-room-foreground">
          <stop offset="58%" stop-color="#02040a" stop-opacity="0" />
          <stop offset="100%" stop-color="#02040a" stop-opacity="0.64" />
        </radialGradient>
      </defs>

      <g
        v-for="item in model.items"
        :key="`${item.kind}:${item.id}`"
        class="room-composition-renderer__item"
        :class="[
          `room-composition-renderer__item--${item.kind}`,
          item.kind === 'surface' ? `room-composition-renderer__surface--${item.role}` : null,
          item.kind === 'object' && item.functionContainer
            ? `room-composition-renderer__function--${item.functionContainer.definition.functionType}`
            : null,
        ]"
        :data-composition-id="item.id"
        :data-layer="item.layer"
        :data-depth="item.depth"
        :data-pointer-policy="item.kind === 'surface' ? item.pointerPolicy : 'none'"
        :data-core-fallback="item.kind === 'object' ? item.fallback : undefined"
        :transform="item.kind === 'object' ? item.transform : undefined"
      >
        <RoomShadowShape :shape="item.shape" class="room-composition-renderer__visual" />
        <template v-if="item.kind === 'object' && item.functionContainer">
          <RoomShadowShape
            v-if="item.interactionShape"
            :shape="item.interactionShape"
            class="room-composition-renderer__function-outline"
          />
          <text
            class="room-composition-renderer__function-label"
            :x="labelPosition(item.shape).x"
            :y="labelPosition(item.shape).y"
          >
            {{ item.functionContainer.definition.functionType }}
          </text>
        </template>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { ImmutableRoomSnapshot } from "../../theme-engine/roomSnapshotResolver";
import type { BoundsShape, Point } from "../../theme-engine/types";
import RoomShadowShape from "./RoomShadowShape.vue";
import { projectRoomCompositionForShadowRender } from "./roomCompositionRenderProjection";

const props = defineProps<{
  snapshot: Readonly<ImmutableRoomSnapshot>;
}>();

const model = computed(() => projectRoomCompositionForShadowRender(props.snapshot));

function labelPosition(shape: BoundsShape): Point {
  if (shape.type === "rect") {
    return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
  }
  if (shape.type === "ellipse") return { x: shape.cx, y: shape.cy };
  const x = shape.points.reduce((total, point) => total + point.x, 0) / shape.points.length;
  const y = shape.points.reduce((total, point) => total + point.y, 0) / shape.points.length;
  return { x, y };
}
</script>

<style scoped>
.room-composition-renderer,
.room-composition-renderer * {
  pointer-events: none;
}

.room-composition-renderer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--cosmos-color-border, rgba(181, 211, 225, 0.14));
  border-radius: var(--cosmos-radius-window, 10px);
  background: var(--cosmos-color-background, #02040a);
  box-shadow: var(--cosmos-window-shadow, 0 28px 90px rgba(0, 0, 0, 0.58));
}

.room-composition-renderer__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.room-composition-renderer__item {
  pointer-events: none;
}

.room-composition-renderer__visual {
  stroke: rgba(185, 214, 228, 0.18);
  stroke-width: 2;
  fill: rgba(20, 31, 42, 0.92);
}

.room-composition-renderer__surface--background .room-composition-renderer__visual {
  fill: url(#shadow-room-background);
}

.room-composition-renderer__surface--architecture .room-composition-renderer__visual {
  fill: rgba(23, 35, 46, 0.88);
}

.room-composition-renderer__surface--floor .room-composition-renderer__visual {
  fill: rgba(29, 41, 51, 0.96);
}

.room-composition-renderer__surface--ceiling .room-composition-renderer__visual {
  fill: rgba(14, 23, 31, 0.96);
}

.room-composition-renderer__surface--ambient .room-composition-renderer__visual {
  fill: url(#shadow-room-ambient);
  stroke: rgba(98, 200, 234, 0.16);
}

.room-composition-renderer__surface--foreground .room-composition-renderer__visual {
  fill: url(#shadow-room-foreground);
  stroke: rgba(181, 211, 225, 0.08);
}

.room-composition-renderer__item--object .room-composition-renderer__visual {
  fill: rgba(36, 51, 64, 0.95);
  stroke: rgba(190, 224, 238, 0.34);
}

.room-composition-renderer__function--room-transition .room-composition-renderer__visual {
  fill: rgba(25, 39, 50, 0.98);
  stroke: rgba(217, 167, 101, 0.48);
}

.room-composition-renderer__function--knowledge-workspace .room-composition-renderer__visual,
.room-composition-renderer__function--creation-workspace .room-composition-renderer__visual {
  fill: rgba(24, 43, 56, 0.97);
  stroke: rgba(98, 200, 234, 0.42);
}

.room-composition-renderer__function--companion-interaction .room-composition-renderer__visual {
  fill: rgba(37, 48, 64, 0.98);
  stroke: rgba(168, 140, 231, 0.48);
}

.room-composition-renderer__function-outline {
  fill: transparent;
  stroke: rgba(229, 237, 242, 0.38);
  stroke-width: 2;
  stroke-dasharray: 10 8;
}

.room-composition-renderer__function-label {
  fill: var(--cosmos-color-text, #e5edf2);
  font-size: 18px;
  letter-spacing: 0.08em;
  text-anchor: middle;
  text-transform: uppercase;
}
</style>
