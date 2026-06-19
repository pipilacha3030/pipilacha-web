/* ============================================================
   PIPILACHA · interacción
   Lenis (scroll suave) + GSAP ScrollTrigger (revelados, parallax)
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- intro / portada disruptiva ---------- */
const intro = document.getElementById('intro');
const introAsk = document.getElementById('introAsk');
const introReply = document.getElementById('introReply');
const introLine = document.getElementById('introLine');
const introEnter = document.getElementById('introEnter');
const introWord = document.getElementById('introWord');
let heroPlayed = false;
let introNeedsGate = false;

const introReplies = {
  si: 'Hay miles. Casi ninguna se ha cocinado en serio. Empezamos por ahí.',
  no: 'Hay miles, y casi ninguna se ha cocinado en serio. Empezamos por ahí.'
};

// la última palabra de la pregunta rota entre flores y se detiene en "flores"
const introFlowers = ['violetas', 'capuchina', 'claveles', 'saúco', 'tagete', 'borraja', 'caléndula', 'begonia', 'hibiscus', 'cosmo', 'flores'];
function cycleIntroWord() {
  if (!introWord) return;
  if (reduceMotion) { introWord.textContent = 'flores'; return; }
  let i = 0;
  (function step() {
    introWord.textContent = introFlowers[i];
    introWord.classList.remove('is-in');
    void introWord.offsetWidth;
    introWord.classList.add('is-in');
    i++;
    if (i < introFlowers.length) setTimeout(step, 60 + i * 16); // rápido, frenando solo al final
  })();
}

function playHero() {
  if (heroPlayed || !window.gsap || reduceMotion) return;
  heroPlayed = true;
  // y:0 limpia el translateY(110%) que GSAP interpreta como px; el reveal lo mueve solo por yPercent
  // acercamiento de cámara: la foto se asienta desde un leve zoom
  gsap.fromTo('.hero__media img',
    { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' });
  // el título sube tras su máscara
  gsap.fromTo('.hero__title .reveal-mask',
    { yPercent: 110, y: 0 },
    { yPercent: 0, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
  document.querySelectorAll('.hero [data-delay]').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.dataset.delay) + 0.1 });
  });
}

function enterSite() {
  if (!intro) return;
  intro.classList.add('is-hidden');
  document.body.classList.remove('intro-open');
  if (window.lenis) window.lenis.start();
  playHero();
  setTimeout(() => { intro.style.display = 'none'; }, 950);
}

if (intro) {
  // la portada se muestra en cada carga del Inicio (no se recuerda entre visitas)
  introNeedsGate = true;
  document.body.classList.add('intro-open');
  intro.querySelectorAll('.intro__choice').forEach(btn => {
    btn.addEventListener('click', () => {
      introLine.textContent = introReplies[btn.dataset.answer] || introReplies.si;
      introAsk.classList.add('is-fading');
      setTimeout(() => {
        introAsk.hidden = true;
        introReply.hidden = false;
        void introReply.offsetWidth; // reflow para que transicione
        introReply.classList.remove('is-fading');
        introEnter.focus();
      }, 380);
    });
  });
  introEnter.addEventListener('click', enterSite);
  cycleIntroWord();
}

