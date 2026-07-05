/* GSAP + ScrollTrigger: registro del plugin y sincronización con Lenis.
   Importar gsap/ScrollTrigger SIEMPRE desde aquí: garantiza que el plugin
   está registrado y el driver conectado antes de crear cualquier trigger. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from './lenis.js';

gsap.registerPlugin(ScrollTrigger);

// globals de depuración (antes los exponían los <script> del vendor)
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000)); // driver único de Lenis
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
