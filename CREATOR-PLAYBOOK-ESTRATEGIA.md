# Creator Playbook · Pipilacha
## Documento estratégico previo al rediseño

Fecha: 2026-08-01
Estado: estrategia para aprobar. Sin código.
Base analizada: `/creator-garden/` en vivo (Netlify), medida a 375 px + los cuatro archivos fuente.

---

## 0. Diagnóstico en una frase

**La página está ordenada por lo que Pipilacha quiere decir. Un playbook se ordena por el momento en que el creador lo necesita.**

Tres cifras medidas en la página en vivo, no impresiones:

| Medida | Valor | Qué significa |
|---|---|---|
| Altura en móvil | 15.252 px = **18,8 pantallas** | Nadie llega al final |
| Primer contenido útil para grabar | píxel **3.697** = **pantalla 4,5** | Cuatro pantallas y media hablando de la casa antes de la primera instrucción |
| Espacio dedicado a herramienta vs. a marca | **39 % / 30 %** (resto: fotos, contacto, cierre) | La herramienta no domina la página |

Y la cifra que resume todo:

> **La sección «Ideas» —lo único que un creador se lleva puesto— es la sección de contenido más corta de la página: 521 px.
> La sección «Identidad» —paleta hex, tipografías, materiales— ocupa 1.544 px.
> El brand kit tiene tres veces más superficie que las ideas de contenido.**

Eso es exactamente lo que pediste no tener.

---

## 1. Auditoría completa

### 1.1 Estrategia — el error de raíz

La página está construida como un **dosier de marca con anexo para creadores**. La estructura lo dice sola:

```
Apertura → Manifiesto → Visión → foto → Filosofía → GUÍA → …
   0,0        1,0         1,9     2,8      3,5      4,5 pantallas
```

Cinco escenas de marca antes de la primera línea accionable. El creador que abre el DM en el sofá, en móvil, con treinta segundos de atención, **abandona antes de llegar a lo que le sirve**.

Peor: las cinco escenas de apertura no son malas. Están bien escritas. Ese es el problema — son lo bastante buenas como para que nadie las haya quitado.

**Un creador no necesita entender Pipilacha para grabarlo bien. Necesita saber qué pasa en la sala y cuándo.** La comprensión de la marca es consecuencia de las instrucciones, no requisito previo.

### 1.2 El activo mejor de la página está usado como papel pintado

Las **32 flores** de `Solsticio floral` son el material más valioso que tiene la casa: un vocabulario de sabores que ningún otro restaurante puede dar. Ahora mismo se renderizan como una nube de palabras decorativa en tamaños alternos, en la única escena musgo, **sin una sola palabra de información al lado**.

`guisante mariposa · flor eléctrica · margarita · hisopo…`

Un creador ve treinta y dos nombres bonitos y no puede hacer nada con ellos. Con una línea por flor —a qué sabe, en qué pase sale, qué decir a cámara— eso mismo se convierte en el bloque que hace que guarde la página.

**Se está gastando la única escena oscura de la página, el mayor pico visual disponible, en decoración.**

### 1.3 Contenido que no es para este lector

| Bloque | Superficie | Para quién es realmente |
|---|---|---|
| Movimiento — «cómo se mueve la marca» | 865 px | Un diseñador web. Habla de `expo.out`, de entradas y salidas, del scroll de esta página. |
| Identidad — paleta + tipografías + materiales | 1.544 px | Un estudio de diseño. Un creador no va a usar Marcellus ni el hex del oliva. |
| Filosofía — «cómo se piensa un plato» | 813 px | Un periodista gastronómico. |
| Dossier de prensa (único descargable) | — | Prensa. **En una página para creadores es un error de categoría.** |

Son **3.222 px = casi 4 pantallas** de material dirigido a otro lector. Más el descargable equivocado.

Detalle grave dentro de ese bloque: la paleta publica `#0B0B09 · Vacío · fondo de las escenas oscuras`. **Ese valor sobró de la versión negra que se descartó y no es un token de marca.** Se está publicando un color que la marca no usa, en la sección que dice ser la referencia de identidad.

### 1.4 UX — el fallo más caro

**El público es mayoritariamente móvil. La navegación existe solo en escritorio.**

```css
.gd-spine { display: none; }
.gd-index { display: none; }
@media (min-width: 760px) { /* aquí aparecen */ }
```

