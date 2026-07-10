# COPY_AUDIT.md

Auditoría de storytelling y copywriting de Pipilacha.
Extracción literal del contenido narrativo de la web. Sin reescritura, sin interpretación, sin resumen.
Los textos aparecen exactamente como existen en el código fuente (`src/`).

---

## ELEMENTOS GLOBALES (presentes en todas las páginas)

Componentes compartidos definidos en `src/layouts/Base.astro`, `src/components/Nav.astro` y `src/components/Footer.astro`.

### Navegación (Nav) — `src/components/Nav.astro`

- Logo (enlace a inicio) — `aria-label`: `Pipilacha inicio` · `alt` del logo: `Pipilacha` · `alt` del isotipo: `Pipilacha`
- Botón hamburguesa — `aria-label`: `Abrir menú`
- CTA fijo del dock: **Reservar** (enlace a `/reservas/`)

Enlaces del menú desplegable (dentro del cristal):

| Label | Destino |
|---|---|
| Conócenos | `/conocenos/` |
| Menú | `/menu/` |
| Vinos | `/vinos/` |
| Galería | `/galeria/` |
| Prensa | `/prensa/` |
| Regalar | `/regala/` |
| Reservas | `/reservas/` |

Meta del panel de menú:

- `Horario` → Jueves a domingo · 14:00 y 21:00
- `Dirección` → C. del Azulejo · Madrid
- `Contacto` → @restaurante.pipilacha  ·  919 12 59 98

### Barra de reserva flotante (todas las páginas menos /reservas) — `src/layouts/Base.astro`

- Texto del enlace: **Reservar** (destino `/reservas/`)

### Transición de página — `src/layouts/Base.astro`

- Sin texto visible. `alt` de la imagen (isotipo libélula): `""` (vacío, decorativo).

### Footer — `src/components/Footer.astro`

Bloque de marca:
- Logo `alt`: `Pipilacha`
- Párrafo: **El único restaurante del mundo construido íntegramente sobre las flores.**

Columnas:

**Horario**
> Jueves a domingo
> Comida 14:00 · Cena 21:00
> 16 plazas por servicio

**Ubicación**
> C. del Azulejo, 2
> 28028 Madrid
> Cómo llegar → *(enlace a Google Maps)*

**Contacto**
> @restaurante.pipilacha *(enlace a Instagram)*
> +34 919 12 59 98 *(enlace tel)*
> info@pipilacha.es *(enlace mailto)*

Navegación del footer (`aria-label`: Páginas):
Conócenos · Menú · Vinos · Galería · Prensa · Regalar · Reservar

Base del footer:
> © 2026 Pipilacha
> Madrid

---

# HOME

Ruta del componente: `src/pages/index.astro`
Orden real de las secciones tal como aparecen en el archivo.

## Hero

Ruta del componente: `src/pages/index.astro` → `<section class="hero" id="hero">`

Texto completo exactamente como aparece:

- Eyebrow: **Restaurante de degustación · Madrid**
- H1 (dos líneas):
  > Un menú entero
  > hecho de flores.
- Subtítulo: **El único restaurante del mundo construido íntegramente sobre las flores.**

Botones:
- **Reservar** → `/reservas/` (botón sólido)
- **Regalar** → `/regala/` (botón fantasma)

Microcopy:
- `alt` de la imagen: `Cuenco de cerámica lleno de flores comestibles sostenido entre las manos`
- `data-delay` en cada elemento (revelado escalonado): eyebrow 0.1 · sub 0.5 · botón Reservar 0.65 · botón Regalar 0.75

## Sección 1 — Quiénes somos

Nombre del componente: `<section class="quienes" id="quienes">`
Objetivo de la sección: presentar la identidad editorial del restaurante (qué es, por qué es único) y llevar a la página de chefs.

Todo el texto:
- H2 (título): **Un restaurante para curiosos.**
- Párrafo:
  > Quince pases y en todos manda una flor distinta. No de adorno: como ingrediente principal, cocinada hasta donde llega su sabor. Esto no lo vas a encontrar en ningún otro restaurante de Madrid, porque casi nadie lo ha intentado. Te sientas en la barra, lo ves hacerse a un metro, y sales habiendo probado cosas que no existen en ningún otro sitio.

CTA:
- **Quiénes están detrás →** → `/conocenos/`

Microcopy:
- `alt` de la imagen: `Arán Rodrigo y Noé David en la cocina de Pipilacha`

## Sección 2 — Despertar de las flores (gallery finale / showcase)

Nombre del componente: `<section class="gallery" id="gallery">` → tarjeta `.gallery-finale.showcase` (id `despertar`)
Objetivo de la sección: adelantar el menú con una tarjeta de fotos en crossfade que crece a pantalla completa y enlaza al menú.

Todo el texto:
- Eyebrow: **El menú**
- Título: **Despertar de las flores**
- Enlace/CTA interno: **Ver los pases →**

Enlace de toda la tarjeta → `/menu/`

