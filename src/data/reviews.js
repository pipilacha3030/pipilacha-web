/* Prueba social. La valoración agregada es factual (Google 4,9 · 146 reseñas;
   TheFork 9,9). Cada reseña lleva una miniatura (`photo`): una foto de plato/mesa
   de la casa, no del cocinero — es el hilo visual del carrusel.

   ⚠️ SOLO RESEÑAS REALES. Nunca metas aquí citas inventadas o de relleno: todas
   deben ser fragmentos REALES de reseñas públicas (Google/TheFork). Para añadir
   una, copia el texto real y su autor. El carrusel de la home repite en bucle las
   que haya, así que con pocas basta. (La home además filtra cualquier entrada con
   `draft:true` por si alguna vez se deja una a medias — no se publicará.) */
export const aggregate = {
  rating: '4,9',
  ratingEn: '4.9',
  count: 146,
  // enlace a la ficha/reseñas en Google Maps (mismo destino que «Cómo llegar»)
  url: 'https://www.google.com/maps/search/?api=1&query=Pipilacha%2C%20C.%20del%20Azulejo%2C%202%2C%2028028%20Madrid',
};

export const reviewsEs = [
  { text: 'Las texturas, los sabores, la originalidad de los platos utilizando las flores.', author: 'Conchi H.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'Pipilacha no es simplemente un restaurante; es una experiencia construida con intención.', author: 'Reseña en TheFork', source: 'TheFork', photo: '/assets/img/df-vieira.jpg' },
  { text: 'Fui con mi madre y un amigo y viví una experiencia simplemente increíble.', author: 'Mel T.', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
];

export const reviewsEn = [
  { text: 'The textures, the flavours, the originality of the dishes using flowers.', author: 'Conchi H.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: "Pipilacha isn't simply a restaurant; it's built with intention.", author: 'TheFork review', source: 'TheFork', photo: '/assets/img/df-vieira.jpg' },
  { text: 'I went with my mother and a friend and had a simply incredible time.', author: 'Mel T.', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
];
