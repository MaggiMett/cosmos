<template>
  <div class="home-hub" aria-label="Cosmos home">
    <button class="companion-object" type="button" aria-label="Talk to Companion" @click="$emit('companion')">
      <CompanionAvatar :notification-available="notificationAvailable" />
      <span class="home-hub__label">Companion</span>
    </button>

    <button class="ship-object" type="button" aria-label="Open Base" @click="$emit('ship')">
      <span class="ship-object__vessel" aria-hidden="true">
        <i class="ship-object__wing ship-object__wing--left" />
        <i class="ship-object__wing ship-object__wing--right" />
        <i class="ship-object__body" />
        <i class="ship-object__window" />
        <i class="ship-object__engine ship-object__engine--left" />
        <i class="ship-object__engine ship-object__engine--right" />
      </span>
      <span class="home-hub__label">Base</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import CompanionAvatar from "../entities/CompanionAvatar.vue";

withDefaults(defineProps<{ notificationAvailable?: boolean }>(), { notificationAvailable: false });
defineEmits<{ companion: []; ship: [] }>();
</script>

<style scoped>
.home-hub {
  position: fixed;
  z-index: 22;
  right: clamp(20px, 3vw, 52px);
  bottom: clamp(18px, 3.5vh, 44px);
  display: flex;
  width: clamp(210px, 15vw, 290px);
  height: clamp(140px, 15vh, 210px);
  align-items: flex-end;
  justify-content: flex-end;
  gap: 4px;
  pointer-events: none;
}

.home-hub button {
  position: relative;
  padding: 0;
  border: 0;
  background: transparent;
  color: #e2e8f0;
  cursor: pointer;
  pointer-events: auto;
}

.home-hub__label {
  position: absolute;
  bottom: -17px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 160ms ease;
}

.home-hub button:hover .home-hub__label,
.home-hub button:focus-visible .home-hub__label {
  opacity: 1;
}

.companion-object {
  z-index: 2;
  width: clamp(82px, 7vw, 112px);
  height: clamp(82px, 7vw, 112px);
  margin-right: -18px;
  margin-bottom: 54px;
  border-radius: 50% !important;
  animation: companion-float 6s ease-in-out infinite;
}

.ship-object {
  width: clamp(140px, 11vw, 200px);
  height: clamp(95px, 9vw, 150px);
}

.ship-object__vessel {
  position: absolute;
  inset: 0;
  filter: drop-shadow(0 14px 16px rgba(0, 0, 0, 0.46));
  transition: transform 180ms ease, filter 180ms ease;
  animation: ship-hover 7s ease-in-out infinite;
}

.ship-object:hover .ship-object__vessel,
.ship-object:focus-visible .ship-object__vessel {
  transform: translateY(-4px) scale(1.03);
  filter: drop-shadow(0 16px 24px rgba(125, 211, 252, 0.2));
}

.ship-object__body {
  position: absolute;
  right: 20%;
  bottom: 28%;
  left: 18%;
  height: 38%;
  transform: skewX(-7deg);
  border: 1px solid rgba(226, 232, 240, 0.52);
  border-radius: 52% 44% 36% 42%;
  background: linear-gradient(165deg, #cbd5e1 0 28%, #64748b 55%, #1e293b 100%);
  box-shadow: inset 0 4px rgba(255, 255, 255, 0.18);
}

.ship-object__wing {
  position: absolute;
  bottom: 18%;
  width: 47%;
  height: 28%;
  background: linear-gradient(150deg, #475569, #111827);
  clip-path: polygon(0 70%, 100% 0, 86% 100%);
}

.ship-object__wing--left { left: 0; }
.ship-object__wing--right { right: 0; transform: scaleX(-1); }

.ship-object__window {
  position: absolute;
  z-index: 2;
  top: 34%;
  left: 45%;
  width: 22%;
  height: 20%;
  transform: skewX(-7deg);
  border: 1px solid rgba(186, 230, 253, 0.52);
  border-radius: 50% 50% 36% 36%;
  background: linear-gradient(145deg, rgba(224, 242, 254, 0.86), rgba(14, 116, 144, 0.62));
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.32);
}

.ship-object__engine {
  position: absolute;
  bottom: 24%;
  width: 17%;
  height: 12%;
  border-radius: 50%;
  background: #bae6fd;
  box-shadow: 0 0 12px #38bdf8, -12px 2px 22px rgba(56, 189, 248, 0.46);
}

.ship-object__engine--left { left: 18%; }
.ship-object__engine--right { right: 22%; }

@keyframes companion-float { 50% { transform: translateY(-5px) rotate(1deg); } }
@keyframes ship-hover { 50% { transform: translateY(-3px); } }

@media (prefers-reduced-motion: reduce) {
  .companion-object,
  .ship-object__vessel {
    animation: none;
  }
}
</style>
