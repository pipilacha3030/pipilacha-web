/* ============================================================
   CREATOR GARDEN · movimiento
   Punto de entrada propio. NO importa main.js a propósito: esta
   página no tiene nav, router, cookies, galería ni widget de reserva,
   así que arrastrar ese árbol solo costaría descarga y trabajo por
   frame.

   Sí reutiliza scroll/scrollTrigger.js, que es donde se registran los
   plugins y donde el ticker de GSAP conduce a Lenis. Importar gsap por
   otro lado dejaría el plugin sin registrar y un segundo driver.

   Reglas de la casa aplicadas aquí:
   · solo se animan transform y opacity (ni layout ni paint)
   · lo que entra usa expo.out; lo que responde a un gesto, rápido
   · con prefers-reduced-motion no se crea NINGÚN tween: el CSS ya
     deja todo visible, así que la página se lee igual y sin trabajo
   ============================================================ */
import { gsap, ScrollTrigger, SplitText } from './scroll/scrollTrigger.js';
import { reduceMotion } from './utils/motion.js';

/* Las líneas y palabras se parten DESPUÉS de que las fuentes asienten.
   Si se parte antes, se mide con la fuente de reserva y los saltos de
   línea quedan donde no son: el reveal se ve descuadrado en carga fría. */
const listo = document.fonts ? document.fonts.ready : Promise.resolve();

/* La portada NO se anima con scroll. Todo lo que cae en la primera
   pantalla tiene que estar visible al cargar: con ScrollTrigger, un
   elemento que queda unos píxeles por debajo de la línea de disparo se
   queda invisible hasta que el usuario mueve la rueda, y parece roto.
   Aquí entra por tiempo, encadenado. */
function portada() {
  const open = document.querySelector('.gd-open');
  if (!open) return;
  const titulo = open.querySelector('[data-gd-words]');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (titulo) {
    const split = new SplitText(titulo, { type: 'lines,words', linesClass: 'gd-line' });
    gsap.set(titulo, { opacity: 1 });
    tl.from(split.words, { yPercent: 108, duration: 1.2, stagger: 0.05 }, 0.15);
  }
  tl.to(open.querySelectorAll('.gd-reveal'),
        { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.35);
}

function titulares() {
  // titulares: palabra a palabra, subiendo desde detrás de su propia línea
  gsap.utils.toArray('[data-gd-words]').forEach((el) => {
    if (el.closest('.gd-open')) return; // la portada la lleva portada()
    const split = new SplitText(el, { type: 'lines,words', linesClass: 'gd-line' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.words, {
      yPercent: 108, duration: 1.1, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 84%' },
    });
  });

  // párrafos largos: línea a línea, más contenido que el titular
  gsap.utils.toArray('[data-gd-lines]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'gd-line' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.lines, {
      yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });
}

function revelados() {
  gsap.utils.toArray('.gd-reveal').forEach((el) => {
    if (el.closest('.gd-open')) return; // idem: la portada entra por tiempo
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.05, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // grupos en cascada: entran como una unidad, no uno a uno
  gsap.utils.toArray('[data-gd-stagger]').forEach((grupo) => {
    const hijos = grupo.querySelectorAll('.gd-item');
    if (!hijos.length) return;
    gsap.to(hijos, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: grupo, start: 'top 85%' },
    });
  });
}

function parallax() {
  gsap.utils.toArray('[data-gd-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.gdParallax) || 0.1;
    gsap.fromTo(el,
      { yPercent: -amt * 50 },
      { yPercent: amt * 50, ease: 'none',
        scrollTrigger: { trigger: el.closest('section, figure') || el,
                         start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* El tallo: un trazo que se dibuja de arriba abajo con el scroll de la
   página. Es el hilo que cose las escenas — la única pieza decorativa
   de la página, y aun así va atada al progreso real, no a un bucle. */
function tallo() {
  const path = document.querySelector('.gd-spine__path');
  if (!path) return;
  const largo = path.getTotalLength();
  gsap.set(path, { strokeDasharray: largo, strokeDashoffset: largo });
  gsap.to(path, {
    strokeDashoffset: 0, ease: 'none',
    scrollTrigger: { start: 0, end: () => document.body.scrollHeight - innerHeight, scrub: 0.6 },
  });
}

/* Índice lateral: marca la escena en la que estás. Es orientación, no
   adorno — en una página tan larga hace falta saber dónde vas. */
function indice() {
  const enlaces = new Map(
    [...document.querySelectorAll('.gd-index__link')].map((a) => [a.getAttribute('href').slice(1), a])
  );
  document.querySelectorAll('section[id]').forEach((sec) => {
    const a = enlaces.get(sec.id);
    if (!a) return;
    const marcar = (on) => () => a.classList.toggle('is-on', on);
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => a.classList.toggle('is-on', self.isActive),
      onEnter: marcar(true), onEnterBack: marcar(true),
    });
  });
}

function init() {
  if (!reduceMotion) {
    portada();
    titulares();
    revelados();
    parallax();
    tallo();
  }
  indice();          // la orientación se mantiene aunque no haya animación
  ScrollTrigger.refresh();
}

listo.then(() => {
  init();
  // segundo refresh de cortesía: las imágenes perezosas cambian la altura
  // de la página y dejarían los disparadores calculados sobre una posición vieja
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
});
