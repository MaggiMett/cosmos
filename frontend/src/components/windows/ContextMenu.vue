<template>
  <section
    ref="menuElement"
    class="context-menu"
    role="menu"
    :aria-label="`${menu.displayName} actions`"
    :style="positionStyle"
    @contextmenu.prevent
  >
    <header>
      <span>{{ menu.displayName }}</span>
      <small>Object</small>
    </header>
    <div v-for="group in groups" :key="group.name" class="context-menu__group">
      <button
        v-for="action in group.actions"
        :key="action.id"
        type="button"
        role="menuitem"
        :disabled="!action.enabled"
        @click="$emit('action', action)"
      >
        <span>{{ action.label }}</span>
        <i aria-hidden="true">›</i>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import type { ContextMenuState, ObjectAction } from "../../runtime/objectInteractionRuntime";
import type { WindowBounds } from "../../runtime/windowRuntime";

const props = defineProps<{ menu: ContextMenuState; ownerBounds?: WindowBounds }>();
const emit = defineEmits<{ action: [action: ObjectAction]; close: [] }>();
const menuElement = ref<HTMLElement | null>(null);

const groups = computed(() => {
  const values = new Map<string, ObjectAction[]>();
  for (const action of props.menu.actions) {
    const group = values.get(action.group) ?? [];
    group.push(action);
    values.set(action.group, group);
  }
  return [...values].map(([name, actions]) => ({ name, actions }));
});

const positionStyle = computed(() => {
  const owner = props.ownerBounds ?? {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  return {
    left: `${Math.max(owner.x + 12, Math.min(props.menu.x, owner.x + owner.width - 252))}px`,
    top: `${Math.max(owner.y + 12, Math.min(props.menu.y, owner.y + owner.height - 330))}px`,
  };
});

function closeFromOutside(event: PointerEvent) {
  if (!menuElement.value?.contains(event.target as Node)) emit("close");
}

function closeFromKeyboard(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
  }
}

onMounted(() => {
  window.addEventListener("pointerdown", closeFromOutside, true);
  window.addEventListener("keydown", closeFromKeyboard);
  void nextTick(() => menuElement.value?.querySelector<HTMLButtonElement>("button")?.focus());
});

onBeforeUnmount(() => {
  window.removeEventListener("pointerdown", closeFromOutside, true);
  window.removeEventListener("keydown", closeFromKeyboard);
});
</script>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 160;
  width: 240px;
  padding: 7px;
  overflow: hidden;
  border: 1px solid rgba(205, 220, 242, 0.18);
  border-radius: 12px;
  background: rgba(7, 12, 27, 0.96);
  box-shadow: 0 18px 58px rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(18px);
  animation: context-menu-open 120ms ease-out both;
}

.context-menu header {
  display: flex;
  padding: 8px 10px 9px;
  align-items: baseline;
  justify-content: space-between;
  color: #e7edf7;
  font-size: 0.75rem;
  font-weight: 650;
}

.context-menu header small {
  color: #73839d;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.context-menu__group + .context-menu__group {
  padding-top: 5px;
  border-top: 1px solid rgba(220, 232, 248, 0.08);
}

.context-menu__group { padding: 3px 0; }

.context-menu button {
  display: flex;
  width: 100%;
  min-height: 36px;
  padding: 0 10px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #cbd5e1;
  font-size: 0.7rem;
  text-align: left;
  cursor: pointer;
}

.context-menu button:hover,
.context-menu button:focus-visible {
  border-color: rgba(196, 181, 253, 0.2);
  outline: none;
  background: rgba(139, 92, 246, 0.11);
  color: #f8fafc;
}

.context-menu button:disabled { opacity: 0.4; cursor: default; }
.context-menu button i { color: #718096; font-size: 1rem; font-style: normal; }

@keyframes context-menu-open {
  from { transform: translateY(-4px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .context-menu { animation-duration: 1ms; }
}
</style>
