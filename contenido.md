# Pipilacha — Contenido web

Documento de copy final para la web. **Reglas para Claude Code:**

1. Usa los textos **tal cual** están aquí. No reescribas, no "mejores", no traduzcas literalmente al inglés sin avisar.
2. La jerarquía H1 / H2 / H3 marcada aquí se respeta en el HTML semántico.
3. Las metadescripciones van en `<meta>` tags, no se muestran en pantalla.
4. Cuando veas `[ALT: ...]` es el alt text de la foto que toca en esa posición.
5. Cuando veas `[CTA → /reservas]` significa botón que enlaza a esa ruta.
6. Idioma de la web: español. La versión EN se crea después como subdirectorio `/en/`.

---

## 1. PÁGINA: Inicio (`/`)

### SEO

- **Title tag**: Pipilacha · Restaurante de flores comestibles en Madrid
- **Meta description**: Menú degustación de 15 platos construido con flores comestibles como ingrediente principal. Madrid, jueves a domingo. 85€.
- **URL canónica**: `https://www.pipilacha.es/`

### Sección 1 — Hero

**H1 (oculto visualmente, visible para lectores y Google)**: Pipilacha, restaurante de flores comestibles en Madrid

**Eyebrow** (línea pequeña sobre el titular visual):
Madrid · Fuente del Berro

**Titular visual** (texto en pantalla, tipografía display grande):
La flor como ingrediente.

**Subtítulo** (una línea bajo el titular):
Quince platos donde las flores hacen el trabajo —de la acidez al perfume, del color al picor.

**CTA principal**: Reservar mesa [CTA → /reservas]
**CTA secundario** (link de texto): Ver el menú [CTA → /menu]

[ALT de la foto del hero: Plato del menú Despertar de las Flores fotografiado en plano cenital sobre fondo oscuro]

---

### Sección 2 — Qué es Pipilacha

**H2**: Qué es Pipilacha

**Cuerpo** (3 párrafos cortos, sin viñetas):

Pipilacha es una cocina de quince pases construida alrededor de las flores comestibles. Cada flor entra al plato por una razón concreta —una acidez, una textura, un aroma que no existe en ningún otro ingrediente—. No están para decorar.

El universo de las flores comestibles es enorme y poco explorado. Trabajamos con lo que ya conocemos —violetas, capuchinas, claveles, flores de sauco— y con lo que todavía estamos aprendiendo. El menú cambia con las estaciones porque la mayoría de estas flores solo existen durante unas semanas al año.

Somos 16 comensales por servicio. Cuatro días a la semana —jueves a domingo—. Dos turnos. Cada noche se cocina y se sirve para esa mesa.

[ALT de la foto: Detalle del pase de pétalos en cocina, manos colocando una flor sobre el plato]

---

### Sección 3 — Menú actual (preview)

**H2**: Despertar de las Flores

**Eyebrow**: Menú de primavera

**Cuerpo** (2 líneas):
Quince pases que recorren la primavera tal como llega a la mesa: del primer brote a la flor abierta, del fermento que lleva meses preparándose a la fruta que se acaba de cortar.

**Datos visibles como texto**:
- 15 pases
- 85 € por persona
- Maridaje opcional

**CTA**: Ver el menú completo [CTA → /menu]

[ALT de la foto: Composición de uno de los pases del menú, idealmente uno que muestre flores con claridad técnica —el taco de tila o el pase de degustación floral]

---

### Sección 4 — Reservas (avance)

**H2**: Reservar en Pipilacha

**Cuerpo** (2 líneas):
16 plazas por servicio. Jueves a domingo, dos turnos: 14:00 y 21:00. Se reserva con antelación.

**CTA principal**: Reservar mesa [CTA → /reservas]
**Datos a la vista**:
- Teléfono: +34 919 12 59 98
- Email: admin@pipilacha.es

---

### Sección 5 — Footer (común a todas las páginas)

**Columna 1 — Dirección**
C. del Azulejo, 2
28009 Madrid
Fuente del Berro

