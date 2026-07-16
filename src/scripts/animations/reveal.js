/* ============================================================
   Revelados al entrar en viewport. Cubre todas las variantes:
   - .reveal genérico y cascada [data-reveal-stagger]
   - .reveal-head (cortina clip-path para titulares, texto)
   - filas de prensa (.press-row) y flores de vinos (.wine-cat__flor):
     revelados específicos de página, misma responsabilidad.
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initReveals() {
  if (reduceMotion) {
    // el CSS ya fuerza visibilidad con !important; esto es cinturón y tirantes
    inPageContext(() => { gsap.set('.reveal', { opacity: 1, y: 0 }); });
    return;
  }

  inPageContext(() => {
    /* reveal genérico */
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.closest('.hero')) return; // el hero ya se anima aparte (animations/hero.js)
      if (el.matches('.barra__media')) return; // tiene reveal editorial propio (animations/media.js)
      if (el.closest('[data-reveal-stagger]')) return; // lo anima su grupo en cascada
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    /* reveal en cascada: grupos (tarjetas, pasos) entran escalonados como una unidad */
    gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
      const items = group.querySelectorAll('.reveal');
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: group, start: 'top 84%' }
      });
    });

    /* reveal de TITULAR (.reveal-head): cortina clip-path de abajo arriba + leve
       subida, sin rebote. Funciona con titulares de varias líneas (a diferencia de
       una máscara por línea) y enriquece un texto que ya es visible sin JS. */
    gsap.utils.toArray('.reveal-head').forEach((el) => {
      const from = { clipPath: 'inset(0 0 100% 0)', y: 22 };
      // clip-path:none anula la regla CSS oculta y no recorta la sombra del titular
      const to = { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, ease: 'expo.out',
        onComplete: () => gsap.set(el, { clipPath: 'none', clearProps: 'transform' }) };
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        // sobre el pliegue: revelar al cargar (no depende del scroll)
        gsap.fromTo(el, from, { ...to, delay: 0.15 });
      } else {
        // bajo el pliegue: revelar al entrar en pantalla
        gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start: 'top 88%' } });
      }
    });

    /* PRENSA: filas editoriales con reveal de clip-path */
    gsap.utils.toArray('.press-row').forEach((row) => {
      gsap.fromTo(row,
        { opacity: 0, y: 42, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%' } });
    });

    /* VINOS: la flor de cada familia "florece" al llegar a su sección (sin rebote).
       OJO sin `rotation`: el giro perpetuo vive en CSS (propiedad rotate) y
       cualquier rotación de GSAP aquí interferiría con él. */
    gsap.utils.toArray('.wine-cat__flor').forEach((flor) => {
      gsap.fromTo(flor,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: flor.closest('.wine-cat'), start: 'top 78%' } });
    });
  });
}
