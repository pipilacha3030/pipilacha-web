/* Preferencia global de movimiento: se consulta una vez por carga de página.
   Con reduce activo: sin Lenis, sin transiciones, sin tweens (el CSS ya fuerza
   la visibilidad de los .reveal con !important). */
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
