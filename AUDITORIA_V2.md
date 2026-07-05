# AUDITORÍA V2 · Arquitectura web Pipilacha

**Fecha:** 5 de julio de 2026
**Alcance:** todo el proyecto Astro (`src/`, `public/`, config, build) — sin cambios de comportamiento visual.
**Estado del código auditado:** commit `bbb5d2f`, rama `main`, árbol limpio.

---

## 1. Lo que está bien

| # | Qué | Por qué importa |
|---|-----|-----------------|
| B1 | **HTML completo sin JS.** Todo el contenido (menú, vinos, galería, prensa) se renderiza estático; los `.reveal` solo se ocultan si existe la clase `.js` en `<html>`. | SEO y LLM SEO: los crawlers (y los LLM que no ejecutan JS) ven el 100 % del contenido. Resiliencia real. |
| B2 | **`prefers-reduced-motion` integral.** CSS (`*{animation:none}`) y JS (sin Lenis, sin tweens, galería degradada a tira desplazable). | Accesibilidad WCAG 2.3.3 cubierta de serie. |
| B3 | **Ciclo de vida por página disciplinado.** `initPage()`/`destroyPage()` con `AbortController` + `pageCleanups`: los listeners y motores mueren en cada transición asíncrona. | Evita fugas de memoria y triggers zombis en la navegación SPA-like. |
| B4 | **SEO on-page sólido.** Canonical absoluto, OG/Twitter completos, `robots.txt` con crawlers de IA permitidos, sitemap, trailing slashes coherentes, `alt` cuidados y descriptivos, schema Restaurant/Menu/Person ya presente. | Base fuerte; lo que falta es conectar las entidades (ver P7). |
| B5 | **LCP bien tratado en el Inicio.** `<link rel="preload">` del hero con `imagesrcset` + `fetchpriority="high"` + `srcset` móvil/desktop. | El elemento LCP llega lo antes posible. |
| B6 | **Tokens de marca centralizados** en `:root` con escala de texto y contraste documentado (AA). | Mantenibilidad del design system. |
| B7 | **Vendor self-hosted** (Lenis/GSAP/ScrollTrigger en `/js/vendor/`), sin CDN de terceros. | Privacidad y estabilidad (excepto Google Fonts, ver P3). |
| B8 | **Accesibilidad por encima de la media**: burger con `aria-expanded/controls`, lightbox con gestión de foco y Esc, carrusel manejable por teclado, `sr-only`, iframes con `title`, fallbacks visibles de los widgets. | Cumple gran parte de WCAG sin parches. |
| B9 | **Transición asíncrona con red de seguridad**: fallback a navegación clásica en error, `ptSafety` CSS si el JS no llega, `bfcache` contemplado (`pageshow`). | UX premium sin sacrificar robustez. |
| B10 | **`.htaccess`** con expires, `Cache-Control` y deflate para el hosting final. | El deploy estático queda cacheado correctamente. |

---

## 2. Problemas encontrados

Formato: **Riesgo** (qué puede salir mal si se toca / si no se toca) · **Impacto** (a qué objetivo afecta) · **Prioridad** · **Solución propuesta**.

### P1 · JS monolítico en `public/` + cache busting manual `?v=81`
`public/js/main.js` (805 líneas, 37 KB) concentra 7 responsabilidades (hero, nav, router de transiciones, reveals, galería 3D, scrollspy de vinos, lightbox). Al vivir en `public/` no pasa por Vite: sin hash, sin minificar, sin tree-shaking, y el `?v=N` hay que subirlo a mano en cada edición (hay hasta una nota de memoria del proyecto dedicada a no olvidarlo — señal inequívoca de deuda).
- **Riesgo si no se toca:** JS viejo servido a usuarios (ya ha pasado); ediciones cada vez más caras en un archivo de 800+ líneas.
- **Impacto:** mantenibilidad, rendimiento (sin minificar: ~37 KB → ~16 KB min+gzip), fiabilidad de deploys.
- **Prioridad:** **ALTA**
- **Solución:** mover la lógica a `src/scripts/` con la división por responsabilidades propuesta (animations/, scroll/, gallery, utils), importada desde un único `<script>` de `Base.astro`. Vite lo bundlea, minifica y **hashea el nombre** → el `?v=N` desaparece (objetivos 1, 2 y 5 del encargo se resuelven juntos; nota: la modularización en `public/js/` a secas no permitiría el cache busting nativo — por eso los módulos van a `src/`).

