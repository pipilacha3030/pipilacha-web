/* ============================================================
   Banda «el jardín que se vacía».

   Tres cosas, todas mejoras progresivas — sin este archivo la banda sigue
   completa: el matorral entero a contraste pleno, los pétalos derivando por
   CSS y el formulario enviando por POST normal a /api/suscribir.php.

   1. Vaciado: los 32 nombres se apagan uno a uno y aparece la que queda en
      pie. Lo mueve el SCROLL (scrub), no un temporizador — por eso subir lo
      vuelve a encender.
   2. Puntero: los pétalos se apartan de donde está el dedo o el ratón.
   3. Alta sin recargar: fetch + respuesta en el sitio.

   OJO — ESTO CORRE EN LAS 23 PÁGINAS (la banda va dentro del footer). De ahí
   que sea un solo ScrollTrigger, un solo listener de puntero y ni un bucle
   rAF propio: quien tira es el gsap.ticker que ya mueve Lenis.

   Reglas de la casa: todo tween dentro de inPageContext() (gsap.context) y los
   listeners con { signal: pageSignal() }, así destroyPage() lo revierte entero
   en cada transición de página.
   ============================================================ */
// gsap SIEMPRE desde scroll/scrollTrigger.js: es quien garantiza el plugin registrado
// (aquí se usa vía `scrollTrigger:` de la timeline) y el driver único de Lenis.
import { gsap } from './scroll/scrollTrigger.js';
import { reduceMotion } from './utils/motion.js';
import { inPageContext, pageSignal } from './utils/lifecycle.js';

const APAGADO = .1;    // opacidad de un nombre ya apagado: queda el fantasma de lo que hubo
const RADIO = 260;     // px: hasta dónde nota el pétalo al puntero
const EMPUJE = 46;     // px: cuánto se aparta como mucho

/* ---------- 1 · el vaciado, movido por el scroll ---------- */
function initVaciado(seccion) {
  const lista = seccion.querySelector('[data-jardin-lista]');
  const nombres = [...seccion.querySelectorAll('.jardin__nombre')];
  const ultima = seccion.querySelector('[data-jardin-ultima]');
  if (!lista || nombres.length < 2 || !ultima) return;

  /* Orden de apagado. Un paso de 13 sobre 32 los recorre todos sin repetir
     (son primos entre sí) y salta por el matorral, así que no se ve la
     barrida de izquierda a derecha que delataría un bucle. */
  const orden = nombres.map((_, k) => nombres[(k * 13) % nombres.length]);
  // la que se queda en pie va la última del array: que se apague justo cuando
  // aparece su versión grande es el relevo, no una coincidencia
  const rezagada = nombres[nombres.length - 1];
  orden.splice(orden.indexOf(rezagada), 1);
  orden.push(rezagada);

  inPageContext(() => {
    /* La ventana va del momento en que el matorral ASOMA por abajo al momento en
       que la flor que queda en pie está a media pantalla. Medido, no a ojo: con
       la sección entera de disparador el jardín llegaba ya al 96% apagado justo
       cuando la banda quedaba encuadrada, o sea que el vaciado —que es toda la
       idea— ocurría fuera de la vista. */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: lista,
        start: 'top bottom',
        endTrigger: ultima,
        end: 'center 55%',
        scrub: .6,
      },
    });

    orden.forEach((el, k) => {
      tl.to(el, { opacity: APAGADO, duration: .7, ease: 'none' }, k * .22);
    });
    // entra solapada con el final del apagado: el relevo sin corte en medio
    tl.fromTo(ultima,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 1.6, ease: 'power2.out' },
      orden.length * .22 - 1.1);
  });
}

