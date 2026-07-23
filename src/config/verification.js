/* ============================================================
   Códigos de verificación de propiedad del sitio.
   Se emiten como <meta> en el <head> (ver Base.astro). Cada uno
   es la vía «etiqueta HTML» que ofrecen Search Console y Bing:
   pegas el código aquí, `npm run build` + deploy, y pulsas
   «Verificar» en su panel. Con la cadena vacía no se emite nada.
   ============================================================ */

// Google Search Console → Añadir propiedad → prefijo de URL
// https://pipilacha.es → método «Etiqueta HTML» → copia SOLO el
// valor content="..." del <meta name="google-site-verification">.
export const GOOGLE_SITE_VERIFICATION = '';

// Bing Webmaster Tools → Añadir sitio → «Etiqueta de metadatos» →
// copia SOLO el valor content="..." del <meta name="msvalidate.01">.
// (Si importas desde Google Search Console, no hace falta este.)
export const BING_SITE_VERIFICATION = '';
