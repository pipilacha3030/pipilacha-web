# El jardín que se vacía — rediseño de la banda de alta en la lista

**Fecha:** 2026-08-01 · **Sección:** `.jardin` (antes `.news`) · **Rama:** `jardin`

## Problema

La banda actual rota cada 4,2 s entre cuatro flores con nombre + nota + foto. Funciona,
pero el mecanismo —carrusel automático con temporizador— es el más visto del sector y no
da autoridad de diseño. Además arrastra dos limitaciones reales:

1. **Solo hay 16 flores en PNG** y el menú nombra 32. Cualquier diseño que empareje
   nombre↔foto 1:1 se queda corto.
2. **El hover no existe en móvil**, y el objetivo declarado es que el *wow* sea móvil
   primero.

## Idea

Dejar de etiquetar las flores. Sin pie de foto, 16 PNG son infinitos: son atmósfera, no un
índice. Los **nombres** pasan a ser el protagonista en tipografía, que no cuesta assets.

La sección se lee de arriba abajo como el paso de un menú al siguiente:

- **Arriba** — un matorral tipográfico con las **32 flores reales** del *Solsticio floral*,
  en Marcellus, a tamaños desiguales, derivando lentísimo. Los PNG flotan entre ellas,
  desenfocados, a distintas profundidades.
- **Según la sección cruza la pantalla, los nombres se van apagando uno a uno.** No los
  apaga un temporizador: los apaga el scroll del usuario.
- **Abajo** — cuando el formulario queda centrado, del matorral queda una sola flor en pie,
  con su nota real del pase. Y el formulario.

Al ser scroll-scrubbing, subir vuelve a encender el jardín. No es destrucción: es un menú
que entra y sale.

## Por qué resuelve lo que había que resolver

| Limitación | Resolución |
|---|---|
| 16 PNG para 32 flores | Ninguna foto lleva nombre. Se repiten a distinta escala, giro y desenfoque. |
| Wow en móvil | El mecanismo **es** el scroll. En móvil no hay versión degradada: es la principal. |
| Autoridad de diseño | El dato (32 nombres reales de la carta) no se puede copiar. El efecto sí. |

## Restricción que manda sobre todo: se pinta en 23 páginas

`Newsletter.astro` vive dentro de `Footer.astro`, así que **esta sección se renderiza en
todas las páginas del sitio**. Cualquier coste corre en toda la web. Por eso:

- Sin `<canvas>`, sin motor de física, sin bucle rAF propio (se usa el `gsap.ticker` que ya
  corre para Lenis).
- **Un** ScrollTrigger y **un** listener de `pointermove` para toda la sección.
- Los PNG son las variantes `-xs` ya existentes, con `loading="lazy"`.
- ~32 nodos de texto + ~9 imágenes, todos animados por `transform`/`opacity` (compuesto en
  GPU, sin recalcular maquetación).

## Maquetación: flujo, no coordenadas absolutas

Los 32 nombres van en un `<ul>` en **flujo normal** (`flex-wrap`), no posicionados en
absoluto. Cada uno toma un tamaño de un juego corto según su índice y un desplazamiento
vertical mínimo, lo que da textura sin romperse.

Se descarta el posicionamiento absoluto: con 32 elementos en una caja fluida se solapan y
desbordan en móvil. En flujo, envuelve solo y nunca desborda.

Los **pétalos** sí van en absoluto (`--x`/`--y` en porcentaje) sobre el matorral, porque son
decorativos y el contenedor recorta.

## Reacción al puntero

Los pétalos se apartan de donde está el puntero y vuelven a su sitio.

Se usa `pointermove`, que **en móvil también dispara mientras arrastras para scrollear**, así
que el efecto ocurre durante el scroll sin bloquearlo. Sin `preventDefault`: el scroll no se
toca.

Geometría: una sola lectura de `getBoundingClientRect()` de la sección por evento (no diez),
y los centros de cada pétalo se calculan a partir de sus porcentajes. El movimiento va por
`gsap.quickTo`, que interpola en el ticker en vez de escribir en cada evento.

## Textos

La regla de marca prohíbe el lenguaje floral poético y el encuadre estacional. Así que **el
texto se mantiene directo y factual y la carga emocional la lleva el movimiento**:

- Antetítulo: nombre del menú en curso + recuento real de flores.
- Título y entradilla: los actuales, que ya son precisos (`El menú cambia` / `Cuando cambia,
  escribimos. También cuando queda alguna mesa suelta. Nada más.`).
- El cierre no es una frase nueva: es **la última flor en pie con su nota del pase**, que es
  precisión técnica, no decoración.

## Lo que NO se toca

El `<form>`, su marcado, `public/api/suscribir.php` y el cableado con Brevo se quedan
exactamente como están. Están probados contra las listas reales (ES #3 / EN #4). Solo cambia
lo que los rodea.

## Accesibilidad y degradación

- Los 32 nombres son **contenido real en el DOM**, en una lista. Un lector de pantalla los
  lee enteros; el apagado es puramente visual y no toca `aria-live`.
- El estado apagado es transitorio y reversible, y va **condicionado a JS + movimiento
  permitido**. En reposo (sin JS o con `prefers-reduced-motion`) los 32 están a contraste
  pleno.
- **Sin JavaScript**: matorral completo visible, pétalos visibles quietos, formulario
  enviando por POST normal.
- **`prefers-reduced-motion: reduce`**: sin deriva, sin vaciado, sin pétalos reactivos.

## Datos

Las 32 flores y el nombre del menú se añaden a `src/data/menu.js` y `src/data/menu.en.js`,
junto a los 15 pases, porque son el mismo menú. Cambiar de carta = editar ahí.

## Criterio de aceptación

1. `npm run build` pasa (23 páginas).
2. Con scroll real (no `stage` forzado) el matorral se apaga progresivamente y queda una
   sola flor con su nota.
3. Subir vuelve a encenderlo.
4. Sin errores de consola.
5. Contraste ≥4,5:1 en todo el texto en su estado de reposo.
6. Con `prefers-reduced-motion` no se mueve nada y las 32 quedan legibles.
7. Con JS desactivado la sección está completa y el formulario envía.
