/* ============================================================
   PIPILACHA · interacción
   Lenis (scroll suave) + GSAP ScrollTrigger (revelados, parallax)
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Config centralizada del GALLERY FLOW (ver initGalleryFlow más abajo) */
const FLOW = { runwayVh: 380, scrub: 1, expandFrom: 0.45, expandTo: 1.2 };
let showcaseTl = null; // timeline del Despertar (clip-path); lo reproduce initGalleryFlow al expandir

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
    const ptMark = pt.querySelector('.page-transition__mark');
    const hidePT = () => { pt.style.visibility = 'hidden'; pt.style.opacity = '0'; pt.style.pointerEvents = 'none'; };

    // ENTRADA: la cortina olive cubre al cargar; la libélula se desvanece y la cortina se va
    const revealPage = () => {
      if (reduceMotion) { hidePT(); return; }
      pt.style.visibility = 'visible';
      pt.style.opacity = '1';
      gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 1, scale: 1 });
      gsap.timeline({ onComplete: hidePT })
        .to(ptMark, { autoAlpha: 0, scale: 1.14, duration: 0.4, ease: 'power2.in' }, 0)
        .to(pt, { autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, 0.12);
    };

    // SALIDA: la cortina olive aparece con la libélula (escala + rebote) y luego navega
    const coverPage = (href) => {
      pt.style.visibility = 'visible';
      pt.style.pointerEvents = 'auto';
      gsap.set(ptMark, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });
      gsap.timeline({ onComplete: () => { window.location.href = href; } })
        .fromTo(pt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.34, ease: 'power2.inOut' }, 0)
        .to(ptMark, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(1.7)' }, 0.12);
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
      if (el.matches('.barra__media')) return; // tiene reveal editorial propio
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });


    /* MANIFIESTO: reveal editorial — SplitType (caracteres) que se enfocan desde
       desenfoque + casi invisibles, con pétalos SVG que emergen de algunas letras.
       Se dispara UNA sola vez y, al acabar, queda tipografía limpia. */
    const manifesto = document.querySelector('.manifesto');
    if (manifesto && window.SplitType) {
      const textEl = manifesto.querySelector('.manifesto__text');
      const petalsBox = manifesto.querySelector('.manifesto__petals');
      const split = new SplitType(textEl, { types: 'words,chars', tagName: 'span' });
      const chars = split.chars || [];
      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      // estado inicial: borroso y casi invisible
      gsap.set(chars, { opacity: 0, filter: 'blur(12px)', yPercent: 16 });

      const mTl = gsap.timeline({
        scrollTrigger: { trigger: manifesto, start: 'top 62%', once: true }, // solo una vez
        onComplete: () => { try { split.revert(); } catch (e) {} } // tipografía final limpia
      });
      // los caracteres se enfocan progresivamente
      mTl.to(chars, {
        opacity: 1, filter: 'blur(0px)', yPercent: 0,
        duration: 1.0, ease: 'power2.out',
        stagger: { each: isMobile ? 0.018 : 0.028, from: 'start' }
      });
      // pétalos que emergen de letras seleccionadas, durante el reveal
      mTl.add(() => spawnManifestoPetals(chars, manifesto, petalsBox, isMobile), 0.5);
    }

    /* despertar de las flores: 4 imágenes superpuestas que se revelan en bucle
       (Timeline + clip-path). Se crea pausado; initGalleryFlow lo reproduce
       cuando el finale se expande a pantalla completa. */
    const showcase = document.querySelector('.showcase');
    if (showcase) {
      const sLayers = gsap.utils.toArray(showcase.querySelectorAll('.showcase__layer'));
      if (sLayers.length) {
        // base: todas reveladas; la primera capa arriba (df-esparrago, la que se ve en reposo)
        gsap.set(sLayers, { clipPath: 'inset(0 0% 0 0)', zIndex: i => sLayers.length - i });
        showcaseTl = gsap.timeline({
          repeat: -1, repeatDelay: 0.6, defaults: { ease: 'power2.inOut' }, paused: true,
          onRepeat: () => gsap.set(sLayers, { zIndex: 1, clipPath: 'inset(0 0% 0 0)' })
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
    initGalleryFlow();
  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  ScrollTrigger.refresh();
}

/* ============================================================
   GALLERY FLOW (efecto 072) · una sola pasada FINITA (sin duplicar, sin bucle)
   12 fotos entran de una/dos por la derecha, se aglomeran solapadas en el centro
   (compresión + dispersión vertical + wobble + capas z) y salen por la izquierda.
   La última pieza —el "Despertar de las flores"— en vez de salir se expande a
   pantalla completa como transición limpia. Se pinea el stage; nada se repite.
   ============================================================ */
function initGalleryFlow() {
  const gallery = document.querySelector('.gallery');
  if (!gallery || !window.gsap) return;
  const stage  = gallery.querySelector('.gallery-stage');
  const row    = gallery.querySelector('.gallery-row');
  const finale = gallery.querySelector('.gallery-finale');
  if (!stage || !row || !finale) return;
  if (reduceMotion) return; // reduce motion: grid simple + Despertar como bloque (vía CSS)

  const isMobile = window.matchMedia('(max-width:768px)').matches;
  const expandTo = isMobile ? 1.06 : FLOW.expandTo;
  gallery.style.height = (isMobile ? 300 : FLOW.runwayVh) + 'vh';

  const photos = gsap.utils.toArray(row.querySelectorAll('.gallery-img'));
  const m = photos.length;

  // setters GPU por foto (x/y/scale/rot/opacity)
  const pX = photos.map(el => gsap.quickSetter(el, 'x', 'px'));
  const pY = photos.map(el => gsap.quickSetter(el, 'y', 'px'));
  const pScale = photos.map(el => {
    const sx = gsap.quickSetter(el, 'scaleX'), sy = gsap.quickSetter(el, 'scaleY');
    return v => { sx(v); sy(v); };
  });
  const pRot = photos.map(el => gsap.quickSetter(el, 'rotation', 'deg'));
  const pAlpha = photos.map(el => gsap.quickSetter(el, 'opacity'));
  const setFinRot   = gsap.quickSetter(finale, 'rotation', 'deg');
  const setFinAlpha = gsap.quickSetter(finale, 'opacity');
  gsap.set(photos, { force3D: true, transformOrigin: '50% 50%' });
  gsap.set(finale, { force3D: true, transformOrigin: '50% 50%', opacity: 0 });

  // dispersión vertical + fase de wobble + capa (z) por foto → moodboard orgánico
  const oyVh     = [-16, 10, -7, 17, -3, 13, -15, 6, -10, 15, -5, 8];
  const wobPhase = [0, 1.7, 3.1, 0.6, 2.4, 4.2, 1.1, 5.0, 2.0, 3.7, 0.3, 4.8];
  const zLayer   = [4, 8, 2, 9, 5, 1, 7, 3, 10, 6, 2, 8];
  photos.forEach((el, i) => { el.style.zIndex = zLayer[i % zLayer.length]; });

  const cap = finale.querySelector('.showcase__cap');
  const playShowcase = (on) => {
    if (!showcaseTl) return;
    if (on) { if (!showcaseTl.isActive()) showcaseTl.play(); }
    else if (showcaseTl.isActive() || showcaseTl.time() > 0) showcaseTl.pause(0);
  };

  // estado medido (se recalcula en cada refresh/resize)
  let vw = 0, vh = 0, vhPx = 0, centers = [], finaleCenter = 0, startOffset = 0, travel = 0, cardW = 0, cardH = 0;
  const measure = () => {
    vw = window.innerWidth; vh = window.innerHeight; vhPx = vh / 100;
    centers = photos.map(el => el.offsetLeft + el.offsetWidth / 2);
    // leer el tamaño BASE del CSS (limpiar el inline que pone render evita medir 0)
    finale.style.width = ''; finale.style.height = '';
    cardW = finale.offsetWidth; cardH = finale.offsetHeight;
    const last = photos[m - 1];
    finaleCenter = last.offsetLeft + last.offsetWidth + vw * 0.03 + cardW / 2; // tras la última foto
    startOffset  = vw + photos[0].offsetWidth / 2 - centers[0] + vw * 0.06;    // 1ª foto justo fuera por la derecha
    travel = finaleCenter + startOffset - vw / 2;                              // finale al centro al acabar el flujo
  };

  const span = expandTo - FLOW.expandFrom;
  const K_MIN = 0.5;          // compresión horizontal en el centro (apilado denso)
  const P_FLOW = 0.82;        // 0–82% del runway = flujo; 82–100% = expansión del finale

  // posición/peso de un elemento según su centro lineal y el avance del flujo
  const place = (center, off) => {
    const h = vw / 2;
    const bx = center - off + startOffset;
    let t = Math.abs(bx - h) / h; t = t < 0 ? 0 : t > 1 ? 1 : t;
    const k = K_MIN + (1 - K_MIN) * t;
    return { screenX: h + (bx - h) * k, t, bx };
  };

  const render = (p) => {
    const flowP   = p < P_FLOW ? p / P_FLOW : 1;
    const expandP = p > P_FLOW ? (p - P_FLOW) / (1 - P_FLOW) : 0;
    const off = flowP * travel;

    // ── 12 fotos ──
    for (let i = 0; i < m; i++) {
      const { screenX, t, bx } = place(centers[i], off);
      const e = t * t * (3 - 2 * t);
      pX[i](screenX - centers[i]);
      pScale[i](expandTo - span * e);
      pY[i](oyVh[i % oyVh.length] * vhPx * (1 - t));
      pRot[i](Math.sin(bx / vw * Math.PI * 1.6 + wobPhase[i % wobPhase.length]) * 3);
      let a = Math.min(screenX, vw - screenX) / (vw * 0.06); a = a < 0 ? 0 : a > 1 ? 1 : a;
      pAlpha[i](a * (1 - expandP));   // se desvanecen al expandir el finale
    }

    // ── finale (Despertar de las flores) ──
    if (expandP <= 0.0001) {
      // entra por la derecha como la 13ª foto: oculta hasta flowP=0.5, luego desliza al centro
      const fp = flowP < 0.5 ? 0 : (flowP - 0.5) / 0.5; // 0→1 en la segunda mitad del flujo
      const fe = fp * fp * (3 - 2 * fp);                  // smoothstep
      const finX = vw / 2 + (vw * 0.6 + cardW / 2) * (1 - fe); // derecha → centro
      finale.style.width  = cardW + 'px';
      finale.style.height = cardH + 'px';
      finale.style.left   = (finX - cardW / 2) + 'px';
      finale.style.top    = (vh / 2 - cardH / 2 - 6 * vhPx * (1 - fe)) + 'px'; // leve bajada al centrarse
      finale.style.borderRadius = '3px';
      finale.style.zIndex = '50';
      setFinRot(Math.sin(fp * Math.PI * 1.6 + 2.2) * 3 * (1 - fe)); // se endereza al llegar
      setFinAlpha(Math.min(fp / 0.12, 1)); // fade in rápido al entrar
      if (cap) cap.style.opacity = '0';
      playShowcase(false);
    } else {
      // EXPANSIÓN: de tarjeta centrada → pantalla completa (transición limpia)
      const fe = expandP * expandP * (3 - 2 * expandP); // smoothstep
      const cLeft = vw / 2 - cardW / 2, cTop = vh / 2 - cardH / 2;
      setFinRot(0);
      setFinAlpha(1);
      finale.style.left   = (cLeft * (1 - fe)) + 'px';
      finale.style.top    = (cTop  * (1 - fe)) + 'px';
      finale.style.width  = (cardW + (vw - cardW) * fe) + 'px';
      finale.style.height = (cardH + (vh - cardH) * fe) + 'px';
      finale.style.borderRadius = (3 * (1 - fe)) + 'px';
      finale.style.zIndex = '100';
      if (cap) cap.style.opacity = String(fe);
      playShowcase(expandP > 0.45);
    }
  };

  // tween-proxy con scrub: la suavidad (lag) la aporta scrub:1 sobre state.p
  const state = { p: 0 };
  gsap.to(state, {
    p: 1, ease: 'none',
    scrollTrigger: {
      trigger: gallery, start: 'top top', end: 'bottom bottom',
      pin: stage, scrub: FLOW.scrub, invalidateOnRefresh: true,
      onRefresh: () => { measure(); render(state.p); }
    },
    onUpdate: () => render(state.p)
  });

  measure();
  render(0);
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


/* ============================================================
   MANIFIESTO · pétalos SVG generados programáticamente
   (decorativos, botánicos, sin caricatura; se eliminan al terminar)
   ============================================================ */
function makeManifestoPetal() {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'manifesto__petal');
  svg.setAttribute('viewBox', '0 0 24 32');
  svg.setAttribute('width', '19');
  svg.setAttribute('height', '25');
  // pétalo en forma de lágrima/hoja: elegante, no caricaturesco
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M12 1.5 C18.5 8 21 18 12 30.5 C3 18 5.5 8 12 1.5 Z');
  const colors = ['#645D3B', '#B0A77F', '#8E9A66']; // oliva, accent-soft, salvia
  path.setAttribute('fill', colors[(Math.random() * colors.length) | 0]);
  path.setAttribute('opacity', '0.92');
  // nervadura central muy fina
  const vein = document.createElementNS(NS, 'path');
  vein.setAttribute('d', 'M12 4.5 L12 27.5');
  vein.setAttribute('stroke', 'rgba(255,255,255,0.22)');
  vein.setAttribute('stroke-width', '0.6');
  vein.setAttribute('fill', 'none');
  svg.appendChild(path);
  svg.appendChild(vein);
  return svg;
}

function spawnManifestoPetals(chars, section, box, isMobile) {
  if (!box || !chars || !chars.length || !window.gsap) return;
  const count = isMobile ? 3 : 5;
  const rectS = section.getBoundingClientRect();
  // letras seleccionadas: repartidas por la frase
  const picks = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor((i + 0.5) / count * chars.length);
    if (chars[idx]) picks.push(chars[idx]);
  }
  picks.forEach((ch, i) => {
    const r = ch.getBoundingClientRect();
    if (!r.width) return;
    const petal = makeManifestoPetal();
    box.appendChild(petal);
    const x = r.left - rectS.left + r.width / 2;
    const y = r.top - rectS.top + r.height * 0.35;
    gsap.set(petal, { x, y, xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0, rotation: gsap.utils.random(-25, 25) });
    // 1) emerge de la letra
    gsap.to(petal, {
      opacity: 0.9, scale: gsap.utils.random(0.82, 1.06), duration: 0.5, ease: 'power2.out', delay: i * 0.09,
      onComplete: () => {
        // 2) deriva hacia arriba y se desvanece; luego se elimina
        gsap.to(petal, {
          x: x + gsap.utils.random(-26, 26),
          y: y - gsap.utils.random(70, 130),
          rotation: '+=' + gsap.utils.random(-40, 40),
          opacity: 0,
          duration: gsap.utils.random(1.6, 2.4),
          ease: 'power1.out',
          onComplete: () => petal.remove()
        });
      }
    });
  });
}
