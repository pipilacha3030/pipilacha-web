/* ============================================================
   CREATOR GARDEN · contenido
   Todo el texto de /creator-garden/ vive aquí. Las flores y su
   sabor salen de src/data/menu.js: al cambiar de carta se tocan
   los dos archivos y la página se actualiza sola.

   QUÉ ES ESTA PÁGINA. Un creador llega invitado, sin cobrar y sin
   nada pactado a cambio. Así que esto no da instrucciones: cuenta
   qué es la casa y qué pasa en la mesa, para que quien venga tenga
   de dónde tirar si le apetece grabar.

   REGLA DE TONO, la que manda sobre todas las demás:
   nada en imperativo. Ni «graba», ni «di», ni «enseña», ni «pide».
   Se describe lo que pasa y se ofrece lo que puede servir. Una guía
   que ordena se lee como un brief de cliente, y aquí no hay cliente.

   Y las de siempre: la flor es un ingrediente, no un símbolo. Nada
   abre con una negación. Como mucho un cierre en aforismo de cada
   tres tarjetas — la simetría rítmica es lo que suena a máquina.
   ============================================================ */

// ---- navegación: cuatro saltos. Es una página corta, no hace falta más ----
export const saltos = [
  { id: 'mesa',     t: 'La mesa' },
  { id: 'flores',   t: 'Flores' },
  { id: 'ideas',    t: 'Ideas' },
  { id: 'practico', t: 'Práctico' },
];

// ---- 01 · apertura ----
export const apertura = {
  eyebrow: 'Creator Garden',
  titulo: 'Quince platos, y en todos manda una flor.',
  sub: 'Esto es lo que hay dentro, por si te sirve para contarlo a tu manera.',
  credito: 'Arriba, Arán y Noé en la barra. Ocho de los dieciséis asientos están a ese lado.',
};

// ---- 02 · qué es la casa. Arriba, porque lo primero es entenderla ----
export const casa = {
  titulo: 'Qué es Pipilacha',
  frases: [
    'Pipilacha es la libélula: así la llaman en Centroamérica, el insecto que no para de volar.',
    'Cada plato se levanta sobre una flor concreta: lo que sabe, lo que aguanta al fuego, lo que pasa si se fermenta o se seca. Hay miles de flores comestibles y vamos por las primeras.',
    'Lo llevan Arán y Noé, que se conocieron estudiando en Alcalá y coincidieron en Ramón Freixa. Cocinan y sirven los dos, en una sala de dieciséis asientos.',
  ],
};

// ---- 03 · lo que pasa en la mesa ----
/* Descriptivo, nunca imperativo: son cosas que ocurren, no tareas.
   Quien lea decide solas cuáles le interesan. */
export const mesa = {
  titulo: 'Lo que pasa en la mesa',
  sub: 'Cinco momentos del servicio. Ninguno hay que buscarlo: pasan solos.',
  momentos: [
    { k: 'La flor que duerme la lengua', v: 'Pase 01',
      d: 'El primer pase lleva flor eléctrica y adormece el paladar unos segundos. La cara que pone la gente la primera vez suele ser lo mejor del servicio, y llega antes de que a nadie le dé tiempo a acomodarse.' },
    { k: 'Cinco flores, una a una', v: 'Pase 02',
      d: 'Antes del primer plato caliente llegan cinco flores sueltas, cada una con su sabor: campo, lechuga, albahaca, ajo y una ácida que limpia todo lo anterior.' },
    { k: 'El cuenco que se come', v: 'Pase 05',
      d: 'El tartar de atún viene servido dentro de un farolillo. La flor es el recipiente y deja un fondo a higo. Se come entero.' },
    { k: 'La barra', v: 'Ocho de dieciséis asientos',
      d: 'La mitad de la sala mira a la cocina, a dos metros. Desde ahí se ve el fuego y los pases montándose con pinza, flor a flor. Es un ángulo que no existe desde las mesas.' },
    { k: 'Negro y blanco', v: 'Pase 10',
      d: 'El higo sale negro de la brasa y al lado va el helado de saúco, blanco y frío. El contraste se explica solo.' },
  ],
};

