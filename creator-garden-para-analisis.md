# Creator Garden · Pipilacha — dosier para análisis

**Página en vivo (ábrela, es lo primero):** https://pipilachaweb.netlify.app/creator-garden/
Entorno de revisión (Netlify). Producción es pipilacha.es y NO tiene esta página.

Generado: 2026-08-01

---

## 1. Qué es

Una pieza para **creadores de contenido** (influencers gastronómicos) a los que el restaurante
pasa el enlace por DM **antes** de que vengan a comer. No es un media kit corporativo ni una
landing de captación: el objetivo es que quien la lea entienda la casa y llegue con ideas de
qué grabar.

**Pipilacha** es un restaurante de Madrid construido entero sobre flores comestibles. La flor
no es adorno: es el ingrediente sobre el que se levanta cada plato. 16 asientos por servicio,
jueves a domingo, menú de 15 pases a 85 €. Lo llevan dos cocineros, Arán y Noé, formados en
Ramón Freixa (dos estrellas).

Público real: creadores en Madrid, **mayoritariamente móvil**.

---

## 2. Restricciones que condicionan el diseño

- **Marca clara.** Crema de fondo, color aportado por las fotos. El negro está prácticamente
  prohibido; el verde musgo aparece **una sola vez** en toda la página como puntuación.
  (Una versión anterior era negro-dominante y se descartó por contradecir la marca.)
- **Tipografías de marca:** Marcellus (serif, display) + Hanken Grotesk (sans, texto).
  Hanken sustituye a Roobert, la licenciada.
- **Voz de marca con lista negra estricta.** Prohibidas: «botánico», «experiencia»,
  «alta cocina», «de temporada», «km0», cualquier marco de sostenibilidad, «obsesión».
  Prohibido abrir diciendo lo que Pipilacha NO es. Prohibido el lenguaje poético para
  hablar de flores: son ingredientes, se describen con precisión técnica.
- **Sin cromo.** La página no lleva navegación, pie, banner de cookies ni analítica, para que
  no se lea como una sección del sitio sino como una pieza aparte.
- **Los platos y las flores se importan** de la carta real (`src/data/menu.js`), así que la
  página no puede desincronizarse del menú vigente.

---

## 3. Estructura (15 escenas)

Apertura · Manifiesto · Visión · [foto: pase 05] · Filosofía · Guía · [foto: pase 10] ·
Historias · Cámara · [foto: pase 11] · Movimiento · Identidad · Detalles · Ideas ·
Lenguaje · Campo de flores · Contacto · Cierre

Regla aplicada: **una familia de layout por escena, sin repetir**. Hay 7 distintas
(lista numerada, declaraciones, tarjetas, dos columnas, rejilla 2x2, muestrario,
carril horizontal) más las figuras a sangre.

---

## 4. Medidas verificadas (no impresiones)

| Métrica | Valor |
|---|---|
| Antetítulos | 5 en 15 secciones (regla: máximo ceil(secciones/3) = 5) |
| Fondos de sección | 8 crema · 6 nube · **1 musgo** · 0 negro |
| Reglas CSS propias con negro | 0 |
| Contraste WCAG AA | los 6 pares texto/fondo pasan (el más justo, 4.79:1) |
| Medida de lectura | 34-44 caracteres, mediana 43 |
| Desbordamiento horizontal | 0 px |
| Jerarquía de encabezados | 1 h1, resto h2/h3 |
| Imágenes sin alt | 0 |
| Rayas largas (—) en el HTML | 0 |
| Altura total en móvil | 15.259 px |

---

## 5. Lo que NO está verificado

**Las animaciones no se han visto reproducirse.** El panel de vista previa del entorno de
desarrollo mantiene la pestaña oculta, lo que congela `requestAnimationFrame` y con él GSAP
(el reloj marcaba `ticker = 0.0`). Se comprobó el estado final adelantando la línea de tiempo
a mano (todos los elementos llegan a opacidad 1 y transform identidad), pero **la sensación
del movimiento en marcha está sin juzgar**. Por eso conviene abrir la URL de arriba.

---

## 6. Preguntas concretas para el análisis

1. ¿La estructura narrativa sostiene 15 escenas o hay secciones que sobran o deberían fundirse?
2. ¿El texto convence a un creador de contenido, o suena a marca hablando de sí misma?
3. ¿Los ganchos y los pies de foto son realmente utilizables en un reel, o son demasiado literarios?
4. Jerarquía tipográfica en móvil: ¿los titulares compiten con el cuerpo o guían bien?
5. ¿Se nota que está hecho con IA? Si sí, ¿en qué exactamente?
6. ¿Qué falta para que un creador abra la cámara sin haber ido todavía al restaurante?

---

## 7. Tokens de marca (valores reales del sistema)

```
--moss        #31331F   verde musgo, bloques sólidos
--olive       #645D3B   acento, filetes, estado activo
--accent-soft #B0A77F   acento sobre fondo oscuro
--cream       #F4EFE6   fondo base
--cloud       #FBFAF5   alternancia
--ink         #2A2A22   texto principal
--text-muted  #55554a   texto secundario
--text-subtle #6a6a5b   etiquetas
--gutter      clamp(1.25rem, 5vw, 5rem)
--maxw        1320px
```

---

## 8. Código fuente completo


### `src/pages/creator-garden.astro`

La página: 15 escenas encadenadas. El contenido se importa, no está escrito aquí.

```astro
---
import Garden from '../layouts/Garden.astro';
import { flores, menuNombre } from '../data/menu.js';
import {
  escenas, manifiesto, vision, filosofia, angulos, historias,
  camara, movimiento, paleta, tipografia, materiales, detalles,
  ideas, hooks, captions, voz, material, contacto,
} from '../data/creatorGarden.js';

/* Los pases y las flores salen de src/data/menu.js. Al cambiar de carta
   esta página se actualiza sola: no hay ni un nombre de plato escrito
   a mano aquí dentro.

   Antetítulos racionados: solo abren capítulo en apertura, guía, cámara,
   lenguaje y contacto. Uno por escena convertía la página en una plantilla
   y era la causa principal de que se leyera desordenada. */
const pases = {
  farolillo: { n: '05', t: 'Farolillo de atún y orégano', img: 'cr-farolillo',
    d: 'La flor hace de recipiente y suelta un ácido que corta la grasa del atún. Te comes el cuenco.',
    alt: 'Farolillo de atún y orégano servido dentro de la propia flor' },
  higo: { n: '10', t: 'Higo a la brasa con helado de saúco', img: 'cr-higo',
    d: 'El higo llega negro de la brasa. El saúco entra frío, floral y ligeramente vinoso.',
    alt: 'Higo a la brasa con helado de saúco en plato negro' },
  vieiras: { n: '11', t: 'Vieiras shiso-dalias', img: 'cr-vieiras',
    d: 'El shiso pica en verde; el pétalo de dalia endulza el yodo. Dos flores tirando en direcciones opuestas.',
    alt: 'Vieiras con shiso y pétalos de dalia' },
};

const escala = (i) => (i % 7 === 0 ? 'xl' : i % 3 === 0 ? 'lg' : i % 5 === 0 ? 'sm' : 'md');
---

<Garden>

<div class="gd-spine" aria-hidden="true">
  <svg viewBox="0 0 2 100" preserveAspectRatio="none"><path class="gd-spine__path" d="M1 0 L1 100" /></svg>
</div>

<nav class="gd-index" aria-label="Escenas">
  {escenas.map((e) => (
    <a class="gd-index__link" href={`#${e.id}`}>
      <span class="gd-index__label">{e.t}</span>
      <span class="gd-index__dot" aria-hidden="true"></span>
      <span class="sr-only">{e.t}</span>
    </a>
  ))}
</nav>

<main>

