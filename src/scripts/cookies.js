/* ============================================================
   Consentimiento de cookies (LSSI-CE + RGPD, criterio AEPD).
   - Banner con Aceptar / Rechazar al MISMO nivel (rechazar tan
     fácil como aceptar) + Preferencias.
   - Tres categorías reales: técnicas (necesarias, exentas), de
     reservas (el widget de TheFork, tercero) y analítica (Google
     Analytics 4, tercero — ver analytics.js). Nada de marketing.
   - Ni el iframe de TheFork ni gtag.js se cargan hasta que se
     acepta su categoría (bloqueo previo de cookies de terceros).
   - Consentimientos guardados ANTES de existir la analítica no
     la incluyen → cuenta como rechazada (se puede activar desde
     «Configurar cookies» del pie); no se re-pregunta.
   Se inicializa UNA vez (el banner/diálogo viven fuera de <main>,
   persisten entre transiciones); el gateo del widget se re-aplica
   por página desde initPage() porque el <main> se intercambia.
   ============================================================ */
import { loadAnalytics, disableAnalytics } from './analytics.js';

const KEY = 'pipilacha_consent_v1';

/** @returns {{reservas:boolean, analitica?:boolean, ts:number}|null} */
function getConsent() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
function saveConsent({ reservas, analitica }) {
  try { localStorage.setItem(KEY, JSON.stringify({ reservas, analitica, ts: Date.now() })); } catch {}
}

/* ---- gateo de Google Analytics ----
   Solo carga gtag.js con consentimiento de analítica; al rechazar se apaga
   la medición y se barren las cookies _ga. Con GA_ID vacío no hace nada. */
function applyAnalyticsConsent() {
  const c = getConsent();
  if (c && c.analitica) loadAnalytics();
  else disableAnalytics();
}

/* ---- gateo del widget de TheFork (por página) ----
   El iframe se emite con data-src (sin src → no carga ni pide cookies).
   Solo se le pone src si hay consentimiento de reservas; si no, se
   muestra el aviso con botón para activarlo sin salir de la página. */
export function applyWidgetConsent() {
  const iframe = document.querySelector('iframe[data-src][data-consent="reservas"]');
  if (!iframe) return;
  const frame = iframe.closest('.reserva-widget__frame');
  const notice = frame ? frame.querySelector('.reserva-consent') : null;
  const loading = frame ? frame.querySelector('.reserva-widget__loading') : null;
  const consent = getConsent();

  if (consent && consent.reservas) {
    if (!iframe.src) {
      // preconnect a TheFork en el momento del consentimiento (no antes): misma
      // razón que en analytics.js — nada de conectar con el tercero sin permiso.
      if (!document.querySelector('link[data-pc="thefork"]')) {
        const pc = document.createElement('link');
        pc.rel = 'preconnect'; pc.href = 'https://widget.thefork.com';
        pc.dataset.pc = 'thefork';
        document.head.appendChild(pc);
      }
      iframe.addEventListener('load', () => loading && loading.classList.add('is-loaded'), { once: true });
      iframe.src = iframe.dataset.src;
    }
    iframe.hidden = false;
    if (notice) notice.hidden = true;
    if (loading) loading.hidden = false;
  } else {
    iframe.hidden = true;
    if (loading) loading.hidden = true;
    if (notice) notice.hidden = false;
  }
}

export function initCookies() {
  const banner = document.getElementById('cookieBanner');
  const dialog = document.getElementById('cookiePrefs');
  if (!banner || !dialog) return;

  const toggleReservas = dialog.querySelector('#cookieReservas');
  const toggleAnalitica = dialog.querySelector('#cookieAnalitica');
  const showBanner = (v) => banner.classList.toggle('is-visible', v);

  const decide = ({ reservas, analitica }) => {
    saveConsent({ reservas, analitica });
    showBanner(false);
    if (dialog.open) dialog.close();
    applyWidgetConsent();
    applyAnalyticsConsent();
  };
  const decideAll = (v) => decide({ reservas: v, analitica: v });

  // Banner: aceptar / rechazar al mismo nivel
  banner.querySelector('[data-cc="accept"]').addEventListener('click', () => decideAll(true));
  banner.querySelector('[data-cc="reject"]').addEventListener('click', () => decideAll(false));

  // Abrir preferencias (desde el banner o desde el pie, en cualquier momento)
  const openPrefs = () => {
    const c = getConsent();
    if (toggleReservas) toggleReservas.checked = !!(c && c.reservas);
    if (toggleAnalitica) toggleAnalitica.checked = !!(c && c.analitica);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };
  banner.querySelector('[data-cc="prefs"]').addEventListener('click', openPrefs);
  document.querySelectorAll('[data-cc-open]').forEach((el) =>
    el.addEventListener('click', (e) => { e.preventDefault(); openPrefs(); }));

  // Diálogo de preferencias
  dialog.querySelector('[data-cc="save"]').addEventListener('click', () => decide({
    reservas: !!(toggleReservas && toggleReservas.checked),
    analitica: !!(toggleAnalitica && toggleAnalitica.checked),
  }));
  dialog.querySelector('[data-cc="accept-all"]').addEventListener('click', () => decideAll(true));
  dialog.querySelector('[data-cc="reject-all"]').addEventListener('click', () => decideAll(false));
  dialog.querySelector('[data-cc="close"]').addEventListener('click', () => dialog.close());
  // clic en el backdrop del <dialog> cierra sin decidir
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  // Botón dentro del aviso del widget de reservas (delegado: el <main> cambia).
  // Solo activa RESERVAS: conserva la elección previa de analítica.
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cc="accept-reservas"]')) {
      const c = getConsent();
      decide({ reservas: true, analitica: !!(c && c.analitica) });
    }
  });

  // Primera visita: aún no ha decidido → mostrar banner
  if (!getConsent()) showBanner(true);
  applyWidgetConsent();
  applyAnalyticsConsent();
}
