/* ============================================================
   Nav fija (persiste entre páginas): fondo al hacer scroll,
   menú móvil, vuelo de la libélula y barra fija de reserva.
   Se inicializa UNA vez por carga real; sus listeners viven
   toda la sesión (no dependen del ciclo de vida por página).
   ============================================================ */
import { lenis } from './scroll/lenis.js';

const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const overlay = document.getElementById('navOverlay');
const tilesLayer = overlay && overlay.querySelector('.nav-overlay__tiles');

export const isMenuOpen = () => document.body.classList.contains('menu-open');

export const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open); // dispara el overlay + ajustes de la nav (CSS)
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  if (overlay) overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (!open && tilesLayer) tilesLayer.classList.remove('is-active'); // al cerrar, oculta las tiles
  document.body.classList.toggle('scroll-lock', open);
  if (lenis) open ? lenis.stop() : lenis.start();
};

/* nav background toggle (umbral pequeño si la nav ya es sólida)
   la barra de reserva se busca en vivo: cambia de página en página.
   La altura del viewport se cachea (leerla en cada scroll fuerza layout). */
let vh = window.innerHeight;

export const onScroll = (y) => {
  const threshold = nav.classList.contains('nav--solid') ? 10 : vh * 0.6;
  nav.classList.toggle('scrolled', y > threshold);
  const reservaBar = document.getElementById('reservaBar');
  if (reservaBar) reservaBar.classList.toggle('is-visible', y > vh * 0.5);
};

export function initNav() {
  burger.addEventListener('click', () => setMenu(!isMenuOpen()));
  // al pulsar un enlace del overlay se cierra (la navegación la hace el router)
  if (overlay) overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* image-tiles: al hover de una opción del overlay, su flor aparece repartida en
     3 tiles (solo con puntero fino). Reutiliza 3 <img>: se les cambia el src. */
  if (tilesLayer && window.matchMedia('(hover:hover)').matches) {
    const tileImgs = Array.from(tilesLayer.querySelectorAll('.nav-tile img'));
    const list = overlay.querySelector('.nav-overlay__list');
    overlay.querySelectorAll('.nav-overlay__list a[data-flower]').forEach((a) => {
      a.addEventListener('mouseenter', () => {
        const src = a.dataset.flower;
        if (!src) return;
        tileImgs.forEach((im) => { if (im.getAttribute('src') !== src) im.setAttribute('src', src); });
        tilesLayer.classList.add('is-active');
      });
    });
    if (list) list.addEventListener('mouseleave', () => tilesLayer.classList.remove('is-active'));
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
