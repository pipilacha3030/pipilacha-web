/* ============================================================
   IMAGE FLOW · focal lens animation
   GSAP + ScrollTrigger (globals loaded via is:inline in Base.astro)
   ============================================================ */

// Per-layer visual properties (index = layer - 1)
const BASE_SCALE  = [0.60, 0.80, 1.00] as const;
const FOCUS_BOOST = [0.24, 0.20, 0.13] as const;
const MIN_OPACITY = [0.30, 0.42, 0.50] as const;
const MAX_BLUR    = [4.0,  2.0,  0.0 ] as const;

const TRAVEL_FACTOR = 2.65; // total x travel = vw × factor × speed

function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

interface CardData {
  el:     HTMLElement;
  speed:  number;
  offset: number;
  rotate: number;
  layer:  number;
  w:      number; // cached offsetWidth — refreshed on resize
}

export function initImageFlow(): void {
  const section = document.querySelector<HTMLElement>('[data-image-flow]');
  if (!section) return;

  // GSAP + ScrollTrigger are window globals loaded before this module runs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gsap: any = (window as any).gsap;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ST: any   = (window as any).ScrollTrigger;
  if (!gsap || !ST) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cardEls = Array.from(section.querySelectorAll<HTMLElement>('.image-flow__card'));
  if (!cardEls.length) return;

  // Cache card metadata — avoids re-parsing data attributes every frame
  const cards: CardData[] = cardEls.map(el => ({
    el,
    speed:  parseFloat(el.dataset.speed  ?? '1'),
    offset: parseFloat(el.dataset.offset ?? '0.5'),
    rotate: parseFloat(el.dataset.rotate ?? '0'),
    layer:  parseInt  (el.dataset.layer  ?? '2', 10),
    w:      el.offsetWidth,
  }));

  // Which layers are hidden at the current breakpoint (matches CSS)
  const hiddenLayers = new Set<number>();
  function syncHiddenLayers(): void {
    hiddenLayers.clear();
    if (window.matchMedia('(max-width: 560px)').matches) {
      hiddenLayers.add(1); hiddenLayers.add(3);
    } else if (window.matchMedia('(max-width: 900px)').matches) {
      hiddenLayers.add(3);
    }
  }
  syncHiddenLayers();

  // Re-sync on resize + refresh card widths
  ST.addEventListener('refresh', () => {
    syncHiddenLayers();
    cards.forEach(c => { c.w = c.el.offsetWidth; });
  });

  let progress = 0;

  // Single ScrollTrigger drives scroll progress 0→1
  ST.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate(self: { progress: number }) { progress = self.progress; },
  });

  function tick(): void {
    const vw      = window.innerWidth;
    const cx      = vw * 0.5;    // viewport horizontal center
    const maxDist = vw * 0.52;   // focal radius — beyond this, fully small/dim

    for (const card of cards) {
      if (hiddenLayers.has(card.layer)) continue;

      const li          = card.layer - 1; // 0-indexed
      const travel      = vw * TRAVEL_FACTOR * card.speed;
      // startX: position at progress=0 so that the card is centered when progress === offset
      const centeredX   = cx - card.w / 2;
      const startX      = centeredX + card.offset * travel;
      const x           = startX - progress * travel;

      // Proximity: 1 = centered, 0 = off-screen
      const dist        = Math.abs(x + card.w / 2 - cx);
      const proximity   = smoothstep(1 - dist / maxDist);

      const scale   = BASE_SCALE[li]  + FOCUS_BOOST[li]  * proximity;
      const opacity = MIN_OPACITY[li] + (1 - MIN_OPACITY[li]) * proximity;
      const blur    = MAX_BLUR[li]    * (1 - proximity);

      // Toggle focused class for CSS box-shadow transition (no per-frame paint)
      card.el.classList.toggle('is-focused', proximity > 0.55);

      gsap.set(card.el, {
        x,
        scale,
        opacity,
        rotation: card.rotate,
        filter: blur > 0.08 ? `blur(${blur.toFixed(2)}px)` : 'none',
        force3D: true,
      });
    }
  }

  // Position all cards before the first scroll event fires
  tick();

  // Attach/detach ticker only while section intersects viewport
  let tickerActive = false;
  ST.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle(self: { isActive: boolean }) {
      if (self.isActive && !tickerActive) {
        gsap.ticker.add(tick);
        tickerActive = true;
      } else if (!self.isActive && tickerActive) {
        gsap.ticker.remove(tick);
        tickerActive = false;
      }
    },
  });
}
