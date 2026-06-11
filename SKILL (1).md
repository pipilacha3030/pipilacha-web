---
name: style-extractor
description: Extraer el sistema de estilo CSS y los patrones de animación de cualquier web de referencia (URL) y traducirlos a la identidad de Pipilacha en el stack Astro + Tailwind + GSAP del proyecto. Usar cuando el usuario diga "copia el estilo de", "inspírate en", "extrae las animaciones de", "haz que se parezca a" o pegue una URL de referencia visual. NUNCA clonar contenido, textos, logos ni imágenes de la web de referencia — solo patrones de diseño y movimiento.
---

# Style Extractor — Pipilacha

## Objetivo

Dada una URL de referencia, extraer su ADN visual y de movimiento, y **adaptarlo** (nunca copiarlo literal) a la web de Pipilacha respetando siempre el CLAUDE.md del proyecto: paleta, tipografías y voz de marca son INTOCABLES. Lo que se extrae de la referencia es el *cómo* (ritmo, proporción, técnica), no el *qué* (colores, textos, logos, fotos).

## Línea roja legal y de marca

- ✅ SÍ extraer: timings y easings de animación, técnicas de scroll, proporciones de layout, jerarquía tipográfica (escalas, no fuentes), espaciados, patrones de interacción, estructura de secciones.
- ❌ NUNCA: textos, imágenes, vídeos, logos, iconos propios, colores de marca de la referencia, nombres de clases reconocibles, ni nada que haga la web de Pipilacha confundible con la original.

## Fase 1 — Inspección de la referencia

Si Chrome MCP está disponible (`claude --chrome`), usar el navegador. Si no, usar WebFetch sobre el HTML y los CSS enlazados.

Extraer y documentar en `docs/referencias/<dominio>.md`:

### Tokens de diseño
1. **Escala tipográfica**: tamaños computados de H1/H2/H3/body en desktop y móvil, line-height, letter-spacing, pesos usados.
2. **Espaciado**: padding vertical entre secciones, ancho máximo del contenido, gutters, uso de aire alrededor de imágenes.
3. **Layout**: grid o flex predominante, proporciones de columnas, cómo rompen la retícula, tratamiento de imágenes (full-bleed, contenidas, ratio).
4. **Detalles**: bordes, radios, tratamiento de hover en enlaces y botones, estilo de separadores.

### Patrones de animación (lo más valioso)
Para cada animación detectada, documentar:
- **Trigger**: scroll (¿a qué % del viewport?), hover, carga de página, click.
- **Propiedades animadas**: opacity, translate (cuántos px), scale, clip-path, blur.
- **Timing**: duración exacta, delay, stagger entre elementos.
- **Easing**: la curva (`cubic-bezier`, `power2.out`, etc.). Buscarla en el CSS computado o en los JS de la página (GSAP, Framer Motion, CSS transitions).
- **Comportamiento de scroll**: parallax (qué velocidad relativa), pin/sticky, scrub, reveals por sección, smooth scroll (Lenis/Locomotive).

Cómo encontrarlo sin browser: descargar los .css y .js enlazados con WebFetch y buscar `@keyframes`, `transition:`, `gsap.`, `ScrollTrigger`, `framer`, `lenis`, `data-scroll`.

## Fase 2 — Informe de adaptación (antes de tocar código)

Presentar al usuario un resumen breve (máx. 300 palabras) con:
1. Los 3–5 patrones más valiosos encontrados y por qué encajan con Pipilacha.
2. Cómo se traducirá cada uno a la marca (ej.: "su reveal de imágenes con clip-path 1.1s power3.out → lo aplicamos a las fotos de platos, en nuestros colores").
3. Lo que NO se va a imitar y por qué.

Esperar OK del usuario antes de implementar.

## Fase 3 — Implementación en el proyecto

1. Convertir los tokens extraídos a la config de Tailwind del proyecto (escala de espaciado y tipografía adaptada — fuentes siempre las de Pipilacha: Cormorant Garamond / Barlow / Marcellus).
2. Implementar las animaciones con GSAP + ScrollTrigger en `src/scripts/animations.js`, replicando timings y easings documentados.
3. Centralizar los valores de movimiento en un objeto de configuración al inicio del archivo:
   ```js
   export const MOTION = {
     revealDuration: 0.9,      // extraído de <referencia>
     revealEase: "power3.out",
     staggerItems: 0.08,
     parallaxSpeed: 0.15,
   };
   ```
   Así el usuario puede ajustar el "feel" tocando un solo sitio.
4. Respetar siempre `prefers-reduced-motion`.
5. Verificar con build que el rendimiento no cae (LCP < 2s sigue siendo requisito).

## Fase 4 — Comparación

Si hay browser disponible: captura lado a lado de la sección de referencia y la sección de Pipilacha, y autoevaluar si el *ritmo* se siente similar sin que el diseño sea reconociblemente el mismo. Ajustar una vez. No iterar infinito: máximo 2 pasadas de refinamiento salvo que el usuario pida más.

## Uso

```
/style-extractor https://noma.dk          → extraer todo
/style-extractor https://alchemist.dk solo animaciones del hero
/style-extractor https://mugaritz.com solo la sección de menú
```

Si el usuario pasa varias URLs, generar un informe comparativo y proponer un mix (ej.: ritmo de scroll de A + tratamiento de imagen de B).
