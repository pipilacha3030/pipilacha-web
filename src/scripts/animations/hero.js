/* ============================================================
   HERO (solo Inicio): entrada cinematográfica (título tras máscara
   + zoom de cámara + vida ambiente) y salida ligada al scroll.
   ============================================================ */
import { gsap, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

let heroPlayed = false;
export const resetHero = () => { heroPlayed = false; };

export function initHero() {
  if (reduceMotion) return;

  /* entrada: solo si hay hero (evita warnings de GSAP en páginas internas) */
  if (!heroPlayed && document.querySelector('.hero__media img')) {
    heroPlayed = true;
    inPageContext(() => {
      // acercamiento de cámara: la foto se asienta UNA vez en un encuadre cerrado y
      // se queda quieta. Se retiró el "respiro" infinito: escalar en bucle una foto
      // muy detallada resampleaba el raster cada frame → titileo/aliasing en el borde.
      // force3D mantiene la entrada en su propia capa GPU (compone, no repinta).
      // reposa en 1.02 (casi a pantalla): el encuadre cerrado de antes (1.18)
      // recortaba la foto y se percibía borrosa
      gsap.fromTo('.hero__media img',
        { scale: 1.10, transformOrigin: '50% 42%' },
        { scale: 1.02, transformOrigin: '50% 42%', duration: 1.8, ease: 'power2.out', force3D: true });
      document.querySelectorAll('.hero [data-delay]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.dataset.delay) + 0.1 });
      });
    });
  }

  /* salida cinematográfica ligada al scroll: el contenido sube y se disuelve
     mientras la foto sigue su parallax; traspaso limpio a la sección siguiente. */
  const heroEl = document.querySelector('.hero');
  if (heroEl && heroEl.querySelector('.hero__content')) {
    inPageContext(() => {
      gsap.to(heroEl.querySelector('.hero__content'), {
        yPercent: -24, autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }
}
