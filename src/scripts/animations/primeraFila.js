/* ============================================================
   PRIMERA FILA — capítulo inmersivo de la home. Una sola timeline
   GSAP ligada al scroll: la sección se fija (pin) y el scroll solo
   funde las tres escenas (OBSERVAR → ESCUCHAR → DESCUBRIR → reserva).
   Nada de sliders ni scroll horizontal: opacity + escala muy sutil +
   los elementos de texto ENTRAN y SALEN (deslizan + blur mínimo en
   cascada). El pin corre en móvil y escritorio (layout distinto por
   CSS); solo se apila sin pin bajo reduced-motion. Todo dentro de
   inPageContext (se revierte en cada transición de página).
   ============================================================ */
import { gsap, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initPrimeraFila() {
  const pin = document.querySelector('.pf__pin');
  if (!pin || reduceMotion) return; // reduced-motion: escenas apiladas por CSS

  // el pin también corre en móvil: ignora los resizes de la barra de URL de iOS
  // (mostrar/ocultar) para que el escenario fijo no pegue saltos.
  ScrollTrigger.config({ ignoreMobileResize: true });

  inPageContext(() => {
    const scenes = gsap.utils.toArray('.pf__scene');
    if (scenes.length < 3) return;
    const imgs = scenes.map((s) => s.querySelector('.pf__img img'));
    // "elementos" que entran/salen en cada escena (marca, título, lead, reserva)
    const kids = scenes.map((s) =>
      gsap.utils.toArray(s.querySelectorAll('.pf__marker, .pf__title, .pf__lead, .pf__reserva')));

    // estado base: solo la escena 1 visible
    gsap.set(scenes, { opacity: 0 });
    gsap.set(scenes[0], { opacity: 1 });
    gsap.set(imgs, { scale: 1 });

    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: '+=250%',      // ~350vh de recorrido (100vh pin + 250vh scrub)
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    // los elementos entran desde abajo (cascada) y salen hacia arriba
    const enter = (arr, at) => tl.fromTo(arr, { y: 48, filter: 'blur(6px)' },
      { y: 0, filter: 'blur(0px)', duration: 3.2, stagger: 0.4, ease: 'power2.out' }, at);
    const exit = (arr, at) => tl.to(arr,
      { y: -32, filter: 'blur(4px)', duration: 2.6, stagger: 0.18, ease: 'power1.in' }, at);

    // ESCENA 01 · Observar — ken burns lento durante la lectura
    tl.to(imgs[0], { scale: 1.05, duration: 11, ease: 'none' }, 0);

    // 01 → 02 · Escuchar
    exit(kids[0], 8);
    tl.to(scenes[0], { opacity: 0, duration: 3 }, 8.3)
      .fromTo(imgs[1], { scale: 1.08 }, { scale: 1, duration: 12, ease: 'none' }, 8)
      .to(scenes[1], { opacity: 1, duration: 3 }, 8.3);
    enter(kids[1], 8.8);

    // 02 → 03 · Descubrir / reserva (transformación, no corte)
    exit(kids[1], 18);
    tl.to(scenes[1], { opacity: 0, duration: 3 }, 18.3)
      .fromTo(imgs[2], { scale: 1.09 }, { scale: 1.02, duration: 12, ease: 'none' }, 18)
      .to(scenes[2], { opacity: 1, duration: 3 }, 18.3);
    enter(kids[2], 18.8);

    // cola: la reserva reposa antes de soltar el pin
    tl.to({}, { duration: 6 }, 22);
  });
}
