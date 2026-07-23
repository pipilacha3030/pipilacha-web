/* ============================================================
   INTERLUDIO "35 flores" — el ramo se compone al leer.
   Las 35 flores (una por cada flor comestible de la temporada, ver
   components/Interlude.astro) empiezan dispersas por toda la sección; el
   scroll las REÚNE en una guirnalda que rodea la frase. Tres gestos, cada
   uno con su motivo:
     1. REUNIÓN (scrub): el recorrido natural de la sección por la pantalla
        lleva las flores de dispersas a guirnalda. Sin pin: no alarga el
        scroll, aprovecha el que ya hay. Reversible al subir.
     2. LA FRASE SE POSA: las palabras suben desde su máscara y, al posarse,
        una onda recorre el ramo — las flores acusan el peso del texto.
     3. EL CURSOR APARTA: al leer, las flores cercanas al puntero se hacen a
        un lado y vuelven. Solo con puntero fino (en táctil no hay hover).

   Tres capas anidadas por flor, una por animador, para que nadie se pelee
   por el mismo `transform`:
     .ilf        → GSAP, reunión ligada al scroll
     .ilf__push  → GSAP, empuje del cursor y onda de la frase
     img         → CSS, deriva perpetua propia (@keyframes ilfDrift)
   ============================================================ */
import { gsap, SplitText, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext, pageSignal } from '../utils/lifecycle.js';

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // reparte ángulos sin agrupar

