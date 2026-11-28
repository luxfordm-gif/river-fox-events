import {
  arc, archBoard, bezier, BIG, Candle, type Balloon, type Cell, Floor, FLOOR, garland, Hoop, marginRoom, MID, type Mix,
  pack, pickFor, type Piece, Prop, rect, ring, rnd, SMALL, through, TINY,
} from "./balloonArt";

/**
 * The twelve balloon pieces (Matt, 2026-11-28), drawn with the kit in
 * balloonArt.tsx. Pages pick them by id through BalloonPieces.tsx. Names say
 * what the piece is first, then where it goes, in the Balloons page's words.
 * Order: arches, then every garland together, then the balloon wall and the
 * number stack. No double hoop (Matt, 2026-11-28). To add a piece, follow
 * docs/illustration.md and give it an id.
 */

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

export const BALLOON_PIECES = [
  {
    id: "arch",
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
    id: "half-arch",
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
    id: "wall-garland",
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
    id: "table-garland",
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
    id: "mantelpiece",
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
    id: "sailboard",
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
    id: "sailboard-backdrop",
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
    id: "shimmer-wall",
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
    id: "full-hoop",
    name: "Full hoop garland",
    label: "A gold hoop on a stand, with balloons all the way round",
    draw: () => ({
      props: <Hoop cx={130} cy={128} r={78} />,
      // all the way round (Matt, 2026-11-28: the gap on the right read as half done)
      balloons: garland(arc(130, 128, 78, 78, 62, 422), 13, 13, {
        swell: [[0, 0.8], [0.12, 0.95], [0.4, 1.15], [0.64, 1.35], [0.85, 1.1], [1, 0.85]],
      }),
      sprigs: [
        [118, 46, -100, 0.9, 0.12], [170, 60, -30, 0.85, 0.02],
        [50, 100, 200, 0.9, 0.3], [46, 140, 180, 0.9, 0.45], [62, 180, 150, 0.9, 0.6],
        [158, 196, -40, 0.85, 0.95], [210, 160, 20, 0.85, 0.85],
      ],
      shadow: [130, 70],
    }),
  },
  {
    id: "half-hoop",
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
    id: "balloon-wall",
    name: "Balloon wall",
    maxBigSage: 2,
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
    id: "number-stack",
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
] as const satisfies readonly Piece[];

export type PieceId = (typeof BALLOON_PIECES)[number]["id"];
