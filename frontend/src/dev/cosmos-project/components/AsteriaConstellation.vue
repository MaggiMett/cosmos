<template>
  <section class="asteria-constellation" aria-label="Asteria project constellation" data-testid="asteria-constellation">
    <div class="asteria-constellation__nebula" aria-hidden="true" />

    <svg class="asteria-connections" viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden="true">
      <path class="asteria-connection asteria-connection--primary" d="M600 380 C520 330 465 286 385 290" />
      <path class="asteria-connection asteria-connection--primary" d="M600 380 C682 305 724 238 790 205" />
      <path class="asteria-connection asteria-connection--primary" d="M600 380 C690 405 735 452 810 468" />
      <path class="asteria-connection asteria-connection--primary" d="M600 380 C590 500 570 548 548 584" />
      <path class="asteria-connection" d="M600 380 C478 420 402 475 328 500" />
      <path class="asteria-connection" d="M600 380 C756 350 865 328 936 340" />
      <path class="asteria-connection" d="M385 290 C320 275 280 248 244 220" />
      <path class="asteria-connection" d="M385 290 C342 350 318 413 328 500" />
      <path class="asteria-connection asteria-connection--secondary" d="M790 205 C850 212 883 250 904 285" />
      <path class="asteria-connection asteria-connection--secondary" d="M790 205 C740 150 695 136 652 144" />
      <path class="asteria-connection asteria-connection--secondary" d="M810 468 C872 425 912 391 936 340" />
      <path class="asteria-connection asteria-connection--secondary" d="M810 468 C845 518 862 555 874 596" />
      <path class="asteria-connection asteria-connection--secondary" d="M548 584 C491 623 451 630 408 620" />
      <path class="asteria-connection asteria-connection--secondary" d="M548 584 C622 616 668 642 710 650" />
    </svg>

    <div class="asteria-node asteria-node--core" role="img" aria-label="Asteria, selected project core">
      <span class="asteria-node__focus-ring" aria-hidden="true" />
      <i aria-hidden="true" />
      <strong>Asteria</strong>
    </div>

    <div class="asteria-node asteria-node--design" role="img" aria-label="Design, normal node"><i aria-hidden="true" /></div>
    <div class="asteria-node asteria-node--research" role="img" aria-label="Research, focused node">
      <i aria-hidden="true" />
      <aside class="asteria-focus-card">
        <strong>Asteria Research</strong>
        <span>Knowledge Cluster</span>
        <p>Questions, sources and emerging connections.</p>
      </aside>
    </div>
    <div class="asteria-node asteria-node--assets" role="img" aria-label="Assets, normal node"><i aria-hidden="true" /></div>
    <div class="asteria-node asteria-node--build" role="img" aria-label="Build, secondary node"><i aria-hidden="true" /></div>
    <div class="asteria-node asteria-node--notes" role="img" aria-label="Notes, secondary node"><i aria-hidden="true" /></div>
    <div class="asteria-node asteria-node--archive" role="img" aria-label="Archive, secondary node"><i aria-hidden="true" /></div>

    <span class="asteria-star asteria-star--1" aria-hidden="true" />
    <span class="asteria-star asteria-star--2" aria-hidden="true" />
    <span class="asteria-star asteria-star--3" aria-hidden="true" />
    <span class="asteria-star asteria-star--4" aria-hidden="true" />
    <span class="asteria-star asteria-star--5" aria-hidden="true" />
    <span class="asteria-star asteria-star--6" aria-hidden="true" />
    <span class="asteria-star asteria-star--7" aria-hidden="true" />
    <span class="asteria-star asteria-star--8" aria-hidden="true" />
    <span class="asteria-star asteria-star--9" aria-hidden="true" />
    <span class="asteria-star asteria-star--10" aria-hidden="true" />
  </section>
</template>

<style scoped>
.asteria-constellation {
  position: absolute;
  z-index: 2;
  top: 88px;
  left: 50%;
  width: min(1200px, calc(100vw - 160px));
  height: calc(100vh - 170px);
  min-height: 650px;
  transform: translateX(-50%);
}

.asteria-constellation__nebula {
  position: absolute;
  inset: 4% 9% 2%;
  transform: rotate(-7deg);
  border-radius: 62% 38% 58% 42% / 43% 57% 43% 57%;
  background:
    radial-gradient(ellipse at 51% 48%, rgba(174, 208, 222, 0.15), transparent 13%),
    conic-gradient(from 22deg at 52% 48%, transparent 0 10%, rgba(62, 117, 142, 0.09) 15%, transparent 25% 38%, rgba(82, 124, 145, 0.08) 43%, transparent 53% 68%, rgba(57, 104, 128, 0.08) 76%, transparent 88%),
    radial-gradient(ellipse at 50% 50%, rgba(46, 92, 115, 0.13), transparent 62%);
  filter: blur(5px);
  opacity: 0.9;
}

