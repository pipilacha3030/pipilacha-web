/* ============================================================
   GALERÍA: escenario 3D inmersivo (coverflow + fondo floral reactivo)
   Patrón de movimiento adaptado del "3D gradient carousel" (Codrops):
   nuestras fotos y nuestra paleta. Ajusta el "feel" desde el objeto CFG.

   Este módulo solo se carga (import dinámico desde main.js) cuando la
   página tiene #galStage: el resto del sitio no paga su peso.
   Su rAF/listeners se desmontan en destroyPage vía lifecycle.
   ============================================================ */
import { lenis } from './scroll/lenis.js';
import { reduceMotion } from './utils/motion.js';
import { pageSignal, onPageDestroy } from './utils/lifecycle.js';

export function initGallery() {
  const stage = document.getElementById('galStage');
  if (!stage) return;

  // ORDEN ALEATORIO EN CADA VISITA: baraja (Fisher-Yates) las tarjetas del DOM
  // antes de leerlas, así el reposo/lightbox/motor toman el nuevo orden. El HTML
  // se sirve en orden fijo (SEO / sin JS); esto solo reordena para el visitante.
  const galTrackEl = document.getElementById('galTrack');
  if (galTrackEl) {
    const items = Array.from(galTrackEl.children);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    const frag = document.createDocumentFragment();
    items.forEach((el) => frag.appendChild(el));
    galTrackEl.appendChild(frag);
  }

  const signal = pageSignal();
  const cards = Array.from(stage.querySelectorAll('.gal-card'));
  const data = cards.map((c) => { const img = c.querySelector('img'); return { src: img.src, alt: img.alt }; });
  let galPaused = false;

  /* ---- lightbox (independiente del motor: sirve también al fallback) ---- */
  const lightbox = document.getElementById('lightbox');
  const lb = {
    img: document.getElementById('lbImg'), cap: document.getElementById('lbCap'),
    close: document.getElementById('lbClose'), prev: document.getElementById('lbPrev'),
    next: document.getElementById('lbNext'), cur: 0, lastFocus: null,
  };
  const lbShow = (i) => {
    lb.cur = (i + data.length) % data.length;
    lb.img.src = data[lb.cur].src; lb.img.alt = data[lb.cur].alt; lb.cap.textContent = data[lb.cur].alt;
  };
  const openLb = (i) => {
    if (!lightbox) return;
    lb.lastFocus = document.activeElement;
    lbShow(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
    galPaused = true;                 // congela el motor mientras se ve la foto ampliada
    if (lenis) lenis.stop();
    lb.close.focus();
  };
  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
    galPaused = false;
    if (lb.lastFocus) lb.lastFocus.focus();
  };
  if (lightbox) {
    lb.close.addEventListener('click', closeLb);
    lb.prev.addEventListener('click', () => lbShow(lb.cur - 1));
    lb.next.addEventListener('click', () => lbShow(lb.cur + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') lbShow(lb.cur - 1);
      else if (e.key === 'ArrowRight') lbShow(lb.cur + 1);
      else if (e.key === 'Tab') {
        // diálogo modal: el foco circula entre sus tres botones (WCAG 2.4.3)
        const f = [lb.close, lb.prev, lb.next];
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i === -1 || i === f.length - 1 ? 0 : i + 1)].focus();
      }
    }, { signal });
  }

  /* ---- sin motor (reduced-motion): tira desplazable + clic abre lightbox ---- */
  if (reduceMotion) {
    cards.forEach((c, i) => c.querySelector('.gal-card__btn').addEventListener('click', () => openLb(i)));
    return;
  }

  /* ============================================================
     MOTOR — todos los valores de movimiento viven aquí (ajusta el feel)
     ============================================================ */
  const CFG = {
    friction:   0.9,    // decaimiento de la velocidad por frame (0-1)
    wheelSens:  0.30,   // sensibilidad de la rueda
    dragSens:   1.0,    // sensibilidad del arrastre
    maxRot:     28,     // giro máx. en Y (grados)
    maxDepth:   140,    // profundidad Z máx. (px)
    minScale:   0.92,   // escala en los bordes
    scaleRange: 0.10,   // escala extra al centrarse (→ 1.02 en el centro)
    gap:        28,     // separación entre tarjetas (px)
    autoDrift:  0.40,   // deriva lenta en reposo (px/frame)
    idleDelay:  2800,   // ms de inactividad antes de volver la deriva
    colorLerp:  0.055,  // suavizado del fondo hacia el color de la foto centrada
    farBlur:    3,      // desenfoque de las tarjetas lejanas (px)
  };

  const track = document.getElementById('galTrack');
  const canvas = document.getElementById('galBg');
  const ctx = canvas.getContext('2d');
  const idxEl = document.getElementById('galIdx');
  const N = cards.length;
  const BASE = [254, 252, 246]; // cloud white #FEFCF6 — el fondo se atenúa hacia aquí

  let unit = 0, trackW = 0, vwHalf = 0, cardW = 0;
  let pos = 0, vel = 0, centerIdx = -1, startT = 0;
  let dragging = false, moved = 0, lastX = 0, lastMove = 0, downIdx = -1;
  let lastInteract = performance.now();

  stage.classList.add('is-carousel');    // conmuta el CSS a modo 3D absoluto

  function measure() {
    cardW = cards[0].offsetWidth || Math.min(window.innerWidth * 0.26, 360);
    unit = cardW + CFG.gap;
    trackW = unit * N;
    vwHalf = window.innerWidth / 2;
    canvas.width = Math.max(2, Math.round(window.innerWidth * 0.6));
    canvas.height = Math.max(2, Math.round(window.innerHeight * 0.6));
  }
  measure();

  /* --- paleta: color dominante (pesan más los píxeles con saturación → las flores) --- */
  const palettes = new Array(N).fill(null);
  function extractPalette(img, i) {
    try {
      const c = document.createElement('canvas');
      const r = Math.min(48 / img.naturalWidth, 48 / img.naturalHeight) || 1;
      c.width = Math.max(1, Math.round(img.naturalWidth * r));
      c.height = Math.max(1, Math.round(img.naturalHeight * r));
      const cx = c.getContext('2d');
      cx.drawImage(img, 0, 0, c.width, c.height);
      const d = cx.getImageData(0, 0, c.width, c.height).data;
      let rV = 0, gV = 0, bV = 0, wV = 0;
      for (let p = 0; p < d.length; p += 4) {
        const R = d[p], G = d[p + 1], B = d[p + 2];
        const sat = Math.max(R, G, B) - Math.min(R, G, B);
        const w = sat * sat + 24;      // +24: el tono aún cuenta algo en fotos neutras
        rV += R * w; gV += G * w; bV += B * w; wV += w;
      }
      palettes[i] = [rV / wV, gV / wV, bV / wV];
    } catch (e) { palettes[i] = null; }
  }
  cards.forEach((card, i) => {
    const img = card.querySelector('img');
    const run = () => extractPalette(img, i);
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
  });

  /* --- fondo: dos radiales que florecen con el color del plato centrado --- */
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
  let colA = BASE.slice(), colB = BASE.slice(), tgtA = BASE.slice(), tgtB = BASE.slice();
  function setTarget(i) {
    const p = palettes[i];
    if (!p) { tgtA = BASE.slice(); tgtB = BASE.slice(); return; }
    tgtA = mix(p, BASE, 0.42);           // bloom principal, atenuado hacia la crema
    tgtB = mix(p, [255, 253, 248], 0.60); // halo más claro
  }
  let bgTick = 0;
  function renderBg(t) {
    if (bgTick++ & 1) return;             // ~30fps para el fondo
    colA = mix(colA, tgtA, CFG.colorLerp);
    colB = mix(colB, tgtB, CFG.colorLerp);
    const W = canvas.width, H = canvas.height;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = rgba(BASE, 1); ctx.fillRect(0, 0, W, H);
    const x1 = W * (0.5 + 0.18 * Math.sin(t * 0.00013)), y1 = H * (0.42 + 0.16 * Math.cos(t * 0.00017));
    let g = ctx.createRadialGradient(x1, y1, 0, x1, y1, H * 0.95);
    g.addColorStop(0, rgba(colA, 0.9)); g.addColorStop(1, rgba(BASE, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const x2 = W * (0.5 - 0.2 * Math.cos(t * 0.00011)), y2 = H * (0.6 + 0.2 * Math.sin(t * 0.00015));
    g = ctx.createRadialGradient(x2, y2, 0, x2, y2, H * 0.85);
    g.addColorStop(0, rgba(colB, 0.72)); g.addColorStop(1, rgba(BASE, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  /* --- coloca cada tarjeta según su distancia al centro (bucle infinito) --- */
  function layout(t) {
    if (!startT) startT = t;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - startT) / 900), 3); // entrada easeOutCubic
    const lift = (1 - ease) * 46;

    vel *= CFG.friction;
    pos += vel;
    if (!dragging && (performance.now() - lastInteract) > CFG.idleDelay && Math.abs(vel) < 0.05)
      pos += CFG.autoDrift;              // deriva serena cuando nadie toca
    if (Math.abs(vel) < 0.001) vel = 0;

    let best = Infinity, bestI = 0;
    for (let i = 0; i < N; i++) {
      let x = i * unit - pos;
      x = ((x % trackW) + trackW) % trackW;
      if (x > trackW / 2) x -= trackW;   // offset del centro de la tarjeta al centro del viewport
      const norm = Math.max(-1, Math.min(1, x / vwHalf));
      const inv = 1 - Math.abs(norm);
      const tz = inv * CFG.maxDepth;
      const card = cards[i];
      card.style.transform =
        `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${lift.toFixed(1)}px),${tz.toFixed(1)}px)` +
        ` rotateY(${(-norm * CFG.maxRot).toFixed(2)}deg) scale(${(CFG.minScale + inv * CFG.scaleRange).toFixed(3)})`;
      card.style.zIndex = 1000 + Math.round(tz);
      card.style.opacity = (ease * (0.5 + inv * 0.5)).toFixed(3);
      const f = Math.abs(x) > cardW * 1.7 ? `blur(${CFG.farBlur}px)` : '';
      if (card.dataset.f !== f) { card.style.filter = f; card.dataset.f = f; }
      const ax = Math.abs(x);
      if (ax < best) { best = ax; bestI = i; }
    }
    if (bestI !== centerIdx) {
      centerIdx = bestI;
      setTarget(bestI);
      if (idxEl) idxEl.textContent = String(bestI + 1).padStart(2, '0');
    }
  }

  let rafId;
  function frame(t) {
    if (!galPaused) { layout(t); renderBg(t); }
    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);
  onPageDestroy(() => cancelAnimationFrame(rafId)); // el motor muere con la página

  /* --- interacción: rueda + arrastre (ratón/táctil) + teclado --- */
  if (lenis) lenis.stop();  // esta página no hace scroll vertical

  stage.addEventListener('wheel', (e) => {
    if (galPaused) return;
    e.preventDefault(); e.stopPropagation();
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 16;       // deltas en líneas → normaliza a px
    vel += d * CFG.wheelSens;
    lastInteract = performance.now();
  }, { passive: false });

  stage.addEventListener('pointerdown', (e) => {
    if (galPaused) return;
    dragging = true; moved = 0; lastX = e.clientX; lastMove = 0; vel = 0;
    stage.classList.add('is-dragging');
    if (stage.setPointerCapture) { try { stage.setPointerCapture(e.pointerId); } catch (_) {} }
    const card = e.target.closest('.gal-card');
    downIdx = card ? cards.indexOf(card) : -1;
    lastInteract = performance.now();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    moved += Math.abs(dx); lastMove = dx;
    pos -= dx * CFG.dragSens;
    lastInteract = performance.now();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; stage.classList.remove('is-dragging');
    vel = -lastMove * CFG.dragSens * 1.4;         // inercia al soltar
    lastInteract = performance.now();
    if (moved < 6 && downIdx >= 0) openLb(downIdx); // apenas se movió → tap → ampliar
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { vel -= unit * 0.16; lastInteract = performance.now(); }
    else if (e.key === 'ArrowRight') { vel += unit * 0.16; lastInteract = performance.now(); }
  });
  // Enter/Espacio sobre una tarjeta enfocada (click de teclado → detail 0) amplía sin duplicar el tap
  cards.forEach((card, i) => {
    card.querySelector('.gal-card__btn').addEventListener('click', (e) => { if (e.detail === 0) openLb(i); });
  });

  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measure, 150); }, { signal });
}
