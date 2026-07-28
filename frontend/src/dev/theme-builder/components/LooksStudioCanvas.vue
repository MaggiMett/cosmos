<template>
  <section class="looks-studio-canvas" aria-label="Looks canvas" data-testid="looks-studio-canvas">
    <header class="looks-studio-canvas__toolbar">
      <BuilderSegmentedControl
        label="Visual state"
        :options="states"
        active-option="Default"
      />
      <div class="looks-studio-canvas__zoom" aria-label="Canvas zoom">
        <button type="button">Fit</button>
        <button type="button" aria-label="Zoom out">−</button>
        <span>100%</span>
        <button type="button" aria-label="Zoom in">＋</button>
      </div>
    </header>

    <div class="looks-studio-canvas__stage">
      <NeutralVisualPlaceholder
        label="Looks canvas"
        variant="canvas"
        :show-label="true"
      />
      <div class="looks-studio-canvas__object" aria-hidden="true">
        <span class="looks-studio-canvas__orbit looks-studio-canvas__orbit--rear" />
        <span class="looks-studio-canvas__core" />
        <span class="looks-studio-canvas__orbit looks-studio-canvas__orbit--front" />
        <span class="looks-studio-canvas__base" />
      </div>
      <span class="looks-studio-canvas__podium" aria-hidden="true" />

      <div
        v-for="slot in callouts"
        :key="slot.name"
        class="slot-callout"
        :class="`slot-callout--${slot.position}`"
      >
        <span class="slot-callout__line" aria-hidden="true" />
        <div>
          <strong>{{ slot.name }}</strong>
          <span>{{ slot.value }}</span>
          <small v-if="slot.note">{{ slot.note }}</small>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BuilderSegmentedControl from "./BuilderSegmentedControl.vue";
import NeutralVisualPlaceholder from "./NeutralVisualPlaceholder.vue";

const states = ["Default", "Hover", "Selected", "Disabled", "Idle"] as const;

const callouts = [
  { name: "Frame", value: "Obsidian Alloy", note: "", position: "frame" },
  { name: "Glass", value: "Choose Visual", note: "Uses Core Fallback", position: "glass" },
  { name: "Light", value: "Warm Glow", note: "", position: "light" },
  { name: "Decoration", value: "Choose Visual", note: "Optional Slot", position: "decoration" },
] as const;
</script>

<style scoped>
.looks-studio-canvas {
  display: grid;
  min-width: 0;
  min-height: 0;
  padding: 8px 12px 6px;
  grid-template-rows: 46px minmax(0, 1fr);
  background: rgba(5, 9, 12, 0.24);
}

.looks-studio-canvas__toolbar {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.looks-studio-canvas__toolbar > :deep(.builder-segmented-control) {
  grid-auto-columns: minmax(82px, 1fr);
}

.looks-studio-canvas__toolbar > :deep(.builder-segmented-control button) {
  padding-inline: 13px;
}

.looks-studio-canvas__zoom {
  display: flex;
  align-items: center;
  color: var(--builder-muted);
  font-size: 0.7rem;
  gap: 7px;
}

.looks-studio-canvas__zoom button {
  min-width: 34px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: var(--builder-radius-control);
  background: transparent;
  color: var(--builder-text);
  cursor: pointer;
}

.looks-studio-canvas__zoom button:hover {
  border-color: var(--builder-border);
  background: rgba(255, 255, 255, 0.02);
}

.looks-studio-canvas__zoom span {
  min-width: 42px;
  text-align: center;
}

.looks-studio-canvas__stage {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-card);
  background: rgba(13, 18, 23, 0.52);
}

.looks-studio-canvas__stage > :deep(.neutral-visual) {
  position: absolute;
  inset: 4px;
  background:
    radial-gradient(ellipse at 50% 66%, rgba(120, 149, 177, 0.065), transparent 38%),
    linear-gradient(180deg, #181b1e, #101417 58%, #0c1013 59%);
}

.looks-studio-canvas__stage :deep(.neutral-visual__arch),
.looks-studio-canvas__stage :deep(.neutral-visual__horizon),
.looks-studio-canvas__stage :deep(.neutral-visual__floor) {
  display: none;
}

.looks-studio-canvas__stage :deep(.neutral-visual small) {
  top: 13%;
}

.looks-studio-canvas__podium {
  position: absolute;
  bottom: 7%;
  left: 50%;
  width: min(52%, 480px);
  height: 8%;
  border: 1px solid rgba(212, 220, 225, 0.1);
  border-radius: 50%;
  background: linear-gradient(180deg, #23292d, #0c1013);
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%);
}

.looks-studio-canvas__object {
  position: absolute;
  bottom: 14%;
  left: 50%;
  z-index: 2;
  width: min(30%, 255px);
  height: 62%;
  transform: translateX(-50%);
}

.looks-studio-canvas__core {
  position: absolute;
  top: 11%;
  bottom: 8%;
  left: 39%;
  width: 22%;
  border: 1px solid rgba(212, 220, 225, 0.22);
  border-radius: 40px 40px 9px 9px;
  background: linear-gradient(90deg, #252b30, #777a78 49%, #252b30);
  box-shadow: 0 0 40px rgba(209, 205, 194, 0.08);
}

.looks-studio-canvas__base {
  position: absolute;
  right: 17%;
  bottom: 0;
  left: 17%;
  height: 11%;
  border: 1px solid rgba(212, 220, 225, 0.17);
  border-radius: 50%;
  background: #191e22;
}

.looks-studio-canvas__orbit {
  position: absolute;
  inset: 8% 7% 13%;
  border: 2px solid rgba(175, 166, 150, 0.32);
  border-radius: 50%;
}

.looks-studio-canvas__orbit--rear {
  transform: rotate(-18deg) scaleX(0.54);
}

.looks-studio-canvas__orbit--front {
  inset: 22% -12% 26%;
  transform: rotate(18deg) scaleY(0.54);
}

.slot-callout {
  position: absolute;
  z-index: 3;
  width: 142px;
  padding: 9px 11px;
  border: 1px solid var(--builder-border-strong);
  border-radius: var(--builder-radius-control);
  background: rgba(12, 16, 20, 0.9);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
}

.slot-callout > div {
  display: grid;
  gap: 3px;
}

.slot-callout strong,
.slot-callout span,
.slot-callout small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slot-callout strong {
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.72rem;
  font-weight: 400;
}

.slot-callout span,
.slot-callout small {
  color: var(--builder-muted);
  font-size: 0.62rem;
}

.slot-callout__line {
  position: absolute;
  top: 50%;
  width: clamp(42px, 7vw, 94px);
  height: 1px;
  overflow: visible !important;
  background: rgba(212, 220, 225, 0.38);
}

.slot-callout__line::after {
  position: absolute;
  top: -2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(212, 220, 225, 0.6);
  content: "";
}

.slot-callout--frame {
  top: 16%;
  left: 13%;
}

.slot-callout--frame .slot-callout__line {
  left: 100%;
}

.slot-callout--frame .slot-callout__line::after {
  right: -2px;
}

.slot-callout--glass {
  top: 37%;
  right: 9%;
}

.slot-callout--light {
  top: 57%;
  right: 10%;
}

.slot-callout--decoration {
  right: 12%;
  bottom: 17%;
}

.slot-callout--glass .slot-callout__line,
.slot-callout--light .slot-callout__line,
.slot-callout--decoration .slot-callout__line {
  right: 100%;
}

.slot-callout--glass .slot-callout__line::after,
.slot-callout--light .slot-callout__line::after,
.slot-callout--decoration .slot-callout__line::after {
  left: -2px;
}
</style>
