# Datos y automatización · Pipilacha

Análisis del estado real (30 jul 2026) y plan para tomar decisiones con datos
y automatizar lo que hoy se hace a mano o no se hace.

Documento de trabajo: se actualiza según se vayan cerrando fases.

---

## 1. Diagnóstico: qué sabes hoy y qué no

El negocio genera datos en seis sitios distintos y **ninguno se habla con otro**.
Cada uno es un silo:

| Fuente | Qué mide | Estado hoy |
|---|---|---|
| **GA4** (web) | visitas, de dónde vienen, intención de reservar | Instalado (`G-N137XN3B2V`), gateado por cookies. Los 4 eventos del embudo ya se envían desde el código; **falta marcarlos como «evento clave» en el panel de GA** |
| **TheFork** | reservas reales, no-shows, reseñas (9,9) | Es la fuente de verdad de la reserva. Panel propio, no conectado a nada |
| **Google Business Profile** | cómo te encuentran en Google/Maps, llamadas, cómo llegan | Sin explotar. Es donde se gana el descubrimiento local |
| **TPV** | dinero: ticket medio, % maridaje, barra vs mesas | Sin explotar. Es el único sitio donde vive el euro |
| **Instagram** | alcance, guardados, clics al enlace | Sin registro histórico. IG solo guarda ~90 días: lo que no anotes, se pierde |
| **Bonkdo** (tarjeta regalo) | ventas de regalo | Widget externo en `/regala/`. Otro silo |

**El punto ciego más grave no es técnico, es estratégico: no tienes base de datos
propia de clientes.** Todo el que ha comido en Pipilacha es un contacto de TheFork,
no tuyo. Eso significa que para volver a llenar una mesa hay que volver a pagar
por ese cliente. Es exactamente el problema que resuelve Brevo (§3).

**Dato duro que ya tenemos** (GA4, 25 jun – 22 jul): 476 usuarios, 81 % móvil,
45 % Madrid, y el **99,8 % de las búsquedas de Google son de marca**. Traducción:
la web convierte bien a quien ya te conoce, pero **no capta a nadie nuevo**.
Quien busca «restaurante flores madrid» no llega. Ese hueco se cierra en Google
Business Profile, no en la web.

### Límite honesto que hay que asumir

La reserva se confirma **dentro del iframe de TheFork**, en otro dominio. El
navegador no deja leer nada de ahí: la reserva completada **no es medible desde
la web**. Se mide toda la intención previa (`reserva_click`, `reserva_view`,
`reserva_widget`) y la cifra final se cruza a mano con el panel de TheFork.
Cualquiera que te prometa lo contrario, te está vendiendo humo.

---

## 2. Capa de datos: un solo cuadro de mando

Primero decidir **qué preguntas** quieres responder; luego, de dónde sale cada dato.
Seis métricas, no treinta:

| Métrica | Pregunta que responde | Fuente |
|---|---|---|
| **Ocupación %** | ¿Llenamos? (16 plazas × 8 servicios = 128 plazas/semana) | TPV / TheFork |
| **Ticket medio y % maridaje** | ¿Cuánto deja cada comensal? El maridaje (+60 €) es la palanca de margen más rápida | TPV |
| **No-shows %** | ¿Cuántas plazas se pierden por no presentarse? | TheFork |
| **Origen de la reserva** | web propia vs marketplace TheFork vs teléfono vs IG. **Cada canal tiene un coste distinto**: el widget de tu web es 0 €, el marketplace lleva comisión por cubierto | TheFork + GA4 |
| **Marca vs no-marca** | ¿Captamos gente nueva o solo a quien ya nos conoce? | Search Console + GBP |
| **Contactos propios** | ¿Crece la lista? Es el único activo que no te pueden quitar | Brevo |

**Cómo montarlo, sin fantasía:** ni TheFork ni el TPV tienen conector directo a
Looker Studio. Cualquiera que diga «todo automático» miente. Lo realista:

- **Una hoja de Google, una fila por mes.** Es el cuadro de mando.
- GA4 y Search Console entran **automáticos** (conector nativo de Looker Studio / Sheets).
- TheFork, TPV e Instagram: **export o copia manual, una vez al mes**.
- Coste real: **30–40 min al mes**. Y a cambio, por primera vez, decisiones con datos.
- Cuando la hoja lleve 6 meses viva y sepas qué miras de verdad, se le pone
  Looker Studio encima para los gráficos. Antes no: sería decorar un dato que aún no usas.

