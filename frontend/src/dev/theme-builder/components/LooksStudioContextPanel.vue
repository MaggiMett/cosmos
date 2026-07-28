<template>
  <aside class="looks-context" aria-label="Looks Studio context" data-testid="looks-studio-context">
    <section class="looks-context__section">
      <h2 class="builder-serif">Current Template</h2>
      <button type="button" class="current-template">
        <NeutralVisualPlaceholder label="Orbital Luminaire" />
        <span>
          <strong class="builder-serif">Orbital Luminaire</strong>
          <small>Object Template</small>
        </span>
      </button>
    </section>

    <section class="looks-context__section looks-context__section--lined">
      <h2 class="builder-serif">Visual Slots</h2>
      <div class="visual-slot-list">
        <button v-for="slot in slots" :key="slot.name" type="button">
          <span class="visual-slot-list__swatch" :data-tone="slot.tone" aria-hidden="true" />
          <span class="visual-slot-list__copy">
            <strong>{{ slot.name }}</strong>
            <small v-if="slot.note">{{ slot.note }}</small>
          </span>
          <span class="visual-slot-list__value">{{ slot.value }}</span>
          <BuilderIcon :name="slot.assigned ? 'check' : 'object'" />
        </button>
      </div>
    </section>

    <section class="looks-context__section looks-context__section--lined">
      <h2 class="builder-serif">Assigned Assets</h2>
      <div class="looks-swatch-grid">
        <button v-for="asset in assignedAssets" :key="asset.name" type="button">
          <span :data-tone="asset.tone" aria-hidden="true" />
          <small>{{ asset.name }}</small>
        </button>
      </div>
    </section>

    <section class="looks-context__section looks-context__section--lined">
      <h2 class="builder-serif">Variants</h2>
      <div class="looks-swatch-grid">
        <button
          v-for="variant in variants"
          :key="variant.name"
          type="button"
          :class="{ 'looks-swatch-grid__active': variant.active }"
          :aria-pressed="variant.active"
        >
          <span :data-tone="variant.tone" aria-hidden="true" />
          <small>{{ variant.name }}</small>
        </button>
      </div>
    </section>

    <section class="looks-context__section looks-context__section--lined">
      <h2 class="builder-serif">States</h2>
      <div class="state-button-grid">
        <button
          v-for="state in states"
          :key="state"
          type="button"
          :class="{ 'state-button-grid__active': state === 'Default' }"
          :aria-pressed="state === 'Default'"
        >
          {{ state }}
        </button>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import BuilderIcon from "./BuilderIcon.vue";
import NeutralVisualPlaceholder from "./NeutralVisualPlaceholder.vue";

const slots = [
  { name: "Frame", value: "Obsidian Alloy", note: "", tone: "graphite", assigned: true },
  { name: "Glass", value: "Choose Visual", note: "Uses Core Fallback", tone: "empty", assigned: false },
  { name: "Light", value: "Warm Glow", note: "", tone: "ivory", assigned: true },
  { name: "Decoration", value: "Choose Visual", note: "Optional Slot", tone: "empty", assigned: false },
] as const;

const assignedAssets = [
  { name: "Obsidian Alloy", tone: "obsidian" },
  { name: "Pearl Glass", tone: "pearl" },
  { name: "Warm Glow", tone: "glow" },
] as const;

const variants = [
  { name: "Obsidian", tone: "obsidian", active: true },
  { name: "Pearl", tone: "pearl", active: false },
  { name: "Amber", tone: "amber", active: false },
] as const;

const states = ["Default", "Hover", "Selected", "Disabled", "Idle"] as const;
</script>

<style scoped>
.looks-context {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 18px 12px 28px;
  border-right: 1px solid var(--builder-border);
  background: rgba(8, 13, 17, 0.38);
  scrollbar-color: rgba(154, 164, 172, 0.18) transparent;
}

.looks-context__section {
  display: grid;
  gap: 11px;
}

.looks-context__section--lined {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--builder-border);
}

.looks-context h2 {
  margin: 0 4px;
  font-size: 0.9rem;
}

.current-template {
  display: grid;
  min-height: 78px;
  padding: 0;
  grid-template-columns: 78px minmax(0, 1fr);
  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--builder-radius-control);
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  gap: 12px;
}

