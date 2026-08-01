/* ============================================================
   CREATOR GARDEN · movimiento e interacción
   Punto de entrada propio. NO importa main.js a propósito: esta
   página no tiene nav de sitio, router, cookies, galería ni widget
   de reserva, así que arrastrar ese árbol solo costaría descarga y
   trabajo por frame.

   Sí reutiliza scroll/scrollTrigger.js, que es donde se registran los
   plugins y donde el ticker de GSAP conduce a Lenis. Importar gsap por
   otro lado dejaría el plugin sin registrar y un segundo driver.

   Reglas de la casa aplicadas aquí:
   · solo se animan transform y opacity (ni layout ni paint)
   · lo que entra usa expo.out; lo que responde a un gesto, rápido
   · con prefers-reduced-motion no se crea NINGÚN tween: el CSS ya
     deja todo visible, así que la página se lee igual y sin trabajo

   Lo que se puede usar (buscador, copiar, navegación) va SIEMPRE,
   con o sin movimiento.
   ============================================================ */
import { gsap, ScrollTrigger, SplitText } from './scroll/scrollTrigger.js';
import { reduceMotion } from './utils/motion.js';

/* Las líneas y palabras se parten DESPUÉS de que las fuentes asienten.
   Si se parte antes, se mide con la fuente de reserva y los saltos de
   línea quedan donde no son: el reveal se ve descuadrado en carga fría. */
const listo = document.fonts ? document.fonts.ready : Promise.resolve();

/* ─── movimiento ─────────────────────────────────────────────── */

/* La portada NO se anima con scroll. Todo lo que cae en la primera
   pantalla tiene que estar visible al cargar: con ScrollTrigger, un
   elemento que queda unos píxeles por debajo de la línea de disparo se
   queda invisible hasta que el usuario mueve la rueda, y parece roto.
   Aquí entra por tiempo, encadenado. */
function portada() {
  const open = document.querySelector('.gd-open');
  if (!open) return;
  const titulo = open.querySelector('[data-gd-words]');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (titulo) {
    const split = new SplitText(titulo, { type: 'lines,words', linesClass: 'gd-line' });
    gsap.set(titulo, { opacity: 1 });
    tl.from(split.words, { yPercent: 108, duration: 1.2, stagger: 0.05 }, 0.15);
  }
  tl.to(open.querySelectorAll('.gd-reveal'),
        { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.35);
}

function titulares() {
  // titulares: palabra a palabra, subiendo desde detrás de su propia línea
  gsap.utils.toArray('[data-gd-words]').forEach((el) => {
    if (el.closest('.gd-open')) return; // la portada la lleva portada()
    const split = new SplitText(el, { type: 'lines,words', linesClass: 'gd-line' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.words, {
      yPercent: 108, duration: 1.1, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 84%' },
    });
  });

  // párrafos largos: línea a línea, más contenido que el titular
  gsap.utils.toArray('[data-gd-lines]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'gd-line' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.lines, {
      yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });
}

function revelados() {
  gsap.utils.toArray('.gd-reveal').forEach((el) => {
    if (el.closest('.gd-open')) return; // idem: la portada entra por tiempo
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.05, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // grupos en cascada: entran como una unidad, no uno a uno
  gsap.utils.toArray('[data-gd-stagger]').forEach((grupo) => {
    const hijos = grupo.querySelectorAll('.gd-item');
    if (!hijos.length) return;
    gsap.to(hijos, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: grupo, start: 'top 85%' },
    });
  });
}

function parallax() {
  gsap.utils.toArray('[data-gd-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.gdParallax) || 0.1;
    gsap.fromTo(el,
      { yPercent: -amt * 50 },
      { yPercent: amt * 50, ease: 'none',
        scrollTrigger: { trigger: el.closest('section, figure') || el,
                         start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ─── interacción ────────────────────────────────────────────── */

/* Navegación: marca el bloque en el que estás. Es orientación, no
   adorno — y en móvil es lo único que orienta. */
function navegacion() {
  const enlaces = new Map(
    [...document.querySelectorAll('[data-gd-nav]')].map((a) => [a.dataset.gdNav, a])
  );
  if (!enlaces.size) return;
  enlaces.forEach((a, id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => a.classList.toggle('is-on', self.isActive),
    });
  });
}

/* Copiar al portapapeles. La API exige contexto seguro y un gesto real
   del usuario; si falla cualquiera de las dos cosas cae al textarea de
   toda la vida y, si tampoco, se avisa en el propio botón en vez de
   quedarse callado. */
function copiar() {
  const botones = [...document.querySelectorAll('[data-gd-copy]')];
  if (!botones.length) return;

  botones.forEach((b) => {
    const original = b.textContent;
    b.addEventListener('click', async () => {
      const texto = b.dataset.gdCopy;
      let ok = true;
      try {
        await navigator.clipboard.writeText(texto);
      } catch {
        ok = respaldoCopia(texto);
      }
      b.textContent = ok ? 'Copiado' : 'Selecciona y copia';
      b.classList.toggle('is-ok', ok);
      clearTimeout(b._t);
      b._t = setTimeout(() => {
        b.textContent = original;
        b.classList.remove('is-ok');
      }, 1800);
    });
  });
}

function respaldoCopia(texto) {
  const ta = document.createElement('textarea');
  ta.value = texto;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}

/* Buscador de flores. Treinta y cuatro entradas se recorren mal con el
   pulgar, y quien busca una flor concreta ya sabe su nombre. */
function buscadorFlores() {
  const lista = document.querySelector('[data-gd-dicc]');
  if (!lista) return;

  const items = [...lista.querySelectorAll('[data-gd-flor]')];
  const buscador = document.querySelector('[data-gd-buscar]');
  const vacio = document.querySelector('[data-gd-vacio]');
  if (!buscador) return;

  // sin acentos: quien escribe "sauco" tiene que encontrar "saúco"
  const plano = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  buscador.addEventListener('input', () => {
    const q = plano(buscador.value.trim());
    let visibles = 0;
    items.forEach((li) => {
      const ok = !q || plano(li.dataset.gdFlor).includes(q);
      li.hidden = !ok;
      if (ok) visibles++;
    });
    if (vacio) vacio.hidden = visibles > 0;
    ScrollTrigger.refresh();
  });
}

/* ─── arranque ───────────────────────────────────────────────── */

function init() {
  if (!reduceMotion) {
    portada();
    titulares();
    revelados();
    parallax();
  }
  navegacion();
  copiar();
  buscadorFlores();
  ScrollTrigger.refresh();
}

listo.then(() => {
  init();
  // segundo refresh de cortesía: las imágenes perezosas cambian la altura
  // de la página y dejarían los disparadores calculados sobre una posición vieja
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
});
