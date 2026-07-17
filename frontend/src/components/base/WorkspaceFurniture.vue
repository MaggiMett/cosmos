<template>
  <button
    type="button"
    class="workspace-furniture"
    :class="[
      `workspace-furniture--${slot.placement.replaceAll('_', '-')}`,
      `workspace-furniture--${slot.skin.toLowerCase()}`,
      {
        'workspace-furniture--assigned': slot.workspace,
        'workspace-furniture--selected': selected,
      },
    ]"
    :aria-label="label"
    :aria-pressed="selected"
    @click="$emit('select', slot.objectId)"
  >
    <span class="workspace-furniture__surface" aria-hidden="true">
      <i class="workspace-furniture__screen" />
      <i class="workspace-furniture__light" />
      <i class="workspace-furniture__leg workspace-furniture__leg--left" />
      <i class="workspace-furniture__leg workspace-furniture__leg--right" />
    </span>
    <span class="workspace-furniture__label">
      <strong>{{ slot.workspace?.displayName ?? "Empty Workspace" }}</strong>
      <small>{{ slot.workspace ? "Workspace" : "Available slot" }}</small>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { WorkspaceSlot } from "../../runtime/baseRuntime";

const props = defineProps<{ slot: WorkspaceSlot; selected: boolean }>();
defineEmits<{ select: [objectId: string] }>();

const label = computed(() =>
  props.slot.workspace
    ? `${props.slot.workspace.displayName} furniture`
    : `${props.slot.displayName}, available Workspace Slot`,
);
</script>

<style scoped>
.workspace-furniture {
  --furniture-accent: #7dd3fc;
  position: absolute;
  z-index: 6;
  display: grid;
  width: clamp(180px, 18vw, 300px);
  height: clamp(126px, 19vh, 210px);
  padding: 0;
  border: 0;
  background: transparent;
  color: #e7edf5;
  cursor: pointer;
  filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.34));
}

.workspace-furniture--knowledgedesk { --furniture-accent: #8ae6c6; }
.workspace-furniture--creationworkbench { --furniture-accent: #e9a86d; }
.workspace-furniture--workshopbench { --furniture-accent: #8eb9cb; }

.workspace-furniture__surface {
  position: absolute;
  inset: 18% 5% 22%;
  border: 1px solid rgba(224, 238, 244, 0.26);
  border-radius: 10px 10px 5px 5px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 16%),
    linear-gradient(155deg, #526573, #25323d 68%, #18212b);
  box-shadow: inset 0 2px rgba(255, 255, 255, 0.08);
  transform: perspective(500px) rotateX(12deg);
  transition: border-color 160ms ease, filter 160ms ease, transform 160ms ease;
}

.workspace-furniture__screen {
  position: absolute;
  right: 22%;
  bottom: 78%;
  left: 22%;
  height: 54%;
  border: 5px solid #26333e;
  border-bottom-width: 9px;
  border-radius: 9px;
  background:
    linear-gradient(140deg, rgba(255, 255, 255, 0.14), transparent 38%),
    color-mix(in srgb, var(--furniture-accent) 30%, #07141c);
  box-shadow: 0 0 18px color-mix(in srgb, var(--furniture-accent) 22%, transparent);
}

.workspace-furniture:not(.workspace-furniture--assigned) .workspace-furniture__screen {
  border-width: 2px;
  border-style: dashed;
  background: rgba(10, 20, 27, 0.58);
  box-shadow: none;
  opacity: 0.6;
}

.workspace-furniture__light {
  position: absolute;
  top: 16%;
  right: 7%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--furniture-accent);
  box-shadow: 0 0 9px var(--furniture-accent);
}

.workspace-furniture__leg {
  position: absolute;
  top: 92%;
  width: 8%;
  height: 48%;
  border-radius: 0 0 3px 3px;
  background: #25323c;
}

.workspace-furniture__leg--left { left: 13%; }
.workspace-furniture__leg--right { right: 13%; }

.workspace-furniture__label {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  gap: 2px;
  text-align: center;
  text-shadow: 0 2px 5px #080d12;
}

.workspace-furniture__label strong {
  font-size: clamp(0.68rem, 0.82vw, 0.82rem);
  font-weight: 620;
}

.workspace-furniture__label small {
  color: rgba(199, 218, 229, 0.56);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.workspace-furniture:hover .workspace-furniture__surface,
.workspace-furniture:focus-visible .workspace-furniture__surface,
.workspace-furniture--selected .workspace-furniture__surface {
  border-color: color-mix(in srgb, var(--furniture-accent) 72%, white);
  filter: brightness(1.12);
  transform: perspective(500px) rotateX(12deg) translateY(-3px);
}

.workspace-furniture:focus-visible { outline: 0; }
.workspace-furniture:focus-visible .workspace-furniture__surface {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2), 0 0 24px var(--furniture-accent);
}

@media (prefers-reduced-motion: reduce) {
  .workspace-furniture__surface { transition: none; }
}
</style>
