import { useEffect, useRef } from "react";

/**
 * Snow settled on top of something: thousands of tiny flakes resting on the
 * upper edges of a heading's letters ("text") or along the top of a card
 * ("edge"). The cursor (or a finger) pushes the snow off; it tumbles, fades,
 * and quietly settles back a few seconds later. On first view the snow falls
 * into place. Reduced motion: it is simply there, nothing moves.
 *
 * Place it as the first child of a position:relative element. In "text" mode
 * it reads the letters from the sibling marked [data-snow-text].
 */
type SnowCapProps = {
  mode: "text" | "edge";
  radius?: number;
  /** "light" (cream backgrounds) gives the snow a soft cool edge so white reads on cream. */
  ground?: "light" | "dark";
  /** Edge mode: how deep the drift is (1 = a card's light dusting). */
  scale?: number;
  /** Edge mode: run right off both ends (a full-width section edge) instead of tapering in. */
  bleed?: boolean;
};

type Flake = { x: number; y: number; hx: number; hy: number; r: number; vx: number; vy: number; a: number; s: 0 | 1 | 2 | 3; t: number; k: 0 | 1 | 2; q: boolean };
// q: in the active (moving) list rather than only in the baked resting picture
// k: tone. 0 sunlit top, 1 overhang, 2 shaded underside of the overhang
// s: 0 resting, 1 knocked loose, 2 gone, 3 settling (falling into place)

const PAD = 28; // room above for snow and for flakes falling in
const SIDE = 20;
const FALL = 70; // room below for knocked-loose flakes to fall and fade
const STRIP = 4; // width of each slice in the settle-in wave
const FADE = 18; // flakes fade out this close to the canvas edge, so nothing is ever cut off hard

const rand = (seed: number) => {
  let v = seed >>> 0;
  return () => { v = (v * 1664525 + 1013904223) >>> 0; return v / 4294967296; };
};