### P2 · Vendor cargado como globals + 16 KB de JS muerto en dist
Tres `<script is:inline>` síncronos al final del body en todas las páginas (gsap 72 KB + ScrollTrigger 43 KB + lenis 13 KB sin comprimir). Además se publican en `dist/` dos archivos que **nadie carga**: `split-type.min.js` (11,8 KB; SplitType ya no se usa en ningún sitio) y `referencia.js` (4,6 KB; solo lo usaba `_referencia.astro`, que no se enruta). La dependencia npm `split-type` tampoco se usa.
- **Riesgo:** bajo al tocarlo — gsap/lenis ya están en `package.json` con las mismas versiones que el vendor (3.12.5 / 1.1.x).
- **Impacto:** rendimiento (payload muerto), mantenibilidad (dos fuentes de verdad: npm + vendor).
- **Prioridad:** **ALTA**
- **Solución:** importar `gsap`, `gsap/ScrollTrigger` y `lenis` desde npm dentro del bundle único (mismo código de librería, orden de carga garantizado por imports). Mantener `window.lenis`/`window.gsap` expuestos (depuración). Eliminar `public/js/vendor/`, `referencia.js` y la dep `split-type`.

### P3 · Google Fonts externo
`fonts.googleapis.com` + `fonts.gstatic.com`: dos conexiones extra, CSS render-blocking en el head, envío de la IP del visitante a Google (zona gris RGPD en la UE — hay sentencias alemanas al respecto) y dependencia de un tercero.
- **Riesgo:** bajo — el CSS de Google se replica en local con los mismos woff2.
- **Impacto:** rendimiento (LCP/FCP), privacidad, Lighthouse, estabilidad.
- **Prioridad:** **ALTA**
- **Solución:** descargar los woff2 (Marcellus 400 + Hanken Grotesk 300/400/500/600, subsets latin y latin-ext), servirlos desde `public/assets/fonts/`, `@font-face` con `font-display:swap` y `unicode-range` idénticos a los de Google, `preload` de los 2 archivos críticos. Cero cambio visual: son los mismos binarios de fuente.

### P4 · Imágenes: 20,7 MB en `public/`, sin WebP/AVIF, `srcset` solo en el hero
13 MB de JPG (48 archivos, sips q72) + 7,7 MB de PNG (45 flores/pétalos con alfa; `flor-clavel.png` 402 KB, `flor-geranio.png` 392 KB…). La página de galería carga 10 fotos eager (~2,5 MB). Las flores decorativas en PNG son el peor ratio bytes/píxel del proyecto.
- **Riesgo:** medio — hay que conservar exactamente la calidad visual (conversión a calidad alta, verificación visual posterior). Las imágenes referenciadas desde CSS (`--img` en Explorar/Prensa) y las que manipula el JS de la galería necesitan trato aparte.
- **Impacto:** rendimiento (LCP en páginas internas, datos móviles), Lighthouse.
- **Prioridad:** **ALTA**
- **Solución:** pipeline con Pillow (disponible, con soporte WebP y AVIF nativos): (a) generar `.webp` hermanos de cada JPG/PNG (q85 fotos, q90+alfa flores); (b) `<picture>` con fallback en las fotos de contenido; (c) swap directo a `.webp` en las flores decorativas (`aria-hidden`, soporte WebP universal desde 2020); (d) `srcset` responsive en las fotos grandes de contenido. Las URLs en CSS (`--img`) se quedan en JPG en esta fase (cambiarlas a `image-set()` tiene soporte desigual). **Astro Assets** queda documentado como evolución futura (exige mover originales a `src/` y tocar el motor de la galería; no compensa el riesgo ahora).

