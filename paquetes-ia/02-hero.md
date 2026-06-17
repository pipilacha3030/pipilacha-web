# Paquete · HERO (inicio)

**Qué es:** la portada de `/` (`index.astro`). Foto a sangre completa con velo en degradado,
título grande "Todo empieza con una flor" que **entra por máscara** (cada línea sube desde
abajo), subtítulo, y dos botones: **Reservar** (sólido) y **Regalar** (contorno). La foto hace
**parallax** suave (`data-parallax`) y los botones son **magnéticos** (se inclinan hacia el cursor).
El hero se anima por **tiempo** (`data-delay`), no por scroll.

Stack: Astro + CSS vanilla + GSAP + Lenis. Ver reglas globales en `00-LEEME.md`.

---

## 1) HTML — sección hero de `src/pages/index.astro`

```astro
<!-- HERO -->
<section class="hero" id="hero">
  <div class="hero__media" data-parallax="0.25">
    <img src="/assets/img/hero.jpg" alt="Cuenco de cerámica lleno de flores comestibles sostenido entre las manos" />
    <div class="hero__veil"></div>
  </div>
  <div class="hero__content">
    <p class="eyebrow reveal" data-delay="0.1">Restaurante de degustación · Madrid</p>
    <h1 class="hero__title">
      <span class="line"><span class="reveal-mask">Todo empieza</span></span>
      <span class="line"><span class="reveal-mask">con una flor</span></span>
    </h1>
    <p class="hero__sub reveal" data-delay="0.5">El único restaurante del mundo construido íntegramente sobre las flores.</p>
    <div class="hero__actions">
      <a href="/reservas/" class="btn btn--solid reveal" data-delay="0.65">Reservar</a>
      <a href="/regala/" class="btn btn--ghost reveal" data-delay="0.75">Regalar</a>
    </div>
  </div>
  <div class="hero__scroll reveal" data-delay="0.9"><span>Desliza</span></div>
</section>
```

> Notas: `.reveal-mask` arranca con `translateY(110%)` dentro de `.line{overflow:hidden}` → el
> JS lo sube. Los `data-delay` controlan el escalonado (en segundos). `data-parallax="0.25"`
> mueve la foto con el scroll.

---

## 2) CSS — `src/styles/main.css`

