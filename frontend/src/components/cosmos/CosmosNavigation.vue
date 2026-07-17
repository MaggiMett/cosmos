<template>
  <nav class="cosmos-navigation" aria-label="Cosmos navigation">
    <button
      v-if="leftNeighbor"
      class="cosmos-navigation__neighbor"
      type="button"
      :title="`Travel to ${leftNeighbor.displayName}`"
      @click="$emit('travel', leftNeighbor.objectId)"
    >
      <span aria-hidden="true">‹</span>{{ leftNeighbor.displayName }}
    </button>
    <span v-else class="cosmos-navigation__spacer" />

    <button
      class="cosmos-navigation__current"
      type="button"
      :aria-expanded="quickTravelOpen"
      aria-controls="quick-travel"
      @click="$emit('toggle-quick-travel')"
    >
      <small>Current location</small>
      <strong>{{ currentLocation }}</strong>
      <span class="cosmos-navigation__mark" aria-hidden="true" />
    </button>

    <button
      v-if="rightNeighbor"
      class="cosmos-navigation__neighbor cosmos-navigation__neighbor--right"
      type="button"
      :title="`Travel to ${rightNeighbor.displayName}`"
      @click="$emit('travel', rightNeighbor.objectId)"
    >
      {{ rightNeighbor.displayName }}<span aria-hidden="true">›</span>
    </button>
    <span v-else class="cosmos-navigation__spacer" />
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  currentLocation: string;
  leftNeighbor: Readonly<{ objectId: string; displayName: string }> | null;
  rightNeighbor: Readonly<{ objectId: string; displayName: string }> | null;
  quickTravelOpen: boolean;
}>();

defineEmits<{
  travel: [projectId: string];
  "toggle-quick-travel": [];
}>();
</script>

<style scoped>
.cosmos-navigation {
  position: fixed;
  z-index: 20;
  top: 18px;
  left: 50%;
  display: grid;
  width: min(680px, calc(100vw - 40px));
  align-items: start;
  transform: translateX(-50%);
  grid-template-columns: minmax(0, 1fr) minmax(190px, auto) minmax(0, 1fr);
  gap: 8px;
  pointer-events: none;
}

.cosmos-navigation button {
  pointer-events: auto;
}

.cosmos-navigation__current {
  position: relative;
  display: grid;
  min-width: 190px;
  padding: 9px 28px 13px;
  border: 1px solid rgba(226, 232, 240, 0.15);
  border-radius: 4px 4px 16px 16px;
  background: linear-gradient(180deg, rgba(18, 25, 50, 0.86), rgba(7, 12, 29, 0.7));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.06), 0 14px 44px rgba(0, 0, 0, 0.22);
  color: #f8fafc;
  text-align: center;
  cursor: pointer;
  backdrop-filter: blur(14px);
}

.cosmos-navigation__current small {
  color: #94a3b8;
  font-size: 0.58rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.cosmos-navigation__current strong {
  margin-top: 3px;
  overflow: hidden;
  font-size: 0.86rem;
  font-weight: 620;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cosmos-navigation__mark {
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  border-right: 1px solid rgba(226, 232, 240, 0.2);
  border-bottom: 1px solid rgba(226, 232, 240, 0.2);
  background: #090f25;
}

.cosmos-navigation__neighbor {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 13px 10px;
  overflow: hidden;
  border: 0;
  background: transparent;
  color: #94a3b8;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.cosmos-navigation__neighbor:hover,
.cosmos-navigation__neighbor:focus-visible {
  color: #e2e8f0;
}

.cosmos-navigation__neighbor span {
  color: #c4b5fd;
  font-size: 1.2rem;
}

.cosmos-navigation__neighbor--right {
  justify-content: flex-start;
}
</style>