> **Término técnico:** *conector* = un puente que copia datos de un servicio a otro
> sin que tú lo toques. *Export CSV* = descargar una tabla y pegarla. Lo primero es
> automático, lo segundo es manual — y aquí habrá de los dos, no queda otra.

---

## 3. Para qué sirve Brevo (la respuesta a tu pregunta)

**Brevo no es «para mandar newsletters». Es para que la relación con tu cliente
sea tuya y no de TheFork.**

Concretamente hace cuatro cosas:

1. **Guarda la lista de contactos** (CRM). Quién vino, cuándo, si cogió maridaje,
   si es de Madrid. Con etiquetas.
2. **Manda emails y SMS**, uno a uno o a toda la lista.
3. **Automatiza secuencias**: «si pasa X, mándale Y a los N días». Sin tocar nada.
4. **Recoge altas desde un formulario** en la web.

Por qué Brevo y no otro: plan gratuito con contactos ilimitados (hay tope de envíos
diarios — verificar el vigente), servidores y cumplimiento en la UE (RGPD sin
sustos), hace email **y SMS** en el mismo sitio, y su API es sencilla. Mailchimp es
más caro y estadounidense; Klaviyo está pensado para tiendas online, sobra aquí.

**Lo que Brevo desbloquea, en euros:**
- Llenar un hueco de última hora escribiendo a tu propia gente = **0 € de comisión**.
- Avisar del cambio de menú de temporada (4–5 veces al año) a quien ya te quiere.
- Pedir la reseña de Google, que es lo que trae clientes nuevos.

⚠️ **Legal, y esto se salta todo el mundo:** los emails que tienes en TheFork
**no se pueden volcar a Brevo**. Son contactos que consintieron con TheFork, no
contigo. La lista propia hay que construirla desde cero, con consentimiento
explícito y doble opt-in: formulario en la web, QR en la mesa, y el email
post-visita. Es más lento y es la única forma que no te expone a una multa.

---

## 4. Los flujos, por orden de retorno

### Flujo 1 · Captura de emails en la web → Brevo
Sin esto, nada de lo demás existe. Formulario propio en el footer y en `/regala/`
(no el embed de Brevo: rompería el diseño y la CSP).

**Decisión técnica pendiente:** la web es estática (Astro → HTML plano en Arsys),
no tiene servidor que pueda hablar con Brevo en secreto. La clave de API de Brevo
**no puede ir en el JavaScript** (sería pública, cualquiera podría usar tu cuenta).
Tres salidas:
- **(a) Un PHP de 20 líneas en Arsys** — el plan es «Hosting Profesional Linux», casi
  seguro tiene PHP. Es la vía más simple y no añade proveedor. *Verificar primero.*
- (b) Cloudflare Worker o Netlify Function — gratis, pero es un servicio más que mantener.
- (c) Formulario alojado de Brevo — cero código, peor diseño y salta fuera del sitio.

Recomendación: **(a)**, y si Arsys no da PHP, **(b)**.

> **Estado (30 jul 2026): código escrito, pendiente de clave y de despliegue.**
> - `public/api/suscribir.php` — endpoint que habla con Brevo. **PHP 8.4 confirmado en Arsys.**
> - `public/api/brevo-config.example.php` — plantilla de la clave. Copiar a
>   `brevo-config.php` (está en `.gitignore`: la clave nunca entra en el repo, pero sí
>   viaja en `dist/` porque Astro copia `public/` tal cual).
> - `src/components/Newsletter.astro` + `src/scripts/newsletter.js` + estilos `.jardin`
>   en `main.css` + textos ES/EN en `src/i18n/index.js`. La banda va **antes** del
>   `<footer>`, en moss, y rota la flor + su nota entre las de la carta en curso: si
>   cambia el menú, se actualiza el array `FLORES` del componente.
> - `public/.htaccess`: bloqueo de acceso directo a `brevo-config*.php`. **No toca la CSP**,
>   así que no hace falta el despliegue en 3 pasos.
>
> Funciona **sin JavaScript** (POST normal) y con doble opt-in. Falta: crear la lista y la
> plantilla de confirmación en Brevo, poner la clave, desplegar y probar de punta a punta.
> **El PHP no se ha podido ejecutar todavía** — no hay PHP en el Mac y la cuenta beta de
> Arsys está dada de baja, así que el único sitio donde probarlo es producción.

