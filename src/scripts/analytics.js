/* ============================================================
   Google Analytics 4 — SOLO se carga tras aceptar la categoría
   «analítica» del banner de cookies (ver cookies.js). Sin ese
   consentimiento no se descarga gtag.js ni se instala ninguna
   cookie de Google: es el patrón limpio según la AEPD.

   ► PARA ACTIVARLO: pega el ID de medición de la propiedad GA4
     (Administrar → Flujos de datos → «G-XXXXXXXXXX») en GA_ID
     y ejecuta `npm run build`. Con GA_ID vacío, este módulo es
     inerte: no carga nada y no rompe nada.

   Las vistas de página las envía el router SPA (transitions.js
   llama a trackPageView en cada cambio de página): GA4 solo no
   vería las transiciones porque no hay recarga real.
   ============================================================ */
import { flushPending, dropPending } from './conversions.js';

export const GA_ID = 'G-N137XN3B2V';

let loaded = false;

export function loadAnalytics() {
  if (loaded || !GA_ID) return;
  loaded = true;
  window[`ga-disable-${GA_ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // send_page_view:false — la vista inicial también la manda trackPageView,
  // así TODAS las vistas salen por el mismo camino (SPA incluida)
  window.gtag('config', GA_ID, { send_page_view: false });
  // preconnect: adelanta el handshake con el servidor de Google, pero SOLO aquí
  // (ya hay consentimiento). Nunca en el <head> incondicional → no conectaríamos
  // con Google antes de que el visitante acepte. Guardián para no duplicarlo.
  if (!document.querySelector('link[data-pc="gtm"]')) {
    const pc = document.createElement('link');
    pc.rel = 'preconnect'; pc.href = 'https://www.googletagmanager.com';
    pc.dataset.pc = 'gtm';
    document.head.appendChild(pc);
  }
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  trackPageView();
  flushPending(); // eventos de conversión ocurridos antes de aceptar (p. ej. reserva_view)
}

/* Al rechazar (o retirar) el consentimiento: se apaga la medición con la
   señal estándar de Google y se barren las cookies _ga que pudieran quedar
   de una visita anterior (mejor esfuerzo: con y sin dominio raíz). */
export function disableAnalytics() {
  dropPending(); // lo que estuviera esperando consentimiento se descarta, no se envía
  if (!GA_ID) return;
  window[`ga-disable-${GA_ID}`] = true;
  const past = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const root = location.hostname.replace(/^www\./, '');
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_')) {
      document.cookie = `${name}=; expires=${past}; path=/; domain=.${root}`;
      document.cookie = `${name}=; expires=${past}; path=/`;
    }
  });
}

export function trackPageView() {
  if (!loaded || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_location: location.href,
    page_title: document.title,
  });
}
