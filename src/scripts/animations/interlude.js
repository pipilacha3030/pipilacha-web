/* ============================================================
   INTERLUDIO "35 flores" — el ramo ARROPA la frase.
   Las 35 flores (una por cada flor comestible de la temporada, ver
   components/Interlude.astro) empiezan dispersas por toda la sección; el
   scroll las lleva a su ÓRBITA y allí se quedan, navegando. Cuatro gestos,
   cada uno con su motivo:
     1. REUNIÓN (scrub): el recorrido natural de la sección por la pantalla
        lleva a cada flor de su sitio disperso al centro de su anillo, y de
        paso abre la órbita (amplitud 0→1). Sin pin: no alarga el scroll,
        aprovecha el que ya hay. Reversible al subir.
     2. ÓRBITA (perpetua): cada flor recorre un anillo propio alrededor de la
        frase. El anillo es una elipse muy achatada, o sea un aro visto casi
        de canto: en la mitad de abajo la flor viene HACIA nosotros (pasa por
        DELANTE del texto, crece un poco) y en la de arriba se aleja (pasa por
        DETRÁS, encoge). Ahí está el arropar. Cada una con su radio, su
        inclinación, su sentido y su periodo (78-164 s, deliberadamente lento):
        ninguna acompaña a otra, así que el conjunto no gira como una rueda.
     3. LA FRASE SE POSA: las palabras suben desde su máscara y, al posarse,
        una onda recorre el ramo — las flores acusan el peso del texto.
     4. EL DEDO O EL CURSOR APARTAN las flores al leer.

   Cuatro capas anidadas por flor, una por animador, para que nadie se pelee
   por el mismo `transform`:
     .ilf        → GSAP, reunión ligada al scroll (+ z-index de la órbita)
     .ilf__orbit → ticker, la órbita perpetua
     .ilf__push  → GSAP, empuje del cursor y onda de la frase
     img         → CSS, respiración lenta propia (@keyframes ilfDrift)
   ============================================================ */
