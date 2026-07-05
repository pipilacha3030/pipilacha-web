# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bespoke marketing website for **Pipilacha**, a flower-based tasting-menu restaurant in Madrid ("el único restaurante construido íntegramente sobre las flores"). Multi-page site with smooth scrolling, scroll-triggered animations and an async page-transition router, built with **Astro 5** (static output). La arquitectura V2 (jul 2026) está documentada en `AUDITORIA_V2.md`.

## Running it

Requires **Node 18+**. The system Node is v16, so use the nvm-managed Node 20:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20
npm install      # first time
npm run dev      # dev server (astro dev)
npm run build    # → static output in dist/
```

**Deploy** = run `npm run build`, then upload the contents of **`dist/`** to any static host (the client's existing WordPress hosting works — drop the folder in). Todo es same-origin: JS bundleado, fuentes y fotos locales; `.htaccess` (Apache) añade caché y la negociación WebP.

The Claude Code preview config (`.claude/launch.json`, server `pipilacha-web`) serves the built `dist/` via a tiny built-in-only Node static server (`.claude/preview-server.cjs`) on port 4321 — so **run `npm run build` before previewing** to see changes. (It uses only Node's `http`/`fs`, so it runs fine even under system Node 16. The previous `python3 -m http.server` config stopped working when the sandbox blocked Python's `os.getcwd()`/module imports.)

> `site/` is the original pre-Astro hand-written static version, kept as a reference/backup. The Astro project under `src/` is the source of truth now — edit there, not in `site/`.

## Architecture

- **`src/layouts/Base.astro`** is the shared shell for every page: `<head>` (SEO + **grafo schema.org** con `@id` estables: `#restaurant`, `#aran`, `#noe`, `#website` + BreadcrumbList), `Nav.astro`, `<slot/>`, `Footer.astro`, and one processed `<script>` importing **`src/scripts/main.js`**. Vite bundles, minifies and **hashes** it — **ya no existe el `?v=N` manual**: editar `src/scripts/*` + `npm run build` invalida caché solo. GSAP/ScrollTrigger/Lenis se importan **desde npm** (no hay vendor ni CDN); `window.gsap`/`window.lenis` siguen expuestos para depuración. The dragonfly mark is `public/assets/img/iso-light.png` (an `<img>`, not an inline SVG). An inline `<script>` at the top of `<head>` adds a **`js` class to `<html>`** used to gate hide-states (see Reveal pattern) — the old disruptive intro *portada* was **removed**; don't reintroduce it.
- **`src/scripts/`** — capa de interacción modular (un módulo, una responsabilidad): `main.js` (arranque + `initPage`/`destroyPage`), `transitions.js` (router asíncrono), `nav.js`, `gallery.js` (**import dinámico** — su chunk solo se descarga en `/galeria/`), `cellar.js`, `scroll/` (**importar gsap SIEMPRE desde `scroll/scrollTrigger.js`** — garantiza plugin registrado y driver único de Lenis vía `gsap.ticker`), `animations/` (hero, reveal, media, menu, parallax, showcase), `interactions/magnetic.js`, `utils/lifecycle.js`. **Regla de oro:** todo tween/ScrollTrigger de página se crea dentro de `inPageContext()` (gsap.context) y los listeners de documento/ventana con `{ signal: pageSignal() }`; `destroyPage()` lo revierte todo en cada transición — no hay kills manuales.
- **`src/data/*.js`** — contenido editable (pases del menú, bodega, fotos de galería, menciones de prensa). Cambiar un vino = editar `src/data/vinos.js`, no la página.
- **`src/pages/*.astro`** — one short page per section, each wrapping `Base`: `index.astro` (hero → quiénes → *gallery flow* pinned que termina expandiendo el «Despertar de las flores» → marquee → explore links → barra → reserva), `conocenos.astro` (chefs/concepto), `menu.astro` (15 pases as a names-only list + maridaje block), `vinos.astro` (la bodega, concepto «cada vino, su flor»: hero sereno + índice floral scrollspy + familias, cada una anclada en su flor), `galeria.astro` (cardumen horizontal con GSAP + lightbox), `prensa.astro` (menciones editoriales + kit de prensa), `regala.astro` (tarjeta regalo + pasos), `reservas.astro` (page-header + iframe de TheFork con esqueleto de carga y fallback), `404.astro` (página de marca). Internal links use **trailing slashes** (`/menu/`) to match Astro's directory output and avoid host redirects.
- **`src/styles/main.css`** — brand design tokens live in `:root` (see below), plus the `@font-face` of the **self-hosted fonts** (`public/assets/fonts/*.woff2`: Marcellus + Hanken Grotesk **variable 300–600** — Google Fonts fue eliminado, no reintroducir el `<link>`). Mobile breakpoints at 900px and 560px. `prefers-reduced-motion` disables all animation.
- **`public/`** — served as-is at the site root: `public/assets/img/*` (fotos + **hermanos `.webp`**, servidos por negociación de contenido en `.htaccess`: mismo URL, cubre `<img>`, `srcset` y fondos CSS), `public/assets/fonts/`, `robots.txt`, `sitemap.xml`. Reference these with root-absolute paths (`/assets/img/...`).
- **`dist/`** — build output (generated, deployable). Not edited by hand.

