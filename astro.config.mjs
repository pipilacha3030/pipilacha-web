import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // Sitio 100% estático: `npm run build` genera /dist listo para subir a cualquier hosting.
  output: 'static',
  build: {
    // CSS y assets con hash para cacheo agresivo
    assets: '_assets',
  },
  // Pon aquí tu dominio final para generar URLs absolutas correctas (og:image, sitemap…)
  // site: 'https://pipilacha.com',
});