**Columna 2 — Contacto**
+34 919 12 59 98
admin@pipilacha.es

**Columna 3 — Horarios**
Jueves a domingo
Comida: 14:00
Cena: 21:00
Lunes a miércoles cerrado

**Columna 4 — Enlaces**
- Menú
- Vinos y fermentos
- Conócenos
- Reservas
- Prensa
- Instagram: @restaurante.pipilacha

**Línea legal final**:
© 2026 Pipilacha · Aviso legal · Política de privacidad

---

## 2. PÁGINA: Menú (`/menu`)

### SEO

- **Title tag**: Menú Despertar de las Flores · Pipilacha
- **Meta description**: 15 pases de primavera con flores comestibles como ingrediente principal. Menú degustación de Pipilacha en Madrid, 85€.
- **URL canónica**: `https://www.pipilacha.es/menu`

### Sección 1 — Cabecera

**H1**: Despertar de las Flores

**Eyebrow**: Menú de primavera 2026

**Cuerpo** (3 líneas):
Quince pases. La estructura de la primavera convertida en cocina: el primer verde, la flor recién abierta, el fermento que llevaba meses esperando, la fruta del final. Las flores aparecen en cada plato con una función concreta —no como adorno.

**Datos a la vista** (línea horizontal):
15 pases · 85 € · Maridaje 35 € · Jueves a domingo

---

### Sección 2 — El menú (lista de pases)

**H2**: Los pases

> Nota para Claude Code: cada pase se renderiza como un bloque editorial, no como una "card" de SaaS. Número grande, título del pase, una línea de descripción discreta. Sin botones, sin badges, sin precios por plato.

**01 — Bienvenida**
Polvo de pieles quemadas, miel, miso, guisante mariposa y flor eléctrica.

**02 — Degustación floral**
Borraja, oxalis, romero, begonia y lágrima virgen para empezar a leer las flores.

**03 — Taco de tila y flor de higo**
Harina de tila, cremas, aliso y tartar de manzana, mango y finger lime.

**04 — Tartar de vieira con verbena**
Hibiscus, pentax y suero de cebolleta.

**05 — Limpiador de hierbaluisa**
Alelí y yuzu. El plato cambia de color en la mesa.

**06 — Los panes**
Aciano con mantequilla de caléndulas y dalia. Puerro con amapola. Maíz con pipas y teff.

**07 — Guisantes**
Leche de coco, flor de sauco y shiso.

**08 — Espárragos a la brasa**
Romesco con tagete y coreopsis.

**09 — Tupinambo**
24 horas a baja temperatura con lavanda. Crudités y nemesia.

**10 — Caballa**
Flor de hinojo, cheong de glicinias, falsa acacia y campánula.

**11 — Atún de Cádiz**
Margaritas en ponzu, manzanilla, kalanchoe. Ventresca y lomo con limón negro.

**12 — Ternera al robata**
Salsa unagi, flor de kale, albahaca tailandesa, milenrama, rabanitos y vinagreta de mostaza e higos.

**13 — Torrija**
Brioche, nata de mandarina, capuchina y cheong de kumquat.

**14 — Fresas y claveles**
Sopa de chocolate blanco, mousse de fresas y claveles, fresón rallado congelado, chocolate blanco cristalizado y geranio.

**15 — Despedida**
Sorpresa de la casa.

---

### Sección 3 — Cierre del menú

**H2**: Cómo se sirve

**Cuerpo** (2 párrafos cortos):

El menú es único —se sirve completo o no se sirve—. Cada pase se cuenta brevemente en mesa: qué flor entra, qué hace, de dónde viene la idea. Algunos cambian visualmente en la mesa, otros se terminan con manos.

Si tienes alguna alergia o restricción, avísanos al reservar. Adaptamos lo que se pueda; lo que no, lo decimos.

**CTA**: Reservar mesa [CTA → /reservas]

---

## 3. PÁGINA: Vinos y fermentos (`/vinos-y-fermentos`)

### SEO

