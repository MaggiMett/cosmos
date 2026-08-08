<template>
  <header class="base-runtime-chrome" data-testid="base-runtime-chrome">
    <div class="base-runtime-chrome__brand" aria-label="Cosmos">
      <span aria-hidden="true">✦</span>
      <strong>COSMOS</strong>
    </div>

    <CosmosNavigation
      current-location="Base · Main Room"
      :left-neighbor="leftNeighbor"
      :right-neighbor="rightNeighbor"
      :quick-travel-open="false"
    />

    <div class="base-runtime-chrome__status" aria-label="Runtime status">
      <span><i class="base-runtime-chrome__dot base-runtime-chrome__dot--synced" />Local · Synced</span>
      <span><i class="base-runtime-chrome__dot" />Base · Quiet mode</span>
      <button type="button" aria-label="Open Companion">
        <CompanionAvatar mode="compact" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import CosmosNavigation from "../../../components/cosmos/CosmosNavigation.vue";
import CompanionAvatar from "../../../components/entities/CompanionAvatar.vue";

const leftNeighbor = { objectId: "cosmos", displayName: "Cosmos" } as const;
const rightNeighbor = { objectId: "workshop", displayName: "Workshop" } as const;
</script>

<style scoped>
.base-runtime-chrome {
  position: fixed;
  z-index: 40;
  top: 0;
  right: 0;
  left: 0;
  height: 82px;
  pointer-events: none;
}

.base-runtime-chrome__brand,
.base-runtime-chrome__status {
  position: absolute;
  top: 20px;
  display: flex;
  align-items: center;
  pointer-events: auto;
}

.base-runtime-chrome__brand {
  left: 30px;
  color: #e9e3da;
  gap: 16px;
}

.base-runtime-chrome__brand > span {
  font-size: 1.8rem;
  line-height: 1;
}

.base-runtime-chrome__brand strong {
  font-size: 0.76rem;
  font-weight: 520;
  letter-spacing: 0.46em;
}

.base-runtime-chrome__status {
  right: 28px;
  gap: 9px;
}

.base-runtime-chrome__status > span {
  display: flex;
  min-height: 38px;
  padding: 0 13px;
  align-items: center;
  border: 1px solid var(--cosmos-color-border);
  border-radius: var(--cosmos-radius-control);
  background: rgba(5, 10, 16, 0.7);
  color: #bac5ca;
  font-size: 0.66rem;
  gap: 8px;
  backdrop-filter: blur(12px);
}

.base-runtime-chrome__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6aa8d8;
  box-shadow: 0 0 8px rgba(106, 168, 216, 0.45);
}

.base-runtime-chrome__dot--synced {
  background: var(--cosmos-color-green);
  box-shadow: 0 0 8px rgba(117, 207, 169, 0.45);
}

.base-runtime-chrome__status button {
  width: 46px;
  height: 46px;
  padding: 7px;
  border: 1px solid var(--cosmos-color-border-strong);
  border-radius: 50%;
  background: rgba(5, 10, 16, 0.76);
  cursor: pointer;
}
</style>
