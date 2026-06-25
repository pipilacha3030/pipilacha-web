/* imageFlow.js — cinematic focal-lens scroll stream  v2
 *
 * Each card has a "phase" (0–1): the scroll progress at which its center
 * aligns with the viewport center. Proximity to that focal point drives
 * scale, opacity and shadow. Coefficient 2.4 creates a tight focal zone
 * so only 3–5 cards are prominent at once (the 072 look).
 */
(function () {
  'use strict';

  var section = document.getElementById('imageFlow');
  if (!section) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── layer config: speed (×vw), scale range, z-base ── */
  var LAYER = {
    1: { speed: 1.50, minScale: 0.15, maxScale: 0.72, baseZ: 1  },
    2: { speed: 2.20, minScale: 0.22, maxScale: 1.00, baseZ: 7  },
    3: { speed: 3.00, minScale: 0.28, maxScale: 1.32, baseZ: 13 },
  };

  var cards = Array.from(section.querySelectorAll('.image-flow__card'))
    .filter(function (el) { return getComputedStyle(el).display !== 'none'; })
    .map(function (el) {
      var layer = parseInt(el.dataset.layer, 10) || 2;
      var cfg   = LAYER[layer] || LAYER[2];
      return {
        el:       el,
        phase:    parseFloat(el.dataset.phase) || 0.5,
        w:        parseFloat(el.dataset.w)     || 300,
        rot:      parseFloat(el.dataset.rot)   || 0,
        speed:    cfg.speed,
        minScale: cfg.minScale,
        maxScale: cfg.maxScale,
        baseZ:    cfg.baseZ,
      };
    });

  if (!cards.length) return;

  function ss(t)       { var c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); }
  function lerp(a,b,t) { return a + (b - a) * t; }

  var lastProg = -1;

  function tick(prog) {
    if (Math.abs(prog - lastProg) < 0.00012) return;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    if (!vw) return;   // layout not ready; retry next call
    lastProg = prog;

    for (var i = 0; i < cards.length; i++) {
      var d = cards[i];

      var centerX = vw * 0.5 + (d.phase - prog) * d.speed * vw;
      var leftX   = centerX - d.w * 0.5;

      /* focal proximity — coefficient 2.4 = tight focal zone */
      var dist  = Math.abs(centerX - vw * 0.5) / vw;
      var prox  = ss(Math.max(0, 1 - dist * 2.4));

      var scale   = lerp(d.minScale, d.maxScale, prox);
      var opacity = prox;
      var rot     = d.rot * (1 - prox * 0.30);
      var zIndex  = d.baseZ + Math.round(prox * 6);

      /* sombra paralela — directional shadow strengthens at focal center */
      var shX  = Math.round(lerp(1,  6, prox));
      var shY  = Math.round(lerp(4, 28, prox));
      var shB  = Math.round(lerp(8, 80, prox));
      var shA  = lerp(0.03, 0.30, prox).toFixed(3);

      var el = d.el;
      el.style.transform  = 'translate3d(' + leftX.toFixed(1) + 'px,0,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
      el.style.opacity    = opacity.toFixed(3);
      el.style.zIndex     = zIndex;
      el.style.boxShadow  = shX + 'px ' + shY + 'px ' + shB + 'px rgba(0,0,0,' + shA + ')';
    }
  }

  requestAnimationFrame(function () { tick(0); });

  ScrollTrigger.create({
    trigger:  section,
    start:    'top top',
    end:      'bottom bottom',
    scrub:    0.8,
    onUpdate: function (self) { tick(self.progress); },
    invalidateOnRefresh: true,
    onRefresh: function () { lastProg = -1; },
  });

  /* hover: subtle inner zoom without conflicting with card transform */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    cards.forEach(function (d) {
      var img = d.el.querySelector('img');
      if (!img) return;
      d.el.addEventListener('mouseenter', function () {
        gsap.to(img, { scale: 1.06, duration: 0.45, ease: 'power2.out', overwrite: true });
      });
      d.el.addEventListener('mouseleave', function () {
        gsap.to(img, { scale: 1.00, duration: 0.55, ease: 'power2.inOut', overwrite: true });
      });
    });
  }
})();
