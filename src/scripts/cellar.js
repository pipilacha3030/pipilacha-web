/* ============================================================
   VINOS: índice pegajoso (scrollspy) + scroll suave por sección.
   Por página: el observer se desconecta en destroyPage.
   ============================================================ */
import { lenis } from './scroll/lenis.js';
import { onPageDestroy } from './utils/lifecycle.js';

export function initCellar() {
  const cellar = document.querySelector('.cellar');
  if (!cellar) return;
  const links = Array.from(cellar.querySelectorAll('.cellar-index a'));
  const sections = links.map((a) => document.getElementById(a.dataset.spy)).filter(Boolean);
  const list = cellar.querySelector('.cellar-index__list');
  const setActive = (id) => links.forEach((a) => {
    const on = a.dataset.spy === id;
    a.classList.toggle('is-active', on);
    // en móvil el índice es un dock horizontal: centra el chip activo en la tira
    // (block:'nearest' evita arrastrar el scroll vertical de la página)
    if (on && list && list.scrollWidth > list.clientWidth) {
      a.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  // marca la sección visible mientras se hace scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => io.observe(s));
    onPageDestroy(() => io.disconnect());
  }

  // clic en el índice: lleva a la sección con el scroll suave de Lenis
  links.forEach((a) => a.addEventListener('click', (e) => {
    const target = document.getElementById(a.dataset.spy);
    if (!target) return;
    e.preventDefault();
    setActive(a.dataset.spy);
    // offset mayor en móvil: hay dos docks apilados (nav + índice) que tapar
    const offset = window.innerWidth <= 900 ? -128 : -110;
    if (lenis) lenis.scrollTo(target, { offset });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  if (sections[0]) setActive(sections[0].id);
}
