# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bespoke marketing website for **Pipilacha**, a flower-based tasting-menu restaurant in Madrid ("el único restaurante construido íntegramente sobre las flores"). It is a single long-scroll landing page with smooth scrolling and scroll-triggered animations, built with **Astro** (static output).

## Running it

Requires **Node 18+**. The system Node is v16, so use the nvm-managed Node 20:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20
npm install      # first time
npm run dev      # dev server (astro dev)
npm run build    # → static output in dist/
```

**Deploy** = run `npm run build`, then upload the contents of **`dist/`** to any static host (the client's existing WordPress hosting works — drop the folder in). Lenis/GSAP load from CDN; the host only serves files.

The Claude Code preview config (`.claude/launch.json`, server `pipilacha-web`) serves the built `dist/` via a tiny built-in-only Node static server (`.claude/preview-server.cjs`) on port 4321 — so **run `npm run build` before previewing** to see changes. (It uses only Node's `http`/`fs`, so it runs fine even under system Node 16. The previous `python3 -m http.server` config stopped working when the sandbox blocked Python's `os.getcwd()`/module imports.)

> `site/` is the original pre-Astro hand-written static version, kept as a reference/backup. The Astro project under `src/` is the source of truth now — edit there, not in `site/`.

## Architecture

- **Multi-page now** (was a single long-scroll page). **`src/layouts/Base.astro`** is the shared shell for every page: `<head>`/fonts, the disruptive intro *portada* (rendered only when `intro={true}` — just the home page), nav, `<slot/>`, footer, and the four `<script>` tags (Lenis, GSAP, ScrollTrigger CDN, then `/js/main.js?v=N`). Those are **`is:inline`** so Astro keeps load order and globals intact — don't remove `is:inline` or the globals break. `/js/main.js` carries a **`?v=N` cache-buster — bump N on every edit** to that file (public/ assets aren't hashed by Astro). The dragonfly mark is `public/assets/img/iso-light.png` (an `<img>`, not an inline SVG).
- **`src/pages/*.astro`** — one short page per section, each wrapping `Base`: `index.astro` (hero → manifesto → photo showcase → explore links → CTA band, plus the intro), `conocenos.astro` (chefs/concepto), `menu.astro` (15 pases as a names-only list + maridaje block), `galeria.astro` (uniform 3-col grid + lightbox), `reservas.astro` (service card + TheFork). Internal links use **trailing slashes** (`/menu/`) to match Astro's directory output and avoid host redirects.
- **`src/styles/main.css`** — brand design tokens live in `:root` (see below). Mobile breakpoints at 900px and 560px. `prefers-reduced-motion` disables all animation.
- **`public/`** — served as-is at the site root: `public/assets/img/*` (the optimized photos) and `public/js/main.js` (interaction layer). Reference these with root-absolute paths (`/assets/img/...`, `/js/main.js`).
- **`dist/`** — build output (generated, deployable). Not edited by hand.

### Animation system (the part that needs reading multiple files)
- **Lenis** drives smooth scrolling; the instance is exposed as `window.lenis` (kept for debugging — handy with the preview tools).
- **GSAP + ScrollTrigger** drive everything else. Lenis and GSAP are wired together: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t => lenis.raf(t*1000))`. If you add scroll animations, rely on this loop rather than native scroll events.
- **Reveal pattern**: any element with class `.reveal` starts at `opacity:0; translateY(32px)` (in CSS) and is animated in by a generic ScrollTrigger in `main.js`. Add `.reveal` to opt in. Hero elements use `data-delay` (time-based, not scroll-based) and are handled separately.
- **Parallax**: elements with `data-parallax="0.NN"` get scroll-scrubbed `yPercent` movement. **Do not put `data-parallax` on the floating petals** — GSAP's transform fights the CSS `float`/`float2` keyframe animations. Petals (`.petal--1/2/3`, transparent flower PNGs) move via CSS animation only; big media (hero, course images, chef figures) use `data-parallax`.

### Design tokens (CSS `:root`)
Olive `#645D3B`, Terracotta `#9F5434` (accent), Moss `#31331F` (dark sections), Cream `#F4EFE6` (page bg), Cloud `#FBFAF5`. Fonts: **Marcellus** (serif, display) + **Hanken Grotesk** (sans, body) via Google Fonts. Hanken is a stand-in for the brand's licensed **Roobert** — swap if the license is available. These come from the official brand guidelines; keep new UI on these tokens.

## Assets & image workflow

Source photography and brand material live in the **parent directory** `../` (the "Pipilacha Archivos" library), not in this repo. Key folders: `Forografias /` (plated dishes, organized per dish), `Flores png/flores web png/` (transparent flower PNGs used for petals), `Arán y Noé/` + `Forografias /Arán/` (chef portraits), `Brand guidelines/`.

Originals are 25–600 MB (JPG/TIF). **Optimize before adding to `public/assets/img/`** using macOS `sips` (Pillow/poppler are not reliably installed here):

```bash
sips -Z 1600 "../Forografias /<dish>/<file>.jpg" --out public/assets/img/<name>.jpg
sips -s format jpeg -s formatOptions 72 public/assets/img/<name>.jpg --out public/assets/img/<name>.jpg
```

Naming convention in `public/assets/img/`: `hero.jpg`, `dish-1..3.jpg` (menu courses), `chef-1..2.jpg`, `g1..g9.jpg` (gallery), `petal-*.png` (transparent).

To **inspect PDFs** (the original design `web 3 pipilacha.pdf`, brand guidelines, menus) use `pymupdf` (`import fitz`) in Python — render a slice to PNG and read it. `poppler`/`pdftoppm` are NOT installed and brew fails to install them. `extracted_imgs/` holds low-res images pulled from the design PDF — these were the first-pass placeholders and are no longer used.

## Content / brand voice

All copy is Spanish and must follow Pipilacha's brand voice (poetic but clear; human, young, cultured; never pretentious or twee). A dedicated skill — **`pipilacha-brand-voice`** — exists and should be applied to any copy work. Restaurant facts to keep consistent: 16 seats per service, Thu–Sun, tasting menu 85 €, pairing +60 €, C. del Azulejo 28028 Madrid, IG @restaurante.pipilacha, reservations via **TheFork** (the link in the `.reserva` CTA is still a placeholder).