Microcopy:
- `aria-label` de la sección: `Despertar de las flores`
- `aria-label` del enlace: `Ver el menú Despertar de las flores`
- `alt` de las 4 fotos (capas):
  - `Espárragos a la brasa con romesco de tagete`
  - `Guisante coco-saúco`
  - `Vieira con flor de higo`
  - `Torrija de mandarina`

## Sección 3 — Cinta / Marquee

Nombre del componente: `<div class="marquee">`
Objetivo de la sección: cinta decorativa con keywords SEO en movimiento. `aria-hidden="true"` (no lee lector de pantalla).

Todo el texto (grupo que se repite dos veces, separador `✿`):
- Restaurante de flores en Madrid
- Menú de degustación · 15 pases
- Cocina floral de autor
- Flores comestibles como ingrediente
- Fuente del Berro · Jueves a domingo

CTA: ninguno.

## Sección 4 — Explorar

Nombre del componente: `<nav class="explore" aria-label="Secciones">`
Objetivo de la sección: bloque editorial full-bleed con tres accesos a secciones.

Todo el texto (labels sobre imágenes):
- **Conócenos** → `/conocenos/`
- **El menú** → `/menu/`
- **Galería** → `/galeria/`

CTA: los propios tres enlaces.

## Sección 5 — Showcooking / La barra

Nombre del componente: `<section class="barra" id="showcooking">`
Objetivo de la sección: contar la experiencia de la barra y la cocina en directo.

Todo el texto:
- Label (eyebrow): **Showcooking**
- Meta: **Quince pases en directo**
- H2 (título, dos líneas):
  > Se cocina
  > delante de ti.
- Lead:
  > La cocina está abierta y a un metro. Desde la barra ves terminar cada uno de los quince pases y quien lo cocina te cuenta qué flor lleva y de dónde salió la idea. Se turnan: uno cocina, el otro cuenta.
- Datos (lista):
  - **8** — asientos en barra
  - **2** — chefs enfrente
  - **1** — metro hasta tu plato
- `figcaption` de la foto: **La barra, antes del servicio**

CTA: ninguno propio de la sección.

Microcopy:
- `alt` de la imagen: `La barra puesta para el servicio, frente a la cocina`

## Sección 6 — Reservar (cierre)

Nombre del componente: `<section class="book" id="reserva">`
Objetivo de la sección: cierre editorial con la ficha de datos de reserva y CTA.

Todo el texto:
- Label (eyebrow): **Reservar**
- Meta: **Madrid · Fuente del Berro**
- H2 (título, dos líneas):
  > Dieciséis plazas
  > por servicio.
- Lead:
  > Jueves a domingo, dos veces al día. Ocho asientos en la barra, frente a la cocina; ocho en mesa. Elige día y turno.
- Nota:
  > ¿Dudas? Escríbenos por Instagram o llama al 919 12 59 98.
- Ficha de datos (dl):
  - Días → Jueves a domingo
  - Servicios → 14:00 y 21:00
  - Menú degustación → 85 € / persona
  - Maridaje → +60 € / persona
  - Duración → 2 horas

CTA:
- **Reservar** → `/reservas/` (botón sólido grande)

Enlaces dentro de la nota:
- **Instagram** → `https://instagram.com/restaurante.pipilacha`
- **919 12 59 98** → `tel:+34919125998`

Después de esta sección: **Footer** (global).

---

# MENÚ

Ruta del componente: `src/pages/menu.astro` · datos en `src/data/menu.js`

## Page header

- Eyebrow: **Degustación · Primavera**
- H1: **Despertar de las flores**
- Párrafo:
  > Quince pases. Sin carta, sin alternativa: se sirve completo. Cada uno con una pista; el resto te lo contamos en la mesa. El décimo te lo guardamos.

## Lista de pases (`<ol class="pases">`)

Cada pase: número (01–15, autogenerado con padding) + nombre + pista ("hook").

| Nº | Nombre | Pista |
|---|---|---|
| 01 | Pipilacha | La flor eléctrica despierta el paladar para todo lo que viene. |
| 02 | Sabores de las flores | Cinco flores en su punto. Un mapa de boca antes de empezar. |
| 03 | Taco de tila y alisos | La tila calma; el aliso cierra con un punto de mostaza. |
| 04 | Explosión de flor de higo | Hueles otoño y comes primavera. |
| 05 | Fusión entre vieiras e hibiscus | El hibiscus corta la grasa de la vieira. |
| 06 | La magia del alhelí | Pasa de azul a violeta y deja el paladar a cero. |
| 07 | Pan y mantequilla | Masa madre con flores y mantequilla de caléndula. |
| 08 | Guisante coco-saúco | El saúco sube el dulzor del guisante sin azúcar. |
| 09 | Espárragos, romesco y tagetes | Brasa de encina y romesco reformulado con tagete. |
| 10 | *(Pase sorpresa — oculto)* | *(ver abajo)* |
| 11 | Cheong de glicinias sobre caballa | Un fermento floral coreano sobre caballa. |
| 12 | Atún y margaritas | Almadraba y manzanilla silvestre en el ponzu. |
| 13 | Ternera unagi con flores de huerto | Robata, lacado unagi y hojas del huerto. |
| 14 | Torrija de mandarina | Flambeada, con un gel picante de mandarina. |
| 15 | Fresas con nata madrileña | Fresón de Aranjuez rallado al momento. |

