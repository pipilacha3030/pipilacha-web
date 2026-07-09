/* ============================================================
   TRANSICIÓN ASÍNCRONA ENTRE PÁGINAS (fetch + swap, sin recarga)
   El enlace se intercepta, el HTML llega en paralelo a la cortina
   (o ya está aquí por el prefetch al posar el puntero), <main> se
   cambia bajo cubierta y la cortina sigue su camino hacia arriba:
   un solo gesto. La libélula cruza la pantalla como firma.
   initPage/destroyPage llegan por inyección desde main.js (evita
   una dependencia circular con el orquestador).
   ============================================================ */
import { gsap } from './scroll/scrollTrigger.js';
import { lenis } from './scroll/lenis.js';
import { reduceMotion } from './utils/motion.js';
import { setMenu, isMenuOpen, onScroll } from './nav.js';

export function initTransitions({ initPage, destroyPage }) {
  const pt = document.getElementById('pageTransition');
  if (!pt) return;

  const ptMark = pt.querySelector('.page-transition__mark');
  pt.style.animation = 'none'; // JS vivo: desactiva el salvavidas CSS (ptSafety)
  const hidePT = () => { pt.style.visibility = 'hidden'; pt.style.opacity = '0'; pt.style.pointerEvents = 'none'; };

  // ENTRADA (carga completa o bfcache): la cortina se retira hacia arriba
  const revealPage = () => {
    if (reduceMotion) { hidePT(); return; }
    pt.style.visibility = 'visible';
    pt.style.opacity = '1';
    gsap.set(pt, { clipPath: 'inset(0 0 0 0)' });
    gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 1 });
    gsap.timeline({ onComplete: hidePT })
      .to(ptMark, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0)
      .to(pt, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' }, 0.05);
  };

  revealPage();
  window.addEventListener('pageshow', (e) => { if (e.persisted) revealPage(); });

  if (reduceMotion || !window.fetch || !('DOMParser' in window)) return;

  history.scrollRestoration = 'manual'; // el scroll lo gobierna la transición
  let isTransitioning = false;
  let currentPath = location.pathname;
  const pageCache = new Map(); // pathname → HTML (lo llena el prefetch)

  const fetchPage = async (url) => {
    if (pageCache.has(url.pathname)) return pageCache.get(url.pathname);
    const res = await fetch(url.href);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    pageCache.set(url.pathname, text);
    if (pageCache.size > 10) pageCache.delete(pageCache.keys().next().value);
    return text;
  };

  // URL interna navegable de un <a>, o null si no procede interceptar
  const internalUrl = (a) => {
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || a.hasAttribute('download')) return null;
    if (!href.startsWith('/') || href.startsWith('//')) return null;
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname) return null;
    return url;
  };

  // SALIDA: la cortina cubre mientras el contenido se hunde con leve parallax
  const coverAsync = () => new Promise((done) => {
    const mainEl = document.querySelector('main');
    pt.style.visibility = 'visible';
    pt.style.pointerEvents = 'auto';
    gsap.set(pt, { clipPath: 'inset(100% 0 0 0)', autoAlpha: 1 });
    gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.timeline({ onComplete: done })
      .to(mainEl, { y: -44, autoAlpha: 0.55, duration: 0.55, ease: 'power2.in' }, 0)
      .to(pt, { clipPath: 'inset(0 0 0 0)', duration: 0.55, ease: 'expo.inOut' }, 0)
      .fromTo(ptMark, { y: 18, rotation: -5 },
        { autoAlpha: 1, y: 0, rotation: 0, duration: 0.4, ease: 'power2.out' }, 0.16);
  });

  // REVELADO: la cortina sigue hacia arriba y la página nueva se asienta
  const revealAsync = () => new Promise((done) => {
    const mainEl = document.querySelector('main');
    gsap.set(mainEl, { y: 26, autoAlpha: 0 });
    gsap.timeline({
      onComplete: () => {
        hidePT();
        gsap.set(mainEl, { clearProps: 'transform,opacity,visibility' });
        done();
      }
    })
      .to(ptMark, { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.in' }, 0.08)
      .to(pt, { clipPath: 'inset(0 0 100% 0)', duration: 0.62, ease: 'expo.inOut' }, 0.1)
      .to(mainEl, { y: 0, autoAlpha: 1, duration: 0.85, ease: 'expo.out' }, 0.22);
  });

  // aplica el documento nuevo: <main>, título, meta, nav y barra de reserva
  const swapDoc = (text, url, push) => {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const mainEl = document.querySelector('main');
    const newMain = doc.querySelector('main');
    destroyPage(); // mata triggers/tweens/motores con el DOM viejo aún vivo
    mainEl.innerHTML = newMain ? newMain.innerHTML : '';

    document.title = doc.title;
    const desc = document.querySelector('meta[name="description"]');
    const newDesc = doc.querySelector('meta[name="description"]');
    if (desc && newDesc) desc.setAttribute('content', newDesc.getAttribute('content'));

    // nav: sincroniza el enlace activo del panel de menú con la página nueva
    ['.nav__menu-list a'].forEach((sel) => {
      const fresh = doc.querySelectorAll(sel);
      document.querySelectorAll(sel).forEach((a, i) => {
        const cur = fresh[i] && fresh[i].getAttribute('aria-current');
        cur ? a.setAttribute('aria-current', cur) : a.removeAttribute('aria-current');
      });
    });

    // barra fija de reserva (no existe en /reservas/)
    const bar = document.getElementById('reservaBar');
    const newBar = doc.getElementById('reservaBar');
    if (bar && !newBar) bar.remove();
    else if (!bar && newBar) mainEl.after(newBar);

    // innerHTML no ejecuta <script> (p. ej. el iframeResizer de regala): recrearlos
    mainEl.querySelectorAll('script').forEach((old) => {
      if (old.type && old.type !== 'text/javascript' && old.type !== 'module') return; // ld+json…
      const s = document.createElement('script');
      for (const at of old.attributes) s.setAttribute(at.name, at.value);
      s.textContent = old.textContent;
      old.replaceWith(s);
    });

    if (push) history.pushState({ pipilacha: true }, '', url.href);
    currentPath = url.pathname;

    // arriba del todo sin animación y estado de la nav recalculado
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    onScroll(0);

    initPage();
  };

  const transition = async (url, push) => {
    if (isTransitioning) return;
    isTransitioning = true;
    if (isMenuOpen()) setMenu(false);
    if (lenis) lenis.stop();
    try {
      const [text] = await Promise.all([fetchPage(url), coverAsync()]);
      swapDoc(text, url, push);
      await revealAsync();
      // la galería gobierna su propio scroll: no reactivar Lenis sobre ella
      if (lenis && !document.getElementById('galStage')) lenis.start();
      isTransitioning = false;
    } catch (err) {
      window.location.href = url.href; // red de seguridad: navegación clásica
    }
  };

  // interceptar enlaces internos
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) return;
    const url = internalUrl(a);
    if (!url) return;
    e.preventDefault();
    transition(url, true);
  });

  // prefetch al posar el puntero: cuando llega el clic, la página ya está aquí
  document.addEventListener('pointerover', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const url = internalUrl(a);
    if (url && !pageCache.has(url.pathname)) fetchPage(url).catch(() => {});
  });

  // atrás/adelante del navegador (los cambios de #ancla no cuentan)
  window.addEventListener('popstate', () => {
    if (location.pathname === currentPath) return;
    if (isTransitioning) { location.reload(); return; }
    transition(new URL(location.href), false);
  });
}
