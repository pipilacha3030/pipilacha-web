/* ============================================================
   PIPILACHA · interacción
   Lenis (scroll suave) + GSAP ScrollTrigger (revelados, parallax)
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Resiliencia: el gate .js oculta los .reveal a la espera de GSAP. Si GSAP no cargó
   (red, CDN, bloqueo), quitamos el gate para que el contenido no quede invisible. */
if (!window.gsap) document.documentElement.classList.remove('js');

let showcaseTl = null; // timeline del Despertar (clip-path), en bucle mientras la tarjeta está en pantalla

/* ---------- hero: entrada cinematográfica (título tras máscara + zoom de cámara) ---------- */
let heroPlayed = false;

function playHero() {
  if (heroPlayed || !window.gsap || reduceMotion) return;
  // el hero solo existe en el Inicio: sin él, no lanzar tweens (evita warnings de GSAP en páginas internas)
  if (!document.querySelector('.hero__media img')) return;
  heroPlayed = true;
  // y:0 limpia el translateY(110%) que GSAP interpreta como px; el reveal lo mueve solo por yPercent
  // acercamiento de cámara: la foto se asienta desde un leve zoom
  gsap.fromTo('.hero__media img',
    { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' });
  // vida ambiente: tras asentarse, el plano respira muy lento (cinematográfico, no Ken-Burns agresivo)
  gsap.to('.hero__media img', {
    scale: 1.05, yPercent: -1.5, duration: 16, ease: 'sine.inOut',
    repeat: -1, yoyo: true, delay: 1.8
  });
  // el título sube tras su máscara
  gsap.fromTo('.hero__title .reveal-mask',
    { yPercent: 110, y: 0 },
    { yPercent: 0, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
  document.querySelectorAll('.hero [data-delay]').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.dataset.delay) + 0.1 });
  });
}

/* ---------- nav: fondo al hacer scroll + menú móvil ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');

const setMenu = (open) => {
  links.classList.toggle('open', open);
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('scroll-lock', open);
  if (window.lenis) open ? window.lenis.stop() : window.lenis.start();
};
burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
// Esc cierra el menú y devuelve el foco al botón (accesibilidad de teclado)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); burger.focus(); }
});

/* ---------- la libélula levanta el vuelo al pulsarla ---------- */
/* feedback de marca al presionar el isotipo: aletea y se eleva. En el Inicio (misma
   página, el enlace no navega) además sube arriba con scroll suave. */
const navLogo = document.querySelector('.nav__logo');
if (navLogo) {
  navLogo.addEventListener('click', e => {
    navLogo.classList.remove('is-flying');
    void navLogo.offsetWidth;               // reinicia la animación en cada pulsación
    navLogo.classList.add('is-flying');
    navLogo.addEventListener('animationend', () => navLogo.classList.remove('is-flying'), { once: true });
    const atHome = location.pathname === '/' || location.pathname === '';
    if (atHome) {
      e.preventDefault();
      if (window.lenis) window.lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* ---------- Lenis: scroll suave ---------- */
let lenis;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ duration: 0.9, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  window.lenis = lenis; // expuesto para depuración
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // anclas suaves
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: 0 }); }
    });
  });
}

/* barra fija de reserva: aparece tras el primer scroll (solo móvil, vía CSS) */
const reservaBar = document.getElementById('reservaBar');

/* nav background toggle (umbral pequeño si la nav ya es sólida) */
const onScroll = y => {
  const threshold = nav.classList.contains('nav--solid') ? 10 : window.innerHeight * 0.6;
  nav.classList.toggle('scrolled', y > threshold);
  if (reservaBar) reservaBar.classList.toggle('is-visible', y > window.innerHeight * 0.5);
};
if (lenis) lenis.on('scroll', e => onScroll(e.scroll));
else window.addEventListener('scroll', () => onScroll(window.scrollY));

