/* Prueba social. La valoración agregada es factual (Google 4,9 · 156 reseñas;
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
  count: 156,
  // TheFork usa escala 0-10; mismo dato factual, antes solo vivía en este comentario
  thefork: '9,9',
  theforkEn: '9.9',
  // enlace a la ficha/reseñas en Google Maps (mismo destino que «Cómo llegar»)
  url: 'https://www.google.com/maps/search/?api=1&query=Pipilacha%2C%20C.%20del%20Azulejo%2C%202%2C%2028028%20Madrid',
};

/* Orden pensado para el carrusel: las reseñas de autores con nombre parecido
   (Nuria / Nuria G., Conchi / Conchi H. C., Mel T. / Mel Timón) van separadas
   para que nunca caigan juntas en el raíl. Las fotos rotan sin repetirse en
   tarjetas vecinas (también al envolver el bucle). */
export const reviewsEs = [
  { text: 'Las texturas, los sabores, la originalidad de los platos utilizando las flores.', author: 'Conchi H.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'Fui con mi madre y un amigo a Pipilacha y viví una experiencia simplemente increíble. Éramos solo cinco comensales para dos auténticos cracks, súper simpáticos y cercanos.', author: 'Mel Timón Sierra', source: 'Google', photo: '/assets/img/df-vieira.jpg' },
  { text: 'Pipilacha no es simplemente un restaurante; es una experiencia construida con intención.', author: 'Reseña en TheFork', source: 'TheFork', photo: '/assets/img/df-mandarina.jpg' },
  { text: 'Una experiencia gastronómica excepcional. El menú degustación fue una auténtica sorpresa: sabores únicos y combinaciones muy originales, perfectamente equilibradas.', author: 'Nuria', source: 'Google', photo: '/assets/img/df-guisante.jpg' },
  { text: '¡Mucho más que cocina, es pura magia floral! Arán y Noé han creado algo que no se parece a nada que hayas probado antes.', author: 'Alberto C.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'Totalmente recomendado. La comida está deliciosa y es todo un espectáculo sensorial, con una mezcla de productos y sabores clásicos y originales.', author: 'Manuel Martín-Vivaldi', source: 'Google', photo: '/assets/img/df-vieira.jpg' },
  { text: 'Experiencia espectacular y sorprendente. Las texturas, los sabores, la originalidad de los platos utilizando las flores como protagonistas, hacen que sea única e inolvidable.', author: 'Conchi Hernández Caro', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
  { text: 'Volveremos, recomendaremos y disfrutaremos otra vez. Lo pasamos de maravilla: la cercanía, la amabilidad y la experiencia que te llevas.', author: 'Alex Martínez', source: 'Google', photo: '/assets/img/df-guisante.jpg' },
  { text: '¡Increíble! Un viaje a través de las flores inolvidable. Los chefs Arán y Noé nos han hecho disfrutar de cada plato. Volveremos sin duda a este lugar diferente y especial.', author: 'Nuria G.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'Experiencia inolvidable en este maravilloso local donde la comida fue magnífica, con un servicio excepcional por parte de los 3 artífices del lugar.', author: 'Pablo Reigosa', source: 'Google', photo: '/assets/img/df-vieira.jpg' },
  { text: 'Fui con mi madre y un amigo y viví una experiencia simplemente increíble.', author: 'Mel T.', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
  { text: 'Una experiencia digna de admirar. Lo hacen todo genial y hay muy buena sintonía. Nos gustó mucho la vieira, el taco y el plato con caléndula.', author: 'Tamara Rosón', source: 'Google', photo: '/assets/img/df-guisante.jpg' },
  { text: 'Una experiencia de 10. Los Chefs, Arán y Noé, son unos verdaderos profesionales con muchísimo talento y muy cercanos. El menú es súper equilibrado y todo exquisito.', author: 'María Paulina Jiménez', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
];

export const reviewsEn = [
  { text: 'The textures, the flavours, the originality of the dishes using flowers.', author: 'Conchi H.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'I went to Pipilacha with my mother and a friend and had a simply incredible experience. We were only five diners with two authentic masters, super friendly and approachable.', author: 'Mel Timón Sierra', source: 'Google', photo: '/assets/img/df-vieira.jpg' },
  { text: "Pipilacha isn't simply a restaurant; it's built with intention.", author: 'TheFork review', source: 'TheFork', photo: '/assets/img/df-mandarina.jpg' },
  { text: 'An exceptional gastronomic experience. The tasting menu was a real surprise: unique flavours and very original combinations, perfectly balanced.', author: 'Nuria', source: 'Google', photo: '/assets/img/df-guisante.jpg' },
  { text: 'Much more than cooking, it\'s pure floral magic! Arán and Noé have created something like nothing you\'ve ever tasted before.', author: 'Alberto C.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'Highly recommended. The food is delicious and it\'s a complete sensory spectacle, with a mix of classic and original products and flavours.', author: 'Manuel Martín-Vivaldi', source: 'Google', photo: '/assets/img/df-vieira.jpg' },
  { text: 'Spectacular and surprising experience. The textures, the flavours, the originality of the dishes using flowers as the main ingredient make it unique and unforgettable.', author: 'Conchi Hernández Caro', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
  { text: 'We\'ll return, we\'ll recommend it and we\'ll enjoy it again. We had a wonderful time: the closeness, the kindness and the experience you take with you.', author: 'Alex Martínez', source: 'Google', photo: '/assets/img/df-guisante.jpg' },
  { text: 'Incredible! A journey through unforgettable flowers. Chefs Arán and Noé made us enjoy every dish. We will definitely return to this different and special place.', author: 'Nuria G.', source: 'Google', photo: '/assets/img/df-esparrago.jpg' },
  { text: 'An unforgettable experience in this wonderful place where the food was magnificent, with exceptional service from the 3 creators of the place.', author: 'Pablo Reigosa', source: 'Google', photo: '/assets/img/df-vieira.jpg' },
  { text: 'I went with my mother and a friend and had a simply incredible time.', author: 'Mel T.', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
  { text: 'An experience worthy of admiration. They do everything great and there\'s very good synergy. We particularly loved the scallop, the taco and the dish with calendula.', author: 'Tamara Rosón', source: 'Google', photo: '/assets/img/df-guisante.jpg' },
  { text: 'A 10/10 experience. The Chefs, Arán and Noé, are truly talented professionals with tremendous talent and very approachable. The menu is super balanced and everything is exquisite.', author: 'María Paulina Jiménez', source: 'Google', photo: '/assets/img/df-mandarina.jpg' },
];