const SnowCap = ({ mode, radius = 14, ground = "light", scale = 1, bleed = false }: SnowCapProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Deeper drifts need more room above the edge.
  const pad = Math.round(PAD * Math.max(1, scale));

  useEffect(() => {
    const cv = canvas.current;
    const host = cv?.parentElement;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let flakes: Flake[] = [];
    let W = 0, H = 0, raf = 0, dpr = 1, built = false, started = false;
    let px = -1e4, py = -1e4, pvx = 0, pvy = 0;

    const surface = (): Int16Array => {
      const surf = new Int16Array(W).fill(-1);
      if (mode === "edge") {
        const top = pad, r = radius;
        if (bleed) return surf.fill(top);
        for (let x = 0; x < W; x++) {
          const cx = x - SIDE;
          const w = W - 2 * SIDE;
          if (cx < 0 || cx > w) continue;
          const d = cx < r ? r - cx : cx > w - r ? cx - (w - r) : 0;
          surf[x] = Math.round(top + (d ? r - Math.sqrt(Math.max(0, r * r - d * d)) : 0));
        }
        return surf;
      }
      // Draw the real letters into a mask, then find the top of each column.
      const words = host.querySelector<HTMLElement>("[data-snow-text]");
      if (!words) return surf;
      const m = document.createElement("canvas");
      m.width = W; m.height = H;
      const mc = m.getContext("2d", { willReadFrequently: true });
      if (!mc) return surf;
      const box = cv.getBoundingClientRect();
      const walker = document.createTreeWalker(words, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.textContent ?? "";
        const cs = getComputedStyle(n.parentElement!);
        mc.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        mc.fillStyle = "#000";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (/\s/.test(ch)) continue;
          range.setStart(n, i); range.setEnd(n, i + 1);
          const r = range.getBoundingClientRect();
          if (!r.width) continue;
          const asc = mc.measureText(ch).fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
          mc.fillText(ch, r.left - box.left, r.top - box.top + asc);
        }
      }
      const img = mc.getImageData(0, 0, W, H).data;
      for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
          if (img[(y * W + x) * 4 + 3] > 140) { surf[x] = y; break; }
        }
      }
      return surf;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = Math.ceil(rect.width + SIDE * 2);
      // A card only needs the strip along its top; a heading needs every line.
      H = Math.ceil((mode === "edge" ? 24 * scale : rect.height) + pad + FALL);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const surf = surface();
      const rnd = rand(W * 31 + H);
      const maxDepth = mode === "edge" ? 13 * scale : ground === "light" ? 5.4 : 5;
      // Where the snow hangs over the edge: soft broad droops plus a few
      // rounded clumps, placed at random along the edge (seeded, so stable).
      const lobes: { c: number; a: number; w: number; round: boolean }[] = [];
      const span = W - 2 * SIDE;
      const count = mode === "edge" ? Math.max(2, Math.round(span / 75)) : Math.round(span / 110);
      for (let i = 0; i < count; i++) {
        const clump = rnd() < (mode === "edge" ? 0.45 : 0.6);
        const a = mode === "edge" ? (clump ? 6 + rnd() * 7 : 3 + rnd() * 4) * Math.sqrt(scale) : (clump ? 2 + rnd() * 2.2 : 1 + rnd() * 1.2);
        lobes.push({ c: SIDE + 20 + rnd() * Math.max(1, span - 40), a, w: clump ? a * (0.7 + rnd() * 0.5) : 10 + rnd() * 18, round: clump });
      }
      const hangAt = (x: number) => {
        let h = 0;
        for (const l of lobes) {
          const d = (x - l.c) / l.w;
          h = Math.max(h, l.round ? (Math.abs(d) < 1 ? l.a * Math.sqrt(1 - d * d) : 0) : l.a * Math.exp(-d * d * 2));
        }
        return h;
      };
      flakes = [];
      for (let x = 1; x < W - 1; x += 1.1) {
        const xi = Math.round(x), y0 = surf[xi];
        if (y0 < 0) continue;
        // Snow doesn't hold on steep sides: thin it where the edge drops away.
        const slope = Math.max(Math.abs(y0 - (surf[xi - 2] ?? y0)), Math.abs(y0 - (surf[xi + 2] ?? y0)));
        if (slope > 6 || (surf[xi - 2] ?? -1) < 0 || (surf[xi + 2] ?? -1) < 0) continue;
        // Gentle lumps: broad mounds on a card edge, finer variation on letters.
        const drift = mode === "edge"
          ? Math.max(0.2, 0.5 + 0.32 * Math.sin((x * 0.028) / Math.sqrt(scale) + 0.6) + 0.18 * Math.sin((x * 0.09) / Math.sqrt(scale) + 1.7))
          : 0.55 + 0.25 * Math.sin(x * 0.045) + 0.2 * Math.sin(x * 0.13 + 1.7);
        const taper = mode === "edge" && !bleed ? Math.min(1, Math.min(x - SIDE, W - SIDE - x) / 40) : 1;
        const steep = slope > 2 ? 0.45 : 1;
        const depth = maxDepth * drift * taper * steep;
        const layers = Math.max(1, Math.round(depth / 1.15));
        for (let l = 0; l < layers; l++) {
          const r = (l === layers - 1 ? 0.55 : 0.7) + rnd() * 0.75;
          const hx = x + (rnd() - 0.5) * 1.1;
          const hy = y0 - 0.5 - l * 1.15 - rnd() * 0.5;
          flakes.push({ x: hx, y: hy, hx, hy, r, vx: 0, vy: 0, a: 1, s: 0, t: 0, k: 0, q: false });
        }
        // The overhang: a thin lip everywhere, deeper where it clumps.
        const lip = mode === "edge" ? 1.6 + depth * 0.12 : 0.9;
        const hang = (lip + hangAt(x) * (0.55 + 0.45 * drift)) * taper * (slope > 2 ? 0.3 : 1);
        for (let d = 0.6; d < hang; d += 1.05) {
          const r = 0.6 + rnd() * 0.7;
          const hx = x + (rnd() - 0.5) * 1.1;
          const hy = y0 + d + (rnd() - 0.5) * 0.4;
          flakes.push({ x: hx, y: hy, hx, hy, r, vx: 0, vy: 0, a: 1, s: 0, t: 0, k: hang - d < 1.6 ? 2 : 1, q: false });
        }
      }
      rest.width = cv.width; rest.height = cv.height;
      cols = Array.from({ length: W }, () => [] as Flake[]);
      for (const f of flakes) cols[Math.max(0, Math.min(W - 1, Math.round(f.hx)))].push(f);
      jit = Array.from({ length: Math.ceil(W / STRIP) }, () => rnd() * 220);
      active = [];
      built = true;
    };

    // The resting snow is painted once into `rest` and stamped each frame;
    // only flakes that are actually moving are drawn one by one.
    const rest = document.createElement("canvas");
    const rctx = rest.getContext("2d")!;
    let active: Flake[] = [];
    let cols: Flake[][] = [];
    let jit: number[] = [];
    let reveal = 0; // start of the first-view settle-in wave; 0 once it's done
    let regrowTimer = 0;

    const light = ground === "light";
    const PASSES: [string, number, number, (f: Flake) => boolean][] = [
      // A soft shadow cast just under the overhang, so it lifts off the edge.
      [light ? "rgba(70, 84, 104, 0.07)" : "rgba(20, 26, 36, 0.2)", 1.7, 0.9, (f) => f.k > 0],
      // A soft cool rim around each flake so the white reads as snow on cream.
      [light ? "rgba(128, 146, 166, 0.3)" : "rgba(120, 136, 152, 0.2)", light ? 0.45 : 0.7, light ? 0.55 : 0, () => true],
      ["#ffffff", 0, 0, (f) => f.k === 0],
      ["#f2f5f9", 0, 0, (f) => f.k === 1],
      ["#dde4ec", 0, 0, (f) => f.k === 2],
    ];
    const paint = (c: CanvasRenderingContext2D, list: Flake[], only?: number) => {
      for (let n = 0; n < PASSES.length; n++) {
        if (only !== undefined && n !== only) continue;
        const [style, dy, dr, keep] = PASSES[n];
        c.fillStyle = style;
        c.globalAlpha = 1;
        c.beginPath();
        for (const f of list) {
          if (f.s === 2 || f.a < 0.98 || !keep(f)) continue;
          c.moveTo(f.x + f.r + dr, f.y + dy);
          c.arc(f.x, f.y + dy, f.r + dr, 0, 6.2832);
        }
        c.fill();
        for (const f of list) {
          if (f.s === 2 || f.a >= 0.98 || f.a <= 0.02 || !keep(f)) continue;
          c.globalAlpha = f.a;
          c.beginPath();
          c.arc(f.x, f.y + dy, f.r + dr, 0, 6.2832);
          c.fill();
        }
      }
      c.globalAlpha = 1;
    };
    let baked = false;
    const bake = () => {
      rctx.setTransform(1, 0, 0, 1, 0, 0);
      rctx.clearRect(0, 0, rest.width, rest.height);
      rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(rctx, flakes);
      baked = true;
    };
    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      if (reveal) {
        // First view: the snow drops softly into place in a wave, left to right.
        let done = true;
        for (let i = 0, sx = 0; sx < W; i++, sx += STRIP) {
          const p = Math.min(1, Math.max(0, (now - reveal - (sx / W) * 700 - jit[i]) / 520));
          if (p < 1) done = false;
          if (p <= 0) continue;
          const e = 1 - Math.pow(1 - p, 3);
          ctx.globalAlpha = Math.min(1, p * 1.6);
          ctx.drawImage(rest, sx * dpr, 0, STRIP * dpr, rest.height, sx, -(1 - e) * 16, STRIP, H);
        }
        ctx.globalAlpha = 1;
        if (done) reveal = 0;
      } else ctx.drawImage(rest, 0, 0, W, H);
      if (active.length) paint(ctx, active);
    };

    const regrow = () => {
      // A few seconds after the last push, the snow settles back in.
      // Flakes still tumbling off count too: wait for them, or they'd never
      // come back and the drift would be left with gaps.
      if (active.some((f) => f.s === 1)) { regrowTimer = window.setTimeout(regrow, 250); return; }
      const now = performance.now();
      let i = 0;
      for (const f of active) if (f.s === 2) { f.s = 3; f.x = f.hx + (Math.random() - 0.5) * 6; f.y = f.hy - 12 - Math.random() * 18; f.a = 0; f.t = now + (i++ % 300) * 2; }
      kick();
    };

    const step = (now: number) => {
      raf = 0;
      let changed = !!reveal, moving = false;
      const gone: Flake[] = [];
      if (px > -1e3) {
        const x0 = Math.max(0, Math.floor(px - 15)), x1 = Math.min(cols.length - 1, Math.ceil(px + 15));
        for (let x = x0; x <= x1; x++) for (const f of cols[x]) {
          if (f.s !== 0) continue;
          const dx = f.x - px, dy = f.y - py, d2 = dx * dx + dy * dy;
          if (d2 >= 196) continue; // within 14px of the cursor: knocked loose
          const d = Math.sqrt(d2) || 1;
          f.s = 1;
          f.vx = Math.max(-3.5, Math.min(3.5, (dx / d) * (0.8 + Math.random() * 1.2) + pvx * 0.25));
          f.vy = -0.4 - Math.random() * 0.9 + pvy * 0.15;
          if (!f.q) { f.q = true; active.push(f); gone.push(f); }
        }
      }
      if (gone.length) {
        // Lift the knocked flakes out of the resting picture.
        rctx.globalCompositeOperation = "destination-out";
        rctx.beginPath();
        for (const f of gone) { rctx.moveTo(f.hx + f.r + 1.9, f.hy + 0.9); rctx.arc(f.hx, f.hy + 0.9, f.r + 1.9, 0, 6.2832); }
        rctx.fill();
        rctx.globalCompositeOperation = "source-over";
        window.clearTimeout(regrowTimer);
        regrowTimer = window.setTimeout(regrow, 1200);
        changed = true;
      }
      for (const f of active) {
        if (f.s === 1) {
          moving = true;
          f.vy += 0.09; f.vx *= 0.985;
          f.x += f.vx; f.y += f.vy;
          if (f.y > f.hy + 4) f.a -= 0.03;
          const edge = Math.min(f.x, W - f.x, f.y, H - f.y);
          if (edge < FADE) f.a = Math.min(f.a, edge / FADE);
          if (f.a <= 0 || f.y > H) { f.s = 2; f.a = 0; }
        } else if (f.s === 3) {
          moving = true;
          if (now < f.t) continue;
          f.y += (f.hy - f.y) * 0.18; f.x += (f.hx - f.x) * 0.18;
          f.a = Math.min(1, f.a + 0.09);
          if (Math.abs(f.y - f.hy) < 0.2) { f.y = f.hy; f.x = f.hx; f.a = 1; f.s = 0; }
        }
      }
      // Everything back in place: fold it into the resting picture again.
      if (active.length && !moving && active.every((f) => f.s === 0)) {
        for (const f of active) f.q = false;
        active = [];
        bake();
        changed = true;
      }
      if (changed || moving) draw(now);
      pvx *= 0.8; pvy *= 0.8;
      if (moving || reveal) raf = requestAnimationFrame(step);
    };
    const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(step); };

    const onMove = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      const nx = e.clientX - b.left, ny = e.clientY - b.top;
      if (nx < -20 || ny < -20 || nx > W + 20 || ny > H + 20) { px = py = -1e4; return; }
      if (px > -1e3) { pvx = nx - px; pvy = ny - py; }
      px = nx; py = ny;
      kick();
    };

    const start = () => {
      if (started) return;
      started = true;
      if (!built) build();
      if (!baked) bake();
      lastW = host.getBoundingClientRect().width;
      if (reduce) { draw(0); return; }
      reveal = performance.now();
      kick();
    };

    const rebuild = () => {
      build();
      baked = false;
      if (started) { bake(); draw(performance.now()); kick(); }
    };
    let rt = 0;
    let lastW = 0;
    // Phones fire resize when the address bar slides; only a width change matters.
    const onResize = () => {
      if (!built) return;
      const w = host.getBoundingClientRect().width;
      if (Math.abs(w - lastW) < 1) return;
      lastW = w;
      window.clearTimeout(rt); rt = window.setTimeout(rebuild, 150);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { start(); window.addEventListener("pointermove", onMove, { passive: true }); }
      else window.removeEventListener("pointermove", onMove);
    }, { rootMargin: "0px 0px -20% 0px" });

    // Set up in a quiet moment while it's still a screen or so away, so
    // nothing heavy runs as it scrolls into view (and nothing at all on load
    // for snow far down the page).
    let idle = 0;
    const w = window as Window & typeof globalThis;
    const idleCall = (fn: () => void) => (typeof w.requestIdleCallback === "function"
      ? w.requestIdleCallback(fn, { timeout: 600 })
      : w.setTimeout(fn, 1));
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || built) return;
      near.disconnect();
      // One small piece per quiet moment: the set-up, then each paint pass.
      let n = -1;
      const next = () => {
        if (baked || started) return;
        if (n === -1) { build(); rctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
        else paint(rctx, flakes, n);
        n++;
        if (n === PASSES.length) baked = true; else idle = idleCall(next);
      };
      idle = idleCall(next);
    }, { rootMargin: "900px 0px 900px 0px" });
    (document.fonts?.ready ?? Promise.resolve()).then(() => { near.observe(host); io.observe(host); });
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      near.disconnect();
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idle); else w.clearTimeout(idle);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      cancelAnimationFrame(raf);
      window.clearTimeout(regrowTimer);
    };
  }, [mode, radius, ground, scale, bleed, pad]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="snow-cap"
      style={{ position: "absolute", left: -SIDE, top: -pad, pointerEvents: "none", zIndex: 1 }}
    />
  );
};

export default SnowCap;
