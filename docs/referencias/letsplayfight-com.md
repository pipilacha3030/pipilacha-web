# Referencia: letsplayfight.com — ADN visual y de movimiento

> Extraído con navegador (Playwright) el 2026-06-11. Solo se documenta el *cómo*
> (ritmo, técnica, proporción). Textos, imágenes, colores y fuentes de la
> referencia NO se copian. Pipilacha mantiene Marcellus/Hanken y su paleta.

## Stack detectado
- **Webflow** (CDN `website-files.com`) + **jQuery 3.5.1** + `main.js` propio (Vercel).
- **Scroll suave: Lenis** → `html.lenis.lenis-smooth.lenis-scrolling`. (Pipilacha ya usa Lenis.)
- Sin GSAP en `window` (su motion va en el `main.js` propio, probablemente rAF + transform).
- Fuentes de la ref: FKGrotesk (texto) + Oswald. *(No se adoptan.)*

## Layout del hero
- Campo de imágenes **dispersas, `position:absolute`**, ~24 piezas.
- Tamaños MUY variados: desde ~47px de alto hasta ~195px. Densidad alta.
- Ratios: dominante **3:2 (1.5)**, con alguna **3:4 (0.74, retrato)** y **16:9 (1.78)**.
- **border-radius ≈ 5px** (4.78px medido). Tratamiento plano, sombra mínima.
- **Titular central** corto y grande, encima del campo; **subtítulo** sans corto debajo.
- Texto lateral rotado ("Made in…") + menú hamburguesa arriba-dcha, logo arriba-izq.

## Movimiento (lo valioso)
- **En reposo las imágenes NO se mueven** (`transform:none`). No hay float CSS constante.
- El desplazamiento es **dirigido por puntero + scroll** (parallax con profundidad por
  imagen: las pequeñas/lejanas se mueven distinto a las grandes/cercanas).
- Seguimiento suave (lerp) del cursor → sensación "flotante" sin animación en bucle.
- Scroll suave Lenis encadenado al parallax.

## Traducción a Pipilacha (qué adoptamos)
| Patrón ref | Adaptación Pipilacha |
|---|---|
| Lenis smooth scroll | Ya lo tenemos (`window.lenis`). Reusar. |
| Campo disperso absoluto, tamaños variados | Fotos reales de platos/flores/cocina, mezcla 3:2 / 3:4 / 16:9. |
| radius ≈5px, plano | Radio sutil (no los 22px de marca; ~8–10px) para no competir con la foto. |
| Parallax por puntero+scroll, lerp | rAF con lerp 0.1, profundidad por `data-depth`. `prefers-reduced-motion` lo apaga. |
| Titular central serif + subtítulo | Marcellus (display) + Hanken (texto), copy y paleta de Pipilacha. |
| Texto lateral rotado | "Hecho en Madrid". |

## CORRECCIÓN (2026-06-11): el scroll del hero es un PIN + SCRUB
Verificado disparando wheel real (su Lenis no es global y no responde a `scrollTo`):
- El hero se **fija (pin)** y, al hacer scroll, **una imagen central escala hasta
  ocupar el viewport completo** (medí 1200px de ancho = 100% del viewport).
- Las demás imágenes **se apartan hacia fuera y se desenfocan (blur) + fade**.
- El titular se desvanece pronto. Es un `ScrollTrigger` con `pin:true` + `scrub`.
→ Adaptación Pipilacha: misma mecánica (pin + scrub), imagen destacada = un plato/
  cuenco de flores que crece a fullscreen; el resto se dispersa y entra en blur.

## Lo que NO imitamos
- Sus fuentes, su sans, su radio exacto, sus textos/imágenes/logo, su densidad de 24
  piezas (Pipilacha: 6–8 para no saturar y mantener aire editorial de marca).
