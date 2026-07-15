/* PRIMERA FILA — capítulo inmersivo de la home (sustituye Showcooking + Reserva).
   Contenido de las 3 escenas (OBSERVAR → ESCUCHAR → DESCUBRIR) + bloque de reserva.
   Editar el copy AQUÍ, no en el componente. Las fotos viven en /assets/img/pf-*.jpg
   (con hermano .webp servido por negociación de contenido). Mismas fotos en los
   dos idiomas: solo cambia el texto. */
export const scenesEs = [
  {
    n: '01',
    step: 'Observar',
    img: '/assets/img/pf-observar.jpg',
    alt: 'Los dos chefs emplatando frente a la barra durante el servicio',
    title: 'Primera fila',
    lead: 'Solo ocho personas viven cada servicio frente a la cocina. Aquí el menú empieza antes del primer bocado.',
  },
  {
    n: '02',
    step: 'Escuchar',
    img: '/assets/img/pf-escuchar.jpg',
    alt: 'Un chef conversa con un comensal al otro lado de la barra',
    title: 'Cada plato tiene una historia',
    lead: 'Mientras cocinan, los chefs comparten el origen de cada creación y el papel que juega cada flor. No solo pruebas los platos: comprendes cómo nacieron.',
  },
  {
    n: '03',
    step: 'Descubrir',
    img: '/assets/img/pf-descubrir.jpg',
    alt: 'La barra montada con flores y cubiertos, lista para el servicio',
    title: 'Dieciséis plazas por servicio',
    lead: 'Ocho frente a la cocina, donde los chefs comparten el proceso y la historia de cada plato. Ocho en el comedor, con la misma propuesta desde otra perspectiva.',
  },
];

export const reservaEs = {
  eyebrow: 'Menú degustación',
  price: '85 €',
  priceNote: 'por persona',
  lines: ['Maridaje opcional · +60 €', 'Duración aproximada · 2 horas'],
  cta: { label: 'Reservar', href: '/reservas/' },
  practical: ['Madrid · Fuente del Berro', 'Jueves — Domingo', '14:00 · 21:00'],
};

export const scenesEn = [
  {
    n: '01',
    step: 'Watch',
    img: '/assets/img/pf-observar.jpg',
    alt: 'The two chefs plating at the counter during service',
    title: 'Front row',
    lead: 'Only eight people live each service facing the kitchen. Here the menu starts before the first bite.',
  },
  {
    n: '02',
    step: 'Listen',
    img: '/assets/img/pf-escuchar.jpg',
    alt: 'A chef talks with a guest across the counter',
    title: 'Every dish has a story',
    lead: 'While they cook, the chefs share where each creation came from and the role each flower plays. You don’t just taste the dishes: you understand how they came to be.',
  },
  {
    n: '03',
    step: 'Discover',
    img: '/assets/img/pf-descubrir.jpg',
    alt: 'The counter set with flowers and cutlery, ready for service',
    title: 'Sixteen seats per service',
    lead: 'Eight facing the kitchen, where the chefs share the process and the story behind each dish. Eight in the dining room, with the same menu from another angle.',
  },
];

export const reservaEn = {
  eyebrow: 'Tasting menu',
  price: '€85',
  priceNote: 'per person',
  lines: ['Optional wine pairing · +€60', 'About 2 hours'],
  cta: { label: 'Book', href: '/en/reservas/' },
  practical: ['Madrid · Fuente del Berro', 'Thursday — Sunday', '2pm · 9pm'],
};
