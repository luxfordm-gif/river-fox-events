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
};

type Flake = { x: number; y: number; hx: number; hy: number; r: number; vx: number; vy: number; a: number; s: 0 | 1 | 2 | 3; t: number };
// s: 0 resting, 1 knocked loose, 2 gone, 3 settling (falling into place)

const PAD = 28; // room above for snow and for flakes falling in
const SIDE = 12;

const rand = (seed: number) => {
  let v = seed >>> 0;
  return () => { v = (v * 1664525 + 1013904223) >>> 0; return v / 4294967296; };
};

const SnowCap = ({ mode, radius = 14, ground = "light" }: SnowCapProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    const host = cv?.parentElement;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let flakes: Flake[] = [];
    let W = 0, H = 0, raf = 0, lastPush = 0, built = false, started = false;
    let px = -1e4, py = -1e4, pvx = 0, pvy = 0;

    const surface = (): Int16Array => {
      const surf = new Int16Array(W).fill(-1);
      if (mode === "edge") {
        const top = PAD, r = radius;
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
      H = Math.ceil(rect.height + PAD + (mode === "edge" ? 40 : 30));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = `${W}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const surf = surface();
      const rnd = rand(W * 31 + H);
      const maxDepth = mode === "edge" ? 13 : ground === "light" ? 5.4 : 5;
      flakes = [];
      for (let x = 1; x < W - 1; x += 1.1) {
        const xi = Math.round(x), y0 = surf[xi];
        if (y0 < 0) continue;
        // Snow doesn't hold on steep sides: thin it where the edge drops away.
        const slope = Math.max(Math.abs(y0 - (surf[xi - 2] ?? y0)), Math.abs(y0 - (surf[xi + 2] ?? y0)));
        if (slope > 6 || (surf[xi - 2] ?? -1) < 0 || (surf[xi + 2] ?? -1) < 0) continue;
        // Gentle lumps: broad mounds on a card edge, finer variation on letters.
        const drift = mode === "edge"
          ? Math.max(0.2, 0.5 + 0.32 * Math.sin(x * 0.028 + 0.6) + 0.18 * Math.sin(x * 0.09 + 1.7))
          : 0.55 + 0.25 * Math.sin(x * 0.045) + 0.2 * Math.sin(x * 0.13 + 1.7);
        const taper = mode === "edge" ? Math.min(1, Math.min(x - SIDE, W - SIDE - x) / 40) : 1;
        const depth = maxDepth * drift * taper * (slope > 2 ? 0.45 : 1);
        const layers = Math.max(1, Math.round(depth / 1.15));
        for (let l = 0; l < layers; l++) {
          const r = (l === layers - 1 ? 0.55 : 0.7) + rnd() * 0.75;
          const hx = x + (rnd() - 0.5) * 1.1;
          const hy = y0 - 0.5 - l * 1.15 - rnd() * 0.5;
          flakes.push({ x: hx, y: hy, hx, hy, r, vx: 0, vy: 0, a: 1, s: 0, t: 0 });
        }
      }
      built = true;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // On cream, a soft cool rim around each flake (drawn first, a touch larger)
      // so the white reads as snow; on dark grounds just a faint underside.
      const light = ground === "light";
      ctx.fillStyle = light ? "rgba(128, 146, 166, 0.42)" : "rgba(120, 136, 152, 0.28)";
      for (const f of flakes) if (f.s !== 2 && f.a > 0.02) { ctx.globalAlpha = f.a; ctx.beginPath(); ctx.arc(f.x, f.y + (light ? 0.45 : 0.7), f.r + (light ? 0.55 : 0), 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = "#ffffff";
      for (const f of flakes) if (f.s !== 2 && f.a > 0.02) { ctx.globalAlpha = f.a; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill(); }
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      let busy = false;
      for (const f of flakes) {
        if (f.s === 0) {
          const dx = f.x - px, dy = f.y - py, d2 = dx * dx + dy * dy;
          if (d2 < 196) { // within 14px of the cursor: knocked loose
            const d = Math.sqrt(d2) || 1;
            f.s = 1;
            f.vx = (dx / d) * (0.8 + Math.random() * 1.2) + pvx * 0.25;
            f.vy = -0.4 - Math.random() * 0.9 + pvy * 0.15;
            lastPush = now;
          }
        } else if (f.s === 1) {
          busy = true;
          f.vy += 0.09; f.vx *= 0.985;
          f.x += f.vx; f.y += f.vy;
          if (f.y > f.hy + 6) f.a -= 0.018;
          if (f.a <= 0 || f.y > H) { f.s = 2; f.a = 0; }
        } else if (f.s === 3) {
          busy = true;
          if (now < f.t) continue;
          f.y += (f.hy - f.y) * 0.12; f.x += (f.hx - f.x) * 0.12;
          f.a = Math.min(1, f.a + 0.06);
          if (Math.abs(f.y - f.hy) < 0.2) { f.y = f.hy; f.x = f.hx; f.a = 1; f.s = 0; }
        }
      }
      // A few seconds after the last push, the snow settles back in.
      if (lastPush && now - lastPush > 3500) {
        let i = 0;
        for (const f of flakes) if (f.s === 2) { f.s = 3; f.x = f.hx + (Math.random() - 0.5) * 6; f.y = f.hy - 12 - Math.random() * 18; f.a = 0; f.t = now + (i++ % 400) * 4; busy = true; }
        lastPush = 0;
      }
      pvx *= 0.8; pvy *= 0.8;
      draw();
      raf = busy || lastPush ? requestAnimationFrame(step) : 0;
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
      if (reduce) { draw(); return; }
      // Fall into place, left to right, the first time it's seen.
      const now = performance.now();
      flakes.forEach((f, i) => { f.s = 3; f.a = 0; f.y = f.hy - 14 - Math.random() * 20; f.x = f.hx + (Math.random() - 0.5) * 5; f.t = now + (f.hx / W) * 700 + Math.random() * 250; void i; });
      kick();
    };

    const rebuild = () => {
      const keepStarted = started;
      build();
      if (keepStarted) { flakes.forEach((f) => { f.s = 0; }); draw(); }
    };
    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(rebuild, 150); };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { start(); window.addEventListener("pointermove", onMove, { passive: true }); }
      else window.removeEventListener("pointermove", onMove);
    }, { rootMargin: "0px 0px -20% 0px" });

    (document.fonts?.ready ?? Promise.resolve()).then(() => { build(); io.observe(host); });
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      cancelAnimationFrame(raf);
    };
  }, [mode, radius, ground]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="snow-cap"
      style={{ position: "absolute", left: -SIDE, top: -PAD, pointerEvents: "none", zIndex: 1 }}
    />
  );
};

export default SnowCap;
