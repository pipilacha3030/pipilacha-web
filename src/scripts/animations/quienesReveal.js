/* ============================================================
   «Quiénes»: la ventana a la barra.
   Escritorio (>900px): el escenario es sticky (CSS); aquí se
   scrubbea la apertura del clip-path ventana→sangre completa,
   el asentamiento de la escala y la llegada del texto sobre el
   velo — todo ligado al progreso de .quienes__pin.
   Móvil (≤900px): sin pin — el panorámico recorre la barra en
   horizontal (translateX, solo transform) según avanza el scroll.
   Los estados FINALES son el CSS por defecto: sin JS o con
   reduced-motion la sección queda como postal estática legible
   (los estados iniciales solo los pone GSAP en runtime).
   ============================================================ */
import { gsap, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext, pageSignal } from '../utils/lifecycle.js';

export function initQuienesReveal() {
  if (reduceMotion) return;
  const pin = document.querySelector('.quienes__pin');
  const stage = document.querySelector('.quienes__stage');
  const media = stage && stage.querySelector('.quienes__media');
  const img = media && media.querySelector('img');
  const copy = stage && stage.querySelector('.quienes__copy');
  if (!pin || !media || !img || !copy) return;

  // la panorámica carga lazy: al llegar recalcula los triggers (el paneo
  // móvil depende de su ancho natural)
  if (!img.complete) {
    img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true, signal: pageSignal() });
  }

  inPageContext(() => {
    if (window.matchMedia('(min-width:901px)').matches) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: pin, start: 'top top', end: 'bottom bottom', scrub: 1 },
        defaults: { ease: 'none' },
      });
      tl.fromTo(media,
        { clipPath: 'inset(30% 24% 30% 24% round 26px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.6 }, 0)
        .fromTo(img, { scale: 1.22 }, { scale: 1, duration: 0.85 }, 0)
        .fromTo(copy,
          { autoAlpha: 0, y: 56 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.52);
    } else {
      // paneo lateral: de un chef al otro; función para que
      // invalidateOnRefresh remida tras cargar la imagen o rotar el móvil
      gsap.fromTo(img, { x: 0 }, {
        x: () => -Math.max(0, img.scrollWidth - media.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: media, start: 'top 85%', end: 'bottom 15%',
          scrub: 1, invalidateOnRefresh: true,
        },
      });
    }
  });
}
