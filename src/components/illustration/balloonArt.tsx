import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import "@/styles/balloon-pieces.css";

/**
 * The balloon drawing kit (Matt, 2026-11-28): everything that draws a balloon
 * piece in Laura's look, so any page can use the pieces. How the look and the
 * motion work, and how to draw a new piece: docs/illustration.md. The pieces
 * themselves are in pieceList.tsx; pages use BalloonPieces.tsx.
 *
 * Softly shaded balloons in warm blush, ivory, a little sage and pale
 * champagne gold, packed the way Laura builds them (big and medium balloons
 * alternating along the line, small and tiny ones tucked into the crevices),
 * short olive sprigs at the ends, softly shaded boards, on warm cream.
 *
 * As each tile scrolls into view its props draw on and its balloons inflate
 * one by one along the garland, driven by the page's own scroll
 * (useScrollProgress). Without JavaScript, or with reduced motion, every
 * drawing shows finished.
 */

/* ---------- drawing helpers (viewBox 0 0 240 240, floor at y 214) ---------- */

export type Fill = "ivory" | "blush" | "sage" | "gold";
export type Balloon = { x: number; y: number; r: number; c: Fill; o: number };
/** x, y, angle (degrees, 0 = pointing right, 90 = down), size, when it appears (0..1). */
export type Sprig = [number, number, number, number, number];
export type Drawing = { props: ReactNode; balloons: Balloon[]; sprigs?: Sprig[]; shadow?: [number, number]; front?: ReactNode };

export const FLOOR = 214;
/* Margins, enforced where balloons are packed and sprigs are sized (Matt's
   review, round 2): balloon edges stay within x 14..226 and below y 29, and
   rest on (never below) the floor; sprig tips stay within x 12..228 and
   below y 20. */
const M = { x0: 14, x1: 226, y0: 29, floorOut: 2, sx0: 12, sx1: 228, sy0: 20, sy1: 228 };
/** The biggest balloon radius the margins allow at (x, y). */
export const marginRoom = (x: number, y: number) => Math.min(x - M.x0, M.x1 - x, y - M.y0, FLOOR + M.floorOut - y);
export const rnd = (i: number, s: number) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
export type Mix = Partial<Record<Fill, number>>;
/* Colour share by size, read from the reference: big balloons ivory and blush
   with a little sage, champagne gold mostly in the small and tiny ones. */
export const BIG: Mix = { ivory: 3.5, blush: 3.5, sage: 0.8, gold: 0.7 };
export const MID: Mix = { blush: 3.5, ivory: 3, sage: 2.2, gold: 1.4 };
export const SMALL: Mix = { ivory: 3, blush: 2.5, gold: 2, sage: 1.4 };
export const TINY: Mix = { gold: 2, ivory: 2, blush: 1 };
const pick = (mix: Mix, i: number, s: number): Fill => {
  const entries = Object.entries(mix) as [Fill, number][];
  let v = rnd(i, s + 9) * entries.reduce((a, [, w]) => a + w, 0);
  for (const [c, w] of entries) if ((v -= w) < 0) return c;
  return entries[0][0];
};

/* Colour rules for the tile being drawn (Matt's review, round 2): no two
   sage or two gold balloons touching, and at most one big sage balloon per
   tile (two on the balloon wall). Tile resets them before making a drawing. */
const colourRules = { maxBigSage: 1, bigSage: 0, placed: [] as Balloon[] };
const startTile = (maxBigSage: number) => {
  colourRules.maxBigSage = maxBigSage;
  colourRules.bigSage = 0;
  colourRules.placed = [];
};
/** A colour from the mix that keeps the colour rules, remembered for the next pick. */
export const pickFor = (mix: Mix, x: number, y: number, r: number, big: boolean, n: number, seed: number): Fill => {
  let c: Fill = n % 2 ? "ivory" : "blush";
  for (let k = 0; k < 6; k++) {
    const t = pick(mix, n + 37 * k, seed);
    if (t === "sage" && big && colourRules.bigSage >= colourRules.maxBigSage) continue;
    if ((t === "sage" || t === "gold") && colourRules.placed.some((b) => b.c === t && Math.hypot(b.x - x, b.y - y) < (b.r + r) * 1.2)) continue;
    c = t;
    break;
  }
  if (c === "sage" && big) colourRules.bigSage++;
  colourRules.placed.push({ x, y, r, c, o: 0 });
  return c;
};

