# Paquete · MENÚ "Despertar de las flores" (tarjetas de cristal + maridaje)

**Qué es:** la página `/menu/`. Una intro grande ("el amanecer"), luego los 15 pases como
**tarjetas de cristal esmerilado** (`.gcard`) en un **carrusel arrastrable**, con una **flor
en blur detrás del cristal** y flores flotando al fondo. Las tarjetas "respiran"
(`cardBreathe`, escala/flotación desfasada). Abajo, el **maridaje** con el mismo efecto cristal.
El pase nº 10 va oculto a propósito (`.gcard--secret`). Sin fotos de plato (se mantiene el misterio).

Stack: Astro + CSS vanilla + GSAP/ScrollTrigger + Lenis. El carrusel y el cristal son CSS;
el arrastre/inercia/progreso es JS. Ver reglas globales en `00-LEEME.md`.

---

## 1) HTML — `src/pages/menu.astro`

```astro
---
import Base from '../layouts/Base.astro';

// Despertar de las flores — 15 pases (nombres reales). El nº 10 va oculto: pase sorpresa.
const pases = [
  { name: 'Pipilacha', hook: 'La flor eléctrica despierta el paladar para todo lo que viene.' },
  { name: 'Sabores de las flores', hook: 'Cinco flores en su punto. Un mapa de boca antes de empezar.' },
  { name: 'Taco de tila y alisos', hook: 'La tila calma; el aliso cierra con un punto de mostaza.' },
  { name: 'Explosión de flor de higo', hook: 'Hueles otoño y comes primavera.' },
  { name: 'Fusión entre vieiras e hibiscus', hook: 'El hibiscus corta la grasa de la vieira.' },
  { name: 'La magia del alhelí', hook: 'Pasa de azul a violeta y deja el paladar a cero.' },
  { name: 'Pan y mantequilla', hook: 'Masa madre con flores y mantequilla de caléndula.' },
  { name: 'Guisante coco-saúco', hook: 'El saúco sube el dulzor del guisante sin azúcar.' },
  { name: 'Espárragos, romesco y tagetes', hook: 'Brasa de encina y romesco reformulado con tagete.' },
  { surprise: true },
  { name: 'Cheong de glicinias sobre caballa', hook: 'Un fermento floral coreano sobre caballa.' },
  { name: 'Atún y margaritas', hook: 'Almadraba y manzanilla silvestre en el ponzu.' },
  { name: 'Ternera unagi con flores de huerto', hook: 'Robata, lacado unagi y hojas del huerto.' },
  { name: 'Torrija de mandarina', hook: 'Flambeada, con un gel picante de mandarina.' },
  { name: 'Fresas con nata madrileña', hook: 'Fresón de Aranjuez rallado al momento.' },
];

const petals = [
  'petal-peony.png', 'petal-borraja.png', 'petal-oxalis.png',
  'petal-roja.png', 'petal-sauco.png', 'petal-fig.png',
];
---

<Base
  title="Menú · Despertar de las flores · Pipilacha"
  description="Despertar de las flores: el menú de degustación de Pipilacha. Quince pases con las flores como ingrediente. Madrid, 85 € por persona."
>
  <!-- INTRO: el amanecer -->
  <section class="menu-intro">
    <img src="/assets/img/petal-oxalis.png" class="menu-intro__petal menu-intro__petal--1" alt="" aria-hidden="true" />
    <img src="/assets/img/petal-borraja.png" class="menu-intro__petal menu-intro__petal--2" alt="" aria-hidden="true" />
    <div class="menu-intro__inner">
      <p class="eyebrow reveal">Degustación · Primavera</p>
      <h1 class="menu-intro__title">Despertar<br>de las flores</h1>
      <p class="menu-intro__lead reveal">Quince pases. Sin carta, sin alternativa: se sirve completo. Cada uno con una pista; el resto te lo contamos en la mesa. El décimo te lo guardamos.</p>
      <p class="menu-intro__cue reveal" aria-hidden="true">Recorre los pases <span>→</span></p>
    </div>
  </section>

  <!-- EL RECORRIDO: tarjetas de cristal sobre flores flotantes, en carrusel -->
  <section class="carousel carousel--menu" id="menu" aria-label="Los quince pases del menú">
    <div class="menu-blooms" aria-hidden="true">
      <img class="menu-bloom menu-bloom--1" src="/assets/img/petal-peony.png" alt="" />
      <img class="menu-bloom menu-bloom--2" src="/assets/img/petal-borraja.png" alt="" />
      <img class="menu-bloom menu-bloom--3" src="/assets/img/petal-roja.png" alt="" />
      <img class="menu-bloom menu-bloom--4" src="/assets/img/petal-oxalis.png" alt="" />
      <img class="menu-bloom menu-bloom--5" src="/assets/img/petal-sauco.png" alt="" />
    </div>

    <div class="carousel__viewport" id="carViewport">
      <ul class="carousel__track" id="carTrack">
        {pases.map((p, i) => (
          <li class="slide">
            {p.surprise ? (
              <article class="gcard gcard--secret">
                <span class="gcard__flower" style="background-image:url(/assets/img/petal-roja.png)"></span>
                <div class="gcard__glass">
                  <div class="gcard__inner">
                    <span class="gcard__num">10</span>
                    <span class="gcard__seal">Te lo guardamos</span>
                    <h2 class="gcard__name">Un pase a ciegas</h2>
                    <p class="gcard__hook">Lo descubres en la mesa, sin saber qué flor llega.</p>
                  </div>
                  <img class="gcard__mark" src="/assets/img/iso-light.png" alt="" aria-hidden="true" />
                </div>
              </article>
            ) : (
              <article class="gcard">
                <span class="gcard__flower" style={`background-image:url(/assets/img/${petals[i % petals.length]})`}></span>
                <div class="gcard__glass">
                  <div class="gcard__inner">
                    <span class="gcard__num">{String(i + 1).padStart(2, '0')}</span>
                    <h2 class="gcard__name">{p.name}</h2>
                    <p class="gcard__hook">{p.hook}</p>
                  </div>
                  <img class="gcard__mark" src="/assets/img/iso-light.png" alt="" aria-hidden="true" />
                </div>
              </article>
            )}
          </li>
        ))}
      </ul>
    </div>

    <div class="carousel__ui">
      <div class="carousel__progress" aria-hidden="true"><span id="carBar"></span></div>
      <p class="carousel__counter" aria-hidden="true"><b id="carCur">01</b> / {String(pases.length).padStart(2, '0')}</p>
      <div class="carousel__arrows">
        <button type="button" id="carPrev" aria-label="Pase anterior">&larr;</button>
        <button type="button" id="carNext" aria-label="Pase siguiente">&rarr;</button>
      </div>
    </div>
  </section>

  <!-- MARIDAJE (mismo efecto cristal) -->
  <section class="maridaje" id="maridaje">
    <div class="menu-blooms" aria-hidden="true">
      <img class="menu-bloom menu-bloom--2" src="/assets/img/petal-sauco.png" alt="" />
      <img class="menu-bloom menu-bloom--3" src="/assets/img/petal-oxalis.png" alt="" />
      <img class="menu-bloom menu-bloom--4" src="/assets/img/petal-peony.png" alt="" />
    </div>
    <div class="maridaje__inner">
      <p class="eyebrow reveal">La otra mitad</p>
      <h2 class="reveal">Maridaje</h2>
      <p class="maridaje__intro reveal">Seis copas para recorrer los quince pases. Vinos de productores pequeños o los fermentos que hacemos en casa. Se elige al sentarse y ninguno está en carta: se sirve y se explica en sala.</p>
      <div class="maridaje__cards">
        <article class="maridaje__card reveal">
          <span class="gcard__flower" style="background-image:url(/assets/img/petal-sauco.png)"></span>
          <div class="maridaje__glass">
            <span class="maridaje__count">Seis copas</span>
            <h3>Con vino</h3>
            <p>Elegidas para la temporada. Cambian con las flores que entran cada servicio.</p>
            <span class="maridaje__price">+60 € / persona</span>
            <img class="gcard__mark" src="/assets/img/iso-light.png" alt="" aria-hidden="true" />
          </div>
        </article>
        <article class="maridaje__card reveal">
          <span class="gcard__flower" style="background-image:url(/assets/img/petal-peony.png)"></span>
          <div class="maridaje__glass">
            <span class="maridaje__count">Seis fermentos</span>
            <h3>Sin alcohol</h3>
            <p>Kombuchas, kéfires de agua y cheongs de flor, hechos en casa. La misma ambición, sin vino.</p>
            <span class="maridaje__price">+60 € / persona</span>
            <img class="gcard__mark" src="/assets/img/iso-light.png" alt="" aria-hidden="true" />
          </div>
        </article>
      </div>
      <p class="maridaje__more reveal"><a href="/vinos/">Ver la carta de vinos <span aria-hidden="true">→</span></a></p>
    </div>
  </section>

  <section class="cta-band">
    <h2 class="reveal">El menú se cuenta en mesa</h2>
    <p class="cta-band__lead reveal">Qué flor entra en cada plato, qué hace y de dónde viene la idea. Reserva y te lo contamos pase a pase.</p>
    <a href="/reservas/" class="btn btn--solid btn--lg reveal">Reservar</a>
  </section>
</Base>
```

