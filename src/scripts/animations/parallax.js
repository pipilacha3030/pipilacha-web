/* ============================================================
   Parallax CENTRADO ([data-parallax="0.NN"]): a mitad de recorrido
   (incluido el scroll 0 del hero) el desplazamiento es 0, así nunca
   se ve el fondo por arriba ni por abajo.
   OJO: no poner data-parallax en los pétalos flotantes — el transform
   de GSAP pelea con las animaciones CSS float/float2.
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initParallax() {
  if (reduceMotion) return;
  inPageContext(() => {
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.dataset.parallax);
      gsap.fromTo(el,
        { yPercent: () => -amt * 50 },
        {
          yPercent: () => amt * 50, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });
  });
}
