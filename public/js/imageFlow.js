/* imageFlow.js — cinematic focal-lens scroll stream  v1
 *
 * Each image has a "phase" (0–1) marking when during the scroll its center
 * aligns with the viewport center. As it passes through that focal point it
 * scales up, brightens and casts a deeper shadow; farther images recede.
 * Three layers (far/mid/near) travel at different speeds to fake depth.
 */
(function () {
  'use strict';

  var section = document.getElementById('imageFlow');
  if (!section) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── layer config: speed (×vw), scale range, z-base ── */
  var LAYER = {
    1: { speed: 1.80, minScale: 0.36, maxScale: 0.88, baseZ: 1  },
    2: { speed: 2.40, minScale: 0.46, maxScale: 1.05, baseZ: 7  },
    3: { speed: 3.20, minScale: 0.58, maxScale: 1.26, baseZ: 13 },
  };

  /* ── build card list, skip CSS-hidden elements ── */
  var cards = Array.from(section.querySelectorAll('.image-flow__card'))
    .filter(function (el) { return getComputedStyle(el).display !== 'none'; })
    .map(function (el) {
      var layer = parseInt(el.dataset.layer, 10) || 2;
      var cfg   = LAYER[layer] || LAYER[2];
      return {
        el:       el,
        phase:    parseFloat(el.dataset.phase)  || 0.5,
        w:        parseFloat(el.dataset.w)      || 300,
        rot:      parseFloat(el.dataset.rot)    || 0,
        speed:    cfg.speed,
        minScale: cfg.minScale,
        maxScale: cfg.maxScale,
        baseZ:    cfg.baseZ,
      };
    });

  if (!cards.length) return;

  /* ── helpers ── */
  function ss(t)        { var c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); }
  function lerp(a,b,t)  { return a + (b - a) * t; }

  /* ── per-frame update ── */
  var lastProg = -1;

  function tick(prog) {
    if (Math.abs(prog - lastProg) < 0.00012) return;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    if (!vw) return;   // layout not ready; don't update lastProg so next call retries
    lastProg = prog;

    for (var i = 0; i < cards.length; i++) {
      var d = cards[i];

      /* horizontal position driven by scroll progress */
      var centerX = vw * 0.5 + (d.phase - prog) * d.speed * vw;
      var leftX   = centerX - d.w * 0.5;

      /* proximity to the focal center (0 = far away, 1 = dead-center) */
      var dist  = Math.abs(centerX - vw * 0.5) / vw;
      var prox  = ss(Math.max(0, 1 - dist * 1.65));

      var scale   = lerp(d.minScale, d.maxScale, prox);
      var opacity = prox;                          /* invisible when off-center */
      var rot     = d.rot * (1 - prox * 0.22);    /* slight straighten at center */
      var zIndex  = d.baseZ + Math.round(prox * 5);

      /* shadow grows with proximity */
      var shY  = Math.round(lerp(6,  56, prox));
      var shB  = Math.round(lerp(14, 90, prox));
      var shA  = lerp(0.04, 0.24, prox).toFixed(3);

      var el = d.el;
      el.style.transform  = 'translate3d(' + leftX.toFixed(1) + 'px,0,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
      el.style.opacity    = opacity.toFixed(3);
      el.style.zIndex     = zIndex;
      el.style.boxShadow  = '0 ' + shY + 'px ' + shB + 'px rgba(0,0,0,' + shA + ')';
    }
  }

  /* ── initialise after first paint, then wire ScrollTrigger ── */
  requestAnimationFrame(function() { tick(0); });

  ScrollTrigger.create({
    trigger:  section,
    start:    'top top',
    end:      'bottom bottom',
    scrub:    1.2,
    onUpdate: function (self) { tick(self.progress); },
    invalidateOnRefresh: true,
    onRefresh: function () { lastProg = -1; },
  });

  /* ── hover: subtle inner-image zoom (no conflict with card transform) ── */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    cards.forEach(function (d) {
      var img = d.el.querySelector('img');
      if (!img) return;
      d.el.addEventListener('mouseenter', function () {
        gsap.to(img, { scale: 1.07, duration: 0.45, ease: 'power2.out', overwrite: true });
      });
      d.el.addEventListener('mouseleave', function () {
        gsap.to(img, { scale: 1.00, duration: 0.55, ease: 'power2.inOut', overwrite: true });
      });
    });
  }

})();
