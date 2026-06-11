/* ============================================================
   PIPILACHA · /referencia  (pin + scrub, adaptado de letsplayfight.com)
   Al hacer scroll el hero se fija: la foto destacada (que arranca más
   abajo) sube al centro y crece a pantalla completa, mientras las demás
   se apartan hacia fuera y entran en blur + fade.
   ============================================================ */

// Toca esto para ajustar el "feel" en un solo sitio.
const MOTION = {
  pinDistance: '+=160%',   // cuánto scroll dura la transición
  scrub: 0.6,              // suavizado del scrub
  disperseBlur: 18,        // px de desenfoque de las fotos que se apartan
  disperseScale: 1.28,     // cuánto crecen al apartarse
  coverPad: 1.06,          // margen extra para asegurar cobertura total
  featuredDrop: 0.14,      // cuánto arranca por debajo del centro (fracción del alto)
};

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.innerWidth < 760;
  const hero = document.getElementById('hero');
  const featured = document.getElementById('featured');
  const scrim = document.querySelector('.pf__scrim');
  const center = document.getElementById('center');
  const finalEl = document.getElementById('final');
  const chips = Array.prototype.slice.call(document.querySelectorAll('.pf__chip'));

  /* ---------- Lenis ---------- */
  let lenis;
  if (!reduce && !mobile && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.lenis = lenis;
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // En móvil o reduce-motion no hay pin: el hero queda estático y legible.
  if (reduce || mobile || !window.gsap) {
    document.body.classList.add('pf--ready', 'pf--static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // escala para que la destacada cubra el viewport (medida a tamaño base)
  const coverScale = () => {
    const r = featured.getBoundingClientRect();
    const base = Math.max(window.innerWidth / r.width, window.innerHeight / r.height);
    return base * MOTION.coverPad;
  };
  const drop = () => window.innerHeight * MOTION.featuredDrop;

  // dirección de salida de cada chip (hacia fuera desde el centro)
  const dispersion = () => chips.map(c => {
    const r = c.getBoundingClientRect();
    let dx = (r.left + r.width / 2) - window.innerWidth / 2;
    let dy = (r.top + r.height / 2) - window.innerHeight / 2;
    const L = Math.hypot(dx, dy) || 1;
    const push = Math.max(window.innerWidth, window.innerHeight) * 1.05;
    return { x: dx / L * push, y: dy / L * push };
  });
  let dirs = dispersion();

  gsap.set(chips, { filter: 'blur(0px)' });
  gsap.set(featured, { y: drop() }); // arranca más abajo

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero, start: 'top top', end: MOTION.pinDistance,
      pin: true, scrub: MOTION.scrub, invalidateOnRefresh: true,
      onRefresh: () => { dirs = dispersion(); },
    },
  });

  // las demás fotos se apartan + blur + fade
  chips.forEach((c, i) => {
    tl.to(c, {
      x: () => dirs[i].x, y: () => dirs[i].y,
      scale: MOTION.disperseScale, filter: 'blur(' + MOTION.disperseBlur + 'px)',
      opacity: 0, ease: 'power1.in', duration: 0.8,
    }, 0);
  });

  // el titular se desvanece pronto (deja la lectura limpia al entrar)
  tl.to(center, { opacity: 0, ease: 'power1.in', duration: 0.3 }, 0);

  // la destacada sube al centro y crece a pantalla completa
  tl.fromTo(featured,
      { y: () => drop(), scale: 1 },
      { y: 0, scale: coverScale, ease: 'power2.inOut', duration: 1 }, 0)
    .to(featured, { borderRadius: 0, ease: 'none', duration: 0.6 }, 0)
    .to(scrim, { opacity: 1, ease: 'none', duration: 1 }, 0);

  // cierre sobre la foto a pantalla completa
  tl.fromTo(finalEl, { opacity: 0, y: 18 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 }, 0.74);

  // Lenis fija su límite de scroll al iniciarse, ANTES de que ScrollTrigger cree
  // el pin spacer. Hay que pedirle que recalcule o el scroll queda bloqueado.
  if (lenis) ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  ScrollTrigger.refresh();
  if (lenis) lenis.resize();
  document.body.classList.add('pf--ready');
  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();
