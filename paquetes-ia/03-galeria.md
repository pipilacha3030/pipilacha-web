# Paquete · GALERÍA (carrusel arrastrable + lightbox)

**Qué es:** la página `/galeria/`. Un **carrusel horizontal arrastrable** de fotos (mismas
clases `.carousel`/`.slide` que el menú), todas del mismo tamaño, con **hover** (la pieza se
eleva y la imagen hace zoom) y un **caption** que aparece. Al hacer clic, abre un **lightbox**
con navegación por flechas/teclado. Las imágenes llevan un recorte (`clip-path`) para tapar el
borde de color en fotos oscuras.

Stack: Astro + CSS vanilla + GSAP + Lenis. El carrusel base (drag/inercia/progreso) es el mismo
módulo JS que el menú — aquí se documenta el HTML, el CSS específico de galería y el JS del
lightbox. Ver reglas globales en `00-LEEME.md`.

---

## 1) HTML — `src/pages/galeria.astro`

```astro
---
import Base from '../layouts/Base.astro';

const fotos = [
  { src: '/assets/img/g10.jpg', alt: 'Esferificación de hierba luisa' },
  { src: '/assets/img/g15.jpg', alt: 'Pho de flores' },
  { src: '/assets/img/g16.jpg', alt: 'Arán y Noé cocinando juntos en la barra' },
  { src: '/assets/img/g1.jpg',  alt: 'Espárragos a la brasa con tagete' },
  { src: '/assets/img/g13.jpg', alt: 'Claveles sobre fresas con nata' },
  { src: '/assets/img/g18.jpg', alt: 'Corvina a la brasa con pétalos de tagete' },
  { src: '/assets/img/g17.jpg', alt: 'Ajo blanco con hojas de capuchina' },
  { src: '/assets/img/g11.jpg', alt: 'Helado de tupinambo' },
  { src: '/assets/img/g9.jpg',  alt: 'Arán y Noé en el pase' },
  { src: '/assets/img/g3.jpg',  alt: 'Guisante coco-saúco' },
  { src: '/assets/img/g19.jpg', alt: 'Saco de colirrábano con clavelina' },
  { src: '/assets/img/g12.jpg', alt: 'Tartaleta de remolacha' },
  { src: '/assets/img/g6.jpg',  alt: 'Servicio en cocina' },
  { src: '/assets/img/g8.jpg',  alt: 'Vieira con flor de higo' },
  { src: '/assets/img/g14.jpg', alt: 'La sala' },
  { src: '/assets/img/g5.jpg',  alt: 'Guiso de setas' },
];
---

<Base title="Galería · Pipilacha" description="Platos, flores y servicio en Pipilacha, restaurante de degustación floral en Madrid.">
  <section class="page-header">
    <p class="eyebrow">Galería</p>
    <h1>Lo que ocurre<br>en la mesa</h1>
    <p>Arrastra para recorrerla. Toca cualquier imagen para verla en grande.</p>
  </section>

  <!-- CARRUSEL -->
  <section class="carousel" id="galeria">
    <div class="carousel__viewport" id="carViewport">
      <ul class="carousel__track" id="carTrack">
        {fotos.map((f, i) => (
          <li class="slide">
            <button type="button" class="slide__btn" data-index={i} aria-label={`Ampliar: ${f.alt}`}>
              <span class="slide__media"><img src={f.src} alt={f.alt} loading={i < 3 ? 'eager' : 'lazy'} /></span>
              <span class="slide__cap" aria-hidden="true">
                <span class="slide__num">{String(i + 1).padStart(2, '0')}</span>{f.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>

    <div class="carousel__ui">
      <div class="carousel__progress" aria-hidden="true"><span id="carBar"></span></div>
      <p class="carousel__counter" aria-hidden="true"><b id="carCur">01</b> / {String(fotos.length).padStart(2, '0')}</p>
      <div class="carousel__arrows">
        <button type="button" id="carPrev" aria-label="Imagen anterior">&larr;</button>
        <button type="button" id="carNext" aria-label="Imagen siguiente">&rarr;</button>
      </div>
    </div>
  </section>

  <!-- LIGHTBOX -->
  <div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Galería ampliada">
    <button class="lightbox__close" id="lbClose" type="button" aria-label="Cerrar galería">&times;</button>
    <button class="lightbox__nav lightbox__prev" id="lbPrev" type="button" aria-label="Foto anterior">&lsaquo;</button>
    <figure class="lightbox__stage">
      <img id="lbImg" src="" alt="" />
      <figcaption class="lightbox__cap" id="lbCap"></figcaption>
    </figure>
    <button class="lightbox__nav lightbox__next" id="lbNext" type="button" aria-label="Foto siguiente">&rsaquo;</button>
  </div>
</Base>
```

---

## 2) CSS — `src/styles/main.css`

> El carrusel base (`.carousel`, `.carousel__viewport`, `.carousel__track`, `.carousel__ui`,
> `.carousel__progress`, `.carousel__counter`, `.carousel__arrows`) está en el paquete del menú
> (`01-menu.md`, sección "carrusel base"). Aquí va lo específico de galería + lightbox.

