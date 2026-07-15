# Auditoría SEO · LLM-SEO · Narrativa — julio 2026

Investigación con fuentes reales (SERPs, fichas, prensa, estudios GEO 2026) + auditoría
técnica del código + revisión del copy contra las reglas de `pipilacha-brand-voice`.
Complementa (no repite) `COPY_AUDIT.md`. Los puntos marcados ✅ ya quedaron aplicados
y desplegados en pipilacha.es el 11-jul-2026.

---

## 1. Diagnóstico en cinco líneas

La base es muy superior a la media del sector: HTML estático con todo el contenido en el
DOM (ideal para crawlers de IA), grafo schema.org con Restaurant/Person/Menu completo,
robots.txt que ya invita a GPTBot/ClaudeBot/PerplexityBot, y un copy con voz propia.
El problema nº 1 era invisible y grave: **todos los canonicals de producción apuntaban a
la beta** (live-website.com) — corregido y desplegado hoy. Lo que queda es sobre todo
trabajo **fuera de la web** (Google Business, Bing, reseñas, textos de TheFork/Bonkdo) y
tres decisiones de contenido (FAQ, etiqueta de temporada del menú, email oficial).

## 2. Hecho hoy ✅ (desplegado en producción y beta)

| Qué | Dónde | Por qué |
|---|---|---|
| `site` → `https://pipilacha.es` | `astro.config.mjs` | Canonical/og:url/JSON-LD apuntaban a la beta: riesgo real de desindexación. La beta ahora también canonicaliza a producción (anti-duplicado). |
| `ErrorDocument 404 /404.html` | `public/.htaccess` | La 404 de marca existía pero Apache servía la genérica. Verificado: URL rota → HTTP 404 + «Esta flor no ha brotado». |
| `meta robots` con `max-image-preview:large` | `Base.astro` | Google Discover/imágenes puede usar las fotos a tamaño grande. |
| Breadcrumbs de las 3 legales | `Base.astro` | Eran las únicas interiores sin BreadcrumbList. |
| `sameAs` + `hasMap` + `addressRegion` | `Base.astro` (Restaurant) | Añadidas las fichas de TheFork y TripAdvisor + mapa: consolidación de entidad para SEO local y LLMs. |
| Lista negra fuera del schema | `Base.astro` | `knowsAbout` decía «Alta cocina» e «Investigación **botánica**» — dos términos prohibidos por la marca, y los LLMs leen ese JSON-LD. |
| Lista negra fuera de las metas | `index.astro`, `regala.astro` | «son el **concepto**» → «son el ingrediente principal»; «Regala una **experiencia**» → «Regala Pipilacha: el menú…». |
| Dirección completa en el panel del menú | `Nav.astro` | «C. del Azulejo · Madrid» → «C. del Azulejo, 2 · Madrid» (consistencia NAP). |
| `public/llms.txt` | nuevo | Seguro barato (10 min): resumen + datos duros para agentes IA. Sin expectativas — la evidencia 2026 dice que apenas se lee; la palanca real son reseñas y entidad. |

## 3. Esta semana (30-60 min cada una, casi todo fuera del código)

1. **Google Business Profile** — crear/reclamar la ficha. Es la palanca nº 1 de un
   restaurante y hoy no está controlada. Nombre exactamente «Pipilacha», categoría
   «Restaurante», dirección/teléfono/horario carácter a carácter como el footer.
2. **Bing Webmaster Tools + Bing Places** — el buscador de ChatGPT usa el índice de Bing:
   sin esto, ChatGPT no puede leer la web al navegar. Se importa desde Search Console en
   2 clics. (Si tampoco hay Search Console: darla de alta primero y enviar el sitemap.)
3. **Textos de TheFork** (se editan en TheFork Manager, no en la web):
   - Mensaje de bienvenida actual: «🌸 Te damos la bienvenida a una **experiencia única**…
     que despertará tus sentidos 🌿» — dos violaciones de lista negra y tono twee.
     Propuesta: *«Bienvenido a Pipilacha. Un menú de quince pases construido sobre
     flores, cocinado a un metro de ti. Las reservas son a las 14:00 y a las 21:00, en un
     único turno: te rogamos puntualidad, la explicación del menú empieza para todos a la
     vez.»*
   - Descripción de las ofertas («Este menú incluye: 15 pases protagonizados por flores +
     🌸…»). Propuesta menú solo: *«Quince pases con una flor distinta al mando de cada
     uno. Sin carta y sin alternativa: se sirve completo y se cuenta en la mesa.»*
     Propuesta con maridaje: *«El menú de quince pases más seis copas elegidas para la
     temporada — vinos de productores pequeños o los fermentos de la casa.»*
