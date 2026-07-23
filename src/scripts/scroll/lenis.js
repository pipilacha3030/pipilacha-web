/* Lenis: scroll suave. La instancia es única para toda la sesión.
   El driver es el ticker de GSAP (ver scroll/scrollTrigger.js): un solo
   raf por frame — antes había un bucle rAF propio ADEMÁS del ticker y
   lenis.raf corría dos veces. */
import Lenis from 'lenis';
import { reduceMotion } from '../utils/motion.js';

export const lenis = reduceMotion
  ? null
  : new Lenis({ duration: 0.9, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

if (lenis) window.lenis = lenis; // expuesto para depuración (útil con las preview tools)
