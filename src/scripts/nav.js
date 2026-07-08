/* ============================================================
   Dock de navegación (persiste entre páginas): morphing del
   burger, drawer lateral con stagger, sombra progresiva al
   scroll, contracción, vuelo de la libélula y barra de reserva.
   Se inicializa UNA vez por carga real; sus listeners viven
   toda la sesión (no dependen del ciclo de vida por página).
   ============================================================ */
import { lenis } from './scroll/lenis.js';
import { gsap } from './scroll/scrollTrigger.js';
import { reduceMotion } from './utils/motion.js';

const dock = document.getElementById('navDock');
const burger = document.getElementById('burger');
const overlay = document.getElementById('navOverlay');
const scrim = document.getElementById('navScrim');
const bloom = overlay && overlay.querySelector('.nav-overlay__bloom');
const drawerLinks = overlay ? overlay.querySelectorAll('.nav-overlay__list a') : [];
const drawerFoot = overlay && overlay.querySelector('.nav-overlay__foot');

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

/* ---- drawer lateral ----
   Panel con power3.out + scrim en fade; los enlaces entran en cascada real
   (stagger de GSAP: opacity + translateY con ~50ms entre cada uno).
   Un único timeline vivo: si llega un toggle con el anterior a medias se mata
   — si no, el set(visibility:hidden) final del cierre podría dispararse tras
   una reapertura rápida y dejar el panel invisible con el menú "abierto". */
let drawerTl = null;

function openDrawer() {
  if (drawerTl) drawerTl.kill();
  drawerTl = gsap.timeline({ defaults: { overwrite: 'auto' } })
    .set(overlay, { visibility: 'visible' })
    .to(scrim, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
    .to(overlay, { xPercent: 0, duration: 0.6, ease: 'power3.out' }, 0)
    .fromTo(drawerLinks, { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }, 0.18)
    .fromTo(drawerFoot, { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, 0.5);
}

function closeDrawer() {
  if (drawerTl) drawerTl.kill();
  drawerTl = gsap.timeline({ defaults: { overwrite: 'auto' } })
    .to(overlay, { xPercent: -102, duration: 0.45, ease: 'power2.in' }, 0)
    .to(scrim, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0)
    .set(overlay, { visibility: 'hidden' });
}

export const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  if (overlay) overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (scrim) scrim.style.pointerEvents = open ? 'auto' : 'none';
  if (!open && bloom) bloom.classList.remove('is-active');
  document.body.classList.toggle('scroll-lock', open);
  if (lenis) open ? lenis.stop() : lenis.start();
  morphBurger(open);
  if (!reduceMotion && overlay && scrim) open ? openDrawer() : closeDrawer();
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
    if (overlay) gsap.set(overlay, { xPercent: -102 });
    if (scrim) gsap.set(scrim, { autoAlpha: 0 });
  }

  burger.addEventListener('click', () => setMenu(!isMenuOpen()));
  if (scrim) scrim.addEventListener('click', () => setMenu(false));
  // al pulsar un enlace del drawer se cierra (la navegación la hace el router)
  if (overlay) overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* la flor de cada opción asoma en el panel al hover (solo puntero fino).
     Se reutiliza un único <img>: se le cambia el src por opción. */
  if (bloom && window.matchMedia('(hover:hover)').matches) {
    const img = bloom.querySelector('img');
    overlay.querySelectorAll('.nav-overlay__list a[data-flower]').forEach((a) => {
      a.addEventListener('mouseenter', () => {
        const src = a.dataset.flower;
        if (!src) return;
        if (img.getAttribute('src') !== src) img.setAttribute('src', src);
        bloom.classList.add('is-active');
      });
    });
    const list = overlay.querySelector('.nav-overlay__list');
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
