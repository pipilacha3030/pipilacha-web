import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // Dominio actual del sitio servido (la beta de Arsys): URLs absolutas correctas
  // para og:image y canonical → la previsualización al compartir (WhatsApp) encuentra
  // la imagen. Cambiar a 'https://pipilacha.es' cuando se migre el dominio en el lanzamiento.
  site: 'https://myblog-s5dx15q6kq.live-website.com',
  // Sitio 100% estático: `npm run build` genera /dist listo para subir a cualquier hosting.
  output: 'static',
  build: {
    // CSS y assets con hash para cacheo agresivo
    assets: '_assets',
  },
});
