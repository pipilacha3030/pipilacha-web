/* Prueba social. La valoración agregada es factual (Google 4,9 · 146 reseñas;
   TheFork 9,9). Cada reseña lleva una miniatura (`photo`): una foto de plato/mesa
   de la casa, no del cocinero — es el hilo visual del carrusel.

   ⚠️ AUTENTICIDAD: solo las 3 primeras de cada idioma son fragmentos REALES de
   reseñas públicas. Las marcadas con `draft:true` son RELLENO para que el carrusel
   se vea lleno — reemplázalas por reseñas reales de Google/TheFork antes de publicar
   (o bórralas). No están inventadas para engañar: son un placeholder editable. */
export const aggregate = {
  rating: '4,9',
  ratingEn: '4.9',
  count: 146,
  // enlace a la ficha/reseñas en Google Maps (mismo destino que «Cómo llegar»)
  url: 'https://www.google.com/maps/search/?api=1&query=Pipilacha%2C%20C.%20del%20Azulejo%2C%202%2C%2028028%20Madrid',
};

export const reviewsEs = [
  // — REALES —
  { text: 'Las texturas, los sabores, la originalidad de los platos utilizando las flores.', author: 'Conchi H.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'Pipilacha no es simplemente un restaurante; es una experiencia construida con intención.', author: 'Reseña en TheFork', source: 'TheFork', photo: '/assets/img/df-vieira.jpg' },
  { text: 'Fui con mi madre y un amigo y viví una experiencia simplemente increíble.', author: 'Mel T.', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
  // — RELLENO editable (reemplazar por reseñas reales) —
  { text: 'Cada pase es una pequeña sorpresa. Sales con la sensación de haber probado algo que no existe en otro sitio.', author: 'Marta L.', source: 'Google', photo: '/assets/img/g12.jpg', draft: true },
  { text: 'Ver cómo lo cocinan a un metro, con las flores delante, es parte del espectáculo.', author: 'Diego R.', source: 'Google', photo: '/assets/img/df-guisante.jpg', draft: true },
  { text: 'Reservamos por un cumpleaños y fue redondo: atención cercana y un menú que no se parece a nada.', author: 'Reseña en TheFork', source: 'TheFork', photo: '/assets/img/g30.jpg', draft: true },
  { text: 'Sabores delicados y muy bien pensados. Las flores no son decoración, se notan en el plato.', author: 'Nerea F.', source: 'Google', photo: '/assets/img/g20.jpg', draft: true },
  { text: 'Un sitio para dejarse sorprender. Cada plato cuenta algo y las flores nunca fallan.', author: 'Lucía B.', source: 'Google', photo: '/assets/img/g5.jpg', draft: true },
  { text: 'Servicio impecable y muy cercano. Nos explicaron cada pase con pasión.', author: 'Javier M.', source: 'Google', photo: '/assets/img/g16.jpg', draft: true },
  { text: 'Sales con la sensación de haber vivido algo distinto, no solo de haber cenado.', author: 'Reseña en TheFork', source: 'TheFork', photo: '/assets/img/g25.jpg', draft: true },
  { text: 'Bocados preciosos y llenos de matices. Una mesa para repetir sin dudarlo.', author: 'Carmen S.', source: 'Google', photo: '/assets/img/g33.jpg', draft: true },
];

export const reviewsEn = [
  // — REAL —
  { text: 'The textures, the flavours, the originality of the dishes using flowers.', author: 'Conchi H.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: "Pipilacha isn't simply a restaurant; it's built with intention.", author: 'TheFork review', source: 'TheFork', photo: '/assets/img/df-vieira.jpg' },
  { text: 'I went with my mother and a friend and had a simply incredible time.', author: 'Mel T.', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
  // — PLACEHOLDER (replace with real reviews) —
  { text: 'Every course is a little surprise. You leave feeling you tasted something that exists nowhere else.', author: 'Marta L.', source: 'Google', photo: '/assets/img/g12.jpg', draft: true },
  { text: 'Watching them cook a metre away, flowers laid out in front of you, is part of the show.', author: 'Diego R.', source: 'Google', photo: '/assets/img/df-guisante.jpg', draft: true },
  { text: 'We booked for a birthday and it was perfect: warm service and a menu like nothing else.', author: 'TheFork review', source: 'TheFork', photo: '/assets/img/g30.jpg', draft: true },
  { text: 'Delicate, thoughtful flavours. The flowers are not decoration — you taste them.', author: 'Nerea F.', source: 'Google', photo: '/assets/img/g20.jpg', draft: true },
  { text: 'A place to let yourself be surprised. Every dish tells you something and the flowers never miss.', author: 'Lucía B.', source: 'Google', photo: '/assets/img/g5.jpg', draft: true },
  { text: 'Impeccable, warm service. They talked us through every course with real passion.', author: 'Javier M.', source: 'Google', photo: '/assets/img/g16.jpg', draft: true },
  { text: 'You leave feeling you lived something different, not just that you had dinner.', author: 'TheFork review', source: 'TheFork', photo: '/assets/img/g25.jpg', draft: true },
  { text: 'Beautiful bites, full of nuance. A table worth coming back to.', author: 'Carmen S.', source: 'Google', photo: '/assets/img/g33.jpg', draft: true },
];
