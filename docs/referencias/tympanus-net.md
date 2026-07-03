# Referencia — Tympanus / Codrops · "3D Gradient Carousel"

URL: https://tympanus.net/Tutorials/3DGradientCarousel/
Autor: Clément Grellier · Repo: https://github.com/clementgrellier/gradientslider

Aplicado a: **`/galeria/`** (escenario 3D inmersivo).
Solo se extrajo el *cómo* (técnica, ritmo, timings). Contenido, colores, fotos y
tipografías son de Pipilacha. Nada del sitio original se copió literalmente.

## ADN de movimiento extraído

No es un cilindro: es una **cinta horizontal infinita** de tarjetas 4:5 con perspectiva.
Cada tarjeta se transforma según su distancia al centro del viewport (`screenX`):

```
norm  = clamp(screenX / (viewportWidth/2), -1, 1)
inv   = 1 - |norm|
rotateY   = -norm * 28°
translateZ = inv * 140px
scale      = 0.92 + inv * 0.10        // 0.92 en bordes → 1.02 al centrarse
transform-origin: 90% center          // da el "swing" tipo coverflow
perspective: 1800px
```

- **Física**: arrastre + rueda con inercia. `vel *= 0.9` cada frame (fricción),
  `pos += vel`. Rueda: `vel += delta * 0.6`. Arrastre 1:1 con momentum al soltar.
- **Bucle infinito**: `x = ((i*unit - pos) % trackW + trackW) % trackW`, y si
  `x > trackW/2` restar `trackW` → offset simétrico respecto al centro.
- **Profundidad**: `z-index` por `translateZ`; leve `blur` en las lejanas.
- **Fondo reactivo**: canvas con dos radiales cuyos colores son el **color dominante
  de la foto centrada** (histograma en canvas 48px), `blur(24px) saturate(1.05)`,
  transición de color ~0.45s al cambiar de foto.
- **Easing de UI**: `cubic-bezier(.22, 1, .36, 1)` — ya es nuestro `--ease`.

## Traducción a Pipilacha (implementación)

- Motor propio en `public/js/main.js` (IIFE, sin dependencias nuevas). Todos los
  timings viven en el objeto `CFG` para tunear el feel en un solo sitio.
- Mismas constantes de la referencia: fricción 0.9, rot 28°, Z 140, escala 0.92–1.02,
  perspective 1800, entrada easeOutCubic.
- **Fondo floral atenuado**: el color dominante del plato se mezcla hacia `--cream`
  (mix 0.42) → cada plato tiñe el fondo con "su flor" sin salirse de la paleta.
  Encaja con el concepto "cada plato, su flor".
- Fotos en el HTML (no inyectadas por JS) → funciona sin JS / rastreable.
- `prefers-reduced-motion`: el motor no arranca; cae a una tira horizontal simple.
- Se mantiene el **lightbox** (tap/Enter sobre una tarjeta la amplía).
- Página inmersiva: `body:has(.gal-stage)` bloquea el scroll y oculta footer +
  reserva-bar; el contacto vive en el marco fijo (`.gal-frame`).

## Qué NO se copió

Sus colores, su fondo blanco frío, sus fotos, sus textos, sus nombres de clase ni
su heurística exacta de extracción de color (la nuestra prioriza saturación para que
manden los pétalos). El sitio no es confundible con el original.
