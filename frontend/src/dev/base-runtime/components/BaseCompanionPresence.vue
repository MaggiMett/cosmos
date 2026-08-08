<template>
  <div class="base-companion-presence" data-testid="base-companion-presence">
    <div class="base-companion-presence__avatar">
      <CompanionAvatar mode="compact" />
    </div>
    <div class="base-companion-presence__message">
      <strong><span aria-hidden="true">✦</span> Companion</strong>
      <p>Ready when you are</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CompanionAvatar from "../../../components/entities/CompanionAvatar.vue";
</script>

<style scoped>
.base-companion-presence {
  position: absolute;
  z-index: 13;
  bottom: 12%;
  left: 50%;
  width: 310px;
  height: 130px;
  transform: translateX(-18%);
  pointer-events: none;
}

.base-companion-presence__avatar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 92px;
  height: 92px;
  padding: 10px;
  border: 1px solid rgba(181, 211, 225, 0.14);
  border-radius: 50%;
  background: rgba(7, 13, 19, 0.88);
  box-shadow: 0 18px 28px rgba(0, 0, 0, 0.4);
}

.base-companion-presence__message {
  position: absolute;
  right: 0;
  bottom: 10px;
  width: 190px;
  padding: 11px 14px;
  border: 1px solid rgba(110, 173, 204, 0.42);
  border-radius: var(--cosmos-radius-window);
  background: rgba(8, 17, 26, 0.88);
  box-shadow: 0 15px 34px rgba(0, 0, 0, 0.34), 0 0 18px rgba(78, 166, 204, 0.08);
  backdrop-filter: blur(12px);
}

.base-companion-presence__message strong {
  display: flex;
  align-items: center;
  color: #dce5e8;
  font-size: 0.67rem;
  font-weight: 520;
  gap: 7px;
}

.base-companion-presence__message strong span {
  color: var(--cosmos-color-accent);
}

.base-companion-presence__message p {
  margin: 6px 0 0 18px;
  color: var(--cosmos-color-muted);
  font-size: 0.64rem;
}
</style>