import { gsap, SplitText, ScrollTrigger } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext, pageSignal, onPageDestroy } from '../utils/lifecycle.js';

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // reparte ángulos sin agrupar
const frac = (n) => n - Math.floor(n);       // secuencias deterministas por índice
const Z_FRONT = 8;                            // .interlude__line vive en z-index 5
const Z_BACK = 2;

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

    /* Geometría, cacheada por refresh: la caja real del texto y el borde útil
       del campo. Todo lo demás (anillos) se deriva de aquí, así que al
       redimensionar las órbitas se recomponen solas. */
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
    /* El ANILLO de cada flor. Elipse muy achatada (ry ≪ rx) centrada en la
       frase y desplazada en vertical: vista de frente es un aro visto casi de
       canto, y recorrerlo hace que la flor pase por delante del texto en la
       mitad de abajo y por detrás en la de arriba.
       El desplazamiento vertical nunca es cero (|off| ≥ 0.26 del hueco): si
       todos los anillos estuviesen centrados en la frase, las 35 la cruzarían
       a la vez y no habría quien la leyera. Así solo la cruzan las de radio
       vertical grande, y de una en una. */
    let rings = null;
    const buildRings = () => {
      if (!geo) geo = measure();
      return blooms.map((_, i) => {
        /* TODOS los parámetros salen de fracciones de irracionales, NUNCA de
           i%n: las flores de una misma variedad van separadas 15 en índice, y
           con un calibre tipo i%5 (15 es múltiplo de 5) las clones heredaban
           exactamente el mismo radio. Si además todos los anillos comparten
           centro, dos clones acaban pisándose. Con secuencias irracionales,
           i e i+15 dan radios, centros y velocidades distintos. */
        const t = frac(i * 0.4142);   // calibre horizontal
        const u = frac(i * 0.6180);   // calibre vertical
        const v = frac(i * 0.7548);   // desplazamiento vertical del anillo
        const h = frac(i * 0.2360);   // desplazamiento horizontal del anillo
        const rx = (0.30 + 0.62 * t) * geo.maxX;
        const ry = (0.10 + 0.30 * u) * geo.maxY;
        const roomY = Math.max(0, geo.maxY - ry);
        const roomX = Math.max(0, geo.maxX - rx);
        // el anillo nunca se centra en la frase (|off| ≥ .26 del hueco): si no,
        // las 35 la cruzarían a la vez y no habría quien la leyera
        const off = (v < 0.5 ? -1 : 1) * (0.26 + 0.74 * frac(v * 7.3)) * roomY;
        const period = 112 + frac(i * 0.3057) * 108;            // 112-220 s: lento a propósito
        return {
          rx, ry,
          cx: geo.cx + (h * 2 - 1) * roomX,
          cy: geo.cy + off,
          ph: i * GOLDEN,
          w: (frac(i * 0.1231) < 0.5 ? -1 : 1) * (Math.PI * 2) / period, // sentidos mezclados
        };
      });
    };

    /* 1 · REUNIÓN ligada al scroll: cada flor va de su sitio disperso al CENTRO
       de su anillo, mientras `amp` abre la órbita de 0 a 1. x/y son deltas
       respecto a la posición que ya tiene por CSS (left/top en %), así que
       basta restar su offset dentro del campo. */
    const amp = { v: 0 };
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
        onRefreshInit: () => { geo = null; rings = null; },
      },
    }).fromTo(blooms,
      { x: 0, y: 0, scale: 0.3, autoAlpha: 0.22, xPercent: -50, yPercent: -50 },
      {
        x: (i, el) => { rings = rings || buildRings(); return rings[i].cx - el.offsetLeft; },
        y: (i, el) => { rings = rings || buildRings(); return rings[i].cy - el.offsetTop; },
        scale: 1,
        // cada profundidad conserva la opacidad que le da el CSS (--op)
        autoAlpha: (i, el) => parseFloat(getComputedStyle(el).getPropertyValue('--op')) || 1,
        ease: 'none',
        stagger: { each: 0.014, from: 'random' },
      }, 0)
      .to(amp, { v: 1, ease: 'none' }, 0);

    /* 2 · ÓRBITA perpetua. Un solo callback del ticker mueve las 35: 35 tweens
       con su onUpdate costarían lo mismo y encima habría que sincronizarlos.
       El z-index solo se escribe cuando CAMBIA de lado (2 veces por vuelta),
       no en cada frame. */
    const orbits = blooms.map((b) => b.querySelector('.ilf__orbit'));
    /* Solo el primer plano (d2: nítidas, sin desenfoque) llega a pasar POR
       DELANTE del texto; las difusas del fondo y la naranja se quedan siempre
       detrás. Además de ser lo coherente —lo borroso está lejos—, es lo que
       mantiene legible la frase: dejando cruzar a las 35 había once encima a
       la vez y no se leía. */
    const backOnly = blooms.map((b) => b.classList.contains('ilf--back')
      || !b.classList.contains('ilf--d2'));
    const zNow = blooms.map(() => 0);
    const spin = (time) => {
      if (!rings) rings = buildRings();
      for (let i = 0; i < blooms.length; i++) {
        const o = rings[i];
        const ph = o.ph + o.w * time;
        const s = Math.sin(ph);                 // +1 = cerca (delante) · -1 = lejos (detrás)
        const a = amp.v;
        // la escala vende la profundidad: cerca crece, lejos encoge
        orbits[i].style.transform =
          `translate(${o.rx * Math.cos(ph) * a}px, ${o.ry * s * a}px) scale(${1 + 0.17 * s * a})`;
        const z = (backOnly[i] || s <= 0) ? Z_BACK : Z_FRONT;
        if (z !== zNow[i]) { blooms[i].style.zIndex = z; zNow[i] = z; }
      }
    };
    gsap.ticker.add(spin);
    // el revert del gsap.context no conoce los callbacks del ticker: fuera a mano
    onPageDestroy(() => gsap.ticker.remove(spin));

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

    /* 3 · EL DEDO O EL CURSOR APARTAN las flores mientras lees.
       Con puntero fino el efecto sigue al ratón; en táctil ocurre mientras
       arrastras el dedo (pointermove también dispara con el dedo apoyado) y
       un toque abre además el ramo alrededor. Todo passive y sin
       preventDefault: no se toca el scroll nativo del móvil. */
    const signal = pageSignal();
    const qx = pushers.map((p) => gsap.quickTo(p, 'x', { duration: 0.7, ease: 'power3' }));
    const qy = pushers.map((p) => gsap.quickTo(p, 'y', { duration: 0.7, ease: 'power3' }));

    /* El comportamiento lo decide el EVENTO (e.pointerType), no un media query:
       `(pointer:fine)` describe el puntero PRINCIPAL del aparato, así que en un
       portátil táctil o en un iPad con trackpad la rama táctil no llegaría a
       registrarse nunca. Preguntando al evento, cada gesto se comporta como lo
       que es, y los híbridos funcionan con ratón y con dedo.
       Separación media entre flores ≈ √(área/35) ≈ 150px: con estos radios el
       puntero siempre lleva un puñado consigo. Con el dedo, que tapa lo que
       toca, el radio baja y el empuje sube — así el gesto se ve POR FUERA de
       la mano. */
    const MOUSE = { R: 270, FORCE: 68 };
    const TOUCH = { R: 210, FORCE: 88 };
    const cfg = (e) => (e.pointerType === 'mouse' ? MOUSE : TOUCH);

    // posición actual de cada flor = sitio disperso + lo que lleve la reunión
    const near = (px, py, fn) => {
      blooms.forEach((b, i) => {
        const dx = b.offsetLeft + gsap.getProperty(b, 'x') - px;
        const dy = b.offsetTop + gsap.getProperty(b, 'y') - py;
        fn(i, dx, dy, Math.hypot(dx, dy));
      });
    };
    const repel = (e) => {
      const { R, FORCE } = cfg(e);
      const fb = field.getBoundingClientRect();
      near(e.clientX - fb.left, e.clientY - fb.top, (i, dx, dy, d) => {
        if (d > R || d === 0) { qx[i](0); qy[i](0); return; }
        const f = (1 - d / R) * FORCE;
        qx[i]((dx / d) * f);
        qy[i]((dy / d) * f);
      });
    };
    const relax = () => { pushers.forEach((_, i) => { qx[i](0); qy[i](0); }); };

    section.addEventListener('pointermove', repel, { signal, passive: true });

    // TÁCTIL: el toque abre el ramo (las de alrededor dan un respingo)…
    section.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      repel(e);
      const fb = field.getBoundingClientRect();
      near(e.clientX - fb.left, e.clientY - fb.top, (i, _dx, _dy, d) => {
        if (d > TOUCH.R) return;
        gsap.fromTo(pushers[i], { scale: 1 },
          { scale: 1.2, duration: 0.3, ease: 'sine.out', yoyo: true, repeat: 1 });
      });
    }, { signal, passive: true });
    // …y al levantar el dedo vuelve todo a su sitio. pointercancel además cubre
    // el caso de que el navegador se quede el gesto para hacer scroll: sin él,
    // las flores se quedarían apartadas para siempre.
    const release = (e) => { if (e.pointerType !== 'mouse') relax(); };
    section.addEventListener('pointerup', release, { signal, passive: true });
    section.addEventListener('pointercancel', release, { signal, passive: true });
    section.addEventListener('pointerleave', relax, { signal, passive: true });
  });
}
