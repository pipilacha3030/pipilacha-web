/* ============================================================
   CREATOR PLAYBOOK · contenido
   Todo el texto de /creator-garden/ vive aquí, no en la plantilla.
   Los pases y el diccionario de flores salen de src/data/menu.js:
   al cambiar de carta se tocan los dos archivos y la página se
   actualiza sola.

   La pieza está ordenada por CUÁNDO la necesita el creador, no por
   lo que la casa quiere contar:
     · antes   — sofá, DM recién abierto, dos minutos
     · durante — en la sala, una mano, treinta segundos
     · después — editando, de madrugada
   Todo lo accionable va antes de la primera pantalla. La casa habla
   en el bloque 11, cuando la página ya ha sido útil.

   Voz: directa y precisa. La flor es un ingrediente, no un símbolo.
   Nada abre con una negación (única excepción autorizada: la línea de
   contrapartida en `practico.invitacion`, donde la negación ES el
   mensaje). Como mucho un cierre en aforismo de cada tres tarjetas:
   la simetría rítmica es lo que delata a una máquina, no el vocabulario.
   ============================================================ */

// ---- navegación: solo cinco saltos. Trece no se abarcan de un vistazo ----
export const saltos = [
  { id: 'escaleta',  t: 'Escaleta' },
  { id: 'planos',    t: 'Planos' },
  { id: 'formatos',  t: 'Formatos' },
  { id: 'lenguaje',  t: 'Ganchos' },
  { id: 'flores',    t: 'Flores' },
];

// ---- 01 · apertura ----
export const apertura = {
  eyebrow: 'Playbook · Pipilacha',
  titulo: 'Lo que hay que grabar aquí, en orden.',
  sub: 'Seis momentos, tres planos y treinta y cuatro flores con su sabor apuntado.',
  credito: 'Arriba, pase 05: farolillo de atún y orégano. El cuenco es la flor.',
};

// ---- 02 · modo exprés ----
export const expres = {
  titulo: 'Si solo tienes veinte minutos',
  sub: 'Tres tomas. Con esto ya tienes un vídeo.',
  tomas: [
    { n: '01', t: 'La cara, no el plato', d: 'El primer pase lleva flor eléctrica y adormece la lengua unos segundos. Graba a quien viene contigo mientras la prueba.' },
    { n: '02', t: 'El cuenco que se come', d: 'Pase 05. Enseña la forma antes de decir qué es.' },
    { n: '03', t: 'Las manos', d: 'Desde la barra, montando con pinza. Plano medio corto y sin cortar.' },
  ],
  pie: 'Los tres caben en quince segundos y dejan doce pases sin contar.',
};

// ---- 03 · la escaleta del servicio ----
/* El orden es el del servicio, no el de importancia, porque se usa
   dentro del restaurante. La ventana del pase 01 va en negrita: es el
   mejor plano del menú y se pierde si no tienes la cámara lista antes. */
export const escaleta = {
  titulo: 'La escaleta del servicio',
  sub: 'El menú dura dos horas. Estos son los seis momentos que conviene tener fichados, en el orden en que pasan.',
  momentos: [
    { id: 'sala',      k: 'Antes de sentarte',            v: 'Solo si llegas pronto',
      d: 'La sala vacía: dieciséis sillas y seis metros de barra de iroko. Cuando arranca el servicio ya no se puede repetir.' },
    { id: 'electrica', k: 'Pase 01 · Flor eléctrica',     v: 'Tres segundos, y llega nada más sentarte', urgente: true,
      d: 'Ten la cámara lista antes. La flor eléctrica adormece el paladar unos segundos; lo que hay que grabar es la cara de quien la prueba, no el plato.' },
    { id: 'sabores',   k: 'Pase 02 · Sabores de las flores', v: 'Unos tres minutos',
      d: 'Cinco flores servidas una a una, antes del primer plato caliente. Cenital, un corte por flor. Este bloque se edita solo.' },
    { id: 'farolillo', k: 'Pase 05 · El farolillo',       v: 'Al servirlo',
      d: 'Deja que se vea la forma tres segundos antes de contar que el cuenco es la flor y que se come entero.' },
    { id: 'barra',     k: 'La barra',                     v: 'Varias veces, si te sientas ahí',
      d: 'Ocho de los dieciséis asientos miran a la cocina. Desde ahí salen las manos, el fuego y el pase montándose con pinza. Pídela al reservar.' },
    { id: 'higo',      k: 'Pase 10 · El higo',            v: 'Al servirlo',
      d: 'Sale negro de la brasa y al lado va el helado de saúco, blanco y frío. El contraste funciona sin texto encima.' },
  ],
};

