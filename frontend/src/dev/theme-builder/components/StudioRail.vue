<template>
  <nav class="studio-rail" aria-label="Theme Builder studios" data-testid="studio-rail">
    <button type="button" class="studio-rail__brand" aria-label="Cosmos Theme Builder">
      <BuilderIcon name="spark" />
    </button>

    <div class="studio-rail__divider" />

    <div class="studio-rail__studios">
      <button
        v-for="studio in studios"
        :key="studio.id"
        type="button"
        class="studio-rail__item"
        :class="{ 'studio-rail__item--active': studio.id === activeStudio }"
        :aria-current="studio.id === activeStudio ? 'page' : undefined"
        :aria-label="studio.label"
        :title="studio.label"
      >
        <BuilderIcon :name="studio.icon" />
        <span>{{ studio.label }}</span>
      </button>
    </div>

    <span class="studio-rail__end" aria-hidden="true" />
  </nav>
</template>

<script setup lang="ts">
import BuilderIcon from "./BuilderIcon.vue";

defineProps<{ activeStudio: string }>();

const studios = [
  { id: "board", label: "Theme Board", icon: "board" },
  { id: "library", label: "Asset Library", icon: "library" },
  { id: "templates", label: "Templates", icon: "templates" },
  { id: "looks", label: "Looks", icon: "looks" },
  { id: "showcase", label: "Showcase", icon: "showcase" },
  { id: "release", label: "Release", icon: "release" },
] as const;
</script>

<style scoped>
.studio-rail {
  z-index: 6;
  display: flex;
  width: 72px;
  min-height: 0;
  grid-row: 1 / -1;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid var(--builder-border);
  background: var(--builder-bg-deep);
}

.studio-rail button {
  color: inherit;
}

.studio-rail__brand,
.studio-rail__item {
  display: grid;
  padding: 0;
  place-items: center;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.studio-rail__brand {
  width: 72px;
  height: 64px;
  color: var(--builder-text);
}

.studio-rail__brand :deep(.builder-icon) {
  width: 1.65rem;
  height: 1.65rem;
  stroke-width: 1.15;
}

.studio-rail__divider {
  width: 40px;
  height: 1px;
  margin: 0 0 18px;
  background: var(--builder-border);
}

.studio-rail__studios {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.studio-rail__item {
  position: relative;
  width: 52px;
  height: 52px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #9c9da0;
  transition:
    color var(--builder-control-transition),
    border-color var(--builder-control-transition),
    background var(--builder-control-transition),
    box-shadow var(--builder-control-transition);
}

.studio-rail__item > span {
  position: absolute;
  left: calc(100% + 11px);
  z-index: 10;
  width: max-content;
  padding: 6px 8px;
  border: 1px solid var(--builder-border);
  border-radius: 6px;
  background: #14191e;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  color: var(--builder-text);
  font-size: 0.72rem;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-3px);
  transition:
    opacity var(--builder-control-transition),
    transform var(--builder-control-transition);
}

.studio-rail__item:hover,
.studio-rail__item:focus-visible {
  color: var(--builder-text);
}

.studio-rail__item:hover > span,
.studio-rail__item:focus-visible > span {
  opacity: 1;
  transform: translateX(0);
}

.studio-rail__item--active {
  border-color: rgba(120, 149, 177, 0.55);
  background: linear-gradient(145deg, rgba(120, 149, 177, 0.16), rgba(120, 149, 177, 0.05));
  box-shadow:
    inset 0 0 18px rgba(120, 149, 177, 0.08),
    0 0 18px rgba(120, 149, 177, 0.1);
  color: var(--builder-text);
}

.studio-rail__end {
  width: 4px;
  height: 4px;
  margin-top: auto;
  margin-bottom: 32px;
  border-radius: 50%;
  background: var(--builder-border-strong);
}
</style>
