// Solsticio floral — 15 pases (nombres reales).
// Cada pase lleva una pista: lo que hace la flor, no la receta entera.
export const pases = [
  { name: 'Pipilacha', hook: 'La flor eléctrica despierta el paladar para todo lo que viene.' },
  { name: 'Degustación floral', hook: 'Cinco flores en su punto, servidas una a una antes del primer plato caliente.' },
  { name: 'Taco de tila y alisos', hook: 'La tila calma; el aliso cierra con un punto de mostaza.' },
  { name: 'Flor de melocotón anisada', hook: 'La flor del melocotón se cocina con anís y deja un final fresco, casi mentolado.' },
  { name: 'Farolillo de atún y orégano', hook: 'El farolillo aporta un ácido floral que corta la grasa del atún.' },
  { name: 'Mojito entre borrajas', hook: 'Las flores de borraja llevan menta y lima a un bocado que recuerda al mojito sin serlo.' },
  { name: 'Pan y mantequilla de lavanda', hook: 'Masa madre de la casa con mantequilla batida con lavanda.' },
  { name: 'Ajoblanco con capuchinas', hook: 'La capuchina pica como un ligero rábano y despierta el ajoblanco frío.' },
  { name: 'Fusión tomate-hinojo', hook: 'Tomate maduro y flor de hinojo cruzan el anís con el dulzor en el mismo bocado.' },
  { name: 'Higo a la brasa con helado de saúco', hook: 'El higo se marca a la brasa; el saúco llega frío, floral y ligeramente vinoso.' },
  { name: 'Vieiras shiso-dalias', hook: 'El shiso pica en verde; el pétalo de dalia endulza el yodo de la vieira.' },
  { name: 'Rape, boletus y pétalos', hook: 'El rape se apoya en el boletus, y los pétalos aportan el contrapunto floral.' },
  { name: 'Codorniz y flores ácidas', hook: 'Flores con acidez natural cortan la grasa de la codorniz sin necesitar vinagre.' },
  { name: 'Regaliz, chocolate y cardamomo', hook: 'Regaliz y cardamomo se funden en un chocolate intenso, sin azúcar de más.' },
  { name: 'Calabacín y crisantemos', hook: 'El crisantemo, amargo y herbal, retiene el dulzor del calabacín asado.' },
];

// Nombre de la carta en curso y las 32 flores que trabaja. Viven aquí, junto a los
// pases, porque son el mismo menú: al cambiar de carta se cambian los dos a la vez.
// Los usa la banda «el jardín que se vacía» (Newsletter.astro): el recuento del
// antetítulo sale de flores.length, no de un número escrito a mano.
export const menuNombre = 'Solsticio floral';

export const flores = [
  'guisante mariposa', 'flor eléctrica', 'margarita', 'hisopo', 'albahaca', 'ajo',
  'oxalis', 'tilo', 'aliso', 'anís estrellado', 'geranio', 'farolillo', 'orégano',
  'kalanchoe', 'hierbabuena', 'borraja', 'lavanda', 'aciano', 'amapola', 'capuchina',
  'hinojo', 'lantana', 'saúco', 'dalia', 'phlox estrellado', 'tagete', 'caléndula',
  'hibiscus', 'begonia', 'regaliz azteca', 'cosmos', 'crisantemo',
];

// La que queda en pie al final del vaciado va la ÚLTIMA de este array a propósito:
// Newsletter.astro la saca de ahí, así que no hay dos sitios que puedan discrepar.

