/* ============================================================
   HERO → QUIÉNES · scroll a pantalla completa (estilo "fullscreen slideshow").
   Escritorio (≥901px): el escenario .fs-stage es sticky y recorta dos slides a
   sangre (.hero y .quienes). Al entrar en la zona bloqueamos Lenis y un GSAP
   Observer intercepta rueda/táctil/arrastre: cada gesto desliza UN slide
   (discreto, no scrub) — el hero sube (yPercent -100) y quiénes entra desde
   abajo (100→0). Cuando ya no hay slide en la dirección del gesto, devolvemos
   el scroll a Lenis (hacia la galería si es abajo, hacia el tope si es arriba).
   Móvil (≤900px): el hero es sticky (CSS) y quiénes va justo después en flujo
   normal — la propia geometría del documento hace que quiénes suba y cubra al
   hero (ver main.css, @media 900px), sea cual sea el origen del scroll. Sobre
   eso, el MISMO Observer de GSAP que usa escritorio intercepta solo el primer
   gesto (preventDefault:true) y dispara un único lenis.scrollTo hasta cubrir
   la pantalla entera — un toque/rueda, un movimiento. Hace falta preventDefault
   aquí: si dejamos que el dedo dispare scroll nativo Y ADEMÁS lancemos nuestra
   animación, la inercia nativa de iOS (que sigue corriendo tras soltar el
   dedo, sin más eventos táctiles) pelea con el scrollTo y se ve entrecortado;
   por eso NO basta con escuchar 'touchmove'/'scroll' sin más (versión anterior):
   con un toque corto, la mayoría del recorrido lo pone la inercia DESPUÉS de
   soltar, sin disparar ningún evento — el Observer, en cambio, consume el
   gesto original y lo sustituye entero por nuestra animación.
   Se dejó de usar position:fixed + ScrollTrigger.pin aquí porque en Safari
   iOS real (barra de URL que aparece/desaparece) el onLeave/onLeaveBack podía
   no disparar y el panel se quedaba fixed para siempre, flotando sobre
   secciones posteriores. Esta versión no toca position en ningún momento —el
   CSS sticky ya resuelve el layout— así que ese bug no puede repetirse aquí.
   reduced-motion: nada; el CSS ya deja ambas secciones legibles y estáticas.

   Los estados iniciales que oculta/desplaza GSAP solo se ponen en runtime:
   sin JS la home queda como dos postales apiladas.
   ============================================================ */