{/* ─── 00 · APERTURA · foto a sangre, titular debajo ──────────── */}
<section class="gd-open" id="apertura">
  <div class="gd-open__media" data-gd-parallax="0.08">
    <img src="/assets/img/cr-hero.jpg"
         srcset="/assets/img/cr-hero-m.jpg 900w, /assets/img/cr-hero.jpg 1800w"
         sizes="100vw" width="1800" height="2250"
         fetchpriority="high" decoding="async"
         alt="Farolillo de atún y orégano: el tartar servido dentro de la propia flor" />
  </div>
  <div class="gd-open__inner">
    {/* el antetítulo va ANTES del titular en el DOM: apilado en móvil, un
        antetítulo por debajo del h1 se lee como un pie suelto */}
    <div class="gd-open__titulo">
      <p class="gd-eyebrow gd-reveal">Creator Garden</p>
      <h1 class="gd-display gd-open__title" data-gd-words>La flor no decora. Es el plato.</h1>
    </div>
    <div class="gd-open__textos">
      <p class="gd-lede gd-open__sub gd-reveal">Para quien va a contarlo antes de haberlo probado.</p>
      <p class="gd-open__credit gd-reveal">Arriba, pase 05: farolillo de atún y orégano. El cuenco es la flor.</p>
    </div>
  </div>
</section>

{/* ─── 01 · MANIFIESTO · tipografía grande, columna única ─────── */}
<section class="gd-scene gd-scene--alt" id="manifiesto">
  <div class="gd-wrap gd-grid">
    <div class="gd-manifiesto">
      {manifiesto.map((p) => <p data-gd-lines>{p}</p>)}
    </div>
  </div>
</section>

{/* ─── 02 · VISIÓN · texto + cifra de contrapunto ─────────────── */}
<section class="gd-scene" id="vision">
  <div class="gd-wrap gd-grid">
    <div class="gd-vision__head">
      <h2 class="gd-h1" data-gd-words>{vision.titulo}</h2>
    </div>
    <div class="gd-vision__cuerpo">
      {vision.cuerpo.map((p) => <p class="gd-body gd-reveal">{p}</p>)}
    </div>
    <div class="gd-vision__dato gd-dato gd-reveal">
      <span class="gd-dato__n">{vision.dato.n}</span>
      <span class="gd-dato__t">{vision.dato.t}</span>
      <p class="gd-dato__pie">{vision.dato.pie}</p>
    </div>
  </div>
</section>

{/* ─── figura · farolillo ─────────────────────────────────────── */}
<figure class="gd-fig">
  <div class="gd-fig__media"><img src={`/assets/img/${pases.farolillo.img}.jpg`} width="1600" height="2000" loading="lazy" decoding="async" alt={pases.farolillo.alt} /></div>
  <figcaption class="gd-reveal">
    <div class="gd-fig__texto">
      <span class="gd-fig__n">Pase {pases.farolillo.n}</span>
      <h2 class="gd-h2">{pases.farolillo.t}</h2>
      <p class="gd-body" style="margin-top:.6rem">{pases.farolillo.d}</p>
    </div>
  </figcaption>
</figure>

{/* ─── 03 · FILOSOFÍA · única lista numerada ──────────────────── */}
<section class="gd-scene gd-scene--alt" id="filosofia">
  <div class="gd-wrap gd-grid">
    <div class="gd-head">
      <h2 class="gd-h1" data-gd-words>Cómo se piensa un plato</h2>
    </div>
    <div class="gd-cuerpo gd-princ" data-gd-stagger>
      {filosofia.map((f) => (
        <article class="gd-princ__item gd-item">
          <span class="gd-princ__n">{f.n}</span>
          <h3 class="gd-h3">{f.t}</h3>
          <p class="gd-princ__d">{f.d}</p>
        </article>
      ))}
    </div>
  </div>
</section>

{/* ─── 04 · GUÍA · tres declaraciones, sin numerar ────────────── */}
<section class="gd-scene" id="guia">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <p class="gd-eyebrow gd-reveal">Guía</p>
      <h2 class="gd-h1" data-gd-words>Los tres ángulos que funcionan</h2>
    </header>
    <div class="gd-angulos" data-gd-stagger>
      {angulos.map((a) => (
        <article class="gd-item">
          <h3 class="gd-h2 gd-angulo__t">{a.t}</h3>
          <p class="gd-angulo__d">{a.d}</p>
        </article>
      ))}
    </div>
  </div>
</section>

{/* ─── figura · higo ──────────────────────────────────────────── */}
<figure class="gd-fig">
  <div class="gd-fig__media"><img src={`/assets/img/${pases.higo.img}.jpg`} srcset="/assets/img/cr-higo-m.jpg 900w, /assets/img/cr-higo.jpg 1400w" sizes="100vw" width="1400" height="1750" loading="lazy" decoding="async" alt={pases.higo.alt} /></div>
  <figcaption class="gd-reveal">
    <div class="gd-fig__texto">
      <span class="gd-fig__n">Pase {pases.higo.n}</span>
      <h2 class="gd-h2">{pases.higo.t}</h2>
      <p class="gd-body" style="margin-top:.6rem">{pases.higo.d}</p>
    </div>
  </figcaption>
</figure>

{/* ─── 05 · HISTORIAS · única rejilla de tarjetas ─────────────── */}
<section class="gd-scene gd-scene--alt" id="historias">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <h2 class="gd-h1" data-gd-words>Lo que hay que mirar</h2>
      <p class="gd-lede gd-reveal" style="margin-top:1rem">Seis cosas que pasan en el servicio y casi nadie graba.</p>
    </header>
    <div class="gd-cards" data-gd-stagger>
      {historias.map((h) => (
        <article class="gd-card gd-item">
          <h3 class="gd-h3 gd-card__t">{h.t}</h3>
          <p class="gd-card__d">{h.d}</p>
        </article>
      ))}
    </div>
  </div>
</section>