// ── Diccionario de sabor ─────────────────────────────────────────────────────
// Lo usa /creator-garden/. Sale de dos documentos del Drive: «FLORES Y USOS»
// (cocina, flor por flor de esta carta) y «Características de las flores»
// (ficha de sabor). Cuando discrepan MANDA COCINA: es la casa describiendo su
// propio plato — p. ej. cosmos es «lechuga», no «chocolate suave».
//
// NO es el mismo array que `flores` de arriba y no tiene por qué serlo: las
// flores se acaban dentro de una misma carta y entran otras en su sitio. Aquí
// están las que cocina ha descrito; arriba, las que dan nombre a la estación.
//
// `decir` es opcional a propósito. Si las 34 llevaran frase, el bloque cogería
// un ritmo uniforme que se lee a máquina. La llevan las que dan un momento a cámara.
export const floresSabor = [
  { n: 'guisante mariposa',    sabor: 'No sabe a nada. Está por el azul.',                    pase: 1,  decir: 'este azul es una flor, no colorante' },
  { n: 'flor eléctrica',       sabor: 'Cosquillea y despierta las papilas',                   pase: 1,  decir: 'espera tres segundos' },
  { n: 'margarita',            sabor: 'A campo. Sabe como huele.',                            pase: 2,  decir: 'sabe exactamente a como huele' },
  { n: 'cosmos',               sabor: 'Recuerda a la lechuga',                                pase: 2,  decir: 'esta sabe a ensalada' },
  { n: 'flor de albahaca',     sabor: 'Albahaca concentrada, y mide un centímetro',           pase: 2,  decir: 'tan pequeña y sabe más que la hoja' },
  { n: 'flor de ajo',          sabor: 'Ajo explosivo. La más potente de las cinco.',          pase: 2,  decir: 'prepárate con esta' },
  { n: 'oxalis',               sabor: 'Muy ácida. Limpia el ajo de golpe.',                   pase: 2,  decir: 'esta borra la anterior' },
  { n: 'flor de tila',         sabor: 'Miel suave. Seca y molida, es la harina del taco.',    pase: 3,  decir: 'el taco está hecho de tila' },
  { n: 'flor de aliso',        sabor: 'Huele a miel y sabe a mostaza',                        pase: 3,  decir: 'huele dulce y luego pica' },
  { n: 'flor de anís estrellado', sabor: 'Anís marcado, infusionada en la crema',             pase: 4 },
  { n: 'flor de geranio',      sabor: 'Afrutada y fresca. Baja el anís.',                     pase: 4 },
  { n: 'farolillo japonés',    sabor: 'Es el recipiente, y deja un fondo a higo',             pase: 5,  decir: 'el cuenco también se come' },
  { n: 'flor de orégano',      sabor: 'Herbal, dentro de la ponzu del atún',                  pase: 5 },
  { n: 'kalanchoe',            sabor: 'No aporta sabor: aporta crujido',                      pase: 5,  decir: 'esta está aquí por la textura' },
  { n: 'flor de borraja',      sabor: 'Pepino fresco',                                        pase: 6,  decir: 'esta sabe a pepino' },
  { n: 'flor de hierbabuena',  sabor: 'En infusión. El melón se empapa de ella.',             pase: 6 },
  { n: 'rosa',                 sabor: 'Seca, dentro del pan cuatro estaciones',               pase: 7,  decir: 'hay una flor dentro del pan' },
  { n: 'amapola',              sabor: 'Sus semillas, en el pan de puerro',                    pase: 7 },
  { n: 'lavanda',              sabor: 'Infusionada en la mantequilla, y seca en la sal',      pase: 7,  decir: 'mantequilla de flor' },
  { n: 'capuchina',            sabor: 'Mostaza y rábano. Se usa hoja, pétalo y cáliz.',       pase: 8,  decir: 'esto pica, y es una flor' },
  { n: 'flor de hinojo',       sabor: 'Anís intenso. También servida como aire.',             pase: 9,  decir: 'huele el aire antes de comértelo' },
  { n: 'clavel',               sabor: 'Muy floral, dentro del gazpacho',                      pase: 9 },
  { n: 'saúco',                sabor: 'Avellanado. Va en helado.',                            pase: 10, decir: 'esto va helado' },
  { n: 'phlox estrellado',     sabor: 'Dulce. Acompaña al higo.',                             pase: 10 },
  { n: 'dalia',                sabor: 'Cruje como fruta. Refrescante.',                       pase: 11, decir: 'cruje como una manzana' },
  { n: 'tagete',               sabor: 'Cítrico y amargo, muy marcado',                        pase: 12 },
  { n: 'caléndula',            sabor: 'Pimienta suave con fondo amargo',                      pase: 12 },
  { n: 'flor de ajo/puerro',   sabor: 'Encurtida. Agridulce, sobre el rape.',                 pase: 12 },
  { n: 'flor de begonia',      sabor: 'Ácida, casi cítrica. La hoja hace de recipiente.',     pase: 13, decir: 'la hoja también se come' },
  { n: 'flor de hibiscus',     sabor: 'Frutos rojos y acidez. Reducida como una demi-glace.', pase: 13 },
  { n: 'regaliz azteca',       sabor: 'Regaliz reconocible, dentro de la mousse',             pase: 14, decir: 'esto es regaliz de verdad' },
  { n: 'lantana',              sabor: 'Muy aromática, con un punto anisado',                  pase: 14 },
  { n: 'crisantemo',           sabor: 'Refrescante, de textura marcada',                      pase: 15, decir: 'dibuja un girasol en el plato' },
  { n: 'girasol',              sabor: 'Sus pipas, saladas, cortan el dulce',                  pase: 15 },
];
