# Pipilacha — Diseño Front-end, UX y UI

Este documento es el brief de diseño visual e interacción para la web de Pipilacha. **Reglas para Claude Code:**

1. Antes de escribir un solo componente, lee este archivo entero.
2. Los tokens de diseño (colores, tipografías, espaciado) están definidos aquí y se exportan a `tailwind.config.js`. **No inventes valores hex, tamaños o spacings que no estén aquí.**
3. Si una decisión no está cubierta en este documento, **pregunta antes de improvisar**.
4. Toda la web es una sola opinión estética sostenida en cada componente. Coherencia > variedad.

---

## 1. PRINCIPIOS DE DISEÑO

Estos seis principios mandan sobre cualquier decisión visual. Si dudas, vuelve aquí.

### 1.1. Editorial, no comercial

La referencia mental no es un restaurante de Madrid. Es una revista impresa de cocina. Pensar en *Apartamento*, *Magpie*, *Cherry Bombe*. Tipografía generosa, mucho aire, fotografía con presencia, layouts asimétricos donde tenga sentido.

**No**: cards redondeadas, badges, chips de colores, hero con CTA dobles centrados, secciones de "Por qué elegirnos", grids de 4 columnas de "Servicios".

**Sí**: titulares grandes en serifa, columnas de ancho desigual, mucho espacio negativo, una sola tipografía display + una sans para cuerpo, la fotografía manda.

### 1.2. La fotografía manda

La paleta cromática real de la web la aporta la fotografía. La interfaz es casi monocroma (Fresh Cream / Cloud White / Obsidian) precisamente para que las fotos no compitan. Cuando entra Terracotta es porque queremos foco. Y se usa con cuentagotas.

Las fotos respiran. Mínimo 80px de margen interior alrededor. No se recortan en círculo, no llevan filtro, no llevan overlay degradado salvo que el texto lo exija para legibilidad.

### 1.3. Restricción > acumulación

Cada vez que tengas la tentación de añadir un elemento, considera primero quitar otro. La web no tiene que demostrar nada. Cada pase de menú es un bloque editorial con número grande, título y una línea. Eso es suficiente. No iconos. No emojis. No badges de "Nuevo".

### 1.4. Tipografía como sistema, no como decoración

Tres tipografías. No cuatro. No cinco.

- **Display (titulares grandes)**: Cormorant Garamond, peso 400 y 500
- **Cuerpo (lectura)**: Barlow, peso 400 y 500
- **Marca (solo el wordmark)**: Marcellus — **no se usa en ningún otro sitio**

No se usan italics decorativos. Sí se usan italics semánticos (nombres de platos, palabras en otros idiomas).

### 1.5. Movimiento intencional, no efectos

GSAP existe para acompañar la lectura, no para decorar. Tres usos legítimos:

- **Fade-in suave al entrar en viewport** (opacity 0 → 1, sin movimiento), `ease: "power2.out"`, duración 0.8s, stagger 0.1s entre elementos.
- **Parallax muy ligero en fotografías grandes** (translateY, máximo 10% del alto del elemento).
- **Transición de página suave** (overlay Fresh Cream que entra y sale), no más de 600ms total.

**Prohibido**: cursors personalizados grandes, magnetic buttons, text reveal letra a letra, scroll-jacking, secciones que se "pegan" al scroll, parallax horizontal, partículas, hover effects que cambien el tamaño de elementos.

### 1.6. Mobile-first, pero el desktop manda en arte

La mayoría del tráfico será móvil, así que la maquetación móvil tiene que estar perfecta de entrada. Pero los momentos *editoriales* (titulares enormes, layouts asimétricos, juegos tipográficos) se diseñan pensando en desktop y se simplifican para móvil. No al revés.

---

## 2. TOKENS DE DISEÑO

Estos se exportan a `tailwind.config.js` como tema personalizado. **Estos son los únicos valores permitidos**. Si necesitas algo que no está, pregunta.

### 2.1. Colores

