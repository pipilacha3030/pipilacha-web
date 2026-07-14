/* ============================================================
   PRIMERA FILA — capítulo inmersivo de la home. Una sola timeline
   GSAP ligada al scroll: la sección se fija (pin) y el scroll solo
   funde las tres escenas (OBSERVAR → ESCUCHAR → DESCUBRIR → reserva).
   Nada de sliders ni scroll horizontal: opacity + escala muy sutil +
   blur mínimo en el texto. Todo dentro de inPageContext (se revierte
   en cada transición de página). En móvil o reduced-motion no se pinea:
   las escenas quedan apiladas por CSS (versión editorial estática).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initPrimeraFila() {
  const pin = document.querySelector('.pf__pin');
  if (!pin) return;
  const isMobile = window.matchMedia('(max-width:768px)').matches;
  if (reduceMotion || isMobile) return;

  inPageContext(() => {
    const scenes = gsap.utils.toArray('.pf__scene');
    if (scenes.length < 3) return;
    const imgs = scenes.map((s) => s.querySelector('.pf__img img'));
    const panels = scenes.map((s) => s.querySelector('.pf__panel'));

    // estado base: solo la escena 1 visible
    gsap.set(scenes, { opacity: 0 });
    gsap.set(scenes[0], { opacity: 1 });
    gsap.set(imgs, { scale: 1 });

    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: '+=250%',      // ~350vh de recorrido total (100vh pin + 250vh scrub)
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    // ESCENA 01 · Observar — ken burns lento durante la lectura
    tl.to(imgs[0], { scale: 1.045, duration: 10, ease: 'none' }, 0);

    // 01 → 02 · Escuchar
    tl.to(scenes[0], { opacity: 0, duration: 3 }, 8)
      .fromTo(imgs[1], { scale: 1.07 }, { scale: 1, duration: 11, ease: 'none' }, 8)
      .to(scenes[1], { opacity: 1, duration: 3 }, 8.4)
      .fromTo(panels[1], { y: 26, filter: 'blur(5px)' },
        { y: 0, filter: 'blur(0px)', duration: 3 }, 8.6);

    // 02 → 03 · Descubrir / reserva (transformación, no corte)
    tl.to(scenes[1], { opacity: 0, duration: 3 }, 18)
      .fromTo(imgs[2], { scale: 1.08 }, { scale: 1.02, duration: 11, ease: 'none' }, 18)
      .to(scenes[2], { opacity: 1, duration: 3 }, 18.4)
      .fromTo(panels[2], { y: 26, filter: 'blur(5px)' },
        { y: 0, filter: 'blur(0px)', duration: 3 }, 18.6);

    // cola: la reserva reposa antes de soltar el pin
    tl.to({}, { duration: 6 }, 21);
  });
}
