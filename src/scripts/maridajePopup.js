/* ============================================================
   POP-UP DEL MARIDAJE (página de vinos). A los 5 s de llegar,
   la tarjeta .mpop ofrece el maridaje «Copa a copa».
   - Una vez por sesión (sessionStorage): las transiciones SPA
     re-ejecutan initPage() y sin esta marca saldría en cada
     visita a /vinos/ — sería un incordio, no una invitación.
   - Si el banner de cookies está abierto, no sale (el banner
     manda; se reintenta en la siguiente visita a la página).
   - Timer y listeners se limpian en destroyPage (lifecycle).
   ============================================================ */
import { pageSignal, onPageDestroy } from './utils/lifecycle.js';

const KEY = 'pipilacha_mpop_v1';

export function initMaridajePopup() {
  const pop = document.getElementById('maridajePop');
  if (!pop) return; // solo existe en /vinos/
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch {}

  const banner = document.getElementById('cookieBanner');

  const show = () => {
    if (banner && banner.classList.contains('is-visible')) return;
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    pop.hidden = false;
    // doble rAF: el navegador pinta el estado oculto antes de animar la entrada
    requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('is-in')));
  };
  const hide = () => {
    pop.classList.remove('is-in');
    setTimeout(() => { pop.hidden = true; }, 650); // tras la transición de salida
  };

  const timer = setTimeout(show, 5000);
  onPageDestroy(() => clearTimeout(timer));

  pop.querySelector('.mpop__close').addEventListener('click', hide, { signal: pageSignal() });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pop.classList.contains('is-in')) hide();
  }, { signal: pageSignal() });
}
