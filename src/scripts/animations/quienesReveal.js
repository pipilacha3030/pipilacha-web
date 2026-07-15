/* ============================================================
   Revelado de «quiénes somos», dos piezas:
   1) El marco de la foto se abre con un recorte (clip-path) de
      abajo arriba y la foto asienta su escala. Una vez.
   2) El titular «Un restaurante para curiosos.»: las palabras
      parten separadas en horizontal y cada línea se APRIETA a su
      ancho natural ligada al progreso del scroll (scrub) — el
      texto «enfoca» al llegar. Sin JS o con reduced-motion el h2
      queda intacto y legible (el split solo ocurre aquí).
   ============================================================ */
import { gsap } from '../scroll/scrollTrigger.js';
import { reduceMotion } from '../utils/motion.js';
import { inPageContext } from '../utils/lifecycle.js';

function splitWords(h2) {
  // partir en <span> por palabra conservando el texto accesible en aria-label
  const text = h2.textContent.trim();
  h2.setAttribute('aria-label', text);
  h2.textContent = '';
  const holder = document.createElement('span');
  holder.setAttribute('aria-hidden', 'true');
  text.split(/\s+/).forEach((word, i, arr) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = word;
    holder.appendChild(s);
    if (i < arr.length - 1) holder.appendChild(document.createTextNode(' '));
  });
  h2.appendChild(holder);
  return Array.from(holder.querySelectorAll('.w'));
}

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

    /* — titular: líneas que se aprietan con el scroll (efecto 097) — */
    const h2 = document.querySelector('.quienes__h2');
    if (!h2) return;
    const words = splitWords(h2);

    // agrupar palabras por línea según su posición vertical natural
    const lines = [];
    let top = null, line;
    words.forEach((w) => {
      if (w.offsetTop !== top) { top = w.offsetTop; line = []; lines.push(line); }
      line.push(w);
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: h2, start: 'top 92%', end: 'top 40%', scrub: 0.6 },
    });
    lines.forEach((ws, li) => {
      const left0 = ws[0].offsetLeft;
      ws.forEach((w) => {
        // arranque: desplazada a la derecha proporcional a su sitio en la línea
        const dx = (w.offsetLeft - left0) * 0.6;
        tl.fromTo(w, { x: dx, opacity: 0.35 },
          { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, li * 0.3);
      });
    });
  });
}