/** A size profile along the garland: [t, scale] points, straight lines between. */
export type Profile = [number, number][];
const profileAt = (p: Profile, t: number) => {
  if (t <= p[0][0]) return p[0][1];
  for (let i = 1; i < p.length; i++) {
    if (t <= p[i][0]) {
      const k = (t - p[i - 1][0]) / (p[i][0] - p[i - 1][0] || 1);
      return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k;
    }
  }
  return p[p.length - 1][1];
};

export type GarlandOpts = {
  /** when it inflates, 0..1 of the tile's own reveal */
  o0?: number;
  o1?: number;
  /** where along the line it starts inflating (0 = the start; 0.4 = both ways from there) */
  from?: number;
  /** balloon size along the line */
  swell?: Profile;
  /** medium balloon size as a share of the big ones (more for a number) */
  midK?: number;
};

export type Tier = {
  /** radius range, as a share of the cell's scale */
  k: [number, number];
  mix: Mix;
  /** keep these apart (big ones) so medium ones sit between */
  space?: number;
  max?: number;
  /** sit snug against the neighbours (small and tiny ones); never float in open space */
  snug?: boolean;
  /** stay inside the outline rather than bulging past it (small and tiny ones) */
  inner?: boolean;
  /** count towards the one-big-sage rule */
  big?: boolean;
};

/** Packs balloons into cells, tier by tier: big ones anchor, medium ones sit
 *  snug between them, small and tiny ones fill the crevices. `room` is how
 *  big a balloon each cell can take, `inner` the same without the outline's
 *  bulge, `edge` the margins (a hard limit), `sc` the local scale. */
export type Cell = { x: number; y: number; room: number; inner: number; edge: number; far: number; sc: number; t: number };
export const pack = (cells: Cell[], tiers: Tier[], seed: number, order: (c: Cell) => number): Balloon[] => {
  const out: Balloon[][] = tiers.map(() => []);
  let n = 0;
  tiers.forEach((tier, ti) => {
    const max = tier.max ?? 400;
    for (let k = 0; k < max; k++) {
      let best = -1, bestScore = -Infinity;
      for (let ci = 0; ci < cells.length; ci++) {
        const c = cells[ci];
        const rMin = tier.k[0] * c.sc, rMax = tier.k[1] * c.sc;
        let room = tier.inner ? Math.min(c.room, c.inner) : c.room;
        if (tier.space) room = Math.min(room, c.far);
        if (room < rMin) continue;
        if (tier.snug && room > rMax * 1.6) continue;
        const noise = rnd(ci, seed + ti * 7 + k) * 0.25;
        const score = tier.snug ? -Math.abs(room * 1.1 - rMax) / c.sc + noise : Math.min(room, rMax) / c.sc + noise;
        if (score > bestScore) { best = ci; bestScore = score; }
      }
      if (best < 0) break;
      const c = cells[best];
      const rMin = tier.k[0] * c.sc, rMax = tier.k[1] * c.sc;
      const room = tier.inner ? Math.min(c.room, c.inner) : c.room;
      const r = Math.min(
        c.edge,
        tier.snug ? Math.min(rMax, Math.max(rMin, room * 1.1)) : Math.min(room, rMin + rnd(n, seed + 3) * (rMax - rMin))
      );
      out[ti].push({ x: c.x, y: c.y, r, c: pickFor(tier.mix, c.x, c.y, r, !!tier.big, n, seed), o: order(c) });
      for (const q of cells) {
        const d = Math.hypot(q.x - c.x, q.y - c.y);
        q.room = Math.min(q.room, d - r * 0.86);
        if (tier.space) q.far = Math.min(q.far, d - r - tier.space * c.sc);
      }
      n++;
    }
  });
  // tiny and small ones behind, medium ones, then big ones on top
  return out.reverse().flat();
};

/** An organic garland along f(t), t 0..1, packed the way Laura builds them:
 *  big balloons kept apart along the line, medium ones between them, small
 *  and tiny ones tucked into the crevices and along the outline. `size` is a
 *  big balloon's radius; `swell` changes it along the line. */