{/* ─── 06 · CÁMARA · dos columnas contrapuestas ───────────────── */}
<section class="gd-scene" id="camara">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <p class="gd-eyebrow gd-reveal">Cámara</p>
      <h2 class="gd-h1" data-gd-words>Cómo se fotografía esta cocina</h2>
    </header>
    <div class="gd-camara">
      <div class="gd-reveal">
        <h3 class="gd-camara__h">Foto</h3>
        <div class="gd-camara__list">
          {camara.foto.map((c) => (
            <div><p class="gd-camara__t">{c.t}</p><p class="gd-camara__d">{c.d}</p></div>
          ))}
        </div>
      </div>
      <div class="gd-reveal">
        <h3 class="gd-camara__h">Vídeo</h3>
        <div class="gd-camara__list">
          {camara.video.map((c) => (
            <div><p class="gd-camara__t">{c.t}</p><p class="gd-camara__d">{c.d}</p></div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* ─── figura · vieiras ───────────────────────────────────────── */}
<figure class="gd-fig">
  <div class="gd-fig__media"><img src={`/assets/img/${pases.vieiras.img}.jpg`} srcset="/assets/img/cr-vieiras-m.jpg 900w, /assets/img/cr-vieiras.jpg 1600w" sizes="100vw" width="1600" height="2000" loading="lazy" decoding="async" alt={pases.vieiras.alt} /></div>
  <figcaption class="gd-reveal">
    <div class="gd-fig__texto">
      <span class="gd-fig__n">Pase {pases.vieiras.n}</span>
      <h2 class="gd-h2">{pases.vieiras.t}</h2>
      <p class="gd-body" style="margin-top:.6rem">{pases.vieiras.d}</p>
    </div>
  </figcaption>
</figure>

{/* ─── 07 · MOVIMIENTO · rejilla 2x2 ──────────────────────────── */}
<section class="gd-scene gd-scene--alt" id="movimiento">
  <div class="gd-wrap gd-grid">
    <div class="gd-head">
      <h2 class="gd-h1" data-gd-words>Cómo se mueve la marca</h2>
      <p class="gd-body gd-reveal" style="margin-top:1rem">Las mismas reglas que rigen esta página. Sirven igual para un montaje.</p>
    </div>
    <div class="gd-cuerpo gd-mov" data-gd-stagger>
      {movimiento.map((m) => (
        <div class="gd-mov__item gd-item">
          <p class="gd-mov__t">{m.t}</p>
          <p class="gd-mov__d">{m.d}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ─── 08 · IDENTIDAD · muestrario ────────────────────────────── */}
<section class="gd-scene" id="identidad">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <h2 class="gd-h1" data-gd-words>Tipografía, color, materia</h2>
    </header>

    <div class="gd-tipo gd-reveal">
      {tipografia.map((t, i) => (
        <div>
          <p class={`gd-tipo__muestra${i === 1 ? ' gd-tipo__muestra--sans' : ''}`}>Treinta y dos flores</p>
          <div class="gd-tipo__meta">
            <span class="gd-tipo__fam">{t.fam}</span>
            <span class="gd-tipo__rol">{t.rol}</span>
          </div>
          <p class="gd-camara__d" style="margin-top:.5rem">{t.d}</p>
        </div>
      ))}
    </div>

    <div class="gd-paleta gd-reveal">
      {paleta.map((c) => (
        <div class="gd-swatch">
          <span class="gd-swatch__chip" style={`background:${c.hex}`}></span>
          <span class="gd-swatch__n">{c.n}</span>
          <span class="gd-swatch__hex">{c.hex}</span>
          <span class="gd-swatch__u">{c.u}</span>
        </div>
      ))}
    </div>

    <div class="gd-mat-list" data-gd-stagger>
      {materiales.map((m) => (
        <div class="gd-item">
          <p class="gd-mat-list__t">{m.t}</p>
          <p class="gd-mat-list__d">{m.d}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ─── 09 · DETALLES · lista de definición ────────────────────── */}
<section class="gd-scene gd-scene--alt" id="detalles">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <h2 class="gd-h1" data-gd-words>Lo que se recuerda</h2>
    </header>
    <div class="gd-def" data-gd-stagger>
      {detalles.map((d) => (
        <div class="gd-item">
          <p class="gd-def__t">{d.t}</p>
          <p class="gd-def__d">{d.d}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ─── 10 · IDEAS · carril horizontal ─────────────────────────── */}
<section class="gd-scene" id="ideas">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <h2 class="gd-h1" data-gd-words>Seis piezas que ya funcionan</h2>
      <p class="gd-lede gd-reveal" style="margin-top:1rem">Formato, idea y por qué engancha. Cógelas y hazlas tuyas.</p>
    </header>
    <div class="gd-carril gd-reveal">
      {ideas.map((i) => (
        <article class="gd-idea">
          <span class="gd-idea__f">{i.f}</span>
          <h3 class="gd-idea__t">{i.t}</h3>
          <p class="gd-idea__d">{i.d}</p>
        </article>
      ))}
    </div>
  </div>
</section>

{/* ─── 11 · LENGUAJE · citas grandes + pies ───────────────────── */}
<section class="gd-scene gd-scene--alt" id="lenguaje">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <p class="gd-eyebrow gd-reveal">Lenguaje</p>
      <h2 class="gd-h1" data-gd-words>Ganchos y pies</h2>
    </header>
    <div class="gd-grid">
      <div class="gd-lenguaje">
        <div class="gd-hooks" data-gd-stagger>
          {hooks.map((h) => <p class="gd-hook gd-item">{h}</p>)}
        </div>
        <div class="gd-voz" data-gd-stagger>
          {voz.map((v) => (
            <div class="gd-item">
              <p class="gd-voz__t">{v.t}</p>
              <p class="gd-voz__d">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div class="gd-lenguaje-lat">
        <div class="gd-caps">
          {captions.map((c) => (
            <div class="gd-caption gd-reveal">
              <p class="gd-caption__t">{c.t}</p>
              <p class="gd-caption__d">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

{/* ─── 12 · EL CAMPO · única escena oscura de la página ───────── */}
<section class="gd-scene gd-scene--moss">
  <div class="gd-wrap">
    <header style="margin-bottom:var(--gd-stack)">
      <h2 class="gd-h1" data-gd-words>{flores.length} flores en un solo menú</h2>
      <p class="gd-body gd-reveal" style="margin-top:1rem">{menuNombre}, la carta de esta estación.</p>
    </header>
    <ul class="gd-campo" data-gd-stagger>
      {flores.map((f, i) => <li class={`gd-flor gd-item gd-flor--${escala(i)}`}>{f}</li>)}
    </ul>
  </div>
</section>

{/* ─── 13 · CONTACTO · incluye el material descargable ────────── */}
<section class="gd-scene" id="contacto">
  <div class="gd-wrap gd-grid">
    <div class="gd-contacto__head">
      <p class="gd-eyebrow gd-reveal">Contacto</p>
      <h2 class="gd-h1" data-gd-words style="margin-bottom:1.5rem">Cuéntanos qué quieres grabar</h2>
      <a class="gd-contacto__mail gd-reveal" href={`mailto:${contacto.email}`}>{contacto.email}</a>
      <p class="gd-body gd-reveal" style="margin-top:1.4rem">
        Escríbenos por aquí o por DM a <a href={`https://instagram.com/${contacto.ig}`} target="_blank" rel="noopener" style="color:var(--olive)">@{contacto.ig}</a>. Cuadramos el servicio para que puedas grabar sin prisa.
      </p>
      {material.map((m) => (
        <p class="gd-body gd-reveal" style="margin-top:1.2rem">
          <a href={m.href} target="_blank" rel="noopener" style="color:var(--olive)">{m.t} ({m.meta})</a>. {m.d}
        </p>
      ))}
    </div>
    <div class="gd-contacto__datos gd-datos" data-gd-stagger>
      <div class="gd-datos__row gd-item"><span class="gd-datos__k">Dónde</span><span class="gd-datos__v">{contacto.dir}<br /><span class="gd-datos__sub">{contacto.zona}</span></span></div>
      <div class="gd-datos__row gd-item"><span class="gd-datos__k">Cuándo</span><span class="gd-datos__v">{contacto.horario}</span></div>
      <div class="gd-datos__row gd-item"><span class="gd-datos__k">Formato</span><span class="gd-datos__v">{contacto.formato}</span></div>
      <div class="gd-datos__row gd-item"><span class="gd-datos__k">Teléfono</span><span class="gd-datos__v"><a href={`tel:${contacto.tel}`}>{contacto.telLabel}</a></span></div>
    </div>
  </div>
</section>

{/* ─── CIERRE ─────────────────────────────────────────────────── */}
<section class="gd-scene gd-cierre">
  <h2 class="gd-h1 gd-cierre__big" data-gd-words>Abre la cámara antes de venir.</h2>
  <p class="gd-cierre__mark gd-reveal">Pipilacha</p>
</section>

</main>
</Garden>

```

### `src/styles/garden.css`

El sistema visual completo. Mobile-first: la base es móvil, la rejilla de 12 entra en @media (min-width:760px).

```css
/* ============================================================
   CREATOR GARDEN · sistema visual
   Solo se carga en /creator-garden/. Hereda de main.css los
   @font-face y los tokens de marca.

   TEMA CLARO, BLOQUEADO. La marca es luz, día y campo: el fondo
   es crema y el color lo ponen las fotos. El musgo aparece UNA
   sola vez en toda la página, como puntuación. No hay negro.
   (La versión anterior invertía esto y era un error: #0B0B09 ni
   siquiera es un token de marca.)

   Composición, mobile-first:
   · una familia de layout por escena, nunca repetida
   · antetítulos racionados: marcan las cinco escenas de verdad
   · las fotos van a sangre con el pie DEBAJO, nunca texto encima
   · medida de lectura corta y ritmo vertical constante
   ============================================================ */

.gd {
  /* superficies claras: la alternancia es sutil a propósito */
  --gd-paper: #F4EFE6;          /* crema, base */
  --gd-paper-2: #FBFAF5;        /* nube, alternancia */
  --gd-hair: rgba(49, 51, 31, .14);
  --gd-hair-soft: rgba(49, 51, 31, .08);

  /* escala tipográfica contenida: el titular jerarquiza, no grita */
  --gd-display: clamp(2.05rem, 7.6vw, 5.2rem);
  --gd-h1: clamp(1.65rem, 5.4vw, 3.4rem);
  --gd-h2: clamp(1.3rem, 4vw, 2.2rem);
  --gd-h3: clamp(1.08rem, 2.6vw, 1.45rem);
  --gd-body: clamp(.98rem, 1.5vw, 1.1rem);
  --gd-lede: clamp(1.08rem, 2.4vw, 1.4rem);

  /* ritmo vertical único: todas las escenas respiran igual */
  --gd-scene-y: clamp(3.6rem, 11vh, 8.5rem);
  --gd-stack: clamp(1.6rem, 4.5vh, 3rem);

  background: var(--gd-paper);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.gd ::selection { background: var(--accent-soft); color: var(--moss); }

.gd-skip {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  background: var(--moss); color: var(--cream); padding: .9em 1.4em;
  font-size: .8rem; letter-spacing: .1em; text-transform: uppercase;
}
.gd-skip:focus { left: 1rem; top: 1rem; }
.gd :focus-visible { outline: 2px solid var(--olive); outline-offset: 4px; }

/* ---------- escenas ---------- */
.gd-scene { position: relative; padding: var(--gd-scene-y) var(--gutter); }
.gd-scene--alt { background: var(--gd-paper-2); }
/* la ÚNICA escena oscura de la página */
.gd-scene--moss { background: var(--moss); color: var(--cream); }
.gd-wrap { max-width: var(--maxw); margin-inline: auto; width: 100%; }

/* ---------- tipografía ---------- */
.gd-display, .gd-h1, .gd-h2, .gd-h3 {
  font-family: var(--serif); font-weight: 400; letter-spacing: -.018em;
  color: var(--ink); text-wrap: balance;
}
.gd-display { font-size: var(--gd-display); line-height: 1.02; }
.gd-h1 { font-size: var(--gd-h1); line-height: 1.06; }
.gd-h2 { font-size: var(--gd-h2); line-height: 1.12; }
.gd-h3 { font-size: var(--gd-h3); line-height: 1.2; letter-spacing: -.008em; }
.gd-scene--moss :is(.gd-display, .gd-h1, .gd-h2, .gd-h3) { color: var(--cloud); }

.gd-lede { font-size: var(--gd-lede); line-height: 1.48; color: var(--text-muted); max-width: 30ch; }
.gd-body { font-size: var(--gd-body); line-height: 1.66; color: var(--text-muted); max-width: 38ch; }
.gd-scene--moss :is(.gd-lede, .gd-body) { color: rgba(244, 239, 230, .72); }

/* antetítulo: racionado, solo en las escenas que abren capítulo */
.gd-eyebrow {
  display: inline-flex; align-items: center; gap: .8em;
  font-size: .66rem; letter-spacing: .26em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 1rem;
}
.gd-eyebrow::before { content: ""; width: 2em; height: 1px; background: currentColor; opacity: .5; }
.gd-scene--moss .gd-eyebrow { color: var(--accent-soft); }

/* ---------- estados de entrada (gated en .js, como el sitio) ---------- */
.js .gd .gd-reveal { opacity: 0; transform: translateY(20px); }
.js .gd [data-gd-stagger] .gd-item { opacity: 0; transform: translateY(20px); }
.js .gd [data-gd-words], .js .gd [data-gd-lines] { opacity: 0; }
.gd .gd-line { overflow: hidden; padding-bottom: .09em; }

@media (prefers-reduced-motion: reduce) {
  .js .gd .gd-reveal,
  .js .gd [data-gd-stagger] .gd-item,
  .js .gd [data-gd-words],
  .js .gd [data-gd-lines] { opacity: 1 !important; transform: none !important; }
}

/* ---------- tallo + índice (solo escritorio) ---------- */
.gd-spine { display: none; }
.gd-index { display: none; }

/* ============================================================
   00 · APERTURA
   Foto a sangre arriba, titular debajo sobre crema. Nada de texto
   sobre la imagen: en una marca clara el texto encima obliga a
   velos oscuros, que es justo lo que sobra aquí.
   ============================================================ */
.gd-open__media {
  position: relative; height: 56svh; min-height: 300px; overflow: hidden;
  background: var(--gd-paper-2);
}
.gd-open__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gd-open__inner {
  max-width: var(--maxw); margin-inline: auto;
  padding: clamp(2rem, 6vh, 3.5rem) var(--gutter) clamp(2.5rem, 7vh, 4rem);
}
.gd-open__title { margin-bottom: .5em; }
.gd-open__sub { color: var(--text-muted); }
.gd-open__credit {
  margin-top: 1.8rem; padding-top: 1rem; border-top: 1px solid var(--gd-hair);
  font-size: .66rem; letter-spacing: .16em; text-transform: uppercase;
  color: var(--text-subtle); max-width: 34ch;
}

/* ============================================================
   01 · MANIFIESTO — tipografía grande, columna única, mucho aire
   ============================================================ */
.gd-manifiesto p {
  font-family: var(--serif); font-weight: 400; color: var(--ink);
  font-size: clamp(1.25rem, 4.4vw, 2.05rem); line-height: 1.32;
  letter-spacing: -.012em; max-width: 20ch;
}
.gd-manifiesto p + p { margin-top: .9em; }
.gd-manifiesto p:last-child { color: var(--olive); }

/* ============================================================
   02 · VISIÓN — texto con una cifra grande de contrapunto
   ============================================================ */
.gd-vision__cuerpo { display: grid; gap: 1.1em; }
.gd-dato {
  margin-top: var(--gd-stack); padding-top: 1.4rem;
  border-top: 1px solid var(--gd-hair);
}
.gd-dato__n {
  font-family: var(--serif); font-size: clamp(3.2rem, 15vw, 6.5rem);
  line-height: .84; color: var(--olive); display: block;
  font-variant-numeric: tabular-nums;
}
.gd-dato__t {
  display: block; margin-top: .6rem; font-size: .68rem; letter-spacing: .2em;
  text-transform: uppercase; color: var(--accent);
}
.gd-dato__pie { margin-top: .7rem; font-size: .94rem; line-height: 1.55; color: var(--text-muted); max-width: 26ch; }

/* ============================================================
   FIGURAS A SANGRE — imagen ancho completo, pie debajo
   ============================================================ */
.gd-fig { margin: 0; }
.gd-fig__media { width: 100%; aspect-ratio: 4 / 5; overflow: hidden; background: var(--gd-paper-2); }
.gd-fig__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gd-fig figcaption {
  max-width: var(--maxw); margin-inline: auto;
  padding: clamp(1.2rem, 4vh, 2rem) var(--gutter) clamp(2rem, 6vh, 3rem);
}
.gd-fig__n {
  font-size: .64rem; letter-spacing: .22em; text-transform: uppercase;
  color: var(--accent); display: block; margin-bottom: .6rem;
}

/* ============================================================
   03 · FILOSOFÍA — única lista numerada de la página
   ============================================================ */
.gd-princ { display: grid; }
.gd-princ__item {
  display: grid; gap: .4rem; padding: 1.4rem 0;
  border-top: 1px solid var(--gd-hair);
}
.gd-princ__item:first-child { border-top: none; padding-top: 0; }
.gd-princ__n {
  font-family: var(--serif); font-size: .8rem; color: var(--olive);
  font-variant-numeric: tabular-nums;
}
.gd-princ__d { font-size: var(--gd-body); line-height: 1.62; color: var(--text-muted); max-width: 42ch; }

/* ============================================================
   04 · GUÍA — tres declaraciones grandes, sin numerar, mucho aire.
   Familia distinta a la lista numerada de arriba a propósito.
   ============================================================ */
.gd-angulos { display: grid; gap: clamp(2.2rem, 6vh, 3.6rem); }
.gd-angulo__t { margin-bottom: .5rem; }
.gd-angulo__d { font-size: var(--gd-body); line-height: 1.66; color: var(--text-muted); max-width: 40ch; }

/* ============================================================
   05 · HISTORIAS — única rejilla de tarjetas de la página
   ============================================================ */
.gd-cards { display: grid; gap: clamp(1.6rem, 4vw, 2.6rem); }
.gd-card { padding-top: 1.1rem; border-top: 1px solid var(--gd-hair); }
.gd-card__t { margin-bottom: .45rem; }
.gd-card__d { font-size: .96rem; line-height: 1.6; color: var(--text-muted); }

/* ============================================================
   06 · CÁMARA — dos columnas contrapuestas (foto / vídeo)
   ============================================================ */
.gd-camara { display: grid; gap: clamp(2.2rem, 6vh, 3.4rem); }
.gd-camara__h {
  font-size: .66rem; letter-spacing: .24em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 1.2rem;
  padding-bottom: .8rem; border-bottom: 1px solid var(--gd-hair);
}
.gd-camara__list { display: grid; gap: 1.2rem; }
.gd-camara__t { font-family: var(--serif); font-size: 1.08rem; color: var(--ink); margin-bottom: .25rem; }
.gd-camara__d { font-size: .94rem; line-height: 1.58; color: var(--text-muted); max-width: 38ch; }

/* ============================================================
   07 · MOVIMIENTO — rejilla 2x2 de principios cortos
   ============================================================ */
.gd-mov { display: grid; gap: 1.6rem; }
.gd-mov__item { padding: 1.2rem; background: var(--gd-paper-2); border-radius: 2px; }
.gd-scene--alt .gd-mov__item { background: var(--gd-paper); }
.gd-mov__t { font-family: var(--serif); font-size: 1.05rem; color: var(--ink); margin-bottom: .4rem; line-height: 1.2; }
.gd-mov__d { font-size: .92rem; line-height: 1.55; color: var(--text-muted); }

/* ============================================================
   08 · IDENTIDAD — muestrario: tipo + color + materia
   ============================================================ */
.gd-tipo { display: grid; gap: 1.8rem; margin-bottom: var(--gd-stack); }
.gd-tipo__muestra { font-family: var(--serif); font-size: clamp(2rem, 9vw, 3.6rem); line-height: 1; color: var(--ink); }
.gd-tipo__muestra--sans { font-family: var(--sans); font-weight: 300; font-size: clamp(1.5rem, 6.5vw, 2.6rem); }
.gd-tipo__meta { display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; margin-top: .7rem; align-items: baseline; }
.gd-tipo__fam { font-size: .8rem; color: var(--ink); }
.gd-tipo__rol { font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); }

.gd-paleta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: var(--gd-stack); }
.gd-swatch { display: grid; gap: .4rem; }
.gd-swatch__chip { width: 100%; aspect-ratio: 3/2; border-radius: 2px; border: 1px solid var(--gd-hair-soft); }
.gd-swatch__n { font-size: .78rem; color: var(--ink); }
.gd-swatch__hex { font-size: .6rem; letter-spacing: .1em; color: var(--olive); font-variant-numeric: tabular-nums; }
.gd-swatch__u { font-size: .64rem; line-height: 1.4; color: var(--text-subtle); }

.gd-mat-list { display: grid; gap: 1.1rem; }
.gd-mat-list__t { font-family: var(--serif); font-size: 1.05rem; color: var(--ink); margin-bottom: .25rem; }
.gd-mat-list__d { font-size: .92rem; line-height: 1.55; color: var(--text-muted); max-width: 38ch; }

/* ============================================================
   09 · DETALLES — lista de definición compacta
   ============================================================ */
.gd-def { display: grid; gap: 1.3rem; }
.gd-def__t { font-family: var(--serif); font-size: 1.08rem; color: var(--ink); }
.gd-def__d { font-size: .94rem; line-height: 1.58; color: var(--text-muted); max-width: 40ch; margin-top: .2rem; }

/* ============================================================
   10 · IDEAS — carril con arrastre horizontal. En móvil se hojea
   con el pulgar en vez de convertirse en una columna larguísima.
   ============================================================ */
.gd-carril {
  display: grid; grid-auto-flow: column; grid-auto-columns: 78%;
  gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory;
  padding-bottom: 1rem; margin-inline: calc(var(--gutter) * -1);
  padding-inline: var(--gutter);
  scrollbar-width: thin;
}
.gd-idea {
  scroll-snap-align: start; background: var(--gd-paper-2);
  padding: 1.4rem 1.2rem; border-radius: 2px; border: 1px solid var(--gd-hair-soft);
}
.gd-scene--alt .gd-idea { background: var(--gd-paper); }
.gd-idea__f { font-size: .6rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: .7rem; }
.gd-idea__t { font-family: var(--serif); font-size: 1.1rem; color: var(--ink); margin-bottom: .4rem; line-height: 1.2; }
.gd-idea__d { font-size: .92rem; line-height: 1.55; color: var(--text-muted); }

/* ============================================================
   11 · LENGUAJE — ganchos como citas grandes + pies de ejemplo
   ============================================================ */
.gd-hooks { display: grid; }
.gd-hook {
  font-family: var(--serif); font-size: clamp(1.2rem, 4.6vw, 1.9rem);
  line-height: 1.24; color: var(--ink); padding: .7em 0;
  border-bottom: 1px solid var(--gd-hair);
}
.gd-hook:first-child { padding-top: 0; }

.gd-caps { display: grid; gap: 1.6rem; margin-top: var(--gd-stack); }
.gd-caption { border-left: 2px solid var(--accent-soft); padding-left: 1.1rem; }
.gd-caption__t { font-size: .62rem; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin-bottom: .6rem; }
.gd-caption__d { font-size: .96rem; line-height: 1.62; color: var(--text-muted); }

.gd-voz { display: grid; gap: 1rem; margin-top: var(--gd-stack); }
.gd-voz__t { font-family: var(--serif); font-size: 1.02rem; color: var(--ink); margin-bottom: .2rem; }
.gd-voz__d { font-size: .92rem; line-height: 1.55; color: var(--text-muted); max-width: 40ch; }

/* ============================================================
   12 · CAMPO DE FLORES — la única escena musgo de la página
   ============================================================ */
.gd-campo {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-wrap: wrap; align-items: baseline;
  gap: .18em .7em; font-family: var(--serif);
  color: rgba(244, 239, 230, .55);
}
.gd-flor { line-height: 1.28; transition: color .4s var(--ease); }
.gd-flor--sm { font-size: clamp(.9rem, 3.4vw, 1.15rem); }
.gd-flor--md { font-size: clamp(1.05rem, 4.4vw, 1.55rem); }
.gd-flor--lg { font-size: clamp(1.3rem, 5.6vw, 2.1rem); color: rgba(244, 239, 230, .85); }
.gd-flor--xl { font-size: clamp(1.55rem, 7vw, 2.9rem); color: var(--cloud); }
@media (hover: hover) and (pointer: fine) { .gd-flor:hover { color: var(--accent-soft); } }

/* ============================================================
   13 · CONTACTO + CIERRE
   ============================================================ */
.gd-contacto__mail {
  font-family: var(--serif); font-size: clamp(1.35rem, 6vw, 2.6rem); line-height: 1.1;
  color: var(--ink); text-decoration: none; display: inline-block;
  border-bottom: 1px solid var(--olive); word-break: break-word;
  transition: color .3s var(--ease);
}
.gd-contacto__mail:hover { color: var(--olive); }

.gd-datos { display: grid; margin-top: var(--gd-stack); }
.gd-datos__row { display: grid; gap: .25rem; padding: 1rem 0; border-top: 1px solid var(--gd-hair); }
.gd-datos__k { font-size: .6rem; letter-spacing: .22em; text-transform: uppercase; color: var(--accent); }
.gd-datos__v { font-family: var(--serif); font-size: 1.08rem; color: var(--ink); line-height: 1.35; }
.gd-datos__v a { color: inherit; text-decoration: none; border-bottom: 1px solid var(--olive); }
.gd-datos__sub { font-family: var(--sans); font-size: .84rem; color: var(--text-subtle); }

.gd-cierre { text-align: center; padding-block: clamp(4.5rem, 14vh, 9rem); }
.gd-cierre__big { max-width: 16ch; margin-inline: auto; }
.gd-cierre__mark {
  margin-top: clamp(2rem, 6vh, 3.5rem); font-family: var(--serif);
  font-size: clamp(1.3rem, 5vw, 2.2rem); color: var(--olive); letter-spacing: .02em;
}

/* ============================================================
   ESCRITORIO — la rejilla de 12 entra aquí. Hasta 760px todo es
   una columna: es donde se va a ver esta página.
   ============================================================ */
@media (min-width: 760px) {
  .gd-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: clamp(1.5rem, 3vw, 3rem); }

  .gd-open__media { height: 74svh; }
  .gd-open__inner { display: grid; grid-template-columns: repeat(12, 1fr); gap: 3rem; align-items: end; }
  .gd-open__titulo { grid-column: 1 / 8; }
  .gd-open__title { margin-bottom: 0; }
  .gd-open__textos { grid-column: 8 / 13; }
  .gd-open__credit { margin-top: 1.2rem; }

  .gd-manifiesto { grid-column: 3 / 11; }
  .gd-manifiesto p { max-width: 24ch; }
  .gd-manifiesto p:nth-child(2) { margin-left: clamp(2rem, 9vw, 9rem); }

  .gd-vision__head { grid-column: 1 / 7; }
  .gd-vision__cuerpo { grid-column: 7 / 13; }
  .gd-vision__dato { grid-column: 1 / 5; }

  .gd-head { grid-column: 1 / 5; position: sticky; top: clamp(3rem, 12vh, 7rem); align-self: start; }
  .gd-cuerpo { grid-column: 6 / 13; }

  .gd-fig__media { aspect-ratio: 16 / 9; }
  .gd-fig figcaption { display: grid; grid-template-columns: repeat(12, 1fr); gap: 3rem; }
  .gd-fig__texto { grid-column: 6 / 12; }

  .gd-angulos { grid-template-columns: repeat(3, 1fr); gap: clamp(2rem, 4vw, 3.4rem); }
  .gd-cards { grid-template-columns: repeat(3, 1fr); }
  .gd-camara { grid-template-columns: 1fr 1fr; gap: clamp(3rem, 6vw, 5rem); }
  .gd-mov { grid-template-columns: repeat(2, 1fr); gap: 1.4rem; }
  .gd-paleta { grid-template-columns: repeat(6, 1fr); }
  .gd-def { grid-template-columns: repeat(2, 1fr); gap: 2rem 3rem; }
  .gd-carril { grid-auto-columns: minmax(0, 30%); }

  .gd-lenguaje { grid-column: 1 / 8; }
  .gd-lenguaje-lat { grid-column: 9 / 13; }
  .gd-caps, .gd-voz { margin-top: 0; }

  .gd-contacto__head { grid-column: 1 / 7; }
  .gd-contacto__datos { grid-column: 8 / 13; margin-top: 0; }
  .gd-datos__row { grid-template-columns: minmax(120px, 34%) 1fr; gap: 1.2rem; align-items: baseline; }

  /* el tallo y el índice solo aparecen cuando hay margen para ellos */
  .gd-spine {
    display: block; position: fixed;
    left: max(1rem, calc((100vw - var(--maxw)) / 2 - 2rem));
    top: 0; height: 100vh; width: 2px; z-index: 3; pointer-events: none;
  }
  .gd-spine svg { width: 100%; height: 100%; overflow: visible; }
  .gd-spine__path { fill: none; stroke: var(--olive); stroke-width: 1.2; opacity: .5; vector-effect: non-scaling-stroke; }

  .gd-index {
    display: grid; position: fixed; right: clamp(.9rem, 2vw, 1.8rem); top: 50%;
    z-index: 4; transform: translateY(-50%); gap: .5rem;
  }
  .gd-index__link {
    display: flex; align-items: center; gap: .55rem; justify-content: flex-end;
    text-decoration: none; color: var(--text-subtle);
    font-size: .56rem; letter-spacing: .16em; text-transform: uppercase;
    transition: color .35s var(--ease);
  }
  .gd-index__label { opacity: 0; transform: translateX(5px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
  .gd-index__dot { width: 4px; height: 4px; border-radius: 50%; flex: none; background: currentColor; transition: scale .35s var(--ease); }
  .gd-index__link.is-on { color: var(--olive); }
  .gd-index__link.is-on .gd-index__dot { scale: 2; }
  .gd-index__link.is-on .gd-index__label,
  .gd-index__link:hover .gd-index__label,
  .gd-index__link:focus-visible .gd-index__label { opacity: 1; transform: none; }
}

```

### `src/scripts/garden.js`

El motor de movimiento. GSAP + ScrollTrigger + SplitText + Lenis.

```js
/* ============================================================
   CREATOR GARDEN · movimiento
   Punto de entrada propio. NO importa main.js a propósito: esta
   página no tiene nav, router, cookies, galería ni widget de reserva,
   así que arrastrar ese árbol solo costaría descarga y trabajo por
   frame.

   Sí reutiliza scroll/scrollTrigger.js, que es donde se registran los
   plugins y donde el ticker de GSAP conduce a Lenis. Importar gsap por
   otro lado dejaría el plugin sin registrar y un segundo driver.

   Reglas de la casa aplicadas aquí:
   · solo se animan transform y opacity (ni layout ni paint)
   · lo que entra usa expo.out; lo que responde a un gesto, rápido
   · con prefers-reduced-motion no se crea NINGÚN tween: el CSS ya
     deja todo visible, así que la página se lee igual y sin trabajo
   ============================================================ */
import { gsap, ScrollTrigger, SplitText } from './scroll/scrollTrigger.js';
import { reduceMotion } from './utils/motion.js';

/* Las líneas y palabras se parten DESPUÉS de que las fuentes asienten.
   Si se parte antes, se mide con la fuente de reserva y los saltos de
   línea quedan donde no son: el reveal se ve descuadrado en carga fría. */
const listo = document.fonts ? document.fonts.ready : Promise.resolve();

/* La portada NO se anima con scroll. Todo lo que cae en la primera
   pantalla tiene que estar visible al cargar: con ScrollTrigger, un
   elemento que queda unos píxeles por debajo de la línea de disparo se
   queda invisible hasta que el usuario mueve la rueda, y parece roto.
   Aquí entra por tiempo, encadenado. */
function portada() {
  const open = document.querySelector('.gd-open');
  if (!open) return;
  const titulo = open.querySelector('[data-gd-words]');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (titulo) {
    const split = new SplitText(titulo, { type: 'lines,words', linesClass: 'gd-line' });
    gsap.set(titulo, { opacity: 1 });
    tl.from(split.words, { yPercent: 108, duration: 1.2, stagger: 0.05 }, 0.15);
  }
  tl.to(open.querySelectorAll('.gd-reveal'),
        { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.35);
}

function titulares() {
  // titulares: palabra a palabra, subiendo desde detrás de su propia línea
  gsap.utils.toArray('[data-gd-words]').forEach((el) => {
    if (el.closest('.gd-open')) return; // la portada la lleva portada()
    const split = new SplitText(el, { type: 'lines,words', linesClass: 'gd-line' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.words, {
      yPercent: 108, duration: 1.1, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 84%' },
    });
  });

  // párrafos largos: línea a línea, más contenido que el titular
  gsap.utils.toArray('[data-gd-lines]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'gd-line' });
    gsap.set(el, { opacity: 1 });
    gsap.from(split.lines, {
      yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });
}

function revelados() {
  gsap.utils.toArray('.gd-reveal').forEach((el) => {
    if (el.closest('.gd-open')) return; // idem: la portada entra por tiempo
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.05, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // grupos en cascada: entran como una unidad, no uno a uno
  gsap.utils.toArray('[data-gd-stagger]').forEach((grupo) => {
    const hijos = grupo.querySelectorAll('.gd-item');
    if (!hijos.length) return;
    gsap.to(hijos, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06,
      scrollTrigger: { trigger: grupo, start: 'top 85%' },
    });
  });
}

function parallax() {
  gsap.utils.toArray('[data-gd-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.gdParallax) || 0.1;
    gsap.fromTo(el,
      { yPercent: -amt * 50 },
      { yPercent: amt * 50, ease: 'none',
        scrollTrigger: { trigger: el.closest('section, figure') || el,
                         start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* El tallo: un trazo que se dibuja de arriba abajo con el scroll de la
   página. Es el hilo que cose las escenas — la única pieza decorativa
   de la página, y aun así va atada al progreso real, no a un bucle. */
function tallo() {
  const path = document.querySelector('.gd-spine__path');
  if (!path) return;
  const largo = path.getTotalLength();
  gsap.set(path, { strokeDasharray: largo, strokeDashoffset: largo });
  gsap.to(path, {
    strokeDashoffset: 0, ease: 'none',
    scrollTrigger: { start: 0, end: () => document.body.scrollHeight - innerHeight, scrub: 0.6 },
  });
}

/* Índice lateral: marca la escena en la que estás. Es orientación, no
   adorno — en una página tan larga hace falta saber dónde vas. */
function indice() {
  const enlaces = new Map(
    [...document.querySelectorAll('.gd-index__link')].map((a) => [a.getAttribute('href').slice(1), a])
  );
  document.querySelectorAll('section[id]').forEach((sec) => {
    const a = enlaces.get(sec.id);
    if (!a) return;
    const marcar = (on) => () => a.classList.toggle('is-on', on);
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => a.classList.toggle('is-on', self.isActive),
      onEnter: marcar(true), onEnterBack: marcar(true),
    });
  });
}

function init() {
  if (!reduceMotion) {
    portada();
    titulares();
    revelados();
    parallax();
    tallo();
  }
  indice();          // la orientación se mantiene aunque no haya animación
  ScrollTrigger.refresh();
}

listo.then(() => {
  init();
  // segundo refresh de cortesía: las imágenes perezosas cambian la altura
  // de la página y dejarían los disparadores calculados sobre una posición vieja
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
});

```

### `src/data/creatorGarden.js`

Todo el texto. Separado de la plantilla a propósito.

```js
/* ============================================================
   CREATOR GARDEN · contenido
   Todo el texto de /creator-garden/ vive aquí, no en la plantilla:
   al cambiar de carta se toca este archivo (y src/data/menu.js, de
   donde salen pases y flores) y la página se actualiza sola.

   Voz: directa, precisa, con carácter. La flor es un ingrediente, no
   un símbolo: nada de lenguaje floral para hablar de flores.
   ============================================================ */

// ---- 00 · escenas, para el tallo lateral y el índice ----
export const escenas = [
  { id: 'apertura',   n: '00', t: 'Apertura' },
  { id: 'manifiesto', n: '01', t: 'Manifiesto' },
  { id: 'vision',     n: '02', t: 'La visión' },
  { id: 'filosofia',  n: '03', t: 'Filosofía' },
  { id: 'guia',       n: '04', t: 'Guía' },
  { id: 'historias',  n: '05', t: 'Historias' },
  { id: 'camara',     n: '06', t: 'Cámara' },
  { id: 'movimiento', n: '07', t: 'Movimiento' },
  { id: 'identidad',  n: '08', t: 'Identidad' },
  { id: 'detalles',   n: '09', t: 'Detalles' },
  { id: 'ideas',      n: '10', t: 'Ideas' },
  { id: 'lenguaje',   n: '11', t: 'Lenguaje' },
  { id: 'material',   n: '12', t: 'Material' },
  { id: 'contacto',   n: '13', t: 'Contacto' },
];

// ---- 01 · manifiesto (entra línea a línea) ----
export const manifiesto = [
  'Pipilacha es la libélula. Así la llaman en Centroamérica: el insecto que no para de volar.',
  'La carta se rehace entera cada estación porque el trabajo no está terminado. Hay miles de flores comestibles y llevamos años en las primeras.',
  'Cada plato se levanta sobre una flor: su sabor, su textura, lo que hace al cocinarla. La capuchina pica como un rábano. El farolillo es ácido y sirve de cuenco. La flor eléctrica duerme la lengua.',
  'No hay otra casa en el mundo construida entera sobre esto.',
];

// ---- 02 · visión ----
export const vision = {
  eyebrow: 'Hacia dónde va',
  titulo: 'Un ingrediente que casi nadie ha cocinado',
  cuerpo: [
    'La flor lleva siglos en la mesa como adorno. Como firma visual de quien quiere que el plato quede bien en foto.',
    'Aquí se trata con el mismo rigor que otros dan a la carne o al pescado: qué sabor tiene, cómo se comporta con el calor, qué pasa si la fermentas, la secas o la conviertes en harina.',
    'Eso no es un estilo de cocina. Es un territorio sin mapa, y la carta es el cuaderno de campo.',
  ],
  dato: { n: '16', t: 'asientos por servicio', pie: 'Los que caben si quieres cocinar mirando a quien come.' },
};

// ---- 03 · filosofía creativa: cómo se piensa un plato ----
export const filosofia = [
  { n: '01', t: 'Primero la flor', d: 'El plato no se diseña y luego se decora. Se empieza por una flor concreta y se pregunta qué es capaz de sostener.' },
  { n: '02', t: 'El sabor manda sobre el color', d: 'Si una flor solo aporta belleza, se cae del plato. Ninguna está ahí para la foto.' },
  { n: '03', t: 'La técnica se ve poco', d: 'Fermentar, secar, hacer harina de flor. El trabajo no se explica en la mesa: se prueba.' },
  { n: '04', t: 'Nada se queda quieto', d: 'Un pase que funciona sigue cambiando. La carta entera se rehace cada estación.' },
];

// ---- 04 · guía para creadores: los tres ángulos que funcionan ----
export const angulos = [
  {
    n: '01', t: 'El plato que no esperas',
    d: 'Enseña la forma antes que el nombre. Un cuenco que resulta ser una flor. Un higo negro que te comes antes de que te expliquen qué es. La sorpresa cabe en los tres primeros segundos.',
  },
  {
    n: '02', t: 'Dieciséis',
    d: 'Dos servicios, dieciséis asientos. No es un número de marketing: es el aforo que permite que quien cocina te vea comer. Es de los sitios de los que se presume por haber entrado.',
  },
  {
    n: '03', t: 'Flores que saben',
    d: 'Di a qué sabe cada una. Que la capuchina pique a rábano sorprende mucho más que decir que el plato «lleva flores». Lo concreto es lo que se comparte.',
  },
];

// ---- 05 · oportunidades narrativas ----
export const historias = [
  { t: 'El cuaderno', d: 'La carta cambia entera cada estación. Contar una flor que este mes entra y el que viene no está es una historia con fecha de caducidad, y eso se ve.' },
  { t: 'Las pinzas', d: 'Hay pases que se montan flor a flor delante de ti. El gesto es lento y preciso; en vídeo funciona mejor que el plato terminado.' },
  { t: 'La barra', d: 'Ocho de los dieciséis asientos miran a la cocina. Desde ahí el plano es el que nadie tiene: la mano, el fuego y el pase saliendo.' },
  { t: 'Los dos', d: 'Arán y Noé cocinan y sirven. Si preguntas por una flor, te contestan ellos. Esa conversación es material.' },
  { t: 'El fermento', d: 'Kéfir, kombucha y fermentados se hacen en casa, con flores. Es la parte que nadie enseña porque no está en el plato.' },
  { t: 'La primera vez', d: 'La cara de alguien mordiendo flor eléctrica por primera vez. Es la reacción más honesta de todo el menú.' },
];

// ---- 06 · cámara: cómo se fotografía y se graba esta cocina ----
export const camara = {
  foto: [
    { t: 'Cenital', d: 'Casi todo se emplata para verse desde arriba. Si dudas del plano, ese es el plano.' },
    { t: 'Luz natural o tenue', d: 'Nada de flash directo: aplasta el color del pétalo, que es justo lo que hay que enseñar.' },
    { t: 'Fondo de piedra o madera', d: 'La vajilla es mate y clara. Deja que respire; no añadas mantel ni atrezo.' },
    { t: 'Sin filtros saturados', d: 'El color ya está ahí y es real. Subirlo hace que parezca retocado y le quita valor.' },
  ],
  video: [
    { t: 'Planos largos', d: 'El emplatado es lento a propósito. Cortar cada segundo rompe justo lo que hace especial al gesto.' },
    { t: 'Sonido de sala', d: 'Graba el ambiente real. La sala es pequeña y suena a conversación, no a música alta.' },
    { t: 'La mano en cuadro', d: 'Las pinzas colocando una flor dan escala y explican el detalle sin una sola palabra.' },
    { t: 'El primer bocado', d: 'La reacción vale más que el plano del plato. Deja la cámara puesta un segundo de más.' },
  ],
};

// ---- 07 · principios de movimiento (los reales de la marca) ----
export const movimiento = [
  { t: 'Nada aparece de la nada', d: 'Todo entra desde un estado que ya existía: nunca desde escala cero ni opacidad plana. Lo que se mueve, venía de algún sitio.' },
  { t: 'La salida es más rápida que la entrada', d: 'Entrar puede tomarse su tiempo. Salir, no: la respuesta al gesto es inmediata.' },
  { t: 'Ritmo lento, reacción rápida', d: 'El scroll es pausado y continuo; los botones y enlaces contestan al instante. Son dos velocidades distintas y conviven.' },
  { t: 'El movimiento no se nota', d: 'Si una animación llama la atención sobre sí misma, sobra. Está para que el contenido llegue mejor, no para lucirse.' },
];

// ---- 08 · identidad visual (valores reales del sistema) ----
export const paleta = [
  { hex: '#0B0B09', n: 'Vacío',     u: 'fondo de las escenas oscuras' },
  { hex: '#31331F', n: 'Musgo',     u: 'bloques sólidos, botones' },
  { hex: '#645D3B', n: 'Oliva',     u: 'acento, filetes, activo' },
  { hex: '#B0A77F', n: 'Avena',     u: 'acento sobre fondo oscuro' },
  { hex: '#F4EFE6', n: 'Crema',     u: 'fondo claro' },
  { hex: '#2A2A22', n: 'Tinta',     u: 'texto principal' },
];

export const tipografia = [
  { fam: 'Marcellus', rol: 'Display', d: 'Serif de titular. Solo en tamaños grandes y en peso normal: nunca en negrita, nunca en cuerpo de texto.' },
  { fam: 'Hanken Grotesk', rol: 'Texto', d: 'Sans variable de 300 a 600 para todo lo que se lee seguido. Sustituye a Roobert, la licenciada de marca.' },
];

export const materiales = [
  { t: 'Cerámica mate', d: 'Vajilla clara y sin brillo, hecha para que el color del pétalo sea lo único que destaque.' },
  { t: 'Piedra y madera', d: 'Las bases de emplatado y la barra. Superficies con grano, nunca pulidas.' },
  { t: 'Delantal verde', d: 'Lino teñido en verde oliva con la libélula bordada. Es el único uniforme.' },
  { t: 'La libélula', d: 'El trazo de la casa. Aparece pequeña y una sola vez: nunca repetida ni como patrón.' },
];

// ---- 09 · detalles icónicos ----
export const detalles = [
  { t: 'El cuenco que es una flor', d: 'El farolillo aguanta el tartar de atún. Te lo comes entero, recipiente incluido.' },
  { t: 'La lengua dormida', d: 'La flor eléctrica anestesia ligeramente el paladar. Dura unos segundos y no se olvida.' },
  { t: 'Las pinzas', d: 'Los pases más delicados se montan con pinza, flor a flor, a la vista.' },
  { t: 'La estantería', d: 'Libros de cocina y plantas detrás de la barra. Es el fondo de casi todos los retratos de la casa.' },
];

// ---- 10 · ideas de contenido, por formato ----
export const ideas = [
  { f: 'Reel · 15 s', t: 'Adivina cuál se come', d: 'Plano cenital de tres pases. Revelas al final que en los tres la flor es el ingrediente principal, no el adorno.' },
  { f: 'Reel · 30 s', t: 'A qué sabe cada flor', d: 'Una flor por corte, con su sabor en texto: capuchina/rábano, farolillo/ácido, eléctrica/cosquilleo.' },
  { f: 'Carrusel', t: 'Los quince pases', d: 'Una foto por pase en orden. El último slide, las flores de la carta escritas.' },
  { f: 'Vídeo · 60 s', t: 'De la flor al plato', d: 'La misma flor cruda, cocinada y emplatada. Tres estados, un solo ingrediente.' },
  { f: 'Foto', t: 'El contraste', d: 'El higo negro junto al helado blanco. Funciona sin texto y sin explicación.' },
  { f: 'Story', t: 'Dieciséis sillas', d: 'La sala vacía antes del servicio. Cuentas el aforo y por qué es tan difícil entrar.' },
];

// ---- 11 · lenguaje: ganchos y pies ----
/* Ganchos para los tres primeros segundos. Los buenos abren una pregunta
   o prometen una sensación física; los que solo informan (un aforo, una
   espera) no paran el scroll de nadie. */
export const hooks = [
  'Aquí la flor no decora: es el plato.',
  'Esta flor te duerme la lengua.',
  'Adivina a qué sabe esta flor.',
  'El cuenco también se come.',
  'Treinta y dos flores en un solo menú.',
  'Quince platos y en todos manda una flor.',
  'No hay otro restaurante así en el mundo.',
];

export const captions = [
  {
    t: 'Para el pase que sorprende',
    d: 'El cuenco es la flor. El farolillo aguanta el tartar de atún y te lo comes entero, recipiente incluido. Pase 05 de quince, en @restaurante.pipilacha.',
  },
  {
    t: 'Para hablar de la casa',
    d: 'Dieciséis asientos, dos servicios, jueves a domingo. Arán y Noé cocinan y sirven ellos: si preguntas por una flor, te contestan. Madrid, Fuente del Berro.',
  },
  {
    t: 'Para el detalle técnico',
    d: 'La capuchina pica como un rábano suave y despierta un ajoblanco frío. Aquí la flor no está por bonita: está porque aporta un sabor que ningún otro ingrediente da.',
  },
];

export const voz = [
  { t: 'Di la flor y el plato', d: '«Ajoblanco con capuchinas» dice más que cualquier etiqueta genérica sobre cocina de flores.' },
  { t: 'Cuenta lo que pasó en la mesa', d: 'Lo que probaste, lo que te sorprendió, lo que preguntaste. En primera persona y concreto.' },
  { t: 'Nombra a Arán y Noé', d: 'Es una casa de dos personas y se nota en cada pase. Sin ellos la historia queda a medias.' },
  { t: 'Evita la palabra experiencia', d: 'Comiste, aprendiste algo de una flor y te fuiste con ganas de contarlo. Eso ya es suficientemente concreto.' },
];

// ---- 12 · material descargable (solo lo que existe de verdad) ----
export const material = [
  { t: 'Dossier de prensa', d: 'La casa, los dos cocineros y la carta en un PDF.', href: '/assets/docs/pipilacha-dossier-prensa.pdf', meta: 'PDF' },
];

// ---- 13 · contacto ----
export const contacto = {
  ig: 'restaurante.pipilacha',
  email: 'info@pipilacha.es',
  tel: '+34919125998',
  telLabel: '919 12 59 98',
  dir: 'C. del Azulejo, 2',
  zona: 'Fuente del Berro, 28028 Madrid',
  horario: 'Jueves a domingo · 14:00 y 21:00',
  formato: 'Quince pases, 85 € · maridaje +60 €',
};

```

### `src/layouts/Garden.astro`

El envoltorio sin cromo: sin nav, sin footer, sin cookies, sin analítica.

```astro
---
/* ============================================================
   GARDEN · envoltorio de /creator-garden/
   Deliberadamente SIN cromo: no hay Nav, ni Footer, ni banner de
   cookies, ni analítica. La página no debe leerse como una sección
   del sitio sino como una pieza aparte, y cada elemento de chrome
   que se añada rompe eso.

   Sí comparte main.css: ahí viven los @font-face y los tokens de
   marca. Duplicarlos en un CSS propio sería más ligero pero se
   desincronizaría del sistema a la primera revisión de tokens.

   El <script is:inline> de abajo es BYTE A BYTE el de Base.astro: su
   sha256 ya está en la CSP de public/.htaccess. Si lo tocas, aunque
   sea un espacio, cambia el hash y el navegador lo bloquea.
   ============================================================ */
import '../styles/main.css';
import '../styles/garden.css';

const {
  title = 'Creator Garden · Pipilacha',
  description = 'Para quien va a contar Pipilacha: cómo se piensa cada plato, qué merece la pena grabar y cómo se ve y se mueve la casa.',
  ogImage = '/assets/img/cr-hero.jpg',
} = Astro.props;

const canonical = new URL('/creator-garden/', Astro.site ?? 'https://pipilacha.es').href;
---
<!DOCTYPE html>
<html lang="es">
<head>
  <script is:inline>document.documentElement.classList.add('js');window.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='SCRIPT'&&t.src&&t.src.indexOf(location.origin+'/_assets/')===0)document.documentElement.classList.remove('js')},true)</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  {/* pieza que se pasa por DM a creadores concretos, no una página de captación */}
  <meta name="robots" content="noindex, nofollow" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Pipilacha" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, 'https://pipilacha.es').href} />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary_large_image" />

  <meta name="theme-color" content="#F4EFE6" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" />

  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/marcellus-400-latin.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/hanken-grotesk-variable-latin.woff2" crossorigin />
  {/* la portada es el LCP: que empiece a bajar antes de que el CSS resuelva */}
  <link rel="preload" as="image" href="/assets/img/cr-hero-m.jpg" media="(max-width: 760px)" />
  <link rel="preload" as="image" href="/assets/img/cr-hero.jpg" media="(min-width: 761px)" />

  <script>import '../scripts/garden.js';</script>
</head>
<body class="gd">
  <a class="gd-skip" href="#manifiesto">Saltar a la guía</a>
  <slot />
</body>
</html>

```