/* ============================================================
   GSAP
   ============================================================ */
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // sincroniza ScrollTrigger con Lenis
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ── transición entre páginas: cortina de marca (cols + libélula) ── */
  const pt = document.getElementById('pageTransition');
  if (pt) {
    const ptMark = pt.querySelector('.page-transition__mark');
    const hidePT = () => { pt.style.visibility = 'hidden'; pt.style.opacity = '0'; pt.style.pointerEvents = 'none'; };

    // ENTRADA: la cortina olive se retira hacia arriba (wipe con clip-path); la libélula se desvanece
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

    // SALIDA: la cortina olive sube a cubrir (wipe limpio, sin rebote); la libélula aparece y navega
    const coverPage = (href) => {
      pt.style.visibility = 'visible';
      pt.style.pointerEvents = 'auto';
      gsap.set(pt, { clipPath: 'inset(100% 0 0 0)', autoAlpha: 1 });
      gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      gsap.timeline({ onComplete: () => { window.location.href = href; } })
        .to(pt, { clipPath: 'inset(0 0 0 0)', duration: 0.5, ease: 'expo.inOut' }, 0)
        .to(ptMark, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0.14);
    };

    revealPage();
    // volver con "atrás" (bfcache) restaura la cortina cubierta → revelar
    window.addEventListener('pageshow', e => { if (e.persisted) revealPage(); });

    // interceptar enlaces internos para encadenar salida → entrada
    if (!reduceMotion) {
      document.addEventListener('click', e => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('#')) return;
        const url = new URL(href, location.href);
        if (url.pathname === location.pathname) return; // misma página: no cubrir
        e.preventDefault();
        if (lenis) lenis.stop();
        coverPage(url.href);
      });
    }
  }

  // anima el hero en cuanto carga
  playHero();

  if (!reduceMotion) {
    /* reveal genérico */
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero')) return; // el hero ya se anima arriba
      if (el.matches('.barra__media')) return; // tiene reveal editorial propio
      if (el.closest('[data-reveal-stagger]')) return; // lo anima su grupo en cascada
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    /* reveal en cascada: grupos (tarjetas, pasos) entran escalonados como una unidad */
    gsap.utils.toArray('[data-reveal-stagger]').forEach(group => {
      const items = group.querySelectorAll('.reveal');
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 84%' }
      });
    });


    /* reveal de TITULAR (.reveal-head): cortina clip-path de abajo arriba + leve
       subida, sin rebote. Funciona con titulares de varias líneas (a diferencia de
       una máscara por línea) y enriquece un texto que ya es visible sin JS. */
    gsap.utils.toArray('.reveal-head').forEach(el => {
      const from = { clipPath: 'inset(0 0 100% 0)', y: 22 };
      // clip-path:none anula la regla CSS oculta y no recorta la sombra del titular
      const to = { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, ease: 'expo.out',
        onComplete: () => gsap.set(el, { clipPath: 'none', clearProps: 'transform' }) };
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        // sobre el pliegue: revelar al cargar (no depende del scroll)
        gsap.fromTo(el, from, { ...to, delay: 0.15 });
      } else {
        // bajo el pliegue: revelar al entrar en pantalla
        gsap.fromTo(el, from, { ...to, scrollTrigger: { trigger: el, start: 'top 88%' } });
      }
    });

    /* HERO: salida cinematográfica ligada al scroll — el contenido sube y se disuelve
       mientras la foto sigue su parallax; traspaso limpio a la sección siguiente. */
    const heroEl = document.querySelector('.hero');
    if (heroEl && heroEl.querySelector('.hero__content')) {
      gsap.to(heroEl.querySelector('.hero__content'), {
        yPercent: -24, autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* MENÚ: el "tallo" — una línea fina que se dibuja de arriba abajo junto a los 15
       pases según se recorre la lista (la flor que crece). Decorativo, con fallback. */
    const stem = document.querySelector('.pases__stem');
    if (stem) {
      gsap.fromTo(stem, { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top',
        scrollTrigger: { trigger: '.pases', start: 'top 78%', end: 'bottom 82%', scrub: true }
      });
    }

    /* despertar de las flores: 4 imágenes superpuestas que se revelan en bucle
       (Timeline + clip-path), en marcha mientras la tarjeta está en pantalla. */
    const showcase = document.querySelector('.showcase');
    if (showcase) {
      const sLayers = gsap.utils.toArray(showcase.querySelectorAll('.showcase__layer'));
      if (sLayers.length) {
        // base: todas reveladas; la primera capa arriba (df-esparrago, la que se ve en reposo)
        gsap.set(sLayers, { clipPath: 'inset(0 0% 0 0)', zIndex: i => sLayers.length - i });
        showcaseTl = gsap.timeline({
          repeat: -1, repeatDelay: 0.6, defaults: { ease: 'power2.inOut' }, paused: true,
          onRepeat: () => {
    /* pre-oculta todas las capas excepto la última (queda de fondo) para que
       cuando la capa 0 suba de z-index no flash 1 frame con clipPath visible */
    gsap.set(sLayers, { zIndex: 1, clipPath: 'inset(0 100% 0 0)' });
    gsap.set(sLayers[sLayers.length - 1], { clipPath: 'inset(0 0% 0 0)' });
  }
        });
        const isMobile = window.matchMedia('(max-width:768px)').matches;
        const scaleFrom = isMobile ? 1.06 : 1.12;
        sLayers.forEach((layer, i) => {
          const img = layer.querySelector('img');
          showcaseTl.set(layer, { zIndex: 10 + i }, i === 0 ? 0 : '+=0.8')
            .fromTo(layer, { clipPath: 'inset(0 100% 0 0)' },
              { clipPath: 'inset(0 0% 0 0)', duration: 3, immediateRender: false }, '<')
            .fromTo(img, { scale: scaleFrom },
              { scale: 1, duration: 3.4, ease: 'power1.out', immediateRender: false }, '<');
        });
        ScrollTrigger.create({
          trigger: showcase, start: 'top 85%', end: 'bottom top',
          onToggle: ({ isActive }) => isActive ? showcaseTl.play() : showcaseTl.pause()
        });
      }
    }

    /* ── IMÁGENES: "bloom" — la foto se enfoca como una flor abriéndose
       (fundido + zoom que se asienta + desenfoque que se aclara) ── */
    [
      { wrap: '.quienes__visual', img: '.quienes__media img' },
      { wrap: '.barra__media',    img: '.barra__media img'  },
    ].forEach(({ wrap: wSel, img: iSel }) => {
      const wrap = document.querySelector(wSel);
      const img  = document.querySelector(iSel);
      if (!wrap) return;
      gsap.set(wrap, { autoAlpha: 0, y: 0 });
      if (img) gsap.set(img, { scale: 1.08, filter: 'blur(8px)' });
      gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
        // sin blur residual: evita dejar una capa de composición viva tras la entrada
        onComplete: () => { if (img) gsap.set(img, { clearProps: 'filter' }); }
      })
      .to(wrap, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, 0)
      .to(img,  { scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' }, 0);
    });


    /* parallax CENTRADO: a mitad de recorrido (incluido el scroll 0 del hero)
       el desplazamiento es 0, así nunca se ve el fondo por arriba ni por abajo */
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const amt = parseFloat(el.dataset.parallax);
      gsap.fromTo(el,
        { yPercent: () => -amt * 50 },
        {
          yPercent: () => amt * 50, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    /* botones magnéticos: el botón se inclina hacia el cursor y vuelve suave (sin muelle) */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll('.btn, .nav__cta').forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * 0.28,
            y: (e.clientY - r.top - r.height / 2) * 0.38,
            duration: 0.4, ease: 'power3.out'
          });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
        });
      });
    }

    /* ── PRENSA: filas editoriales con reveal de clip-path ── */
    const pressRows = gsap.utils.toArray('.press-row');
    if (pressRows.length) {
      pressRows.forEach(row => {
        gsap.fromTo(row,
          { opacity: 0, y: 42, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' } });
      });
    }
    /* ── VINOS: la flor de cada familia "florece" al llegar a su sección (sin rebote) ── */
    gsap.utils.toArray('.wine-cat__flor').forEach(flor => {
      gsap.fromTo(flor,
        { opacity: 0, scale: 0.9, rotation: -6 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: flor.closest('.wine-cat'), start: 'top 78%' } });
    });

  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  ScrollTrigger.refresh();
}

