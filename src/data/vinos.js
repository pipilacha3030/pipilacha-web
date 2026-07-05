// La bodega de Pipilacha. Sin precios: se cuentan en sala (como el maridaje).
// Cada tipo lleva una palabra-sensación: la carta se lee por lo que provoca, no por lo que cuesta.
export const grupos = [
  {
    id: 'blancos', titulo: 'Blancos', flor: '/assets/img/flor-begonia.png',
    nota: 'Filo y verticalidad. Para empezar con la boca despierta.',
    vinos: [
      { nombre: 'JAG', uva: 'Godello y Doña Blanca' },
      { nombre: 'Stallmann-Hiestand', uva: 'Riesling' },
      { nombre: 'Barco del Corneta «Loseco»', uva: 'Verdejo y Viura' },
      { nombre: 'Desig · Mas Candi', uva: 'Xarel·lo' },
      { nombre: 'Tricó', uva: 'Albariño' },
      { nombre: 'David & Nadia', uva: 'Chenin Blanc' },
      { nombre: 'Viña Somoza «Ededia»', uva: 'Godello' },
      { nombre: 'Chablis 1er Cru Montmains', uva: 'Chardonnay' },
    ],
  },
  {
    id: 'naranja', titulo: 'Naranja', flor: '/assets/img/flor-calendula.png',
    nota: 'Maceración con pieles. Textura y un punto salvaje.',
    vinos: [
      { nombre: 'Puiggròs «Impresionant»', uva: 'Vino naranja' },
      { nombre: 'Ulterior', uva: 'Naranja' },
    ],
  },
  {
    id: 'tintos', titulo: 'Tintos', flor: '/assets/img/flor-roja.png',
    nota: 'De la encina a la copa. Fruta, tierra y humo.',
    vinos: [
      { nombre: 'Ulterior Parcela 6', uva: 'Garnacha' },
      { nombre: 'La Brecha', uva: 'Ribera' },
      { nombre: 'Gómez Cruzado', uva: 'Rioja' },
      { nombre: 'Cati Ribot «Cambuix» · 1 L', uva: 'Escursac y Callet' },
      { nombre: 'Joan d’Anguera «Finca l’Argata»', uva: 'Garnacha' },
      { nombre: 'Dom. de Villeneuve · Châteauneuf-du-Pape', uva: 'Ródano' },
      { nombre: 'Guy Amiot · Chassagne-Montrachet', uva: 'Pinot Noir' },
    ],
  },
  {
    id: 'espumosos', titulo: 'Espumosos', flor: '/assets/img/flor-borraja.png',
    nota: 'Tensión con aire. Cava, pet-nat y champán.',
    vinos: [
      { nombre: 'Mas Candi', uva: 'Brut Nature' },
      { nombre: 'Con Altura', uva: 'Pet-Nat' },
      { nombre: 'Marteaux', uva: 'Champagne · Brut Réserve' },
      { nombre: 'Calsac «Cuvée l’Échappée Belle»', uva: 'Champagne' },
      { nombre: 'Bérêche', uva: 'Champagne · Brut Réserve' },
    ],
  },
  {
    id: 'dulces', titulo: 'Dulces', flor: '/assets/img/flor-dalia.png',
    nota: 'El cierre. Poco, frío y con flor.',
    vinos: [
      { nombre: 'Dulce Enero', uva: 'Vino dulce' },
      { nombre: 'La Chispa Negra', uva: 'Vino dulce' },
    ],
  },
];