// ---- 04 · las flores (las entradas viven en menu.js) ----
export const flores = {
  titulo: 'Las flores, y a qué saben',
  sub: 'Por si en algún momento hace falta saber qué es lo que hay en el plato.',
  aviso: 'La lista se mueve dentro de la propia carta: las flores se acaban y entra otra en su sitio. Si aparece una que no está aquí, en la mesa te dicen cuál es.',
  vacio: 'Ninguna flor con ese nombre.',
};

// ---- 05 · ideas ----
/* «Por si te sirven». Son puntos de partida, no un encargo. */
export const ideas = {
  titulo: 'Ideas, por si sirven',
  sub: 'Cosas que ya han funcionado bien contadas por otra gente.',
  lista: [
    { f: 'Vídeo corto', t: 'Adivina cuál se come', d: 'Tres platos en cenital y el desenlace al final: en los tres la flor es el ingrediente, no el adorno.' },
    { f: 'Vídeo corto', t: 'A qué sabe cada flor', d: 'Una flor por corte con su sabor: la capuchina pica, el farolillo sabe a higo, la eléctrica cosquillea.' },
    { f: 'Carrusel', t: 'Cinco flores', d: 'Una tarjeta por flor con lo que aporta. Funciona como algo que la gente guarda.' },
    { f: 'Vídeo largo', t: 'De la flor al plato', d: 'La misma flor cruda, cocinada y emplatada. Tres estados de un solo ingrediente.' },
    { f: 'Stories', t: 'Dieciséis sillas', d: 'La sala antes de que entre nadie, y el número de asientos que tiene.' },
  ],
  nota: 'Y si prefieres contarlo de otra forma, mejor: aquí nadie ha visto la casa con tus ojos todavía.',
};

// ---- 06 · frases ----
export const frases = {
  titulo: 'Frases, por si valen de arranque',
  sub: 'Escritas para cambiarlas.',
  hooks: [
    'Esta flor te duerme la lengua.',
    'Este cuenco también se come.',
    'Adivina a qué sabe.',
    'Me acaban de servir una flor entera.',
    'Esto pica. Y es una flor.',
  ],
  pies: [
    { t: 'El pase que sorprende',
      d: 'El cuenco es la flor. El farolillo aguanta el tartar de atún y se come entero, recipiente incluido. Pase 5 de 15 en @restaurante.pipilacha, Madrid.' },
    { t: 'El detalle de sabor',
      d: 'La capuchina pica como un rábano suave. Aquí no va encima del plato: va dentro del ajoblanco, y es lo que lo despierta. @restaurante.pipilacha' },
    { t: 'La casa',
      d: 'Dieciséis asientos, dos servicios, de jueves a domingo. Cocinan Arán y Noé, y si preguntas por una flor te contestan ellos desde la barra. @restaurante.pipilacha · Fuente del Berro, Madrid.' },
  ],
};

// ---- 07 · lo práctico + la invitación ----
export const practico = {
  titulo: 'Lo práctico',
  filas: [
    { k: 'Dónde',   v: 'C. del Azulejo, 2', sub: 'Fuente del Berro, 28028 Madrid' },
    { k: 'Cuándo',  v: 'Jueves a domingo', sub: 'Dos servicios, 14:00 y 21:00. Dura unas dos horas.' },
    { k: 'La sala', v: 'Dieciséis asientos', sub: 'Ocho en la barra, una mesa de cuatro y dos de dos.' },
    { k: 'El menú', v: 'Quince pases, 85 €', sub: 'Con seis copas, 60 € más, o la versión sin alcohol con fermentos de la casa.' },
  ],
  invitacion: {
    t: 'La invitación',
    d: 'El menú de quince pases corre de nuestra cuenta, y se acuerda antes por DM. El acompañante paga el suyo y las bebidas van aparte.',
    /* Única negación de la página, y va aquí a propósito: es lo que
       separa una invitación de un encargo. */
    libre: 'Vienes invitado, no contratado. No hay mínimo que cumplir, ni aprobación previa, ni etiquetas obligatorias: si te apetece contarlo, encantados, y si no, también.',
  },
};

// ---- 08 · cierre ----
export const cierre = {
  titulo: 'Nos vemos en la barra.',
  cta: 'Escríbenos por DM',
};

// ---- contacto ----
export const contacto = {
  ig: 'restaurante.pipilacha',
  email: 'info@pipilacha.es',
  tel: '+34919125998',
  telLabel: '919 12 59 98',
};
