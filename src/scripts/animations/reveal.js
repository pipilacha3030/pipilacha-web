/* ============================================================
   Revelados al entrar en viewport. Cubre todas las variantes:
   - .reveal genérico y cascada [data-reveal-stagger]
   - .reveal-head (cortina clip-path para titulares, texto)
   - filas de prensa (.press-row) y flores de vinos (.wine-cat__flor):
     revelados específicos de página, misma responsabilidad.
   ============================================================ */
import { gsap, SplitText, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext, pageSignal } from '../utils/lifecycle.js';

export function initReveals() {
  if (reduceMotion) {
    // el CSS ya fuerza visibilidad con !important; esto es cinturón y tirantes
    inPageContext(() => { gsap.set('.reveal', { opacity: 1, y: 0 }); });
    return;
  }

  inPageContext(() => {
    /* reveal genérico */
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.closest('.hero')) return; // el hero ya se anima aparte (animations/hero.js)
      if (el.matches('.barra__media')) return; // tiene reveal editorial propio (animations/media.js)
      if (el.closest('[data-reveal-stagger]')) return; // lo anima su grupo en cascada
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    /* reveal en cascada: grupos (tarjetas, pasos) entran escalonados como una unidad */
    gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
      const items = group.querySelectorAll('.reveal');
      if (!items.length) return;
      gsap.to(items, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: group, start: 'top 84%' }
      });
    });

    /* reveal de TITULAR (.reveal-head): cortina clip-path de abajo arriba + leve
       subida, sin rebote. Funciona con titulares de varias líneas (a diferencia de
       una máscara por línea) y enriquece un texto que ya es visible sin JS. */
    gsap.utils.toArray('.reveal-head').forEach((el) => {
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

    /* ETIQUETA CINÉTICA (.eyebrow--k, prototipo Conócenos): sin guion; la palabra
       se ensambla letra a letra (SplitText, máscara por char) y el filete se traza
       (--eb-draw 0→1) un pelín después. Arranca al cargar si está sobre el pliegue;
       si no, al entrar en pantalla. Las letras se ocultan desde ya (evita flash).
       Sin revert del split: la página se intercambia entera en cada transición,
       mismo patrón que splitReveal.js. */
    const ebSignal = pageSignal();
    gsap.utils.toArray('.eyebrow--k').forEach((el) => {
      const word = el.querySelector('.eyebrow__word') || el;
      const seeds = gsap.utils.toArray(el.querySelectorAll('.eyebrow__seed img'));
      const split = SplitText.create(word, { type: 'chars', mask: 'chars' });
      gsap.set(split.chars, { yPercent: 120 });
      if (seeds.length) gsap.set(seeds, { opacity: 0, scale: 0, rotation: -18, transformOrigin: '50% 88%' });
      gsap.set(el, { visibility: 'visible' });

      // VIDA CONTINUA: tras florecer, cada flor respira (balanceo + bob) con fase
      // y ritmo propios → parece un ramillete vivo, nunca congelado.
      const idle = () => seeds.forEach((f) => {
        gsap.to(f, {
          rotation: gsap.utils.random(-6, 6), yPercent: gsap.utils.random(-11, 11),
          duration: gsap.utils.random(2.8, 4.4), ease: 'sine.inOut',
          repeat: -1, yoyo: true, delay: gsap.utils.random(0, 0.8),
        });
      });

      // INTERACCIÓN con el cursor sobre la palabra: las flores se inclinan hacia el
      // puntero (magnetismo, cada una con profundidad distinta) y se abren al pasar.
      if (seeds.length) {
        const qx = seeds.map((f) => gsap.quickTo(f, 'x', { duration: 0.5, ease: 'power3' }));
        const qy = seeds.map((f) => gsap.quickTo(f, 'y', { duration: 0.5, ease: 'power3' }));
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const cx = e.clientX - (r.left + r.width / 2);
          const cy = e.clientY - (r.top + r.height / 2);
          seeds.forEach((f, i) => { const k = 0.14 + i * 0.05; qx[i](cx * k); qy[i](cy * k); });
        }, { signal: ebSignal });
        el.addEventListener('pointerenter', () => {
          gsap.to(seeds, { scale: 1.16, duration: 0.45, ease: 'power3.out', stagger: 0.05 });
        }, { signal: ebSignal });
        el.addEventListener('pointerleave', () => {
          seeds.forEach((_, i) => { qx[i](0); qy[i](0); });
          gsap.to(seeds, { scale: 1, duration: 0.55, ease: 'power3.out' });
        }, { signal: ebSignal });
      }

      // ENTRADA "florecen las palabras": brotan las flores (pop back.out) → suben
      // las letras desde su máscara → se traza el filete → arranca la vida continua.
      const play = () => {
        const tl = gsap.timeline();
        if (seeds.length) tl.to(seeds, { opacity: 1, scale: 1, rotation: 0, duration: 0.62, ease: 'back.out(1.7)', stagger: 0.09 }, 0);
        tl.to(split.chars, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.03 }, 0.32);
        tl.to(el, { '--eb-draw': 1, duration: 0.7, ease: 'power2.out' }, 0.5);
        if (seeds.length) tl.call(idle, null, '>-0.15');
      };
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        gsap.delayedCall(0.2, play);
      } else {
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: play });
      }
    });

    /* PRENSA: filas editoriales con reveal de clip-path */
    gsap.utils.toArray('.press-row').forEach((row) => {
      gsap.fromTo(row,
        { opacity: 0, y: 42, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%' } });
    });

    /* VINOS: la flor de cada familia "florece" al llegar a su sección (sin rebote).
       OJO sin `rotation`: el giro perpetuo vive en CSS (propiedad rotate) y
       cualquier rotación de GSAP aquí interferiría con él. */
    gsap.utils.toArray('.wine-cat__flor').forEach((flor) => {
      gsap.fromTo(flor,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: flor.closest('.wine-cat'), start: 'top 78%' } });
    });
  });
}