### Flujo 2 · Post-visita → reseña de Google  ← el que más mueve el negocio
El 99,8 % de tus búsquedas son de marca: te falta descubrimiento, y el descubrimiento
local se gana con reseñas en Google (TheFork ya se encarga de las suyas).

- **Disparo:** una vez por semana se sube a Brevo el CSV de quien vino, con etiqueta
  `visita_2026-08-01`. 5 minutos.
- **Automatización:** a las 24 h, un email corto con **enlace directo a escribir la reseña**.
- Un solo recordatorio a los 4 días si no hay respuesta. Nunca más.

### Flujo 3 · Bienvenida + menú de temporada
Un email de bienvenida al darse de alta (quiénes sois, la barra, cómo funciona).
Y un envío cuando cambia el menú — el menú cambia solo, así que la excusa para
escribir viene dada. 4–5 envíos al año. Poco volumen, mucho valor.

### Flujo 4 · Tarjeta regalo (Bonkdo)
Hoy la compra ocurre en un widget externo y ahí se acaba el rastro. Flujo natural:
compra → email con el código → **recordatorio a los 10 meses** antes de que caduque
(vale un año) → reserva. Depende de si Bonkdo permite export o webhook: *verificar*.

### Flujo 5 · Huecos de última hora
Quedan plazas a 48 h → email/SMS a la lista, segmentado por Madrid. Esto **solo
funciona con lista propia**, y es literalmente la razón de existir de Brevo.
No montarlo hasta tener ~300 contactos.

### Flujo 6 · Redes sociales
**No automatizar la publicación.** La voz de la marca es artesanal y un feed
automático se nota — iría en contra de todo el trabajo de tono. Lo que sí:
- **Anotar** las métricas de IG cada mes (IG las borra a los 90 días).
- **Reutilizar** el mismo texto: un envío de menú de temporada sirve para
  newsletter + carrusel de IG.
- Si quieres programar, Metricool o Buffer. Programar ≠ automatizar el contenido.

---

## 5. Qué NO hacer

- **No montar n8n / Make / Zapier todavía.** Son fontanería para conectar servicios.
  Con dos flujos y 300 contactos, es complejidad que se rompe sola y que solo tú
  sabrías arreglar. Brevo lleva sus propias automatizaciones dentro.
- **No comprar un CRM de restaurantes** (SevenRooms, Zenchef) hasta que la lista
  propia tenga volumen y te duela no tenerlo. Hoy sería pagar por un vacío.
- **No poner un chatbot de reservas.** 16 plazas y trato cercano: sería el gesto
  menos Pipilacha posible.
- **No generar copys en masa con IA.** La voz es el activo. Se escribe a mano.

---

## 6. Fases

| Fase | Qué | Esfuerzo | Cuándo |
|---|---|---|---|
| **0 · Ver** | Marcar los 4 eventos como «evento clave» en GA4 · enlazar Search Console · reclamar y completar Google Business Profile · abrir la hoja del cuadro de mando con la primera fila | ~2 h | Ya |
| **1 · Capturar** | Brevo: lista, doble opt-in, formulario en la web (decidir PHP vs Worker), email de bienvenida, QR en mesa | ~1 día | Siguiente |
| **2 · Pedir reseña** | Flujo post-visita → Google. Carga CSV semanal | ~medio día | Tras la fase 1 |
| **3 · Fidelizar** | Menú de temporada · tarjeta regalo · huecos de última hora | ~1 día | A partir de ~300 contactos |
| **4 · Automatizar la medición** | API de GBP, carga automática a la hoja, Looker Studio | opcional | Solo si la fase 0 demuestra que lo usas |

---

## 7. Pendiente de averiguar

Sin estas respuestas no se puede cerrar el plan:

1. **¿Qué TPV usáis?** (Revo, Glop, Square, Ágora…) Determina si el dato de dinero
   se puede exportar o hay que teclearlo.
2. **¿Qué plan de TheFork tenéis?** ¿Permite exportar reservas a CSV?
3. **¿Está verificado el perfil de Google Business y quién lo gestiona?**
4. **¿Arsys da PHP en el plan de producción?** Decide el flujo 1.
5. **¿Hay ya alguna lista de emails de clientes** en algún sitio (Excel, TheFork,
   Bonkdo) y con qué consentimiento se recogió?
6. **¿Bonkdo permite export o webhook** de las tarjetas regalo vendidas?
