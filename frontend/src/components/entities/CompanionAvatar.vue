<template>
  <span class="companion-avatar" :class="`companion-avatar--${mode}`" aria-hidden="true">
    <span v-if="mode === 'seated'" class="companion-avatar__body">
      <i class="companion-avatar__arm companion-avatar__arm--left" />
      <i class="companion-avatar__arm companion-avatar__arm--right" />
      <i class="companion-avatar__leg companion-avatar__leg--left" />
      <i class="companion-avatar__leg companion-avatar__leg--right" />
    </span>
    <span class="companion-avatar__helmet">
      <span class="companion-avatar__visor">
        <span class="companion-avatar__face">
          <i class="companion-avatar__eye companion-avatar__eye--left" />
          <i class="companion-avatar__eye companion-avatar__eye--right" />
          <i class="companion-avatar__smile" />
        </span>
        <span class="companion-avatar__reflection" />
      </span>
      <span class="companion-avatar__collar" />
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ mode?: "compact" | "seated" }>(), { mode: "compact" });
</script>

<style scoped>
.companion-avatar {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.companion-avatar__helmet {
  position: absolute;
  z-index: 2;
  inset: 4%;
  border: 2px solid rgba(226, 232, 240, 0.72);
  border-radius: 50%;
  background: radial-gradient(circle at 40% 30%, #f8fafc, #cbd5e1 58%, #64748b 100%);
  box-shadow: 0 0 26px rgba(125, 211, 252, 0.2), inset -8px -10px 14px rgba(30, 41, 59, 0.3);
  transition: filter 160ms ease, transform 160ms ease;
}

.companion-avatar__visor {
  position: absolute;
  inset: 14% 10% 18%;
  overflow: hidden;
  border: 2px solid rgba(125, 211, 252, 0.46);
  border-radius: 48% 48% 44% 44%;
  background: radial-gradient(circle at 48% 56%, #1e293b, #07101f 74%);
  box-shadow: inset 0 0 16px rgba(125, 211, 252, 0.18);
}

.companion-avatar__face {
  position: absolute;
  inset: 24% 20% 18%;
  border-radius: 46%;
  background: radial-gradient(circle at 46% 38%, #f7d7bd, #bd8268 86%);
}

.companion-avatar__eye {
  position: absolute;
  top: 38%;
  width: 8%;
  height: 10%;
  border-radius: 50%;
  background: #172033;
  animation: companion-blink 6.5s infinite;
}

.companion-avatar__eye--left { left: 29%; }
.companion-avatar__eye--right { right: 29%; }

.companion-avatar__smile {
  position: absolute;
  bottom: 22%;
  left: 40%;
  width: 20%;
  height: 10%;
  border-bottom: 2px solid #6e3c35;
  border-radius: 50%;
}

.companion-avatar__reflection {
  position: absolute;
  top: 9%;
  left: 14%;
  width: 36%;
  height: 13%;
  transform: rotate(-15deg);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.companion-avatar__collar {
  position: absolute;
  z-index: -1;
  right: 18%;
  bottom: -10%;
  left: 18%;
  height: 30%;
  border-radius: 20px 20px 8px 8px;
  background: linear-gradient(90deg, #64748b, #e2e8f0 45%, #64748b);
}

.companion-avatar--seated .companion-avatar__helmet {
  inset: 0 18% 42%;
}

.companion-avatar__body {
  position: absolute;
  z-index: 1;
  right: 24%;
  bottom: 12%;
  left: 24%;
  height: 48%;
  border: 2px solid rgba(226, 232, 240, 0.5);
  border-radius: 42% 42% 28% 28%;
  background: linear-gradient(155deg, #e2e8f0, #64748b 74%);
  box-shadow: inset -8px -8px 12px rgba(15, 23, 42, 0.26);
}

.companion-avatar__arm,
.companion-avatar__leg {
  position: absolute;
  background: linear-gradient(155deg, #cbd5e1, #475569);
}

.companion-avatar__arm {
  top: 18%;
  width: 28%;
  height: 56%;
  border-radius: 999px;
}

.companion-avatar__arm--left { left: -18%; transform: rotate(18deg); }
.companion-avatar__arm--right { right: -18%; transform: rotate(-18deg); }

.companion-avatar__leg {
  bottom: -18%;
  width: 42%;
  height: 34%;
  border-radius: 8px 8px 18px 18px;
}

.companion-avatar__leg--left { left: 4%; transform: rotate(18deg); }
.companion-avatar__leg--right { right: 4%; transform: rotate(-18deg); }

@keyframes companion-blink {
  0%, 46%, 50%, 100% { transform: scaleY(1); }
  48% { transform: scaleY(0.12); }
}

@media (prefers-reduced-motion: reduce) {
  .companion-avatar__eye { animation: none; }
}
</style>
