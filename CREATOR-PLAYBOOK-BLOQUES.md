# Creator Playbook · Pipilacha
## Rediseño bloque a bloque — copy definitivo y layout

Fecha: 2026-08-01
Estado: para aprobar antes de tocar código.
Base: `CREATOR-PLAYBOOK-ESTRATEGIA.md` (aprobado) + las cuatro decisiones cerradas.

El texto de este documento es **definitivo**: va tal cual a `src/data/creatorGarden.js`. Lo que aparece entre `⟨corchetes⟩` es lo único pendiente de que me lo confirmes.

---

## Reglas que se aplican a los trece bloques

| Regla | Motivo |
|---|---|
| **Una familia de layout por bloque, sin repetir** | Es lo que impide que parezca plantilla. Se hereda de la versión actual, que en esto acierta. |
| **Como mucho un cierre en aforismo de cada tres tarjetas** | La uniformidad rítmica es el delator de IA. Las otras dos terminan sin remate. |
| **Nada abre con una negación** | Norma editorial de la casa. Única excepción autorizada: la línea de contrapartida en el bloque 12, donde la negación *es* el mensaje. |
| **El negro aparece una vez** | Bloque 04. Si aparece dos veces deja de ser puntuación. |
| **Las flores se nombran por su nombre común** | «Flor de higo», nunca «abutilon». |
| **Todo lo copiable lleva botón de copiar** | Ganchos, captions y entradas del diccionario. |
| **Estado base visible** | Nada tapado que dependa de animarse para destaparse. |

**Vocabulario vetado en todo el documento:** experiencia · alta cocina · botánico · temporada · km0 · sostenibilidad · obsesión · pasión · autenticidad · territorio · propuesta · concepto · viaje · producto · artesanal · mimo.

---

# 01 · APERTURA

**Función:** decir en un segundo que esto es una herramienta, no un dosier. Abrir el bucle numérico. Dar dos salidas inmediatas.

**Layout:** el actual, que funciona. Foto a sangre (56 svh móvil / 74 svh escritorio) → antetítulo → H1 → subtítulo → **dos botones** → crédito de la foto. Se añaden los botones y se sustituye el texto.

### Copy

> **PLAYBOOK · PIPILACHA**
>
> # Lo que hay que grabar aquí, en orden.
>
> Seis momentos, tres planos y treinta y dos flores con su sabor apuntado.
>
> `[ Tengo 20 minutos ]`  `[ La escaleta ]`
>
> —
> ARRIBA, PASE 05: FAROLILLO DE ATÚN Y ORÉGANO. EL CUENCO ES LA FLOR.

### Por qué este H1

El actual —«La flor no decora. Es el plato.»— es la construcción *No es X, es Y*: el tic de IA número uno, y además abre con una negación, que la casa tiene prohibido. El nuevo **afirma, nombra el entregable y suena a índice de herramienta**. La flor no se pierde: la lleva la foto, que es la regla de la casa —la imagen pone la belleza, el texto pone la inteligencia.

Los tres números abren el bucle que cierra el bloque 13.

### Nota sobre el nombre

Mantén la URL `/creator-garden/` — ya hay enlaces mandados por DM y romperlos no compensa. Cambia solo cómo se llama la pieza dentro: **Playbook**. El `<title>` pasa a `Creator Playbook · Pipilacha`.

---

# 02 · MODO EXPRÉS

**Función:** rescatar la visita apurada. Si en diez segundos no hay algo utilizable, se cierra la pestaña.

**Layout:** tres bloques numerados grandes, **una pantalla, sin scroll interno**. Fondo nube. Sin foto: es el bloque más rápido de la página y una imagen lo frenaría.

### Copy

> ## Si solo tienes veinte minutos
>
> Tres tomas. Con esto ya tienes un vídeo.
>
> **01 · La cara, no el plato**
> El primer pase lleva flor eléctrica y adormece la lengua unos segundos. Graba a quien viene contigo mientras la prueba.
>
> **02 · El cuenco que se come**
> Pase 05. Enseña la forma antes de decir qué es.
>
> **03 · Las manos**
> Desde la barra, montando con pinza. Plano medio corto y sin cortar.
>
> Los tres caben en quince segundos y dejan doce pases sin contar.