Pase nº 10 (secreto), texto que se muestra en la web:
- Nombre: **Te lo guardamos**
- Pista: **Un pase a ciegas. Lo descubres en la mesa, sin saber qué flor llega.**
- `aria-label` del cuerpo: `Pase sorpresa, sin desvelar`

## Sección Maridaje (`<section class="maridaje">`)

- Eyebrow: **La otra mitad**
- H2: **Maridaje**
- Intro:
  > Seis copas para recorrer los quince pases. Vinos de productores pequeños o los fermentos que hacemos en casa. Se elige al sentarse y ninguno está en carta: se sirve y se explica en sala.

Tarjeta 1:
- Count: **Seis copas**
- H3: **Con vino**
- Texto: Elegidas para la temporada. Cambian con las flores que entran cada servicio.
- Precio: **+60 € / persona**

Tarjeta 2:
- Count: **Seis fermentos**
- H3: **Sin alcohol**
- Texto: Kombuchas, kéfires de agua y cheongs de flor, hechos en casa. La misma ambición, sin vino.
- Precio: **+60 € / persona**

- Enlace final: **Ver la carta de vinos →** → `/vinos/`

## Banda CTA (`<section class="cta-band">`)

- H2: **El menú se cuenta en mesa**
- Lead:
  > Qué flor entra en cada plato, qué hace y de dónde viene la idea. Reserva y te lo contamos pase a pase.
- CTA: **Reservar** → `/reservas/` (botón sólido grande)

---

# RESERVAS

Ruta del componente: `src/pages/reservas.astro`

## Page header

- Eyebrow: **Reservas**
- H1 (dos líneas):
  > Reservar
  > en Pipilacha
- Párrafo:
  > Elige día y turno abajo. Dieciséis plazas por servicio: ocho en la barra, frente a la cocina abierta, y ocho en mesa.

## Widget de reserva (TheFork)

- Mensaje de carga: **Cargando el calendario de reservas** (seguido de puntos animados `.dots`)
- `title` del iframe: `Reservas Pipilacha`
- Fallback:
  > ¿No carga? Reserva por Instagram o llama al 919 12 59 98.
- Enlaces del fallback: **Instagram** → `https://instagram.com/restaurante.pipilacha` · **919 12 59 98** → `tel:+34919125998`

Microcopy:
- Todas las flores de atmósfera y del widget tienen `alt=""` (decorativas).

---

# FOOTER

*(Componente global — extraído íntegro arriba, en "ELEMENTOS GLOBALES → Footer". Se reproduce aquí por completitud.)*

- Marca / claim: **El único restaurante del mundo construido íntegramente sobre las flores.**
- Columna Horario:
  > Jueves a domingo / Comida 14:00 · Cena 21:00 / 16 plazas por servicio
- Columna Ubicación:
  > C. del Azulejo, 2 / 28028 Madrid / Cómo llegar → *(Google Maps)*
- Columna Contacto:
  > @restaurante.pipilacha / +34 919 12 59 98 / info@pipilacha.es
- Nav footer: Conócenos · Menú · Vinos · Galería · Prensa · Regalar · Reservar
- Base: © 2026 Pipilacha · Madrid

---

# OTRAS PÁGINAS (no listadas en el brief pero presentes en la web)

## CONÓCENOS — `src/pages/conocenos.astro`

Page header:
- Eyebrow: **Conócenos**
- H1 (dos líneas):
  > Todo empieza
  > con una pregunta

Sección Concepto / Chefs (`<section class="concepto">`):
- Párrafo 1: Las flores llevan siglos en la cocina. Como adorno, como guiño, como firma visual de quien quiere que el plato quede bonito en foto.
- Párrafo 2: Nosotros nos preguntamos qué pasa cuando las tratas como un ingrediente de verdad. Con el mismo rigor con el que otros trabajan la carne, el pescado o el vegetal. Qué sabores tienen, cómo se comportan con el calor, qué ocurre cuando las fermentas, las secas o las conviertes en harina.
- Párrafo 3: Hay miles de flores comestibles. Llevamos tiempo trabajando con ellas. Y todavía nos queda mucho por descubrir.
- Firmas:
  - **Arán Rodrigo** — Cofundador & Chef
  - **Noé David** — Cofundador & Chef
- `alt` imágenes: `Arán Rodrigo, cofundador y chef` · `Noé David, cofundador y chef`

