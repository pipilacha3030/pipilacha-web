# Paquete · ANIMACIONES DEL INICIO (manifiesto + showcase + parallax)

**Qué es:** las tres piezas animadas más vistosas del scroll del home (`index.astro`):

1. **Manifiesto** (`.manifesto`): sección **pinned**; cada palabra se **levanta en 3D**
   (rotateX) según el scroll, y una flor cruza por detrás. `scrub` ajustado para que siga al dedo.
2. **Showcase "Despertar de las flores"** (`.showcase-wrap`): una foto **florece** desde una
   tarjeta centrada hasta pantalla completa (`clip-path` + `scale`), aparece un velo y el caption
   sube. Es un enlace al menú.
3. **Parallax** genérico (`[data-parallax]`): medios grandes que se desplazan con el scroll.

Todo con GSAP + ScrollTrigger, enganchado al loop de Lenis. Ver reglas globales en `00-LEEME.md`.
⚠️ El `pin` de ScrollTrigger fija la sección mientras dura la animación: cuidado al cambiar `end`.

---

## 1) HTML — secciones de `src/pages/index.astro`

```astro
<!-- MANIFIESTO (pinned: las palabras se encienden con el scroll) -->
<section class="manifesto" id="manifesto">
  <img src="/assets/img/petal-oxalis.png" class="manifesto__bloom" alt="" aria-hidden="true" />
  <p class="manifesto__text">
    <span class="m-word">El</span> <span class="m-word">único</span> <span class="m-word">restaurante</span>
    <span class="m-word">de</span> <span class="m-word"><em>flores</em></span> <span class="m-word">del</span>
    <span class="m-word">mundo.</span>
  </p>
</section>

<!-- DESPERTAR DE LAS FLORES (pinned: la foto se expande a pantalla completa) -->
<section class="showcase-wrap" id="despertar">
  <a class="showcase" href="/menu/" aria-label="Ver el menú Despertar de las flores">
    <figure class="showcase__frame">
      <img src="/assets/img/esparragos-tagete.jpg" alt="Espárragos a la brasa con romesco de tagete, sobre plato de piedra" />
      <span class="showcase__veil" aria-hidden="true"></span>
    </figure>
    <span class="showcase__cap">
      <span class="eyebrow">El menú</span>
      <span class="showcase__title">Despertar de las flores</span>
      <span class="showcase__more">Ver los pases →</span>
    </span>
  </a>
</section>

<!-- Ejemplo de parallax: la barra (también el hero usa data-parallax) -->
<section class="barra" id="barra">
  <div class="barra__media" data-parallax="0.18">
    <img src="/assets/img/barra.jpg" alt="La barra de iroko de seis metros, puesta para el servicio" />
    <div class="barra__veil"></div>
  </div>
  <!-- …contenido… -->
</section>
```

---

## 2) CSS — `src/styles/main.css`

```css
/* ----- manifiesto (pinned, palabras que se encienden) ----- */
.manifesto{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:0 var(--gutter);text-align:center;overflow:hidden}
.manifesto__text{position:relative;z-index:2;max-width:1100px;perspective:900px;font-family:var(--serif);font-size:clamp(2.2rem,5.6vw,5rem);line-height:1.16;color:var(--moss)}
.manifesto__text em{color:var(--terracotta);font-style:italic}
.manifesto .m-word{display:inline-block;will-change:transform,opacity;transform-origin:50% 100%}
.manifesto__bloom{position:absolute;z-index:1;left:50%;top:50%;width:clamp(260px,38vw,560px);height:auto;transform:translate(-50%,-50%);opacity:.16;filter:blur(3px);pointer-events:none;will-change:transform}

/* ----- showcase: foto que florece a pantalla completa ----- */
.showcase-wrap{position:relative}
.showcase{display:block;position:relative;height:100svh;min-height:560px;text-decoration:none;color:inherit;overflow:hidden}
.showcase__frame{position:absolute;inset:0;margin:0;overflow:hidden;clip-path:inset(0 0 0 0 round 0);will-change:clip-path}
.showcase__frame img{width:100%;height:100%;object-fit:cover;will-change:transform}
.showcase__veil{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(20,20,12,0) 45%,rgba(20,20,12,.62) 100%)}
.showcase__cap{position:absolute;left:0;right:0;bottom:clamp(2.5rem,8vh,5.5rem);z-index:2;display:flex;flex-direction:column;gap:.6rem;align-items:center;text-align:center;color:var(--cream);padding:0 var(--gutter)}
.showcase__cap .eyebrow{margin-bottom:0;color:var(--cream);opacity:.85}
.showcase__title{font-family:var(--serif);font-size:clamp(2.2rem,6vw,5rem);color:#fff;line-height:1.05}
.showcase__more{font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cream);border-bottom:1px solid rgba(244,239,230,.5);padding-bottom:.35em;margin-top:.6rem;transition:color .4s,border-color .4s}
.showcase:hover .showcase__more{color:#fff;border-color:#fff}

/* ----- medios con parallax (hero, barra…) ----- */
/* el contenedor lleva inset negativo para que el desplazamiento no descubra el fondo */
.barra__media{position:absolute;inset:-16% 0;z-index:0;will-change:transform}
```

