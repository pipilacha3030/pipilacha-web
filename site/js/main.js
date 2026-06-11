/* ============================================================
   PIPILACHA · interacción
   Lenis (scroll suave) + GSAP ScrollTrigger (revelados, parallax)
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- preloader ---------- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  setTimeout(() => pre.classList.add('hidden'), 500);
});

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

  // anclas suaves
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: 0 }); }
    });
  });
}

/* nav background toggle */
const onScroll = y => nav.classList.toggle('scrolled', y > window.innerHeight * 0.6);
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

  if (!reduceMotion) {
    /* hero: título en máscara */
    gsap.to('.hero__title .reveal-mask', {
      yPercent: -110, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.7
    });

    /* hero: elementos con data-delay */
    document.querySelectorAll('.hero [data-delay]').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.dataset.delay) + 0.6 });
    });

    /* reveal genérico */
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero')) return; // el hero ya se anima arriba
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* líneas del manifiesto */
    gsap.utils.toArray('.reveal-line > *').forEach((el, i) => {
      gsap.fromTo(el, { yPercent: 110 }, {
        yPercent: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: '.manifesto', start: 'top 70%' }, delay: i * 0.08
      });
    });

    /* parallax: hero media + figuras + pétalos */
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const amt = parseFloat(el.dataset.parallax);
      gsap.to(el, {
        yPercent: () => amt * 100, ease: 'none',
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
  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  ScrollTrigger.refresh();
}
