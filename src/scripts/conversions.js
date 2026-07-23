/* ============================================================
   Eventos de conversión — lo que de verdad importa medir.

   GA4 por defecto solo cuenta vistas y scroll: sabe cuánta gente
   entra, no si la web genera reservas. Aquí se marcan los tres
   momentos del embudo, más la llamada de teléfono:

     reserva_click    clic en cualquier CTA que lleva a /reservas/
     reserva_view     llegada a la página de reservas
     reserva_widget   el calendario de TheFork terminó de cargar
     telefono_click   clic en un tel: (la otra vía real de reserva)

   ► LÍMITE HONESTO: la reserva se confirma DENTRO del iframe de
     TheFork, en otro origen. El navegador no deja leer nada de
     ahí, así que la reserva completada NO es medible desde la
     web — hay que cruzarla con el panel de TheFork. Lo que sí
     mide esto es toda la intención previa, que ya permite
     comparar canales entre sí.

   ► EN GA: estos eventos llegan solos, pero hay que marcarlos
     como «evento clave» en Administrar → Eventos para que
     cuenten como conversión en los informes.

   Nada se envía sin consentimiento: trackEvent es inerte
   mientras gtag no exista (lo carga analytics.js tras aceptar).
   ============================================================ */
import { pageSignal } from './utils/lifecycle.js';

/* Enlaces de reserva en ES y EN. Todos los CTA del sitio (nav, footer,
   botones de página y el pop-up de maridaje) usan rutas raíz-absolutas,
   así que un solo patrón los cubre sin tocar el markup de cada uno. */
const RESERVAS = /^\/(en\/)?reservas\/?$/;

export function trackEvent(name, params = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

export function initConversions() {
  const signal = pageSignal();
  const origen = location.pathname;

  /* Delegado en document: sobrevive a que el <main> se intercambie en las
     transiciones y no necesita re-atarse a cada botón. El listener muere
     con el AbortController de la página. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';

    if (RESERVAS.test(href)) {
      trackEvent('reserva_click', {
        // qué botón exactamente: distingue el CTA del hero del de la nav
        link_text: (a.textContent || '').trim().slice(0, 60),
        origen,
      });
    } else if (href.startsWith('tel:')) {
      trackEvent('telefono_click', { origen });
    }
  }, { signal });

  /* A partir de aquí, solo en la página de reservas */
  const iframe = document.querySelector('iframe[data-consent="reservas"]');
  if (!iframe) return;

  trackEvent('reserva_view', { origen });

  /* El src se le pone después (applyWidgetConsent, tras consentimiento de
     reservas), así que el listener se ata ANTES: initConversions() corre
     por delante en initPage(). Si el visitante nunca acepta esas cookies,
     el load no llega nunca — y eso también es una señal útil. */
  iframe.addEventListener('load', () => trackEvent('reserva_widget', { origen }), {
    signal,
    once: true,
  });
}
