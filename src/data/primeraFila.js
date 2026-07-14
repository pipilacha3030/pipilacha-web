/* PRIMERA FILA — capítulo inmersivo de la home (sustituye Showcooking + Reserva).
   Contenido de las 3 escenas (OBSERVAR → ESCUCHAR → DESCUBRIR) + bloque de reserva.
   Editar el copy AQUÍ, no en el componente. Las fotos viven en /assets/img/pf-*.jpg
   (con hermano .webp servido por negociación de contenido). */
export const scenes = [
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

export const reserva = {
  eyebrow: 'Menú degustación',
  price: '85 €',
  priceNote: 'por persona',
  lines: ['Maridaje opcional · +60 €', 'Duración aproximada · 2 horas'],
  cta: { label: 'Reservar', href: '/reservas/' },
  practical: ['Madrid · Fuente del Berro', 'Jueves — Domingo', '14:00 · 21:00'],
};