Sección Showcooking (`<section class="showcooking">`):
- Eyebrow: **Showcooking**
- H2: **Cocinamos de cara**
- Párrafo 1: Ocho asientos en la barra, frente a la cocina abierta. Cada plato se termina delante de ti y quien lo cocina te cuenta qué flor lleva, qué hace en el plato y de dónde salió la idea. Nos turnamos: uno cocina, el otro habla.
- Párrafo 2: Con dieciséis personas por servicio nos da tiempo a saber tu nombre.
- CTA: **Reservar** → `/reservas/`
- `alt` imagen: `Noé David apoyado en la barra, con el delantal de Pipilacha`

## VINOS — `src/pages/vinos.astro` · datos en `src/data/vinos.js`

Hero (`<header class="cellar-hero">`):
- Eyebrow: **La bodega**
- H1: **Vinos para quince pases**
- Lead:
  > El maridaje se elige en la mesa. Si prefieres ir a tu aire, esta es la bodega: productores pequeños, vinos naturales y alguna rareza, por copa y por botella. Cambia con la temporada.

Índice lateral (`aria-label`: Tipos de vino):
- Título: **La carta**
- Entradas: Blancos · Naranja · Tintos · Espumosos · Dulces

Secciones de la carta (título + nota + lista nombre/uva):

**Blancos** — *Filo y verticalidad. Para empezar con la boca despierta.*
- JAG — Godello y Doña Blanca
- Stallmann-Hiestand — Riesling
- Barco del Corneta «Loseco» — Verdejo y Viura
- Desig · Mas Candi — Xarel·lo
- Tricó — Albariño
- David & Nadia — Chenin Blanc
- Viña Somoza «Ededia» — Godello
- Chablis 1er Cru Montmains — Chardonnay

**Naranja** — *Maceración con pieles. Textura y un punto salvaje.*
- Puiggròs «Impresionant» — Vino naranja
- Ulterior — Naranja

**Tintos** — *De la encina a la copa. Fruta, tierra y humo.*
- Ulterior Parcela 6 — Garnacha
- La Brecha — Ribera
- Gómez Cruzado — Rioja
- Cati Ribot «Cambuix» · 1 L — Escursac y Callet
- Joan d'Anguera «Finca l'Argata» — Garnacha
- Dom. de Villeneuve · Châteauneuf-du-Pape — Ródano
- Guy Amiot · Chassagne-Montrachet — Pinot Noir

**Espumosos** — *Tensión con aire. Cava, pet-nat y champán.*
- Mas Candi — Brut Nature
- Con Altura — Pet-Nat
- Marteaux — Champagne · Brut Réserve
- Calsac «Cuvée l'Échappée Belle» — Champagne
- Bérêche — Champagne · Brut Réserve

**Dulces** — *El cierre. Poco, frío y con flor.*
- Dulce Enero — Vino dulce
- La Chispa Negra — Vino dulce

Banda CTA:
- H2: **Lo fácil: déjate llevar**
- Lead: Seis copas pensadas para los quince pases, vino o fermentos de la casa. Se elige al sentarse y se explica en sala.
- CTA: **Reservar** → `/reservas/`

## GALERÍA — `src/pages/galeria.astro` · datos en `src/data/galeria.js`

Frame:
- Eyebrow: **Galería**
- H1: **Lo que ocurre en la mesa**
- Hint: **Arrastra, gira con la rueda o las flechas. Toca una foto para ampliarla.**
- Contador: `01 / 20` (formato `<span id="galIdx">01</span> / 20`)
- Enlaces: **@restaurante.pipilacha** → Instagram · **Reservar** → `/reservas/`

`alt` de las 20 fotos (también usados como caption en el lightbox):
1. Esferificación de hierba luisa
2. Pho de flores
3. Arán y Noé cocinando en la barra
4. Espárragos a la brasa con tagete
5. Claveles sobre fresas con nata
6. Corvina con pétalos de tagete
7. Ajo blanco con hojas de capuchina
8. Helado de tupinambo
9. Arán y Noé en el pase
10. Guisante coco-saúco
11. Saco de colirrábano con clavelina
12. Tartaleta de remolacha
13. Servicio en cocina
14. Vieira con flor de higo
15. La sala
16. Guiso de setas
17. Flores y técnica
18. Detalle de mise en place
19. Pase de temporada
20. Espárragos con tagete

Lightbox (microcopy de accesibilidad):
- `aria-label` diálogo: `Galería ampliada`
- Cerrar: `aria-label` `Cerrar galería` (símbolo ×)
- Anterior: `aria-label` `Foto anterior` (‹)
- Siguiente: `aria-label` `Foto siguiente` (›)
- `aria-label` de cada botón de foto: `Ampliar: {alt de la foto}`
- `aria-roledescription` de la sección: `carrusel` · `aria-label`: `Galería inmersiva`

## PRENSA — `src/pages/prensa.astro` · datos en `src/data/prensa.js`

Page header:
- Eyebrow: **Prensa**
- H1 (dos líneas):
  > Pipilacha
  > en los medios
