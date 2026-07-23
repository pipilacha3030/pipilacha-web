/* ============================================================
   HERO → QUIÉNES → SOLSTICIO FLORAL · scroll a pantalla completa (estilo
   "fullscreen slideshow"), con TRES escenas en vez de dos: el hero, "un menú
   entero hecho de flores" y la tarjeta "Solsticio floral" (el showcase de
   fotos) entran y salen del mismo escenario, una detrás de otra.
   Escritorio (≥901px): el escenario .fs-stage es sticky y recorta los tres
   slides a sangre (.hero, .quienes, .gallery). Al entrar en la zona bloqueamos
   Lenis y un GSAP Observer intercepta rueda/táctil/arrastre: cada gesto
   desliza UN slide (discreto, no scrub) — el que sale sube o baja completo
   (yPercent ±100) mientras el que entra ocupa su lugar (100→0 o -100→0), y
   como todas las transiciones son entre slides ADYACENTES (next()/prev() solo
   se mueven de uno en uno) el matiz de "cuál pisa a cuál" nunca importa: dos
   cajas a pantalla completa separadas siempre por exactamente 100vh no llegan
   a solaparse. Cuando ya no hay slide en la dirección del gesto, devolvemos
   el scroll a Lenis (hacia el interludio si es abajo, hacia el tope si es
   arriba). El crossfade de fotos del showcase (showcase.js) no tiene forma de
   leer su propia visibilidad aquí dentro (su posición de documento no cambia,
   solo su yPercent) — por eso recibe un `showcase` handle y este módulo llama
   a showcase.enter()/leave() cuando la escena 2 entra o sale.
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

/* Cada gesto queda "consumido" durante DUR + SETTLE: mientras tanto la rueda no
   hace nada (es el precio del jack). Medido con scroll real, 0.9 + 0.25 daba
   1.15 s de bloqueo por slide —2.5 s para cruzar las tres escenas— y se sentía
   pegado. 0.62 + 0.25 baja a 0.87 s sin tocar SETTLE: ese margen es el que
   impide que la inercia de UN solo golpe de trackpad cuele dos slides (te
   saltarías "quiénes" sin verla). expo.inOut arrancaba y frenaba tan despacio
   que el movimiento parecía empezar tarde; power2.inOut responde antes. */
const DUR = 0.62;
const EASE = 'power2.inOut';
const SETTLE = 250;      // ms sordos tras cada slide (inercia del gesto)
const SETTLE_ENTER = 300; // ms sordos al enganchar el jack (el gesto que nos trajo)
const RELEASE_DUR = 0.6;  // s del scroll de salida (antes: 1.2 por defecto de Lenis)

/* ¿El jack tiene el scroll secuestrado (Lenis parado) AHORA MISMO?
   Lo consulta transitions.js al final de una transición: su lenis.start()
   de cortesía pisaba el stop() del jack recién armado en la home y dejaba
   scroll nativo vivo bajo el escenario congelado. */
let holding = false;
export const heroJackHolding = () => holding;

/* ¿Va a hacerse cargo este módulo de "Solsticio floral" (.gallery), moviéndola
   al escenario como tercera escena? Única fuente de verdad — showcase.js la
   consulta para saber si debe crear su propio ScrollTrigger de visibilidad o
   si el jack le llamará a enter()/leave(). No vale mirar la clase .fs-slide:
   la pone este módulo, que corre DESPUÉS de initShowcase(). */
export function heroJackOwnsGallery() {
  if (reduceMotion) return false;
  if (!window.matchMedia('(min-width:901px)').matches) return false;
  return !!(document.getElementById('fsScroll') && document.getElementById('hero')
    && document.getElementById('quienes') && document.getElementById('gallery'));
}