Esa última línea abre el bloque 04 sin anunciarlo.

---

# 03 · LA ESCALETA DEL SERVICIO

**Función:** el corazón de la página. El único bloque que se abre **dentro** del restaurante.

**Layout:** lista vertical marcable. Cada fila: número de pase · título · **ventana** (destacada) · instrucción. Casilla a la izquierda, objetivo táctil grande (44 px mínimo). Contador arriba: «Marcado 0 de 6». Persistencia en `localStorage`.

### Copy

> ## La escaleta del servicio
>
> El menú dura dos horas. Estos son los seis momentos que conviene tener fichados, en el orden en que pasan.
>
> `Marcado 0 de 6`

| | Momento | Ventana | Qué haces |
|---|---|---|---|
| ☐ | **Antes de sentarte** | Solo si llegas pronto | La sala vacía: dieciséis sillas y seis metros de barra de iroko. Cuando arranca el servicio ya no se puede repetir. |
| ☐ | **Pase 01 · Flor eléctrica** | **Tres segundos, y llega nada más sentarte** | Ten la cámara lista **antes**. La flor eléctrica adormece el paladar unos segundos; lo que hay que grabar es la cara de quien la prueba, no el plato. |
| ☐ | **Pase 02 · Degustación floral** | Unos tres minutos | Cinco flores servidas una a una, antes del primer plato caliente. Cenital, un corte por flor. Este bloque se edita solo. |
| ☐ | **Pase 05 · El farolillo** | Al servirlo | Deja que se vea la forma tres segundos antes de contar que el cuenco es la flor y que se come entero. |
| ☐ | **La barra** | Varias veces, si te sientas ahí | Ocho de los dieciséis asientos miran a la cocina. Desde ahí salen las manos, el fuego y el pase montándose con pinza. Pídela al reservar. |
| ☐ | **Pase 10 · El higo** | Al servirlo | Sale negro de la brasa y al lado va el helado de saúco, blanco y frío. El contraste funciona sin texto encima. |

### El hallazgo que ordena el bloque

**El mejor plano del servicio ocurre en el pase 01 y dura tres segundos.** Hoy eso está en una tarjeta en la pantalla 8 sin ninguna referencia temporal, así que se pierde siempre. Puesto el primero y con la ventana en negrita, es una instrucción que solo Pipilacha puede dar.

---

**⌁ FIGURA A SANGRE · farolillo** — se queda como está. Pie: `Pase 05 · Farolillo de atún y orégano`.

---

# 04 · LA REGLA DE TRES

**Función:** el bloque citable, el que hace que se la pasen a otro creador. **Único sitio donde aparece el negro.**

**Layout:** columna centrada, mucho aire. La línea de tres palabras en display grande, en negro, sobre crema. Debajo, tres definiciones cortas.

### Copy

> ## Cómo contarlo sin quemar los quince pases
>
> Un vídeo entero se sostiene con tres planos.
>
> ### UN DESVELO. UN GESTO. UNA REACCIÓN.
>
> **Un desvelo** — el plato que no esperabas. El cuenco que se come.
> **Un gesto** — manos, pinzas, fuego.
> **Una reacción** — una cara.
>
> Lo demás se queda fuera de cuadro.
>
> Tres planos aguantan quince segundos, dejan doce pases sin contar y te dan algo que decir: que no vas a enseñarlo todo.

### Por qué funciona por las dos partes

Al creador le da estructura y menos trabajo de edición. A la casa le protege la carta. Y es lo único de la página que es transferible a cualquier restaurante — **que sirva fuera de Pipilacha es exactamente lo que la hace citable**.

---

# 05 · PLANOS

**Función:** la ficha técnica. Responde a foto, vídeo, sonido, B-roll y móvil de una vez.

**Layout:** tres columnas en escritorio (Foto · Vídeo · Sonido), acordeón en móvil con el primero abierto. B-roll como lista suelta debajo.

### Copy

> ## Planos
>
> Todo esto está grabado con móvil. Con eso llega.

