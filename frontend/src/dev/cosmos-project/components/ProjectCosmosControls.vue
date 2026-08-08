<template>
  <div class="project-cosmos-controls" data-testid="project-cosmos-controls">
    <div class="project-cosmos-controls__zoom" aria-label="Zoom controls">
      <button type="button" aria-label="Zoom out">−</button>
      <span>72%</span>
      <button type="button" aria-label="Zoom in">+</button>
    </div>
    <button type="button" class="project-cosmos-controls__fit">Fit</button>
    <button type="button" class="project-cosmos-controls__search">
      <span aria-hidden="true">⌕</span>
      Search / Focus
    </button>
    <p><span>Cosmos</span><i aria-hidden="true">/</i><strong>Project</strong><i aria-hidden="true">/</i>Asteria</p>
  </div>
</template>

<style scoped>
.project-cosmos-controls {
  position: fixed;
  z-index: 24;
  right: 30px;
  bottom: 26px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.project-cosmos-controls button,
.project-cosmos-controls__zoom {
  pointer-events: auto;
}

.project-cosmos-controls__zoom {
  display: grid;
  min-height: 43px;
  grid-template-columns: 38px 52px 38px;
  align-items: center;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-window);
  background: rgba(3, 8, 14, 0.72);
  backdrop-filter: blur(12px);
}

.project-cosmos-controls__zoom button,
.project-cosmos-controls > button {
  border: 0;
  background: transparent;
  color: #c7d2d7;
  cursor: pointer;
}

.project-cosmos-controls__zoom button {
  display: grid;
  width: 29px;
  height: 29px;
  margin: auto;
  padding: 0;
  place-items: center;
  border: 1px solid var(--cosmos-color-border);
  border-radius: 50%;
  font-size: 0.95rem;
}

.project-cosmos-controls__zoom span {
  color: #bdc8cd;
  font-size: 0.68rem;
  text-align: center;
}

.project-cosmos-controls > button {
  min-height: 43px;
  padding: 0 15px;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-window);
  background: rgba(3, 8, 14, 0.72);
  font-size: 0.66rem;
  backdrop-filter: blur(12px);
}

.project-cosmos-controls__search {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-cosmos-controls p {
  display: flex;
  margin: 0 0 0 auto;
  padding: 9px 12px;
  align-items: center;
  color: var(--cosmos-color-faint);
  font-size: 0.59rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  gap: 8px;
}

.project-cosmos-controls p span,
.project-cosmos-controls p strong {
  color: var(--cosmos-color-muted);
  font-weight: 520;
}

.project-cosmos-controls p i {
  color: rgba(98, 200, 234, 0.38);
  font-style: normal;
}
</style>