Un creador en móvil tiene **18,8 pantallas de scroll continuo sin un solo punto de orientación, sin índice, sin ancla, sin saber cuánto queda**. Y no puede volver a un bloque concreto: la segunda visita —la que la página quiere provocar— obliga a rebuscar a dedo.

Es un fallo estructural, no un detalle: la página está pensada para reabrirse y no ofrece ninguna forma de volver a un sitio.

### 1.5 UX — nada se puede usar

Los pies de foto (`captions`) están escritos para copiarse y pegarse en Instagram. **No se pueden copiar de un toque.** Los ganchos, igual. La escaleta mental que la página propone no se puede marcar.

> Un caption que no se puede copiar no es un caption. Es una muestra.

No hay guardado, no hay copia al portapapeles, no hay descarga útil, no hay nada que sobreviva a cerrar la pestaña. La página pide que la guardes y no da ni un mecanismo para hacerlo.

### 1.6 El final está desperdiciado

La página termina así:

```
«Abre la cámara antes de venir.»
Pipilacha
```

La **posición más memorable de toda la pieza** —el efecto pico-final es literalmente el último recuerdo— está gastada en una firma de marca. El creador cierra el navegador con el logotipo en la cabeza en lugar de con tres ideas y un botón para escribir por DM.

### 1.7 Auditoría de olor a IA — brutal, como pediste

La página **sí huele a IA**, y se puede señalar exactamente dónde. No es una impresión: son cuatro patrones medibles.

**a) El titular viola la regla de marca y es el tic número uno de los modelos.**

> `La flor no decora. Es el plato.`

Construcción *«No es X. Es Y.»*. Está en el H1, y se repite por toda la página al menos ocho veces:

- «El plato no se diseña y luego se decora. Se empieza por…»
- «No es un número de marketing: es el aforo…»
- «Aquí la flor no está por bonita: está porque…»
- «Eso no es un estilo de cocina. Es un territorio sin mapa…»
- «Aquí la flor no decora: es el plato.» (otra vez, en los hooks)

Además incumple la norma editorial de la casa: **nunca abrir diciendo lo que Pipilacha no es.** El primer enunciado de la página entera es una negación.

**b) Todas las tarjetas cierran con aforismo. Todas.**

Revisadas una a una las seis de «Historias» y las cuatro de «Cámara»: **10 de 10 terminan en una frase-sentencia portable.**

> «…y eso se ve.» · «Esa conversación es material.» · «Es la reacción más honesta de todo el menú.» · «Si dudas del plano, ese es el plano.» · «…le quita valor.» · «Es la parte que nadie enseña porque no está en el plato.»

Una a una son buenas. Diez seguidas con el mismo ritmo son una firma de máquina. **Un humano deja frases que simplemente terminan.** La uniformidad es el delator, no las frases.

**c) Metáfora doble y palabra prohibida, en vivo.**

> «Eso no es un estilo de cocina. Es un **territorio** sin mapa, y la carta es el cuaderno de campo.»

`territorio` está en la lista negra de la marca («muy usado en gastronomía española»). Y encima encadena dos metáforas —territorio sin mapa + cuaderno de campo— en catorce palabras. Es el cierre de párrafo que escribe un modelo cuando quiere sonar profundo.

**d) Los ganchos no son ganchos.**

El propio archivo lo escribe en un comentario y luego se lo salta:

```js
/* Los buenos abren una pregunta o prometen una sensación física;
   los que solo informan (un aforo, una espera) no paran el scroll de nadie. */
export const hooks = [
  …
  'Treinta y dos flores en un solo menú.',      // informa
  'Quince platos y en todos manda una flor.',   // informa
  'No hay otro restaurante así en el mundo.',   // informa, y presume
];
```

Tres de siete son datos, no ganchos. El archivo se contradice a sí mismo en veinte líneas.

**Veredicto:** el vocabulario está bien; lo que delata a la máquina es **la métrica constante**. Frases de longitud parecida, cierres de idéntica forma, tricolon recurrente («Fermentar, secar, hacer harina de flor»). La corrección es rítmica, no léxica: romper la simetría, dejar frases sin remate, permitir una lista de dos y una de cinco.

### 1.8 Dos errores de dato que hay que resolver antes de tocar nada

1. **El correo.** La página publica `info@pipilacha.es`. La ficha operativa de la marca dice `admin@pipilacha.es`. En una pieza cuya única conversión es un correo, que el correo esté mal es fatal. **Verificar cuál es el bueno.**
2. **La carta.** `menu.js` dice `Solsticio floral` (32 flores). La ficha de la skill de marca sigue diciendo «Despertar de las Flores, primavera». La web es la fuente correcta; la ficha está caducada y conviene actualizarla.