**FOTO**
- **Cenital.** Casi todo se emplata para verse desde arriba. Si dudas del plano, ese.
- **Luz de sala.** El flash directo aplasta el color del pétalo. Sube ISO antes de sacarlo.
- **Fondo mate.** La cerámica es clara y sin brillo, y la barra es iroko. No hace falta mantel ni atrezo.
- **Sin saturar.** El color del pétalo ya es ese; subirlo en edición lo vuelve falso.

**VÍDEO**
- **Planos largos.** El emplatado es lento a propósito.
- **La mano en cuadro.** Una pinza colocando una flor da escala sin una sola palabra.
- **Un segundo de más.** Después del primer bocado, no cortes.
- **Vertical y fijo.** La sala es estrecha y el movimiento de cámara aquí resta.

**SONIDO**
- **Graba ambiente.** Dieciséis personas hablando y dos cocineros a dos metros. Aquí no hay música alta que tapar.
- **El emplatado suena.** Pinza, cerámica, brasa. Sirve de capa bajo cualquier corte.
- **Pregunta en voz alta.** Arán y Noé contestan desde la cocina. Esa respuesta es audio utilizable.

**B-ROLL**
La estantería de libros y plantas detrás de la barra · las flores en bandeja antes de montarse · los fermentos y kombuchas de la casa · la barra con la mise en place puesta.

### Por qué el sonido tiene columna propia

Es el bloque que más diferencia y el que nadie escribe. Un restaurante de dieciséis plazas con los cocineros a dos metros **suena distinto**, y eso solo se aprovecha si alguien te lo dice antes.

---

**⌁ FIGURA A SANGRE · higo** — se queda. Pie: `Pase 10 · Higo a la brasa con helado de saúco`.

---

# 06 · FORMATOS

**Función:** responder a Reels / TikTok / Stories / Shorts sin cuatro secciones que repiten el mismo texto.

**Layout:** tabla comparativa corta (scroll horizontal propio en móvil) + seis ideas con estructura completa en carril.

### Copy

> ## Formatos
>
> La misma comida da piezas distintas según dónde vaya.

| | Reel | TikTok | Stories | Shorts |
|---|---|---|---|---|
| **Duración que aguanta** | 15–30 s | 20–45 s | 3–5 tarjetas | 20–40 s |
| **Dónde va el gancho** | segundo 0, visual | segundo 0, hablado | primera tarjeta | segundo 0, visual |
| **Texto en pantalla** | poco, arriba | mucho, es el formato | mucho | poco |
| **Qué funciona aquí** | el desvelo del farolillo | «adivina a qué sabe» | la escaleta en directo | el contraste del higo |

### Seis piezas con la estructura puesta

> **Reel · 15 s — Adivina cuál se come**
> 0–3 s cenital de tres pases, sin decir nada · 3–10 s los nombras uno a uno · 10–15 s desvelas que en los tres la flor es el ingrediente principal.
> *La pregunta se queda abierta hasta el último segundo.*

> **Reel · 30 s — A qué sabe cada flor**
> Un corte por flor con el sabor en texto: capuchina/rábano, farolillo/ácido, eléctrica/cosquilleo. Cierra con la que adormece la lengua.
> *Es información que no está en ningún sitio, y eso se guarda.*

> **TikTok · 45 s — Se lo pregunté al cocinero**
> Grabas la pregunta desde la barra y la respuesta de Arán o Noé, sin cortar.
> *Hablado y sin edición: es lo que mejor tolera el formato.*

> **Carrusel — Cinco flores y a qué saben**
> Una tarjeta por flor con su sabor. La última, dónde probarlas.
> *Se guarda y se manda por DM.*

> **Vídeo · 60 s — De la flor al plato**
> La misma flor cruda, cocinada y emplatada. Tres estados de un solo ingrediente.
> *Explica el sitio entero sin explicarlo.*

> **Story — Dieciséis sillas**
> La sala vacía antes del servicio. Cuentas el aforo.
> *Escasez real, y funciona como aviso de que has entrado.*

**Cambio respecto a la versión actual:** desaparece la idea «Los quince pases, una foto por pase». **Contradecía la regla de tres** — es exactamente quemarse la carta. La sustituye el carrusel de cinco flores, que se guarda igual y no desvela el menú.

---

