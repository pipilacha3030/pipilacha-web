#!/usr/bin/env bash
# Deploy del sitio Pipilacha (dist/) a la web beta de Arsys.
#
# La CONTRASENA no vive aqui: se pasa por ARSYS_PASS al invocar, leyendola de la
# memoria 'arsys-deploy-access' (fuera del repo). Asi el secreto no acaba en git.
#
#   ARSYS_PASS='...' bash .claude/skills/pipilacha-deploy/scripts/deploy.sh
#
set -euo pipefail

: "${ARSYS_PASS:?Falta ARSYS_PASS (leela de la memoria arsys-deploy-access)}"
HOST="${ARSYS_HOST:-a08.stretch.live}"
USER="${ARSYS_USER:-su1144558}"
PORT="${ARSYS_PORT:-22}"
REMOTE="${ARSYS_REMOTE:-/home/www/public/}"
BETA_URL="${ARSYS_BETA_URL:-https://myblog-s5dx15q6kq.live-website.com}"

command -v sshpass >/dev/null || { echo "Falta sshpass (brew install hudochenkov/sshpass/sshpass)"; exit 1; }

echo "==> Build (Node 20)"
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20 >/dev/null
npm run build

echo "==> Subida (rsync, sin --delete: conserva .htaccess y referencia/)"
sshpass -p "$ARSYS_PASS" rsync -rtz --perms \
  --exclude='._*' --exclude='.DS_Store' \
  -e "ssh -oStrictHostKeyChecking=accept-new -p $PORT" \
  dist/ "$USER@$HOST:$REMOTE"

echo "==> Permisos en el servidor (el disco externo fuerza 700)"
sshpass -p "$ARSYS_PASS" ssh -oStrictHostKeyChecking=accept-new -p "$PORT" "$USER@$HOST" \
  "find ${REMOTE%/} -type d -exec chmod 755 {} + ; find ${REMOTE%/} -type f -exec chmod 644 {} +"

echo "==> Verificacion (un CSS hasheado debe dar 200, no 403)"
CSS="$(find dist/_assets -name '*.css' -print -quit 2>/dev/null | xargs -r basename)"
if [ -n "${CSS:-}" ]; then
  CODE="$(curl -sL -o /dev/null -w '%{http_code}' "$BETA_URL/_assets/$CSS")"
  echo "    $BETA_URL/_assets/$CSS -> HTTP $CODE"
  if [ "$CODE" = "200" ]; then
    echo "OK: la beta sirve el CSS."
  else
    echo "FALLO: HTTP $CODE (probable 403 por permisos). Revisar paso de chmod." >&2
    exit 1
  fi
else
  echo "    (no se encontro CSS en dist/_assets para verificar)"
fi

echo "Listo. Beta: $BETA_URL"