.asteria-connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.asteria-connection {
  fill: none;
  stroke: rgba(143, 183, 201, 0.18);
  stroke-linecap: round;
  stroke-width: 1.05;
  vector-effect: non-scaling-stroke;
}

.asteria-connection--primary {
  stroke: rgba(220, 210, 190, 0.42);
  stroke-width: 1.45;
  filter: drop-shadow(0 0 3px rgba(203, 212, 211, 0.24));
}

.asteria-connection--secondary {
  stroke: rgba(116, 157, 178, 0.11);
  stroke-dasharray: 2 7;
}

.asteria-node,
.asteria-star {
  position: absolute;
  transform: translate(-50%, -50%);
}

.asteria-node {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
}

.asteria-node > i,
.asteria-star {
  border: 1px solid rgba(243, 242, 229, 0.78);
  border-radius: 50%;
  background: #f1efe3;
  box-shadow: 0 0 5px #e8e8df, 0 0 16px rgba(162, 197, 211, 0.62), 0 0 35px rgba(90, 145, 170, 0.28);
}

.asteria-node > i {
  display: block;
  width: 14px;
  height: 14px;
}

.asteria-node--core {
  top: 50%;
  left: 50%;
  width: 130px;
  height: 130px;
}

.asteria-node--core > i {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 36% 30%, #fff, #e6dfca 36%, #9bafba 70%, #334755);
  box-shadow: 0 0 9px #fff, 0 0 28px rgba(230, 222, 198, 0.9), 0 0 82px rgba(115, 173, 198, 0.46);
}

.asteria-node__focus-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(158, 195, 211, 0.3);
  border-radius: 50%;
  box-shadow: inset 0 0 22px rgba(98, 200, 234, 0.05);
}

.asteria-node__focus-ring::after {
  position: absolute;
  inset: 23px;
  border: 1px solid rgba(222, 219, 205, 0.22);
  border-radius: 50%;
  content: "";
}

.asteria-node--core > strong {
  position: absolute;
  top: calc(50% + 37px);
  left: 50%;
  transform: translateX(-50%);
  color: rgba(229, 237, 242, 0.74);
  font-size: 0.65rem;
  font-weight: 520;
  letter-spacing: 0.12em;
  text-shadow: 0 2px 8px #01030a;
}

.asteria-node--design { top: 38.2%; left: 32.1%; }
.asteria-node--research { top: 27%; left: 65.8%; }
.asteria-node--assets { top: 61.6%; left: 67.5%; }
.asteria-node--build { top: 76.8%; left: 45.7%; }
.asteria-node--notes { top: 65.8%; left: 27.3%; }
.asteria-node--archive { top: 44.8%; left: 78%; }

.asteria-node--research > i {
  width: 27px;
  height: 27px;
  box-shadow: 0 0 7px #fff, 0 0 23px rgba(229, 218, 190, 0.72), 0 0 52px rgba(111, 170, 196, 0.32);
}

.asteria-node--design > i,
.asteria-node--assets > i {
  width: 20px;
  height: 20px;
}

.asteria-node--build > i,
.asteria-node--notes > i,
.asteria-node--archive > i {
  width: 10px;
  height: 10px;
  opacity: 0.76;
}

.asteria-focus-card {
  position: absolute;
  top: 29px;
  left: 44px;
  display: grid;
  width: 165px;
  padding: 11px 12px;
  border: 1px solid rgba(119, 183, 210, 0.42);
  border-radius: var(--cosmos-radius-window);
  background: rgba(5, 12, 19, 0.86);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.38), 0 0 18px rgba(75, 169, 207, 0.08);
  backdrop-filter: blur(12px);
  gap: 4px;
}

.asteria-focus-card::before {
  position: absolute;
  top: 13px;
  left: -6px;
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  border-bottom: 1px solid rgba(119, 183, 210, 0.42);
  border-left: 1px solid rgba(119, 183, 210, 0.42);
  background: #07101a;
  content: "";
}

.asteria-focus-card strong {
  color: #e5dfd5;
  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  font-size: 0.77rem;
  font-weight: 400;
}

.asteria-focus-card span {
  color: var(--cosmos-color-accent);
  font-size: 0.55rem;
}

.asteria-focus-card p {
  margin: 3px 0 0;
  color: #98a8af;
  font-size: 0.58rem;
  line-height: 1.45;
}

.asteria-star {
  width: 6px;
  height: 6px;
  opacity: 0.62;
}

.asteria-star--1 { top: 29%; left: 20.3%; }
.asteria-star--2 { top: 23%; left: 54.3%; }
.asteria-star--3 { top: 37.5%; left: 75.3%; }
.asteria-star--4 { top: 53%; left: 87%; }
.asteria-star--5 { top: 81.5%; left: 59.2%; }
.asteria-star--6 { top: 82%; left: 34%; }
.asteria-star--7 { top: 57%; left: 18%; }
.asteria-star--8 { top: 15.8%; left: 72.8%; }
.asteria-star--9 { top: 67%; left: 73%; }
.asteria-star--10 { top: 42%; left: 42%; }
</style>