# 07 · GANCHOS Y CAPTIONS

**Función:** el material que se usa a la una de la mañana, editando. Todo copiable de un toque.

**Layout:** ganchos como citas grandes con botón de copiar por línea; captions en tarjetas con filete oliva a la izquierda y botón de copiar. Reglas de voz en lista corta debajo.

### Copy

> ## Ganchos y pies
>
> Cópialos y cámbialos. Están para tu voz, no para la nuestra.

**GANCHOS** *(los tres primeros segundos)*
- Esta flor te va a dormir la lengua.
- Este cuenco también se come.
- Adivina a qué sabe.
- Me acaban de servir una flor entera.
- Esto pica. Y es una flor.
- Tres segundos y no vas a notar la lengua.

**PIES** *(copiar y pegar)*

> **Para el pase que sorprende**
> El cuenco es la flor. El farolillo aguanta el tartar de atún y te lo comes entero, recipiente incluido. Pase 5 de 15 en @restaurante.pipilacha, Madrid.

> **Para el detalle de sabor**
> La capuchina pica como un rábano suave. Aquí no va encima del plato: va dentro del ajoblanco, y es lo que lo despierta. @restaurante.pipilacha

> **Para hablar de la casa**
> Dieciséis asientos, dos servicios, de jueves a domingo. Cocinan Arán y Noé, y si preguntas por una flor te contestan ellos desde la barra. @restaurante.pipilacha · Fuente del Berro, Madrid.

> **Para cerrar sin enseñarlo todo**
> Quince pases y solo te enseño tres. El resto lo tienes que ver tú. @restaurante.pipilacha

**CÓMO NOMBRARLO**
- **Di la flor y el plato.** «Ajoblanco con capuchinas» dice más que «cocina de flores».
- **Di el nombre común.** Flor de higo, no abutilon.
- **Cuenta lo que te pasó en la mesa.** Qué probaste, qué preguntaste, qué no esperabas.
- **Nombra a Arán y Noé.** Son dos, y cocinan y sirven ellos.

### Qué se ha caído de los ganchos actuales

Tres de los siete solo informaban —«Treinta y dos flores en un solo menú», «Quince platos y en todos manda una flor», «No hay otro restaurante así en el mundo»—. Un dato no para el scroll de nadie. Los seis nuevos **abren una pregunta o prometen una sensación física**, que es lo que el propio archivo decía en un comentario y luego no cumplía.

---

# 08 · DICCIONARIO DE SABOR

**Función:** el activo que hace que guarden la página. Va en la **única escena musgo** — el mayor pico visual, gastado por fin en el mejor material.

**Layout:** buscador arriba + filtro por pase. Rejilla de entradas: nombre (serif grande) · sabor · pase · qué decir. Botón de copiar por entrada.

### Copy

> ## Treinta y dos flores, con su sabor apuntado
>
> *Solsticio floral*, la carta de esta estación. Búscala aquí antes de decirla a cámara.
>
> `[ buscar flor ]`  `[ filtrar por pase ]`

### El diccionario completo — 34 entradas

**Fuente:** el documento de cocina **«FLORES Y USOS»** del Drive (Arán y Noé, flor por flor del Solsticio), completado con la ficha **«Características de las flores»**. Cuando las dos discrepan **manda cocina**: es la casa describiendo su propio plato.