/* ---------- nav: fondo al hacer scroll + menú móvil ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  links.classList.toggle('open');
  burger.classList.toggle('is-open');
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => links.classList.remove('open'))
);

/* ---------- Lenis: scroll suave ---------- */
let lenis;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ duration: 0.9, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  window.lenis = lenis; // expuesto para depuración
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (introNeedsGate) lenis.stop(); // bloquea el scroll tras la portada

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
    const hidePT = () => { pt.style.visibility = 'hidden'; pt.style.opacity = '0'; pt.style.pointerEvents = 'none'; };

    // ENTRADA: la capa crema cubre al cargar y se desvanece (fundido suave)
    const revealPage = () => {
      if (reduceMotion) { hidePT(); return; }
      pt.style.visibility = 'visible';
      gsap.fromTo(pt, { opacity: 1 },
        { opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: hidePT });
    };

    // SALIDA: la capa crema aparece y luego navega
    const coverPage = (href) => {
      pt.style.visibility = 'visible';
      pt.style.pointerEvents = 'auto';
      gsap.fromTo(pt, { opacity: 0 },
        { opacity: 1, duration: 0.32, ease: 'power2.inOut', onComplete: () => { window.location.href = href; } });
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

  // si el visitante ya entró en esta sesión, no hay portada: anima el hero ya
  if (!introNeedsGate) playHero();

  if (!reduceMotion) {
    /* reveal genérico */
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero')) return; // el hero ya se anima arriba
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* manifiesto pinned: cada palabra se levanta en 3D (sin blur = sin tirones),
       la flor cruza por detrás. scrub más ajustado para que siga al dedo */
    if (document.querySelector('.manifesto')) {
      const mTl = gsap.timeline({
        scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=85%', pin: true, scrub: 0.5 }
      });
      // las palabras se encienden con una subida suave (sin volteo 3D)
      mTl.fromTo('.manifesto .m-word',
        { opacity: 0.22, yPercent: 16 },
        { opacity: 1, yPercent: 0, stagger: 0.12, ease: 'power2.out', duration: 1 })
        .to('.manifesto__text em',
          { scale: 1.04, ease: 'power2.out', duration: 0.4 }, '>-0.25')
        .fromTo('.manifesto__bloom',
          { yPercent: 28, rotate: -10, scale: .95 },
          { yPercent: -28, rotate: 8, scale: 1.02, ease: 'none' }, 0);
    }

    /* despertar de las flores: la foto florece desde una tarjeta centrada
       hasta pantalla completa, con la imagen empujando en profundidad */
    const sFrame = document.querySelector('.showcase__frame');
    if (sFrame) {
      const sTl = gsap.timeline({
        scrollTrigger: { trigger: '.showcase-wrap', start: 'top top', end: '+=80%', pin: true, scrub: 0.5 }
      });
      // la foto se va armando: entra desenfocada y se enfoca con el scroll
      sTl.fromTo(sFrame.querySelector('img'),
        { filter: 'blur(28px)', scale: 1.22, opacity: 0.45 },
        { filter: 'blur(0px)', scale: 1, opacity: 1, ease: 'power2.out', duration: 1 })
        .fromTo('.showcase__veil', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5)
        .fromTo('.showcase__cap',
          { opacity: 0, yPercent: 30 },
          { opacity: 1, yPercent: 0, ease: 'power3.out', duration: 0.4 }, 0.55);
    }

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

    /* zoom-out de las fotos de plato al entrar */
    gsap.utils.toArray('.course__media img').forEach(img => {
      gsap.to(img, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'top center', scrub: true }
      });
    });

    /* entrada del carrusel en cascada */
    if (document.querySelector('.carousel')) {
      gsap.from('.carousel .slide', {
        opacity: 0, y: 64, duration: 0.9, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: '.carousel', start: 'top 82%' }
      });
    }
    /* botones magnéticos: el botón se inclina hacia el cursor y vuelve elástico */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll('.btn, .nav__cta, .intro__enter, .intro__choice').forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * 0.28,
            y: (e.clientY - r.top - r.height / 2) * 0.38,
            duration: 0.4, ease: 'power3.out'
          });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
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
  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  ScrollTrigger.refresh();
}

/* ============================================================
   CARRUSEL (galería) — arrastre + inercia + parallax + progreso
   ============================================================ */