// ---- 04 · la regla de tres ----
export const reglaTres = {
  titulo: 'Cómo contarlo sin quemar los quince pases',
  entrada: 'Un vídeo entero se sostiene con tres planos.',
  lema: ['Un desvelo.', 'Un gesto.', 'Una reacción.'],
  partes: [
    { t: 'Un desvelo', d: 'el plato que no esperabas. El cuenco que se come.' },
    { t: 'Un gesto', d: 'manos, pinzas, fuego.' },
    { t: 'Una reacción', d: 'una cara.' },
  ],
  corte: 'Lo demás se queda fuera de cuadro.',
  pie: 'Tres planos aguantan quince segundos, dejan doce pases sin contar y te dan algo que decir: que no vas a enseñarlo todo.',
};

// ---- 05 · planos ----
export const planos = {
  titulo: 'Planos',
  sub: 'Todo esto está grabado con móvil. Con eso llega.',
  grupos: [
    { h: 'Foto', items: [
      { t: 'Cenital', d: 'Casi todo se emplata para verse desde arriba. Si dudas del plano, ese.' },
      { t: 'Luz de sala', d: 'El flash directo aplasta el color del pétalo. Sube ISO antes de sacarlo.' },
      { t: 'Fondo mate', d: 'La cerámica es clara y sin brillo, y la barra es iroko. No hace falta mantel ni atrezo.' },
      { t: 'Sin saturar', d: 'El color del pétalo ya es ese; subirlo en edición lo vuelve falso.' },
    ] },
    { h: 'Vídeo', items: [
      { t: 'Planos largos', d: 'El emplatado es lento a propósito.' },
      { t: 'La mano en cuadro', d: 'Una pinza colocando una flor da escala sin una sola palabra.' },
      { t: 'Un segundo de más', d: 'Después del primer bocado, no cortes.' },
      { t: 'Vertical y fijo', d: 'La sala es estrecha y el movimiento de cámara aquí resta.' },
    ] },
    { h: 'Sonido', items: [
      { t: 'Graba ambiente', d: 'Dieciséis personas hablando y dos cocineros a dos metros. Aquí no hay música alta que tapar.' },
      { t: 'El emplatado suena', d: 'Pinza, cerámica, brasa. Sirve de capa bajo cualquier corte.' },
      { t: 'Pregunta en voz alta', d: 'Arán y Noé contestan desde la cocina. Esa respuesta es audio utilizable.' },
    ] },
  ],
  broll: 'La estantería de libros y plantas detrás de la barra · las flores en bandeja antes de montarse · los fermentos y kombuchas de la casa · la barra con la mise en place puesta.',
};

// ---- 06 · formatos ----
export const formatos = {
  titulo: 'Formatos',
  sub: 'La misma comida da piezas distintas según dónde vaya.',
  cols: ['Reel', 'TikTok', 'Stories', 'Shorts'],
  filas: [
    { k: 'Duración que aguanta', v: ['15–30 s', '20–45 s', '3–5 tarjetas', '20–40 s'] },
    { k: 'Dónde va el gancho',   v: ['segundo 0, visual', 'segundo 0, hablado', 'primera tarjeta', 'segundo 0, visual'] },
    { k: 'Texto en pantalla',    v: ['poco, arriba', 'mucho, es el formato', 'mucho', 'poco'] },
    { k: 'Qué funciona aquí',    v: ['el desvelo del farolillo', '«adivina a qué sabe»', 'la escaleta en directo', 'el contraste del higo'] },
  ],
};

