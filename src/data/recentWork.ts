import { GALLERY, resolvePhoto } from "@/data/gallery";
import type { ViewerItem } from "@/components/rfx/PhotoViewer";
import { christmasOn } from "@/lib/announcementBar";

/**
 * Laura's latest work: the one list behind every "Recent celebrations" /
 * "Recent work" photo wall (home, the 19 town pages, /services/; Matt,
 * 2026-11-24).
 *
 * TO ADD NEW WORK ("add this to Recent celebrations"):
 *   1. Grade the photo and add it to the Our work gallery (src/data/gallery.ts,
 *      then `node scripts/gallery-images.mjs`), as the river-fox skill's job
 *      steps say.
 *   2. Add one line to the TOP of RECENT_WORK below, with its service and the
 *      date it was posted.
 *   3. If the list is now longer than MAX_ENTRIES, delete the last line.
 * Every wall shows the newest WALL_SIZE (three rows) on the next deploy, so
 * the new piece pushes the oldest one off. The walls never grow.
 *
 * What goes on is whatever this list holds (Matt, 2026-11-24): Laura's
 * biggest and best children's parties, a few milestone celebrations and, in
 * season, this year's garlands and wreaths; no corporate. Add only work that
 * is genuinely recent: check the date on her Instagram. Christmas pieces show only in season (christmasOn(), off from
 * christmasEndsOn in src/data/announcementBar.ts); the spares at the bottom
 * fill their places after that (src/test/recent-work.test.ts checks every
 * wall stays full).
 *
 * Every wall mixes the order on each visit, so a run of one kind of work
 * (a month of garlands) doesn't bunch together: see mixed() below.
 */

export type Service = "childrens-parties" | "milestones" | "corporate" | "christmas";
export type RecentEntry = {
  /** A photo in the Our work gallery (its path inside src/assets/). Its alt,
   *  title and place come from the gallery: one file, one alt. */
  source: string;
  service: Service;
  /** When Laura posted it (YYYY-MM-DD, or YYYY-MM from her feed), where
   *  known. The list's order is what counts: newest first. */
  added?: string;
};

/** Three rows: 4 across on laptops (and the town walls' justified rows). */
export const WALL_SIZE = 12;
/** On show plus spares for when the Christmas pieces drop out. */
export const MAX_ENTRIES = 16;

export const RECENT_WORK: RecentEntry[] = [
  // Christmas (in season only), this season's garlands and wreaths
  { source: "christmas/porch/porch-garland-arch-wreath-front-wide-house-view.webp", service: "christmas", added: "2026-11-20" },
  { source: "christmas/instagram/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles.webp", service: "christmas", added: "2026-11-13" },
  { source: "journal/christmas-decorations-surrey/christmas-doorway-garland-pink-studio-east-molesey.webp", service: "christmas", added: "2026-11" },
  { source: "christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp", service: "christmas", added: "2026-11" },
  // Children's parties and milestones, newest first
  { source: "services/childrens-parties/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons.webp", service: "childrens-parties", added: "2026-10-05" },
  { source: "services/milestones/valentina-12th-birthday-chanel-black-white-backdrop.webp", service: "milestones", added: "2026-09-12" },
  { source: "services/childrens-parties/ottilie-toy-story-second-birthday-gingham-table.webp", service: "childrens-parties", added: "2026-07" },
  { source: "services/childrens-parties/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons.webp", service: "childrens-parties", added: "2026-07-13" },
  { source: "river-fox-events-willy-wonka-savanna-chocolate-bar-arch.webp", service: "childrens-parties", added: "2026-06" },
  { source: "services/milestones/21st-pastel-balloon-wall-light-up-numbers.webp", service: "milestones", added: "2026-04" },
  { source: "dinosaur-ayaan-arch-surrey.webp", service: "childrens-parties", added: "2026-04" },
  { source: "services/childrens-parties/peter-rabbit-first-birthday-blue-balloon-backdrop.webp", service: "childrens-parties", added: "2026-03" },
  { source: "services/childrens-parties/berry-first-birthday-strawberry-balloon-backdrop.webp", service: "childrens-parties", added: "2026-03" },
  // Spares: on show once the Christmas pieces drop out
  { source: "river-fox-events-jungle-theme-fourever-wild-full-setup.webp", service: "childrens-parties" },
  { source: "river-fox-events-fairy-first-birthday-kayla-arch-marquee-portrait.webp", service: "childrens-parties" },
  { source: "river-fox-events-pastel-safari-anaya-two-wild-tablescape.webp", service: "childrens-parties" },
];

export type RecentItem = ViewerItem & { service: Service };

/** A gallery photo with its event's title and place, ready for the wall. */
const fromGallery = (e: RecentEntry): RecentItem => {
  for (const s of GALLERY)
    for (const ev of s.events)
      for (const p of ev.photos)
        if (p.source === e.source) return { ...resolvePhoto(p), title: ev.title, place: ev.place, service: e.service };
  throw new Error(`Recent work photo is not in the gallery: ${e.source}`);
};

/** The newest WALL_SIZE photos for a wall. Christmas only in season;
 *  `exclude` leaves out photos already shown elsewhere on that page. The
 *  list alone decides what shows (Matt, 2026-11-24: no separate mix rule). */
export const recentWall = ({
  exclude = [],
  season = christmasOn(),
}: { exclude?: string[]; season?: boolean } = {}): RecentItem[] =>
  RECENT_WORK.filter((e) => (season || e.service !== "christmas") && !exclude.includes(e.source))
    .slice(0, WALL_SIZE)
    .map(fromGallery);

/** A repeatable random number source (mulberry32), for the prerendered order. */
export const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Shuffle, then reorder so no two photos of the same service sit side by
 *  side wherever the mix allows it (Matt, 2026-11-24: "so we don't get all
 *  garland work"). Every photo is kept. */
export const mixed = <T extends { service: string }>(items: T[], random: () => number = Math.random): T[] => {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const out: T[] = [];
  while (pool.length) {
    const prev = out[out.length - 1]?.service;
    // Take from the service with the most left (never the one just placed),
    // so the biggest group is spread out first; ties keep the shuffled order.
    const left = (s: string) => pool.filter((p) => p.service === s).length;
    let pick = -1;
    for (let i = 0; i < pool.length; i++) {
      if (pool[i].service === prev) continue;
      if (pick < 0 || left(pool[i].service) > left(pool[pick].service)) pick = i;
    }
    out.push(pool.splice(pick < 0 ? 0 : pick, 1)[0]);
  }
  return out;
};
