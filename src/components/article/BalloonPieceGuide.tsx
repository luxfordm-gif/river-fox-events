import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import "@/styles/balloon-pieces.css";

/**
 * Balloon piece guide (Matt, 2026-11-28): every kind of balloon piece as a
 * square drawing in Laura's look (Matt's reference grid): softly shaded
 * balloons in warm blush, ivory, a little sage and pale champagne gold, packed
 * the way she builds them (big and medium balloons alternating along the line,
 * small and tiny ones tucked into the crevices), short olive sprigs at the
 * ends, softly shaded boards, on warm cream.
 *
 * As each tile scrolls into view its props draw on and its balloons inflate
 * one by one along the garland, driven by the page's own scroll
 * (useScrollProgress). Without JavaScript, or with reduced motion, every
 * drawing shows finished.
 *
 * Twelve tiles so every width ends on a full row (2 on phones, 3 from
 * tablets up). No double hoop (Matt, 2026-11-28). Order: arches, then every
 * garland together, then the balloon wall and number stack. Names say what
 * the piece is first, then where it goes, in the Balloons page's words
 * ("Hoop garlands", "Sailboard backdrops", "Shimmer walls").
 */

/* ---------- drawing helpers (viewBox 0 0 240 240, floor at y 214) ---------- */

type Fill = "ivory" | "blush" | "sage" | "gold";
type Balloon = { x: number; y: number; r: number; c: Fill; o: number };
/** x, y, angle (degrees, 0 = pointing right, 90 = down), size, when it appears (0..1). */
type Sprig = [number, number, number, number, number];
type Drawing = { props: ReactNode; balloons: Balloon[]; sprigs?: Sprig[]; shadow?: [number, number]; front?: ReactNode };

const FLOOR = 214;
/* Margins, enforced where balloons are packed and sprigs are sized (Matt's
   review, round 2): balloon edges stay within x 14..226 and below y 29, and
   rest on (never below) the floor; sprig tips stay within x 12..228 and
   below y 20. */
const M = { x0: 14, x1: 226, y0: 29, floorOut: 2, sx0: 12, sx1: 228, sy0: 20, sy1: 228 };
/** The biggest balloon radius the margins allow at (x, y). */
const marginRoom = (x: number, y: number) => Math.min(x - M.x0, M.x1 - x, y - M.y0, FLOOR + M.floorOut - y);
const rnd = (i: number, s: number) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
type Mix = Partial<Record<Fill, number>>;
/* Colour share by size, read from the reference: big balloons ivory and blush
   with a little sage, champagne gold mostly in the small and tiny ones. */
