/* ============================================================
   Dock de navegación (persiste entre páginas): morphing del
   burger, MORPHING del dock → panel de menú, sombra progresiva
   al scroll, contracción, vuelo de la libélula y barra de
   reserva. Se inicializa UNA vez por carga real; sus listeners
   viven toda la sesión (no dependen del ciclo de vida por página).
   ============================================================ */
import { lenis } from './scroll/lenis.js';
import { gsap } from './scroll/scrollTrigger.js';
import { reduceMotion } from './utils/motion.js';

const dock = document.getElementById('navDock');
const burger = document.getElementById('burger');
const menu = document.getElementById('navMenu');
const scrim = document.getElementById('navScrim');
const dockLogo = document.querySelector('.nav__logo');
const dockCta = document.querySelector('.nav__cta');
// la flor vive FUERA del dock (hermana previa): detrás del cristal, no en el panel
const bloom = document.querySelector('.nav__menu-bloom');
const menuLinks = menu ? menu.querySelectorAll('.nav__menu-list a') : [];
const metaBlocks = menu ? menu.querySelectorAll('.nav__menu-meta > div') : [];

export const isMenuOpen = () => document.body.classList.contains('menu-open');

/* ---- morphing del burger (☰ → ✕) ----
   Primero las líneas exteriores VIAJAN al centro mientras la central colapsa;
   ya superpuestas, giran a ±45° con back.out(1.4): se pasan unos grados y
   asientan — el "resorte". El cierre es inverso y sin overshoot (power3.out),
   más obediente. Bajo reduced-motion no hay timeline: el estado abierto lo
   pinta el CSS (regla .is-open en el bloque reduced-motion). */
const lines = burger.querySelectorAll('span');
let burgerTl = null;

function morphBurger(open) {
  if (reduceMotion) return;
  const [a, b, c] = lines;
  // si llega un toggle con el anterior a medias, se mata: un timeline vivo por gesto
  if (burgerTl) burgerTl.kill();
  if (open) {
    burgerTl = gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(a, { y: 0, duration: 0.18, ease: 'power2.in' }, 0)
      .to(c, { y: 0, duration: 0.18, ease: 'power2.in' }, 0)
      .to(b, { scaleX: 0, opacity: 0, duration: 0.15, ease: 'power2.in' }, 0)
      .to(a, { rotation: 45, duration: 0.33, ease: 'back.out(1.4)' }, 0.12)
      .to(c, { rotation: -45, duration: 0.33, ease: 'back.out(1.4)' }, 0.12);
  } else {
    burgerTl = gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to([a, c], { rotation: 0, duration: 0.25, ease: 'power3.out' }, 0)
      .to(a, { y: -6, duration: 0.2, ease: 'power3.out' }, 0.15)
      .to(c, { y: 6, duration: 0.2, ease: 'power3.out' }, 0.15)
      .to(b, { scaleX: 1, opacity: 1, duration: 0.2, ease: 'power3.out' }, 0.18);
  }
}

/* ---- morphing del dock → panel de menú ----
   Un ÚNICO timeline que se reproduce al abrir y se REVIERTE al cerrar:
   play()/reverse() dan reversibilidad total incluso con toggles a mitad de
   gesto (el reverse arranca del progreso actual, sin saltos). Coreografía:
   t0 el logo y el CTA ceden el sitio (el burger se queda: mutado a ✕ es el
   cierre), el cristal interpola SOLO su geometría (max-width/height/radius
   — el blur, el bisel y el ruido se recalculan solos) con power4.inOut
   cinematográfico, y el panel aparece cuando la expansión aún está
   terminando (offset >-0.45) con los enlaces y metadatos en cascada.
   Mientras corre, .is-morphing activa will-change y congela el sheen
   (ver main.css). Al completar el cierre, clearProps borra todo estilo
   inline y devuelve el control al CSS; el timeline se desecha para que
   la próxima apertura re-capture la geometría real (viewport cambiante). */
let menuTl = null;

