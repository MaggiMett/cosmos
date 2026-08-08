<template>
  <div class="release-notes" data-testid="release-notes">
    <article class="release-notes__copy">
      <div class="release-notes__visual">
        <NeutralVisualPlaceholder label="Release notes preview" variant="thumbnail" />
      </div>
      <p>
        Cosmos Reference frames deep space through quiet architecture, sculpted graphite
        and warm light. Refined object families and responsive looks create a complete
        world for focused work and calm exploration.
      </p>
    </article>

    <aside class="release-notes__actions" aria-label="Release actions">
      <p><BuilderIcon name="spark" /> Complete theme · Ready for release</p>
      <button type="button">Save Draft</button>
      <button type="button" class="release-notes__export">
        <BuilderIcon name="spark" />
        Export Theme Pack
      </button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import BuilderIcon from "./BuilderIcon.vue";
import NeutralVisualPlaceholder from "./NeutralVisualPlaceholder.vue";
</script>

<style scoped>
.release-notes {
  display: grid;
  height: 100%;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) minmax(560px, 1fr);
  gap: 12px;
}

.release-notes__copy,
.release-notes__actions {
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-card);
  background: linear-gradient(145deg, var(--builder-surface-raised), var(--builder-surface));
}

.release-notes__copy {
  display: grid;
  padding: 10px 12px;
  grid-template-columns: 146px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.release-notes__visual {
  height: 100%;
  min-height: 68px;
  overflow: hidden;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-control);
}

.release-notes__visual > :deep(.neutral-visual) {
  width: 100%;
  height: 100%;
}

.release-notes__copy > p {
  margin: 0;
  color: #c8c4bc;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.8rem;
  line-height: 1.4;
}

.release-notes__actions {
  display: grid;
  padding: 14px 18px;
  grid-template-columns: minmax(220px, 1fr) 128px 244px;
  align-items: center;
  gap: 12px;
}

.release-notes__actions p {
  display: flex;
  margin: 0;
  align-items: center;
  color: var(--builder-muted);
  font-size: 0.7rem;
  gap: 9px;
  white-space: nowrap;
}

.release-notes__actions p :deep(.builder-icon) {
  width: 1.55rem;
  height: 1.55rem;
  color: var(--builder-text);
}

.release-notes__actions button {
  display: flex;
  min-height: 48px;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--builder-border-strong);
  border-radius: var(--builder-radius-control);
  background: rgba(255, 255, 255, 0.018);
  color: var(--builder-text);
  cursor: pointer;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.86rem;
  transition:
    border-color var(--builder-control-transition),
    background var(--builder-control-transition);
}

.release-notes__actions button:hover {
  border-color: var(--builder-accent);
}

.release-notes__actions .release-notes__export {
  gap: 11px;
  border-color: rgba(143, 178, 211, 0.7);
  background: linear-gradient(180deg, rgba(82, 119, 154, 0.3), rgba(43, 71, 98, 0.18));
  box-shadow: 0 0 22px rgba(80, 121, 157, 0.18);
  font-size: 1rem;
}

.release-notes__export :deep(.builder-icon) {
  width: 1.35rem;
  height: 1.35rem;
}

@media (max-width: 1280px) {
  .release-notes {
    grid-template-columns: minmax(0, 0.95fr) minmax(520px, 1.05fr);
  }

  .release-notes__actions {
    grid-template-columns: 1fr 112px 210px;
    padding-inline: 12px;
  }

  .release-notes__actions p {
    font-size: 0.64rem;
  }
}
</style>
