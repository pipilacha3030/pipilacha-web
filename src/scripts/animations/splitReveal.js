/* ============================================================
   TEXTO DIVIDIDO: párrafos declarativos que entran línea a línea
   (no decoración repetida — solo en el párrafo/frase donde el ritmo
   de la lectura importa; opt-in vía [data-split-lines], igual que
   .reveal/data-parallax). Cada línea sale de detrás de una máscara
   (mask:'lines' de SplitText envuelve en overflow:hidden) y sube a
   su sitio, como si el texto se asentara frase a frase.
   ============================================================ */
import { gsap, SplitText } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initSplitReveal() {
  if (reduceMotion) return; // texto normal, sin dividir: nada que revertir

  inPageContext(() => {
    gsap.utils.toArray('[data-split-lines]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
      gsap.fromTo(split.lines,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
  });
}