- **Title tag**: Vinos y fermentos · Pipilacha
- **Meta description**: La carta de vinos y los fermentos de la casa que acompañan al menú Despertar de las Flores en Pipilacha.
- **URL canónica**: `https://www.pipilacha.es/vinos-y-fermentos`

### Sección 1 — Cabecera

**H1**: Vinos y fermentos

**Cuerpo** (3 líneas):
Cada pase del menú tiene una bebida pensada al lado —vinos, kombuchas, kéfires y cheongs que hacemos en casa—. El maridaje no es un añadido. Es la otra mitad del plato.

---

### Sección 2 — La carta de vinos

**H2**: La carta

**Cuerpo** (3 párrafos):

La carta es corta. Cabe en dos manos. Cada vino entra por la misma lógica que las flores: porque hace algo concreto al lado de un plato, no porque tenga una etiqueta conocida.

Trabajamos con productores pequeños del norte y del centro peninsular, pero también con referencias de Alsacia, Mosela y la Borgoña cuando el menú lo pide. La carta cambia con el menú —primavera no se acompaña como otoño—.

El maridaje completo son siete copas, diseñadas para el menú actual. 35 € por persona. Se puede pedir media tabla o ir a la carta si se prefiere.

**CTA**: Ver carta de vinos completa (PDF) [enlace al PDF actualizado]

---

### Sección 3 — Los fermentos de la casa

**H2**: Lo que hacemos en casa

**Cuerpo** (3 párrafos):

Buena parte de las bebidas no alcohólicas las hacemos aquí. Llevan meses, a veces más de un año, esperando a entrar en el menú.

Los **cheongs** son macerados de fruta o flor con azúcar —los de glicinia, kumquat y rosa aparecen en varios pases del menú actual—. Las **kombuchas** llevan tés de base distintos y se aromatizan con flores de la temporada. Los **kéfires de agua** los usamos como base para acidez en cocina o como bebida sola.

Para quien no bebe alcohol, hay un maridaje sin alcohol construido con estos fermentos. Mismo precio, 35 €, misma estructura: siete copas pensadas al lado del menú.

---

### Sección 4 — Maridaje sin alcohol

**H2**: Maridaje sin alcohol

**Cuerpo** (2 líneas):
Siete copas de fermentos de la casa pensadas al lado del menú Despertar de las Flores. Cheongs, kombuchas y kéfires aromatizados con flores. 35 € por persona.

**Nota** (línea pequeña):
Aviso al reservar si quieres este maridaje, para tenerlo preparado.

---

### Sección 5 — Cómo pedirlo

**H2**: Cómo se sirve

**Cuerpo** (2 líneas):
El maridaje se decide al sentarse, no hace falta avisar al reservar —salvo el sin alcohol—. Si tienes alguna preferencia (más blancos, menos cuerpo, alguna referencia que quieras evitar), dilo al principio y lo ajustamos.

**CTA**: Reservar mesa [CTA → /reservas]

---

## 4. PÁGINA: Conócenos (`/conocenos`)

### SEO

- **Title tag**: Conócenos · Arán y Noé, Pipilacha
- **Meta description**: Pipilacha lo abrieron Arán Rodrigo y Noé David en 2025 en Madrid. Una cocina entera construida sobre las flores comestibles.
- **URL canónica**: `https://www.pipilacha.es/conocenos`

### Sección 1 — Cabecera

**H1**: Arán y Noé

**Eyebrow**: Quiénes están detrás

[ALT de la foto: Arán Rodrigo y Noé David en la cocina de Pipilacha, foto vertical 4:5, sin posar]

---

### Sección 2 — El encuentro

**H2**: Cómo empezó

**Cuerpo** (3 párrafos):

Arán y Noé se conocieron en la Escuela de Hostelería de Alcalá de Henares. Coincidieron después en la cocina de Ramón Freixa, y ahí terminó de fraguarse la idea de abrir algo propio —algo que no se pareciera a nada de lo que habían estado haciendo—.

Arán había pasado antes por El Invernadero, Krudo y Cobo Burgos. Esa mezcla de cocinas —vegetal radical, técnica fría, fermentación, casa de producto— marca lo que hoy es Pipilacha más de lo que parece.