| Flor | A qué sabe | Pase | Qué decir a cámara |
|---|---|---|---|
| guisante mariposa | No sabe a nada. Está por el azul. | 01 | «este azul es una flor, no colorante» |
| flor eléctrica | Cosquillea y despierta las papilas | 01 | «espera tres segundos» |
| margarita | A campo. Sabe como huele. | 02 | «sabe exactamente a como huele» |
| cosmos | Recuerda a la lechuga | 02 | «esta sabe a ensalada» |
| flor de albahaca | Albahaca concentrada, y mide un centímetro | 02 | «tan pequeña y sabe más que la hoja» |
| flor de ajo | Ajo explosivo. La más potente de las cinco. | 02 | «prepárate con esta» |
| oxalis | Muy ácida. Limpia el ajo de golpe. | 02 | «esta borra la anterior» |
| flor de tila | Miel suave. Seca y molida, es la harina del taco. | 03 | «el taco está hecho de tila» |
| flor de aliso | Huele a miel y sabe a mostaza | 03 | «huele dulce y luego pica» |
| flor de anís estrellado | Anís marcado, infusionada en la crema | 04 | — |
| flor de geranio | Afrutada y fresca. Baja el anís. | 04 | — |
| farolillo japonés | Es el recipiente, y deja un fondo a higo | 05 | «el cuenco también se come» |
| flor de orégano | Herbal, dentro de la ponzu del atún | 05 | — |
| kalanchoe | No aporta sabor: aporta crujido | 05 | «esta está aquí por la textura» |
| flor de borraja | Pepino fresco | 06 | «esta sabe a pepino» |
| flor de hierbabuena | En infusión. El melón se empapa de ella. | 06 | — |
| rosa | Seca, dentro del pan cuatro estaciones | 07 | «hay una flor dentro del pan» |
| amapola | Sus semillas, en el pan de puerro | 07 | — |
| lavanda | Infusionada en la mantequilla, y seca en la sal | 07 | «mantequilla de flor» |
| capuchina | Mostaza y rábano. Se usa hoja, pétalo y cáliz. | 08 | «esto pica, y es una flor» |
| flor de hinojo | Anís intenso. También servida como aire. | 09 | «huele el aire antes de comértelo» |
| clavel | Muy floral, dentro del gazpacho | 09 | — |
| saúco | Avellanado. Va en helado. | 10 | «esto va helado» |
| phlox estrellado | Dulce. Acompaña al higo. | 10 | — |
| dalia | Cruje como fruta. Refrescante. | 11 | «cruje como una manzana» |
| tagete | Cítrico y amargo, muy marcado | 12 | — |
| caléndula | Pimienta suave con fondo amargo | 12 | — |
| flor de ajo/puerro | Encurtida. Agridulce, sobre el rape. | 12 | — |
| flor de begonia | Ácida, casi cítrica. La hoja hace de recipiente. | 13 | «la hoja también se come» |
| flor de hibiscus | Frutos rojos y acidez. Reducida como una demi-glace. | 13 | — |
| regaliz azteca | Regaliz reconocible, dentro de la mousse | 14 | «esto es regaliz de verdad» |
| lantana | Muy aromática, con un punto anisado | 14 | — |
| crisantemo | Refrescante, de textura marcada | 15 | «dibuja un girasol en el plato» |
| girasol | Sus pipas, saladas, cortan el dulce | 15 | — |

**Las entradas sin «qué decir» son deliberadas.** Si las treinta y cuatro llevaran frase, volvería el ritmo uniforme que delata a la máquina. Llevan frase las que de verdad dan un momento a cámara.

### Lo que el material propio corrige de la web actual

Cruzando el Drive con `src/data/menu.js` salen **seis desajustes reales**. No los decido yo:

| # | Qué pasa | Qué hace falta |
|---|---|---|
| 1 | **`menu.js` no lista rosa, girasol ni clavel**, y las tres están en el Solsticio según cocina | Añadirlas al array `flores` |
| 2 | **`hisopo` no aparece en ningún documento de cocina** | ¿Está de verdad en esta carta? |
| 3 | **`aciano` tampoco está en el desglose del Solsticio** — sí en invierno y primavera | ¿Sobró de la carta anterior? |
| 4 | **Farolillo japonés vs. flor de higo.** Cocina dice «farolillo japonés, aporta un ligero sabor a higo»; el doc por estaciones dice «flor de higo (Atún)» | ¿Son la misma flor o dos? Es el pase de la foto de portada, conviene acertar |
| 5 | **El saúco tiene tres sabores distintos escritos**: «avellanado» (cocina), «afrutado y amielado» (ficha), «floral y ligeramente vinoso» (`menu.js`) | ¿Cuál va? |
| 6 | **El pase 02 se llama «Sabores de las flores»** en la carta impresa y «Degustación floral» en `menu.js` | ¿Cuál es el nombre bueno? |

También: **cosmos** figura como «chocolate suave» en la ficha y como «cercano a la lechuga» en el documento de cocina. He puesto lechuga —manda cocina—, pero confírmalo.

