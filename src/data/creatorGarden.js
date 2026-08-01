/* ============================================================
   CREATOR GARDEN · contenido
   Todo el texto de /creator-garden/ vive aquí, no en la plantilla:
   al cambiar de carta se toca este archivo (y src/data/menu.js, de
   donde salen pases y flores) y la página se actualiza sola.

   Voz: directa, precisa, con carácter. La flor es un ingrediente, no
   un símbolo — nada de lenguaje floral para hablar de flores.
   ============================================================ */

// ---- 00 · escenas, para el tallo lateral y el índice ----
export const escenas = [
  { id: 'apertura',   n: '00', t: 'Apertura' },
  { id: 'manifiesto', n: '01', t: 'Manifiesto' },
  { id: 'vision',     n: '02', t: 'La visión' },
  { id: 'filosofia',  n: '03', t: 'Filosofía' },
  { id: 'guia',       n: '04', t: 'Guía' },
  { id: 'historias',  n: '05', t: 'Historias' },
  { id: 'camara',     n: '06', t: 'Cámara' },
  { id: 'movimiento', n: '07', t: 'Movimiento' },
  { id: 'identidad',  n: '08', t: 'Identidad' },
  { id: 'detalles',   n: '09', t: 'Detalles' },
  { id: 'ideas',      n: '10', t: 'Ideas' },
  { id: 'lenguaje',   n: '11', t: 'Lenguaje' },
  { id: 'material',   n: '12', t: 'Material' },
  { id: 'contacto',   n: '13', t: 'Contacto' },
];

// ---- 01 · manifiesto (entra línea a línea) ----
export const manifiesto = [
  'Pipilacha es la libélula. Así la llaman en Centroamérica: el insecto que no para de volar.',
  'La carta se rehace entera cada estación porque el trabajo no está terminado. Hay miles de flores comestibles y llevamos años en las primeras.',
  'Cada plato se levanta sobre una flor: su sabor, su textura, lo que hace al cocinarla. La capuchina pica como un rábano. El farolillo es ácido y sirve de cuenco. La flor eléctrica duerme la lengua.',
  'No hay otra casa en el mundo construida entera sobre esto.',
];

// ---- 02 · visión ----
export const vision = {
  eyebrow: 'Hacia dónde va',
  titulo: 'Un ingrediente que casi nadie ha cocinado',
  cuerpo: [
    'La flor lleva siglos en la mesa como adorno. Como firma visual de quien quiere que el plato quede bien en foto.',
    'Aquí se trata con el mismo rigor que otros dan a la carne o al pescado: qué sabor tiene, cómo se comporta con el calor, qué pasa si la fermentas, la secas o la conviertes en harina.',
    'Eso no es un estilo de cocina. Es un territorio sin mapa, y la carta es el cuaderno de campo.',
  ],
  dato: { n: '16', t: 'asientos por servicio', pie: 'Los que caben si quieres cocinar mirando a quien come.' },
};

// ---- 03 · filosofía creativa: cómo se piensa un plato ----
export const filosofia = [
  { n: '01', t: 'Primero la flor', d: 'El plato no se diseña y luego se decora. Se empieza por una flor concreta y se pregunta qué es capaz de sostener.' },
  { n: '02', t: 'El sabor manda sobre el color', d: 'Si una flor solo aporta belleza, se cae del plato. Ninguna está ahí para la foto.' },
  { n: '03', t: 'La técnica se ve poco', d: 'Fermentar, secar, hacer harina de flor. El trabajo no se explica en la mesa: se prueba.' },
  { n: '04', t: 'Nada se queda quieto', d: 'Un pase que funciona sigue cambiando. La carta entera se rehace cada estación.' },
];

// ---- 04 · guía para creadores: los tres ángulos que funcionan ----
export const angulos = [
  {
    n: '01', t: 'El plato que no esperas',
    d: 'Enseña la forma antes que el nombre. Un cuenco que resulta ser una flor. Un higo negro que te comes antes de que te expliquen qué es. La sorpresa cabe en los tres primeros segundos.',
  },
  {
    n: '02', t: 'Dieciséis',
    d: 'Dos servicios, dieciséis asientos. No es un número de marketing: es el aforo que permite que quien cocina te vea comer. Es de los sitios de los que se presume por haber entrado.',
  },
  {
    n: '03', t: 'Flores que saben',
    d: 'Di a qué sabe cada una. Que la capuchina pique a rábano sorprende mucho más que decir que el plato «lleva flores». Lo concreto es lo que se comparte.',
  },
];

