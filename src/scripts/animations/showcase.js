/* ============================================================
   DESPERTAR DE LAS FLORES (Inicio): 4 imágenes superpuestas que
   se revelan en bucle (timeline + clip-path), en marcha mientras
   la tarjeta está en pantalla.
   ============================================================ */
import { gsap, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initShowcase() {
  if (reduceMotion) return;
  const showcase = document.querySelector('.showcase');
  if (!showcase) return;
  const sLayers = gsap.utils.toArray(showcase.querySelectorAll('.showcase__layer'));
  if (!sLayers.length) return;
  // pre-decodificar las 4 capas (llegan eager desde el HTML): el bucle de clip-path
  // nunca revela una foto a medio decodificar → sin flashes en blanco.
  sLayers.forEach((l) => { const img = l.querySelector('img'); if (img && img.decode) img.decode().catch(() => {}); });

  inPageContext(() => {
    // base: todas reveladas; la primera capa arriba (df-esparrago, la que se ve en reposo)
    gsap.set(sLayers, { clipPath: 'inset(0 0% 0 0)', zIndex: (i) => sLayers.length - i });
    const showcaseTl = gsap.timeline({
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
    ScrollTrigger.create({
      trigger: showcase, start: 'top 85%', end: 'bottom top',
      onToggle: ({ isActive }) => isActive ? showcaseTl.play() : showcaseTl.pause()
    });

    /* crecimiento a pantalla completa: el escenario se fija (pin) y la tarjeta se
       expande de su tamaño de reposo al de la ventana, ligado al scroll.
       Anchos/altos en función → se recalculan en cada refresh/resize.
       Solo desktop: en móvil el pin + growth alarga el scroll sin aportar
       (la tarjeta ya ocupa casi todo el ancho) — la tarjeta queda estática. */
    const stage = document.querySelector('.gallery__stage');
    if (stage && !isMobile) {
      gsap.to(showcase, {
        width: () => window.innerWidth,
        height: () => window.innerHeight,
        borderRadius: 0,
        boxShadow: '0 0px 0px 0px rgba(13,13,13,0)',
        ease: 'none',
        scrollTrigger: {
          trigger: stage, start: 'top top', end: '+=90%',
          pin: stage, scrub: 0.4, anticipatePin: 1
        }
      });
    }
  });
}
