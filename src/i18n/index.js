/* ============================================================
   Internacionalización (i18n) — español en la raíz, inglés en /en/.
   - defaultLocale 'es' sin prefijo: pipilacha.es/menu/
   - 'en' con prefijo:               pipilacha.es/en/menu/
   El idioma se deduce de la URL (localeFromPath); las páginas /en/
   no tienen que pasar nada, Base.astro lo detecta solo.

   TRANSLATED = rutas que YA tienen versión inglesa (rollout por
   fases). Solo esas emiten hreflang y ofrecen contrapartida en el
   selector de idioma; el resto, mientras no se traduzcan, no
   apuntan a un /en/ inexistente.
   ============================================================ */
export const DEFAULT_LOCALE = 'es';
export const LOCALES = ['es', 'en'];

// clave = ruta ES normalizada (sin barra final; '/' para la home)
// Se amplía a medida que se traduce cada página (rollout por fases). Las que
// no estén aquí caen a su versión española vía localizeNav — sin 404.
export const TRANSLATED = new Set([
  '/', '/menu', '/reservas', '/conocenos',
  '/vinos', '/galeria', '/prensa', '/regala',
  '/aviso-legal', '/privacidad', '/cookies',
]);

/** Idioma a partir del pathname del navegador/URL. */
export function localeFromPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/** Ruta ES canónica (sin prefijo /en, sin barra final; '/' para la home). */
export function basePath(pathname) {
  const noEn = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return noEn.replace(/\/$/, '') || '/';
}

/** Prefija un href ES root-relativo (/menu/) al idioma pedido. */
export function localizeHref(href, lang) {
  if (lang === 'es') return href;
  if (href === '/') return '/en/';
  return '/en' + href;
}

/** La misma página en el OTRO idioma (para el selector). `base` = ruta ES
    normalizada (de basePath). Devuelve href listo para el <a>. */
export function altHref(base, targetLang) {
  const withSlash = base === '/' ? '/' : base + '/';
  return localizeHref(withSlash, targetLang);
}

/** Enlace de NAVEGACIÓN a idioma: prefija /en solo si esa página YA está
    traducida; si no, deja la versión española (evita enlaces a /en/ que
    aún no existen mientras el rollout es parcial). */
export function localizeNav(href, lang) {
  if (lang === 'es') return href;
  const key = basePath(href);
  return TRANSLATED.has(key) ? localizeHref(href, lang) : href;
}

