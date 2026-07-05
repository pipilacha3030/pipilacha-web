/* ============================================================
   MENÚ: el "tallo" — una línea fina que se dibuja de arriba abajo
   junto a los 15 pases según se recorre la lista (la flor que
   crece). Decorativo, con fallback (visible sin JS).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initMenuStem() {
  if (reduceMotion) return;
  const stem = document.querySelector('.pases__stem');
  if (!stem) return;
  inPageContext(() => {
    gsap.fromTo(stem, { scaleY: 0 }, {
      scaleY: 1, ease: 'none', transformOrigin: 'top',
      scrollTrigger: { trigger: '.pases', start: 'top 78%', end: 'bottom 82%', scrub: true }
    });
  });
}
