<template>
  <section class="base-stage environment-view" :class="`base-stage--${roomSlug}`" aria-label="Base">
    <div class="base-stage__cosmos" aria-hidden="true">
      <i v-for="index in 14" :key="index" :style="starStyle(index)" />
    </div>

    <div v-if="state.phase === 'loading' || state.phase === 'idle'" class="base-status" role="status">
      <span class="base-status__signal" aria-hidden="true" />
      <p>Approaching Base…</p>
    </div>
    <div v-else-if="state.phase === 'failed'" class="base-status" role="alert">
      <p>{{ state.error }}</p>
      <button type="button" @click="load">Try again</button>
    </div>

    <article v-if="snapshot && room" class="base-environment" :aria-label="`${room.displayName} environment`">
      <button class="base-environment__close" type="button" aria-label="Return to Cosmos" @click="closeBase">
        <span aria-hidden="true">×</span>
      </button>

      <div class="room-shell" aria-hidden="true">
        <div class="room-shell__ceiling" />
        <div class="room-shell__wall room-shell__wall--left" />
        <div class="room-shell__wall room-shell__wall--right" />
        <div class="room-shell__floor" />
        <div class="room-shell__beam room-shell__beam--left" />
        <div class="room-shell__beam room-shell__beam--right" />
      </div>

      <template v-if="roomSlug === 'main'">
        <section class="cockpit" aria-label="Cockpit">
          <div class="cockpit__window" aria-label="Panoramic view of Cosmos">
            <i v-for="index in 24" :key="index" :style="cockpitStarStyle(index)" aria-hidden="true" />
            <span class="cockpit__nebula" aria-hidden="true" />
          </div>
          <span class="cockpit__arch" aria-hidden="true" />
          <span class="cockpit__console" aria-hidden="true" />
          <span class="cockpit__seat cockpit__seat--left" aria-hidden="true" />
          <span class="cockpit__seat cockpit__seat--right" aria-hidden="true" />
        </section>

        <WorkspaceFurniture
          v-for="slot in room.workspaceSlots"
          :key="slot.objectId"
          :slot="slot"
          :selected="state.selectedObjectId === slot.objectId"
          @select="select"
        />

        <button
          type="button"
          class="base-companion"
          :aria-label="`Talk with ${snapshot.companion.displayName}`"
          @click="openCompanion"
        >
          <CompanionAvatar mode="seated" />
          <span>{{ snapshot.companion.displayName }}</span>
        </button>

        <button
          type="button"
          class="base-pet"
          :class="{ 'base-pet--greeting': petGreeting }"
          :aria-label="`Pet ${snapshot.pet.displayName}`"
          @click="greetPet"
        >
          <span class="base-pet__tail" aria-hidden="true" />
          <span class="base-pet__body" aria-hidden="true"><i /><i /></span>
          <span class="base-pet__head" aria-hidden="true"><i /><i /><b /><b /></span>
          <small>{{ petGreeting ? "Hello!" : snapshot.pet.displayName }}</small>
        </button>
      </template>

      <template v-else>
        <div class="workshop-sign" aria-hidden="true">
          <span>Workshop</span>
          <small>Workspace bay</small>
        </div>
        <WorkspaceFurniture
          v-for="slot in room.workspaceSlots"
          :key="slot.objectId"
          :slot="slot"
          :selected="state.selectedObjectId === slot.objectId"
          @select="select"
        />
      </template>

      <button type="button" class="room-door" :aria-label="doorLabel" @click="travelThroughDoor">
        <span class="room-door__frame" aria-hidden="true"><i /></span>
        <strong>{{ roomSlug === "main" ? "Workshop" : "Main Room" }}</strong>
        <small>{{ roomSlug === "main" ? "Enter room" : "Return home" }}</small>
      </button>

      <p v-if="selectedSlot" class="selection-note" role="status">
        <strong>{{ selectedSlot.workspace?.displayName ?? "Empty Workspace Slot" }}</strong>
        <span>{{ selectedSlot.workspace ? "Ready for Sprint 4" : "Available for a future Workspace" }}</span>
      </p>

      <CompanionWindowHost ref="companionWindowHost" :current-location="room.displayName" />
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import WorkspaceFurniture from "../components/base/WorkspaceFurniture.vue";
import CompanionWindowHost from "../components/cosmos/CompanionWindowHost.vue";
import CompanionAvatar from "../components/entities/CompanionAvatar.vue";
import type { BaseSnapshot, WorkspaceSlot } from "../runtime/baseRuntime";
import { useCosmosRuntime } from "../runtime/plugin";