.current-template:hover {
  border-color: var(--builder-border);
  background: rgba(255, 255, 255, 0.018);
}

.current-template > :deep(.neutral-visual) {
  width: 78px;
  height: 72px;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
}

.current-template :deep(.neutral-visual__arch) {
  inset: 16% 30% 24%;
  border-radius: 50%;
}

.current-template > span {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.current-template strong {
  overflow: hidden;
  font-size: 0.86rem;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-template small,
.visual-slot-list small {
  color: var(--builder-muted);
  font-size: 0.62rem;
}

.visual-slot-list {
  display: grid;
  overflow: hidden;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
}

.visual-slot-list button {
  display: grid;
  min-height: 46px;
  padding: 5px 8px;
  grid-template-columns: 28px minmax(0, 1fr) minmax(74px, auto) 16px;
  align-items: center;
  border: 0;
  border-bottom: 1px solid var(--builder-border);
  background: rgba(13, 18, 23, 0.34);
  color: #c9c8c4;
  cursor: pointer;
  font-size: 0.66rem;
  text-align: left;
  gap: 8px;
}

.visual-slot-list button:last-child {
  border-bottom: 0;
}

.visual-slot-list button:hover {
  background: rgba(255, 255, 255, 0.022);
}

.visual-slot-list__swatch {
  width: 24px;
  height: 24px;
  border: 1px solid var(--builder-border-strong);
  border-radius: 50%;
}

.visual-slot-list__swatch[data-tone="graphite"] {
  background: linear-gradient(135deg, #080a0c, #34383b);
}

.visual-slot-list__swatch[data-tone="ivory"] {
  background: radial-gradient(circle at 40% 38%, #eee8db, #8c8982);
}

.visual-slot-list__swatch[data-tone="empty"] {
  border-style: dashed;
  background: transparent;
}

.visual-slot-list__copy {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.visual-slot-list__copy strong,
.visual-slot-list__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visual-slot-list__copy strong {
  font-weight: 500;
}

.visual-slot-list__value {
  color: var(--builder-muted);
  text-align: right;
}

.visual-slot-list :deep(.builder-icon) {
  width: 0.8rem;
  height: 0.8rem;
  color: var(--builder-faint);
}

.looks-swatch-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.looks-swatch-grid button {
  display: grid;
  min-width: 0;
  min-height: 94px;
  padding: 8px 4px 7px;
  grid-template-rows: 1fr auto;
  place-items: center;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
  background: rgba(13, 18, 23, 0.34);
  color: var(--builder-text);
  cursor: pointer;
  gap: 5px;
}

.looks-swatch-grid button:hover,
.looks-swatch-grid__active {
  border-color: rgba(120, 149, 177, 0.5) !important;
}

.looks-swatch-grid button > span {
  width: 48px;
  height: 48px;
  border: 1px solid var(--builder-border-strong);
  border-radius: 50%;
  box-shadow: inset -10px -8px 18px rgba(0, 0, 0, 0.3);
}

.looks-swatch-grid button > span[data-tone="obsidian"] {
  background: radial-gradient(circle at 34% 29%, #35393c, #0c0e10 64%);
}

.looks-swatch-grid button > span[data-tone="pearl"] {
  background: radial-gradient(circle at 34% 29%, #e1ded7, #777873 66%);
}

.looks-swatch-grid button > span[data-tone="glow"] {
  background: radial-gradient(circle at 40% 38%, #fff4df, #9d8970 68%);
}

.looks-swatch-grid button > span[data-tone="amber"] {
  background: radial-gradient(circle at 34% 29%, #c48c56, #4a2b18 68%);
}

.looks-swatch-grid small {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.6rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.state-button-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.state-button-grid button {
  min-height: 34px;
  padding: 0 7px;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
  background: rgba(13, 18, 23, 0.34);
  color: var(--builder-text);
  cursor: pointer;
  font-size: 0.64rem;
}

.state-button-grid button:hover,
.state-button-grid__active {
  border-color: rgba(120, 149, 177, 0.5) !important;
  background: var(--builder-accent-soft) !important;
}
</style>
