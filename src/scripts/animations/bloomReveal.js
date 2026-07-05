/* ============================================================
   TRANSICIÓN HERO → QUIÉNES (solo Inicio): la banda visual de
   «Quiénes somos» se revela a través de una máscara de FLOR que
   florece ligada al scroll (SVG mask reveal, en clave de marca).
   El tamaño de la máscara vive en la custom prop --bloom (CSS);
   aquí solo la animamos de capullo (~12%) a flor abierta (360%).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initBloomReveal() {
  if (reduceMotion) return; // sin motion, el CSS deja --bloom en 360% (foto completa)
  const visual = document.querySelector('.quienes__visual');
  if (!visual) return;

  inPageContext(() => {
    gsap.fromTo(visual,
      { '--bloom': '12%' },
      {
        '--bloom': '360%', ease: 'none',
        scrollTrigger: { trigger: visual, start: 'top bottom', end: 'top 16%', scrub: 0.4 }
      });
  });
}
