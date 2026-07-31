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
