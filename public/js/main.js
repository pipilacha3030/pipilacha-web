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

    /* ── IMÁGENES: cortina editorial de abajo arriba + zoom suave (estilo Geranium) ── */
    [
      { wrap: '.quienes__visual', img: '.quienes__media img' },
      { wrap: '.barra__media',    img: '.barra__media img'  },
    ].forEach(({ wrap: wSel, img: iSel }) => {
      const wrap = document.querySelector(wSel);
      const img  = document.querySelector(iSel);
      if (!wrap) return;
      gsap.set(wrap, { clipPath: 'inset(0 0 100% 0)', opacity: 1, y: 0 });
      if (img) gsap.set(img, { scale: 1.12 });
      gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
        onComplete: () => gsap.set(wrap, { clearProps: 'clipPath' })
      })
      .to(wrap, { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .to(img,  { scale: 1, duration: 2.0, ease: 'power2.out' }, 0);
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
   GALERÍA: cardumen (GSAP ScrollTrigger horizontal + escala 3D)
   ============================================================ */
const galFlow = document.querySelector('.gal-flow');
if (galFlow && window.gsap && !reduceMotion && window.matchMedia('(min-width:901px)').matches) {
  const strip = document.getElementById('galStrip');
  const cards = gsap.utils.toArray('.gal-flow__card');

  /* Estado inicial: rotación + escala pequeña */
  cards.forEach((card, i) => {
    gsap.set(card, { rotation: parseFloat(card.dataset.rot || 0), scale: 0.52, opacity: 0.72, zIndex: i + 1 });
  });

  /* Panorámica horizontal principal — sticky CSS, sin pin GSAP */
  const panTween = gsap.fromTo(strip,
    { x: 0 },
    {
      x: () => -(strip.offsetWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: galFlow,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        invalidateOnRefresh: true,
      }
    }
  );

  /* Escala + z-index dinámicos: cada card crece al centrarse y sube al frente */
  cards.forEach((card, i) => {
    /* fase entrada: escala sube, z-index sube */
    gsap.fromTo(card,
      { scale: 0.52, opacity: 0.72, zIndex: i + 1 },
      { scale: 1.22, opacity: 1,    zIndex: 50,
        ease: 'sine.out',
        scrollTrigger: {
          containerAnimation: panTween,
          trigger: card,
          start: 'left right',
          end: 'center center',
          scrub: true,
        }
      }
    );
    /* fase salida: escala baja, z-index baja */
    gsap.fromTo(card,
      { scale: 1.22, opacity: 1,    zIndex: 50 },
      { scale: 0.52, opacity: 0.72, zIndex: i + 1,
        ease: 'sine.in',
        scrollTrigger: {
          containerAnimation: panTween,
          trigger: card,
          start: 'center center',
          end: 'right left',
          scrub: true,
        }
      }
    );
  });
}

/* ============================================================
   LIGHTBOX (galería)
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const items = Array.from(document.querySelectorAll('.gal-flow__card'));
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const data = items.map(btn => { const img = btn.querySelector('img'); return { src: img.src, alt: img.alt }; });
  let current = 0;
  let lastFocus = null;

  const show = i => {
    current = (i + data.length) % data.length;
    lbImg.src = data[current].src;
    lbImg.alt = data[current].alt;
    lbCap.textContent = data[current].alt;
  };
  const openLb = i => {
    lastFocus = document.activeElement;
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock'); // bloqueo de scroll mientras el lightbox está abierto
    if (window.lenis) window.lenis.stop();
    lbClose.focus();
  };
  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
    if (window.lenis) window.lenis.start();
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((btn, i) => btn.addEventListener('click', () => openLb(i)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}

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