---

## 3) JS — `public/js/main.js` (todo dentro de `if (!reduceMotion) { … }`)

```js
/* manifiesto pinned: cada palabra se levanta en 3D, la flor cruza por detrás */
if (document.querySelector('.manifesto')) {
  const mTl = gsap.timeline({
    scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=130%', pin: true, scrub: 0.8 }
  });
  mTl.fromTo('.manifesto .m-word',
      { opacity: 0.12, yPercent: 100, rotateX: -75 },
      { opacity: 1, yPercent: 0, rotateX: 0, stagger: 0.16, ease: 'power3.out', duration: 1 })
     .to('.manifesto__text em', { scale: 1.06, ease: 'power2.out', duration: 0.4 }, '>-0.2')
     .fromTo('.manifesto__bloom',
      { yPercent: 55, rotate: -18, scale: .9 },
      { yPercent: -60, rotate: 14, scale: 1.05, ease: 'none' }, 0);
}

/* showcase: la foto florece desde una tarjeta centrada hasta pantalla completa */
const sFrame = document.querySelector('.showcase__frame');
if (sFrame) {
  const sTl = gsap.timeline({
    scrollTrigger: { trigger: '.showcase-wrap', start: 'top top', end: '+=95%', pin: true, scrub: 0.7 }
  });
  sTl.fromTo(sFrame,
      { clipPath: 'inset(38% 32% 38% 32% round 26px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 0.85 })
     .fromTo(sFrame.querySelector('img'), { scale: 1.55 }, { scale: 1, ease: 'none', duration: 1 }, 0)
     .fromTo('.showcase__veil', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.5)
     .fromTo('.showcase__cap',
      { opacity: 0, yPercent: 80, filter: 'blur(4px)' },
      { opacity: 1, yPercent: 0, filter: 'blur(0px)', ease: 'power3.out', duration: 0.3 }, 0.62);
}

/* parallax CENTRADO: a mitad de recorrido el desplazamiento es 0 (no descubre el fondo) */
gsap.utils.toArray('[data-parallax]').forEach(el => {
  const amt = parseFloat(el.dataset.parallax);
  gsap.fromTo(el,
    { yPercent: () => -amt * 50 },
    { yPercent: () => amt * 50, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
});
```

> Recuerda: Lenis y ScrollTrigger ya están sincronizados (`lenis.on('scroll', ScrollTrigger.update)`
> + `gsap.ticker.add(t => lenis.raf(t*1000))`). Cualquier ScrollTrigger nuevo se beneficia solo.

---

## Cómo pedir cambios aquí (ejemplos)
- *"En el **manifiesto**, en vez de levantar palabra a palabra, quiero un efecto de 'enfoque':
  todas empiezan desenfocadas y a baja opacidad y se resuelven con el scroll, una tras otra.
  Mantén el `pin` y el `scrub`."*
- *"Haz que el **showcase** además mueva el caption con un parallax leve respecto a la foto, para
  dar profundidad."*
- *"Quiero una nueva sección pinned tipo 'horizontal scroll' para una tira de citas, siguiendo el
  mismo patrón ScrollTrigger (pin + scrub) que el manifiesto."*
- *"Suaviza el `scrub` global a 1 y comprueba que no genere lag con Lenis."*

> ⚠️ Pistas para la IA: el `end:'+=130%'`/`'+=95%'` define cuánto dura el pin (en % de viewport).
> No pongas `data-parallax` en pétalos/flores (pelea con sus keyframes CSS `float`/`float2`).
```