- Párrafo:
  > Pipilacha es un restaurante de Madrid que cocina con flores comestibles como ingrediente principal, no como decoración. Abre de jueves a domingo, en dos servicios (14:00 y 21:00), con un menú de degustación de quince pases —«Despertar de las flores»— a 85 € por persona, con maridaje opcional de seis copas (+60 €). Dieciséis plazas por servicio, ocho de ellas en la barra del showcooking, frente a la cocina. Los chefs fundadores son Arán Rodrigo y Noé David. Dirección: C. del Azulejo, 2, 28028 Madrid.

Menciones (medio · fecha · autor + titular; enlace externo, CTA "Leer →"):

1. **El País** · Abril 2026 — *Pipilacha, el restaurante donde averiguar a qué saben las margaritas*
2. **El Español** · Noviembre 2025 · Mar León — *Los chefs de 20 años que cocinan flores: «Ahora damos que hablar»*
3. **Neo2 Magazine** · Octubre 2025 · Miguel A. Palomo — *Restaurante Pipilacha: cuando las flores son protagonistas*
4. **Beandlife Magazine** · Enero 2026 · Ana S. Diéguez — *Pipilacha, cuando las flores se convierten en cocina*
5. **El Mundo Financiero** — *Pipilacha, el original restaurante donde Madrid huele a pétalos y sabe siempre a primavera*

- CTA por fila: **Leer →**
- `aria-label` de cada fila: `{titular} — {medio}, {fecha}. Abre en una pestaña nueva.`

Kit de prensa (`<section class="prensa-kit">`):
- Eyebrow: **Para medios**
- H2: **Kit de prensa**
- Párrafo: Fotografías en alta resolución, dossier e información del restaurante a disposición de periodistas y creadores. Descarga el dossier o escríbenos y te lo enviamos.
- CTA: **Descargar dossier (PDF)** → `/assets/docs/pipilacha-dossier-prensa.pdf` (descarga)
- Contacto:
  - Email → info@pipilacha.es
  - Teléfono → +34 919 12 59 98
  - Dirección → C. del Azulejo, 2 · Madrid *(enlace Google Maps)*

## REGALAR — `src/pages/regala.astro`

Sección Comprar (`<section class="gift-shop">`):
- Eyebrow: **Comprar la tarjeta**
- H1: **Regálalo ahora**
- Lead: Elige importe o menú y te llega la tarjeta con su código. El día se reserva luego por TheFork.
- Widget externo Bonkdo (`title` iframe: `Tarjetas regalo de Pipilacha`)

## 404 — `src/pages/404.astro`

- Eyebrow: **Error 404**
- H1 (dos líneas):
  > Esta flor
  > no ha brotado
- Lead: La página que buscas no existe o cambió de sitio. Te devolvemos al jardín.
- Botones:
  - **Volver al inicio** → `/`
  - **Ver el menú** → `/menu/`

---

# SEO

## Home — `src/pages/index.astro`
- **title**: `Pipilacha · El único restaurante construido sobre las flores`
- **description**: `Pipilacha es un restaurante de degustación en Madrid donde las flores no son adorno: son el concepto. 16 plazas por servicio. Jueves a domingo.`

## Menú — `src/pages/menu.astro`
- **title**: `Menú · Despertar de las flores · Pipilacha`
- **description**: `Despertar de las flores: el menú de degustación de Pipilacha. Quince pases con las flores como ingrediente. Madrid, 85 € por persona.`

## Reservas — `src/pages/reservas.astro`
- **title**: `Reservar · Pipilacha`
- **description**: `Reserva en Pipilacha. 16 plazas por servicio, jueves a domingo, dos turnos. Menú degustación 85 € por persona.`

## Conócenos — `src/pages/conocenos.astro`
- **title**: `Conócenos · Arán y Noé · Pipilacha Madrid`
- **description**: `Arán Rodrigo y Noé David tratan las flores comestibles como un ingrediente de verdad: sabor, técnica y origen de cada plato en Pipilacha, Madrid.`

## Vinos — `src/pages/vinos.astro`
- **title**: `Vinos · La bodega de Pipilacha · Madrid`
- **description**: `La carta de vinos de Pipilacha: productores pequeños, vinos naturales y de oficio, por copa y botella, elegidos para acompañar el menú de flores en Madrid. Cambia con la temporada.`

## Galería — `src/pages/galeria.astro`
- **title**: `Galería · Pipilacha`
- **description**: `Platos, flores y servicio en Pipilacha, restaurante de degustación floral en Madrid.`

## Prensa — `src/pages/prensa.astro`
- **title**: `Prensa · Pipilacha`
- **description**: `Pipilacha en los medios. Lo que la prensa cuenta del restaurante de flores comestibles de Madrid: 15 pases, de jueves a domingo. Información y contacto de prensa.`

## Regalar — `src/pages/regala.astro`
- **title**: `Regala Pipilacha · El menú de flores, para regalar`
- **description**: `Regala una experiencia en Pipilacha: el menú de degustación Despertar de las flores, quince pases entre flores, en Madrid. Tarjeta regalo válida un año.`

## 404 — `src/pages/404.astro`
- **title**: `Página no encontrada · Pipilacha`
- **description**: `Esta página no existe. Vuelve al inicio o reserva mesa en Pipilacha, el restaurante de flores de Madrid.`

