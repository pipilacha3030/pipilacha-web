/* ============================================================
   CINTA reactiva al scroll: deriva constante a la izquierda y, al
   hacer scroll, acelera y se inclina (skewX) en proporción a la
   velocidad de Lenis — el gesto moderno de las cintas de GSAP.
   Se apaga la animación CSS y toma el control gsap.ticker; se limpia
   en destroyPage (listener de Lenis + ticker). Bajo reduced-motion
   no se toca nada: queda estática.
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { lenis } from '../scroll/lenis.js';
import { reduceMotion } from '../utils/motion.js';
import { onPageDestroy } from '../utils/lifecycle.js';

export function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track || reduceMotion) return;

  track.style.animation = 'none'; // el CSS cede el control a GSAP
  const wrap = gsap.utils.wrap(-50, 0); // dos grupos: -50% = un grupo completo
  const xSet = gsap.quickSetter(track, 'xPercent');
  const skewSet = gsap.quickSetter(track, 'skewX', 'deg');

  const BASE = 0.05;     // deriva base (% por frame a 60 fps)
  let x = 0, boost = 0, skew = 0;

  const tick = (time, dtMs) => {
    const f = dtMs / 16.667;
    x = wrap(x - (BASE + boost) * f);
    xSet(x);
    skewSet(skew);
    boost *= 0.9;  // la aceleración y la inclinación decaen al soltar el scroll
    skew *= 0.9;
  };
  gsap.ticker.add(tick);

  const onScroll = (e) => {
    const v = e.velocity || 0;
    boost = Math.min(1.1, Math.abs(v) * 0.006);
    skew = gsap.utils.clamp(-7, 7, v * 0.05);
  };
  if (lenis) lenis.on('scroll', onScroll);

  onPageDestroy(() => {
    gsap.ticker.remove(tick);
    if (lenis) lenis.off('scroll', onScroll);
    gsap.set(track, { clearProps: 'transform' });
  });
}
