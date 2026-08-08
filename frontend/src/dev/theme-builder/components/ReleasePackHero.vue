<template>
  <section class="release-hero" data-testid="release-pack-hero">
    <div class="release-hero__cover">
      <NeutralVisualPlaceholder label="Theme Pack Cover" variant="canvas" />
      <span>Theme Pack Cover</span>
    </div>

    <div class="release-hero__summary">
      <header>
        <p>Complete Theme Pack</p>
        <h1 class="builder-serif">Cosmos Reference</h1>
        <span>A quiet orbital world shaped by graphite and distant light.</span>
      </header>

      <div class="release-hero__details">
        <div class="release-hero__thumbnail">
          <NeutralVisualPlaceholder label="Cosmos Reference cover" variant="thumbnail" />
        </div>
        <dl>
          <div>
            <dt>Theme Name</dt>
            <dd>Cosmos Reference</dd>
          </div>
          <div>
            <dt>Version</dt>
            <dd>1.0.0</dd>
          </div>
          <div>
            <dt>Pack Type</dt>
            <dd>Complete Theme</dd>
          </div>
          <div>
            <dt>Health</dt>
            <dd>Excellent · 96%</dd>
          </div>
        </dl>
        <div class="release-hero__ready">
          <span><BuilderIcon name="check" /></span>
          <strong class="builder-serif">Ready for Release</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BuilderIcon from "./BuilderIcon.vue";
import NeutralVisualPlaceholder from "./NeutralVisualPlaceholder.vue";
</script>

<style scoped>
.release-hero {
  display: grid;
  min-width: 0;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}

.release-hero__cover,
.release-hero__summary {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--builder-border);
  border-radius: var(--builder-radius-card);
  background: var(--builder-surface);
}

.release-hero__cover {
  position: relative;
}

.release-hero__cover > :deep(.neutral-visual) {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.release-hero__cover > span {
  position: absolute;
  bottom: 14px;
  left: 16px;
  color: var(--builder-muted);
  font-size: 0.7rem;
}

.release-hero__summary {
  display: grid;
  padding: clamp(18px, 2vw, 28px);
  grid-template-rows: auto minmax(0, 1fr);
  background:
    radial-gradient(circle at 82% 48%, rgba(120, 149, 177, 0.08), transparent 24%),
    linear-gradient(145deg, var(--builder-surface-raised), var(--builder-surface));
  gap: 16px;
}

.release-hero__summary header {
  display: grid;
  align-content: start;
  gap: 6px;
}

.release-hero__summary header p,
.release-hero__summary header span {
  margin: 0;
  color: var(--builder-muted);
  font-size: 0.72rem;
}

.release-hero__summary header p {
  color: var(--builder-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.release-hero__summary h1 {
  margin: 0;
  font-size: clamp(1.9rem, 2.5vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.025em;
}

.release-hero__details {
  display: grid;
  min-height: 0;
  grid-template-columns: 140px minmax(230px, 1fr) minmax(150px, 0.8fr);
  align-items: center;
  gap: 20px;
}

.release-hero__thumbnail {
  height: 100%;
  min-height: 108px;
  overflow: hidden;
  border: 1px solid var(--builder-border-strong);
  border-radius: var(--builder-radius-control);
}

.release-hero__thumbnail > :deep(.neutral-visual) {
  width: 100%;
  height: 100%;
}

.release-hero dl {
  display: grid;
  margin: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 22px;
}

.release-hero dl div {
  min-width: 0;
}

.release-hero dt {
  margin-bottom: 5px;
  color: var(--builder-muted);
  font-size: 0.68rem;
}

.release-hero dd {
  margin: 0;
  overflow: hidden;
  color: var(--builder-text);
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.release-hero__ready {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 9px;
}

.release-hero__ready > span {
  display: grid;
  width: 74px;
  height: 74px;
  place-items: center;
  border: 1px solid rgba(120, 149, 177, 0.52);
  border-radius: 50%;
  background: rgba(120, 149, 177, 0.07);
  box-shadow: inset 0 0 0 7px rgba(120, 149, 177, 0.04);
  color: var(--builder-text);
}

.release-hero__ready > span :deep(.builder-icon) {
  width: 2rem;
  height: 2rem;
}

.release-hero__ready strong {
  font-size: clamp(1rem, 1.45vw, 1.35rem);
  font-weight: 400;
  white-space: nowrap;
}

@media (max-width: 1280px) {
  .release-hero__details {
    grid-template-columns: 100px minmax(210px, 1fr) 140px;
    gap: 14px;
  }

  .release-hero__ready > span {
    width: 62px;
    height: 62px;
  }
}
</style>