Pipilacha abrió en 2025. Una sola mesa larga al principio, mucho ensayo, y una pregunta clara: ¿qué pasa si una cocina entera se construye alrededor de las flores comestibles?

---

### Sección 3 — La cocina

**H2**: Cómo se cocina aquí

**Cuerpo** (3 párrafos):

La cocina de Pipilacha es pequeña. Cuatro personas en servicio. Cada pase pasa por las manos de Arán o de Noé antes de salir. No hay un menú alternativo —se sirve Despertar de las Flores o no se cena—.

El trabajo de fondo ocurre fuera del servicio: los fermentos, los cheongs, las kombuchas, las pruebas con flores nuevas. Cada flor que entra al menú ha pasado meses en cocina —probada cruda, cocinada, fermentada, infusionada— antes de que decidamos cómo entra al plato.

El menú cambia varias veces al año. La primavera no se cocina como el invierno, y no todas las flores existen todo el año. Esa rotación obliga a empezar de cero cada estación, y nos gusta así.

---

### Sección 4 — El equipo

**H2**: El equipo

**Cuerpo** (2 párrafos):

En sala está **Jonah Moyetones**, que se encarga de recibir, contar el menú en mesa y llevar la comunicación con la prensa. Es la voz que oirás cuando cuentes con alguna alergia, cuando preguntes por un vino o cuando quieras saber qué flor estás comiendo.

En cocina, con Arán y Noé, trabajan dos cocineros más. Lo que cabe en Pipilacha cabe en cuatro personas.

---

### Sección 5 — Dónde estamos

**H2**: Dónde estamos

**Cuerpo** (1 párrafo):

Pipilacha está en la calle del Azulejo, 2, en la Fuente del Berro —un barrio tranquilo, residencial, a seis minutos a pie del metro Manuel Becerra—. El local tiene 16 plazas: una barra de 8, una mesa de 4 y dos mesas de 2. No hay reservados ni privados. Cuando comes en Pipilacha, comes en la misma sala que el resto.

**CTA**: Reservar mesa [CTA → /reservas]

---

## 5. PÁGINA: Reservas y contacto (`/reservas`)

### SEO

- **Title tag**: Reservar en Pipilacha · Madrid
- **Meta description**: Reserva tu mesa en Pipilacha. Restaurante de flores comestibles en Madrid, 16 plazas por servicio, jueves a domingo.
- **URL canónica**: `https://www.pipilacha.es/reservas`

### Sección 1 — Cabecera

**H1**: Reservar mesa en Pipilacha

**Cuerpo** (3 líneas):
Hay 16 plazas por servicio. Reservar con antelación es necesario casi siempre —la mayoría de servicios se completan con días o semanas de margen—. Si no encuentras hueco, escríbenos por email: a veces aparecen huecos de última hora.

---

### Sección 2 — Datos del servicio

**H2**: El servicio

**Bloque de datos** (formato editorial, no tabla):

**Horarios**
Jueves a domingo
Comida: 14:00 · Cena: 21:00

**Menú**
Despertar de las Flores
15 pases · 85 € por persona
Maridaje opcional: 35 €

**Capacidad**
16 plazas por servicio
Barra de 8 · Mesa de 4 · Dos mesas de 2

**Duración aproximada**
Comida: 2 h 30 min
Cena: 3 h

---

### Sección 3 — Cómo reservar

**H2**: Cómo reservar

**Opción 1 — Online (recomendado)**
[Botón grande: Reservar por TheFork → enlace al widget]

**Opción 2 — Por teléfono**
+34 919 12 59 98
Atendemos llamadas de jueves a domingo entre 11:00 y 14:00.

**Opción 3 — Por email**
admin@pipilacha.es
Respondemos en 24 horas.

---

### Sección 4 — Alergias, regalos y otros

**H2**: Antes de venir

**Alergias e intolerancias**
Indícalo al reservar. Adaptamos lo que se pueda; lo que no, te lo decimos antes de que vengas.

