<template>
  <section class="theme-library-view environment-view" data-testid="theme-library-view">
    <div class="theme-library-view__stars" aria-hidden="true" />
    <ThemeLibrarySystemHeader />

    <main class="theme-library-view__content">
      <header class="theme-library-view__heading">
        <div>
          <h1>Theme Library</h1>
          <p v-if="!showEmptyState">
            Your installed worlds, ready to revisit. <span>6 themes</span>
          </p>
          <p v-else>No personal themes yet. <span>0 themes</span></p>
        </div>
      </header>

      <template v-if="!showEmptyState">
        <ThemeLibraryHero />
        <ThemeLibraryFilters />
        <section class="theme-library-view__collection" aria-labelledby="installed-themes-title">
          <div class="theme-library-view__gallery">
            <h2 id="installed-themes-title">Installed Themes</h2>
            <ThemeLibraryGallery :themes="themes" />
          </div>
          <ThemeLibraryDetails />
        </section>
      </template>

      <ThemeLibraryEmptyState v-else />
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import ThemeLibraryDetails from "./components/ThemeLibraryDetails.vue";
import ThemeLibraryEmptyState from "./components/ThemeLibraryEmptyState.vue";
import ThemeLibraryFilters from "./components/ThemeLibraryFilters.vue";
import ThemeLibraryGallery, {
  type ThemeLibraryCard,
} from "./components/ThemeLibraryGallery.vue";
import ThemeLibraryHero from "./components/ThemeLibraryHero.vue";
import ThemeLibrarySystemHeader from "./components/ThemeLibrarySystemHeader.vue";

const route = useRoute();
const showEmptyState = computed(() => route.query.state === "empty");

const themes: readonly ThemeLibraryCard[] = [
  {
    name: "Cosmos Reference",
    description: "Quiet orbital architecture",
    version: "v1.0.0",
    author: "Cosmos Studio",
    status: "Active",
    tone: "cosmos",
  },
  {
    name: "Minimal",
    description: "Light, space and restraint",
    version: "v2.1.0",
    author: "Core",
    status: "Installed",
    tone: "minimal",
  },
  {
    name: "Nebula Garden",
    description: "A living garden among the stars",
    version: "v1.2.0",
    author: "Northlight Studio",
    status: "Inactive",
    tone: "nebula",
    selected: true,
  },
  {
    name: "Industrial",
    description: "Honest materials and strong forms",
    version: "v1.3.0",
    author: "Ironvale",
    status: "Installed",
    tone: "industrial",
  },
  {
    name: "Fantasy",
    description: "A quiet world of myth and light",
    version: "v1.0.5",
    author: "Mythic Realm",
    status: "Installed",
    tone: "fantasy",
  },
  {
    name: "Pixel",
    description: "Small worlds, precise character",
    version: "v1.4.2",
    author: "Pixel Perfect",
    status: "Installed",
    tone: "pixel",
  },
];
</script>

<style scoped>
.theme-library-view {
  overflow: hidden;
  background:
    radial-gradient(ellipse at 52% 4%, rgba(34, 83, 112, 0.16), transparent 30%),
    radial-gradient(ellipse at 10% 26%, rgba(22, 55, 78, 0.11), transparent 28%),
    linear-gradient(145deg, #02050a, #040a11 58%, #02050a);
  color: var(--cosmos-color-text);
}

.theme-library-view__stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(220, 234, 240, 0.28) 0 0.6px, transparent 1px),
    radial-gradient(circle, rgba(98, 200, 234, 0.19) 0 0.7px, transparent 1.1px);
  background-position: 7px 17px, 48px 73px;
  background-size: 91px 91px, 151px 151px;
  opacity: 0.25;
  pointer-events: none;
}

.theme-library-view__content {
  position: relative;
  z-index: 2;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 76px 34px 24px;
  grid-template-rows: 68px 252px 42px minmax(0, 1fr);
  box-sizing: border-box;
  gap: 12px;
}

.theme-library-view__heading {
  display: flex;
  align-items: center;
}

.theme-library-view__heading h1,
.theme-library-view__collection h2 {
  margin: 0;
  color: #eadfce;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-weight: 400;
}

.theme-library-view__heading h1 {
  font-size: 2.25rem;
  line-height: 1;
}

.theme-library-view__heading p {
  margin: 8px 0 0;
  color: #b5c0c5;
  font-size: 0.72rem;
}

.theme-library-view__heading p span {
  margin-left: 18px;
  color: var(--cosmos-color-muted);
  font-size: 0.64rem;
}

.theme-library-view__collection {
  display: grid;
  min-width: 0;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) 446px;
  gap: 24px;
}

.theme-library-view__gallery {
  display: grid;
  min-width: 0;
  min-height: 0;
  grid-template-rows: 28px minmax(0, 1fr);
}

.theme-library-view__collection h2 {
  align-self: center;
  font-size: 1.03rem;
}

.theme-library-view__content > :deep(.theme-library-empty) {
  grid-row: 2 / -1;
}

@media (max-width: 1280px) {
  .theme-library-view__content {
    padding-inline: 24px;
  }

  .theme-library-view__collection {
    grid-template-columns: minmax(0, 1fr) 390px;
    gap: 16px;
  }
}
</style>
