/* ============================================================
   Botones magnéticos: el botón se inclina hacia el cursor. Los
   .btn vuelven suave (sin muelle); el CTA del dock vuelve con un
   rebote elástico sutil. Solo con puntero fino y hover real.
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
      const spring = btn.classList.contains('nav__cta');
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.38,
          duration: 0.4, ease: 'power3.out'
        });
      }, { signal });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0, y: 0,
          duration: spring ? 0.75 : 0.6,
          ease: spring ? 'elastic.out(1, 0.45)' : 'power3.out'
        });
      }, { signal });
    });
  });
}