**Tarjetas regalo**
Disponibles para el menú completo. Escríbenos a admin@pipilacha.es.

**Grupos privados**
Para reservas privadas del restaurante completo, contacta directamente con nosotros.

---

### Sección 5 — Cómo llegar

**H2**: Llegar a Pipilacha

**Dirección**
C. del Azulejo, 2
28009 Madrid · Fuente del Berro

**Metro más cercano**
Manuel Becerra (L2, L6) — 6 minutos a pie

**Aparcamiento**
Parking público en C. del Doctor Esquerdo

[Mapa embed Google Maps]

---

## 6. PÁGINA: Prensa (`/prensa`)

### SEO

- **Title tag**: Prensa · Pipilacha
- **Meta description**: Material para medios y dossiers de Pipilacha, restaurante de flores comestibles en Madrid. Contacto: Jonah Moyetones.
- **URL canónica**: `https://www.pipilacha.es/prensa`

### Sección 1 — Cabecera

**H1**: Prensa

**Cuerpo** (2 líneas):
Material para medios, fotografías de alta resolución y dossier de prensa. Para entrevistas, visitas o solicitudes específicas, escribe directamente a Jonah.

---

### Sección 2 — Contacto de prensa

**H2**: Contacto

**Jonah Moyetones**
Comunicación y sala
moyetonesjonah@gmail.com

---

### Sección 3 — Descargas

**H2**: Material descargable

- **Dossier de prensa (PDF, ES/EN)** — 29 páginas
- **Pack de fotografías** — alta resolución, créditos incluidos
- **Logo y biblioteca de marca** — versiones para fondo claro y oscuro

[Cada uno es un bloque de descarga con título, peso del archivo y botón]

---

### Sección 4 — Apariciones

**H2**: En los medios

> Nota para Claude Code: listado editorial simple, no carrusel. Una línea por aparición: medio + título del artículo + fecha + enlace. Conforme vayan saliendo publicaciones se va añadiendo. Inicialmente puede ir vacío con un texto placeholder.

**Placeholder si la sección está vacía**:
Próximamente.

---

## 7. ELEMENTOS COMUNES

### Navegación principal

Logo (lleva a /) · Menú · Vinos · Conócenos · Reservas

> Prensa **no aparece en la navegación principal**. Va solo en el footer. Es una página para periodistas, no para clientes. Mantener cinco enlaces en la nav (incluido logo + cuatro) deja la cabecera respirable.
> No hay un enlace "Inicio". El logo cumple esa función. No hay menú hamburguesa en desktop. En móvil sí, en formato minimal (tres líneas finas, no icono grueso). El menú móvil sí incluye Prensa como último enlace.

### Botón "Reservar" flotante

Visible en todas las páginas excepto `/reservas`. Sticky bottom-right en móvil, esquina superior derecha en desktop. Estilo: Terracotta sobre Fresh Cream, sin borde, sin sombra exagerada.

### 404

**Titular**: Aquí no hay nada.
**Cuerpo**: La página que buscabas no existe o ya no está. Vuelve al inicio o mira el menú.
**CTAs**: Inicio · Menú

---

## 8. VERSIÓN INGLESA (cuando llegue el momento)

Cuando estemos listos para `/en/`, NO se traduce literalmente. Se reescribe con la misma intención pero registro ligeramente más informativo (los lectores internacionales no conocen Madrid).

Palabras que NO se traducen nunca:
- Pipilacha
- Despertar de las Flores
- Nombres de los pases del menú (cheong, robata, ponzu)
- Nombres propios de las flores en español (flor de higo, flor de sauco) — se pueden acompañar con el nombre en inglés entre paréntesis la primera vez

---

## NOTA EDITORIAL FINAL

Este documento es la fuente de verdad del copy. Si algún texto en la web no coincide con lo que está aquí, hay que cambiarlo en la web —no aquí—. Y si quieres modificar copy, hazlo en este archivo primero y luego pides el cambio a Claude Code apuntando aquí.
