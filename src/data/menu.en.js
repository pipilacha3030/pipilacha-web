// Solsticio floral — 15 courses (English). Mirrors src/data/menu.js.
// Each course carries a hint: what the flower does, not the whole recipe.
export const pases = [
  { name: 'Pipilacha', hook: 'The electric flower wakes the palate for everything that follows.' },
  { name: 'Flower tasting', hook: 'Five flowers at their peak, served one by one before the first hot course.' },
  { name: 'Linden and alder taco', hook: 'Linden calms; alder closes with a mustard edge.' },
  { name: 'Aniseed peach blossom', hook: 'Peach blossom cooked with aniseed, finishing fresh, almost minty.' },
  { name: 'Fuchsia with tuna and oregano', hook: "Fuchsia brings a floral acidity that cuts through the tuna's fat." },
  { name: 'Mojito among borage', hook: "Borage flowers carry mint and lime into a bite that recalls a mojito without being one." },
  { name: 'Bread and lavender butter', hook: 'Our own sourdough with butter whipped with lavender.' },
  { name: 'Ajoblanco with nasturtium', hook: "Nasturtium bites like a mild radish and wakes up the cold ajoblanco." },
  { name: 'Tomato-fennel fusion', hook: 'Ripe tomato and fennel flower cross aniseed with sweetness in the same bite.' },
  { name: 'Grilled fig with elderflower ice cream', hook: 'The fig is marked over embers; elderflower arrives cold, floral, faintly wine-like.' },
  { name: 'Scallops, shiso and dahlia', hook: "Shiso bites green; dahlia petal sweetens the scallop's iodine." },
  { name: 'Monkfish, boletus and petals', hook: 'Monkfish leans on boletus, and petals bring the floral counterpoint.' },
  { name: 'Quail and sour flowers', hook: "Naturally sour flowers cut through the quail's fat without needing vinegar." },
  { name: 'Liquorice, chocolate and cardamom', hook: 'Liquorice and cardamom melt into an intense chocolate, without excess sugar.' },
  { name: 'Courgette and chrysanthemum', hook: 'Bitter, herbal chrysanthemum holds the sweetness of the roasted courgette.' },
];

// Current menu name and the 32 flowers it works with. Mirrors src/data/menu.js.
export const menuNombre = 'Solsticio floral';

export const flores = [
  'butterfly pea', 'electric daisy', 'daisy', 'hyssop', 'basil', 'garlic',
  'oxalis', 'linden', 'alder', 'star anise', 'geranium', 'fuchsia', 'oregano',
  'kalanchoe', 'mint', 'borage', 'lavender', 'cornflower', 'poppy', 'nasturtium',
  'fennel', 'lantana', 'elderflower', 'dahlia', 'star phlox', 'tagetes', 'calendula',
  'hibiscus', 'begonia', 'Aztec sweet herb', 'cosmos', 'chrysanthemum',
];

// The one left standing at the end is deliberately LAST in this array.
