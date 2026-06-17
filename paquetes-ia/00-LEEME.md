# Paquetes de código por sección (para prompts de IA)

Cada archivo de esta carpeta es **autocontenido**: lleva el HTML (`.astro`), el CSS
(`main.css`) y el JS (`main.js`) de UNA sección, listo para pegar a otra IA junto a tu
captura de pantalla. Así la IA ve el código exacto que tiene que tocar.

## Cómo usarlo
1. Abre el paquete de la sección que quieres mejorar (p. ej. `01-menu.md`).
2. Pega su contenido a la otra IA.
3. Adjunta **1 captura** de esa sección (desde tu navegador: `localhost:4321` o
   `pipilachaweb.netlify.app`).
4. Pídele el cambio concreto. Ejemplo:
   *"Aquí tienes el código del menú de Pipilacha. Quiero que las tarjetas reaccionen al
   cursor con una inclinación 3D sutil (tilt) al pasar por encima, sin romper el efecto
   cristal ni la animación `cardBreathe`. Dame el diff exacto por archivo."*

## Reglas que la IA debe respetar SIEMPRE (resumen)
- **Stack**: Astro estático + CSS vanilla (tokens en `:root`) + GSAP 3.12 + ScrollTrigger + Lenis. Sin build de JS: `public/js/main.js` es un archivo plano.
- **Colores**: solo tokens (`--moss #31331F`, `--olive #645D3B`, `--accent-soft #B0A77F`, `--cream #F4EFE6`, `--cloud #FBFAF5`). El acento es **verde**. ⚠️ NADA de rosa ni terracota.
- **Tipos**: `--serif 'Marcellus'` (títulos) · `--sans 'Hanken Grotesk'` (cuerpo, weight 300).
- **Animaciones por scroll** → patrón `.reveal` o ScrollTrigger enganchado al loop Lenis↔GSAP (no eventos `scroll` nativos).
- **`prefers-reduced-motion`** corta toda animación: cualquier efecto nuevo debe respetarlo.
- **Cache-buster**: si se edita `public/js/main.js`, subir `?v=N` en `src/layouts/Base.astro` (ahora **v=21**).
- **Pétalos** (`.petal*`, `.menu-bloom`, `.gcard__flower`): se mueven con **animación CSS**, NUNCA con `data-parallax` (GSAP pelea con las keyframes).
- Enlaces internos con **barra final** (`/menu/`).

## Índice de paquetes
- `01-menu.md` — Menú "Despertar de las flores": tarjetas de cristal en carrusel + maridaje (el showpiece).
- `02-hero.md` — Hero del inicio: título por máscara, botones, parallax, botón magnético.
- `03-galeria.md` — Galería: carrusel arrastrable + lightbox.
- `04-animaciones-home.md` — Manifiesto (palabras 3D pinned) + showcase (foto que florece) + parallax.

> El contexto completo del proyecto está en `../FICHA-WEB-IA.md`. Estos paquetes son el
> "zoom" a nivel de código de cada sección.
