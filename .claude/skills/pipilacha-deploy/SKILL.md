---
name: pipilacha-deploy
description: >-
  Publica el sitio Pipilacha en la web beta de Arsys: hace `npm run build` y sube el
  contenido de dist/ por rsync/sSH, arregla permisos EN EL SERVIDOR y verifica que el CSS
  responde 200 (no 403). Úsalo cuando el usuario diga "sube la web", "despliega", "haz
  deploy", "publica los cambios", "actualiza la beta", "sube dist" o similar. Encapsula los
  pasos frágiles (permisos del disco externo, flags de rsync de macOS, sin --delete) para
  no romper el sitio ni filtrar la contraseña. NO es para producción (pipilacha.es es
  Squarespace, cosa aparte).
---

# Pipilacha · deploy a la beta (Arsys)

## Qué hace y por qué es delicado

El sitio es estático (Astro → `dist/`) y se sube a un hosting WordPress de Arsys, sirviéndose
por una URL provisional live-website.com. Tres trampas que este skill ya resuelve:

1. **Permisos.** El disco externo (`/Volumes/Pipilacha`) fuerza `700` e ignora `chmod` local,
   así que hay que arreglar permisos **en el servidor** tras subir, o el CSS da **403 → web sin
   estilos**.
2. **rsync de macOS (2.6.9).** Rechaza `--chmod=D755,F644`. Por eso el chmod va aparte, en el
   servidor (paso 2), no en el rsync.
3. **Sin `--delete`.** En el destino viven `.htaccess` (caché/deflate/webp) y `referencia/` que
   hay que conservar. Efecto colateral inofensivo: se acumulan CSS hasheados viejos en `_assets/`.

## Credencial (NO está en este repo)

La contraseña de Arsys vive **solo** en la memoria `arsys-deploy-access` (fuera del repo). No
la escribas en ningún archivo ni en un commit. Léela de esa memoria y pásala en línea como
variable de entorno al invocar el script:

```bash
ARSYS_PASS='<contraseña-de-la-memoria>' bash .claude/skills/pipilacha-deploy/scripts/deploy.sh
```

El script trae host/usuario/rutas por defecto (no secretos); se pueden sobreescribir con
`ARSYS_HOST`, `ARSYS_USER`, `ARSYS_PORT`, `ARSYS_REMOTE`, `ARSYS_BETA_URL` si cambian.

## Qué hace el script, en orden

1. `nvm use 20` + `npm run build` (el sistema trae Node 16; el build necesita 20).
2. `rsync -rtz --perms` de `dist/` → `/home/www/public/` excluyendo AppleDouble (`._*`, `.DS_Store`), **sin `--delete`**.
3. `chmod` en el servidor: directorios 755, ficheros 644.
4. Verifica con `curl` que un CSS hasheado de `_assets/` responde **200**; si da 403, aborta con error (permisos).

Al terminar imprime la URL de la beta para abrirla en el navegador.

## Después / avisos

- **No commitees credenciales.** `.claude/settings.local.json` está trackeado y acumula
  comandos `sshpass` con la contraseña en claro; usa `git add` selectivo, nunca `git add -A`.
  Conviene sacarlo del control de versiones (`git rm --cached` + `.gitignore`) — pendiente.
- **Producción es aparte:** `pipilacha.es` es Squarespace; esto solo toca la beta de Arsys. No
  cancelar Squarespace ni tocar MX (ver plan de lanzamiento).
- El commit de git es **opcional** para desplegar; sube `dist/` aunque no commitees.
