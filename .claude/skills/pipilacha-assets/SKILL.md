---
name: pipilacha-assets
description: >-
  Optimiza e incorpora imágenes al sitio Pipilacha (public/assets/img/): redimensiona,
  comprime y genera el hermano .webp que sirve .htaccess por negociación de contenido.
  Úsalo SIEMPRE que se añada, reemplace o prepare una foto de plato, un retrato de chef,
  una flor PNG o cualquier imagen para la web — aunque el usuario solo diga "mete esta
  foto", "optimiza esta imagen", "prepárala para la web", "conviértela a webp" o arrastre
  un archivo desde la librería ../ ("Pipilacha Archivos"). Evita que se cuele una imagen
  pesada o sin su .webp, que son los dos errores recurrentes.
---

# Pipilacha · optimización de imágenes

## Por qué existe

Las fotos originales de la librería (`../`) pesan 25–600 MB (JPG/TIF). Meterlas tal cual
mata el rendimiento. El sitio sirve **el mismo URL** para JPG/PNG y su hermano `.webp`
(lo negocia `.htaccess`), así que **cada imagen necesita su `.webp`**. Este pipeline hace
las dos cosas en un paso y descarta el `.webp` cuando no compensa, para no acumular peso
muerto. Son exactamente los dos fallos que se repiten a mano: subir la imagen sin comprimir,
o sin su webp.

## Cómo usarlo

Corre el script **desde la raíz del proyecto** (una imagen por invocación):

```bash
python3 .claude/skills/pipilacha-assets/scripts/optimize_image.py <origen> <nombre-destino> [--max 1600]
```

- `<origen>`: ruta al original, normalmente en la librería `../` (p. ej. `"../Fotografias /plato/foto.jpg"`).
- `<nombre-destino>`: nombre final en `public/assets/img/` **respetando la convención** (ver abajo).
- `--max`: lado largo en px (por defecto **1600**; usa `--max 0` para no redimensionar, p. ej. flores PNG ya dimensionadas).

El script: redimensiona con `sips`, recomprime JPEG a q72, genera el `.webp` con la calidad
correcta según el tipo, reporta el ahorro y **borra el `.webp` si ahorra <15%** (usa
`--keep-webp` para forzar que se quede).

**Ejemplos**

```bash
# Foto de plato (hero): redimensiona a 1600 + webp q78
python3 .claude/skills/pipilacha-assets/scripts/optimize_image.py "../Fotografias /Menu/plato3.jpg" dish-3.jpg

# Flor transparente ya dimensionada: sin redimensionar + webp q82, conserva alfa
python3 .claude/skills/pipilacha-assets/scripts/optimize_image.py "../Flores png/rosa.png" petal-rosa.png --max 0

# Fondo desenfocado: webp q75 (detectado por el sufijo -blur)
python3 .claude/skills/pipilacha-assets/scripts/optimize_image.py fondo.png hero-blur.png
```

## Convención de nombres (`public/assets/img/`)

Respétala siempre — el resto del código referencia estos nombres con rutas raíz-absolutas
(`/assets/img/...`):

- `hero.jpg` — imagen principal del home.
- `dish-1.jpg … dish-3.jpg` — pases del menú.
- `chef-1.jpg`, `chef-2.jpg` — retratos (Arán / Noé).
- `g1.jpg … g9.jpg` — galería.
- `petal-*.png` — flores transparentes (pétalos flotantes).
- `*-blur.png` — versiones desenfocadas (fondos/máscaras).

## Calidades WEBP (las aplica el script solo, no las cambies sin motivo)

- Fotos `.jpg` → **q78**
- Flores `.png` → **q82**
- PNG `-blur` → **q75**

Vienen calibradas para el punto donde el webp deja de ahorrar sin degradar visiblemente.
Si necesitas inspeccionar un PDF de la marca para sacar una imagen, usa `pymupdf`
(`import fitz`) — `poppler`/`pdftoppm` no están instalados.

## Después de optimizar

`npm run build` para que el preview (`dist/`) sirva la imagen nueva. Para publicarla en la
beta, encadena con el skill **pipilacha-deploy**.