/* ============================================================
   GALERÍA: escenario 3D inmersivo (coverflow + fondo floral reactivo)
   Patrón de movimiento adaptado del "3D gradient carousel" (Codrops):
   nuestras fotos y nuestra paleta. Ajusta el "feel" desde el objeto CFG.
   ============================================================ */
(() => {
  const stage = document.getElementById('galStage');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.gal-card'));
  const data = cards.map(c => { const img = c.querySelector('img'); return { src: img.src, alt: img.alt }; });
  let galPaused = false;

  /* ---- lightbox (independiente del motor: sirve también al fallback) ---- */
  const lightbox = document.getElementById('lightbox');
  const lb = {
    img: document.getElementById('lbImg'), cap: document.getElementById('lbCap'),
    close: document.getElementById('lbClose'), prev: document.getElementById('lbPrev'),
    next: document.getElementById('lbNext'), cur: 0, lastFocus: null,
  };
  const lbShow = i => {
    lb.cur = (i + data.length) % data.length;
    lb.img.src = data[lb.cur].src; lb.img.alt = data[lb.cur].alt; lb.cap.textContent = data[lb.cur].alt;
  };
  const openLb = i => {
    if (!lightbox) return;
    lb.lastFocus = document.activeElement;
    lbShow(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
    galPaused = true;                 // congela el motor mientras se ve la foto ampliada
    if (window.lenis) window.lenis.stop();
    lb.close.focus();
  };
  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
    galPaused = false;
    if (lb.lastFocus) lb.lastFocus.focus();
  };
  if (lightbox) {
    lb.close.addEventListener('click', closeLb);
    lb.prev.addEventListener('click', () => lbShow(lb.cur - 1));
    lb.next.addEventListener('click', () => lbShow(lb.cur + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') lbShow(lb.cur - 1);
      else if (e.key === 'ArrowRight') lbShow(lb.cur + 1);
    });
  }

  /* ---- sin motor (reduced-motion): tira desplazable + clic abre lightbox ---- */
  if (reduceMotion) {
    cards.forEach((c, i) => c.querySelector('.gal-card__btn').addEventListener('click', () => openLb(i)));
    return;
  }

  /* ============================================================
     MOTOR — todos los valores de movimiento viven aquí (ajusta el feel)
     ============================================================ */
  const CFG = {
    friction:   0.9,    // decaimiento de la velocidad por frame (0-1)
    wheelSens:  0.30,   // sensibilidad de la rueda
    dragSens:   1.0,    // sensibilidad del arrastre
    maxRot:     28,     // giro máx. en Y (grados)
    maxDepth:   140,    // profundidad Z máx. (px)
    minScale:   0.92,   // escala en los bordes
    scaleRange: 0.10,   // escala extra al centrarse (→ 1.02 en el centro)
    gap:        28,     // separación entre tarjetas (px)
    autoDrift:  0.40,   // deriva lenta en reposo (px/frame)
    idleDelay:  2800,   // ms de inactividad antes de volver la deriva
    colorLerp:  0.055,  // suavizado del fondo hacia el color de la foto centrada
    farBlur:    3,      // desenfoque de las tarjetas lejanas (px)
  };

  const track = document.getElementById('galTrack');
  const canvas = document.getElementById('galBg');
  const ctx = canvas.getContext('2d');
  const idxEl = document.getElementById('galIdx');
  const N = cards.length;
  const CREAM = [244, 239, 230]; // --cream

  let unit = 0, trackW = 0, vwHalf = 0, cardW = 0;
  let pos = 0, vel = 0, centerIdx = -1, startT = 0;
  let dragging = false, moved = 0, lastX = 0, lastMove = 0, downIdx = -1;
  let lastInteract = performance.now();

  stage.classList.add('is-carousel');    // conmuta el CSS a modo 3D absoluto

  function measure() {
    cardW = cards[0].offsetWidth || Math.min(window.innerWidth * 0.26, 360);
    unit = cardW + CFG.gap;
    trackW = unit * N;
    vwHalf = window.innerWidth / 2;
    canvas.width = Math.max(2, Math.round(window.innerWidth * 0.6));
    canvas.height = Math.max(2, Math.round(window.innerHeight * 0.6));
  }
  measure();

  /* --- paleta: color dominante (pesan más los píxeles con saturación → las flores) --- */
  const palettes = new Array(N).fill(null);
  function extractPalette(img, i) {
    try {
      const c = document.createElement('canvas');
      const r = Math.min(48 / img.naturalWidth, 48 / img.naturalHeight) || 1;
      c.width = Math.max(1, Math.round(img.naturalWidth * r));
      c.height = Math.max(1, Math.round(img.naturalHeight * r));
      const cx = c.getContext('2d');
      cx.drawImage(img, 0, 0, c.width, c.height);
      const d = cx.getImageData(0, 0, c.width, c.height).data;
      let rV = 0, gV = 0, bV = 0, wV = 0;
      for (let p = 0; p < d.length; p += 4) {
        const R = d[p], G = d[p + 1], B = d[p + 2];
        const sat = Math.max(R, G, B) - Math.min(R, G, B);
        const w = sat * sat + 24;      // +24: el tono aún cuenta algo en fotos neutras
        rV += R * w; gV += G * w; bV += B * w; wV += w;
      }
      palettes[i] = [rV / wV, gV / wV, bV / wV];
    } catch (e) { palettes[i] = null; }
  }
  cards.forEach((card, i) => {
    const img = card.querySelector('img');
    const run = () => extractPalette(img, i);
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
  });

  /* --- fondo: dos radiales que florecen con el color del plato centrado --- */
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
  let colA = CREAM.slice(), colB = CREAM.slice(), tgtA = CREAM.slice(), tgtB = CREAM.slice();
  function setTarget(i) {
    const p = palettes[i];
    if (!p) { tgtA = CREAM.slice(); tgtB = CREAM.slice(); return; }
    tgtA = mix(p, CREAM, 0.42);           // bloom principal, atenuado hacia la crema
    tgtB = mix(p, [255, 253, 248], 0.60); // halo más claro
  }
  let bgTick = 0;
  function renderBg(t) {
    if (bgTick++ & 1) return;             // ~30fps para el fondo
    colA = mix(colA, tgtA, CFG.colorLerp);
    colB = mix(colB, tgtB, CFG.colorLerp);
    const W = canvas.width, H = canvas.height;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = rgba(CREAM, 1); ctx.fillRect(0, 0, W, H);
    const x1 = W * (0.5 + 0.18 * Math.sin(t * 0.00013)), y1 = H * (0.42 + 0.16 * Math.cos(t * 0.00017));
    let g = ctx.createRadialGradient(x1, y1, 0, x1, y1, H * 0.95);
    g.addColorStop(0, rgba(colA, 0.9)); g.addColorStop(1, rgba(CREAM, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const x2 = W * (0.5 - 0.2 * Math.cos(t * 0.00011)), y2 = H * (0.6 + 0.2 * Math.sin(t * 0.00015));
    g = ctx.createRadialGradient(x2, y2, 0, x2, y2, H * 0.85);
    g.addColorStop(0, rgba(colB, 0.72)); g.addColorStop(1, rgba(CREAM, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  /* --- coloca cada tarjeta según su distancia al centro (bucle infinito) --- */
  function layout(t) {
    if (!startT) startT = t;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - startT) / 900), 3); // entrada easeOutCubic
    const lift = (1 - ease) * 46;

    vel *= CFG.friction;
    pos += vel;
    if (!dragging && (performance.now() - lastInteract) > CFG.idleDelay && Math.abs(vel) < 0.05)
      pos += CFG.autoDrift;              // deriva serena cuando nadie toca
    if (Math.abs(vel) < 0.001) vel = 0;

    let best = Infinity, bestI = 0;
    for (let i = 0; i < N; i++) {
      let x = i * unit - pos;
      x = ((x % trackW) + trackW) % trackW;
      if (x > trackW / 2) x -= trackW;   // offset del centro de la tarjeta al centro del viewport
      const norm = Math.max(-1, Math.min(1, x / vwHalf));
      const inv = 1 - Math.abs(norm);
      const tz = inv * CFG.maxDepth;
      const card = cards[i];
      card.style.transform =
        `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${lift.toFixed(1)}px),${tz.toFixed(1)}px)` +
        ` rotateY(${(-norm * CFG.maxRot).toFixed(2)}deg) scale(${(CFG.minScale + inv * CFG.scaleRange).toFixed(3)})`;
      card.style.zIndex = 1000 + Math.round(tz);
      card.style.opacity = (ease * (0.5 + inv * 0.5)).toFixed(3);
      const f = Math.abs(x) > cardW * 1.7 ? `blur(${CFG.farBlur}px)` : '';
      if (card.dataset.f !== f) { card.style.filter = f; card.dataset.f = f; }
      const ax = Math.abs(x);
      if (ax < best) { best = ax; bestI = i; }
    }
    if (bestI !== centerIdx) {
      centerIdx = bestI;
      setTarget(bestI);
      if (idxEl) idxEl.textContent = String(bestI + 1).padStart(2, '0');
    }
  }

  function frame(t) {
    if (!galPaused) { layout(t); renderBg(t); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* --- interacción: rueda + arrastre (ratón/táctil) + teclado --- */
  if (window.lenis) window.lenis.stop();  // esta página no hace scroll vertical

  stage.addEventListener('wheel', e => {
    if (galPaused) return;
    e.preventDefault(); e.stopPropagation();
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 16;       // deltas en líneas → normaliza a px
    vel += d * CFG.wheelSens;
    lastInteract = performance.now();
  }, { passive: false });

  stage.addEventListener('pointerdown', e => {
    if (galPaused) return;
    dragging = true; moved = 0; lastX = e.clientX; lastMove = 0; vel = 0;
    stage.classList.add('is-dragging');
    if (stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (_) {} }
    const card = e.target.closest('.gal-card');
    downIdx = card ? cards.indexOf(card) : -1;
    lastInteract = performance.now();
  });
  stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    moved += Math.abs(dx); lastMove = dx;
    pos -= dx * CFG.dragSens;
    lastInteract = performance.now();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; stage.classList.remove('is-dragging');
    vel = -lastMove * CFG.dragSens * 1.4;         // inercia al soltar
    lastInteract = performance.now();
    if (moved < 6 && downIdx >= 0) openLb(downIdx); // apenas se movió → tap → ampliar
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { vel -= unit * 0.16; lastInteract = performance.now(); }
    else if (e.key === 'ArrowRight') { vel += unit * 0.16; lastInteract = performance.now(); }
  });
  // Enter/Espacio sobre una tarjeta enfocada (click de teclado → detail 0) amplía sin duplicar el tap
  cards.forEach((card, i) => {
    card.querySelector('.gal-card__btn').addEventListener('click', e => { if (e.detail === 0) openLb(i); });
  });

  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measure, 150); });
})();

/* ============================================================
   VINOS: índice pegajoso (scrollspy) + scroll suave por sección
   ============================================================ */
const cellar = document.querySelector('.cellar');
if (cellar) {
  const links = Array.from(cellar.querySelectorAll('.cellar-index a'));
  const sections = links.map(a => document.getElementById(a.dataset.spy)).filter(Boolean);
  const setActive = id => links.forEach(a => a.classList.toggle('is-active', a.dataset.spy === id));

  // marca la sección visible mientras se hace scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  // clic en el índice: lleva a la sección con el scroll suave de Lenis
  links.forEach(a => a.addEventListener('click', e => {
    const target = document.getElementById(a.dataset.spy);
    if (!target) return;
    e.preventDefault();
    setActive(a.dataset.spy);
    if (window.lenis) window.lenis.scrollTo(target, { offset: -110 });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  if (sections[0]) setActive(sections[0].id);
}
