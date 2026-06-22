import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // Dominio final: URLs absolutas correctas para og:image y canonical.
  site: 'https://pipilacha.es',
  // Sitio 100% estático: `npm run build` genera /dist listo para subir a cualquier hosting.
  output: 'static',
  build: {
    // CSS y assets con hash para cacheo agresivo
    assets: '_assets',
  },
});
