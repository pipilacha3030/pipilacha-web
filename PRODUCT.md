# PRODUCT.md

**Pipilacha** — web de un restaurante de menú degustación en Madrid construido
íntegramente sobre flores comestibles. Sitio de marca, no producto: **el diseño ES el
producto**.

- **Register:** brand
- **Objetivo único:** que alguien reserve. Todo lo demás sirve a eso.
- **Quién entra:** alguien que ya oyó hablar del sitio (99,8 % de las búsquedas de Google
  son de marca) y decide si merece la pena. Móvil, 81 %.
- **Escena física:** de noche, en el sofá o de pie en la calle, buscando un sitio para una
  ocasión que importa. Luz baja, decisión emocional, mucha competencia a un scroll.

## Identidad (fijada, no negociable)

- **Color:** moss `#31331F` · olive `#645D3B` · cream `#F4EFE6` · cloud `#FBFAF5` ·
  ink `#2A2A22` · accent-soft `#B0A77F` (sobre fondo oscuro). Sin rosa ni terracota.
- **Tipos:** Marcellus (display) + Hanken Grotesk 300–600 (texto). Auto-alojadas.
- **Estrategia de color:** *committed* — el oliva y el moss cargan superficies enteras
  (pie, barra de reserva, secciones oscuras); el crema es el lienzo.
- **Voz:** directa, precisa, con carácter. Sin decoración. Las flores son ingrediente,
  nunca metáfora. Lista negra completa en la skill `pipilacha-brand-voice` — aplicarla a
  cualquier texto.

## Sistema técnico

- Astro 5, salida estática. CSS propio en `src/styles/main.css` (tokens en `:root`).
- Movimiento: **GSAP + ScrollTrigger + Lenis**. Todo tween de página se crea dentro de
  `inPageContext()`; los listeners con `{ signal: pageSignal() }`.
- Bilingüe: ES en la raíz, EN en `/en/`. Textos en `src/i18n/index.js`.
- Fotos y PNG de flor recortada en `public/assets/img/` (`flor-*.png` + hermano `.webp`
  + variante `-xs`).

## Reglas de la casa

- **Estado base visible.** Nada se oculta esperando a una animación: si el JS no carga,
  el contenido está ahí. Las clases de ocultado van gateadas por `.js`.
- `prefers-reduced-motion` desactiva la animación en todo el sitio.
- Los pétalos flotantes se mueven por keyframes CSS: **no** ponerles `data-parallax`
  (GSAP pelea con la animación y tiembla).
- Cero glitches. Se verifica por captura, no de memoria.
