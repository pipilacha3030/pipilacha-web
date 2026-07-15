/* ============================================================
   TALLO (solo Inicio) — la columna vertebral de la home. Una
   línea finísima fija en el margen izquierdo con un marcador que
   desciende según el progreso de scroll: cose todas las secciones
   en una sola pieza («el jardín que no para de moverse»).
   Solo escritorio; con reduced-motion no se muestra.
   Ciclo de vida: el listener de lenis se retira en onPageDestroy.
   ============================================================ */
import { lenis } from '../scroll/lenis.js';
import { reduceMotion } from '../utils/motion.js';
import { pageSignal, onPageDestroy } from '../utils/lifecycle.js';

export function initSpine() {
  const spine = document.querySelector('.spine');
  if (!spine) return;
  const marker = spine.querySelector('.spine__marker');
  if (reduceMotion || window.innerWidth < 1024) return;

  const update = (y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    marker.style.top = (p * 100).toFixed(2) + '%';
  };
  const onScroll = (e) => update(e && typeof e.scroll === 'number' ? e.scroll : window.scrollY);

  if (lenis) {
    lenis.on('scroll', onScroll);
    onPageDestroy(() => { try { lenis.off('scroll', onScroll); } catch (_) {} });
  } else {
    window.addEventListener('scroll', () => onScroll(), { passive: true, signal: pageSignal() });
  }
  update(window.scrollY || 0);
  requestAnimationFrame(() => spine.classList.add('is-on')); // fade-in tras montar
}
