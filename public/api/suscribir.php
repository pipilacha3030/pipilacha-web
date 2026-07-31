<?php
/* ============================================================
   Alta en la lista de correo (Brevo).

   Por qué existe este archivo: la clave de API de Brevo no puede ir
   en el JavaScript de la web —sería pública y cualquiera podría
   escribir en la cuenta—. Así que el navegador habla con este PHP,
   que vive en el hosting, y es el PHP quien habla con Brevo.

   Flujo: formulario → este archivo → Brevo envía el correo de
   confirmación → el visitante pulsa el enlace → entra en la lista.

   Devuelve JSON ({ok:true} | {ok:false,error:"..."}) si lo piden por
   fetch, y una página mínima si el formulario se envió sin JS.
   ============================================================ */

declare(strict_types=1);

const MAX_POR_IP_HORA = 5;      // altas permitidas por IP y hora
const TIMEOUT_BREVO   = 8;      // segundos

/* ---------- utilidades ---------- */

function quiere_json(): bool {
  $a = $_SERVER['HTTP_ACCEPT'] ?? '';
  return str_contains($a, 'application/json')
      || strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';
}

/** Responde y termina. Nunca filtra detalles internos al visitante. */
function responder(bool $ok, string $mensaje, int $codigo = 200): never {
  http_response_code($codigo);
  if (quiere_json()) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => $ok, 'error' => $ok ? null : $mensaje], JSON_UNESCAPED_UNICODE);
  } else {
    header('Content-Type: text/html; charset=utf-8');
    $texto = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');
    echo "<!doctype html><meta charset=utf-8><title>Pipilacha</title>"
       . "<body style=\"font:16px/1.6 system-ui;max-width:34rem;margin:12vh auto;padding:0 1.5rem;color:#2A2A22;background:#F4EFE6\">"
       . "<p>$texto</p><p><a href=\"/\" style=\"color:#645D3B\">Volver a Pipilacha</a></p>";
  }
  exit;
}

/** Límite por IP: fichero de contadores en el directorio temporal. */
function pasa_limite(string $ip): bool {
  $ruta = sys_get_temp_dir() . '/pipilacha_alta_' . hash('sha256', $ip) . '.txt';
  $ahora = time();
  $marcas = is_readable($ruta)
    ? array_filter(array_map('intval', explode(',', (string) file_get_contents($ruta))))
    : [];
  $marcas = array_values(array_filter($marcas, fn($t) => $ahora - $t < 3600));
  if (count($marcas) >= MAX_POR_IP_HORA) return false;
  $marcas[] = $ahora;
  @file_put_contents($ruta, implode(',', $marcas), LOCK_EX);
  return true;
}

/* ---------- comprobaciones de entrada ---------- */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  responder(false, 'Método no permitido.', 405);
}

/* Se valida ANTES de leer la configuración: así un robot o un correo mal
   escrito se descartan sin tocar disco ni la clave de API. */

// Campo trampa: los robots rellenan todo, las personas no lo ven.
if (trim((string) ($_POST['web'] ?? '')) !== '') {
  responder(true, 'Gracias.');   // silencio: al robot se le dice que sí
}

$email = trim((string) ($_POST['email'] ?? ''));
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200) {
  responder(false, 'Ese correo no parece válido.', 422);
}

// Consentimiento explícito: sin esto no hay alta (RGPD).
if (($_POST['consentimiento'] ?? '') !== '1') {
  responder(false, 'Falta marcar la casilla de consentimiento.', 422);
}

/* Idioma de la página desde la que se apuntó: decide la lista. Cualquier
   valor que no sea 'en' cae a español, así un parámetro manipulado no
   puede colar a nadie en una lista que no existe. */
$lang = ($_POST['lang'] ?? '') === 'en' ? 'en' : 'es';

$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
if (!pasa_limite($ip)) {
  responder(false, 'Demasiados intentos. Prueba dentro de un rato.', 429);
}

$config_path = __DIR__ . '/brevo-config.php';
if (!is_readable($config_path)) {
  // Sin configurar: no se puede dar de alta a nadie. Mensaje neutro para
  // el visitante; el detalle real solo queda en el log del servidor.
  error_log('[pipilacha] falta public/api/brevo-config.php');
  responder(false, 'Ahora mismo no podemos apuntarte. Escríbenos a info@pipilacha.es.', 503);
}
$cfg = require $config_path;

/* ---------- alta en Brevo ---------- */

$doi       = (bool) ($cfg['DOBLE_OPT_IN'] ?? true);
$lista     = (int) ($lang === 'en' ? $cfg['LIST_ID_EN']      : $cfg['LIST_ID_ES']);
$plantilla = (int) ($lang === 'en' ? $cfg['DOI_TEMPLATE_EN'] : $cfg['DOI_TEMPLATE_ES']);

if ($doi) {
  $url = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
  $cuerpo = [
    'email'          => $email,
    'includeListIds' => [$lista],
    'templateId'     => $plantilla,
    'redirectionUrl' => (string) $cfg['REDIRECT_URL'],
  ];
} else {
  $url = 'https://api.brevo.com/v3/contacts';
  $cuerpo = [
    'email'         => $email,
    'listIds'       => [$lista],
    'updateEnabled' => true,
  ];
}

$ch = curl_init($url);
curl_setopt_array($ch, [
  CURLOPT_POST           => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT        => TIMEOUT_BREVO,
  CURLOPT_HTTPHEADER     => [
    'accept: application/json',
    'content-type: application/json',
    'api-key: ' . $cfg['API_KEY'],
  ],
  CURLOPT_POSTFIELDS     => json_encode($cuerpo, JSON_UNESCAPED_UNICODE),
]);
$respuesta = curl_exec($ch);
$estado    = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$fallo_red = curl_error($ch);
curl_close($ch);

if ($fallo_red !== '') {
  error_log('[pipilacha] brevo sin respuesta: ' . $fallo_red);
  responder(false, 'No hemos podido apuntarte. Inténtalo dentro de un momento.', 502);
}

// 2xx = alta aceptada. 201 en /contacts, 204 en el doble opt-in.
if ($estado >= 200 && $estado < 300) {
  responder(true, $doi
    ? 'Te hemos escrito para confirmar. Abre el correo y pulsa el enlace.'
    : 'Listo, ya estás apuntado.');
}

// Ya existía: para el visitante es un éxito, no un error.
if ($estado === 400 && str_contains((string) $respuesta, 'duplicate_parameter')) {
  responder(true, 'Ese correo ya estaba apuntado.');
}

// El detalle de Brevo va al log, nunca a la pantalla (puede traer datos de la cuenta).
error_log('[pipilacha] brevo ' . $estado . ': ' . substr((string) $respuesta, 0, 500));
responder(false, 'No hemos podido apuntarte. Escríbenos a info@pipilacha.es.', 502);