## OpenGraph (definido en `Base.astro`, común a todas; title/description/image/url son por página)
- `og:type`: `website`
- `og:site_name`: `Pipilacha`
- `og:locale`: `es_ES`
- `og:title`: *(= title de la página)*
- `og:description`: *(= description de la página)*
- `og:image`: `/assets/img/og.jpg` (por defecto; URL absoluta)
- `og:image:width`: `1200`
- `og:image:height`: `630`
- `og:image:alt`: `Arán y Noé, los chefs de Pipilacha, entre flores`
- `og:url`: *(canonical de la página)*
- `theme-color`: `#F4EFE6`

## Twitter (definido en `Base.astro`)
- `twitter:card`: `summary_large_image`
- `twitter:title`: *(= title de la página)*
- `twitter:description`: *(= description de la página)*
- `twitter:image`: *(= og:image absoluta)*

## Schema / JSON-LD

### Grafo base (`Base.astro`, en todas las páginas)
Contexto `https://schema.org`, `@graph` con:

**Restaurant** (`#restaurant`)
- name: `Pipilacha`
- description: `El único restaurante del mundo construido íntegramente sobre las flores. Menú de degustación de quince pases con flores comestibles como ingrediente principal, en Madrid.`
- servesCuisine: `Cocina floral de autor`
- priceRange: `€€€`
- telephone: `+34919125998`
- email: `info@pipilacha.es`
- address: `C. del Azulejo, 2` · `Madrid` · `28028` · `ES`
- geo: lat `40.4291`, long `-3.6669`
- openingHoursSpecification: Jueves–Domingo `14:00–16:30` y `21:00–23:30`
- acceptsReservations: `https://widget.thefork.com/867dcee9-49b5-47ed-90c0-c6c87149b328`
- hasMenu: `.../menu/`, `.../vinos/`
- founder: Arán, Noé
- knowsAbout: `Flores comestibles`, `Cocina floral de autor`, `Menú de degustación`, `Investigación botánica aplicada a la gastronomía`, `Fermentación de flores`
- sameAs: `https://instagram.com/restaurante.pipilacha`

**Person — Arán Rodrigo** (`#aran`): jobTitle `Chef y cofundador`; knowsAbout: Flores comestibles, Alta cocina, Investigación botánica aplicada a la gastronomía.

**Person — Noé David** (`#noe`): jobTitle `Chef y cofundador`; knowsAbout: Flores comestibles, Alta cocina, Fermentación de flores.

**WebSite** (`#website`): name `Pipilacha`, inLanguage `es`.

**BreadcrumbList** (solo páginas internas): Inicio → {nombre de la página}. Nombres: Conócenos, Menú, Vinos, Galería, Prensa, Regalar, Reservas.

### Schema adicional por página

**Menú** (`Menu`, `@id` `.../menu/`):
- name: `Despertar de las flores`
- description: `Menú de degustación de quince pases con flores comestibles como ingrediente. 85 € por persona.`
- hasMenuSection: `Despertar de las flores · 15 pases`, con los 15 pases como `MenuItem` (nombre + pista; el pase sorpresa aparece como `name: Pase sorpresa`, `description: A ciegas, se descubre en la mesa.`)
- offers: `85.00 EUR`

**Vinos** (`Menu`, `@id` `.../vinos/`):
- name: `Carta de vinos · Pipilacha`
- description: `La bodega de Pipilacha: vinos de productores pequeños, naturales y de oficio, por copa y botella, para acompañar el menú de degustación floral en Madrid.`
- hasMenuSection: una por familia (Blancos, Naranja, Tintos, Espumosos, Dulces), con su nota como `description` y cada vino como `MenuItem` (nombre + uva).

**Conócenos** (`@graph` con los dos `Person`, fusionando `#aran` y `#noe`):
- Arán — description: `Cofundador de Pipilacha. Trata las flores comestibles como ingrediente principal: sabor, técnica y origen en cada pase.`
- Noé — description: `Cofundador de Pipilacha. Investiga qué pasa cuando las flores se fermentan, se secan o se convierten en harina.`

---

# MICROCOPY

Recopilación de todos los elementos de interfaz.

## Botones y CTAs
- Reservar *(dock nav, hero, book home, menú cta-band, vinos cta-band, conócenos, barra flotante global)* → `/reservas/`
- Regalar *(hero)* → `/regala/`
- Quiénes están detrás → *(quiénes home)* → `/conocenos/`
- Ver los pases → *(showcase home)* → `/menu/`
- Ver la carta de vinos → *(menú)* → `/vinos/`
- Leer → *(cada fila de prensa)*
- Descargar dossier (PDF) *(prensa)*
- Cómo llegar → *(footer, Google Maps)*
- Volver al inicio *(404)* → `/`
- Ver el menú *(404)* → `/menu/`
- Regálalo ahora *(H1 de regala; el CTA real es el widget)*