export const ideas = [
  { f: 'Reel · 15 s', t: 'Adivina cuál se come',
    e: '0–3 s cenital de tres pases, sin decir nada · 3–10 s los nombras uno a uno · 10–15 s desvelas que en los tres la flor es el ingrediente principal.',
    p: 'La pregunta se queda abierta hasta el último segundo.' },
  { f: 'Reel · 30 s', t: 'A qué sabe cada flor',
    e: 'Un corte por flor con el sabor en texto: capuchina/rábano, farolillo/higo, eléctrica/cosquilleo. Cierra con la que adormece la lengua.',
    p: 'Es información que no está en ningún sitio, y eso se guarda.' },
  { f: 'TikTok · 45 s', t: 'Se lo pregunté al cocinero',
    e: 'Grabas la pregunta desde la barra y la respuesta de Arán o Noé, sin cortar.',
    p: 'Hablado y sin edición: es lo que mejor tolera el formato.' },
  { f: 'Carrusel', t: 'Cinco flores y a qué saben',
    e: 'Una tarjeta por flor con su sabor. La última, dónde probarlas.',
    p: 'Se guarda y se manda por DM.' },
  { f: 'Vídeo · 60 s', t: 'De la flor al plato',
    e: 'La misma flor cruda, cocinada y emplatada. Tres estados de un solo ingrediente.',
    p: 'Explica el sitio entero sin explicarlo.' },
  { f: 'Story', t: 'Dieciséis sillas',
    e: 'La sala vacía antes del servicio. Cuentas el aforo.',
    p: 'Escasez real, y funciona como aviso de que has entrado.' },
];

// ---- 07 · lenguaje ----
/* Ganchos para los tres primeros segundos: abren una pregunta o prometen
   una sensación física. Un dato (un aforo, un número de pases) no para el
   scroll de nadie, así que aquí no hay ninguno. */
export const hooks = [
  'Esta flor te va a dormir la lengua.',
  'Este cuenco también se come.',
  'Adivina a qué sabe.',
  'Me acaban de servir una flor entera.',
  'Esto pica. Y es una flor.',
  'Tres segundos y no vas a notar la lengua.',
];

export const captions = [
  { t: 'Para el pase que sorprende',
    d: 'El cuenco es la flor. El farolillo aguanta el tartar de atún y te lo comes entero, recipiente incluido. Pase 5 de 15 en @restaurante.pipilacha, Madrid.' },
  { t: 'Para el detalle de sabor',
    d: 'La capuchina pica como un rábano suave. Aquí no va encima del plato: va dentro del ajoblanco, y es lo que lo despierta. @restaurante.pipilacha' },
  { t: 'Para hablar de la casa',
    d: 'Dieciséis asientos, dos servicios, de jueves a domingo. Cocinan Arán y Noé, y si preguntas por una flor te contestan ellos desde la barra. @restaurante.pipilacha · Fuente del Berro, Madrid.' },
  { t: 'Para cerrar sin enseñarlo todo',
    d: 'Quince pases y solo te enseño tres. El resto lo tienes que ver tú. @restaurante.pipilacha' },
];

export const voz = [
  { t: 'Di la flor y el plato', d: '«Ajoblanco con capuchinas» dice más que «cocina de flores».' },
  { t: 'Di el nombre común', d: 'Flor de higo, no abutilon.' },
  { t: 'Cuenta lo que te pasó en la mesa', d: 'Qué probaste, qué preguntaste, qué no esperabas.' },
  { t: 'Nombra a Arán y Noé', d: 'Son dos, y cocinan y sirven ellos.' },
];

// ---- 08 · diccionario (las entradas viven en menu.js) ----
export const diccionario = {
  sub: 'Búscala aquí antes de decirla a cámara.',
  aviso: 'Esta lista se mueve dentro de la propia carta: las flores se acaban y entra otra en su sitio. Si te sirven una que no está aquí, pregunta en la mesa cuál es. Esa conversación suele ser mejor material que el plato.',
  vacio: 'Ninguna flor con ese nombre. Prueba con parte de la palabra.',
};