### 1.9 Lo que está bien y no se toca

Para que quede claro que esto no es tierra quemada:

- **El sistema visual.** Crema, musgo una sola vez, cero negro, fotos como único color. Es correcto y es la marca. Se conserva entero.
- **El motor de movimiento.** `garden.js` está bien construido: contexto GSAP, `prefers-reduced-motion` sin crear tweens, partición tipográfica después de `fonts.ready`. No se reescribe.
- **La disciplina de una familia de layout por escena.** Es lo que evita que parezca una plantilla. Se mantiene como regla.
- **Que el contenido viva en `creatorGarden.js` y los pases se importen de `menu.js`.** Es lo que impide que la página se desincronice de la carta. Se amplía, no se sustituye.
- **Las fotos.** Son excelentes y están bien tratadas: a sangre, pie debajo, nunca texto encima.

**El problema no es la ejecución. Es qué se está ejecutando.**

---

## 2. Qué eliminaría

| Bloque | Píxeles recuperados | Motivo |
|---|---|---|
| **Movimiento** (principios de animación) | 865 | Dirigido a un diseñador web. Cero utilidad con un móvil en la mano. |
| **Identidad**: paleta hex + muestrario tipográfico | ~1.000 | Es un brand kit. Pediste explícitamente que no lo fuera. Además publica un hex que la marca no usa. |
| **Filosofía** como escena independiente | 813 | Su contenido útil son dos frases; se absorben donde hacen falta. |
| **Dossier de prensa** como único descargable | — | Material de prensa en una página de creadores. Se sustituye. |
| **El cierre** «Abre la cámara antes de venir. / Pipilacha» | 370 | Ocupa la posición más memorable con una firma. |
| **Las 32 flores como nube decorativa** | 616 | No se elimina el contenido: se elimina el uso decorativo. |
| **Índice lateral solo-escritorio** | — | Se conserva la función, se elimina esta implementación. |

**Total recuperado: ~3.700 px = 4,5 pantallas.** Justo el tramo que hoy separa al lector de la primera instrucción útil.

De `materiales` sobreviven dos líneas —cerámica mate y piedra/madera— porque **sí** afectan a cómo se fotografía. Bajan a la ficha técnica de fotografía. El delantal verde y la libélula se van.

---

## 3. Qué fusionaría

**Manifiesto + Visión + Filosofía → un solo bloque de tres frases, y con un trabajo que hacer.**
No puede ser «quiénes somos». Tiene que darle al creador **la frase que va a decir a cámara**. Si el bloque no produce eso, sobra. Tres frases, tope. Es la única parte de la página que habla de la casa.

**Cámara (foto) + Cámara (vídeo) + «cómo grabar con móvil» + B-roll + sonido → un solo bloque: «Planos».**
Todo el mundo graba con móvil; hacer de eso una sección implica que no. El sonido sí merece fila propia dentro del bloque: **la sala suena a conversación, no a música alta, y eso casi nadie lo aprovecha.**

**Hooks + primeras frases → lo mismo.** Son la misma cosa con dos nombres.

**Reels + TikTok + Stories + Shorts → un bloque «Formatos», filtrable.**
Cuatro secciones para cuatro variantes del mismo vídeo vertical es inflar el índice, no dar más contenido. Una tabla corta de diferencias reales (duración, portada, texto en pantalla, dónde va el gancho) resuelve las cuatro.

**Errores frecuentes + qué NO grabar → «Lo que no funciona».** Un solo bloque negativo, colocado tarde y corto.

---

## 4. Qué crearía desde cero

### 4.1 La escaleta del servicio — el corazón de la página

**El bloque que justifica el rediseño entero.**

Hoy la página dice *qué* mirar («Las pinzas», «La primera vez»). No dice **cuándo**. Y en un menú de quince pases con dos servicios, el cuándo lo es todo: si no tienes la cámara lista, el momento pasó.

Y aquí está el hallazgo que cambia la pieza:

> **El mejor plano del servicio ocurre en el pase 01.**
> El primer pase se llama «Pipilacha» y lleva flor eléctrica: adormece el paladar unos segundos. La cara de alguien probándola por primera vez es la reacción más grabable de todo el menú — **y pasa antes de que hayas terminado de sentarte.**