/* ---- textos del cromo compartido (nav, pie, cookies, metadatos) ---- */
export const ui = {
  es: {
    'nav.about': 'Conócenos',
    'nav.menu': 'Menú',
    'nav.wine': 'Vinos',
    'nav.gallery': 'Galería',
    'nav.press': 'Prensa',
    'nav.gift': 'Regalar',
    'nav.book': 'Reservas',
    'cta.book': 'Reservar',
    'nav.openMenu': 'Abrir menú',
    'nav.home': 'Pipilacha inicio',
    'nav.mainMenu': 'Menú principal',
    'meta.hours': 'Horario',
    'meta.hoursValue': 'Jueves a domingo · 14:00 y 21:00',
    'meta.address': 'Dirección',
    'meta.addressValue': 'C. del Azulejo, 2 · Madrid',
    'meta.contact': 'Contacto',
    'lang.switch': 'EN',
    'lang.switchLabel': 'Ver en inglés',
    'reservaBar': 'Reservar',
    'footer.claim': 'El único restaurante del mundo construido íntegramente sobre las flores.',
    'footer.hours': 'Horario',
    'footer.hoursValue': 'Jueves a domingo<br>Comida 14:00 · Cena 21:00<br>16 plazas por servicio',
    'footer.location': 'Ubicación',
    'footer.locationValue': 'C. del Azulejo, 2<br>28028 Madrid',
    'footer.directions': 'Cómo llegar →',
    'footer.pages': 'Páginas',
    'footer.legal': 'Legal',
    // alta en la lista de correo (footer)
    'news.title': 'El menú cambia',
    'news.lead': 'Cuando cambia, escribimos. También cuando queda alguna mesa suelta. Nada más.',
    'news.flowers': 'flores',   // acompaña al recuento: «Solsticio floral · 32 flores»
    'news.label': 'Tu correo',
    'news.placeholder': 'nombre@correo.com',
    'news.submit': 'Apuntarme',
    'news.sending': 'Un momento…',
    'news.consent': 'Acepto recibir correos de Pipilacha. Puedo darme de baja cuando quiera.',
    'news.privacy': 'Cómo tratamos tus datos',
    'news.ok': 'Te hemos escrito para confirmar. Abre el correo y pulsa el enlace.',
    'news.error': 'No hemos podido apuntarte. Inténtalo otra vez o escríbenos a info@pipilacha.es.',
    'legal.notice': 'Aviso legal',
    'legal.privacy': 'Privacidad',
    'legal.cookies': 'Cookies',
    'legal.settings': 'Configurar cookies',
    'og.imageAlt': 'Arán y Noé, los chefs de Pipilacha, entre flores',
    // cookies
    'cc.title': 'Cookies',
    'cc.lead': 'Usamos cookies para que la web funcione y, si lo aceptas, para cargar el calendario de reservas de TheFork y contar visitas con Google Analytics. Nada de publicidad.',
    'cc.more': 'Más detalle',
    'cc.reject': 'Rechazar',
    'cc.prefs': 'Preferencias',
    'cc.accept': 'Aceptar',
    'cc.privacy': 'Privacidad',
    'cc.prefsTitle': 'Preferencias de cookies',
    'cc.prefsLead': 'Elige qué se carga. Puedes cambiarlo cuando quieras desde el pie de página.',
    'cc.close': 'Cerrar',
    'cc.necessary': 'Necesarias',
    'cc.necessaryDesc': 'Imprescindibles para que la web cargue y recuerde tu elección. Siempre activas.',
    'cc.necessaryAria': 'Cookies necesarias (siempre activas)',
    'cc.reservations': 'Reservas (TheFork)',
    'cc.reservationsDesc': 'Cargan el calendario de TheFork para reservar en esta página. Sin ellas, reservas por teléfono o Instagram.',
    'cc.reservationsAria': 'Cookies de reservas de TheFork',
    'cc.analytics': 'Analítica (Google)',
    'cc.analyticsDesc': 'Nos dicen cuánta gente visita la web y qué páginas mira, de forma agregada. Sin ellas, la web funciona exactamente igual.',
    'cc.analyticsAria': 'Cookies de analítica de Google',
    'cc.rejectAll': 'Rechazar todo',
    'cc.acceptAll': 'Aceptar todo',
    'cc.save': 'Guardar selección',
    'cc.policy': 'Política de cookies',
  },
  en: {
    'nav.about': 'About',
    'nav.menu': 'Menu',
    'nav.wine': 'Wine',
    'nav.gallery': 'Gallery',
    'nav.press': 'Press',
    'nav.gift': 'Gift',
    'nav.book': 'Reservations',
    'cta.book': 'Book',
    'nav.openMenu': 'Open menu',
    'nav.home': 'Pipilacha home',
    'nav.mainMenu': 'Main menu',
    'meta.hours': 'Hours',
    'meta.hoursValue': 'Thursday to Sunday · 2pm & 9pm',
    'meta.address': 'Address',
    'meta.addressValue': 'C. del Azulejo, 2 · Madrid',
    'meta.contact': 'Contact',
    'lang.switch': 'ES',
    'lang.switchLabel': 'Ver en español',
    'reservaBar': 'Book',
    'footer.claim': 'The only restaurant in the world built entirely on flowers.',
    'footer.hours': 'Hours',
    'footer.hoursValue': 'Thursday to Sunday<br>Lunch 2pm · Dinner 9pm<br>16 seats per service',
    'footer.location': 'Location',
    'footer.locationValue': 'C. del Azulejo, 2<br>28028 Madrid',
    'footer.directions': 'Directions →',
    'footer.pages': 'Pages',
    'footer.legal': 'Legal',
    // alta en la lista de correo (footer)
    'news.title': 'The menu changes',
    'news.lead': 'When it does, we write. Also when a table opens up. Nothing else.',
    'news.flowers': 'flowers',
    'news.label': 'Your email',
    'news.placeholder': 'name@email.com',
    'news.submit': 'Sign me up',
    'news.sending': 'One moment…',
    'news.consent': 'I agree to receive emails from Pipilacha. I can unsubscribe whenever I want.',
    'news.privacy': 'How we handle your data',
    'news.ok': 'We have sent you an email to confirm. Open it and click the link.',
    'news.error': 'We could not sign you up. Try again or write to info@pipilacha.es.',
    'legal.notice': 'Legal notice',
    'legal.privacy': 'Privacy',
    'legal.cookies': 'Cookies',
    'legal.settings': 'Cookie settings',
    'og.imageAlt': 'Arán and Noé, the chefs at Pipilacha, among flowers',
    // cookies
    'cc.title': 'Cookies',
    'cc.lead': 'We use cookies so the site works and, if you accept, to load the TheFork booking calendar and count visits with Google Analytics. No advertising.',
    'cc.more': 'More detail',
    'cc.reject': 'Decline',
    'cc.prefs': 'Preferences',
    'cc.accept': 'Accept',
    'cc.privacy': 'Privacy',
    'cc.prefsTitle': 'Cookie preferences',
    'cc.prefsLead': 'Choose what loads. You can change it anytime from the footer.',
    'cc.close': 'Close',
    'cc.necessary': 'Necessary',
    'cc.necessaryDesc': 'Essential for the site to load and to remember your choice. Always on.',
    'cc.necessaryAria': 'Necessary cookies (always on)',
    'cc.reservations': 'Reservations (TheFork)',
    'cc.reservationsDesc': 'They load the TheFork calendar to book on this page. Without them, book by phone or Instagram.',
    'cc.reservationsAria': 'TheFork reservation cookies',
    'cc.analytics': 'Analytics (Google)',
    'cc.analyticsDesc': 'They tell us how many people visit and which pages they look at, in aggregate. Without them, the site works exactly the same.',
    'cc.analyticsAria': 'Google analytics cookies',
    'cc.rejectAll': 'Decline all',
    'cc.acceptAll': 'Accept all',
    'cc.save': 'Save choice',
    'cc.policy': 'Cookie policy',
  },
};

/** Devuelve una función t(key) para el idioma dado (cae a ES si falta). */
export function useT(lang) {
  const dict = ui[lang] || ui[DEFAULT_LOCALE];
  return (key) => dict[key] ?? ui[DEFAULT_LOCALE][key] ?? key;
}
