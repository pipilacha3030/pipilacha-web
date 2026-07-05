/* ============================================================
   PIPILACHA · interacción — punto de entrada
   Orquesta el ciclo de vida por página: todo lo que vive dentro
   de <main> se monta en initPage() y se desmonta en destroyPage()
   (la transición asíncrona intercambia <main> sin recargar).
   Vite bundlea y hashea este árbol de módulos: sin ?v=N manual.
   ============================================================ */
import { ScrollTrigger } from './scroll/scrollTrigger.js';
import { lenis } from './scroll/lenis.js';
import { resetPage, pageGeneration } from './utils/lifecycle.js';
import { initNav } from './nav.js';
import { initTransitions } from './transitions.js';
import { bindPageAnchors } from './scroll/anchors.js';
import { initHero, resetHero } from './animations/hero.js';
import { initReveals } from './animations/reveal.js';
import { initMediaBlooms } from './animations/media.js';
import { initMenuStem } from './animations/menu.js';
import { initParallax } from './animations/parallax.js';
import { initShowcase } from './animations/showcase.js';
import { initMagnetic } from './interactions/magnetic.js';
import { initCellar } from './cellar.js';

function destroyPage() {
  resetPage();   // aborta listeners, corre cleanups y revierte el gsap.context de la página
  resetHero();
  document.body.classList.remove('scroll-lock');
  if (lenis) lenis.start(); // la galería lo deja parado
}

function initPage() {
  initHero();
  initReveals();
  initMediaBlooms();
  initMenuStem();
  initParallax();
  initShowcase();
  initMagnetic();

  /* galería: el motor 3D solo se descarga en páginas que lo usan.
     La generación evita inicializar sobre un DOM ya intercambiado
     si el usuario navega antes de que resuelva el import. */
  if (document.getElementById('galStage')) {
    const gen = pageGeneration();
    import('./gallery.js')
      .then((m) => { if (gen === pageGeneration()) m.initGallery(); })
      .catch(() => {});
  }

  initCellar();
  bindPageAnchors();
  ScrollTrigger.refresh();
}

initNav();
initTransitions({ initPage, destroyPage });
initPage();