4. **Bonkdo (regala)**: los bonos dicen **90 € y 150 €** frente a los 85/145 € de la web.
   Si el margen es intencionado (gestión del bono), añadir una línea en `/regala/` que lo
   explique; si no, corregir el precio en Bonkdo. Su copy «Disfruta de una **experiencia
   única**…» también se edita ahí. Propuesta: *«El menú de degustación de Pipilacha:
   quince pases construidos sobre flores, en Madrid. Válido un año.»*
5. **TripAdvisor**: la categoría es «Latin, Spanish» — cambiarla a contemporánea/española
   moderna y completar la ficha (fotos, horario, rango de precio).
6. **Decidir el email oficial**: la web entera dice `info@pipilacha.es`; los datos
   operativos de marca dicen `admin@pipilacha.es`. Los LLMs penalizan divergencias con
   silencio. Elegir uno y unificar web + fichas.
7. **Etiqueta de temporada del menú**: la web dice «El menú primavera / Degustación ·
   Primavera» sobre «Solsticio floral» — el solsticio es el 21 de junio y estamos en
   julio. O el menú vigente ya es el de verano (actualizar eyebrow a «Degustación ·
   Verano» en `menu.astro` y «El menú de verano» en `index.astro`), o conviene quitar la
   estación y dejar «Degustación · Solsticio floral».

## 4. Este mes

1. **Bloque FAQ en `/reservas/` (o al final de `/menu/`) con schema FAQPage.** Es el gap
   de contenido nº 1 para motores de respuesta. Preguntas con respuesta de 2-3 frases,
   cada una sosteniéndose sola (borrador listo, ajustar en sala):
   - *¿Cuánto cuesta comer en Pipilacha?* — El menú de degustación son 85 € por persona:
     quince pases construidos sobre flores. El maridaje de seis copas suma 60 €.
   - *¿Cuánto dura?* — Unas dos horas. Hay dos servicios al día, a las 14:00 y a las
     21:00, de jueves a domingo, y empezamos todos a la vez.
   - *¿Puedo elegir barra o mesa?* — Sí, al reservar. Ocho asientos dan a la cocina
     abierta — se cocina a un metro — y ocho van en mesa.
   - *¿Alergias o restricciones?* — Escríbenos al reservar y lo adaptamos. El menú se
     sirve completo, sin carta, así que necesitamos saberlo antes del servicio.
   - *¿Dónde está Pipilacha?* — C. del Azulejo, 2, 28028 Madrid — barrio de Fuente del
     Berro, a unos minutos de Las Ventas.
   - *¿Cómo se reserva?* — En esta página (el calendario es de TheFork), por teléfono al
     919 12 59 98 o por Instagram.
2. **Precio visible en `/menu/`** — está en la meta y el schema pero no en la página
   (Google pide que lo marcado sea visible; el que llega del snippet no lo encuentra).
   Propuesta para el intro: *«Quince pases. Sin carta, sin alternativa: se sirve
   completo. 85 € por persona; el maridaje, aparte. Cada uno con una pista; el resto te
   lo contamos en la mesa. El décimo te lo guardamos.»*
3. **Titles infrautilizados** (`galeria`, `prensa`, `reservas` no dicen ni Madrid ni
   flores): «Galería · Pipilacha, restaurante de flores en Madrid» · «Prensa · Pipilacha,
   el restaurante de flores de Madrid» · «Reservar mesa · Pipilacha Madrid».
4. **Sistema de reseñas post-servicio** — la señal nº 1 de recomendación en IA (los
   recomendados promedian 3,6× más reseñas; ChatGPT favorece 4,5+). Con 16 plazas la
   escala juega en contra: compensar con densidad — QR o mensaje al día siguiente
   pidiendo reseña en Google (prioridad), TripAdvisor y TheFork; las reseñas largas que
   nombren «menú degustación de flores» y platos concretos alimentan la asociación
   entidad-concepto. Responder todas.
5. **Alts genéricos de la galería** (`galeria.js`): «Flores y técnica», «Al fuego», «La
   sala», «Pase de temporada», «Flor sobre el plato», «Plato con flor azul», «Servicio en
   cocina», «Detalle de mise en place» describen poco; reescribir nombrando plato y flor.
6. **Sitemap generado en build** — `@astrojs/sitemap` (o quitar los `lastmod` manuales:
   mejor omitir que mentir).