### P5 · Lenis recibe doble `raf` por frame
`main.js` crea su propio bucle `requestAnimationFrame(raf)` **y además** `gsap.ticker.add(t => lenis.raf(t*1000))`. Con GSAP presente (siempre), `lenis.raf()` corre dos veces por frame.
- **Riesgo:** nulo — el patrón oficial de Lenis+GSAP es un único driver (el ticker de GSAP).
- **Impacto:** rendimiento (trabajo duplicado por frame en el hilo principal), INP.
- **Prioridad:** **MEDIA**
- **Solución:** usar el `gsap.ticker` como único driver cuando hay GSAP; el bucle rAF propio solo como fallback sin GSAP.

### P6 · Código muerto
- `src/components/DespertarFlores.astro` (223 líneas): **ninguna página lo importa** (la home implementa su propio showcase).
- `src/pages/_referencia.astro` (excluida del routing, referencia `referencia.js?v=4`).
- CSS muerto: bloque `.quienes__stats` (~40 líneas; la home ya no tiene stats), `.hero__scroll` (+keyframe `scrollline`; el hero ya no tiene indicador).
- **Riesgo:** nulo (verificado con grep en todo `src/`).
- **Impacto:** mantenibilidad, peso del CSS.
- **Prioridad:** **MEDIA**
- **Solución:** eliminar (el repo git conserva la historia; `site/` sigue siendo el backup de referencia).

### P7 · Schema.org: entidades sueltas, sin grafo (prioritario para LLM SEO)
El schema Restaurant solo existe en el Inicio y **sin `@id`**; las `Person` de Conócenos no se relacionan con el restaurante más que por nombre; los `Menu` de menú/vinos no cuelgan de nadie (`hasMenu` inexistente); no hay `WebSite` ni `BreadcrumbList`; falta `founder`, `foundingDate`, `hasMenu`, `knowsAbout`. Para un LLM, "Pipilacha", "Arán Rodrigo" y "Despertar de las flores" son hoy tres islas.
- **Riesgo:** bajo — JSON-LD invisible; no toca diseño.
- **Impacto:** LLM SEO (objetivo prioritario del encargo), Knowledge Graph, rich results.
- **Prioridad:** **ALTA**
- **Solución:** grafo único con `@id` estables (`https://pipilacha.es/#restaurant`, `#website`, `#aran`, `#noe`, `#menu-degustacion`):
  - `Restaurant` en **todas** las páginas (emitido por `Base.astro`) con `founder` → las dos `Person`, `hasMenu` → el Menu, `servesCuisine`, `knowsAbout` (flores comestibles, cocina floral, investigación botánica), `sameAs` (Instagram, TheFork), `image`, `priceRange`, geo y horarios ya existentes.
  - `Person` con `@id`, `knowsAbout` y `worksFor` → `#restaurant` (refuerza EEAT de Arán y Noé).
  - `Menu`/`MenuSection` colgando de `#restaurant` vía `hasMenu`.
  - `BreadcrumbList` en páginas internas (Inicio → Página).
  - `WebSite` con `publisher` → `#restaurant`.
  - Cadena de entidades reforzada: Pipilacha → Restaurant → Madrid (address/geo) → alta cocina (servesCuisine/priceRange) → flores comestibles (knowsAbout) → menú degustación (hasMenu) → investigación botánica (knowsAbout/description) → experiencia (reservas/acceptsReservations).
  - **FAQPage: descartado** — no hay FAQ visible en la web y el marcado sin contenido visible va contra las directrices de Google (y contra el encargo: solo marcado con valor real).

