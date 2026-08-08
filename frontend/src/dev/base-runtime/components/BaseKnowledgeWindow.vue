<template>
  <BaseRuntimeWindow title="Knowledge">
    <div class="knowledge-window" data-testid="base-knowledge-window">
      <label>
        <span aria-hidden="true">⌕</span>
        <span class="knowledge-window__visually-hidden">Search Knowledge</span>
        <input type="search" placeholder="Search your knowledge" />
      </label>

      <article class="knowledge-window__featured">
        <div class="knowledge-window__visual" aria-hidden="true"><span /><i /></div>
        <div>
          <strong>Orbital Architecture</strong>
          <p>Principles of form, light and structure in orbital habitats.</p>
        </div>
      </article>

      <section>
        <h2>Recent Research</h2>
        <article v-for="item in recent" :key="item.title">
          <div class="knowledge-window__thumb" aria-hidden="true"><span /></div>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.summary }}</p>
          </div>
        </article>
      </section>
    </div>
  </BaseRuntimeWindow>
</template>

<script setup lang="ts">
import BaseRuntimeWindow from "./BaseRuntimeWindow.vue";

const recent = [
  { title: "Habitat Materials", summary: "Notes on composite shell systems." },
  { title: "Celestial Mechanics", summary: "Orbital dynamics and resonance patterns." },
] as const;
</script>

<style scoped>
.knowledge-window {
  display: grid;
  height: 100%;
  min-height: 0;
  padding: 9px 12px 12px;
  grid-template-rows: 30px 102px minmax(0, 1fr);
  gap: 8px;
}

.knowledge-window > label {
  display: flex;
  min-width: 0;
  align-items: center;
  padding: 0 9px;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
  background: rgba(255, 255, 255, 0.018);
  color: var(--cosmos-color-muted);
  gap: 7px;
}

.knowledge-window input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--cosmos-color-text);
  font-size: 0.62rem;
}

.knowledge-window input::placeholder {
  color: var(--cosmos-color-muted);
}

.knowledge-window__featured,
.knowledge-window section > article {
  display: grid;
  min-width: 0;
  align-items: center;
}

.knowledge-window__featured {
  padding-bottom: 8px;
  grid-template-columns: 84px minmax(0, 1fr);
  border-bottom: 1px solid rgba(181, 211, 225, 0.08);
  gap: 12px;
}

.knowledge-window__visual,
.knowledge-window__thumb {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
  background: radial-gradient(circle at 50% 42%, rgba(181, 211, 225, 0.13), transparent 28%), linear-gradient(145deg, #22282a, #0a0e11);
}

.knowledge-window__visual {
  height: 78px;
}

.knowledge-window__visual span {
  position: absolute;
  inset: 15px 23px;
  border: 1px solid rgba(221, 225, 219, 0.24);
  border-radius: 50%;
}

.knowledge-window__visual i {
  position: absolute;
  top: 36px;
  left: 13px;
  width: 58px;
  border-top: 1px solid rgba(221, 225, 219, 0.24);
  transform: rotate(-23deg);
}

.knowledge-window strong {
  color: #e2ddd4;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.76rem;
  font-weight: 400;
}

.knowledge-window p {
  margin: 5px 0 0;
  color: #9aa8ae;
  font-size: 0.58rem;
  line-height: 1.45;
}

.knowledge-window section {
  display: grid;
  min-height: 0;
  grid-template-rows: 22px repeat(2, minmax(0, 1fr));
}

.knowledge-window h2 {
  margin: 0;
  color: var(--cosmos-color-muted);
  font-size: 0.54rem;
  font-weight: 560;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.knowledge-window section > article {
  grid-template-columns: 52px minmax(0, 1fr);
  border-top: 1px solid rgba(181, 211, 225, 0.07);
  gap: 9px;
}

.knowledge-window__thumb {
  height: 46px;
}

.knowledge-window__thumb span {
  position: absolute;
  inset: 11px;
  border: 1px solid rgba(181, 211, 225, 0.15);
  border-radius: 50%;
}

.knowledge-window__visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>
