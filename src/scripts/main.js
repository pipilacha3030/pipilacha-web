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
import { initSplitReveal } from './animations/splitReveal.js';
import { initMediaBlooms } from './animations/media.js';
import { initMenuStem } from './animations/menu.js';
import { initParallax } from './animations/parallax.js';
import { initShowcase } from './animations/showcase.js';
import { initInterlude } from './animations/interlude.js';
import { initPrimeraFila } from './animations/primeraFila.js';
import { initHeroQuienes } from './animations/heroQuienesScroll.js';
import { initReviews } from './animations/reviews.js';
import { initMagnetic } from './interactions/magnetic.js';
import { initCellar } from './cellar.js';
import { initMaridajePopup } from './maridajePopup.js';
import { initCookies, applyWidgetConsent } from './cookies.js';
import { initConversions } from './conversions.js';

function destroyPage() {
  resetPage();   // aborta listeners, corre cleanups y revierte el gsap.context de la página
  resetHero();
  document.body.classList.remove('scroll-lock');
  if (lenis) lenis.start(); // la galería lo deja parado
}

function initPage() {
  initHero();
  initReveals();
  initSplitReveal();
  initMediaBlooms();
  initMenuStem();
  initParallax();
  const showcase = initShowcase();
  initInterlude();
  initPrimeraFila();
  initHeroQuienes(showcase);
  initReviews();
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
  initMaridajePopup();
  initConversions();    // ANTES de applyWidgetConsent: ata el load del iframe antes de que se le ponga src
  applyWidgetConsent(); // el <main> se intercambia: re-gatea el widget de TheFork según consentimiento
  bindPageAnchors();
  ScrollTrigger.refresh();

  /* en la carga fría (primera visita) las fuentes auto-alojadas aún pueden
     estar aplicándose cuando corre el refresh() de arriba: el texto crece/
     encoge (Marcellus/Hanken vs. la fuente de reserva) y desplaza el layout
     unos px por debajo del pliegue, dejando el punto de disparo de los
     ScrollTrigger (p. ej. las reseñas) calculado sobre una posición ya
     obsoleta. Un refresh de cortesía cuando las fuentes asientan corrige
     ese desfase sin tocar nada más. */
  const gen = pageGeneration();
  document.fonts.ready.then(() => { if (gen === pageGeneration()) ScrollTrigger.refresh(); });
}

initNav();
initCookies(); // una vez: banner/diálogo viven fuera de <main>, persisten entre transiciones
initTransitions({ initPage, destroyPage });
initPage();