export function initInterlude() {
  const section = document.querySelector('.interlude');
  if (!section || reduceMotion) return; // reduced-motion: el CSS ya lo deja legible y quieto

  const field = section.querySelector('.interlude__field');
  const line = section.querySelector('.interlude__line');
  const blooms = gsap.utils.toArray(section.querySelectorAll('.ilf'));
  if (!field || !line || !blooms.length) return;

  inPageContext(() => {
    const pushers = blooms.map((b) => b.querySelector('.ilf__push'));

    /* La frase se parte YA (antes de medir): el ancho real del texto es el de
       sus palabras, no el del <p>, que ocupa casi todo el ancho de la columna.
       Medir el bloque llevaba flores hasta 857px del centro — fuera de una
       pantalla de 1280 y recortadas por el overflow. */
    const split = SplitText.create(line, { type: 'words', mask: 'words' });

    /* Geometría de la guirnalda, cacheada por refresh. Cinco anillos entre el
       borde del texto y el borde útil del campo: así ninguna flor se sale
       (todas las 35 se ven, que es justo lo que cuenta la frase) y el reparto
       por ángulo áureo evita que se amontonen. */
    let geo = null;
    const measure = () => {
      const fb = field.getBoundingClientRect();
      const lb = line.getBoundingClientRect();
      // horizontal: extensión real de las palabras (la máscara solo las
      // desplaza en vertical, así que el ancho es fiable aunque no hayan subido)
      let l = Infinity; let r = -Infinity;
      split.words.forEach((w) => {
        const q = w.getBoundingClientRect();
        if (q.width) { l = Math.min(l, q.left); r = Math.max(r, q.right); }
      });
      if (!isFinite(l)) { l = lb.left; r = lb.right; }
      // vertical: el <p> no tiene padding vertical → su caja ES la del texto
      return {
        cx: (l + r) / 2 - fb.left,
        cy: lb.top - fb.top + lb.height / 2,
        hw: (r - l) / 2,
        hh: lb.height / 2,
        maxX: fb.width / 2 - 56,   // margen para que la flor entera quepa
        maxY: fb.height / 2 - 44,
      };
    };
    const target = (i) => {
      if (!geo) geo = measure();
      const t = (i % 5) / 4;                       // anillo 0..4 → 0..1
      const a = i * GOLDEN;
      const ca = Math.cos(a); const sa = Math.sin(a);
      // |cos|,|sen| acotados: el rayo horizontal/vertical puro no divide por 0
      const ax = Math.max(Math.abs(ca), 1e-4);
      const ay = Math.max(Math.abs(sa), 1e-4);
      /* Distancia a la que el rayo SALE de la caja del texto. Una elipse de
         semiejes hw/hh no envuelve el rectángulo (en diagonal la esquina queda
         fuera de la elipse) y las flores caían encima de la frase; con la
         salida real del rectángulo ninguna la pisa, sea cual sea el ángulo. */
      // el margen descuenta el radio de la flor más grande (~35px), no solo su
      // centro: si no, una flor grande "muerde" la frase aunque su centro esté fuera
      const rText = Math.min((geo.hw + 56) / ax, (geo.hh + 48) / ay);
      const rMax = Math.min(geo.maxX / ax, geo.maxY / ay); // borde útil del campo
      const rIn = Math.min(rText, rMax);
      const r = rIn + (rMax - rIn) * t;
      let x = geo.cx + ca * r;
      let y = geo.cy + sa * r;
      /* Si aun así el punto cae sobre la frase, sale por arriba o por abajo.
         Pasa en móvil: el texto ocupa casi todo el ancho y no queda sitio
         lateral para rodearlo, así que la guirnalda se resuelve como dos
         bandas —encima y debajo— en vez de un anillo. */
      const padX = geo.hw + 56; const padY = geo.hh + 48;
      if (Math.abs(x - geo.cx) < padX && Math.abs(y - geo.cy) < padY) {
        const band = Math.min(padY, geo.maxY);
        y = geo.cy + (sa >= 0 ? 1 : -1) * (band + Math.max(0, geo.maxY - band) * t);
      }
      return { x, y };
    };

    /* 1 · REUNIÓN ligada al scroll. x/y son deltas respecto a la posición
       dispersa que ya tiene cada flor por CSS (left/top en %), así que basta
       restar su offset dentro del campo. */
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'center center',
        scrub: 0.9,
        invalidateOnRefresh: true, // recalcula destinos al redimensionar
        // la medida caduca con cada refresh (resize, fuentes, swap de página).
        // Va aquí, en el trigger, y no como listener global de ScrollTrigger:
        // así se muere con el gsap.context de la página, sin acumularse.
        onRefreshInit: () => { geo = null; },
      },
    }).fromTo(blooms,
      { x: 0, y: 0, scale: 0.3, autoAlpha: 0.22, xPercent: -50, yPercent: -50 },
      {
        x: (i, el) => target(i).x - el.offsetLeft,
        y: (i, el) => target(i).y - el.offsetTop,
        scale: 1,
        // cada profundidad conserva la opacidad que le da el CSS (--op)
        autoAlpha: (i, el) => parseFloat(getComputedStyle(el).getPropertyValue('--op')) || 1,
        ease: 'none',
        stagger: { each: 0.014, from: 'random' },
      }, 0);

    /* 2 · LA FRASE SE POSA + onda por el ramo (el split ya se creó arriba,
       para poder medir el ancho real del texto) */
    gsap.set(split.words, { yPercent: 118 });
    gsap.set(line, { visibility: 'visible' });
    const settle = () => {
      gsap.timeline()
        .to(split.words, { yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: 0.085 })
        // la onda sale del centro hacia fuera justo cuando cae la última palabra
        .to(pushers, {
          scale: 1.14, duration: 0.42, ease: 'sine.out',
          stagger: { each: 0.014, from: 'center' }, yoyo: true, repeat: 1,
        }, '-=0.45');
    };
    if (line.getBoundingClientRect().top < window.innerHeight * 0.92) gsap.delayedCall(0.25, settle);
    else ScrollTrigger.create({ trigger: section, start: 'top 62%', once: true, onEnter: settle });

    /* 3 · EL CURSOR APARTA las flores mientras lees */
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const qx = pushers.map((p) => gsap.quickTo(p, 'x', { duration: 0.7, ease: 'power3' }));
    const qy = pushers.map((p) => gsap.quickTo(p, 'y', { duration: 0.7, ease: 'power3' }));
    // separación media entre flores ≈ √(área/35) ≈ 150px: con R=270 el puntero
    // siempre lleva un puñado consigo, nunca "no pasa nada"
    const R = 270;    // radio de influencia del puntero
    const FORCE = 68; // cuánto llega a apartarse la flor más cercana
    section.addEventListener('pointermove', (e) => {
      const fb = field.getBoundingClientRect();
      const px = e.clientX - fb.left;
      const py = e.clientY - fb.top;
      blooms.forEach((b, i) => {
        // posición actual = sitio disperso + lo que lleve puesto la reunión
        const dx = b.offsetLeft + gsap.getProperty(b, 'x') - px;
        const dy = b.offsetTop + gsap.getProperty(b, 'y') - py;
        const d = Math.hypot(dx, dy);
        if (d > R || d === 0) { qx[i](0); qy[i](0); return; }
        const f = (1 - d / R) * FORCE;
        qx[i]((dx / d) * f);
        qy[i]((dy / d) * f);
      });
    }, { signal: pageSignal() });
    section.addEventListener('pointerleave', () => {
      pushers.forEach((_, i) => { qx[i](0); qy[i](0); });
    }, { signal: pageSignal() });
  });
}
