/* ============================================================
   HERO → QUIÉNES · scroll a pantalla completa (estilo "fullscreen slideshow").
   Escritorio (≥901px): el escenario .fs-stage es sticky y recorta dos slides a
   sangre (.hero y .quienes). Al entrar en la zona bloqueamos Lenis y un GSAP
   Observer intercepta rueda/táctil/arrastre: cada gesto desliza UN slide
   (discreto, no scrub) — el hero sube (yPercent -100) y quiénes entra desde
   abajo (100→0). Cuando ya no hay slide en la dirección del gesto, devolvemos
   el scroll a Lenis (hacia la galería si es abajo, hacia el tope si es arriba).
   Móvil (≤900px): mismo lenguaje que primeraFila.js — el hero se fija
   (ScrollTrigger.pin, no Observer: en móvil no conviene secuestrar wheel/touch)
   y quiénes (foto + texto, position:fixed durante la zona) SUBE encima ligado
   1:1 al scroll (scrub), de y:100vh a y:0. Al terminar la zona, quiénes vuelve
   a flujo normal para que el resto de la página siga bajando por debajo.
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

  /* -------------------- MÓVIL: quiénes sube y cubre el hero -------------------- */
  if (!desktop.matches) {
    inPageContext(() => {
      let pinned = false;
      // fixed: top/left/right sin bottom → el panel conserva su alto natural
      // (foto + texto puede superar 100dvh) en vez de recortarse a la pantalla.
      const pinOn = () => {
        if (pinned) return;
        pinned = true;
        gsap.set(quienes, { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 5 });
      };
      const pinOff = (y) => {
        pinned = false;
        gsap.set(quienes, { position: 'static', top: 'auto', left: 'auto', right: 'auto', zIndex: 'auto', y });
      };
      pinOn();
      gsap.set(quienes, { y: '100vh' });

      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: () => '+=' + hero.offsetHeight,
        pin: hero,
        // sin esto, ScrollTrigger reserva alto del hero DOS veces (su propia
        // caja + la distancia del scrub): al superar la zona el hero volvía a
        // aparecer en flujo normal antes de que quiénes "aterrizara" en su
        // sitio real. false = quiénes queda pegado justo donde termina el pin.
        pinSpacing: false,
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => { if (pinned) gsap.set(quienes, { y: (1 - self.progress) * 100 + 'vh' }); },
        onLeave: () => pinOff(0),           // zona superada bajando → flujo normal, ya "aterrizado"
        onEnterBack: () => pinOn(),         // se vuelve a entrar desde abajo → se refija para el scrub
        onLeaveBack: () => pinOff('100vh'), // se sube por encima del hero → fuera de escena
      });
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
