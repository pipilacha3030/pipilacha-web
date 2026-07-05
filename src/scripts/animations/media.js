/* ============================================================
   IMÁGENES: "bloom" — la foto se enfoca como una flor abriéndose
   (fundido + zoom que se asienta + desenfoque que se aclara).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

const BLOOMS = [
  { wrap: '.quienes__visual', img: '.quienes__media img' },
  { wrap: '.barra__media',    img: '.barra__media img'  },
];

export function initMediaBlooms() {
  if (reduceMotion) return;
  inPageContext(() => {
    BLOOMS.forEach(({ wrap: wSel, img: iSel }) => {
      const wrap = document.querySelector(wSel);
      const img  = document.querySelector(iSel);
      if (!wrap) return;
      gsap.set(wrap, { autoAlpha: 0, y: 0 });
      if (img) gsap.set(img, { scale: 1.08, filter: 'blur(8px)' });
      gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
        // sin blur residual: evita dejar una capa de composición viva tras la entrada
        onComplete: () => { if (img) gsap.set(img, { clearProps: 'filter' }); }
      })
        .to(wrap, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, 0)
        .to(img,  { scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' }, 0);
    });
  });
}
