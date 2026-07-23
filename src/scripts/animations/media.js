/* ============================================================
   IMÁGENES: "bloom" — la foto se enfoca como una flor abriéndose
   (fundido + zoom que se asienta + desenfoque que se aclara).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

// la foto de «quiénes» la gestiona heroQuienesScroll.js (slide/fade); aquí solo la barra
const BLOOMS = [
  { wrap: '.barra__media',    img: '.barra__media img'  },
];

export function initMediaBlooms() {
  if (reduceMotion) return;
  inPageContext(() => {
    BLOOMS.forEach(({ wrap: wSel, img: iSel }) => {
      const wrap = document.querySelector(wSel);
      const img  = document.querySelector(iSel);
      if (!wrap) return;
      // `y:0` neutraliza el translateY(20px) que el CSS `.reveal` deja sobre la
      // figura (así no salta durante el bloom).
      gsap.set(wrap, { autoAlpha: 0, y: 0 });
      if (img) gsap.set(img, { scale: 1.08, filter: 'blur(8px)' });
      gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
        // al terminar, sin capas de composición vivas (son las que pintan el seam
        // blanco en el borde del recorte sobre el fondo oscuro de la barra):
        //  · la IMAGEN acaba en scale 1 y blur 0, así que limpiar sus inline de GSAP
        //    la devuelve al CSS sin cambio visual y sin transform residual.
        //  · el WRAP conserva su opacidad (viene de .reveal); solo neutralizamos su
        //    transform con `none` (no clearProps: reexpondría el translateY(20px) del CSS).
        onComplete: () => {
          if (img) gsap.set(img, { clearProps: 'all' });
          wrap.style.transform = 'none';
        }
      })
        .to(wrap, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' }, 0)
        .to(img,  { scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' }, 0);
    });
  });
}