// ---- 09 · lo que no funciona ----
export const noFunciona = [
  { t: 'Flash directo', d: 'Aplasta el pétalo y borra justo lo que hay que enseñar.' },
  { t: 'Saturar en edición', d: 'El color ya es ese. Subirlo lo vuelve falso.' },
  { t: 'Cortar cada segundo', d: 'El emplatado es lento a propósito.' },
  { t: 'Música alta encima', d: 'Tapa lo único que suena distinto aquí.' },
  { t: 'Enseñar los quince pases', d: 'Le quita el motivo a quien vaya después.' },
  { t: 'Quedarte en «flores comestibles»', d: 'Di cuál y a qué sabe.' },
  { t: 'Grabar de pie en medio de la sala', d: 'Son dieciséis personas en una sala pequeña.' },
];

// ---- 10 · el pase que nadie ha grabado ----
/* Se cambia una vez por carta. Si no se mantiene, envejece a la vista:
   es el único bloque de la página con esa servidumbre. */
export const paseNadie = {
  fecha: 'Agosto 2026',
  titulo: 'Todavía nadie ha grabado el pase 15.',
  d: 'Calabacín y crisantemos. El crisantemo es amargo y herbal, y sujeta el dulzor del calabacín asado. Sale al final, cuando ya nadie tiene el móvil en la mano.',
};

// ---- 11 · la casa, en tres frases ----
export const casa = [
  'Pipilacha es la libélula: así la llaman en Centroamérica, el insecto que no para de volar.',
  'Cada plato se levanta sobre una flor concreta: lo que sabe, lo que aguanta al fuego, lo que pasa si se fermenta o se seca. Hay miles de flores comestibles y vamos por las primeras.',
  'Lo llevan Arán y Noé. Se conocieron estudiando en Alcalá, coincidieron en Ramón Freixa, y aquí cocinan y sirven los dos.',
];

// ---- 12 · lo práctico ----
export const practico = {
  titulo: 'Lo práctico',
  filas: [
    { k: 'Dónde',    v: 'C. del Azulejo, 2', sub: 'Fuente del Berro, 28028 Madrid' },
    { k: 'Cuándo',   v: 'Jueves a domingo', sub: 'Dos servicios, 14:00 y 21:00. Dura dos horas.' },
    { k: 'La sala',  v: 'Dieciséis asientos', sub: 'Ocho en la barra, una mesa de cuatro y dos de dos. Si vienes a grabar, pide barra al reservar.' },
    { k: 'El menú',  v: 'Quince pases, 85 €', sub: 'Seis copas por 60 € más, o la versión sin alcohol con seis fermentos de la casa.' },
  ],
  invitacion: {
    t: 'La invitación',
    d: 'El menú de quince pases corre de nuestra cuenta, y se acuerda antes por DM. El acompañante paga el suyo y las bebidas van aparte.',
    /* Única negación autorizada de la página: aquí la negación es el mensaje,
       y es lo que separa esta pieza de un brief de cliente. */
    libre: 'Lo que grabes es cosa tuya. Sin mínimo, sin aprobación previa y sin etiquetas obligatorias. Esta página está para que te salga bien, no para pedirte nada.',
  },
};

// ---- 13 · cierre ----
export const cierre = {
  titulo: 'Te llevas',
  vacio: 'Seis momentos, tres planos y treinta y cuatro flores.',
  marcado: (n, total) => `${n} de ${total} momentos marcados.`,
  cta: 'Escríbenos por DM',
  guarda: 'Guarda esta página. Cambia con la carta: la siguiente entra en octubre.',
};

// ---- contacto ----
export const contacto = {
  ig: 'restaurante.pipilacha',
  email: 'info@pipilacha.es',
  tel: '+34919125998',
  telLabel: '919 12 59 98',
  /* El DM va prerredactado: escribir el primer mensaje es donde se pierden. */
  dm: 'Hola, soy creador de contenido y me gustaría ir a grabar. ¿Qué días tenéis barra libre?',
};
