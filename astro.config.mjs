import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // Dominio OFICIAL (pipilacha.es sirve la web desde Arsys producción, jul 2026).
  // Alimenta canonical, og:url/og:image y todos los @id del grafo JSON-LD — debe
  // coincidir SIEMPRE con sitemap.xml y robots.txt. Con el valor anterior (la beta
  // live-website.com) cada página de producción declaraba su canonical hacia la beta.
  site: 'https://pipilacha.es',
  // Sitio 100% estático: `npm run build` genera /dist listo para subir a cualquier hosting.
  output: 'static',
  build: {
    // CSS y assets con hash para cacheo agresivo
    assets: '_assets',
  },
});