Eso es una instrucción que solo Pipilacha puede dar, es concreta, es urgente, y hoy está enterrada en una tarjeta en la pantalla 8 sin ninguna referencia temporal. En la escaleta va la primera y en grande.

Estructura: **seis momentos en orden de servicio**, cada uno con qué pasa, qué plano, y cuánto dura la ventana.

| # | Momento | Ventana | Plano |
|---|---|---|---|
| 00 | La sala vacía antes del primer servicio | Solo si llegas pronto | Dieciséis sillas, plano general |
| 01 | **Flor eléctrica, pase 01** | **Segundos. Cámara lista antes de sentarte.** | Cara, no plato |
| 02 | Degustación floral: cinco flores, una a una | ~3 min | Cenital, una por corte |
| 05 | El farolillo — el cuenco es la flor | Al servirlo | Forma antes que nombre |
| — | Montaje con pinzas desde la barra | Varias veces si estás en barra | Manos, plano medio corto |
| 10 | Higo negro + helado de saúco | Al servirlo | Contraste, funciona sin texto |

Interactiva: casillas marcables que **persisten al cerrar** (`localStorage`). Reconocimiento en vez de memoria, y una razón mecánica para reabrir la página **dentro del restaurante**.

### 4.2 Modo exprés — «Si solo tienes 20 minutos»

Tres tomas. Una pantalla. Sin scroll. Un botón arriba del todo que salta aquí.

Es el bloque para el creador que llega tarde, con la batería al 12 %, y que si no encuentra algo utilizable en diez segundos cierra la pestaña. Existe para rescatar esa visita.

### 4.3 El diccionario de sabor — 32 flores que sirven para algo

Las mismas treinta y dos flores, con tres datos cada una:

> **capuchina** → pica como un rábano suave → pase 08, ajoblanco → *«esto pica, y es una flor»*
> **flor eléctrica** → adormece la lengua unos segundos → pase 01 → *«espera tres segundos»*
> **saúco** → floral y ligeramente vinoso, frío → pase 10, con el higo → *«esto va helado»*

Filtro por pase y buscador. **Este es el bloque que hace que guarden la página**, porque es lo único que no pueden conseguir en ningún otro sitio y no se pueden inventar delante de la cámara. Va en la escena musgo: el único pico visual de la página, gastado por fin en su mejor material.

### 4.4 La regla de tres — contar Pipilacha sin quemar los quince pases

Pediste esto explícitamente y **no lo está haciendo ningún restaurante**. La tensión es real: el creador quiere enseñarlo todo; enseñarlo todo destruye el motivo por el que alguien reserva.

La respuesta cabe en una regla:

> **Un desvelo. Un gesto. Una reacción. Lo demás queda fuera de cuadro.**
> Un desvelo: el plato que no esperabas (el cuenco que se come).
> Un gesto: manos, pinzas, fuego.
> Una reacción: una cara.
> Tres planos aguantan un vídeo entero y dejan doce pases sin contar.

Es honesto por las dos partes: al creador le da estructura y menos trabajo de edición; a la casa le protege la carta. **Y le da al creador algo que decir en el vídeo:** «no te voy a enseñar los quince».

Es el bloque más citable de la página y el que hace que se la pasen a otro creador.

### 4.5 El pase que nadie ha grabado

Un solo bloque, corto, con fecha visible:

> **Agosto 2026 — todavía nadie ha grabado el pase 15: calabacín y crisantemos.**
> El crisantemo es amargo y herbal, y retiene el dulzor del calabacín asado. Está al final del menú, cuando ya nadie tiene el móvil en la mano.

Exclusividad real, cero coste, y **un motivo para volver a abrir la página cada estación**. Se cambia editando una línea en `creatorGarden.js`. No lo hace nadie.

### 4.6 Copiar de un toque

No es una sección: es una capacidad que cruza toda la página. Cada gancho, cada caption, cada nombre de flor con su sabor, con un botón de copiar. Confirmación instantánea.

Es la mejora de mayor retorno de todo el documento. Convierte la página de lectura en herramienta con una línea de JavaScript.

### 4.7 Cierre útil

Sustituye a la firma. Tres cosas y nada más:

1. Las tres ideas que te llevas (las que hayas marcado en la escaleta, si marcaste).
2. Un botón de DM que ya lleva el texto escrito.
3. «Guarda esta página: la actualizamos cada estación.»

---

## 5. Nueva arquitectura completa

Trece bloques. **Todo lo accionable está en las primeras cinco pantallas.**

