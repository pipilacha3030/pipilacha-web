#!/usr/bin/env python3
"""Optimiza una imagen para public/assets/img/ del sitio Pipilacha.

Pipeline (igual que CLAUDE.md, en un solo paso):
  1. sips -Z <max>   -> redimensiona el lado largo (omitido si --max 0)
  2. sips jpeg q72    -> recomprime (solo salidas .jpg/.jpeg)
  3. Pillow WEBP      -> genera el hermano .webp que sirve .htaccess
  4. Si el .webp ahorra <15% frente al original, se borra (peso muerto).

Correr DESDE LA RAIZ del proyecto. Una imagen por invocación.
"""
import argparse
import os
import shutil
import subprocess
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow. Instala con: python3 -m pip install Pillow")

DEST_DIR = "public/assets/img"


def webp_quality(out_name):
    """Calidad calibrada por tipo (ver SKILL.md)."""
    name = out_name.lower()
    if name.endswith((".jpg", ".jpeg")):
        return 78
    if "-blur" in name:
        return 75
    return 82  # flores png


def main():
    ap = argparse.ArgumentParser(description="Optimiza una imagen para Pipilacha (jpg/png + webp).")
    ap.add_argument("src", help="ruta al original (normalmente en ../)")
    ap.add_argument("out_name", help="nombre destino, p.ej. hero.jpg o petal-rosa.png")
    ap.add_argument("--max", type=int, default=1600, help="lado largo px (0 = no redimensionar)")
    ap.add_argument("--dest", default=DEST_DIR, help="carpeta destino")
    ap.add_argument("--keep-webp", action="store_true", help="conserva el webp aunque ahorre <15%%")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        sys.exit(f"No existe el origen: {args.src}")
    os.makedirs(args.dest, exist_ok=True)

    dest = os.path.join(args.dest, args.out_name)
    is_jpg = args.out_name.lower().endswith((".jpg", ".jpeg"))

    # 1) redimensionar (o copiar tal cual)
    if args.max > 0:
        subprocess.run(["sips", "-Z", str(args.max), args.src, "--out", dest], check=True,
                       stdout=subprocess.DEVNULL)
    else:
        shutil.copyfile(args.src, dest)

    # 2) recomprimir jpeg
    if is_jpg:
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "72", dest, "--out", dest],
                       check=True, stdout=subprocess.DEVNULL)

    base_size = os.path.getsize(dest)

    # 3) hermano webp
    webp = os.path.splitext(dest)[0] + ".webp"
    q = webp_quality(args.out_name)
    with Image.open(dest) as im:
        im.save(webp, "WEBP", quality=q, method=4)
    webp_size = os.path.getsize(webp)

    saving = 100 * (base_size - webp_size) / base_size if base_size else 0
    print(f"{args.out_name}: {base_size // 1024} KB  ->  webp {webp_size // 1024} KB "
          f"(ahorro {saving:.0f}%, q{q})")

    # 4) descartar webp si no compensa
    if saving < 15 and not args.keep_webp:
        os.remove(webp)
        ext = os.path.splitext(args.out_name)[1]
        print(f"  webp descartado (ahorro <15%); se sirve el {ext}")


if __name__ == "__main__":
    main()
