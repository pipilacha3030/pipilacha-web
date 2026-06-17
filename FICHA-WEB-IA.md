# FICHA DE CONTEXTO — Web Pipilacha (para prompts de IA)

> Pega este bloque (o las secciones que necesites) al principio de cualquier prompt
> cuando le pidas a otra IA mejoras de diseño, efectos, animaciones o ediciones.
> Última actualización: junio 2026.

---

## 1. QUÉ ES

Web a medida del restaurante **Pipilacha** (Madrid): menú de degustación construido
íntegramente sobre las **flores comestibles** como ingrediente, no como adorno.
Eslogan: *"El único restaurante del mundo construido íntegramente sobre las flores."*
Sitio **multipágina** con scroll suave y animaciones por scroll. Tono editorial, poético
pero claro; sensación premium, calmada, orgánica.

## 2. STACK TÉCNICO

- **Astro 4** (salida estática `static`). HTML generado en `dist/`.
- **CSS vanilla** con tokens en `:root` (sin Tailwind, sin frameworks de UI).
- **GSAP 3.12.5** + **ScrollTrigger** → todas las animaciones.
- **Lenis 1.1.13** → scroll suave (smooth scroll).
- GSAP y Lenis están **auto-alojados** en `public/js/vendor/` (NO CDN). Se cargan como
  `<script is:inline>` y exponen globales: `window.gsap`, `window.ScrollTrigger`,
  `window.Lenis` (+ instancia `window.lenis`).
- Sin build de JS: la lógica de interacción es un único archivo plano `public/js/main.js`.
- **Node 18+** (en esta máquina: `nvm use 20`).

## 3. ESTRUCTURA DE ARCHIVOS

```
src/
  layouts/Base.astro      ← shell común: <head>, nav, footer, slot, scripts, cortina de
                            transición, intro (solo home). TODA página envuelve esto.
  pages/
    index.astro           ← Home (hero, marquee, manifiesto, showcase, explorar, barra, reserva)
    conocenos.astro       ← Chefs / concepto
    menu.astro            ← "Despertar de las flores": 15 pases en carrusel de tarjetas de cristal + maridaje
    galeria.astro         ← Carrusel de fotos + lightbox
    vinos.astro           ← Carta de vinos real (copa/botella)
    regala.astro          ← Tarjeta regalo
    prensa.astro          ← Menciones en medios + kit de prensa
    reservas.astro        ← Widget TheFork (iframe)
  styles/main.css         ← TODO el CSS (tokens, componentes, responsive, motion)
public/
  js/main.js              ← Interacción (GSAP/Lenis). Cache-buster ?v=N en Base.astro.
  js/vendor/              ← lenis.min.js, gsap.min.js, ScrollTrigger.min.js (auto-alojados)
  assets/img/             ← Fotos optimizadas + pétalos PNG transparentes + logos/isotipo
  assets/docs/            ← PDFs descargables (dossier prensa, carta vinos)
dist/                     ← Salida del build (NO editar a mano)
```

> Regla: editar SIEMPRE en `src/` y `public/`. Nunca en `dist/` (se regenera).
> `site/` es la versión vieja pre-Astro, solo backup — ignorar.

## 4. TOKENS DE DISEÑO (CSS `:root`)

**Colores**
| Token | Hex | Uso |
|---|---|---|
| `--moss` | `#31331F` | verde muy oscuro; secciones oscuras, texto sobre claro fuerte |
| `--olive` | `#645D3B` | oliva; footer, hovers |
| `--terracotta` | `#645D3B` | **acento sobre fondo claro** (es verde olivo, NO terracota; el nombre es heredado) |
| `--accent-soft` | `#B0A77F` | acento sobre fondo OSCURO (contraste AA sobre moss) |
| `--cream` | `#F4EFE6` | fondo cálido por defecto de la página |
| `--cloud` | `#FBFAF5` | casi blanco; tarjetas |
| `--ink` | `#2A2A22` | texto sobre fondo claro |

⚠️ **PROHIBIDO** usar rosa (`#C73B6B`) o terracota real (`#9F5434`). El acento de marca es
**verde**. Todo color nuevo debe salir de estos tokens.

**Tipografías** (Google Fonts)
- `--serif: 'Marcellus'` → títulos/display (h1–h4 ya la usan, weight 400).
- `--sans: 'Hanken Grotesk'` (weights 300/400/500/600) → cuerpo. Body en weight **300**.
- Hanken es sustituto de la licenciada **Roobert** (cambiar si hay licencia).