```
┌─ PANTALLA 0 ─────────────────────────────────────────────┐
 01 · APERTURA
    Foto a sangre + titular + promesa numérica + dos botones
    «Tengo 20 minutos» ·  «Ir a la escaleta»
└──────────────────────────────────────────────────────────┘
 02 · MODO EXPRÉS            3 tomas, una pantalla, sin scroll
 03 · LA ESCALETA            6 momentos en orden de servicio · marcable
 ── foto: farolillo ──
 04 · LA REGLA DE TRES       cómo contarlo sin quemar el menú
 05 · PLANOS                 foto · vídeo · sonido · móvil · B-roll
 ── foto: higo ──
 06 · FORMATOS               Reel / TikTok / Stories / Shorts · filtrable
 07 · GANCHOS Y CAPTIONS     copiables de un toque
 08 · DICCIONARIO DE SABOR   32 flores · escena musgo · buscador
 ── foto: vieiras ──
 09 · LO QUE NO FUNCIONA     errores y qué no grabar · corto
 10 · EL PASE QUE NADIE HA GRABADO   fechado, rotativo
 11 · LA CASA EN TRES FRASES tres frases. la única parte sobre Pipilacha
 12 · LOGÍSTICA              horario, aforo, dónde, qué avisar
 13 · CIERRE ÚTIL            tus ideas · DM prerredactado · guarda la página
```

### Los cambios que importan

**La marca baja al puesto 11.** No desaparece: deja de ser peaje. Un creador que ya tiene sus ideas y lee tres frases sobre la casa las lee con interés, no con impaciencia. **Al final se recuerdan mejor que al principio, porque llegan después de que la página se haya ganado el derecho.**

**La escaleta es el puesto 3.** El bloque más útil, casi arriba. Y con la única razón real para reabrir la página *dentro* del restaurante.

**La escena musgo pasa de decoración a diccionario.** Único pico visual, mejor contenido.

**Tres pantallas menos y más contenido accionable:**

| | Ahora | Propuesta |
|---|---|---|
| Altura móvil | 18,8 pantallas | ~14 pantallas |
| Primer contenido útil | pantalla 4,5 | **pantalla 0,9** |
| Superficie accionable | 39 % | **~85 %** |
| Navegación en móvil | ninguna | barra fija + dos saltos en el hero |
| Elementos copiables | 0 | ~40 |

**Más herramienta, menos página.**

### Sobre las 24 secciones que pediste

Las pediste como *preguntas que hay que responder*, y las respondo todas. Pero **no como 24 secciones**: veinticuatro títulos en un móvil es un índice que nadie termina, y trocear «cómo grabar para TikTok / para Reels / para Shorts» en tres bloques repite el 80 % del texto tres veces. Se responden dentro de los trece bloques de arriba, con más densidad y menos navegación.

Si prefieres verlas como secciones separadas, dilo y lo reorganizo — pero mi recomendación es esta.

---

## 6. Justificación UX

**Un playbook se usa en tres momentos distintos, y la página solo sirve a uno.**

| Momento | Dónde está | Cuánto tiempo | Qué necesita |
|---|---|---|---|
| **Antes** | Sofá, DM recién abierto | 2 min | Decidir que merece la pena + salir con dos ideas |
| **Durante** | En la sala, entre pases | 30 s, una mano, poca luz | Qué grabo **ahora** |
| **Después** | Editando, de madrugada | 5 min | Gancho, caption, qué no decir |

La página actual solo sirve el «antes», y a medias. **El «durante» no está contemplado en ninguna parte — y es el momento que decide si el contenido sale bien.** La escaleta marcable y el diccionario existen para eso.

Ese es el cambio de fondo: **de una página que se lee una vez a una página que se abre tres.** Y ahí está la respuesta a «quiero guardar esta página»: se guarda lo que se va a reabrir, no lo que gustó.

Consecuencias concretas:

- **Barra de navegación fija en móvil.** Cinco saltos, no trece. El fallo más caro que tiene la página hoy.
- **Objetivos táctiles grandes.** El «durante» se usa con una mano y sin mirar.
- **Ritmo por cambio de formato, no por cambio de tema.** Escaleta (lista marcable) → regla (tres frases enormes) → planos (dos columnas) → formatos (tabla) → ganchos (citas) → diccionario (rejilla oscura). Se mantiene la regla de una familia de layout por escena: es lo que impide que parezca plantilla.
- **Las tres fotos a sangre se quedan** exactamente donde están funcionalmente: son los microdescansos entre bloques densos. Es lo mejor que tiene la página hoy.
- **Nada tapado que dependa de animarse para destaparse.** Estado base visible, como el resto del sitio.