const runtime = useCosmosRuntime();
const route = useRoute();
const router = useRouter();
const state = runtime.base.state;
const snapshot = computed(() => state.snapshot as BaseSnapshot | null);
const petGreeting = ref(false);
const companionWindowHost = ref<InstanceType<typeof CompanionWindowHost> | null>(null);
let petTimer: ReturnType<typeof setTimeout> | null = null;

const requestedRoom = computed(() =>
  route.meta.environment === "room" ? String(route.params.roomId ?? "main") : "main",
);
const roomSlug = computed<"main" | "workshop">(() =>
  requestedRoom.value === "workshop" ? "workshop" : "main",
);
const room = computed(() => runtime.base.room(roomSlug.value));
const selectedSlot = computed<WorkspaceSlot | null>(() =>
  room.value?.workspaceSlots.find((slot) => slot.objectId === state.selectedObjectId) ?? null,
);
const doorLabel = computed(() =>
  roomSlug.value === "main" ? "Enter the Workshop" : "Return to the Main Room",
);

function load() {
  void runtime.base.load().catch(() => undefined);
}

function select(objectId: string) {
  runtime.base.select(state.selectedObjectId === objectId ? null : objectId);
}

function closeBase() {
  void router.push("/");
}

function travelThroughDoor() {
  runtime.base.select(null);
  void router.push(roomSlug.value === "main" ? "/base/rooms/workshop" : "/base");
}

function openCompanion() {
  companionWindowHost.value?.open();
}

function greetPet() {
  petGreeting.value = true;
  if (petTimer) clearTimeout(petTimer);
  petTimer = setTimeout(() => {
    petGreeting.value = false;
    petTimer = null;
  }, 1600);
}

function starStyle(index: number) {
  return {
    left: `${(index * 47) % 97}%`,
    top: `${(index * 29) % 91}%`,
    animationDelay: `${(index % 6) * -0.7}s`,
  };
}

function cockpitStarStyle(index: number) {
  return {
    left: `${(index * 41) % 96}%`,
    top: `${(index * 23) % 88}%`,
    opacity: 0.38 + (index % 4) * 0.14,
  };
}

watch(requestedRoom, (value) => {
  if (value !== "main" && value !== "workshop") void router.replace("/base");
});

onMounted(() => {
  if (requestedRoom.value !== "main" && requestedRoom.value !== "workshop") {
    void router.replace("/base");
  }
  load();
});

onBeforeUnmount(() => {
  if (petTimer) clearTimeout(petTimer);
});
</script>

<style scoped>
.base-stage {
  z-index: 10;
  display: grid;
  overflow: hidden;
  place-items: center;
  background:
    radial-gradient(circle at 50% 52%, rgba(34, 64, 91, 0.18), transparent 42%),
    rgba(2, 4, 11, 0.34);
  pointer-events: auto;
}

.base-stage__cosmos {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 72% 24%, rgba(96, 74, 154, 0.16), transparent 34%),
    radial-gradient(ellipse at 18% 72%, rgba(28, 99, 119, 0.12), transparent 30%);
  pointer-events: none;
}

.base-stage__cosmos i {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #dceeff;
  box-shadow: 0 0 8px rgba(184, 222, 255, 0.8);
  animation: star-breathe 4s ease-in-out infinite alternate;
}

.base-environment {
  position: relative;
  width: 80vw;
  height: 80vh;
  min-height: 575px;
  overflow: hidden;
  border: 0;
  border-radius: 20px;
  background: #17242c;
  box-shadow: 0 44px 110px rgba(0, 0, 0, 0.66), 0 0 0 1px rgba(192, 224, 235, 0.08);
  animation: base-arrival 520ms cubic-bezier(0.22, 0.78, 0.18, 1) both;
}