import { gsap, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { Observer } from 'gsap/Observer';
import { lenis } from '../scroll/lenis.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext, pageSignal } from '../utils/lifecycle.js';

gsap.registerPlugin(Observer);

const DUR = 0.9;
const EASE = 'expo.inOut';

/* ¿El jack tiene el scroll secuestrado (Lenis parado) AHORA MISMO?
   Lo consulta transitions.js al final de una transición: su lenis.start()
   de cortesía pisaba el stop() del jack recién armado en la home y dejaba
   scroll nativo vivo bajo el escenario congelado. */
let holding = false;
export const heroJackHolding = () => holding;

export function initHeroQuienes() {
  if (reduceMotion) return;

  const scroll = document.getElementById('fsScroll');
  const hero = document.getElementById('hero');
  const quienes = document.getElementById('quienes');
  if (!scroll || !hero || !quienes) return;

  const copy = quienes.querySelector('.quienes__copy');
  const desktop = window.matchMedia('(min-width:901px)');

  /* -------------------- MÓVIL: Observer intercepta SOLO el primer gesto -------------------- */
  if (!desktop.matches) {
    if (window.scrollY > 4) return; // ya veníamos con scroll (recarga a mitad, anchor…): no intervenir
    inPageContext(() => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        obs.disable();
      };
      // un único gesto hacia delante → sustituye el scroll nativo entero por
      // un lenis.scrollTo hasta el borde de la zona (quiénes cubre la pantalla)
      const onForward = () => {
        if (done) return;
        finish();
        const target = hero.offsetHeight;
        if (lenis) lenis.scrollTo(target, { duration: DUR, easing: (t) => 1 - Math.pow(1 - t, 3) });
        else window.scrollTo({ top: target, behavior: 'smooth' });
      };
      const obs = Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 6,
        preventDefault: true,
        onUp: onForward,   // gesto hacia delante (scroll down / swipe up)
        onDown: () => {},  // en el tope no hay adónde subir: no-op
      });
      pageSignal().addEventListener('abort', () => { finish(); obs.kill(); }, { once: true });
    });
    return;
  }

  /* -------------------- ESCRITORIO: scroll-jacking -------------------- */
  inPageContext(() => {
    let idx = 0;          // 0 = hero, 1 = quiénes
    let active = false;   // ¿Observer capturando el gesto?
    let animating = false;
    let releasing = false; // soltando el scroll a Lenis (ignora activaciones espurias)
    let settleUntil = 0;   // tras capturar, la inercia residual del gesto que nos
                           // trajo no cuenta como gesto nuevo (si no, al volver de
                           // la galería te atraviesa quiénes sin verla)

    // estados iniciales (idx 0): hero a la vista, quiénes esperando debajo
    gsap.set(hero, { yPercent: 0 });
    gsap.set(quienes, { yPercent: 100 });
    gsap.set(copy, { autoAlpha: 0, y: 40 });

    // desliza al slide `target` (0|1); el texto de quiénes aparece al llegar
    function goTo(target) {
      if (animating || target === idx) return;
      animating = true;
      const toQuienes = target === 1;
      const tl = gsap.timeline({
        defaults: { duration: DUR, ease: EASE },
        onComplete: () => { idx = target; animating = false; settleUntil = performance.now() + 250; },
      });
      tl.to(hero, { yPercent: toQuienes ? -100 : 0 }, 0)
        .to(quienes, { yPercent: toQuienes ? 0 : 100 }, 0)
        .to(copy,
          toQuienes
            ? { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            : { autoAlpha: 0, y: 40, duration: 0.35, ease: 'power2.in' },
          toQuienes ? 0.42 : 0);
    }

    // libera el scroll a Lenis y baja hacia la galería. Va SIEMPRE hacia delante
    // (desde quiénes): el hero es el tope de la página, arriba no hay adónde ir.
    // Scroll ANIMADO (no immediate): así el DOM y Lenis avanzan juntos y no hay un
    // tick de desfase en el que ScrollTrigger lea scrollTop=0 y dispare un onEnter
    // espurio; aun así, `releasing` blinda activate() hasta que el scroll acaba.
    function release() {
      if (!active || releasing) return;
      active = false;
      holding = false;
      releasing = true;
      obs.disable();
      if (!lenis) { releasing = false; return; }
      lenis.start();
      // un pelín pasado el final de la zona → el sticky se despega y entra la galería
      lenis.scrollTo(st.end + 2, {
        force: true,
        onComplete: () => { releasing = false; },
      });
    }

    // engancha el jack: bloquea Lenis en el tope de la zona y captura el gesto.
    // entryIdx marca qué slide se ve al entrar (0 por arriba, 1 por abajo)
    function activate(entryIdx) {
      if (active || releasing) return;
      active = true;
      holding = true;
      idx = entryIdx;
      animating = false;
      if (entryIdx === 0) {
        gsap.set(hero, { yPercent: 0 });
        gsap.set(quienes, { yPercent: 100 });
        gsap.set(copy, { autoAlpha: 0, y: 40 });
      } else {
        gsap.set(hero, { yPercent: -100 });
        gsap.set(quienes, { yPercent: 0 });
        gsap.set(copy, { autoAlpha: 1, y: 0 });
      }
      // +1: aparcar EXACTAMENTE en st.start deja el progreso del trigger en 0,
      // que para ScrollTrigger es "fuera de la zona" → disparaba onLeaveBack y
      // deactivate() deshacía el jack un tick después de armarlo. 1px dentro
      // (invisible: el escenario es sticky en toda la zona) lo mantiene activo.
      if (lenis) { lenis.stop(); lenis.scrollTo(st.start + 1, { immediate: true, force: true }); }
      settleUntil = performance.now() + 350;
      obs.enable();
    }

    function deactivate() {
      releasing = false; // al salir de la zona el release ya cumplió (o se abortó)
      if (!active) return;
      active = false;
      holding = false;
      obs.disable();
      if (lenis) lenis.start();
    }

    // Observer con el idiom canónico del "fullscreen slideshow" de GSAP:
    // wheelSpeed:-1 invierte la rueda para que rueda-abajo y swipe-arriba
    // signifiquen lo mismo (AVANZAR) → onUp = siguiente, onDown = anterior.
    const next = () => {
      if (!active || animating || performance.now() < settleUntil) return;
      if (idx < 1) goTo(idx + 1); else release();   // ya en quiénes → soltar hacia la galería
    };
    const prev = () => {
      if (!active || animating || performance.now() < settleUntil) return;
      if (idx > 0) goTo(idx - 1);                    // en el hero (tope) no hay adónde subir
    };
    const obs = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onUp: next,
      onDown: prev,
    });
    obs.disable(); // arranca dormido; lo despierta activate()

    // la zona controla cuándo el jack está vivo
    const st = ScrollTrigger.create({
      trigger: scroll,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => activate(0),        // bajando: llegamos con el hero
      onEnterBack: () => activate(1),    // subiendo desde la galería: con quiénes
      onLeave: deactivate,               // pasamos de largo hacia abajo
      onLeaveBack: deactivate,           // pasamos de largo hacia arriba
    });

    // carga fría: la home entra siempre por el hero, en el tope de la página.
    // (No sirve mirar st.isActive aquí: ScrollTrigger.refresh() —que calcula
    // start/end— corre DESPUÉS en main.js; en el tope st.start es 0 igualmente.)
    if (window.scrollY <= 2) activate(0);

    // al desmontar (transición SPA): el revert del gsap.context mata tweens y el
    // ScrollTrigger, pero NO el Observer (escucha en window) NI reanuda Lenis. Si
    // salíamos con el jack activo, Lenis quedó .stop() → la siguiente página no
    // scrollearía. Mata el Observer y descongela Lenis explícitamente.
    pageSignal().addEventListener('abort', () => {
      holding = false;
      obs.kill();
      if (lenis) lenis.start();
    }, { once: true });
  });
}