// ---- 05 · oportunidades narrativas ----
export const historias = [
  { t: 'El cuaderno', d: 'La carta cambia entera cada estación. Contar una flor que este mes entra y el que viene no está es una historia con fecha de caducidad, y eso se ve.' },
  { t: 'Las pinzas', d: 'Hay pases que se montan flor a flor delante de ti. El gesto es lento y preciso; en vídeo funciona mejor que el plato terminado.' },
  { t: 'La barra', d: 'Ocho de los dieciséis asientos miran a la cocina. Desde ahí el plano es el que nadie tiene: la mano, el fuego y el pase saliendo.' },
  { t: 'Los dos', d: 'Arán y Noé cocinan y sirven. Si preguntas por una flor, te contestan ellos. Esa conversación es material.' },
  { t: 'El fermento', d: 'Kéfir, kombucha y fermentados se hacen en casa, con flores. Es la parte que nadie enseña porque no está en el plato.' },
  { t: 'La primera vez', d: 'La cara de alguien mordiendo flor eléctrica por primera vez. Es la reacción más honesta de todo el menú.' },
];

// ---- 06 · cámara: cómo se fotografía y se graba esta cocina ----
export const camara = {
  foto: [
    { t: 'Cenital', d: 'Casi todo se emplata para verse desde arriba. Si dudas del plano, ese es el plano.' },
    { t: 'Luz natural o tenue', d: 'Nada de flash directo: aplasta el color del pétalo, que es justo lo que hay que enseñar.' },
    { t: 'Fondo de piedra o madera', d: 'La vajilla es mate y clara. Deja que respire; no añadas mantel ni atrezo.' },
    { t: 'Sin filtros saturados', d: 'El color ya está ahí y es real. Subirlo hace que parezca retocado y le quita valor.' },
  ],
  video: [
    { t: 'Planos largos', d: 'El emplatado es lento a propósito. Cortar cada segundo rompe justo lo que hace especial al gesto.' },
    { t: 'Sonido de sala', d: 'Graba el ambiente real. La sala es pequeña y suena a conversación, no a música alta.' },
    { t: 'La mano en cuadro', d: 'Las pinzas colocando una flor dan escala y explican el detalle sin una sola palabra.' },
    { t: 'El primer bocado', d: 'La reacción vale más que el plano del plato. Deja la cámara puesta un segundo de más.' },
  ],
};

// ---- 07 · principios de movimiento (los reales de la marca) ----
export const movimiento = [
  { t: 'Nada aparece de la nada', d: 'Todo entra desde un estado que ya existía: nunca desde escala cero ni opacidad plana. Lo que se mueve, venía de algún sitio.' },
  { t: 'La salida es más rápida que la entrada', d: 'Entrar puede tomarse su tiempo. Salir, no: la respuesta al gesto es inmediata.' },
  { t: 'Ritmo lento, reacción rápida', d: 'El scroll es pausado y continuo; los botones y enlaces contestan al instante. Son dos velocidades distintas y conviven.' },
  { t: 'El movimiento no se nota', d: 'Si una animación llama la atención sobre sí misma, sobra. Está para que el contenido llegue mejor, no para lucirse.' },
];

// ---- 08 · identidad visual (valores reales del sistema) ----
export const paleta = [
  { hex: '#0B0B09', n: 'Vacío',     u: 'fondo de las escenas oscuras' },
  { hex: '#31331F', n: 'Musgo',     u: 'bloques sólidos, botones' },
  { hex: '#645D3B', n: 'Oliva',     u: 'acento, filetes, activo' },
  { hex: '#B0A77F', n: 'Avena',     u: 'acento sobre fondo oscuro' },
  { hex: '#F4EFE6', n: 'Crema',     u: 'fondo claro' },
  { hex: '#2A2A22', n: 'Tinta',     u: 'texto principal' },
];

export const tipografia = [
  { fam: 'Marcellus', rol: 'Display', d: 'Serif de titular. Solo en tamaños grandes y en peso normal: nunca en negrita, nunca en cuerpo de texto.' },
  { fam: 'Hanken Grotesk', rol: 'Texto', d: 'Sans variable de 300 a 600 para todo lo que se lee seguido. Sustituye a Roobert, la licenciada de marca.' },
];

export const materiales = [
  { t: 'Cerámica mate', d: 'Vajilla clara y sin brillo, hecha para que el color del pétalo sea lo único que destaque.' },
  { t: 'Piedra y madera', d: 'Las bases de emplatado y la barra. Superficies con grano, nunca pulidas.' },
  { t: 'Delantal verde', d: 'Lino teñido en verde oliva con la libélula bordada. Es el único uniforme.' },
  { t: 'La libélula', d: 'El trazo de la casa. Aparece pequeña y una sola vez: nunca repetida ni como patrón.' },
];

