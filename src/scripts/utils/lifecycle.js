/* ============================================================
   Ciclo de vida por página (la transición asíncrona intercambia
   <main> sin recargar). Tres mecanismos, uno por tipo de recurso:

   - pageSignal():   AbortController → listeners de documento/ventana
   - onPageDestroy(): motores con rAF/observers registran su parada
   - inPageContext(): gsap.context → TODO tween/ScrollTrigger de página
                      se crea dentro y destroyPage() lo revierte entero
                      (sustituye al kill manual trigger a trigger)
   ============================================================ */
import { gsap } from 'gsap';

let ctl = new AbortController();
const cleanups = [];
let ctx = null;
let generation = 0; // invalida trabajos async (p. ej. el import de la galería) tras un swap

export const pageSignal = () => ctl.signal;
export const onPageDestroy = (fn) => { cleanups.push(fn); };
export const pageGeneration = () => generation;

export const inPageContext = (fn) => {
  if (!ctx) ctx = gsap.context(() => {});
  ctx.add(fn);
};

export function resetPage() {
  generation++;
  ctl.abort();
  ctl = new AbortController();
  cleanups.forEach((fn) => { try { fn(); } catch (_) {} });
  cleanups.length = 0;
  if (ctx) { ctx.revert(); ctx = null; }
}