---

## 7. Justificación psicológica

| Principio | Dónde | Por qué ahí |
|---|---|---|
| **Curiosity gap** | «El pase que nadie ha grabado» | Un hueco identificado y fechado pide ser llenado. Es el bloque que provoca la reserva. |
| **Open loop** | El hero promete un número («seis momentos, tres planos, treinta y dos flores») | Abre un contador que solo cierra el bloque 13. |
| **Peak-End** | Pico = diccionario en musgo. Final = tus ideas + DM. | Hoy el final es una firma: la posición más memorable, desperdiciada. |
| **Reciprocidad** | Captions copiables, diccionario, escaleta — todo antes de pedir nada | La página da trabajo hecho antes de pedir un correo. Se pide en el bloque 13, no antes. |
| **Anticipación** | La escaleta nombra momentos pero no los desvela enteros | «Esto lo verás» funciona mejor que enseñarlo. Además protege la carta. |
| **Facilidad cognitiva** | Una idea por tarjeta, forma fija, longitud fija | Deja de haber tarjetas de tres líneas junto a otras de siete. |
| **Reconocimiento > recuerdo** | Casillas marcables en vez de consejos memorizables | En la sala nadie recuerda un párrafo leído hace tres días. Reconoce una lista. |
| **Recompensa inmediata** | Copiar al portapapeles con confirmación | Micro-recompensa que crea el hábito de volver. |
| **Escaneabilidad** | 13 bloques, no 24 | Un índice que se abarca de un vistazo se usa; uno de veinticuatro se ignora. |
| **Efecto Zeigarnik** | Escaleta a medio marcar | Una lista empezada y sin terminar tira de la vuelta. |

---

## 8. Justificación de branding

**La marca gana bajando al puesto 11.** Un manifiesto en la pantalla 1 se lee como marca hablando de sí misma; tres frases en la pantalla 11, después de que la página haya sido útil, se leen como contexto ganado.

**La autoridad de Pipilacha es la precisión, no el discurso.** «La capuchina pica como un rábano suave» convence a un creador; «un ingrediente que casi nadie ha cocinado» no. La arquitectura nueva pone la precisión delante y el discurso detrás. Es más fiel a la voz de la casa que la versión actual.

**Correcciones editoriales obligatorias:**

1. **Fuera `territorio`** — está en la lista negra y está publicado.
2. **El H1 no puede abrir con una negación.** Rompe la norma «nunca empezar diciendo lo que Pipilacha no es» y es el tic de IA número uno. Sustituto en la línea de: *«Quince pases. En todos manda una flor.»* — afirma, es concreto y da un dato utilizable en el primer segundo.
3. **Romper la simetría rítmica.** Regla operativa: **como mucho un cierre en aforismo de cada tres tarjetas.** Las otras dos terminan sin más.
4. **Ganchos reescritos.** Fuera los tres que solo informan; los ganchos abren una pregunta o prometen una sensación física.
5. **Palabras a vigilar en el material nuevo:** experiencia, alta cocina, botánico, temporada, km0, sostenibilidad, obsesión, pasión, propuesta, concepto, viaje, producto, artesanal. La versión actual está limpia salvo `territorio`; el material nuevo hay que auditarlo igual.

**Y una advertencia de marca que va contra parte de tu encargo — lee el punto 12.**

---

## 9. Justificación para creadores

Un creador con audiencia real evalúa una página así en dos preguntas:

**«¿Esto me ahorra trabajo?»** Hoy: no. Le da contexto que él ya sabe convertir en contenido. Con la escaleta, el diccionario y los captions copiables: sí, y de forma medible — le ahorra la parte más lenta, que es decidir qué grabar mientras está comiendo.

**«¿Esto me da algo que otro no tiene?»** Hoy: a medias. La ventaja competitiva de Pipilacha para un creador es **el dato de sabor**: nadie más puede decirle que el crisantemo es amargo y herbal y por qué eso funciona con el calabacín asado. Ese dato está hoy repartido en tres frases sueltas; en el diccionario es un activo entero.

Y lo que hace que la recomiende a otro creador no es la escaleta —es la **regla de tres**. Es el único bloque que enseña un principio transferible: *un desvelo, un gesto, una reacción*. Funciona en cualquier restaurante. Que sea útil fuera de Pipilacha es exactamente lo que la hace citable.