.base-stage--workshop .base-environment { background: #25363d; }

.base-environment__close {
  position: absolute;
  z-index: 30;
  top: 18px;
  right: 20px;
  display: grid;
  width: 38px;
  height: 38px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(223, 235, 239, 0.2);
  border-radius: 50%;
  background: rgba(12, 22, 28, 0.7);
  color: rgba(229, 238, 241, 0.82);
  font-size: 1.3rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.base-environment__close:hover,
.base-environment__close:focus-visible {
  border-color: rgba(255, 255, 255, 0.52);
  background: rgba(112, 65, 62, 0.76);
  outline: 0;
}

.room-shell,
.room-shell > div { position: absolute; }
.room-shell { inset: 0; overflow: hidden; }

.room-shell__ceiling {
  top: 0;
  right: 0;
  left: 0;
  height: 26%;
  clip-path: polygon(0 0, 100% 0, 79% 100%, 21% 100%);
  background:
    linear-gradient(90deg, transparent 22%, rgba(142, 193, 206, 0.25) 22.3%, transparent 22.7%, transparent 77%, rgba(142, 193, 206, 0.25) 77.3%, transparent 77.7%),
    linear-gradient(#25343c, #17262e);
}

.room-shell__floor {
  right: 0;
  bottom: 0;
  left: 0;
  height: 47%;
  clip-path: polygon(21% 0, 79% 0, 100% 100%, 0 100%);
  background:
    repeating-linear-gradient(90deg, transparent 0 14.8%, rgba(158, 197, 203, 0.09) 15% 15.2%),
    linear-gradient(180deg, #25343a, #111b22);
}

.room-shell__floor::after {
  position: absolute;
  inset: 14% 29% 18%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(108, 182, 190, 0.19), transparent 67%);
  content: "";
}

.room-shell__wall {
  top: 0;
  bottom: 0;
  width: 26%;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.05), transparent 18%),
    linear-gradient(140deg, #344750, #18262d 64%);
}

.room-shell__wall--left { left: 0; clip-path: polygon(0 0, 82% 26%, 82% 53%, 100% 100%, 0 100%); }
.room-shell__wall--right { right: 0; clip-path: polygon(18% 26%, 100% 0, 100% 100%, 0 100%, 18% 53%); }

.room-shell__beam {
  z-index: 2;
  top: 0;
  width: 3.2%;
  height: 64%;
  background: linear-gradient(90deg, #172128, #61727a 42%, #202d34);
  box-shadow: 0 0 0 1px rgba(221, 237, 240, 0.1);
}

.room-shell__beam--left { left: 20%; transform: skewY(18deg); }
.room-shell__beam--right { right: 20%; transform: skewY(-18deg); }

.base-stage--workshop .room-shell__ceiling {
  background:
    repeating-linear-gradient(90deg, transparent 0 18%, rgba(206, 236, 239, 0.23) 18.4% 18.9%),
    linear-gradient(#42575d, #263a40);
}
.base-stage--workshop .room-shell__floor { background: linear-gradient(180deg, #45595b, #263638); }
.base-stage--workshop .room-shell__wall { background: linear-gradient(140deg, #52666a, #2c4044 64%); }

.cockpit {
  position: absolute;
  z-index: 3;
  top: 8%;
  right: 21%;
  left: 21%;
  height: 52%;
}

.cockpit__window {
  position: absolute;
  inset: 0 8% 18%;
  overflow: hidden;
  border: 6px solid #384950;
  border-radius: 42% 42% 12px 12px / 32% 32% 12px 12px;
  background: radial-gradient(ellipse at 50% 120%, #14204a 0, #070a18 52%, #01030a 100%);
  box-shadow: inset 0 0 35px #030712, 0 0 0 2px rgba(148, 187, 195, 0.22);
}

.cockpit__window i {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 5px #bfdbfe;
}

.cockpit__nebula {
  position: absolute;
  top: 28%;
  left: 18%;
  width: 64%;
  height: 36%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(101, 79, 164, 0.27), transparent 70%);
  filter: blur(9px);
  transform: rotate(-7deg);
}

.cockpit__arch {
  position: absolute;
  inset: -4% 1% 7%;
  border: 10px solid rgba(70, 89, 96, 0.72);
  border-bottom-color: transparent;
  border-radius: 48% 48% 18% 18%;
  pointer-events: none;
}

.cockpit__console {
  position: absolute;
  right: 19%;
  bottom: 11%;
  left: 19%;
  height: 18%;
  clip-path: polygon(8% 0, 92% 0, 100% 100%, 0 100%);
  background: linear-gradient(#40545c, #1d2a31);
  box-shadow: inset 0 5px rgba(123, 205, 210, 0.18);
}

.cockpit__seat {
  position: absolute;
  z-index: 2;
  bottom: -9%;
  width: 14%;
  height: 32%;
  border-radius: 26px 26px 7px 7px;
  background: linear-gradient(90deg, #263940, #6a7778 48%, #263940);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.45);
}
.cockpit__seat--left { left: 21%; transform: rotate(4deg); }
.cockpit__seat--right { right: 21%; transform: rotate(-4deg); }

.workspace-furniture--rear-left { top: 27%; left: 2%; }
.workspace-furniture--rear-right { top: 27%; right: 2%; }
.workspace-furniture--left-rear { top: 20%; left: 4%; }
.workspace-furniture--left-front { bottom: 12%; left: 7%; }
.workspace-furniture--right-rear { top: 20%; right: 4%; }
.workspace-furniture--right-front { right: 7%; bottom: 12%; }

.base-companion {
  position: absolute;
  z-index: 12;
  bottom: 12%;
  left: 50%;
  width: 120px;
  height: 182px;
  padding: 0 12px 21px;
  transform: translateX(-50%);
  border: 0;
  background: transparent;
  color: rgba(230, 238, 241, 0.72);
  cursor: pointer;
}

.base-companion > span:last-child {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 0.64rem;
  opacity: 0;
  transition: opacity 160ms ease;
}

.base-companion:hover > span:last-child,
.base-companion:focus-visible > span:last-child { opacity: 1; }
.base-companion:focus-visible { border-radius: 12px; outline: 2px solid rgba(125, 211, 252, 0.68); }

.base-pet {
  position: absolute;
  z-index: 13;
  right: 30%;
  bottom: 11%;
  width: 92px;
  height: 76px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #d8e8e4;
  cursor: pointer;
}

.base-pet__body,
.base-pet__head,
.base-pet__tail { position: absolute; display: block; }
.base-pet__body {
  right: 12%;
  bottom: 17px;
  width: 54px;
  height: 34px;
  border-radius: 50% 50% 42% 45%;
  background: linear-gradient(135deg, #aac8c0, #55776f);
}
.base-pet__body i { position: absolute; bottom: -8px; width: 8px; height: 17px; border-radius: 5px; background: #63877d; }
.base-pet__body i:first-child { left: 11px; }
.base-pet__body i:last-child { right: 10px; }
.base-pet__head {
  right: 1%;
  bottom: 31px;
  width: 31px;
  height: 29px;
  border-radius: 44%;
  background: #8fb3aa;
}
.base-pet__head i { position: absolute; top: -7px; width: 12px; height: 15px; background: #789e94; clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.base-pet__head i:first-child { left: 0; transform: rotate(-15deg); }
.base-pet__head i:nth-child(2) { right: 0; transform: rotate(15deg); }
.base-pet__head b { position: absolute; top: 11px; width: 4px; height: 4px; border-radius: 50%; background: #122127; }
.base-pet__head b:nth-child(3) { left: 7px; }
.base-pet__head b:last-child { right: 7px; }
.base-pet__tail {
  bottom: 25px;
  left: 7px;
  width: 35px;
  height: 14px;
  border-top: 7px solid #6f9389;
  border-radius: 60% 0 0;
  transform-origin: 100% 50%;
  animation: pet-tail 3.8s ease-in-out infinite;
}
.base-pet small { position: absolute; right: 0; bottom: -4px; left: 0; font-size: 0.56rem; opacity: 0; }
.base-pet:hover small,
.base-pet:focus-visible small,
.base-pet--greeting small { opacity: 0.82; }
.base-pet:focus-visible { border-radius: 12px; outline: 2px solid rgba(138, 230, 198, 0.65); }
.base-pet--greeting { animation: pet-hop 440ms ease-in-out 2 alternate; }

.room-door {
  position: absolute;
  z-index: 11;
  right: 2.5%;
  bottom: 11%;
  display: grid;
  width: 116px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #dce8e9;
  text-align: center;
  cursor: pointer;
  gap: 2px;
}

.base-stage--workshop .room-door { right: auto; left: 50%; bottom: 8%; transform: translateX(-50%); }

.room-door__frame {
  position: relative;
  display: block;
  width: 84px;
  height: 126px;
  margin: 0 auto 7px;
  border: 8px solid #52666b;
  border-bottom: 0;
  border-radius: 42px 42px 0 0;
  background: linear-gradient(160deg, #16252d, #081118);
  box-shadow: inset 0 0 20px rgba(107, 196, 200, 0.12), 0 12px 18px rgba(0, 0, 0, 0.3);
}
.room-door__frame i { position: absolute; top: 18px; right: 8px; width: 4px; height: 28px; border-radius: 3px; background: #75c7c1; box-shadow: 0 0 9px #75c7c1; }
.room-door strong { font-size: 0.7rem; font-weight: 620; }
.room-door small { color: rgba(203, 222, 225, 0.54); font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.08em; }
.room-door:hover .room-door__frame,
.room-door:focus-visible .room-door__frame { border-color: #7b979b; filter: brightness(1.12); }
.room-door:focus-visible { outline: 0; }

.workshop-sign {
  position: absolute;
  z-index: 4;
  top: 12%;
  left: 50%;
  display: grid;
  width: 230px;
  padding: 17px;
  transform: translateX(-50%);
  border: 1px solid rgba(193, 231, 234, 0.19);
  border-radius: 8px;
  background: rgba(24, 44, 48, 0.54);
  text-align: center;
  box-shadow: inset 0 0 22px rgba(95, 183, 188, 0.09);
}
.workshop-sign span { font-size: 0.76rem; font-weight: 650; letter-spacing: 0.18em; text-transform: uppercase; }
.workshop-sign small { margin-top: 4px; color: rgba(200, 222, 224, 0.5); font-size: 0.56rem; }

.selection-note {
  position: absolute;
  z-index: 18;
  bottom: 2.5%;
  left: 50%;
  display: grid;
  min-width: 220px;
  margin: 0;
  padding: 8px 14px;
  transform: translateX(-50%);
  border: 1px solid rgba(196, 226, 230, 0.16);
  border-radius: 999px;
  background: rgba(10, 19, 24, 0.74);
  text-align: center;
  backdrop-filter: blur(10px);
}
.selection-note strong { font-size: 0.65rem; font-weight: 620; }
.selection-note span { color: rgba(198, 216, 220, 0.53); font-size: 0.55rem; }

.base-status {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  color: #a9bdc4;
  font-size: 0.75rem;
}
.base-status__signal { width: 36px; height: 36px; border: 1px solid rgba(129, 209, 210, 0.25); border-top-color: #81d1d2; border-radius: 50%; animation: spin 1.2s linear infinite; }
.base-status button { padding: 7px 12px; border: 1px solid rgba(220, 236, 239, 0.2); border-radius: 8px; background: transparent; cursor: pointer; }

@keyframes base-arrival { from { opacity: 0; transform: scale(0.94); filter: blur(8px); } }
@keyframes star-breathe { to { opacity: 0.38; transform: scale(0.72); } }
@keyframes pet-tail { 50% { transform: rotate(-18deg); } }
@keyframes pet-hop { to { transform: translateY(-6px); } }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1220px) {
  .base-environment { width: 88vw; }
  .base-pet { right: 27%; }
}

@media (prefers-reduced-motion: reduce) {
  .base-environment,
  .base-stage__cosmos i,
  .base-pet__tail,
  .base-pet--greeting,
  .base-status__signal { animation: none; }
}
</style>
