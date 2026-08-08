<template>
  <BaseRuntimeWindow title="Capture">
    <div class="capture-window" data-testid="base-capture-window">
      <div class="capture-window__visual" role="img" aria-label="Material Study capture preview">
        <span v-for="index in 5" :key="index" :class="`capture-window__sample--${index}`" />
      </div>
      <div class="capture-window__copy">
        <strong>Material Study 07</strong>
        <p><span>Saved</span> to Creation</p>
        <button type="button">Open</button>
      </div>
    </div>
  </BaseRuntimeWindow>
</template>

<script setup lang="ts">
import BaseRuntimeWindow from "./BaseRuntimeWindow.vue";
</script>

<style scoped>
.capture-window {
  display: grid;
  height: 100%;
  min-height: 0;
  padding: 10px 12px 13px;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 10px;
}

.capture-window__visual {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
  background: linear-gradient(145deg, #292621, #0d1113 74%);
}

.capture-window__visual::before {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, transparent 0 44px, rgba(227, 199, 157, 0.03) 44px 45px);
  content: "";
}

.capture-window__visual span {
  position: absolute;
  width: 62px;
  height: 28px;
  transform: rotate(-14deg);
  border: 1px solid rgba(218, 197, 163, 0.15);
  background: linear-gradient(145deg, #534c41, #17191a);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.36);
}

.capture-window__sample--1 { top: 18px; left: 14px; }
.capture-window__sample--2 { top: 28px; right: 16px; }
.capture-window__sample--3 { bottom: 17px; left: 48px; }
.capture-window__sample--4 { right: 52px; bottom: 28px; }
.capture-window__sample--5 { top: 48%; left: 47%; width: 24px !important; height: 24px !important; border-radius: 50%; }

.capture-window__copy {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  align-items: center;
  gap: 4px 10px;
}

.capture-window__copy strong,
.capture-window__copy p {
  grid-column: 1;
}

.capture-window__copy strong {
  color: #e4ddd2;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.82rem;
  font-weight: 400;
}

.capture-window__copy p {
  margin: 0;
  color: var(--cosmos-color-muted);
  font-size: 0.59rem;
}

.capture-window__copy p span {
  color: #b7c5cb;
}

.capture-window__copy button {
  min-height: 30px;
  grid-row: 1 / 3;
  grid-column: 2;
  border: 1px solid var(--cosmos-color-border-strong);
  border-radius: var(--cosmos-radius-control);
  background: rgba(255, 255, 255, 0.02);
  color: var(--cosmos-color-text);
  cursor: pointer;
  font-size: 0.63rem;
}
</style>
