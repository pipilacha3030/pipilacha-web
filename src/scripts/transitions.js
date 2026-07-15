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
import { setMenu, isMenuOpen, onScroll, seizeMenuTimeline } from './nav.js';
import { trackPageView } from './analytics.js';

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

  // idioma de un pathname (español en la raíz, inglés bajo /en/)
  const localeOf = (p) => (p === '/en' || p.startsWith('/en/')) ? 'en' : 'es';

  // URL interna navegable de un <a>, o null si no procede interceptar
  const internalUrl = (a) => {
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || a.hasAttribute('download')) return null;
    if (!href.startsWith('/') || href.startsWith('//')) return null;
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname) return null;
    // cambio de idioma → carga completa: nav/pie/cookies viven fuera de <main>
    // y el router solo intercambia <main>; recargar los repinta en el idioma nuevo
    if (localeOf(url.pathname) !== localeOf(location.pathname)) return null;
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

  /* ---- transición B: el dock se traga la página ----
     Solo para clics nacidos DENTRO del dock (menú, CTA, logo): el propio
     cristal se expande a pantalla completa (densificado al 90% por
     .is-page-morph para enmascarar el swap), la página cambia tras él y
     la cápsula se contrae ya en la página nueva. Si el menú estaba abierto,
     seizeMenuTimeline() (nav.js) mata su timeline y este morph parte de los
     estilos inline vivos del panel — sin saltos. */
  const navEl = document.querySelector('.nav');
  const dockEl = document.getElementById('navDock');
  const menuEl = document.getElementById('navMenu');
  const scrimEl = document.getElementById('navScrim');
  const dockChrome = [document.getElementById('burger'), document.querySelector('.nav__logo'), document.querySelector('.nav__cta')].filter(Boolean);
  let navPad = '0px'; // gutter capturado al cubrir, devuelto al contraer

  const coverDockAsync = () => new Promise((done) => {
    navPad = getComputedStyle(navEl).paddingLeft;
    dockEl.classList.add('is-page-morph', 'is-morphing');
    gsap.timeline({ onComplete: done, defaults: { overwrite: 'auto' } })
      // el scrim viaja aquí: seizeMenuTimeline() lo deja congelado a media
      // opacidad (mata el timeline del menú SIN limpieza) y nadie más lo apaga
      .to([menuEl, scrimEl, ...dockChrome], { autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0)
      // curva más suave (power2.inOut, sin el acelerón central de power4) y algo
      // más corta: el estiramiento del cristal se siente fluido, no brusco
      .to(navEl, { top: 0, paddingLeft: 0, paddingRight: 0, duration: 0.58, ease: 'power2.inOut' }, 0)
      .to(dockEl, {
        maxWidth: '100vw', height: () => window.innerHeight, borderRadius: 0,
        duration: 0.58, ease: 'power2.inOut'
      }, 0);
  });

  const revealDockAsync = () => new Promise((done) => {
    const mainEl = document.querySelector('main');
    gsap.set(mainEl, { clearProps: 'transform,opacity,visibility' }); // la página nueva espera lista bajo el cristal
    // FLIP: altura natural de la píldora en este viewport (el menú es absoluto, no suma)
    const prevH = dockEl.style.height;
    dockEl.style.height = 'auto';
    const pillH = dockEl.offsetHeight;
    dockEl.style.height = prevH;
    gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        dockEl.classList.remove('is-page-morph', 'is-morphing');
        gsap.set(dockEl, { clearProps: 'maxWidth,height,borderRadius' });
        gsap.set(navEl, { clearProps: 'top,paddingLeft,paddingRight' });
        gsap.set([menuEl, scrimEl, ...dockChrome], { clearProps: 'all' });
        gsap.set(menuEl.querySelectorAll('.nav__menu-list a, .nav__menu-meta > div'), { clearProps: 'all' });
        done();
      }
    })
      // contracción con la misma curva suave y algo más corta que antes.
      // OJO '680px' CON unidad: el inline vigente es '100vw' y un 680 desnudo
      // hereda esa unidad (¡680vw!) — el ancho no animaba y el clearProps
      // final lo soltaba de golpe (el "salto" al recogerse)
      .to(dockEl, { height: pillH, maxWidth: '680px', borderRadius: 50, duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(navEl, { top: 24, paddingLeft: navPad, paddingRight: navPad, duration: 0.6, ease: 'power2.inOut' }, 0)
      .to(dockChrome, { autoAlpha: 1, duration: 0.32, ease: 'power2.out' }, 0.3);
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

    // CSS por página (estilos de componente, p. ej. «Primera fila» en la home):
    // el router solo intercambia <main> y no toca el <head>, así que las hojas
    // que la página nueva enlaza y este documento aún no tiene se añaden aquí
    // (los <link> se acumulan entre navegaciones: son pocos, cacheados e inertes)
    doc.querySelectorAll('link[rel="stylesheet"]').forEach((lnk) => {
      const href = lnk.getAttribute('href');
      if (href && !document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
        const s = document.createElement('link');
        s.rel = 'stylesheet';
        s.href = href;
        document.head.appendChild(s);
      }
    });

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

    // GA4 no ve las transiciones SPA (no hay recarga): la vista se envía a mano.
    // Solo hace algo con consentimiento de analítica y GA_ID configurado.
    trackPageView();
  };

  const transition = async (url, push, viaDock = false) => {
    if (isTransitioning) return;
    isTransitioning = true;
    if (isMenuOpen()) setMenu(false);
    // B: el clic en un enlace del menú ya disparó setMenu(false) (listener del
    // propio <a> en nav.js) — se mata su timeline y el morph parte de ahí
    if (viaDock) seizeMenuTimeline();
    if (lenis) lenis.stop();
    try {
      const [text] = await Promise.all([fetchPage(url), viaDock ? coverDockAsync() : coverAsync()]);
      swapDoc(text, url, push);
      // el prefetch trae el HTML pero no las imágenes: decodificar el hero de
      // la página nueva A MITAD de la contracción congelaba un frame (~200ms).
      // Se decodifican las primeras imágenes bajo el cristal aún cerrado, con
      // tope de 400 ms para no alargar la transición en redes lentas.
      await Promise.race([
        Promise.all(Array.from(document.querySelectorAll('main img:not([loading="lazy"])'), (im) =>
          im.decode ? im.decode().catch(() => {}) : Promise.resolve()).slice(0, 5)),
        new Promise((r) => setTimeout(r, 400)),
      ]);
      // dos frames de cortesía: el primer layout+raster de la página nueva
      // (caro en páginas densas como la galería) sucede bajo el cristal
      // estático, no en el primer frame de la contracción
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await (viaDock ? revealDockAsync() : revealAsync());
      // la galería gobierna su propio scroll: no reactivar Lenis sobre ella
      if (lenis && !document.getElementById('galStage')) lenis.start();
      isTransitioning = false;
    } catch (err) {
      console.warn('[transitions] red de seguridad → navegación clásica:', err);
      window.location.href = url.href;
    }
  };

  // interceptar enlaces internos; los nacidos en el dock usan la transición B
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) return;
    const url = internalUrl(a);
    if (!url) return;
    e.preventDefault();
    transition(url, true, !!a.closest('#navDock'));
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