/* ---------- 2 · los pétalos notan el puntero ---------- */
function initPuntero(seccion, campo) {
  const petalos = [...seccion.querySelectorAll('.jardin__petalo')];
  if (!petalos.length) return;

  inPageContext(() => {
    /* quickTo interpola en el ticker en vez de escribir en cada evento: un
       pointermove puede dispararse 120 veces por segundo y no queremos 120
       escrituras de estilo. */
    const mov = petalos.map((p) => ({
      d: parseFloat(p.dataset.d) || 0,
      px: parseFloat(p.dataset.x) / 100,
      py: parseFloat(p.dataset.y) / 100,
      x: gsap.quickTo(p, 'x', { duration: .8, ease: 'power3.out' }),
      y: gsap.quickTo(p, 'y', { duration: .8, ease: 'power3.out' }),
    }));

    /* En móvil pointermove TAMBIÉN dispara mientras arrastras para scrollear,
       así que el efecto sucede durante el scroll. Sin preventDefault y en
       passive: el scroll no se toca. */
    seccion.addEventListener('pointermove', (e) => {
      // una sola lectura de geometría por evento, no una por pétalo
      const r = campo.getBoundingClientRect();
      if (!r.width) return;

      for (const m of mov) {
        const dx = e.clientX - (r.left + r.width * m.px);
        const dy = e.clientY - (r.top + r.height * m.py);
        const dist = Math.hypot(dx, dy);
        if (dist > RADIO || dist === 0) { m.x(0); m.y(0); continue; }
        // cerca empuja fuerte, al borde del radio no empuja nada
        const f = (1 - dist / RADIO) * EMPUJE * m.d;
        m.x(-dx / dist * f);
        m.y(-dy / dist * f);
      }
    }, { passive: true, signal: pageSignal() });

    // al salir el puntero vuelven solos a su sitio
    seccion.addEventListener('pointerleave', () => {
      for (const m of mov) { m.x(0); m.y(0); }
    }, { passive: true, signal: pageSignal() });
  });
}

/* ---------- 3 · alta sin recargar ---------- */
function initAlta(seccion) {
  const form = seccion.querySelector('.jardin__form');
  if (!form) return;

  const msg = form.querySelector('.jardin__msg');
  const boton = form.querySelector('.jardin__submit');
  const etiqueta = boton.querySelector('span');
  const original = etiqueta.textContent;
  const ultima = seccion.querySelector('[data-jardin-ultima]');

  const responder = (texto, error) => {
    msg.textContent = texto;
    msg.classList.toggle('is-error', !!error);
    msg.classList.add('is-on');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // La validación nativa ya cubre formato y casilla; que hable el navegador.
    if (!form.reportValidity()) return;

    boton.disabled = true;
    etiqueta.textContent = msg.dataset.sending;
    msg.classList.remove('is-on', 'is-error');

    try {
      const r = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json', 'X-Requested-With': 'fetch' },
      });
      const datos = await r.json().catch(() => ({ ok: false }));

      if (datos.ok) {
        responder(msg.dataset.ok, false);
        form.reset();
        // la flor que quedó en pie acusa recibo: un pulso corto, no una fiesta
        if (ultima && !reduceMotion) {
          gsap.fromTo(ultima, { scale: 1 },
            { scale: 1.04, duration: .3, yoyo: true, repeat: 1, ease: 'power2.inOut' });
        }
      } else {
        // El PHP manda motivo concreto cuando lo hay (correo inválido, 429).
        responder(datos.error || msg.dataset.error, true);
      }
    } catch {
      responder(msg.dataset.error, true);
    } finally {
      boton.disabled = false;
      etiqueta.textContent = original;
    }
  }, { signal: pageSignal() });
}

export function initNewsletter() {
  const seccion = document.querySelector('.jardin');
  if (!seccion) return;

  const campo = seccion.querySelector('.jardin__campo');
  /* Con movimiento reducido no hay vaciado ni pétalos reactivos: el CSS deja el
     matorral entero y la última flor ya puestos. El alta sí, que no es adorno. */
  if (campo && !reduceMotion) {
    initVaciado(seccion);
    initPuntero(seccion, campo);
  }
  initAlta(seccion);
}