const BIG: Mix = { ivory: 3.5, blush: 3.5, sage: 0.8, gold: 0.7 };
const MID: Mix = { blush: 3.5, ivory: 3, sage: 2.2, gold: 1.4 };
const SMALL: Mix = { ivory: 3, blush: 2.5, gold: 2, sage: 1.4 };
const TINY: Mix = { gold: 2, ivory: 2, blush: 1 };
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
const pickFor = (mix: Mix, x: number, y: number, r: number, big: boolean, n: number, seed: number): Fill => {
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
type Profile = [number, number][];
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

type GarlandOpts = {
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

type Tier = {
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
type Cell = { x: number; y: number; room: number; inner: number; edge: number; far: number; sc: number; t: number };
const pack = (cells: Cell[], tiers: Tier[], seed: number, order: (c: Cell) => number): Balloon[] => {
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
const garland = (f: (t: number) => [number, number], size: number, seed: number, opts: GarlandOpts = {}): Balloon[] => {
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

const bezier = (pts: [number, number][]) => (t: number): [number, number] => {
  let p = pts;
  while (p.length > 1) p = p.slice(1).map((b, i) => [p[i][0] + (b[0] - p[i][0]) * t, p[i][1] + (b[1] - p[i][1]) * t]);
  return p[0];
};
const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => (t: number): [number, number] => {
  const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
  return [cx + Math.cos(a) * rx, cy - Math.sin(a) * ry];
};
/** A smooth line through hand-placed points (Catmull-Rom). */
const through = (pts: [number, number][]) => (t: number): [number, number] => {
  const n = pts.length - 1;
  const u = Math.min(n - 1e-6, Math.max(0, t * n));
  const i = Math.floor(u);
  const k = u - i;
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
  const c = (a: number, b: number, cc: number, d: number) =>
    0.5 * (2 * b + (-a + cc) * k + (2 * a - 5 * b + 4 * cc - d) * k * k + (-a + 3 * b - 3 * cc + d) * k * k * k);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
};
const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;
/** A sailboard: a board with a fully arched top. */
const archBoard = (x0: number, x1: number, top: number) => {
  const r = (x1 - x0) / 2;
  return `M${x0} ${FLOOR} V${top + r} A${r} ${r} 0 0 1 ${x1} ${top + r} V${FLOOR} Z`;
};
const rect = (x0: number, y0: number, x1: number, y1: number) => `M${x0} ${y0} H${x1} V${y1} H${x0} Z`;

/** A fine line that draws on (pathLength 1, see balloon-pieces.css). */
const Prop = ({ d, cls = "" }: { d: string; cls?: string }) => (
  <path className={`bp-prop ${cls}`} d={d} pathLength={1} />
);
const Floor = () => <Prop d={`M10 ${FLOOR} H230`} cls="bp-faint" />;
/** A gold hoop on a short post and a flat plate foot. */
const Hoop = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <>
    <Prop d={`M${cx + 6} ${cy + r - 1} V${FLOOR - 4}`} cls="bp-gold" />
    <rect className="bp-plate bp-fade" x={cx + 6 - 24} y={FLOOR - 4} width="48" height="4" rx="1.5" />
    <rect className="bp-plate-top bp-fade" x={cx + 6 - 23} y={FLOOR - 4} width="46" height="1.4" rx=".7" />
    <Prop d={ring(cx, cy, r)} cls="bp-gold" />
  </>
);
const Candle = ({ x, h, w = 7 }: { x: number; h: number; w?: number }) => (
  <>
    <rect className="bp-candle bp-fade" x={x - w / 2} y={FLOOR - 4 - h} width={w} height={h} rx="1" />
    <ellipse className="bp-flame bp-fade" cx={x} cy={FLOOR - 8 - h} rx="1.8" ry="3.2" />
  </>
);

/** The number 3 for the number stack, packed as its own job: two strokes
 *  that meet at the middle tip, each filled in three lanes of balloons
 *  (honeycomb, about 40 wide), bigger on the outer lane round the two right
 *  curves, then small and tiny ones in the gaps. It rests on the plinth top
 *  and inflates from the top end along the strokes. */
const PLINTH_TOP = 200;
const numberThree = (seed: number): Balloon[] => {
  const strokes = [
    through([[80, 72], [94, 56], [118, 50], [144, 56], [158, 72], [152, 92], [132, 104], [112, 108]]),
    through([[112, 108], [138, 112], [158, 128], [164, 150], [154, 170], [128, 180], [100, 178], [80, 166]]),
  ];
  const bowls: [number, number][] = [[120, 80], [122, 144]];
  const MIX3: Mix = { blush: 3.5, ivory: 3, gold: 1.2, sage: 0.8 };
  const samples: { x: number; y: number; nx: number; ny: number; along: number }[][] = [];
  let total = 0;
  strokes.forEach((f) => {
    const N = 160;
    const pts = Array.from({ length: N + 1 }, (_, i) => f(i / N));
    const list = [];
    for (let i = 0; i <= N; i++) {
      if (i) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      list.push({ x: pts[i][0], y: pts[i][1], nx: -(b[1] - a[1]) / len, ny: (b[0] - a[0]) / len, along: total });
    }
    samples.push(list);
  });
  const lanes: Balloon[] = [];
  let n = 0;
  samples.forEach((list, si) => {
    const start = list[0].along, len = list[list.length - 1].along - start;
    [-11, 0, 11].forEach((lane) => {
      for (let d = lane === 0 ? 9.5 : 0; d <= len + 0.1; d += 19) {
        const p = list.reduce((a, b) => (Math.abs(b.along - start - d) < Math.abs(a.along - start - d) ? b : a));
        const x = p.x + p.nx * lane, y = p.y + p.ny * lane;
        const [bx, by] = bowls[si];
        const outer = Math.hypot(x - bx, y - by) > Math.hypot(p.x - bx, p.y - by) + 5;
        let r = outer && x > 140 ? 13 : 10.5 + (rnd(n, seed) - 0.5) * 3;
        r = Math.min(r, marginRoom(x, y), PLINTH_TOP - y);
        if (r < 4 || lanes.some((b) => Math.hypot(b.x - x, b.y - y) < (b.r + r) * 0.75)) continue;
        lanes.push({ x, y, r, c: pickFor(MIX3, x, y, r, r > 12, n, seed), o: (p.along / total) * 0.95 });
        n++;
      }
    });
  });
  const all = samples.flat();
  const cells: Cell[] = [];
  for (let y = 26; y <= PLINTH_TOP; y += 2) {
    for (let x = 56; x <= 190; x += 2) {
      let d = Infinity, along = 0;
      for (const q of all) {
        const e = Math.hypot(q.x - x, q.y - y);
        if (e < d) { d = e; along = q.along; }
      }
      if (d > 20) continue;
      const edge = Math.min(marginRoom(x, y), PLINTH_TOP - y);
      if (edge <= 0) continue;
      let room = Math.min(20 - d + 4, edge);
      for (const b of lanes) room = Math.min(room, Math.hypot(b.x - x, b.y - y) - b.r * 0.9);
      cells.push({ x, y, room, inner: room, edge, far: Infinity, sc: 1, t: along / total });
    }
  }
  const fill = pack(
    cells,
    [
      { k: [5, 6], mix: SMALL, snug: true },
      { k: [3.5, 4.5], mix: TINY, snug: true },
    ],
    seed + 1,
    (c) => c.t * 0.95 + 0.03
  );
  return [...fill, ...lanes];
};

/* ---------- the twelve pieces ---------- */

const DRAWINGS: { name: string; label: string; draw: () => Drawing }[] = [
  {
    name: "Balloon arch",
    label: "An organic balloon arch framing a front door",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={`M94 ${FLOOR} V104 H146 V${FLOOR}`} cls="bp-fill" />
          <Prop d={rect(98, 108, 142, FLOOR)} cls="bp-fill" />
          <Prop d="M105 116 H135 V152 H105 Z M105 160 H135 V206 H105 Z" cls="bp-faint" />
          <circle className="bp-knob bp-fade" cx="136" cy="158" r="2" />
        </>
      ),
      balloons: garland(arc(120, 206, 75, 148, 180, 0), 15, 1, {
        swell: [[0, 1.15], [0.3, 1.05], [0.5, 0.9], [0.7, 1.05], [1, 1.15]],
      }),
      sprigs: [
        [30, 196, 165, 1, 0.05], [210, 196, 15, 1, 0.95],
        [52, 92, 215, 1, 0.3], [188, 92, -35, 1, 0.7],
        [104, 52, 250, 0.9, 0.45], [138, 52, -70, 0.9, 0.55],
      ],
      shadow: [120, 100],
    }),
  },
  {
    name: "Half arch",
    label: "A balloon garland curving up one side and over the top of an arched panel",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={archBoard(100, 194, 66)} cls="bp-fill" />
        </>
      ),
      balloons: [
        ...garland(bezier([[40, 204], [64, 210], [96, 204], [122, 202]]), 15, 21, { o0: 0, o1: 0.3, from: 0.6, swell: [[0, 0.9], [0.25, 1.3], [0.7, 1.1], [1, 0.75]] }),
        ...garland(through([[70, 200], [94, 172], [98, 128], [102, 92], [120, 66], [147, 58], [174, 64], [190, 74]]), 15, 2, {
          o0: 0.1, swell: [[0, 1.4], [0.35, 1.0], [0.6, 0.9], [1, 0.7]],
        }),
      ],
      sprigs: [
        [122, 194, -50, 0.95, 0.25], [80, 150, 190, 0.95, 0.45], [96, 90, 220, 0.9, 0.65],
        [186, 62, -70, 0.95, 0.98], [196, 72, -20, 0.85, 1],
      ],
      shadow: [112, 92],
    }),
  },
  {
    name: "Wall garland",
    label: "A balloon garland climbing a wall past a window, from the floor towards the ceiling",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={`M10 196 H230 M10 202 H230`} cls="bp-faint" />
          {/* a window: frame, glass in two casements under a top light, a sill and a handle */}
          <Prop d={rect(160, 96, 208, 166)} cls="bp-fill" />
          <Prop d={rect(165, 101, 203, 161)} cls="bp-glass" />
          <Prop d="M165 116 H203 M184 116 V161" />
          <Prop d="M170 128 L177 121 M170 136 L181 125 M189 128 L196 121 M189 136 L200 125" cls="bp-faint bp-shine-line" />
          <Prop d={rect(155, 166, 213, 171)} cls="bp-fill" />
          <Prop d="M188 136 V146" cls="bp-gold bp-handle" />
          <circle className="bp-knob bp-fade" cx="188" cy="136" r="1.8" />
        </>
      ),
      balloons: garland(bezier([[46, 200], [76, 150], [110, 86], [194, 58]]), 15, 3, {
        swell: [[0, 1.2], [0.5, 1.0], [1, 0.95]],
      }),
      sprigs: [
        [30, 198, 165, 0.95, 0.03], [36, 182, 205, 0.85, 0.06],
        [66, 140, 205, 0.9, 0.3], [112, 78, -110, 0.9, 0.6], [196, 50, -40, 0.85, 1],
      ],
      shadow: [80, 56],
    }),
  },
  {
    name: "Table garland",
    label: "A balloon garland along the front of a cake table with a draped cloth",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d="M120 124 V110 M88 108 H152" cls="bp-gold" />
          <Prop d={rect(93, 82, 147, 108)} cls="bp-fill" />
          <Prop d={rect(104, 60, 136, 82)} cls="bp-fill" />
          <Prop d="M112 60 V46 M120 60 V44 M128 60 V46" cls="bp-candle-wick" />
          <Prop
            d={`M20 128 H220 L226 ${FLOOR - 4} ${Array.from({ length: 10 }, (_, k) => `Q${226 - k * 21.2 - 10.6} ${FLOOR + 2} ${226 - (k + 1) * 21.2} ${FLOOR - 4}`).join(" ")} Z`}
            cls="bp-fill"
          />
          <path
            className="bp-folds bp-fade"
            d={Array.from({ length: 9 }, (_, k) => {
              const x = 34 + k * 21.5;
              const lean = (x - 120) * 0.05;
              return `M${x - 3} 136 Q${x - 3 + lean} 176 ${x - 4 + lean * 1.6} ${FLOOR - 6} L${x + 4 + lean * 1.6} ${FLOOR - 6} Q${x + 3 + lean} 176 ${x + 3} 136 Z`;
            }).join(" ")}
          />
        </>
      ),
      front: (
        <>
          <ellipse className="bp-flame bp-fade" cx="112" cy="42" rx="1.6" ry="2.8" />
          <ellipse className="bp-flame bp-fade" cx="120" cy="40" rx="1.6" ry="2.8" />
          <ellipse className="bp-flame bp-fade" cx="128" cy="42" rx="1.6" ry="2.8" />
        </>
      ),
      balloons: garland(bezier([[38, 128], [90, 130], [150, 130], [202, 128]]), 12.5, 4, { midK: 0.74 }),
      sprigs: [
        [48, 120, -120, 0.9, 0.08], [60, 118, -80, 0.8, 0.12],
        [192, 120, -60, 0.9, 0.92], [180, 118, -100, 0.8, 0.88],
        [32, 138, 120, 0.85, 0.02], [208, 138, 60, 0.85, 1],
      ],
      shadow: [120, 108],
    }),
  },
  {
    name: "Mantelpiece garland",
    label: "A balloon garland along a mantelpiece, trailing down one side of the fireplace",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={ring(128, 74, 38)} cls="bp-fill" />
          <Prop d={rect(64, 126, 198, FLOOR)} cls="bp-fill" />
          <Prop d={`M80 ${FLOOR} V134 H182 V${FLOOR}`} cls="bp-faint" />
          <Prop d={rect(96, 158, 170, FLOOR)} cls="bp-fill-hearth" />
          <Prop d={rect(54, 116, 206, 126)} cls="bp-fill" />
        </>
      ),
      front: (
        <>
          <ellipse className="bp-fade" fill="url(#bp-glow)" cx="133" cy="196" rx="34" ry="28" />
          <Candle x={107} h={20} />
          <Candle x={120} h={30} />
          <Candle x={133} h={24} />
          <Candle x={146} h={30} />
          <Candle x={159} h={18} />
        </>
      ),
      balloons: garland(through([[52, 206], [48, 160], [54, 120], [80, 104], [130, 104], [170, 104], [198, 106]]), 13.5, 10, {
        swell: [[0, 1.15], [0.32, 1.3], [0.55, 1.1], [0.85, 1.1], [1, 0.95]],
      }),
      sprigs: [
        [60, 96, 230, 0.95, 0.35], [74, 92, -90, 0.9, 0.4], [132, 96, -80, 0.85, 0.65],
        [196, 96, -50, 0.9, 0.95], [204, 112, 20, 0.8, 1], [36, 160, 180, 0.9, 0.1],
      ],
      shadow: [138, 90],
    }),
  },
  {
    name: "Sailboard garland",
    label: "A tall sailboard with a balloon garland along its base and up one side",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={archBoard(100, 192, 24)} cls="bp-fill-blush" />
        </>
      ),
      balloons: garland(through([[204, 206], [150, 206], [96, 198], [82, 172], [88, 126], [98, 84], [112, 60]]), 16, 5, {
        from: 0.38,
        swell: [[0, 0.55], [0.2, 0.85], [0.38, 1.45], [0.55, 1.1], [1, 0.75]],
      }),
      sprigs: [
        [110, 48, -110, 0.95, 1], [102, 52, -150, 0.85, 0.98], [74, 118, 190, 0.9, 0.75],
        [112, 132, 20, 0.85, 0.7], [200, 196, -40, 0.85, 1], [56, 182, 195, 0.9, 0.2],
      ],
      shadow: [130, 96],
    }),
  },
  {
    name: "Sailboard backdrop",
    label: "Three sailboards of different heights with a balloon garland climbing the tallest",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={archBoard(38, 98, 72)} cls="bp-fill-sage" />
          <Prop d={archBoard(158, 210, 104)} cls="bp-fill-blush" />
          <Prop d={archBoard(94, 160, 22)} cls="bp-fill" />
        </>
      ),
      balloons: [
        ...garland(bezier([[46, 204], [80, 196], [96, 120], [122, 58]]), 12.5, 8, { o1: 0.7, swell: [[0, 1.4], [0.25, 1.05], [0.8, 0.95], [1, 0.8]] }),
        ...garland(arc(184, 214, 30, 40, 180, 0), 12, 9, { o0: 0.45, from: 0.5, swell: [[0, 0.85], [0.5, 1.25], [1, 0.9]] }),
      ],
      sprigs: [
        [124, 40, -110, 0.9, 1], [128, 44, -60, 0.85, 1], [86, 150, 190, 0.85, 0.4],
        [184, 166, -90, 0.85, 0.75], [204, 188, -60, 0.8, 0.9],
      ],
      shadow: [124, 100],
    }),
  },
  {
    name: "Shimmer wall garland",
    label: "A shimmer wall with balloon garlands across two of its corners",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={rect(53, 56, 187, FLOOR)} cls="bp-fill-sequin" />
          <rect className="bp-fade" x="53" y="56" width="134" height={FLOOR - 56} fill="url(#bp-sequins)" />
          <rect className="bp-fade" x="53" y="56" width="134" height={FLOOR - 56} fill="url(#bp-sheen)" />
          <ellipse className="bp-fade" cx="150" cy="95" rx="40" ry="52" fill="url(#bp-bloom)" />
        </>
      ),
      balloons: [
        ...garland(bezier([[56, 150], [42, 78], [66, 54], [160, 54]]), 13, 11, { o1: 0.55, swell: [[0, 1.05], [1, 1.0]] }),
        ...garland(bezier([[130, 202], [208, 214], [200, 150], [190, 106]]), 14, 23, {
          o0: 0.45, swell: [[0, 1.4], [0.3, 1.5], [1, 0.75]],
        }),
      ],
      sprigs: [
        [40, 106, 190, 0.9, 0.2], [52, 80, 220, 0.9, 0.3], [164, 46, -60, 0.85, 0.55],
        [206, 104, -60, 0.9, 1], [130, 176, 200, 0.85, 0.6],
      ],
      shadow: [130, 96],
    }),
  },
  {
    name: "Full hoop garland",
    label: "A gold hoop on a stand, with balloons most of the way round",
    draw: () => ({
      props: <Hoop cx={130} cy={128} r={78} />,
      balloons: garland(arc(130, 128, 78, 78, 62, 292), 13, 13, {
        swell: [[0, 0.8], [0.12, 0.95], [0.4, 1.15], [0.64, 1.35], [0.85, 1.1], [1, 0.85]],
      }),
      sprigs: [
        [118, 46, -100, 0.9, 0.12], [170, 60, -30, 0.85, 0.02],
        [50, 100, 200, 0.9, 0.3], [46, 140, 180, 0.9, 0.45], [62, 180, 150, 0.9, 0.6],
        [158, 196, -40, 0.85, 0.95],
      ],
      shadow: [130, 70],
    }),
  },
  {
    name: "Half hoop garland",
    label: "A gold hoop on a stand with balloons round one side",
    draw: () => ({
      props: <Hoop cx={132} cy={128} r={78} />,
      balloons: garland(arc(132, 128, 78, 78, 105, 262), 13, 14, {
        swell: [[0, 0.8], [0.25, 0.95], [0.48, 1.25], [0.7, 1.05], [0.86, 1.3], [1, 1.15]],
      }),
      sprigs: [
        [110, 52, -120, 0.9, 0.05], [62, 96, 200, 0.85, 0.25], [74, 128, 10, 0.85, 0.5],
        [128, 196, -30, 0.85, 0.95], [50, 160, 170, 0.9, 0.6],
      ],
      shadow: [130, 66],
    }),
  },
  {
    name: "Balloon wall",
    label: "A balloon wall packed edge to edge with balloons of mixed sizes",
    draw: () => {
      // packed edge to edge, a bumpy but square outline
      const X0 = 30, X1 = 212, Y0 = 38, Y1 = 202;
      const cells: Cell[] = [];
      for (let y = Y0 - 6; y <= Y1 + 6; y += 2) {
        for (let x = X0 - 6; x <= X1 + 6; x += 2) {
          const edge = Math.min(x - X0, X1 - x, y - Y0, Y1 - y);
          if (edge < -4) continue;
          const m = marginRoom(x, y);
          if (m <= 0) continue;
          cells.push({ x, y, room: Math.min(edge + 8, m), inner: edge + 2, edge: m, far: Infinity, sc: 1, t: (x - X0) / (X1 - X0) });
        }
      }
      const balloons = pack(
        cells,
        [
          { k: [17, 20], mix: BIG, space: 4, max: 13, big: true },
          { k: [12, 14], mix: MID, max: 32 },
          { k: [7, 9], mix: SMALL, max: 34 },
          { k: [4, 5], mix: TINY, max: 18 },
        ],
        7,
        (c) => c.t * 0.9 + rnd(c.x * 3 + c.y, 4) * 0.1
      );
      return {
        props: (
          <>
            <Floor />
            <Prop d={`M40 207 H205 M42 207 V${FLOOR} M205 207 V${FLOOR}`} cls="bp-gold" />
          </>
        ),
        balloons,
        shadow: [122, 100],
      };
    },
  },
  {
    name: "Number stack",
    label: "The number 3 filled with balloons, standing on a low plinth",
    draw: () => ({
      props: (
        <>
          <Floor />
          <Prop d={rect(30, PLINTH_TOP, 210, FLOOR)} cls="bp-fill" />
          <rect className="bp-plinth-top bp-fade" x="30.5" y="200.5" width="179" height="4" />
        </>
      ),
      balloons: numberThree(16),
      shadow: [120, 98],
    }),
  },
];

/* ---------- one tile ---------- */

const outBack = (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const FILLS: Fill[] = ["ivory", "blush", "sage", "gold"];
const LEAF = "M0 0 Q5 -2.3 10 0 Q5 2.3 0 0 Z";

/** Paints shared by every tile, defined once per page. */
const BalloonPaints = () => (
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

const Tile = ({ name, label, draw }: (typeof DRAWINGS)[number]) => {
  const ref = useRef<HTMLElement>(null);
  const art = useMemo(() => {
    startTile(name === "Balloon wall" ? 2 : 1);
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
  }, [draw, name]);
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

const BalloonPieceGuide = () => (
  <div className="bp-guide article-pad article-block mx-auto" data-track-location="balloon-piece-guide">
    <BalloonPaints />
    <div className="bp-grid">
      {DRAWINGS.map((d) => (
        <Tile key={d.name} {...d} />
      ))}
    </div>
  </div>
);

export default BalloonPieceGuide;