## Labels / eyebrows
- Restaurante de degustación · Madrid *(hero)*
- El menú *(showcase home)*
- Showcooking *(barra home, conócenos)*
- Quince pases en directo *(barra home, meta)*
- Reservar *(book home, label)*
- Madrid · Fuente del Berro *(book home, meta)*
- Degustación · Primavera *(menú)*
- La otra mitad *(menú, maridaje)*
- Reservas *(reservas)*
- Conócenos *(conócenos)*
- La bodega *(vinos)*
- La carta *(vinos, índice)*
- Galería *(galería)*
- Prensa *(prensa)*
- Para medios *(prensa, kit)*
- Comprar la tarjeta *(regala)*
- Error 404 *(404)*
- Etiquetas de datos: Días · Servicios · Menú degustación · Maridaje · Duración *(book home)*
- Firmas: Cofundador & Chef *(conócenos)*
- Meta menú nav: Horario · Dirección · Contacto
- Datos barra home: asientos en barra · chefs enfrente · metro hasta tu plato
- Datos maridaje: Seis copas · Seis fermentos
- Datos kit prensa: Email · Teléfono · Dirección
- Datos footer: Horario · Ubicación · Contacto

## Placeholders
- No hay campos de formulario propios (reservas y regalo van por iframe externo — TheFork y Bonkdo). No existen placeholders nativos en el código.

## Mensajes de estado
- **Cargando el calendario de reservas** *(reservas, con puntos animados)*
- **¿No carga? Reserva por Instagram o llama al 919 12 59 98.** *(reservas, fallback)*
- **¿Dudas? Escríbenos por Instagram o llama al 919 12 59 98.** *(book home, nota)*

## Links (destinos externos / especiales)
- Instagram: `https://instagram.com/restaurante.pipilacha` → texto `@restaurante.pipilacha` (nav, footer, galería, reservas, book home)
- Teléfono: `tel:+34919125998` → textos `919 12 59 98` / `+34 919 12 59 98`
- Email: `mailto:info@pipilacha.es` → texto `info@pipilacha.es`
- Google Maps: `https://maps.google.com/?q=C.+del+Azulejo+2+28028+Madrid`
- TheFork widget: `https://widget.thefork.com/867dcee9-49b5-47ed-90c0-c6c87149b328`
- Bonkdo (regalo): `https://pipilacha.bonkdo.com`
- Dossier prensa: `/assets/docs/pipilacha-dossier-prensa.pdf`

## Tooltips
- No hay tooltips (`title` de hover) sobre texto. Los únicos atributos `title` son de iframes (accesibilidad): `Reservas Pipilacha`, `Tarjetas regalo de Pipilacha`.

## Alt principales (imágenes con contenido)
- Hero home: `Cuenco de cerámica lleno de flores comestibles sostenido entre las manos`
- Quiénes home: `Arán Rodrigo y Noé David en la cocina de Pipilacha`
- Showcase home (4): `Espárragos a la brasa con romesco de tagete` · `Guisante coco-saúco` · `Vieira con flor de higo` · `Torrija de mandarina`
- Barra home: `La barra puesta para el servicio, frente a la cocina`
- Conócenos: `Arán Rodrigo, cofundador y chef` · `Noé David, cofundador y chef` · `Noé David apoyado en la barra, con el delantal de Pipilacha`
- Galería: las 20 descripciones listadas arriba
- Logo / isotipo (nav y footer): `Pipilacha`
- Decorativas (`alt=""`): todas las flores PNG, pétalos, capas de atmósfera, isotipo de la transición, flores del índice de vinos.

## Aria-labels de navegación / interacción
- Nav burger: `Abrir menú`
- Nav logo: `Pipilacha inicio`
- Menú principal (nav): `Menú principal`
- Secciones (explore home): `Secciones`
- Despertar (showcase home): `Ver el menú Despertar de las flores`
- Páginas (footer): `Páginas`
- Índice vinos: `Tipos de vino`
- Galería sección: `Galería inmersiva` (+ `aria-roledescription: carrusel`)
- Lightbox: `Galería ampliada`, `Cerrar galería`, `Foto anterior`, `Foto siguiente`, `Ampliar: {alt}`
- Pase secreto (menú): `Pase sorpresa, sin desvelar`
- Filas prensa: `{titular} — {medio}, {fecha}. Abre en una pestaña nueva.`

---

# JERARQUÍA

Para cada sección: H1 / H2 / H3 / Párrafos / Eyebrow / Blockquote / Caption.
La web no usa `<blockquote>` en ninguna página — esa fila se marca como «—».

## HOME

**Hero**
- H1: `Un menú entero / hecho de flores.`
- H2 / H3: —
- Eyebrow: `Restaurante de degustación · Madrid`
- Párrafos: `El único restaurante del mundo construido íntegramente sobre las flores.` (subtítulo)
- Blockquote: —
- Caption: —

**Quiénes somos**
- H1: —
- H2: `Un restaurante para curiosos.`
- H3: —
- Eyebrow: —
- Párrafos: 1 (el de "Quince pases y en todos manda una flor distinta…")
- Blockquote: —
- Caption: —