```css
/* ----- piezas de la galería (la preview clicable) ----- */
.slide{flex:0 0 auto;scroll-snap-align:center}
.slide__btn{position:relative;display:block;border:0;padding:0;background:var(--moss);cursor:inherit;border-radius:var(--radius);overflow:hidden;width:clamp(280px,32vw,440px);height:clamp(380px,66vh,620px);transition:transform .55s var(--ease),box-shadow .55s var(--ease)}
.slide__btn:hover{transform:translateY(-10px);box-shadow:0 30px 60px -28px rgba(49,51,31,.55)}
.slide__media{position:absolute;inset:0;overflow:hidden;will-change:transform;transition:transform .9s var(--ease)}
.slide__btn:hover .slide__media{transform:scale(1.08)}
.slide__media img{width:132%;height:100%;object-fit:cover;transform:translateX(-12%);will-change:transform}  /* 132%/-12% evita la línea blanca en los extremos del parallax */
.slide__btn::after{content:'';position:absolute;inset:0;background:rgba(20,20,12,0);transition:background .5s var(--ease)}
.slide__btn:hover::after{background:rgba(20,20,12,.16)}
.slide__cap{position:absolute;left:0;right:0;bottom:0;z-index:2;display:flex;align-items:baseline;gap:.7rem;padding:1.7rem clamp(1.1rem,2vw,1.7rem) 1.3rem;color:var(--cream);text-align:left;font-family:var(--serif);font-size:clamp(1rem,1.5vw,1.35rem);line-height:1.15;background:linear-gradient(0deg,rgba(20,20,12,.82),transparent);opacity:0;transform:translateY(14px);transition:opacity .5s var(--ease),transform .5s var(--ease)}
.slide__num{font-family:var(--sans);font-size:.7rem;letter-spacing:.2em;color:var(--accent-soft);transform:translateY(-.15em)}
.slide__btn:hover .slide__cap,.slide__btn:focus-visible .slide__cap{opacity:1;transform:none}
.slide__btn:focus-visible{outline:2px solid var(--olive);outline-offset:4px}

/* ----- lightbox ----- */
.lightbox{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:clamp(1rem,4vw,3rem);background:rgba(16,16,11,.992);opacity:0;transition:opacity .4s var(--ease)}
.lightbox.is-open{display:flex;opacity:1}
.lightbox__stage{margin:0;max-width:min(1100px,92vw);display:flex;flex-direction:column;align-items:center;gap:1rem}
.lightbox__stage img{width:auto;height:auto;max-width:100%;max-height:80vh;object-fit:contain;clip-path:inset(2.5% round var(--radius-sm))}  /* recorta 2.5% → tapa el borde de color de fotos oscuras */
.lightbox__cap{color:var(--cream);font-size:.9rem;letter-spacing:.04em;opacity:.85;text-align:center}
.lightbox__close,.lightbox__nav{position:absolute;background:none;border:0;color:var(--cream);cursor:pointer;line-height:1;opacity:.8;transition:opacity .3s var(--ease)}
.lightbox__close:hover,.lightbox__nav:hover{opacity:1}
.lightbox__close{top:clamp(1rem,3vw,2rem);right:clamp(1rem,3vw,2rem);font-size:2.6rem}
.lightbox__nav{top:50%;transform:translateY(-50%);font-size:3.2rem;padding:0 1rem}
.lightbox__prev{left:clamp(.2rem,2vw,1.5rem)}
.lightbox__next{right:clamp(.2rem,2vw,1.5rem)}
.lightbox__close:focus-visible,.lightbox__nav:focus-visible{outline:2px solid var(--accent-soft);outline-offset:4px;opacity:1}
```

---

## 3) JS — lightbox en `public/js/main.js`

> El drag/inercia/progreso/parallax de imagen vive en el módulo `.carousel` (ver `01-menu.md`).
> Ese módulo, en la galería, mueve la `img` interna en parallax con la distancia al centro,
> y cancela el click si hubo arrastre. Abajo, solo el lightbox.

```js
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const items = Array.from(document.querySelectorAll('.slide__btn'));
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const data = items.map(btn => { const img = btn.querySelector('img'); return { src: img.src, alt: img.alt }; });
  let current = 0;
  let lastFocus = null;

  const show = i => {
    current = (i + data.length) % data.length;
    lbImg.src = data[current].src;
    lbImg.alt = data[current].alt;
    lbCap.textContent = data[current].alt;
  };
  const openLb = i => {
    lastFocus = document.activeElement;
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('intro-open');   // reutiliza el bloqueo de scroll
    if (window.lenis) window.lenis.stop();
    lbClose.focus();
  };
  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('intro-open');
    if (window.lenis) window.lenis.start();
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((btn, i) => btn.addEventListener('click', () => openLb(i)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}
```

---

## Cómo pedir cambios aquí (ejemplos)
- *"Convierte el carrusel en una **retícula tipo masonry** en desktop (alturas variables) que al
  hacer clic abra el mismo lightbox. Mantén el drag como alternativa en móvil."*
- *"Añade al **lightbox** una transición de apertura más rica: la miniatura clicada vuela hasta
  el centro (FLIP) en vez de un simple fade. Usa GSAP."*
- *"Quiero **zoom con la rueda** dentro del lightbox y arrastre para mover la imagen ampliada."*
- *"En el hover de `.slide__btn`, además del zoom, que el caption entre con un leve desenfoque
  que se resuelve."*
```