### Aviso sobre la ficha «Características de las flores»

Ese documento lleva **afirmaciones médicas en casi todas las entradas**: «hipotensor natural que ayuda a regular la tensión», «antibiótico natural», «propiedades cicatrizantes». **Nada de eso puede salir en la web.** Las alegaciones de salud sobre alimentos están reguladas en la UE y además no son la voz de la casa. De esa ficha solo se usa la línea de sabor; el resto se queda fuera.

---

**⌁ FIGURA A SANGRE · vieiras** — se queda. Pie: `Pase 11 · Vieiras shiso-dalias`.

---

# 09 · LO QUE NO FUNCIONA

**Función:** el único bloque negativo. Corto y tarde, para que no tiña el tono.

**Layout:** lista compacta a dos columnas en escritorio, una en móvil. Sin tarjetas: es una lista, y parecer tarjetas le daría más peso del que merece.

### Copy

> ## Lo que no funciona
>
> - **Flash directo.** Aplasta el pétalo y borra justo lo que hay que enseñar.
> - **Saturar en edición.** El color ya es ese. Subirlo lo vuelve falso.
> - **Cortar cada segundo.** El emplatado es lento a propósito.
> - **Música alta encima.** Tapa lo único que suena distinto aquí.
> - **Enseñar los quince pases.** Le quita el motivo a quien vaya después.
> - **Quedarte en «flores comestibles».** Di cuál y a qué sabe.
> - **Grabar de pie en medio de la sala.** Son dieciséis personas en una sala pequeña.

La última no la escribe ningún restaurante y es la que más agradece un creador que ya ha pasado por el momento incómodo.

---

# 10 · EL PASE QUE NADIE HA GRABADO

**Función:** escasez real y fechada. El motivo para reabrir la página cada estación.

**Layout:** bloque corto, ancho de columna estrecha, con la fecha visible arriba en antetítulo.

### Copy

> **AGOSTO 2026**
>
> ## Todavía nadie ha grabado el pase 15.
>
> Calabacín y crisantemos. El crisantemo es amargo y herbal, y sujeta el dulzor del calabacín asado. Sale al final, cuando ya nadie tiene el móvil en la mano.

**Mantenimiento:** una línea en `creatorGarden.js` por carta. Si no se actualiza, envejece a la vista y resta — es el único bloque de la página con esa servidumbre. Si no vais a mantenerlo cada estación, mejor no ponerlo.

---

# 11 · LA CASA EN TRES FRASES

**Función:** la única parte que habla de Pipilacha. Llega en la pantalla 11, cuando la página ya se ha ganado el derecho.

**Layout:** tres frases en serif grande, columna única, mucho aire. Familia de layout heredada del manifiesto actual, que era lo mejor resuelto visualmente de la versión vieja.

### Copy

> Pipilacha es la libélula: así la llaman en Centroamérica, el insecto que no para de volar.
>
> Cada plato se levanta sobre una flor concreta — lo que sabe, lo que aguanta al fuego, lo que pasa si se fermenta o se seca. Hay miles de flores comestibles y vamos por las primeras.
>
> Lo llevan Arán y Noé. Se conocieron estudiando en Alcalá, coincidieron en Ramón Freixa, y aquí cocinan y sirven los dos.

De cuatro párrafos de manifiesto + tres de visión + cuatro de filosofía (once en total) a **tres frases**. Todo lo que se cae, se cae porque no ayudaba a grabar.

---

# 12 · LO PRÁCTICO

**Función:** logística y la invitación. Sin sección propia para la invitación: va aquí dentro, donde corresponde.

**Layout:** filas clave-valor, como el bloque de contacto actual, que está bien resuelto. La invitación va en las dos últimas filas, con filete de separación.

### Copy