export function initHeroQuienes(showcase) {
  if (reduceMotion) return;

  const scroll = document.getElementById('fsScroll');
  const hero = document.getElementById('hero');
  const quienes = document.getElementById('quienes');
  const gallery = document.getElementById('gallery');
  if (!scroll || !hero || !quienes || !gallery) return;

  const slides = [hero, quienes, gallery];
  const last = slides.length - 1; // 2 = solsticio floral
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

  /* -------------------- ESCRITORIO: scroll-jacking --------------------
     "Solsticio floral" vive en el HTML DESPUÉS del interludio (orden de móvil,
     sin-JS y reduced-motion). Solo aquí, en escritorio y con el jack vivo, se
     mueve al escenario para ser la tercera escena. Se mueve ANTES de crear
     nada: el ScrollTrigger de la zona y el refresh() de main.js miden ya con
     el DOM definitivo. El nodo se va con el <main> en cada transición SPA, así
     que no hace falta deshacer el movimiento en destroyPage(). */
  const stage = scroll.querySelector('.fs-stage');
  if (stage && gallery.parentElement !== stage) {
    gallery.classList.add('fs-slide');
    gallery.setAttribute('data-fs-slide', '2');
    stage.appendChild(gallery);
  }

  inPageContext(() => {
    let idx = 0;          // 0 = hero, 1 = quiénes, 2 = solsticio floral
    let active = false;   // ¿Observer capturando el gesto?
    let animating = false;
    let releasing = false; // soltando el scroll a Lenis (ignora activaciones espurias)
    let settleUntil = 0;   // tras capturar, la inercia residual del gesto que nos
                           // trajo no cuenta como gesto nuevo (si no, al volver de
                           // la galería te atraviesa quiénes sin verla)

    // coloca los slides en reposo según qué índice esté "a la vista"
    const layout = (target) => {
      slides.forEach((el, i) => {
        gsap.set(el, { yPercent: i < target ? -100 : i > target ? 100 : 0 });
      });
      gsap.set(copy, target === 1 ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 40 });
    };

    // estados iniciales (idx 0): hero a la vista, el resto esperando debajo
    layout(0);

    // desliza al slide `target` (adyacente a idx); el texto de quiénes solo
    // aparece/desaparece al cruzar la escena 1, y el crossfade del showcase
    // se enciende/apaga al cruzar la escena 2 (solsticio floral)
    function goTo(target) {
      if (animating || target === idx) return;
      animating = true;
      const forward = target > idx;
      const leaving = slides[idx];
      const entering = slides[target];
      const prevIdx = idx;
      const tl = gsap.timeline({
        defaults: { duration: DUR, ease: EASE },
        onComplete: () => {
          idx = target; animating = false; settleUntil = performance.now() + SETTLE;
          if (target === last) showcase?.enter();
          else if (prevIdx === last) showcase?.leave();
        },
      });
      tl.to(leaving, { yPercent: forward ? -100 : 100 }, 0)
        .to(entering, { yPercent: 0 }, 0);
      if (target === 1) tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.42);
      else if (idx === 1) tl.to(copy, { autoAlpha: 0, y: 40, duration: 0.35, ease: 'power2.in' }, 0);
    }

    // libera el scroll a Lenis y baja hacia el interludio. Va SIEMPRE hacia
    // delante (desde la última escena): el hero es el tope de la página,
    // arriba no hay adónde ir.
    // Scroll ANIMADO (no immediate): así el DOM y Lenis avanzan juntos y no hay un
    // tick de desfase en el que ScrollTrigger lea scrollTop=0 y dispare un onEnter
    // espurio; aun así, `releasing` blinda activate() hasta que el scroll acaba.
    function release() {
      if (!active || releasing) return;
      active = false;
      holding = false;
      releasing = true;
      obs.disable();
      showcase?.leave();
      if (!lenis) { releasing = false; return; }
      lenis.start();
      // un pelín pasado el final de la zona → el sticky se despega y entra el interludio
      lenis.scrollTo(st.end + 2, {
        force: true,
        duration: RELEASE_DUR,
        onComplete: () => { releasing = false; },
      });
    }

    // engancha el jack: bloquea Lenis en el tope de la zona y captura el gesto.
    // entryIdx marca qué slide se ve al entrar (0 por arriba, last por abajo)
    function activate(entryIdx) {
      if (active || releasing) return;
      active = true;
      holding = true;
      idx = entryIdx;
      animating = false;
      layout(entryIdx);
      if (entryIdx === last) showcase?.enter(); else showcase?.leave();
      // +1: aparcar EXACTAMENTE en st.start deja el progreso del trigger en 0,
      // que para ScrollTrigger es "fuera de la zona" → disparaba onLeaveBack y
      // deactivate() deshacía el jack un tick después de armarlo. 1px dentro
      // (invisible: el escenario es sticky en toda la zona) lo mantiene activo.
      if (lenis) { lenis.stop(); lenis.scrollTo(st.start + 1, { immediate: true, force: true }); }
      settleUntil = performance.now() + SETTLE_ENTER;
      obs.enable();
    }

    function deactivate() {
      releasing = false; // al salir de la zona el release ya cumplió (o se abortó)
      if (!active) return;
      active = false;
      holding = false;
      obs.disable();
      if (idx === last) showcase?.leave();
      if (lenis) lenis.start();
    }

    // Observer con el idiom canónico del "fullscreen slideshow" de GSAP:
    // wheelSpeed:-1 invierte la rueda para que rueda-abajo y swipe-arriba
    // signifiquen lo mismo (AVANZAR) → onUp = siguiente, onDown = anterior.
    const next = () => {
      if (!active || animating || performance.now() < settleUntil) return;
      if (idx < last) goTo(idx + 1); else release();   // ya en la última escena → soltar
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
      onEnterBack: () => activate(last), // subiendo desde el interludio: con la última escena
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
