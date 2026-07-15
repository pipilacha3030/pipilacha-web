/* ============================================================
   Revelado de «quiénes somos»: el marco se abre con un recorte
   (clip-path) de abajo arriba y la foto asienta su escala — un
   revelado de imagen moderno, en lugar de la antigua máscara de
   flor. Se dispara una vez al entrar en viewport. Sin motion, el
   CSS deja el marco abierto y la foto a escala natural.
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

export function initQuienesReveal() {
  if (reduceMotion) return;
  const frame = document.querySelector('.quienes__frame');
  if (!frame) return;
  const img = frame.querySelector('img');

  inPageContext(() => {
    gsap.set(frame, { clipPath: 'inset(100% 0 0 0)' }); // recortado desde arriba
    if (img) gsap.set(img, { scale: 1.18 });
    gsap.timeline({
      scrollTrigger: { trigger: frame, start: 'top 82%', once: true },
      onComplete: () => {
        gsap.set(frame, { clearProps: 'clipPath' });
        if (img) gsap.set(img, { clearProps: 'transform' });
      },
    })
      .to(frame, { clipPath: 'inset(0% 0 0 0)', duration: 1.15, ease: 'expo.out' }, 0)
      .to(img, { scale: 1, duration: 1.4, ease: 'expo.out' }, 0);
  });
}