export const garland = (f: (t: number) => [number, number], size: number, seed: number, opts: GarlandOpts = {}): Balloon[] => {
  const { o0 = 0, o1 = 1, from = 0, swell = [[0, 1], [1, 1]], midK = 0.72 } = opts;
  const S = 120;
  const pts = Array.from({ length: S + 1 }, (_, i) => f(i / S));
  const maxSw = Math.max(...swell.map(([, v]) => v));
  const reach = size * maxSw * 2;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const STEP = 2;
  const cells: Cell[] = [];
  for (let y = Math.max(2, Math.min(...ys) - reach); y <= Math.min(FLOOR + 1, Math.max(...ys) + reach); y += STEP) {
    for (let x = Math.max(2, Math.min(...xs) - reach); x <= Math.min(238, Math.max(...xs) + reach); x += STEP) {
      let d = Infinity, ti = 0;
      for (let i = 0; i <= S; i++) {
        const e = Math.hypot(pts[i][0] - x, pts[i][1] - y);
        if (e < d) { d = e; ti = i; }
      }
      const t = ti / S;
      const sc = size * profileAt(swell, t);
      // a band about 2.7 big radii wide; big and medium balloons may bulge past it
      const inner = sc * 1.5 - d;
      const room = inner + sc * 0.36;
      if (room <= sc * 0.2) continue;
      // the margins: a hard limit
      const edge = marginRoom(x, y);
      if (edge <= 0) continue;
      cells.push({ x, y, room: Math.min(room, edge), inner, edge, far: Infinity, sc, t });
    }
  }
  const span = Math.max(from, 1 - from) || 1;
  return pack(
    cells,
    [
      { k: [0.95, 1.12], mix: BIG, space: 0.7, big: true },
      { k: [midK * 0.92, midK * 1.08], mix: MID },
      { k: [0.38, 0.46], mix: SMALL, snug: true, inner: true },
      { k: [0.24, 0.3], mix: TINY, snug: true, inner: true },
    ],
    seed,
    (c) => o0 + (Math.abs(c.t - from) / span) * (o1 - o0)
  );
};

export const bezier = (pts: [number, number][]) => (t: number): [number, number] => {
  let p = pts;
  while (p.length > 1) p = p.slice(1).map((b, i) => [p[i][0] + (b[0] - p[i][0]) * t, p[i][1] + (b[1] - p[i][1]) * t]);
  return p[0];
};
export const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => (t: number): [number, number] => {
  const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
  return [cx + Math.cos(a) * rx, cy - Math.sin(a) * ry];
};
/** A smooth line through hand-placed points (Catmull-Rom). */
export const through = (pts: [number, number][]) => (t: number): [number, number] => {
  const n = pts.length - 1;
  const u = Math.min(n - 1e-6, Math.max(0, t * n));
  const i = Math.floor(u);
  const k = u - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const c = (a: number, b: number, cc: number, d: number) =>
    0.5 * (2 * b + (-a + cc) * k + (2 * a - 5 * b + 4 * cc - d) * k * k + (-a + 3 * b - 3 * cc + d) * k * k * k);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
};
export const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;
/** A sailboard: a board with a fully arched top. */
export const archBoard = (x0: number, x1: number, top: number) => {
  const r = (x1 - x0) / 2;
  return `M${x0} ${FLOOR} V${top + r} A${r} ${r} 0 0 1 ${x1} ${top + r} V${FLOOR} Z`;
};
export const rect = (x0: number, y0: number, x1: number, y1: number) => `M${x0} ${y0} H${x1} V${y1} H${x0} Z`;

/** A fine line that draws on (pathLength 1, see balloon-pieces.css). */
export const Prop = ({ d, cls = "" }: { d: string; cls?: string }) => (
  <path className={`bp-prop ${cls}`} d={d} pathLength={1} />
);
export const Floor = () => <Prop d={`M10 ${FLOOR} H230`} cls="bp-faint" />;
/** A gold hoop on a short post and a flat plate foot. */
export const Hoop = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <>
    <Prop d={`M${cx + 6} ${cy + r - 1} V${FLOOR - 4}`} cls="bp-gold" />
    <rect className="bp-plate bp-fade" x={cx + 6 - 24} y={FLOOR - 4} width="48" height="4" rx="1.5" />
    <rect className="bp-plate-top bp-fade" x={cx + 6 - 23} y={FLOOR - 4} width="46" height="1.4" rx=".7" />
    <Prop d={ring(cx, cy, r)} cls="bp-gold" />
  </>
);
export const Candle = ({ x, h, w = 7 }: { x: number; h: number; w?: number }) => (
  <>
    <rect className="bp-candle bp-fade" x={x - w / 2} y={FLOOR - 4 - h} width={w} height={h} rx="1" />
    <ellipse className="bp-flame bp-fade" cx={x} cy={FLOOR - 8 - h} rx="1.8" ry="3.2" />
  </>
);

/* ---------- one tile ---------- */

const outBack = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const FILLS: Fill[] = ["ivory", "blush", "sage", "gold"];
const LEAF = "M0 0 Q5 -2.3 10 0 Q5 2.3 0 0 Z";