---

## 10. Prioridad por impacto

### ALTO — sin esto no hay playbook

| # | Acción | Por qué |
|---|---|---|
| A1 | **Reordenar: accionable antes de pantalla 1** | El fallo de raíz. Sin esto, todo lo demás se lee tarde o no se lee. |
| A2 | **Crear la escaleta del servicio** (marcable, con el pase 01 primero) | El bloque que convierte la página en herramienta y la hace reabrirse. |
| A3 | **Copiar de un toque en ganchos y captions** | Máximo retorno por esfuerzo de toda la lista. |
| A4 | **Navegación fija en móvil** | 18,8 pantallas sin orientación en el dispositivo del 90 % del público. |
| A5 | **Diccionario de sabor** en la escena musgo | El mejor activo de la casa, hoy usado como decoración. |
| A6 | **Eliminar Movimiento + brand kit + dossier de prensa** | 4,5 pantallas de material para otro lector. |
| A7 | **Arreglar el correo y el hex fantasma** | Un correo mal en la única conversión de la página. |

### MEDIO — es lo que la separa de una guía correcta

| # | Acción |
|---|---|
| M1 | **La regla de tres** — el bloque citable |
| M2 | **Modo exprés** — rescata la visita apurada |
| M3 | **Reescritura anti-IA**: H1 afirmativo, fuera `territorio`, romper el ritmo, ganchos nuevos |
| M4 | **Formatos en tabla comparativa** en vez de cuatro secciones |
| M5 | **Cierre útil** en lugar de la firma |
| M6 | **«Lo que no funciona»** — bloque negativo, corto y tarde |

### BAJO — se nota, no decide

| # | Acción |
|---|---|
| B1 | **El pase que nadie ha grabado** (barato, pero depende de mantenerlo cada estación) |
| B2 | Progreso de lectura ligado a la escaleta |
| B3 | Estado guardado visible al reabrir («marcaste 4 de 6») |
| B4 | Microanimación al copiar |
| B5 | Versión en inglés — solo si llegan creadores internacionales |

---

## 11. Ideas que no está usando ningún restaurante

Once, ordenadas por lo que aportan de verdad.

**1 · La escaleta con ventana temporal.**
Nadie dice *cuándo*. Los media kits dicen qué hay; ninguno dice «esto dura tres segundos y pasa en el pase uno». Convierte la página en algo que se abre **dentro** del restaurante — territorio que ninguna marca gastronómica ocupa.

**2 · La regla de tres — permiso explícito para no enseñarlo todo.**
Todos los restaurantes quieren cobertura máxima y todos se queman el menú. Decirle a un creador «enseña tres planos y deja doce pases fuera» es contraintuitivo, protege la carta, le ahorra edición **y le da algo que decir en el vídeo**. No lo hace nadie porque nadie se atreve a pedir menos.

**3 · El diccionario de sabor como activo de contenido.**
Ningún restaurante publica su vocabulario de sabores en formato utilizable. Pipilacha tiene treinta y dos entradas que nadie más puede escribir.

**4 · El hueco fechado.**
«Nadie ha grabado todavía el pase 15.» Escasez real, verificable, renovable cada estación. Es una idea de producto, no de marketing.

**5 · El sonido como material.**
La sala suena a conversación, no a música. Dieciséis personas y dos cocineros que hablan. **Nadie le dice a un creador que grabe ambiente** — y es lo que distingue un vídeo de restaurante pequeño de uno de restaurante grande.

**6 · La barra como plano exclusivo.**
Ocho de dieciséis asientos miran a la cocina. Eso es un plano que solo existe si te sientas ahí. Convertirlo en una petición concreta al reservar («si vienes a grabar, pide barra») es información operativa que ninguna página de creadores da.

**7 · Captions con fecha de caducidad.**
La carta se rehace entera cada estación. Un caption que dice «esto está en carta hasta noviembre» le da al creador urgencia prestada. Se marca con la fecha real de la carta vigente.

**8 · El playbook como pieza viva.**
«Actualizada en agosto de 2026 · próxima carta, noviembre.» Una fecha visible convierte un enlace guardado en una suscripción sin formulario.

**9 · Crédito reversible.**
Decir en la página qué hace la casa con el contenido: si se republica, se acredita, y cómo. Es la pregunta que todo creador tiene y que ninguna marca contesta por escrito. Requiere que decidáis la política — ver punto 13.