```js
colors: {
  obsidian:   '#0D0D0D',  // texto principal, fondos oscuros
  terracotta: '#9F5434',  // ÚNICO acento. Botones primarios, links activos
  'terra-claro': '#BA8B68', // hover/estados de Terracotta, casi nunca solo
  olive:      '#645D3B',  // texto secundario sobre cream
  moss:       '#31331F',  // bordes finos, dividers, texto sobre cream muy quieto
  'fresh-cream': '#F4EFE6', // fondo principal de la web
  'cloud-white': '#FEFCF6', // fondo de elevación (cards, modales)
  oat:        '#D5CDBC',  // dividers, fondos sutiles, hover de superficie
}
```

**Reglas de uso de color:**

- **Fondo por defecto**: `fresh-cream` en todas las páginas.
- **Texto por defecto**: `obsidian` sobre cream.
- **Texto secundario** (descripciones, metadata): `olive`.
- **Terracotta** solo en: botón primario, link activo en navegación, hover de enlaces de texto, número del pase en el menú.
- **Nunca** se usan dos tonos cálidos juntos como bloques grandes (Terracotta + Terra Claro como fondos grandes). Uno manda, el otro es detalle.
- **Negro puro (#000) está prohibido**. Usar Obsidian.
- **Blanco puro (#FFF) está prohibido**. Usar Cloud White.

### 2.2. Tipografía

```js
fontFamily: {
  display: ['Cormorant Garamond', 'serif'],
  body:    ['Barlow', 'sans-serif'],
  brand:   ['Marcellus', 'serif'],
}
```

**Escala tipográfica** (mobile / desktop, en rem):

| Token        | Mobile  | Desktop | Uso                                |
|--------------|---------|---------|------------------------------------|
| display-xl   | 3rem    | 5.5rem  | H1 de hero único                   |
| display-lg   | 2.25rem | 4rem    | H1 de páginas internas             |
| display-md   | 1.75rem | 2.75rem | H2 de secciones                    |
| display-sm   | 1.5rem  | 2rem    | H3, número de pase de menú         |
| body-lg      | 1.125rem| 1.25rem | Párrafos importantes               |
| body         | 1rem    | 1.0625rem| Cuerpo por defecto                |
| body-sm      | 0.875rem| 0.9375rem| Metadata, footer, nav             |
| eyebrow      | 0.75rem | 0.8125rem| Eyebrows (con letter-spacing 0.1em y uppercase)|

**Pesos**:
- Display: 400 (regular) por defecto, 500 (medium) para énfasis fuerte.
- Body: 400 para cuerpo, 500 para enlaces y botones.
- Marcellus: solo 400. Solo para el logo wordmark.

**Line-height**:
- Display: 1.05–1.15 (más apretado cuanto más grande)
- Body: 1.6
- Body-sm: 1.5
- Eyebrow: 1.2

**Letter-spacing**:
- Display: -0.01em (Cormorant ya viene generoso, lo apretamos un poquito)
- Body: 0
- Eyebrow: 0.1em + uppercase

### 2.3. Espaciado

Escala basada en múltiplos de 4px, con saltos editoriales:

```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 192px
```

Reglas:
- **Padding mínimo lateral en móvil**: 24px.
- **Padding mínimo lateral en desktop**: 96px (en pantallas >1280px).
- **Espacio vertical entre secciones**: 96px en móvil, 160px en desktop.
- **Ancho máximo de contenido textual**: 720px (lectura cómoda).
- **Ancho máximo de columna principal**: 1280px.

### 2.4. Bordes y radius

- **Border radius por defecto**: 0. Nada redondeado.
- **Excepción 1**: botones, 2px (apenas perceptible, solo evita la dureza absoluta).
- **Excepción 2**: imágenes dentro de cards o módulos editoriales, 0. Siempre 0.
- **Bordes**: 1px solid `oat` para dividers. Nunca usar shadows decorativos.

### 2.5. Shadows

Solo dos:

- **Elevación sutil** (botón flotante de reserva): `0 4px 12px rgba(13,13,13,0.08)`
- **Modal/overlay**: `0 20px 40px rgba(13,13,13,0.15)`

Para todo lo demás, no hay sombra. Usar bordes finos en `oat` si hace falta separar.

---

## 3. COMPONENTES

### 3.1. Navegación

La web tiene **seis páginas**: Inicio, Menú, Vinos y fermentos, Conócenos, Reservas, Prensa. En la barra superior solo aparecen cuatro enlaces (Menú · Vinos · Conócenos · Reservas) más el logo. **Prensa va solo en el footer** y en el menú móvil desplegado. Es una página para periodistas, no para clientes —no necesita ocupar real estate en la cabecera—.

**Desktop**:
- Posición: fixed top, fondo `fresh-cream` con `backdrop-blur` muy ligero al hacer scroll (un overlay de 80% opacidad sobre el cream).
- Altura: 80px.
- Estructura: logo izquierda · enlaces derecha · botón Reservar como link de texto, no como botón sólido.
- Tipografía nav: Barlow 500, body-sm, letter-spacing 0.05em, uppercase.
- Estado activo: subrayado fino 1px en Terracotta, no cambio de color.

**Mobile**:
- Posición: fixed top, altura 64px.
- Botón menú: tres líneas finas (1px), no icono grueso. Lado derecho.
- Menú abierto: full-screen overlay en `fresh-cream`, enlaces apilados, Cormorant Garamond display-md alineados a la izquierda con padding 32px.

### 3.2. Botón flotante de reserva

- Posición: fixed, esquina inferior derecha en móvil, esquina superior derecha del hero en desktop.
- Tamaño móvil: alto 48px, padding horizontal 24px, full-width inferior con margen 16px.
- Tamaño desktop: alto 44px, padding horizontal 32px.
- Color: fondo Terracotta, texto Cloud White.
- Tipografía: Barlow 500, body-sm.
- Hover: fondo Terra Claro, transición 200ms ease-out.
- **Sin sombra, sin borde, sin icono.** Solo texto.

### 3.3. Bloque editorial de pase de menú

Cada uno de los 15 pases del menú:

```
Layout móvil:
─────────────────────────────
01                ← display-sm, Terracotta, font-display
                  ← 16px spacing
Taco de tila y    ← display-md, Obsidian, font-display
flor de higo
                  ← 12px spacing
Harina de tila,   ← body, Olive, font-body
cremas, aliso...
─────────────────────────────
                  ← divider 1px oat
─────────────────────────────
02
...
```

Sin imágenes en cada pase. La página de menú es **puro texto editorial**. Si en algún momento quieres añadir fotos, no van pase por pase: van como bloques sueltos que se intercalan cada 4–5 pases, en formato grande (ancho completo en móvil, 50% en desktop con asimetría).

### 3.4. Hero del Inicio

Estructura desktop:

```
┌──────────────────────────────────────────┐
│                                          │
│  PIPILACHA                    Menú · etc │  ← navegación
│                                          │
├──────────────────────────────────────────┤
│                                          │
│ Madrid · Fuente del Berro                │  ← eyebrow
│                                          │
│ La flor                                  │  ← H1 visual, display-xl
│ como ingrediente.                        │
│                                          │
│ Quince platos donde las flores hacen     │  ← subtítulo, body-lg
│ el trabajo —de la acidez al perfume...   │
│                                          │
│ Reservar mesa  ·  Ver el menú            │  ← CTAs en línea, no apilados
│                                          │
└──────────────────────────────────────────┘
   [foto enorme abajo, ancho completo]
```

- El titular ocupa **dos líneas**, con corte intencional ("La flor / como ingrediente.")
- No hay imagen detrás del titular. El hero es tipográfico. La foto va debajo, full-bleed.
- Foto debajo: aspecto 16:9 en desktop, 4:5 en móvil. Sin overlay, sin texto encima.

### 3.5. Bloque "Qué es Pipilacha"

Layout asimétrico desktop:

```
┌──────────────┬─────────────────────────┐
│              │ H2: Qué es Pipilacha    │
│ [foto        │                         │
│  vertical    │ Tres párrafos...        │
│  formato     │                         │
│  4:5]        │                         │
│              │                         │
└──────────────┴─────────────────────────┘
   45% ancho      55% ancho
```

En móvil: foto arriba (4:5), texto debajo.

### 3.6. Footer

Layout desktop: 4 columnas iguales, top padding 96px, bottom padding 48px.
Layout móvil: columnas apiladas, divider `oat` 1px entre ellas.
Color: fondo `obsidian`, texto `oat`, enlaces `cloud-white` con hover `terracotta`.
Tipografía: Barlow body-sm en todo el footer. Los titulares de columna en eyebrow.

---

## 4. RESPONSIVE

Breakpoints (Tailwind defaults, sin custom):

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Reglas de diseño responsive:**

- Hasta `md` (768px): un solo container, padding lateral 24px.
- De `md` a `lg`: container con max-width, padding lateral 48px. Empiezan los layouts a dos columnas.
- A partir de `lg`: padding lateral 96px. Aparecen los layouts asimétricos.
- A partir de `xl`: max-width 1280px del contenido.

**Tipografía fluida**: usar `clamp()` para los display sizes entre mobile y desktop. Ejemplo para display-xl:

```css
font-size: clamp(3rem, 8vw, 5.5rem);
```

---

## 5. ACCESIBILIDAD

No negociable. Mínimos:

- **Contraste**: WCAG AA. Obsidian sobre Fresh Cream pasa con holgura (>15:1). Terracotta sobre Fresh Cream pasa AA en texto grande, **no en texto pequeño** — por eso Terracotta solo se usa en botones (donde el botón tiene el contraste) y en links/highlights de texto grande.
- **Focus visible**: outline 2px solid Terracotta, offset 4px. No `outline: none` jamás.
- **Tamaño táctil mínimo**: 44x44px en cualquier elemento clicable en móvil.
- **`alt` text**: obligatorio en todas las fotos. Sin alt = la foto no se sube.
- **Estructura semántica**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` con sus roles correctos. Nunca `<div>` haciendo de `<button>`.
- **Reduce motion**: respeta `prefers-reduced-motion`. Si el usuario lo tiene activado, **todas las animaciones de GSAP se desactivan**, no se ralentizan.
- **`lang="es"`** en el `<html>`.

---

## 6. PERFORMANCE — OBJETIVOS DURÓS

- **LCP (Largest Contentful Paint)**: <2.0s en 4G.
- **CLS (Cumulative Layout Shift)**: <0.05.
- **Total Blocking Time**: <200ms.
- **Peso total de la home**: <500KB incluyendo fotos.
- **PageSpeed Insights móvil**: >90.

Para lograrlo:

- Las fotos van en **WebP con fallback a JPG**, max 200KB por foto en hero, max 100KB en thumbs.
- Lazy loading nativo (`loading="lazy"`) en todas las fotos excepto la del hero.
- Tipografías: precargadas con `<link rel="preload">`. Solo los pesos que se usan: Cormorant 400/500, Barlow 400/500, Marcellus 400.
- Astro genera HTML estático: no hay JS de framework en cliente salvo lo que toque para GSAP. **No** se mete React/Vue/etc.
- GSAP solo se carga en las páginas que lo necesitan. La página de menú casi no tiene animación, no debería cargar GSAP completo.

---

## 7. FOTOGRAFÍA: REGLAS DE CRESCENDO

Esto no es un sistema de fotos —ese ya lo tienes—. Es cómo se usan en la web:

- **Hero del Inicio**: una sola foto, plato del menú, full-bleed, formato cinematográfico (16:9 desktop, 4:5 móvil).
- **Página Menú**: idealmente **sin fotos** o con muy pocas. El menú vive en lo tipográfico.
- **Página Vinos y fermentos**: una sola foto, formato editorial. Botellas en sala o detalle de un fermento en frasco —no foto de copa servida con pareja brindando—. La foto va arriba, ancho completo, formato 21:9 (panorámico).
- **Página Conócenos**: una foto vertical 4:5 de Arán y Noé en cocina, sin posar, captada en movimiento. Aparece en la cabecera. Opcionalmente una segunda foto del local en horizontal hacia el final.
- **Página Reservas**: una foto del comedor o detalle del servicio, no del plato.
- **Página Prensa**: sin fotos de platos. Logo y descargas.

**Tratamiento**: foto plana, sin filtros, sin viñeteado. Tal como salen del estudio. Si una foto no tiene calidad para ir sin tratamiento, no entra a la web.

---

## 8. FLUJOS UX CLAVE

### 8.1. Flujo de reserva

```
Inicio
  ↓ (botón "Reservar mesa")
/reservas
  ↓ (botón "Reservar por TheFork")
Widget de TheFork (puede ser modal o página externa)
  ↓
Confirmación
  ↓
Email automático con detalles
```

El widget de TheFork debe abrirse **inline** si es posible (no salir de la web). Si solo se puede como link externo, se abre en pestaña nueva y la pestaña actual queda con un mensaje "Te esperamos. Si no completas la reserva en TheFork, vuelve aquí y llámanos".

### 8.2. Flujo "voy a leer el menú"

El menú está a **un click** desde cualquier página. La nav lo tiene como primer enlace después del logo. La página de menú no tiene CTA arriba — abajo del todo sí hay un "Reservar mesa". El que llega al final del menú es el que quiere reservar.

### 8.3. Flujo de prensa

Un periodista llega buscando descargas. La página de Prensa tiene los tres bloques de descarga **visibles arriba del fold** sin tener que hacer scroll. Datos de contacto a la vista. Apariciones en medios como complemento, no como sección principal.

---

## 9. WORDPRESS / ARSYS — NOTA

La web actual está en WordPress sobre hosting de Arsys. El plan **no es cambiar de hosting ni de plataforma**. Las opciones reales:

**Opción A — Quedarse en WordPress y rediseñar dentro**
- Theme custom basado en los tokens de este documento.
- Más rápido de desplegar, mantenimiento conocido.
- Limitaciones de performance del PHP renderizado.

**Opción B — Web estática (Astro) sobre dominio nuevo o subdominio**
- Performance superior, mejor SEO técnico.
- Hay que decidir cómo conviven con TheFork y si se quiere mantener WordPress para algo (no parece necesario).

Esta decisión la toma el usuario. Claude Code **no decide esto solo**. Pregunta antes de empezar.

---

## 10. CHECKLIST FINAL ANTES DE DESPLEGAR

Cuando creas que una página está terminada, antes de pedirle al usuario que la apruebe, comprueba:

- [ ] La página renderiza correctamente en móvil 375px (iPhone SE).
- [ ] La página renderiza correctamente en desktop 1440px.
- [ ] El contraste de todos los textos pasa WCAG AA.
- [ ] `prefers-reduced-motion` desactiva todas las animaciones.
- [ ] Tab navigation visita todos los elementos interactivos en orden lógico.
- [ ] Focus visible está activo en todos los botones y links.
- [ ] Todas las imágenes tienen `alt` text.
- [ ] El title tag y la meta description coinciden con lo definido en `contenido.md`.
- [ ] No hay `console.log`, ni TODO, ni placeholders tipo "Lorem ipsum".
- [ ] El copy coincide letra por letra con `contenido.md`.
- [ ] Lighthouse mobile score: Performance >90, Accessibility >95, Best Practices >95, SEO >95.

---

## 11. QUÉ NO HACER NUNCA

Lista corta para tener a mano:

1. No usar valores hex que no estén en la sección 2.1.
2. No añadir tipografías además de las tres declaradas.
3. No usar emojis. En ningún sitio.
4. No usar iconos de Lucide / Heroicons en bloques de contenido. Como mucho, iconos de redes sociales en footer.
5. No hacer cards redondeadas.
6. No usar gradients de color.
7. No hacer parallax horizontal.
8. No poner una "newsletter signup" en el footer.
9. No usar carruseles.
10. No usar el wordmark Marcellus en ningún sitio que no sea el logo.
11. No traducir "Despertar de las Flores" al inglés.
12. No mencionar el paso de Arán por Ramón Freixa en ningún copy de la web.
13. No usar la palabra "experiencia", "botánico", "alta cocina" ni ninguna del blacklist de marca.
14. No añadir testimonios falsos ni placeholders de testimonios "de prueba".
15. No deployar sin que el usuario haya aprobado la sección.

---

Si una decisión no está cubierta aquí, **pregunta**.