### P8 · Astro 4.16 (fin de ciclo) — migración a Astro 5
Astro 5 es estable desde diciembre 2024; la rama 4.x ya no recibe features. Análisis de breaking changes **aplicables a este proyecto**:

| Breaking change Astro 5 | ¿Afecta? | Resolución |
|---|---|---|
| Content Layer API reemplaza content collections | No — no hay colecciones | — |
| `output: 'hybrid'` eliminado | No — `output: 'static'` | — |
| `squooshImageService` eliminado | No — no se usa Astro Assets | — |
| Vite 5 → 6 | Sí, transitivamente | Sin config Vite custom: sin acción |
| Node < 18.17.1 no soportado | No — se compila con Node 20 (nvm) | — |
| `ViewTransitions` renombrado a `ClientRouter` | No — router propio | — |
| Tipos `astro/client` (env.d.ts) | Compatible | Regenerar `.astro/types` |
| Scripts `is:inline` / hoisted | Comportamiento igual en v5 | Verificar orden en build |

- **Riesgo:** bajo-medio; proyecto sin integraciones ni SSR. Único punto a vigilar: que el bundling de scripts hoisted mantenga un solo chunk y el orden.
- **Impacto:** mantenibilidad a años vista (objetivo 14), seguridad de dependencias.
- **Prioridad:** **MEDIA**
- **Solución:** migrar en commit propio, al final, con build + verificación visual completa antes y después. Si algo difiere, se revierte el commit y se documenta.

### P9 · `Base.astro` monolítico y datos incrustados en las páginas
Nav (17 líneas), footer (34), head/SEO y schema conviven en un archivo; los datos de contenido (15 pases, 24 vinos, 20 fotos, 5 menciones) viven dentro del frontmatter de cada página.
- **Riesgo:** nulo — extraer componentes/datos no cambia el HTML emitido.
- **Impacto:** mantenibilidad y escalabilidad (objetivo 14): cambiar un vino no debería exigir leer 150 líneas de página.
- **Prioridad:** **MEDIA**
- **Solución:** `src/components/Nav.astro`, `Footer.astro`, `Seo.astro` (head + schema builder); datos a `src/data/{menu,vinos,galeria,prensa}.js`. Mismo HTML byte a byte (verificable con diff del build).

### P10 · GSAP: limpieza manual en vez de `gsap.context()`
`destroyPage()` mata triggers uno a uno y tweens concretos con `killTweensOf` — funciona, pero cada animación nueva obliga a acordarse de limpiarla. Los tweens de botones magnéticos sobre elementos persistentes (nav CTA) no se matan (fugas menores de tween al navegar).
- **Riesgo:** bajo — `gsap.context()` + `ctx.revert()` es el patrón oficial para exactamente este caso.
- **Impacto:** mantenibilidad, robustez de la navegación asíncrona.
- **Prioridad:** **MEDIA**
- **Solución:** envolver las animaciones por página en un `gsap.context()` que `destroyPage()` revierte. El resultado visual no cambia; la limpieza pasa de manual a estructural. `matchMedia()` de GSAP: no necesario hoy (el único caso, `isMobile` del showcase, se evalúa por montaje de página, comportamiento intencional).

### P11 · Accesibilidad: dos flecos
1. En móvil, el cajón de nav cerrado (`translateX(100%)`) sigue en el orden de tabulación: un usuario de teclado "tabula hacia links invisibles" (WCAG 2.4.3).
2. El lightbox gestiona foco de entrada/salida y Esc, pero no atrapa el Tab dentro (WCAG 2.4.3 en diálogos modales).
- **Riesgo:** nulo — cambios CSS/JS sin efecto visual.
- **Impacto:** accesibilidad WCAG.
- **Prioridad:** **MEDIA**
- **Solución:** (1) `visibility:hidden` con `transition-delay` en el cajón cerrado (patrón estándar, la animación se ve idéntica); (2) bucle de foco simple en el lightbox (Tab/Shift+Tab entre sus 3 botones).