---

## 2) CSS — bloques de `src/styles/main.css`

> Tokens usados: `--moss`, `--olive`, `--accent-soft`, `--cream`, `--serif`, `--sans`,
> `--radius`, `--gutter`. El cristal usa `backdrop-filter` + ruido SVG; el carrusel base
> (`.carousel*`, `.slide`) es **compartido con la galería**.

```css
/* ----- menú: intro (el amanecer) ----- */
.menu-intro{position:relative;min-height:clamp(78vh,92svh,100svh);display:flex;align-items:center;padding:clamp(6rem,14vh,9rem) var(--gutter) clamp(3rem,8vh,5rem);overflow:hidden}
.menu-intro__inner{position:relative;z-index:2;max-width:var(--maxw);margin:0 auto;width:100%}
.menu-intro .eyebrow{color:var(--terracotta)}
.menu-intro__title{font-family:var(--serif);font-size:clamp(3rem,11vw,7.5rem);line-height:.92;color:var(--moss);letter-spacing:-0.015em;margin:.4rem 0 1.6rem;text-wrap:balance}
.menu-intro__lead{max-width:60ch;color:#45453a;font-size:clamp(1.05rem,1.6vw,1.35rem);line-height:1.6;text-wrap:pretty}
.menu-intro__cue{margin-top:clamp(2rem,5vh,3.5rem);font-size:.78rem;letter-spacing:.24em;text-transform:uppercase;color:var(--olive);display:flex;align-items:center;gap:.7rem}
.menu-intro__cue span{display:inline-block;animation:cueNudge 1.8s var(--ease) infinite}
@keyframes cueNudge{0%,100%{transform:translateX(0)}50%{transform:translateX(9px)}}
.menu-intro__petal{position:absolute;z-index:1;width:clamp(150px,24vw,360px);height:auto;opacity:.5;pointer-events:none;will-change:transform}
.menu-intro__petal--1{top:9%;right:5%;animation:float 9s ease-in-out infinite}
.menu-intro__petal--2{bottom:7%;left:4%;width:clamp(110px,16vw,230px);opacity:.4;animation:float2 11s ease-in-out infinite}

/* ----- menú: el recorrido (tarjetas de cristal en carrusel) ----- */
.carousel--menu{position:relative;overflow:hidden;background:var(--cream);padding-top:clamp(1.5rem,4vh,3rem)}
/* flores en blur al fondo, fundidas arriba/abajo (sin corte de sección) */
.menu-blooms{position:absolute;inset:0;z-index:0;pointer-events:none;-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 14%,#000 86%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0%,#000 14%,#000 86%,transparent 100%)}
.menu-bloom{position:absolute;height:auto;filter:blur(13px) saturate(1.15);will-change:transform}
.menu-bloom--1{top:4%;left:3%;width:clamp(220px,30vw,460px);opacity:.6;animation:float 14s ease-in-out infinite}
.menu-bloom--2{bottom:8%;left:24%;width:clamp(160px,20vw,320px);opacity:.5;animation:float2 17s ease-in-out infinite}
.menu-bloom--3{top:11%;right:7%;width:clamp(240px,32vw,500px);opacity:.55;animation:float2 15s ease-in-out infinite}
.menu-bloom--4{bottom:12%;right:25%;width:clamp(150px,18vw,300px);opacity:.5;animation:float 19s ease-in-out infinite}
.menu-bloom--5{top:42%;left:47%;width:clamp(180px,22vw,360px);opacity:.4;animation:float 16s ease-in-out infinite}
.menu-blooms::after{content:'';position:absolute;inset:0;opacity:.2;mix-blend-mode:soft-light;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.carousel--menu .carousel__viewport{position:relative;z-index:1}
.carousel--menu .carousel__track{padding-top:clamp(2rem,6vh,5rem);padding-bottom:clamp(1.5rem,4vh,3rem);align-items:center}
.carousel--menu .slide{display:flex;align-items:center}
.carousel--menu .carousel__ui{position:relative;z-index:2}

/* tarjeta de cristal con la flor detrás */
.gcard{position:relative;width:clamp(280px,33vw,440px);height:clamp(430px,64vh,620px);border-radius:var(--radius);overflow:hidden;isolation:isolate}
.gcard__flower{position:absolute;inset:-12%;z-index:0;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:.92;will-change:transform;animation:bloomDrift 18s ease-in-out infinite}
@keyframes bloomDrift{0%,100%{transform:scale(1) translate(0,0)}50%{transform:scale(1.08) translate(2%,-2%)}}
.gcard__glass{position:absolute;inset:0;z-index:1;display:flex;align-items:flex-end;border-radius:var(--radius);background:rgba(251,250,245,.34);-webkit-backdrop-filter:blur(20px) saturate(1.4);backdrop-filter:blur(20px) saturate(1.4);border:1px solid rgba(255,255,255,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.65), inset 0 -70px 60px -40px rgba(251,250,245,.82), 0 30px 60px -34px rgba(49,51,31,.45)}
.gcard__glass::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.08;mix-blend-mode:overlay;border-radius:inherit;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.gcard__inner{position:relative;z-index:2;width:100%;padding:clamp(1.6rem,3vw,2.4rem)}
.gcard__num{display:block;font-family:var(--serif);font-size:clamp(2.6rem,6vw,4.6rem);line-height:1;color:rgba(100,93,59,.7);margin-bottom:.6rem}
.gcard__name{font-family:var(--serif);font-size:clamp(1.7rem,3.4vw,2.6rem);line-height:1.06;color:var(--moss);text-wrap:balance;margin-bottom:.7rem}
.gcard__hook{font-family:var(--sans);font-weight:400;font-size:clamp(.95rem,1.4vw,1.12rem);line-height:1.5;color:#3a392f;max-width:34ch}
/* pase sorpresa: cristal sellado, más oscuro */
.gcard--secret .gcard__glass{background:rgba(49,51,31,.34);border-color:rgba(255,255,255,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.25), 0 30px 60px -34px rgba(49,51,31,.5)}
.gcard--secret .gcard__num{color:rgba(244,239,230,.5)}
.gcard--secret .gcard__name{color:var(--cream);font-style:italic}
.gcard--secret .gcard__hook{color:rgba(244,239,230,.82)}
.gcard--secret .gcard__seal{display:inline-block;font-family:var(--sans);font-size:.7rem;letter-spacing:.24em;text-transform:uppercase;color:var(--moss);background:var(--accent-soft);padding:.5em 1.1em;border-radius:999px;margin-bottom:1rem}
/* fallback sin backdrop-filter */
@supports not ((backdrop-filter:blur(2px)) or (-webkit-backdrop-filter:blur(2px))){.gcard__glass{background:rgba(251,250,245,.88)}.gcard--secret .gcard__glass{background:rgba(49,51,31,.84)}}
@media(min-width:901px){.gcard{width:clamp(360px,30vw,440px)}}
@media(max-width:560px){.gcard{width:min(80vw,380px);height:60vh}}
/* respiro: suben/bajan de escala desfasadas → flotan */
@keyframes cardBreathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.025)}}
.gcard{animation:cardBreathe 6s ease-in-out infinite;will-change:transform}
.carousel--menu .slide:nth-child(even) .gcard{animation-delay:-3s}
.carousel--menu .slide:nth-child(3n) .gcard{animation-delay:-4.4s}
.carousel--menu .slide:nth-child(3n+2) .gcard{animation-delay:-1.7s}
/* isotipo libélula (marca de agua sutil) */
.gcard__mark{position:absolute;z-index:3;top:clamp(1.1rem,2.2vw,1.7rem);right:clamp(1.1rem,2.2vw,1.7rem);width:clamp(26px,3.2vw,42px);height:auto;opacity:.32;pointer-events:none;filter:brightness(0) saturate(100%)}
.gcard--secret .gcard__mark{filter:none;opacity:.5}

/* ----- maridaje (mismo cristal + respiro) ----- */
.maridaje{position:relative;overflow:hidden;padding:clamp(4.5rem,12vh,9rem) var(--gutter)}
.maridaje .menu-blooms{z-index:0}
.maridaje__inner{position:relative;z-index:1;max-width:1000px;margin:0 auto}
.maridaje__inner .eyebrow{color:var(--terracotta)}
.maridaje h2{font-size:clamp(2.2rem,5vw,3.8rem);color:var(--moss);margin:.2rem 0 1.2rem}
.maridaje__intro{max-width:62ch;color:#45453a;font-size:clamp(1rem,1.5vw,1.18rem)}
.maridaje__more{margin-top:2.4rem}
.maridaje__more a{font-family:var(--serif);font-size:1.15rem;color:var(--moss);border-bottom:1px solid rgba(49,51,31,.35);padding-bottom:.2rem;transition:color .3s,border-color .3s}
.maridaje__more a:hover{color:var(--terracotta);border-color:var(--terracotta)}
.maridaje__cards{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1rem,2vw,1.6rem);margin-top:clamp(2.4rem,5vh,3.6rem)}
.maridaje__card{position:relative;overflow:hidden;isolation:isolate;border-radius:var(--radius);min-height:clamp(280px,40vh,360px);animation:cardBreathe 7s ease-in-out infinite;will-change:transform}
.maridaje__card:nth-child(2){animation-delay:-3.5s}
.maridaje__glass{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;padding:clamp(1.8rem,4vw,3rem);border-radius:var(--radius);background:rgba(251,250,245,.4);-webkit-backdrop-filter:blur(18px) saturate(1.3);backdrop-filter:blur(18px) saturate(1.3);border:1px solid rgba(255,255,255,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.6), inset 0 -70px 60px -40px rgba(251,250,245,.78), 0 30px 60px -34px rgba(49,51,31,.4)}
.maridaje__count{font-family:var(--serif);font-size:.92rem;letter-spacing:.22em;text-transform:uppercase;color:var(--terracotta)}
.maridaje__card h3{font-family:var(--serif);font-size:clamp(1.7rem,3.2vw,2.4rem);color:var(--moss);margin:.55rem 0 .8rem}
.maridaje__card p{color:#3c3b30;font-size:1rem;max-width:36ch;margin-bottom:1.8rem}
.maridaje__price{margin-top:auto;font-family:var(--sans);font-weight:500;letter-spacing:.05em;color:var(--moss);border-top:1px solid rgba(49,51,31,.18);padding-top:1.1rem}
@supports not ((backdrop-filter:blur(2px)) or (-webkit-backdrop-filter:blur(2px))){.maridaje__glass{background:rgba(251,250,245,.9)}}

/* ----- carrusel base (COMPARTIDO con galería) ----- */
.carousel{position:relative;padding:clamp(1rem,3vh,2.5rem) 0 clamp(3rem,7vh,6rem)}
.carousel__viewport{overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:none;cursor:grab}
.carousel__viewport::-webkit-scrollbar{display:none}
.carousel__viewport.is-dragging{cursor:grabbing}
.carousel__track{display:flex;gap:clamp(.8rem,2vw,1.6rem);list-style:none;width:max-content;padding:0 var(--gutter)}
.slide{flex:0 0 auto;scroll-snap-align:center}
.carousel__ui{display:flex;align-items:center;gap:clamp(1rem,3vw,2.4rem);max-width:var(--maxw);margin:clamp(1.6rem,4vh,2.6rem) auto 0;padding:0 var(--gutter)}
.carousel__progress{flex:1;height:2px;background:rgba(49,51,31,.18);position:relative;overflow:hidden;border-radius:2px}
.carousel__progress span{position:absolute;inset:0 auto 0 0;width:0;background:var(--olive);will-change:width}
.carousel__counter{font-family:var(--serif);font-size:1.05rem;color:var(--moss);white-space:nowrap;letter-spacing:.06em}
.carousel__counter b{color:var(--olive);font-weight:400}
.carousel__arrows{display:flex;gap:.6rem}
.carousel__arrows button{width:48px;height:48px;border-radius:50%;border:1px solid rgba(49,51,31,.28);background:transparent;color:var(--moss);font-size:1.05rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .4s var(--ease),color .4s var(--ease),border-color .4s var(--ease)}
.carousel__arrows button:hover{background:var(--moss);color:var(--cream);border-color:var(--moss)}
.carousel__arrows button:disabled{opacity:.32;cursor:default}
```

