<?php
/* ============================================================
   PLANTILLA de configuración de Brevo.

   Copia este archivo como `brevo-config.php` (en esta misma carpeta)
   y rellena los valores. `brevo-config.php` está en .gitignore: la
   clave NUNCA entra en el repositorio, pero sí viaja en dist/ al
   desplegar, porque Astro copia public/ tal cual.

   Dónde salen los valores, en el panel de Brevo:
   - API_KEY .......... Ajustes → SMTP y API → Claves de API → Generar.
                        Empieza por "xkeysib-". Es SECRETA: quien la
                        tenga puede escribir en tu cuenta.
   - LIST_ID_ES / _EN . Contactos → Listas. El número de cada lista.
                        Quien se apunta desde una página en español entra
                        en la ES; desde /en/, en la EN.
   - DOI_TEMPLATE_* ... Campañas → Plantillas. Es el correo que pide
                        confirmar. Una por idioma, para que quien se
                        apunte en inglés no reciba el español.
   - REDIRECT_URL ..... A dónde va el visitante después de confirmar.
   ============================================================ */

return [
  'API_KEY'          => 'xkeysib-PON-AQUI-TU-CLAVE',
  'LIST_ID_ES'       => 3,
  'LIST_ID_EN'       => 4,
  /* Brevo solo acepta su plantilla predeterminada de doble opt-in (#1) en
     la API; las creadas aparte se rechazan. Se reescribe esa. */
  'DOI_TEMPLATE_ES'  => 1,
  'DOI_TEMPLATE_EN'  => 1,
  'REDIRECT_URL'     => 'https://pipilacha.es/',

  /* Dejar en true. Con doble opt-in, el contacto solo entra en la lista
     después de pulsar el enlace del correo de confirmación: es la prueba
     de consentimiento que exige el RGPD. Ponerlo en false suscribe
     directamente y te deja sin esa prueba. */
  'DOBLE_OPT_IN'     => true,
];
