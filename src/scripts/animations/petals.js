/* ============================================================
   PÉTALOS AMBIENTALES (solo Inicio): un puñado de pétalos cayendo
   lentamente sobre el hero, con un halo suave que los atrae hacia
   el cursor. Puro <canvas> — no hay tweens de GSAP que animar, así
   que el loop se registra directo en gsap.ticker (driver único de
   Lenis, ver scroll/scrollTrigger.js) en vez de inPageContext().
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { onPageDestroy, pageSignal } from '../utils/lifecycle.js';

const SOURCES = [
  '/assets/img/petal-borraja-ambient.png',
  '/assets/img/petal-fig-ambient.png',
  '/assets/img/petal-oxalis-ambient.png',
];
const COUNT = 14;
const PULL_RADIUS_SQ = 16000; // ~127px — halo de atracción suave al cursor

export function initPetals() {
  if (reduceMotion) return;
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero__petals';
  canvas.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const images = SOURCES.map((src) => {
    const im = new Image();
    im.src = src;
    return im;
  });
  let ready = false;
  // decode() falla en navegadores sin soporte: en ese caso esperamos el
  // load nativo (si resolviéramos al instante, naturalWidth/Height podrían
  // seguir en 0 y el primer frame dibujaría los pétalos con proporción rota).
  Promise.all(images.map((im) => (im.decode
    ? im.decode().catch(() => {})
    : new Promise((resolve) => { im.addEventListener('load', resolve, { once: true }); im.addEventListener('error', resolve, { once: true }); }))))
    .then(() => { ready = true; });

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  let mx = -9999, my = -9999;

  function size() {
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makePetal() {
    const im = images[(Math.random() * images.length) | 0];
    const w = 26 + Math.random() * 30;
    return {
      im, w,
      x: Math.random() * W, y: Math.random() * H,
      vx: -0.12 + Math.random() * 0.24, vy: 0.08 + Math.random() * 0.18,
      a: Math.random() * Math.PI * 2, va: -0.006 + Math.random() * 0.012,
      o: 0.16 + Math.random() * 0.22,
    };
  }

  size();
  const petals = Array.from({ length: COUNT }, makePetal);

  const signal = pageSignal();
  function onMove(e) {
    const r = hero.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  }
  function onLeave() { mx = -9999; my = -9999; }
  hero.addEventListener('pointermove', onMove, { signal });
  hero.addEventListener('pointerleave', onLeave, { signal });
  window.addEventListener('resize', size, { signal });

  function frame() {
    if (!ready || !W) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      // vector del pétalo HACIA el cursor: cuanto más cerca, más fuerte el halo
      // de atracción (a 0 en el borde del radio, máximo pegado al cursor).
      const dx = mx - p.x, dy = my - p.y, d2 = dx * dx + dy * dy;
      if (d2 < PULL_RADIUS_SQ) {
        const f = (1 - d2 / PULL_RADIUS_SQ) * 0.5;
        const d = Math.sqrt(d2) + 1;
        p.x += (dx / d) * f; p.y += (dy / d) * f;
      }
      p.x += p.vx; p.y += p.vy; p.a += p.va;
      if (p.y - p.w > H) { p.y = -p.w; p.x = Math.random() * W; }
      if (p.x < -p.w) p.x = W + p.w;
      if (p.x > W + p.w) p.x = -p.w;
      const ratio = (p.im.naturalHeight / p.im.naturalWidth) || 1;
      ctx.save();
      ctx.globalAlpha = p.o;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.drawImage(p.im, -p.w / 2, (-p.w * ratio) / 2, p.w, p.w * ratio);
      ctx.restore();
    }
  }

  gsap.ticker.add(frame);
  onPageDestroy(() => { gsap.ticker.remove(frame); canvas.remove(); });
}
