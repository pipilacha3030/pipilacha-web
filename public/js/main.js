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
  lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
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

/* botón flotante de reserva: aparece tras el primer scroll (solo móvil, vía CSS) */
const reservaFab = document.getElementById('reservaFab');

/* nav background toggle (umbral pequeño si la nav ya es sólida) */
const onScroll = y => {
  const threshold = nav.classList.contains('nav--solid') ? 10 : window.innerHeight * 0.6;
  nav.classList.toggle('scrolled', y > threshold);
  if (reservaFab) reservaFab.classList.toggle('is-visible', y > window.innerHeight * 0.5);
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
    const ptCols = gsap.utils.toArray('#pageTransition .page-transition__col');
    const ptMark = pt.querySelector('.page-transition__mark');
    const hidePT = () => { pt.style.visibility = 'hidden'; pt.style.pointerEvents = 'none'; };

    // ENTRADA: la cortina cubre al cargar y se retira hacia arriba
    const revealPage = () => {
      if (reduceMotion) { hidePT(); return; }
      pt.style.visibility = 'visible';
      gsap.set(ptCols, { yPercent: 0 });
      gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1 });
      gsap.timeline({ onComplete: hidePT })
        .to(ptMark, { autoAlpha: 0, scale: 0.92, duration: 0.3, ease: 'power2.out' }, 0)
        .to(ptCols, { yPercent: -100, duration: 0.7, ease: 'power4.inOut', stagger: 0.06 }, 0.05);
    };

    // SALIDA: la cortina sube a cubrir y luego navega
    const coverPage = (href) => {
      pt.style.visibility = 'visible';
      pt.style.pointerEvents = 'auto';
      gsap.set(ptCols, { yPercent: 100 });
      gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.92 });
      gsap.timeline({ onComplete: () => { window.location.href = href; } })
        .to(ptCols, { yPercent: 0, duration: 0.55, ease: 'power4.inOut', stagger: 0.05 }, 0)
        .to(ptMark, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, 0.2);
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

    /* manifiesto pinned: las palabras se encienden una a una con el scrub,
       la flor azul cruza por detrás */
    if (document.querySelector('.manifesto')) {
      const mTl = gsap.timeline({
        scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=110%', pin: true, scrub: 0.5 }
      });
      mTl.fromTo('.manifesto .m-word',
        { opacity: 0.08, yPercent: 36, filter: 'blur(6px)' },
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.14, ease: 'none' })
        .fromTo('.manifesto__bloom',
          { yPercent: 45, rotate: -16 },
          { yPercent: -55, rotate: 12, ease: 'none' }, 0);
    }

    /* despertar de las flores: la foto no está — y florece desde el centro
       hasta pantalla completa en poco scroll */
    const sFrame = document.querySelector('.showcase__frame');
    if (sFrame) {
      const sTl = gsap.timeline({
        scrollTrigger: { trigger: '.showcase-wrap', start: 'top top', end: '+=75%', pin: true, scrub: 0.4 }
      });
      sTl.fromTo(sFrame,
        { clipPath: 'inset(50% 50% 50% 50% round 30px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out', duration: 0.7 })
        .fromTo(sFrame.querySelector('img'), { scale: 1.4 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('.showcase__veil', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5)
        .fromTo('.showcase__cap', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.65);
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

    /* galería en cascada */
    gsap.from('.g-item', {
      opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: '.gallery__grid', start: 'top 80%' }
    });

    /* galería cinética: cada imagen deriva a su ritmo dentro del marco */
    gsap.utils.toArray('.g-item img').forEach(img => {
      gsap.fromTo(img,
        { yPercent: -6, scale: 1.12 },
        { yPercent: 6, scale: 1.12, ease: 'none',
          scrollTrigger: { trigger: img.closest('.g-item'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
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

    /* ── PRENSA: filas editoriales con reveal de clip-path y preview que sigue al cursor ── */
    const pressRows = gsap.utils.toArray('.press-row');
    if (pressRows.length) {
      pressRows.forEach(row => {
        gsap.fromTo(row,
          { opacity: 0, y: 42, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' } });
      });

      const pressCursor = document.querySelector('.press-cursor');
      if (pressCursor && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        const imgs = pressCursor.querySelectorAll('img');
        gsap.set(pressCursor, { autoAlpha: 0, scale: 0.8, rotation: -5, xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(pressCursor, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(pressCursor, 'y', { duration: 0.5, ease: 'power3' });
        window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
        document.querySelectorAll('.press-row__link').forEach(link => {
          const key = link.dataset.img;
          link.addEventListener('mouseenter', () => {
            imgs.forEach(im => im.classList.toggle('is-active', im.dataset.img === key));
            gsap.to(pressCursor, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' });
          });
          link.addEventListener('mouseleave', () => {
            gsap.to(pressCursor, { autoAlpha: 0, scale: 0.8, rotation: -5, duration: 0.3, ease: 'power3.out' });
          });
        });
      }
    }
  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  ScrollTrigger.refresh();
}

/* ============================================================
   LIGHTBOX (galería)
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const items = Array.from(document.querySelectorAll('.g-item'));
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