### Animation system (the part that needs reading multiple files)
- **Lenis** drives smooth scrolling; the instance is exposed as `window.lenis` (kept for debugging — handy with the preview tools).
- **GSAP + ScrollTrigger** drive everything else. Lenis and GSAP are wired together in `src/scripts/scroll/scrollTrigger.js`: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))` — el ticker de GSAP es el **único** driver de Lenis (no añadir un bucle rAF propio: duplicaría el trabajo por frame). If you add scroll animations, rely on this loop rather than native scroll events.
- **Reveal pattern**: any element with class `.reveal` starts at `opacity:0; translateY(32px)`, but that hide-state is **gated on the `.js` class** (`.js .reveal{…}`) so content stays visible without JS or if GSAP fails to load (main.js also strips `.js` when `!window.gsap`). A generic ScrollTrigger in `main.js` animates each `.reveal` in. Put `[data-reveal-stagger]` on a container to reveal its `.reveal` children in cascade instead of one-by-one. Add `.reveal` to opt in. Hero elements use `data-delay` (time-based, not scroll-based) and are handled separately.
- **Parallax**: elements with `data-parallax="0.NN"` get scroll-scrubbed `yPercent` movement. **Do not put `data-parallax` on the floating petals** — GSAP's transform fights the CSS `float`/`float2` keyframe animations. Petals (`.petal--1/2/3`, transparent flower PNGs) move via CSS animation only; big media (hero, course images, chef figures) use `data-parallax`.

### Design tokens (CSS `:root`)
`--moss #31331F` (dark sections/buttons) · `--olive #645D3B` (hover, footer bg) · `--accent #645D3B` (eyebrow text, active links — alias semántico de olive) · `--accent-soft #B0A77F` (acentos sobre fondo oscuro) · `--cream #F4EFE6` (fondo) · `--cloud #FBFAF5` (tarjetas) · `--ink #2A2A22` (texto principal). Escala de texto secundario: `--text-muted #55554a` (párrafos secundarios) · `--text-subtle #6a6a5b` (etiquetas, metadata; AA ~4.8:1 sobre crema). Separadores: `--border-subtle rgba(49,51,31,.16)`. Fonts: **Marcellus** (serif, display) + **Hanken Grotesk** (sans, body), **auto-alojadas** en `public/assets/fonts/` (woff2, latin + latin-ext; Hanken es variable 300–600). Hanken is a stand-in for the brand's licensed **Roobert** — swap if the license is available. These come from the official brand guidelines; keep new UI on these tokens.

## Assets & image workflow

Source photography and brand material live in the **parent directory** `../` (the "Pipilacha Archivos" library), not in this repo. Key folders: `Forografias /` (plated dishes, organized per dish), `Flores png/flores web png/` (transparent flower PNGs used for petals), `Arán y Noé/` + `Forografias /Arán/` (chef portraits), `Brand guidelines/`.

Originals are 25–600 MB (JPG/TIF). **Optimize before adding to `public/assets/img/`** using macOS `sips`, y **generar el hermano `.webp`** (lo sirve `.htaccess` por negociación con el mismo URL; Pillow SÍ está instalado):

```bash
sips -Z 1600 "../Forografias /<dish>/<file>.jpg" --out public/assets/img/<name>.jpg
sips -s format jpeg -s formatOptions 72 public/assets/img/<name>.jpg --out public/assets/img/<name>.jpg
# hermano webp (q78 fotos jpg · q82 flores png · q75 png "-blur"); si no ahorra ≥15%, bórralo:
python3 -c "from PIL import Image; Image.open('public/assets/img/<name>.jpg').save('public/assets/img/<name>.webp','WEBP',quality=78,method=4)"
```

Naming convention in `public/assets/img/`: `hero.jpg`, `dish-1..3.jpg` (menu courses), `chef-1..2.jpg`, `g1..g9.jpg` (gallery), `petal-*.png` (transparent).

To **inspect PDFs** (the original design `web 3 pipilacha.pdf`, brand guidelines, menus) use `pymupdf` (`import fitz`) in Python — render a slice to PNG and read it. `poppler`/`pdftoppm` are NOT installed and brew fails to install them. `extracted_imgs/` holds low-res images pulled from the design PDF — these were the first-pass placeholders and are no longer used.

## Content / brand voice

All copy is Spanish and must follow Pipilacha's brand voice (poetic but clear; human, young, cultured; never pretentious or twee). A dedicated skill — **`pipilacha-brand-voice`** — exists and should be applied to any copy work. Restaurant facts to keep consistent: 16 seats per service, Thu–Sun, tasting menu 85 €, pairing +60 €, C. del Azulejo 28028 Madrid, IG @restaurante.pipilacha, reservations via **TheFork** (real widget embedded on `/reservas/`; the home `.reserva` CTA links there).