7. **Enlace contextual home → /vinos/** — la línea «Maridaje +60 €» de la ficha de
   reserva debería enlazar a `/vinos/`; es la página con menos autoridad interna.

## 5. Mapa keyword → página (de la investigación de SERPs)

| Keyword (intención) | Página | Nota competitiva |
|---|---|---|
| restaurante flores comestibles madrid (nicho exacto) | `/` | **SERP sin competidor real de cocina floral** — solo proveedores y restaurantes decorados con flores. Es LA batalla ganable. |
| restaurante de flores madrid · comer flores madrid | `/` | Variantes del nicho; refuerza el AI-overview que ya cita a Pipilacha. |
| menú degustación de flores · 15 pases madrid | `/menu/` | Conversión altísima, sin competencia. |
| menú degustación madrid (head) · menos de 100 € | `/menu/` | Agregadores dominan; atacar por concepto+precio (banda 80-100 € poco cubierta), no de frente. |
| menú degustación con maridaje madrid | `/vinos/` | Vende el +60 €. |
| romántico / aniversario / pedida de mano / San Valentín | `/reservas/` + ficha TheFork | Las SERPs las poseen TheFork/Timeout/Michelin: se compite etiquetando bien la ficha (9,9/10 ya) y con copy de ocasión. «Pedida de mano» encaja sin disfraz: flores de verdad, 16 plazas. |
| regalar menú degustación / tarjeta regalo restaurante madrid | `/regala/` | Aquí SÍ rankean páginas propias de restaurantes; estacional (Reyes, San Valentín). |
| restaurante fuente del berro / cerca de las ventas | `/reservas/` + GBP | SERP de directorios débiles, fácil de poseer; única cocina de autor de la zona. |
| arán rodrigo noé david chefs · chefs jóvenes madrid | `/conocenos/` | El ángulo editorial que ya usó El Español; E-E-A-T. |
| pipilacha opiniones | fichas + `/prensa/` | La ganan TheFork/TripAdvisor: cuidar fichas y recoger prueba social en prensa. |

## 6. LLM-SEO — lo estructural

- **La frase-entidad es oro**: «el único restaurante del mundo construido íntegramente
  sobre las flores». Google ya cita a Pipilacha en AI-overviews como «el primer menú de
  degustación en España que tiene las flores como hilo conductor». Repetir la frase
  EXACTA en web (title de la home usa una variante corta — unificar), GBP, bios y prensa
  para que el patrón cristalice.
- **Fuentes que los LLM leen**: TripAdvisor activo, prensa gastro (Repsol, Michelin,
  Timeout, Metrópoli) y foros. El listicle de Timeout «comer con flores en Madrid» NO
  incluye a Pipilacha — es un gap de PR, no de contenido: escribirles.
- **El Español publica un precio desactualizado (75 €)** — pedir corrección o al menos
  saberlo: los LLM beben de ahí.
- **TheFork no alimenta a ningún LLM** (OpenTable es partner exclusivo de ChatGPT).
  La ficha de TheFork sirve dentro de TheFork (su buscador IA interno) — optimizarla —
  pero la visibilidad en ChatGPT vendrá de Bing + GBP + reseñas Google + prensa.
- **Medición**: baseline mensual de ~20 prompts («mejor menú degustación Madrid»,
  «restaurante de flores comestibles Madrid», «dónde celebrar un aniversario original en
  Madrid»…) en ChatGPT/Claude/Gemini/Perplexity, anotando a quién citan.

## 7. Narrativa — veredicto

**El copy de la web está fuerte y es de lo mejor del sitio**: «Un menú entero hecho de
flores», «Un restaurante para curiosos», «Se cocina delante de ti», «Todo empieza con una
pregunta», «Con dieciséis personas por servicio nos da tiempo a saber tu nombre» — tono
directo, con carácter, datos duros integrados sin romper la voz. El intro de `/prensa/`
es un boilerplate perfecto (y muy citable por LLMs). Tras los arreglos de hoy no queda
ninguna palabra de la lista negra en páginas ni metadatos **propios**; las violaciones
vivas están en los widgets de terceros (TheFork, Bonkdo — ver §3.3-3.4).

Matices menores, a criterio:
- «Durante siglos las flores se contemplaron. Ahora también se degustan.» roza el marco
  retrospectivo que la marca evita («siempre estuvieron ahí»); funciona porque mira hacia
  delante, pero si algún día se retoca el hero, empujar hacia lo inexplorado: *«Hay miles
  de flores comestibles. Casi nadie las ha cocinado.»*
- `servesCuisine: "Cocina floral de autor"` — «de autor» es adyacente a «alta cocina»;
  válido como categoría de ficha, vigilar que no se cuele en copy visible.

## 8. Qué NO tocar

- El patrón `.reveal` degradando sin JS y las fotos en HTML plano: exactamente lo que los
  crawlers de IA (que no ejecutan JS) necesitan.
- robots.txt: ya permite todos los bots de IA relevantes; sin cambios.
- Las páginas legales indexables con priority 0.2: decisión correcta.
- hreflang: no procede en un sitio monolingüe — no «arreglarlo». (Una futura versión EN
  sí tiene mercado: «flower restaurant madrid» tiene la SERP vacía y el turista llega hoy
  por TripAdvisor/esmadrid.)
- El JSON-LD de `/menu/` con los 15 MenuItem: ya está bien montado y ahora, con el
  dominio unificado, el grafo cierra.