**10 · El DM prerredactado.**
Botón que abre el DM con el texto puesto: fecha, número de personas, si necesita barra. Elimina la fricción real de escribir el primer mensaje.

**11 · Modo una mano.**
Los bloques del «durante» diseñados para pulgar, con poca luz y sin sonido. Nadie diseña para el momento en que se está usando de verdad.

---

## 12. Lo que no recomiendo hacer

Pediste esto, y mi trabajo es decirte por qué creo que resta.

**«Cómo conseguir más retención», «cómo crear intriga», «cómo cerrar un Reel» como lecciones generales.**

En el momento en que Pipilacha explica retención en abstracto, la página deja de sonar a creador y suena a marca dando clase. Y el lector objetivo **sabe más de retención que el restaurante**: es literalmente su oficio. Es el camino más rápido a perder credibilidad, justo lo contrario de lo que pediste.

La autoridad de Pipilacha termina en la puerta de su comedor. Dentro, es total: nadie sabe mejor qué pasa en el pase 01.

**Alternativa —y responde a la misma pregunta—:** enseñar retención **solo a través de material propio**, nunca como principio.

> No: «los primeros tres segundos deben abrir un bucle de curiosidad».
> Sí: «El higo sale negro de la brasa. Nadie espera que eso sea un postre. Ese es tu segundo tres.»

Misma lección, cero condescendencia, y solo la puede escribir Pipilacha. Todo lo que pediste sobre intriga, cierre y retención se puede entregar así — repartido por la escaleta y por «Planos», sin un solo bloque de teoría.

**Segunda advertencia, menor:** cuidado con que el playbook parezca un contrato. Cuanta más regla ponga la página, más se lee como brief de cliente y menos como guía de un creador a otro. La regla de tres funciona porque es útil para él; una lista de exigencias de marca —hashtags obligatorios, etiquetas, aprobación previa— hundiría el tono entero. Si hay requisitos, van al final, cortos y como logística, nunca como sección propia.

---

## 13. Decisiones — RESUELTAS 2026-08-01

1. **Correo:** `info@pipilacha.es`. La página estaba bien; la ficha de la skill de marca (`admin@`) está caducada y hay que corregirla.
2. **Negro:** se usa, pero muy poco. Se trata como **tinta escasa, no como fondo**: una sola aparición en toda la página, en «La regla de tres» — el bloque más citable. No se resucita `#0B0B09`.
3. **Invitación:** **sí.** Los quince pases, **para una persona**. **Se acuerda caso por caso por DM** — la página no la promete. **Sin contrapartida pactada.**
4. **Material descargable:** pendiente. Si existe un pack de fotos en alta de los pases, es el segundo mejor motivo para guardar la página después del diccionario.

### Lo que cambia en el texto por la invitación

La combinación elegida —invita, pero solo al creador, se acuerda antes y no pide nada— obliga a tres cosas:

- **No prometer.** Nada de «te invitamos». La página dice que existe y que se habla antes. Si la promete, aparece gente a cobrar el menú.
- **Decir que el acompañante paga, con todas las letras.** Casi nadie graba solo. El momento incómodo al pedir la cuenta es lo que destruye la relación con un creador, y se evita con una frase en la página.
- **Decir que no se pide nada, y decirlo claro.** Es lo más valioso que tiene la pieza. Un restaurante que invita y no exige ni mínimo, ni aprobación previa, ni etiqueta es raro — y es la prueba de que esto es una guía y no un brief. Va en logística, en dos líneas, sin sección propia.

---

## Resumen para decidir

- **El diagnóstico:** buena pieza, lector equivocado. Ejecución sólida al servicio de la estructura de un dosier de marca.
- **El cambio de fondo:** de página que se lee una vez a herramienta que se abre tres — antes, durante y después.
- **El bloque nuevo que lo justifica todo:** la escaleta del servicio, con el pase 01 arriba.
- **El activo desaprovechado:** treinta y dos flores usadas como decoración cuando son el mejor material que tiene la casa.
- **El fallo más caro:** 18,8 pantallas sin navegación en móvil, con público móvil.
- **El olor a IA:** no es el vocabulario, es el ritmo — diez de diez tarjetas cerrando en aforismo, y un H1 construido sobre una negación que además rompe la norma editorial de la casa.
- **Dónde no te sigo:** enseñar retención en abstracto. Se entrega igual, pero a través de los platos.

Si esto te encaja, el siguiente paso es el rediseño bloque a bloque: copy definitivo y layout de cada uno de los trece, para aprobar antes de tocar código.