**Layout / forma**
- `--maxw: 1320px` · `--gutter: clamp(1.25rem,5vw,5rem)`
- `--ease: cubic-bezier(.22,1,.36,1)` (curva de marca para transiciones)
- Radios: `--radius:22px` (fotos/tarjetas), `--radius-sm:14px`, `--radius-btn:6px`
- Breakpoints responsive: **900px** y **560px**.

## 5. SISTEMA DE ANIMACIÓN (lo más importante para pedir efectos)

- **Lenis** mueve el scroll. Conectado a GSAP así:
  `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))`.
  → Para animaciones por scroll, apóyate en este loop, NO en eventos `scroll` nativos.
- **Patrón `.reveal`**: cualquier elemento con clase `.reveal` empieza
  `opacity:0; translateY(32px)` (en CSS) y entra con un ScrollTrigger genérico en `main.js`.
  Para que algo aparezca al hacer scroll → añade `class="reveal"`. Es el patrón estándar.
- **Hero**: sus elementos usan `data-delay="0.NN"` (animación por tiempo, no por scroll).
- **Parallax**: elementos con `data-parallax="0.NN"` reciben `yPercent` scrubbeado por scroll.
  Se usa en medios grandes (hero, barra, fotos). 
  ⚠️ **NUNCA** poner `data-parallax` en los pétalos flotantes (`.petal--*`): GSAP pelea con
  las keyframes CSS `float`/`float2`. Los pétalos se mueven SOLO por animación CSS.
- **Carrusel** (`.carousel` / `.slide`): módulo en `main.js` con drag, inercia, snap, barra de
  progreso, contador y flechas. Lo reusan la galería y el menú (tarjetas de cristal).
- **Cortina de transición entre páginas**: `#pageTransition` (columnas moss que barren al
  navegar). Intercepta enlaces internos en `main.js`.
- **Glassmorphism** (tarjetas del menú/maridaje): `backdrop-filter: blur() saturate()` + ruido
  SVG `feTurbulence` (data-URI) + fallback `@supports not (backdrop-filter)`.
- **Respiración** de tarjetas: keyframe `cardBreathe` (scale/translateY) con `animation-delay`
  escalonado para que floten desfasadas.
- **`prefers-reduced-motion: reduce`** desactiva TODA animación. Respetar siempre.

## 6. PÁGINAS Y RUTAS (con trailing slash)

`/` · `/conocenos/` · `/menu/` · `/vinos/` · `/galeria/` · `/regala/` · `/prensa/` · `/reservas/`

⚠️ Los enlaces internos usan **barra final** (`/menu/`, no `/menu`) para casar con la salida
de directorios de Astro y evitar redirecciones.

## 7. CONVENCIONES / REGLAS DURAS (que la IA debe respetar)

1. **Cache-buster**: al editar `public/js/main.js`, subir el `?v=N` en `Base.astro`
   (`<script src="/js/main.js?v=N">`). Actual: **v=21**. Si no, el navegador sirve JS viejo.
2. **Trailing slash** en enlaces internos.
3. **Scripts `is:inline`** en Base.astro: NO quitar `is:inline` ni el orden de carga
   (Lenis → gsap → ScrollTrigger → main.js) o se rompen los globales.
4. **No `data-parallax` en pétalos** (ver §5).
5. **Paleta**: solo tokens de §4. Nada de rosa/terracota.
6. **Menú = misterio**: el menú NO lleva fotos de los platos (se mantiene la intriga;
   cada pase solo da una "pista"). La galería sí tiene fotos.
7. **Copy en español** y en la **voz de marca** Pipilacha (poética pero clara; humana, joven,
   culta; nunca pretenciosa ni cursi). No inventar datos del restaurante (ver §8).
8. **Isotipo**: la libélula es `public/assets/img/iso-light.png`. El logo (libélula + wordmark)
   es `logo-light.png` / `logo-dark.png`. La marca de la libélula vive en las tarjetas del menú.

## 8. DATOS DEL RESTAURANTE (mantener consistentes)