### P12 · Flecos menores de rendimiento y SEO
- `onScroll` lee `window.innerHeight` en cada evento de scroll (lectura de layout evitable; cachear en resize).
- Falta `meta theme-color` (barra del navegador móvil en crema/moss — cosmético pero premium).
- OG: falta `og:image:width/height/alt` (evita re-fetch de scrapers y mejora accesibilidad del share).
- Sitemap sin `lastmod` (los crawlers priorizan peor).
- `.htaccess`: `Cache-Control immutable` sobre JS/CSS **sin hash** es incorrecto hoy (P1 lo arregla de raíz al hashear); conviene añadir tipos `woff2` y `avif/webp`.
- **Prioridad:** **BAJA** (se aprovechan de pasada en las fases anteriores).

### P13 · CSS: 1032 líneas en un archivo
Organizado y con buenos comentarios, pero mezcla reset, componentes compartidos y estilos de página; la cascada depende del orden del archivo (los overrides responsive del final pisan lo anterior).
- **Riesgo:** medio si se divide (el orden de la cascada debe preservarse exactamente); nulo si solo se reordena con índice.
- **Impacto:** mantenibilidad.
- **Prioridad:** **BAJA** — el archivo aún es manejable y Vite lo bundlea igual.
- **Solución propuesta (no urgente):** dividir vía `@import` en orden idéntico (`tokens.css`, `base.css`, `components/*.css`, `pages/*.css`, `motion.css`) — Vite los concatena en un solo CSS con hash, cascada intacta. Se puede hacer en una fase posterior con diff de build como prueba de equivalencia.

---

## 3. Plan de fases propuesto (Fase 3 del encargo)

| Fase | Contenido | Problemas que cierra | Riesgo |
|---|---|---|---|
| **A** | Limpieza de código muerto | P6, parte de P2 | Nulo |
| **B** | JS → `src/scripts/` modular + imports npm + dynamic import de galería + fix doble raf + `gsap.context()` + hashing nativo (adiós `?v=N`) | P1, P2, P5, P10 | Medio (el más delicado; verificación exhaustiva) |
| **C** | Fuentes locales + preload | P3 | Bajo |
| **D** | Grafo schema.org + metas menores + sitemap lastmod + theme-color | P7, P12 | Nulo |
| **E** | Imágenes: WebP + `<picture>`/`srcset` | P4 | Medio (verificación visual) |
| **F** | Componentes Nav/Footer/Seo + datos a `src/data/` | P9 | Bajo |
| **G** | Accesibilidad (nav móvil, focus trap) | P11 | Bajo |
| **H** | Migración Astro 5 (commit propio, reversible) | P8 | Bajo-medio |
| — | CSS split por capas | P13 | Se propone; no se aplica en esta pasada |

Cada fase termina con `npm run build` + verificación en preview (consola limpia, transiciones, animaciones, las 9 páginas) y un commit propio.

**Norma del encargo respetada:** ninguna de estas fases cambia el resultado visual. Lo único que un usuario podría llegar a notar es positivo: carga más rápida y las mismas fuentes servidas desde el propio dominio.

---

## 4. Métricas esperadas (estimación honesta)

| Métrica | Hoy | Tras V2 |
|---|---|---|
| JS transferido (página interna) | ~166 KB sin comprimir (4 archivos, sin minificar main.js) + 16 KB muertos en dist | ~60–70 KB gzip en 1–2 archivos hasheados; galería solo en `/galeria/` |
| Fuentes | 2 dominios externos, CSS bloqueante | mismo woff2, dominio propio, preload |
| Imágenes (peso total servible) | 20,7 MB | ~7–9 MB (WebP), mismas dimensiones y calidad visual |
| Schema | 4 entidades sueltas | 1 grafo conectado en todas las páginas |
| Cache busting | manual (`?v=81`) | hash de build automático |
| Trabajo por frame (scroll) | `lenis.raf` ×2 | ×1 |
