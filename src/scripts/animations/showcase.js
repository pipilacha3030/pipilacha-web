/* ============================================================
   DESPERTAR DE LAS FLORES (Solsticio floral): 4 imágenes superpuestas
   que se revelan en bucle (timeline + clip-path), en marcha mientras
   la tarjeta está en pantalla.
   Escritorio (≥901px): la sección vive DENTRO del escenario de slides
   a pantalla completa (heroQuienesScroll.js) — ya no se mueve con el
   scroll del documento, así que su visibilidad no puede leerse con un
   ScrollTrigger normal (su posición en el flujo no cambia, solo su
   yPercent). El play/pause lo maneja el propio slide-jack a través del
   handle que devuelve esta función.
   Móvil (≤900px, flujo normal): sigue viva la comprobación por
   ScrollTrigger de siempre.
   ============================================================ */
import { gsap, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';
import { heroJackOwnsGallery } from './heroQuienesScroll.js';

export function initShowcase() {
  if (reduceMotion) return null;
  const showcase = document.querySelector('.showcase');
  if (!showcase) return null;
  const sLayers = gsap.utils.toArray(showcase.querySelectorAll('.showcase__layer'));
  if (!sLayers.length) return null;
  // pre-decodificar las 4 capas (llegan eager desde el HTML): el bucle de clip-path
  // nunca revela una foto a medio decodificar → sin flashes en blanco.
  sLayers.forEach((l) => { const img = l.querySelector('img'); if (img && img.decode) img.decode().catch(() => {}); });

  let showcaseTl;
  inPageContext(() => {
    // base: todas reveladas; la primera capa arriba (df-esparrago, la que se ve en reposo)
    gsap.set(sLayers, { clipPath: 'inset(0 0% 0 0)', zIndex: (i) => sLayers.length - i });
    showcaseTl = gsap.timeline({
      repeat: -1, repeatDelay: 0.6, defaults: { ease: 'power2.inOut' }, paused: true,
      onRepeat: () => {
        /* pre-oculta todas las capas excepto la última (queda de fondo) para que
           cuando la capa 0 suba de z-index no flashee 1 frame con clipPath visible */
        gsap.set(sLayers, { zIndex: 1, clipPath: 'inset(0 100% 0 0)' });
        gsap.set(sLayers[sLayers.length - 1], { clipPath: 'inset(0 0% 0 0)' });
      }
    });
    const isMobile = window.matchMedia('(max-width:768px)').matches;
    const scaleFrom = isMobile ? 1.06 : 1.12;
    sLayers.forEach((layer, i) => {
      const img = layer.querySelector('img');
      showcaseTl.set(layer, { zIndex: 10 + i }, i === 0 ? 0 : '+=0.8')
        .fromTo(layer, { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 3, immediateRender: false }, '<')
        .fromTo(img, { scale: scaleFrom },
          { scale: 1, duration: 3.4, ease: 'power1.out', immediateRender: false }, '<');
    });
    // si el escenario de slides se hace cargo de la sección (escritorio en la
    // home ES), es él quien llama a enter()/leave(): dentro del escenario la
    // sección no cambia de posición en el documento, solo de yPercent, así que
    // un ScrollTrigger de visibilidad nunca dispararía. En móvil, en la home EN
    // y bajo reduced-motion vive en flujo normal → ScrollTrigger de siempre.
    if (heroJackOwnsGallery()) return;
    ScrollTrigger.create({
      trigger: showcase, start: 'top 85%', end: 'bottom top',
      onToggle: ({ isActive }) => isActive ? showcaseTl.play() : showcaseTl.pause()
    });
  });

  return {
    enter: () => showcaseTl && showcaseTl.play(),
    leave: () => showcaseTl && showcaseTl.pause(),
  };
}