- 16 plazas por servicio (8 en barra de iroko de 6 m frente a cocina).
- Abierto **jueves a domingo**, 2 turnos: **14:00** y **21:00**.
- Menú degustación **"Despertar de las flores"**, **15 pases**, **85 € / persona**.
- Maridaje opcional (6 copas): **+60 € / persona**.
- Chefs fundadores: **Arán Rodrigo** y **Noé David**.
- Dirección: **C. del Azulejo, 2 · 28028 Madrid**. Tel **+34 919 12 59 98**.
- Email prensa/regalo: **admin@pipilacha.es** · Instagram **@restaurante.pipilacha**.
- Reservas vía **TheFork** (widget iframe en `/reservas/`).

## 9. CÓMO CORRER / DESPLEGAR

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20
npm install        # primera vez
npm run dev        # dev server (astro dev)
npm run build      # → estático en dist/
```
Deploy: `npm run build` y subir `dist/` a cualquier host estático.
Producción actual en **Netlify** (proyecto `pipilachaweb` → https://pipilachaweb.netlify.app).

## 10. CÓMO PEDIRLE COSAS A LA IA (plantilla de prompt)

> "Trabajas sobre la web de Pipilacha (Astro estático + CSS vanilla + GSAP/ScrollTrigger +
> Lenis, todo auto-alojado). [Pega §2–§7 de esta ficha]. Quiero **[efecto/edición concreta]**
> en **[archivo/sección: p. ej. el hero de index.astro / las tarjetas de menu.astro]**.
> Respeta: tokens de color de §4 (acento verde, nada de rosa), patrón `.reveal` para entradas
> por scroll, nada de `data-parallax` en pétalos, sube el `?v=N` si tocas main.js, y mantén
> `prefers-reduced-motion`. Dame el diff exacto (qué líneas cambian y en qué archivo)."

**Ejemplos de petición bien acotada:**
- *"Añade a las tarjetas del menú (`.gcard` en menu.astro / main.css) un brillo que siga el
  cursor (pointer-tracking glow) usando una variable CSS `--mx/--my` seteada por JS en main.js;
  sutil, sin romper el glassmorphism ni la animación `cardBreathe`."*
- *"En el hero (index.astro) quiero que el título 'Todo empieza con una flor' entre con un
  reveal por máscara (clip-path) en vez del fade actual; mantén los `data-delay`."*
- *"Haz que el marquee bajo el hero reaccione a la velocidad de scroll de Lenis (más rápido al
  hacer scroll), leyendo `lenis.velocity`."*

## 11. INVENTARIO DE IMÁGENES (`public/assets/img/`)

> Rutas root-absolutas: `/assets/img/<archivo>`. Las fotos están optimizadas (≤1600px, JPEG 72).
> Nomenclatura fija — respetar al añadir nuevas.

**Marca / UI**
| Archivo | Qué es | Dónde |
|---|---|---|
| `logo-light.png` / `logo-dark.png` | Logo (libélula + wordmark "pipilacha"), versión clara/oscura | nav, footer |
| `iso-light.png` | **Isotipo** solo libélula | marca en tarjetas del menú (`.gcard__mark`) |

**Pétalos PNG transparentes** (flotan por animación CSS, NO parallax)
`petal-borraja.png` · `petal-oxalis.png` · `petal-fig.png` · `petal-peony.png` · `petal-roja.png` · `petal-sauco.png`
→ usados en: intro (home), hero/manifiesto, `.menu-blooms` y `.gcard__flower` (flor tras el cristal), reserva, regala. `petal-fig.png` es además el **favicon**.

**Fotos de sección**
| Archivo | Contenido | Usado en |
|---|---|---|
| `hero.jpg` | Cuenco de flores entre las manos (portada) | home (hero), og:image |
| `barra.jpg` | Barra de iroko montada | home, conócenos, prensa |
| `esparragos-tagete.jpg` | Espárragos a la brasa con tagete | home (showcase → menú) |
| `noe-barra.jpg` | Noé en la barra | conócenos, prensa |
| `chef-1..5.jpg` | Retratos de chefs (Arán/Noé) | conócenos, prensa (preview al cursor) |
| `dish-1.jpg` | Plato | solo `referencia.astro` |
| `dish-2.jpg`, `dish-3.jpg` | Platos | **sin usar** (disponibles) |

**Galería** `g1.jpg … g19.jpg` (carrusel + lightbox en `/galeria/`). Orden y `alt` definidos en
el array `fotos` de `galeria.astro`. `g16` = los dos chefs cocinando juntos.

**PDFs** (`public/assets/docs/`, descargables): `pipilacha-dossier-prensa.pdf` (kit de prensa) ·
`pipilacha-carta-vinos.pdf` (carta de vinos).

> ⚠️ La biblioteca de originales (fotos sin optimizar, brand guidelines, cartas) está en el
> **directorio padre** `../` (carpetas `01_brand`, `03_fotos`, `05_menu`, `10_regalo`, etc.),
> NO en el repo. Optimizar con `sips` antes de meter en `public/assets/img/`.

## 12. COMPONENTES CSS (clases por sección, en `main.css`)

Para apuntar un cambio, nombra la clase. Bloques principales (con su comentario de sección):

- **Botones**: `.btn` · `.btn--solid` (principal) · `.btn--ghost` (secundario, contorno) · `.btn--lg`. Variantes sobre fondo oscuro en `.hero` y `.cta-band`.
- **Reusables**: `.eyebrow` (antetítulo) · `.reveal` (entrada por scroll) · `.page-header` (cabecera de páginas internas) · `.cta-band` + `.cta-band__lead` (banda CTA final).
- **Home**: `.hero` (+ `.hero__media`, `.hero__title`, `.hero__actions`) · `.marquee` (banda en movimiento) · `.manifesto` (pinned, palabras en 3D) · `.showcase` (foto que se expande) · `.explore` (índice 01/02/03) · `.barra` (banda inmersiva) · `.reserva` + `.reserva__card`/`.reserva__details` (tarjeta de datos, también la usa `/regala/`).
- **Menú**: `.menu-intro` (el amanecer) · `.carousel.carousel--menu` · `.menu-blooms`/`.menu-bloom` (flores en blur al fondo) · `.gcard` (tarjeta de cristal: `.gcard__flower`, `.gcard__glass`, `.gcard__inner`, `.gcard__mark`, variante `.gcard--secret`) · `.maridaje` (`.maridaje__card`, `.maridaje__glass`).
- **Galería**: `.carousel` (genérico) · `.slide`/`.slide__btn`/`.slide__media` · `.lightbox` (`.lightbox__stage`, `.lightbox__nav`).
- **Vinos**: `.wine` · `.wine-group`/`.wine-group__head` · `.wine-row` (`__name`, `__grape`, `__price`) · `.wine-note`.
- **Regala**: `.regala-steps` · `.regala-step` (`__n`, h3, p).
- **Prensa**: `.press`/`.press-row`/`.press-row__link` · `.press-cursor` (preview que sigue al cursor) · `.prensa-kit` (`.prensa-kit__contact`, `.prensa-kit__download`).
- **Global**: `.nav` (`.nav--solid`, `.nav__links`, `.nav__cta`, `.nav__burger`) · `.reserva-fab` (botón flotante de reserva) · `.footer` (`.footer__nav`, `.footer__cols`, `.footer__base`) · `.page-transition` (cortina entre páginas).

## 13. MÓDULOS / EFECTOS EN `public/js/main.js`

Efectos ya implementados (referénciarlos por nombre para extender o reusar):

| Efecto | Detalle |
|---|---|
| `playHero()` | Anima el hero con `data-delay` (por tiempo). |
| Nav scroll | Fondo sólido al bajar + burger móvil. |
| Lenis | Smooth scroll, instancia `window.lenis`. |
| Cortina de página | `#pageTransition`: columnas moss barren al navegar (intercepta enlaces internos). |
| `.reveal` genérico | ScrollTrigger que sube `opacity/translateY` de todo `.reveal`. |
| Manifiesto pinned | Cada palabra se levanta en 3D (rotateX, sin blur). |
| Showcase | `.showcase__frame` pasa de tarjeta a pantalla completa con `clip-path` scrubbeado. |
| Parallax | `[data-parallax]` → `yPercent` centrado por scroll (NO en pétalos). |
| Botones magnéticos | El `.btn` se inclina hacia el cursor y vuelve elástico. |
| Carrusel | `.carousel`: drag + inercia + snap + barra/contador/flechas (galería y menú). |
| Lightbox | Galería ampliada con `.slide__btn` (recorte 2.5% para tapar bordes de color). |
| Prensa | Filas con reveal de `clip-path` + preview que sigue al cursor. |
| `journey` | Módulo de scroll horizontal pinned — **inactivo** (el menú ya no lo usa). |

> Buenas señales para pedir cosas nuevas: hay `--ease` global, el loop Lenis↔GSAP ya montado,
> y `prefers-reduced-motion` cortocircuita todo al principio de `main.js`.