const carousel = document.querySelector('.carousel');
if (carousel) {
  const vp = carousel.querySelector('.carousel__viewport');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const bar = document.getElementById('carBar');
  const cur = document.getElementById('carCur');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
  const maxScroll = () => Math.max(0, vp.scrollWidth - vp.clientWidth);

  const update = () => {
    const max = maxScroll();
    const sl = vp.scrollLeft;
    if (bar) bar.style.width = (max > 0 ? (sl / max) * 100 : 0) + '%';
    const center = sl + vp.clientWidth / 2;
    let nearest = 0, nd = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = center - c;
      if (Math.abs(d) < nd) { nd = Math.abs(d); nearest = i; }
      if (!reduceMotion) {
        const img = s.querySelector('img');
        if (img) {
          const rel = Math.max(-1, Math.min(1, d / vp.clientWidth));
          img.style.transform = 'translateX(' + (-8 + rel * 7) + '%)';
        }
      }
    });
    if (cur) cur.textContent = String(nearest + 1).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = sl <= 2;
    if (nextBtn) nextBtn.disabled = sl >= max - 2;
  };

  let ticking = false;
  vp.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  }, { passive: true });

  const step = () => (slides[0] ? slides[0].offsetWidth + 24 : vp.clientWidth * 0.6);
  if (prevBtn) prevBtn.addEventListener('click', () => vp.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => vp.scrollBy({ left: step(), behavior: 'smooth' }));

  /* arrastre con inercia (solo ratón) */
  if (window.matchMedia('(pointer:fine)').matches) {
    let down = false, startX = 0, startScroll = 0, moved = false, lastX = 0, lastT = 0, vel = 0;
    vp.addEventListener('pointerdown', e => {
      down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft;
      lastX = e.clientX; lastT = performance.now(); vel = 0;
      if (window.gsap) gsap.killTweensOf(vp);
      vp.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      vp.scrollLeft = startScroll - dx;
      const now = performance.now(), dt = now - lastT;
      if (dt > 0) vel = (e.clientX - lastX) / dt;
      lastX = e.clientX; lastT = now;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false; vp.classList.remove('is-dragging');
      if (window.gsap && Math.abs(vel) > 0.1) {
        const target = Math.max(0, Math.min(maxScroll(), vp.scrollLeft - vel * 260));
        gsap.to(vp, { scrollLeft: target, duration: 0.9, ease: 'power3.out' });
      }
    });
    // si hubo arrastre, no abrir el lightbox
    vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  update();
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
}

/* ============================================================
   MENÚ: el recorrido (scroll horizontal, pin en desktop)
   ============================================================ */
const journey = document.querySelector('.journey');
if (journey) {
  const viewport = document.getElementById('journeyViewport');
  const track = document.getElementById('journeyTrack');
  const panels = Array.from(journey.querySelectorAll('.jpanel'));
  const jbar = document.getElementById('journeyBar');
  const jcur = document.getElementById('journeyCur');
  const desktop = window.matchMedia('(min-width:901px)').matches;
  const setCount = n => { if (jcur) jcur.textContent = String(Math.min(panels.length, Math.max(1, n))).padStart(2, '0'); };

  if (window.gsap && desktop && !reduceMotion) {
    journey.classList.add('is-pinned');
    const amount = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -amount(), ease: 'none',
      scrollTrigger: {
        trigger: journey, start: 'top top', end: () => '+=' + amount(),
        pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: self => {
          if (jbar) jbar.style.width = (6 + self.progress * 94) + '%';
          setCount(Math.round(self.progress * (panels.length - 1)) + 1);
        }
      }
    });
    panels.forEach(p => {
      const petal = p.querySelector('.jpanel__petal');
      if (petal) gsap.fromTo(petal,
        { yPercent: -64, rotate: -16 },
        { yPercent: -36, rotate: 16, ease: 'none',
          scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo(p.querySelector('.jpanel__inner'),
        { opacity: 0.45, y: 26 },
        { opacity: 1, y: 0, ease: 'power2.out',
          scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 82%', end: 'left 45%', scrub: true } });
    });
  } else if (viewport) {
    const upd = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const sl = viewport.scrollLeft;
      if (jbar) jbar.style.width = (max > 0 ? 6 + (sl / max) * 94 : 6) + '%';
      const center = sl + viewport.clientWidth / 2;
      let nearest = 0, nd = Infinity;
      panels.forEach((p, i) => { const c = p.offsetLeft + p.offsetWidth / 2; const d = Math.abs(center - c); if (d < nd) { nd = d; nearest = i; } });
      setCount(nearest + 1);
    };
    let t = false;
    viewport.addEventListener('scroll', () => { if (!t) { requestAnimationFrame(() => { upd(); t = false; }); t = true; } }, { passive: true });
    upd();
  }
}

/* ============================================================
   LIGHTBOX (galería)
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const items = Array.from(document.querySelectorAll('.slide__btn'));
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
    document.body.classList.add('intro-open'); // reutiliza el bloqueo de scroll
    if (window.lenis) window.lenis.stop();
    lbClose.focus();
  };
  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('intro-open');
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

