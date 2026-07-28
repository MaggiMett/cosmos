<template>
  <div class="looks-studio-inspector" data-testid="looks-studio-inspector">
    <header class="looks-studio-inspector__heading">
      <h1 class="builder-serif">Orbital Luminaire</h1>
      <p>Look <span aria-hidden="true">·</span> Default State</p>
    </header>

    <BuilderAccordionSection title="Appearance" :open="true">
      <div class="looks-appearance">
        <span class="looks-appearance__label">Material</span>
        <div class="material-grid">
          <button
            v-for="material in materials"
            :key="material.name"
            type="button"
            :class="{ 'material-grid__active': material.active }"
            :aria-pressed="material.active"
          >
            <span :data-tone="material.tone" aria-hidden="true" />
            <small>{{ material.name }}</small>
          </button>
        </div>
        <label class="looks-appearance__finish">
          <span>Finish</span>
          <button type="button">Satin <span aria-hidden="true">⌄</span></button>
        </label>
      </div>
    </BuilderAccordionSection>

    <BuilderAccordionSection title="Alignment" />
    <BuilderAccordionSection title="Fit" />
    <BuilderAccordionSection title="Overflow" />
    <BuilderAccordionSection title="Variant" />

    <section class="animation-section" aria-label="Animation">
      <span class="builder-serif">Animation</span>
      <button type="button">Animate...</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import BuilderAccordionSection from "./BuilderAccordionSection.vue";

const materials = [
  { name: "Obsidian", tone: "obsidian", active: true },
  { name: "Pearl", tone: "pearl", active: false },
  { name: "Bronze", tone: "bronze", active: false },
] as const;
</script>

<style scoped>
.looks-studio-inspector {
  min-height: 100%;
  padding: 22px 20px 36px;
}

.looks-studio-inspector__heading {
  display: grid;
  padding: 0 4px 15px;
  border-bottom: 1px solid var(--builder-border);
  gap: 7px;
}

.looks-studio-inspector__heading h1 {
  margin: 0;
  color: var(--builder-text);
  font-size: 1.55rem;
  line-height: 1.1;
}

.looks-studio-inspector__heading p {
  margin: 0;
  color: var(--builder-muted);
  font-size: 0.68rem;
}

.looks-appearance {
  display: grid;
  gap: 13px;
}

.looks-appearance__label,
.looks-appearance__finish > span {
  color: #c4c4c0;
  font-size: 0.68rem;
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.material-grid button {
  display: grid;
  min-width: 0;
  min-height: 104px;
  padding: 8px 4px;
  grid-template-rows: 1fr auto;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--builder-radius-control);
  background: transparent;
  color: var(--builder-text);
  cursor: pointer;
  gap: 7px;
}

.material-grid button:hover,
.material-grid__active {
  border-color: rgba(120, 149, 177, 0.5) !important;
  background: var(--builder-accent-soft) !important;
}

.material-grid button > span {
  width: 58px;
  height: 58px;
  border: 1px solid var(--builder-border-strong);
  border-radius: 50%;
  box-shadow: inset -12px -9px 20px rgba(0, 0, 0, 0.34);
}

.material-grid button > span[data-tone="obsidian"] {
  background: radial-gradient(circle at 34% 29%, #35393c, #0c0e10 64%);
}

.material-grid button > span[data-tone="pearl"] {
  background: radial-gradient(circle at 34% 29%, #e1ded7, #777873 66%);
}

.material-grid button > span[data-tone="bronze"] {
  background: radial-gradient(circle at 34% 29%, #bd8350, #472a19 68%);
}

.material-grid small {
  font-size: 0.62rem;
}

.looks-appearance__finish {
  display: grid;
  gap: 7px;
}

.looks-appearance__finish button {
  display: flex;
  min-height: 36px;
  padding: 0 10px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
  background: rgba(13, 18, 23, 0.5);
  color: var(--builder-text);
  cursor: pointer;
  font-size: 0.68rem;
}

.animation-section {
  display: flex;
  min-height: 56px;
  padding: 0 4px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--builder-border);
  gap: 14px;
}

.animation-section > span {
  font-size: 0.92rem;
}

.animation-section button {
  min-height: 34px;
  padding: 0 13px;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
  background: rgba(13, 18, 23, 0.5);
  color: var(--builder-text);
  cursor: pointer;
  font-size: 0.68rem;
}

.animation-section button:hover {
  border-color: var(--builder-border-strong);
}
</style>