```css
/* ----- hero ----- */
.hero{position:relative;height:100svh;min-height:600px;overflow:hidden;display:flex;align-items:flex-end}
.hero__media{position:absolute;inset:-16% 0;z-index:0;will-change:transform}   /* inset negativo: margen para el parallax */
.hero__media img{filter:saturate(1.02)}
.hero__veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,20,12,.35) 0%,rgba(20,20,12,0) 28%,rgba(20,20,12,.15) 55%,rgba(20,20,12,.75) 100%)}
.hero__content{position:relative;z-index:2;color:var(--cream);padding:0 var(--gutter) clamp(3rem,8vh,6rem);max-width:var(--maxw)}
.hero__title{font-size:clamp(2.8rem,8.5vw,7.5rem);margin:.4rem 0 1.4rem;color:#fff}
.hero__title .line{display:block;overflow:hidden}
.hero__title .reveal-mask{display:inline-block;transform:translateY(110%)}
.hero__sub{font-size:clamp(1rem,1.6vw,1.35rem);max-width:38ch;font-weight:300;margin-bottom:2rem;opacity:.92}
.hero .eyebrow{color:var(--cream);opacity:.85}
.hero__scroll{position:absolute;bottom:2rem;right:var(--gutter);z-index:2;color:var(--cream);display:flex;align-items:center;gap:.8rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;opacity:.8}
.hero__scroll i{width:1px;height:50px;background:var(--cream);transform-origin:top;animation:scrollline 2.2s var(--ease) infinite}
@keyframes scrollline{0%{transform:scaleY(0);opacity:0}40%{transform:scaleY(1);opacity:1}100%{transform:scaleY(1) translateY(50px);opacity:0}}

/* fila de acciones */
.hero__actions{display:flex;flex-wrap:wrap;gap:.9rem;align-items:center}

/* ----- botones ----- */
.btn{position:relative;display:inline-block;font-family:var(--sans);font-weight:500;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;padding:1.05em 2.4em;border-radius:var(--radius-btn);cursor:pointer;transition:background .45s var(--ease),color .4s,box-shadow .5s var(--ease),letter-spacing .5s var(--ease)}
.btn--solid{background:var(--moss);color:var(--cream);box-shadow:0 10px 22px -12px rgba(49,51,31,.55)}
.btn--solid:hover{background:var(--olive);letter-spacing:.16em;box-shadow:0 18px 34px -14px rgba(49,51,31,.6)}
/* sobre fondo oscuro (hero): el sólido se vuelve claro y el ghost lleva contorno claro */
.hero .btn--solid{background:var(--cream);color:var(--moss);box-shadow:0 14px 30px -16px rgba(0,0,0,.55)}
.hero .btn--solid:hover{background:var(--accent-soft);color:var(--moss)}
.btn--ghost{background:transparent;color:var(--moss);box-shadow:inset 0 0 0 1px rgba(49,51,31,.5)}
.btn--ghost:hover{background:var(--moss);color:var(--cream);letter-spacing:.16em;box-shadow:inset 0 0 0 1px var(--moss),0 16px 30px -16px rgba(49,51,31,.55)}
.hero .btn--ghost{background:transparent;color:var(--cream);box-shadow:inset 0 0 0 1px rgba(244,239,230,.6)}
.hero .btn--ghost:hover{background:var(--cream);color:var(--moss);box-shadow:inset 0 0 0 1px var(--cream),0 16px 30px -16px rgba(0,0,0,.5)}
.btn--lg{padding:1.2em 3em;font-size:.9rem}
```

---

## 3) JS — `public/js/main.js`

```js
/* ----- animación del hero (por TIEMPO, no scroll) ----- */
function playHero() {
  if (heroPlayed || !window.gsap || reduceMotion) return;
  heroPlayed = true;
  // título por máscara: cada .reveal-mask sube desde translateY(110%)
  gsap.fromTo('.hero__title .reveal-mask',
    { yPercent: 110, y: 0 },
    { yPercent: 0, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.15 });
  // resto de elementos del hero, escalonados por su data-delay
  document.querySelectorAll('.hero [data-delay]').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.dataset.delay) + 0.1 });
  });
}
// playHero() se llama al entrar (tras la portada/intro, o directamente si no hay intro).

/* ----- parallax de la foto del hero (y de cualquier [data-parallax]) ----- */
gsap.utils.toArray('[data-parallax]').forEach(el => {
  const amt = parseFloat(el.dataset.parallax);
  gsap.fromTo(el,
    { yPercent: () => -amt * 50 },
    { yPercent: () => amt * 50, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
});

/* ----- botones magnéticos (solo puntero fino) ----- */
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  document.querySelectorAll('.btn, .nav__cta, .intro__enter, .intro__choice').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.28,
                     y: (e.clientY - r.top - r.height / 2) * 0.38,
                     duration: 0.4, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    });
  });
}
```

---

## Cómo pedir cambios aquí (ejemplos)
- *"Quiero que el **velo del hero** reaccione al cursor (un brillo radial suave que sigue el ratón)
  con una variable CSS `--mx/--my` seteada por JS; muy sutil, que no tape el texto."*
- *"Cambia la entrada del título: además de subir por máscara, que cada palabra entre con un
  ligero `blur` que se resuelve. Mantén el `stagger` y `expo.out`."*
- *"Añade un **scroll-indicator** animado (la barrita `.hero__scroll i`) que además haga fade-out
  cuando el usuario empieza a bajar, leyendo el scroll de Lenis."*
- *"Haz el parallax del hero más marcado en desktop y nulo en móvil (`<=560px`)."*
```
