/* ============================================================
   RESEÑAS: raíl horizontal en bucle infinito (estilo "muro de amor").
   Dos grupos idénticos → deriva constante a la izquierda que envuelve
   en -50% (un grupo completo), sin costura. Al pasar el puntero el raíl
   frena suave para poder leer, y retoma al salir. Se limpia en
   destroyPage (ticker + listeners). Bajo reduced-motion o sin JS el CSS
   lo deja como carrusel con scroll manual (overflow-x:auto).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { onPageDestroy } from '../utils/lifecycle.js';

export function initReviews() {
  const rail = document.querySelector('[data-reviews]');
  const track = rail?.querySelector('.reviews__track');
  if (!rail || !track || reduceMotion) return;

  const xSet = gsap.quickSetter(track, 'xPercent');
  const wrap = gsap.utils.wrap(-50, 0); // dos grupos: -50% = un grupo entero
  // deriva base (% por frame a 60 fps) — calmada a propósito: da tiempo a leer
  // una tarjeta entera sin perseguirla (y aún más lenta en móvil)
  const isNarrow = window.matchMedia('(max-width:560px)').matches;
  const BASE = isNarrow ? 0.006 : 0.012;
  let x = 0, speed = 1, target = 1;

  const tick = (time, dtMs) => {
    const f = dtMs / 16.667;
    speed += (target - speed) * 0.08; // frena/acelera de forma suave
    x = wrap(x - BASE * speed * f);
    xSet(x);
  };
  gsap.ticker.add(tick);

  // frena al hover solo con puntero fino (en táctil un tap dejaría el raíl parado)
  const canHover = window.matchMedia('(hover:hover)').matches;
  const slow = () => { target = 0; };
  const go   = () => { target = 1; };
  if (canHover) {
    rail.addEventListener('pointerenter', slow);
    rail.addEventListener('pointerleave', go);
  }

  onPageDestroy(() => {
    gsap.ticker.remove(tick);
    if (canHover) {
      rail.removeEventListener('pointerenter', slow);
      rail.removeEventListener('pointerleave', go);
    }
    gsap.set(track, { clearProps: 'transform' });
  });
}
