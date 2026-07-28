<template>
  <ThemeBuilderShell active-studio="board" studio-label="Theme Board">
    <div class="theme-board" data-testid="theme-board-view">
      <header class="theme-board__heading">
        <div class="theme-board__title-row">
          <h1 class="builder-serif">Cosmos Reference</h1>
          <span>Draft</span>
        </div>
        <p>A neutral study of space, architecture and quiet materials.</p>
      </header>

      <HeroCard />
      <MoodboardGrid :items="moodboardItems" />
    </div>

    <template #context>
      <div class="theme-board-context">
        <ContinueWorking :items="workingItems" />
        <div class="theme-board-context__divider" />
        <ThemeCoverage :items="coverageItems" />
      </div>
    </template>
  </ThemeBuilderShell>
</template>

<script setup lang="ts">
import "./themeBuilder.css";

import ContinueWorking, {
  type WorkingItem,
} from "./components/ContinueWorking.vue";
import HeroCard from "./components/HeroCard.vue";
import MoodboardGrid, {
  type MoodboardItem,
} from "./components/MoodboardGrid.vue";
import ThemeBuilderShell from "./components/ThemeBuilderShell.vue";
import ThemeCoverage, {
  type CoverageItem,
} from "./components/ThemeCoverage.vue";

const workingItems: readonly WorkingItem[] = [
  {
    name: "Main Room Shell",
    type: "Room Shell",
    state: "Open draft",
  },
  {
    name: "Orbital Window",
    type: "Look",
    state: "Current session",
  },
];

const coverageItems: readonly CoverageItem[] = [
  { label: "Cosmos", icon: "spark", status: "fallback" },
  { label: "Windows", icon: "window", status: "fallback" },
  { label: "Base", icon: "room", status: "fallback" },
  { label: "Materials", icon: "material", status: "fallback" },
  { label: "Rooms", icon: "room", status: "custom" },
  { label: "Motion", icon: "motion", status: "fallback" },
  { label: "Objects", icon: "object", status: "custom" },
];

const moodboardItems: readonly MoodboardItem[] = [
  { label: "Space", tone: "space" },
  { label: "Structure", tone: "structure" },
  { label: "Material", tone: "material" },
  { label: "Atmosphere", tone: "atmosphere" },
];
</script>

<style scoped>
.theme-board {
  display: grid;
  width: min(100%, 1110px);
  min-height: 100%;
  padding: 26px 28px 36px;
  align-content: start;
  gap: 20px;
}

.theme-board__heading {
  display: grid;
  gap: 6px;
}

.theme-board__title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.theme-board h1 {
  margin: 0;
  color: var(--builder-text);
  font-size: clamp(2rem, 2.55vw, 2.7rem);
  line-height: 1;
  letter-spacing: -0.025em;
}

.theme-board__title-row > span {
  padding: 3px 7px;
  border: 1px solid var(--builder-border-strong);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.018);
  color: var(--builder-muted);
  font-size: 0.65rem;
}

.theme-board__heading p {
  margin: 0;
  color: var(--builder-muted);
  font-size: 0.78rem;
}

.theme-board-context {
  display: grid;
  padding: 128px 24px 40px;
  align-content: start;
  gap: 28px;
}

.theme-board-context__divider {
  height: 1px;
  background: linear-gradient(90deg, var(--builder-border), transparent);
}

@media (max-width: 1280px) {
  .theme-board {
    padding-inline: 22px;
  }

  .theme-board-context {
    padding-inline: 18px;
  }
}
</style>
