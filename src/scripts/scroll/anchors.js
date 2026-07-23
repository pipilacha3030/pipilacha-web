/* Anclas suaves del contenido (por página: los enlaces se renuevan en cada swap).
   Los listeners mueren con los elementos al intercambiar <main>. */
import { lenis } from './lenis.js';

export function bindPageAnchors() {
  if (!lenis) return;
  document.querySelectorAll('main a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: 0 }); }
    });
  });
}