**Despertar de las flores (showcase)**
- H1 / H2 / H3: — *(el título es un `<span>` estilizado, no encabezado semántico)*
- Eyebrow: `El menú`
- Título visual (no heading): `Despertar de las flores`
- Párrafos: — *(`Ver los pases →` es un enlace)*
- Blockquote: —
- Caption: —

**Marquee**
- Sin jerarquía semántica (aria-hidden). Texto suelto en `<span>`.

**Explorar**
- Sin encabezados. Labels en `<span>`: Conócenos · El menú · Galería.

**Showcooking / barra**
- H1: —
- H2: `Se cocina / delante de ti.`
- H3: —
- Eyebrow / label: `Showcooking` + meta `Quince pases en directo`
- Párrafos: 1 lead (`La cocina está abierta y a un metro…`)
- Blockquote: —
- Caption: `La barra, antes del servicio` *(figcaption)*

**Reservar (book)**
- H1: —
- H2: `Dieciséis plazas / por servicio.`
- H3: —
- Eyebrow / label: `Reservar` + meta `Madrid · Fuente del Berro`
- Párrafos: lead (`Jueves a domingo, dos veces al día…`) + nota (`¿Dudas? …`)
- Blockquote: —
- Caption: — *(la ficha es una `<dl>`)*

## MENÚ

**Page header**
- H1: `Despertar de las flores`
- Eyebrow: `Degustación · Primavera`
- Párrafos: 1 (`Quince pases. Sin carta…`)

**Lista de pases**
- H1/H2/H3: — *(nombres de pase en `<span>`, dentro de `<ol>`)*
- Párrafos: las 15 pistas (`pase__hook`)

**Maridaje**
- H2: `Maridaje`
- H3: `Con vino` · `Sin alcohol`
- Eyebrow: `La otra mitad`
- Párrafos: intro + descripción de cada tarjeta
- Caption/count: `Seis copas` · `Seis fermentos`

**CTA band**
- H2: `El menú se cuenta en mesa`
- Párrafos: 1 lead

## RESERVAS

**Page header**
- H1: `Reservar / en Pipilacha`
- Eyebrow: `Reservas`
- Párrafos: 1 (`Elige día y turno abajo…`)

**Widget**
- Sin encabezados. Mensajes: carga + fallback.

## CONÓCENOS

**Page header**
- H1: `Todo empieza / con una pregunta`
- Eyebrow: `Conócenos`

**Concepto**
- Párrafos: 3
- Firmas (no heading): Arán Rodrigo / Noé David

**Showcooking**
- H2: `Cocinamos de cara`
- Eyebrow: `Showcooking`
- Párrafos: 2

## VINOS

**Hero**
- H1: `Vinos para quince pases`
- Eyebrow: `La bodega`
- Párrafos: 1 lead

**Cada familia**
- H2: nombre de la familia (Blancos / Naranja / Tintos / Espumosos / Dulces)
- Párrafos: la nota (`wine-cat__note`)
- Listas: nombre + uva por vino

**CTA band**
- H2: `Lo fácil: déjate llevar`
- Párrafos: 1 lead

## GALERÍA

**Frame**
- H1: `Lo que ocurre en la mesa`
- Eyebrow: `Galería`
- Hint (párrafo): `Arrastra, gira con la rueda o las flechas. Toca una foto para ampliarla.`
- Caption (lightbox): el `alt` de cada foto

## PRENSA

**Page header**
- H1: `Pipilacha / en los medios`
- Eyebrow: `Prensa`
- Párrafos: 1 (dossier informativo completo)

**Menciones**
- Sin heading por fila; medio+fecha+autor y titular en `<span>`.

**Kit de prensa**
- H2: `Kit de prensa`
- Eyebrow: `Para medios`
- Párrafos: 1

## REGALAR

**Comprar**
- H1: `Regálalo ahora`
- Eyebrow: `Comprar la tarjeta`
- Párrafos: 1 lead

## 404

- H1: `Esta flor / no ha brotado`
- Eyebrow: `Error 404`
- Párrafos: 1 lead

---

# ESTRUCTURA

Orden exacto de la Home (`src/pages/index.astro`):

```
Hero
  ↓
Quiénes somos (Un restaurante para curiosos)
  ↓
Despertar de las flores (showcase pineado → pantalla completa)
  ↓
Marquee (cinta de keywords)
  ↓
Explorar (Conócenos · El menú · Galería)
  ↓
Showcooking / La barra (Se cocina delante de ti)
  ↓
Reservar (Dieciséis plazas por servicio + ficha)
  ↓
Footer
```

Estructura del sitio (páginas):

```
Home (/)
├── Conócenos (/conocenos/)
├── Menú (/menu/)
├── Vinos (/vinos/)
├── Galería (/galeria/)
├── Prensa (/prensa/)
├── Regalar (/regala/)
├── Reservas (/reservas/)
└── 404
```