// ---- 09 · detalles icónicos ----
export const detalles = [
  { t: 'El cuenco que es una flor', d: 'El farolillo aguanta el tartar de atún. Te lo comes entero, recipiente incluido.' },
  { t: 'La lengua dormida', d: 'La flor eléctrica anestesia ligeramente el paladar. Dura unos segundos y no se olvida.' },
  { t: 'Las pinzas', d: 'Los pases más delicados se montan con pinza, flor a flor, a la vista.' },
  { t: 'La estantería', d: 'Libros de cocina y plantas detrás de la barra. Es el fondo de casi todos los retratos de la casa.' },
];

// ---- 10 · ideas de contenido, por formato ----
export const ideas = [
  { f: 'Reel · 15 s', t: 'Adivina cuál se come', d: 'Plano cenital de tres pases. Revelas al final que en los tres la flor es el ingrediente principal, no el adorno.' },
  { f: 'Reel · 30 s', t: 'A qué sabe cada flor', d: 'Una flor por corte, con su sabor en texto: capuchina/rábano, farolillo/ácido, eléctrica/cosquilleo.' },
  { f: 'Carrusel', t: 'Los quince pases', d: 'Una foto por pase en orden. El último slide, las flores de la carta escritas.' },
  { f: 'Vídeo · 60 s', t: 'De la flor al plato', d: 'La misma flor cruda, cocinada y emplatada. Tres estados, un solo ingrediente.' },
  { f: 'Foto', t: 'El contraste', d: 'El higo negro junto al helado blanco. Funciona sin texto y sin explicación.' },
  { f: 'Story', t: 'Dieciséis sillas', d: 'La sala vacía antes del servicio. Cuentas el aforo y por qué es tan difícil entrar.' },
];

// ---- 11 · lenguaje: ganchos y pies ----
export const hooks = [
  'Aquí la flor no decora: es el plato.',
  'Me comí el cuenco. Era una flor.',
  'Esta flor te duerme la lengua.',
  'Treinta y dos flores en un solo menú.',
  'Dieciséis asientos. Reservé con semanas.',
  'No hay otro restaurante así en el mundo.',
];

export const captions = [
  {
    t: 'Para el pase que sorprende',
    d: 'El cuenco es la flor. El farolillo aguanta el tartar de atún y te lo comes entero — recipiente incluido. Pase 05 de quince, en @restaurante.pipilacha.',
  },
  {
    t: 'Para hablar de la casa',
    d: 'Dieciséis asientos, dos servicios, jueves a domingo. Arán y Noé cocinan y sirven ellos: si preguntas por una flor, te contestan. Madrid, Fuente del Berro.',
  },
  {
    t: 'Para el detalle técnico',
    d: 'La capuchina pica como un rábano suave y despierta un ajoblanco frío. Aquí la flor no está por bonita: está porque aporta un sabor que ningún otro ingrediente da.',
  },
];

export const voz = [
  { t: 'Di la flor y el plato', d: '«Ajoblanco con capuchinas» dice más que cualquier etiqueta genérica sobre cocina de flores.' },
  { t: 'Cuenta lo que pasó en la mesa', d: 'Lo que probaste, lo que te sorprendió, lo que preguntaste. En primera persona y concreto.' },
  { t: 'Nombra a Arán y Noé', d: 'Es una casa de dos personas y se nota en cada pase. Sin ellos la historia queda a medias.' },
  { t: 'Evita la palabra experiencia', d: 'Comiste, aprendiste algo de una flor y te fuiste con ganas de contarlo. Eso ya es suficientemente concreto.' },
];

// ---- 12 · material descargable (solo lo que existe de verdad) ----
export const material = [
  { t: 'Dossier de prensa', d: 'La casa, los dos cocineros y la carta en un PDF.', href: '/assets/docs/pipilacha-dossier-prensa.pdf', meta: 'PDF' },
  { t: 'Carta de vinos', d: 'La bodega completa, cada vino con su flor.', href: '/assets/docs/pipilacha-carta-vinos.pdf', meta: 'PDF' },
];

// ---- 13 · contacto ----
export const contacto = {
  ig: 'restaurante.pipilacha',
  email: 'info@pipilacha.es',
  tel: '+34919125998',
  telLabel: '919 12 59 98',
  dir: 'C. del Azulejo, 2',
  zona: 'Fuente del Berro, 28028 Madrid',
  horario: 'Jueves a domingo · 14:00 y 21:00',
  formato: 'Quince pases, 85 € · maridaje +60 €',
};
