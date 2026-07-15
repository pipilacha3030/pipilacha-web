// Pipilacha's cellar (English). Mirrors src/data/vinos.js. No prices: told in
// the room. Wine names stay; group titles, notes and grape connectors translated.
export const grupos = [
  {
    id: 'blancos', titulo: 'Whites', flor: '/assets/img/flor-begonia.png',
    nota: 'Edge and verticality. To start with the mouth awake.',
    vinos: [
      { nombre: 'JAG', uva: 'Godello & Doña Blanca' },
      { nombre: 'Stallmann-Hiestand', uva: 'Riesling' },
      { nombre: 'Barco del Corneta «Loseco»', uva: 'Verdejo & Viura' },
      { nombre: 'Desig · Mas Candi', uva: 'Xarel·lo' },
      { nombre: 'Tricó', uva: 'Albariño' },
      { nombre: 'David & Nadia', uva: 'Chenin Blanc' },
      { nombre: 'Viña Somoza «Ededia»', uva: 'Godello' },
      { nombre: 'Chablis 1er Cru Montmains', uva: 'Chardonnay' },
    ],
  },
  {
    id: 'naranja', titulo: 'Orange', flor: '/assets/img/flor-coreopsis.png',
    nota: 'Skin-macerated. Texture and a wild edge.',
    vinos: [
      { nombre: 'Puiggròs «Impresionant»', uva: 'Orange wine' },
      { nombre: 'Ulterior', uva: 'Orange' },
    ],
  },
  {
    id: 'tintos', titulo: 'Reds', flor: '/assets/img/flor-roja.png',
    nota: 'From the oak to the glass. Fruit, earth and smoke.',
    vinos: [
      { nombre: 'Ulterior Parcela 6', uva: 'Garnacha' },
      { nombre: 'La Brecha', uva: 'Ribera' },
      { nombre: 'Gómez Cruzado', uva: 'Rioja' },
      { nombre: 'Cati Ribot «Cambuix» · 1 L', uva: 'Escursac & Callet' },
      { nombre: 'Joan d’Anguera «Finca l’Argata»', uva: 'Garnacha' },
      { nombre: 'Dom. de Villeneuve · Châteauneuf-du-Pape', uva: 'Rhône' },
      { nombre: 'Guy Amiot · Chassagne-Montrachet', uva: 'Pinot Noir' },
    ],
  },
  {
    id: 'espumosos', titulo: 'Sparkling', flor: '/assets/img/flor-borraja.png',
    nota: 'Tension with air. Cava, pet-nat and champagne.',
    vinos: [
      { nombre: 'Mas Candi', uva: 'Brut Nature' },
      { nombre: 'Con Altura', uva: 'Pet-Nat' },
      { nombre: 'Marteaux', uva: 'Champagne · Brut Réserve' },
      { nombre: 'Calsac «Cuvée l’Échappée Belle»', uva: 'Champagne' },
      { nombre: 'Bérêche', uva: 'Champagne · Brut Réserve' },
    ],
  },
  {
    id: 'dulces', titulo: 'Sweet', flor: '/assets/img/flor-dalia.png',
    nota: 'The close. A little, cold, with flower.',
    vinos: [
      { nombre: 'Dulce Enero', uva: 'Sweet wine' },
      { nombre: 'La Chispa Negra', uva: 'Sweet wine' },
    ],
  },
];