/** Paints shared by every tile, defined once per page. */
export const BalloonPaints = () => (
  <svg className="bp-defs" aria-hidden="true" focusable="false">
    <defs>
      {/* balloons: nearly flat in their own colour, a bright top-left, a slightly deeper rim */}
      {FILLS.map((c) => (
        <radialGradient key={c} id={`bp-paint-${c}`} cx="50%" cy="50%" r="50%" fx="32%" fy="30%">
          <stop offset="0%" className={`bp-stop-${c}-light`} />
          <stop offset="28%" className={`bp-stop-${c}-base`} />
          <stop offset="75%" className={`bp-stop-${c}-base`} />
          <stop offset="100%" className={`bp-stop-${c}-deep`} />
        </radialGradient>
      ))}
      {/* the thin crease where a balloon meets the ones behind it */}
      <radialGradient id="bp-occl">
        <stop offset="82%" className="bp-stop-shade" stopOpacity=".18" />
        <stop offset="100%" className="bp-stop-shade" stopOpacity="0" />
      </radialGradient>
      {/* the soft shine near the top of each balloon, crisper on gold */}
      <radialGradient id="bp-gloss">
        <stop offset="0%" className="bp-stop-gloss" stopOpacity=".8" />
        <stop offset="100%" className="bp-stop-gloss" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bp-gloss-gold">
        <stop offset="0%" className="bp-stop-gloss" stopOpacity="1" />
        <stop offset="40%" className="bp-stop-gloss" stopOpacity=".9" />
        <stop offset="100%" className="bp-stop-gloss" stopOpacity="0" />
      </radialGradient>
      {/* the soft shadow on the floor under each piece */}
      <radialGradient id="bp-ground">
        <stop offset="0%" className="bp-stop-shade" stopOpacity=".16" />
        <stop offset="100%" className="bp-stop-shade" stopOpacity="0" />
      </radialGradient>
      {/* boards: lit from the left, a touch deeper towards the right edge */}
      {(["ivory", "blush", "sage"] as const).map((c) => (
        <linearGradient key={c} id={`bp-board-${c}`} x1="0" x2="1" y1="0" y2="0.25">
          <stop offset="0%" className={`bp-stop-board-${c}-light`} />
          <stop offset="100%" className={`bp-stop-board-${c}`} />
        </linearGradient>
      ))}
      {/* shimmer wall: fine sequins, a diagonal sheen and one soft bloom */}
      <pattern id="bp-sequins" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect className="bp-sequin-cell" x=".35" y=".35" width="3.3" height="3.3" />
      </pattern>
      <linearGradient id="bp-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" className="bp-stop-gloss" stopOpacity=".25" />
        <stop offset="30%" className="bp-stop-gloss" stopOpacity=".3" />
        <stop offset="100%" className="bp-stop-shade" stopOpacity=".18" />
      </linearGradient>
      <radialGradient id="bp-bloom">
        <stop offset="0%" className="bp-stop-gloss" stopOpacity=".5" />
        <stop offset="100%" className="bp-stop-gloss" stopOpacity="0" />
      </radialGradient>
      {/* candle glow inside the fireplace */}
      <radialGradient id="bp-glow">
        <stop offset="0%" className="bp-stop-glow" stopOpacity=".9" />
        <stop offset="100%" className="bp-stop-glow" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

/** A short olive sprig: a stem with lance-shaped leaves in pairs and a tip leaf. */
/* Where each leaf sits on a sprig (x, y, angle), shared by SprigArt and the
   margin check below. */
const SPRIG_LEAVES: [number, number, number][] = [
  ...[4, 8, 12].flatMap((t): [number, number, number][] => [[t, -0.5, -42], [t + 1.5, 0.3, 40]]),
  [15.5, 0, -4],
];
/* Every point on every leaf's outline, in the sprig's own units, so the
   margin check is exact. */
const SPRIG_EXTENT: [number, number][] = SPRIG_LEAVES.flatMap(([tx, ty, deg]) => {
  const a = (deg * Math.PI) / 180;
  return Array.from({ length: 21 }, (_, i) => i / 20).flatMap((u) =>
    [-1, 1].map((side): [number, number] => {
      const lx = 10 * u, ly = side * 4.6 * u * (1 - u);
      return [tx + lx * Math.cos(a) - ly * Math.sin(a), ty + lx * Math.sin(a) + ly * Math.cos(a)];
    })
  );
});
/** A sprig's scale, cut down if needed so its tips stay inside the margins. */
const sprigScale = ([x, y, a, size]: Sprig) => {
  const rad = (a * Math.PI) / 180, cos = Math.cos(rad), sin = Math.sin(rad);
  let k = size * 1.6;
  for (const [px, py] of SPRIG_EXTENT) {
    const dx = px * cos - py * sin, dy = px * sin + py * cos;
    if (dx < 0) k = Math.min(k, (M.sx0 - x) / dx);
    if (dx > 0) k = Math.min(k, (M.sx1 - x) / dx);
    if (dy < 0) k = Math.min(k, (M.sy0 - y) / dy);
    if (dy > 0) k = Math.min(k, (M.sy1 - y) / dy);
  }
  return Math.max(0, k);
};

const SprigArt = ({ s }: { s: Sprig }) => {
  const [x, y, a, , o] = s;
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${sprigScale(s).toFixed(3)})`}>
      <g className="bp-b" data-o={o.toFixed(3)}>
        <path className="bp-stem" d="M0 0 Q8 -1.5 16 0" />
        {SPRIG_LEAVES.map(([tx, ty, deg], i) => (
          <path key={i} className={(i + (i >> 1)) % 2 ? "bp-leaf" : "bp-leaf bp-leaf-light"} d={LEAF} transform={`translate(${tx} ${ty}) rotate(${deg})`} />
        ))}
      </g>
    </g>
  );
};

/** One balloon piece: a name for the caption, a label for screen readers,
 *  and how to draw it. `maxBigSage` is how many big sage balloons it may
 *  have (1, or 2 on the balloon wall). */
export type Piece = { id: string; name: string; label: string; draw: () => Drawing; maxBigSage?: number };

/** One drawing in its square panel, with its name under it. */
export const BalloonTile = ({ name, label, draw, maxBigSage = 1 }: Piece) => {
  const ref = useRef<HTMLElement>(null);
  const art = useMemo(() => {
    startTile(maxBigSage);
    const d = draw();
    // each sprig starts just inside the edge of the balloon nearest to where it was placed
    const sprigs = (d.sprigs ?? []).map(([x, y, a, size, o]): Sprig => {
      const b = d.balloons.filter((q) => q.r >= 6).reduce((m, q) =>
        Math.abs(Math.hypot(q.x - x, q.y - y) - q.r) < Math.abs(Math.hypot(m.x - x, m.y - y) - m.r) ? q : m
      );
      const rad = (a * Math.PI) / 180;
      return [b.x + Math.cos(rad) * (b.r - 2), b.y + Math.sin(rad) * (b.r - 2), a, size, o];
    });
    return { ...d, sprigs };
  }, [draw, maxBigSage]);
  const { props, balloons, sprigs = [], shadow, front } = art;

  const onProgress = useCallback((p: number) => {
    const el = ref.current;
    if (!el) return;
    const k = clamp(p / 0.3);
    el.querySelectorAll<SVGElement>(".bp-prop").forEach((path) => {
      path.style.strokeDashoffset = String(1 - k * (2 - k));
      path.style.opacity = String(clamp(k * 4));
    });
    el.querySelectorAll<SVGElement>(".bp-fade").forEach((f) => {
      f.style.opacity = String(clamp(k * 1.5));
    });
    el.querySelectorAll<SVGElement>(".bp-b").forEach((b) => {
      const o = Number(b.dataset.o);
      b.style.transform = `scale(${outBack(clamp((p - (0.2 + o * 0.62)) / 0.14))})`;
    });
  }, []);
  useScrollProgress(ref, onProgress, { from: 0.98, to: 0.5 });

  return (
    <figure ref={ref} className="bp-tile">
      <div className="bp-panel rounded-large">
        <svg className="bp-svg" viewBox="0 0 240 240" role="img" aria-label={label}>
          {shadow && <ellipse className="bp-fade" fill="url(#bp-ground)" cx={shadow[0]} cy={FLOOR + 1} rx={shadow[1]} ry="8" />}
          {props}
          {front}
          {sprigs.map((s, i) => <SprigArt key={`s${i}`} s={s} />)}
          {balloons.map((b, i) => (
            <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
              <g className="bp-b" data-o={b.o.toFixed(3)}>
                <circle cx={b.r * 0.03} cy={b.r * 0.07} r={b.r * 1.04} fill="url(#bp-occl)" />
                <circle r={b.r} fill={`url(#bp-paint-${b.c})`} />
                <ellipse
                  cx={-b.r * 0.38}
                  cy={-b.r * 0.4}
                  rx={b.r * 0.28}
                  ry={b.r * 0.2}
                  fill={b.c === "gold" ? "url(#bp-gloss-gold)" : "url(#bp-gloss)"}
                  transform={`rotate(-35 ${-b.r * 0.38} ${-b.r * 0.4})`}
                />
              </g>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="t-small text-ink photo-caption text-center">{name}</figcaption>
    </figure>
  );
};