function buildMenuTl() {
  return gsap.timeline({
    paused: true,
    defaults: { overwrite: 'auto' },
    onComplete: () => dock.classList.remove('is-morphing'), // el sheen re-arranca: un barrido limpio sobre el panel ya asentado
    onReverseComplete: () => {
      dock.classList.remove('is-morphing');
      // clearProps 'all' en dock borraría --dock-elev (custom property que
      // onScroll escribe fuera de este timeline) y la sombra se apagaría
      // hasta el próximo cambio de scroll: se acota a las 3 props del morph
      gsap.set(dock, { clearProps: 'maxWidth,height,borderRadius' });
      gsap.set([dockLogo, dockCta, menu], { clearProps: 'all' });
      gsap.set(menuLinks, { clearProps: 'all' });
      gsap.set(metaBlocks, { clearProps: 'all' });
      menuTl = null;
    },
  })
    .to([dockLogo, dockCta], { autoAlpha: 0, scale: 0.9, duration: 0.2, ease: 'power2.in' }, 0)
    .to(scrim, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .to(dock, { maxWidth: '92vw', height: '80vh', borderRadius: 22, duration: 0.85, ease: 'power4.inOut' }, 0)
    .to(menu, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, '>-0.45')
    .fromTo(menuLinks, { autoAlpha: 0, y: 25 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }, '<')
    .fromTo(metaBlocks, { autoAlpha: 0, y: 25 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 }, '<0.15');
}

/* La transición B (el dock se traga la página, transitions.js) toma el control
   del cristal a mitad de gesto: mata el timeline del menú SIN su limpieza —
   los estilos inline que deja vivos son justo el punto de partida del morph
   a pantalla completa. El router repone todo con clearProps al contraer. */
export function seizeMenuTimeline() {
  if (menuTl) { menuTl.kill(); menuTl = null; }
}

function openMenu() {
  dock.classList.add('is-morphing');
  if (!menuTl) menuTl = buildMenuTl();
  menuTl.play();
}

function closeMenu() {
  if (!menuTl) return;
  dock.classList.add('is-morphing');
  menuTl.reverse();
}

export const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (scrim) scrim.style.pointerEvents = open ? 'auto' : 'none';
  if (!open && bloom) bloom.classList.remove('is-active');
  document.body.classList.toggle('scroll-lock', open);
  if (lenis) open ? lenis.stop() : lenis.start();
  morphBurger(open);
  if (!reduceMotion && menu && scrim) open ? openMenu() : closeMenu();
};

/* ---- scroll: contracción + sombra progresiva ----
   La contracción son dos estados por POSICIÓN (no scrub frame a frame, que
   titila); el padding transiciona por CSS. La elevación de la sombra sí es
   progresiva: se mapea el scroll (0→320px) a la opacidad del ::after que ya
   tiene pintada la sombra intensa — solo cambia opacity, compuesta en GPU.
   La barra de reserva se busca en vivo: cambia de página en página.
   La altura del viewport se cachea (leerla en cada scroll fuerza layout). */
let vh = window.innerHeight;
let isCompact = false;
let lastElev = -1;
const COMPACT_THRESHOLD = 40;
const ELEV_RANGE = 320;

export const onScroll = (y) => {
  const compact = y > COMPACT_THRESHOLD;
  if (compact !== isCompact) {
    isCompact = compact;
    dock.classList.toggle('is-compact', compact);
  }
  const elev = Math.min(1, y / ELEV_RANGE);
  if (Math.abs(elev - lastElev) > 0.01) {
    lastElev = elev;
    dock.style.setProperty('--dock-elev', elev.toFixed(3));
  }
  const reservaBar = document.getElementById('reservaBar');
  if (reservaBar) reservaBar.classList.toggle('is-visible', y > vh * 0.5);
};

export function initNav() {
  // estados iniciales de las piezas animadas (solo si hay movimiento)
  if (!reduceMotion) {
    if (lines.length === 3) {
      gsap.set(lines[0], { y: -6 });
      gsap.set(lines[2], { y: 6 });
    }
    if (scrim) gsap.set(scrim, { autoAlpha: 0 });
  }

  burger.addEventListener('click', () => setMenu(!isMenuOpen()));
  if (scrim) scrim.addEventListener('click', () => setMenu(false));
  // al pulsar un enlace del panel se cierra (la navegación la hace el router)
  if (menu) menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* la flor de cada opción asoma en el panel al hover (solo puntero fino).
     Se reutiliza un único <img>: se le cambia el src por opción. */
  if (bloom && window.matchMedia('(hover:hover)').matches) {
    const img = bloom.querySelector('img');
    menu.querySelectorAll('.nav__menu-list a[data-flower]').forEach((a) => {
      a.addEventListener('mouseenter', () => {
        const src = a.dataset.flower;
        if (!src) return;
        if (img.getAttribute('src') !== src) img.setAttribute('src', src);
        bloom.classList.add('is-active');
      });
    });
    const list = menu.querySelector('.nav__menu-list');
    if (list) list.addEventListener('mouseleave', () => bloom.classList.remove('is-active'));
  }

  // Esc cierra el menú y devuelve el foco al botón (accesibilidad de teclado)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) { setMenu(false); burger.focus(); }
  });

  /* la libélula levanta el vuelo al pulsarla: aletea y se eleva. En el Inicio
     (misma página, el enlace no navega) además sube arriba con scroll suave. */
  const navLogo = document.querySelector('.nav__logo');
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      navLogo.classList.remove('is-flying');
      void navLogo.offsetWidth; // reinicia la animación en cada pulsación
      navLogo.classList.add('is-flying');
      navLogo.addEventListener('animationend', () => navLogo.classList.remove('is-flying'), { once: true });
      const atHome = location.pathname === '/' || location.pathname === '';
      if (atHome) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0, { duration: 1.1 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  window.addEventListener('resize', () => { vh = window.innerHeight; });
  if (lenis) lenis.on('scroll', (e) => onScroll(e.scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
}
