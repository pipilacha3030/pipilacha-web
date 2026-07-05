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
      // acercamiento de cámara: la foto se asienta en un encuadre cerrado (mucho zoom)
      gsap.fromTo('.hero__media img',
        { scale: 1.32, transformOrigin: '50% 42%' },
        { scale: 1.18, transformOrigin: '50% 42%', duration: 1.8, ease: 'power2.out' });
      // vida ambiente: tras asentarse, el plano respira muy lento (cinematográfico)
      gsap.to('.hero__media img', {
        scale: 1.23, yPercent: -1.5, transformOrigin: '50% 42%',
        duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8
      });
      // el título sube tras su máscara
      // y:0 limpia el translateY(110%) que GSAP interpreta como px; el reveal lo mueve solo por yPercent
      gsap.fromTo('.hero__title .reveal-mask',
        { yPercent: 110, y: 0 },
        { yPercent: 0, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
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