> ## Lo práctico
>
> **Dónde** — C. del Azulejo, 2. Fuente del Berro, 28028 Madrid.
> **Cuándo** — Jueves a domingo. Dos servicios, 14:00 y 21:00. Dura dos horas.
> **La sala** — Dieciséis asientos: ocho en la barra, una mesa de cuatro y dos de dos. Si vienes a grabar, pide barra al reservar.
> **El menú** — Quince pases, 85 €. Seis copas por 60 € más, o la versión sin alcohol con seis fermentos de la casa.
>
> ---
>
> **La invitación** — El menú de quince pases corre de nuestra cuenta, y se acuerda antes por DM. El acompañante paga el suyo y las bebidas van aparte.
>
> **Lo que grabes es cosa tuya.** Sin mínimo, sin aprobación previa y sin etiquetas obligatorias. Esta página está para que te salga bien, no para pedirte nada.

### Las tres decisiones que hay detrás de ese texto

1. **No promete.** «Se acuerda antes por DM» deja la puerta abierta sin que nadie se presente a cobrar el menú.
2. **Dice que el acompañante paga, con todas las letras.** Casi nadie graba solo. El momento incómodo al pedir la cuenta es lo que rompe la relación con un creador, y se evita con una frase.
3. **Dice que no se pide nada.** Es **lo más valioso de toda la página**. Un sitio que invita y no exige ni mínimo ni aprobación previa es raro, y es la prueba de que esto es una guía y no un brief de cliente. Sin ella, los doce bloques anteriores se leen como instrucciones de marca; con ella, como consejos.

*(Es la única negación autorizada de la página: aquí la negación es el mensaje.)*

---

# 13 · CIERRE ÚTIL

**Función:** ocupar la posición más memorable con algo utilizable. Cerrar el bucle numérico del bloque 01.

**Layout:** centrado. Recuento de lo marcado + botón de DM + línea de guardado. Sin firma de marca.

### Copy

> ## Te llevas
>
> `⟨4 de 6 momentos marcados⟩`
> *(si no marcó nada: «Seis momentos, tres planos y treinta y dos flores.»)*
>
> `[ Escríbenos por DM ]`
>
> Guarda esta página. Cambia con la carta: la siguiente entra en ⟨mes⟩.

**Lo que desaparece:** «Abre la cámara antes de venir. / Pipilacha». Es la firma en el sitio de más memoria de la pieza. El wordmark ya está en el `<title>`, en la OG y en el correo — no necesita también el último píxel.

**El DM prerredactado** abre Instagram con el texto puesto: fecha aproximada, número de personas y si necesita barra. Quita la fricción de escribir el primer mensaje, que es donde se pierden.

---

## Resumen de la reescritura

| | Antes | Ahora |
|---|---|---|
| Bloques | 15 escenas + 3 figuras | 13 bloques + 3 figuras |
| Altura móvil | 18,8 pantallas | ~14 |
| Primer contenido útil | pantalla 4,5 | **pantalla 0,9** |
| Superficie accionable | 39 % | ~85 % |
| Elementos copiables | 0 | ~40 |
| Navegación en móvil | ninguna | barra fija de 5 saltos |
| Párrafos sobre la casa | 11 | **3** |
| Cierres en aforismo | 10 de 10 tarjetas | máx. 1 de cada 3 |
| Negro | 0 (y un hex fantasma publicado) | 1 aparición, bloque 04 |
| Palabras de la lista negra | 1 (`territorio`) | 0 |

---

## Antes de escribir código

**Resuelto:**
- ~~Sabores de las flores~~ → salen del Drive. Las 34 entradas están arriba.
- ~~Mes de la próxima carta~~ → octubre, menú de otoño, todavía sin diseñar. El bloque 13 dice **«la siguiente entra en octubre»** y el bloque 10 («el pase que nadie ha grabado») se queda fechado en agosto hasta entonces.

**Nada bloquea ya la implementación.** Los seis desajustes del bloque 08 se pueden resolver mientras se escribe el código: afectan a `menu.js`, no a la estructura de la página. El diccionario funciona con las 34 entradas tal cual.

**Pendiente, no bloqueante:**
- ⟨**Pack de fotos en alta**⟩ — si existe, sustituye al dossier de prensa, que en una página de creadores está fuera de sitio.
- ⟨**Texto del DM prerredactado**⟩ — lo propongo yo salvo que prefieras escribirlo.

Orden de implementación, el de prioridad ALTA del documento de estrategia: reordenar → escaleta → copiar de un toque → navegación móvil → diccionario → limpiar los bloques que se van.