---

## 3) JS — módulo del carrusel en `public/js/main.js`

> Drag con inercia (ratón), barra de progreso, contador, flechas, snap al centro.
> En la galería además mueve un `img` interno en parallax; en el menú las tarjetas no llevan
> `img` así que ese trozo simplemente no aplica. La entrada en cascada es un `gsap.from`
> aparte (dentro del bloque `if(!reduceMotion)`).

```js
/* entrada del carrusel en cascada (en el bloque if(!reduceMotion)) */
if (document.querySelector('.carousel')) {
  gsap.from('.carousel .slide', {
    opacity: 0, y: 64, duration: 0.9, ease: 'power3.out', stagger: 0.07,
    scrollTrigger: { trigger: '.carousel', start: 'top 82%' }
  });
}

/* ===== CARRUSEL: arrastre + inercia + progreso ===== */
const carousel = document.querySelector('.carousel');
if (carousel) {
  const vp = carousel.querySelector('.carousel__viewport');
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const bar = document.getElementById('carBar');
  const cur = document.getElementById('carCur');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
  const maxScroll = () => Math.max(0, vp.scrollWidth - vp.clientWidth);

  const update = () => {
    const max = maxScroll();
    const sl = vp.scrollLeft;
    if (bar) bar.style.width = (max > 0 ? (sl / max) * 100 : 0) + '%';
    const center = sl + vp.clientWidth / 2;
    let nearest = 0, nd = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetLeft + s.offsetWidth / 2;
      const d = center - c;
      if (Math.abs(d) < nd) { nd = Math.abs(d); nearest = i; }
      if (!reduceMotion) {            // parallax de la imagen interna (solo galería)
        const img = s.querySelector('img');
        if (img) {
          const rel = Math.max(-1, Math.min(1, d / vp.clientWidth));
          img.style.transform = 'translateX(' + (-8 + rel * 7) + '%)';
        }
      }
    });
    if (cur) cur.textContent = String(nearest + 1).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = sl <= 2;
    if (nextBtn) nextBtn.disabled = sl >= max - 2;
  };

  let ticking = false;
  vp.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  }, { passive: true });

  const step = () => (slides[0] ? slides[0].offsetWidth + 24 : vp.clientWidth * 0.6);
  if (prevBtn) prevBtn.addEventListener('click', () => vp.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => vp.scrollBy({ left: step(), behavior: 'smooth' }));

  /* arrastre con inercia (solo ratón) */
  if (window.matchMedia('(pointer:fine)').matches) {
    let down = false, startX = 0, startScroll = 0, moved = false, lastX = 0, lastT = 0, vel = 0;
    vp.addEventListener('pointerdown', e => {
      down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft;
      lastX = e.clientX; lastT = performance.now(); vel = 0;
      if (window.gsap) gsap.killTweensOf(vp);
      vp.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      vp.scrollLeft = startScroll - dx;
      const now = performance.now(), dt = now - lastT;
      if (dt > 0) vel = (e.clientX - lastX) / dt;
      lastX = e.clientX; lastT = now;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false; vp.classList.remove('is-dragging');
      if (window.gsap && Math.abs(vel) > 0.1) {
        const target = Math.max(0, Math.min(maxScroll(), vp.scrollLeft - vel * 260));
        gsap.to(vp, { scrollLeft: target, duration: 0.9, ease: 'power3.out' });
      }
    });
    vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  update();
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
}
```

---

## Cómo pedir cambios aquí (ejemplos)
- *"Añade un **tilt 3D** a `.gcard` al pasar el cursor (rotateX/rotateY según la posición del
  ratón), con `transform-style:preserve-3d` y vuelta elástica al salir. Que NO pelee con la
  animación `cardBreathe` (envuélvela en un wrapper o combina transforms). Respeta `prefers-reduced-motion` y sube `?v=N`."*
- *"Haz que la **flor detrás del cristal** (`.gcard__flower`) se mueva en parallax según el
  scroll del carrusel (más profundidad), reusando el cálculo `rel` que ya hay en `update()`."*
- *"Quiero que al **centrarse** una tarjeta en el carrusel suba su nitidez/escala respecto a las
  laterales (efecto focus tipo coverflow), calculándolo en `update()` con la distancia `d`."*
- *"El **maridaje** en móvil: que las dos tarjetas pasen de grid a carrusel horizontal reusando
  `.carousel`."*
