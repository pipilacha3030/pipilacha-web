/* ============================================================
   Botones magnéticos: el botón se inclina hacia el cursor y
   vuelve suave (sin muelle). Solo con puntero fino y hover real.
   Los listeners se atan a la señal de página: el CTA de la nav
   persiste entre swaps y sin señal acumularía listeners.
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { pageSignal, inPageContext } from '../utils/lifecycle.js';

export function initMagnetic() {
  if (reduceMotion) return;
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const signal = pageSignal();
  inPageContext(() => {
    document.querySelectorAll('.btn, .nav__cta').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.38,
          duration: 0.4, ease: 'power3.out'
        });
      }, { signal });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
      }, { signal });
    });
  });
}
