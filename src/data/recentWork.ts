import { GALLERY, orderedEvents } from "@/data/gallery";
import type { ViewerItem } from "@/components/rfx/PhotoViewer";
import xmas400 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-400.webp";
import xmas700 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-700.webp";
import xmas1000 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-1000.webp";
import game400 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-400.webp";
import game700 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-700.webp";
import game1000 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-1000.webp";
import uni400 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-400.webp";
import uni700 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-700.webp";
import uni1000 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-1000.webp";

/**
 * "Recent work" photo walls.
 *
 * Balloons page (Matt, 2026-11-16): 29 hand-picked balloon-led setups across
 * children's parties, milestones and corporate. Each is a gallery source
 * file; the grid looks up its alt text there.
 */
export const BALLOON_WORK_SOURCES = [
  "dinosaur-ayaan-arch-surrey.webp",
  "river-fox-events-willy-wonka-savanna-chocolate-bar-arch.webp",
  "river-fox-events-pastel-birthday-reeva-entrance-arch.webp",
  "river-fox-events-pastel-entrance-decor-arch.webp",
  "services/childrens-parties/peter-rabbit-first-birthday-blue-balloon-backdrop.webp",
  "journal/dylan-christening-first-birthday/dylan-first-birthday-teddy-cutout-chrome-gold-balloons.webp",
  "journal/dylan-christening-first-birthday/dylan-christening-arched-welcome-panel-balloon-garland.webp",
  "services/corporate/lakeside-terrace-navy-balloon-arch.webp",
  "services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp",
  "services/childrens-parties/garden-picnic-party-pastel-balloons-low-table.webp",
  "services/childrens-parties/bell-tent-picnic-pastel-balloons-garden.webp",
  "services/milestones/13th-birthday-pink-light-up-numbers-garland.webp",
  "river-fox-events-veuve-cliquot-angela-georgia-arch-wide.webp",
  "services/milestones/heart-hoop-red-blush-balloons-heart-foils.webp",
  "services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp",
  "services/milestones/70th-birthday-sage-gold-light-up-numbers.webp",
  "journal/garden-milestone-styling-surrey/garden-milestone-balloon-arch.webp",
  "services/milestones/baby-in-bloom-barn-twin-arches-dusty-blue.webp",
  "services/milestones/50th-birthday-pink-light-up-numbers-teal-garland.webp",
  "services/milestones/40th-birthday-champagne-gold-garland-restaurant.webp",
  "services/milestones/baby-shower-sage-gold-balloons-baby-blocks.webp",
  "services/milestones/blush-rose-hoop-garland-living-room.webp",
  "services/milestones/gloria-80th-birthday-table-centrepiece-burhill.webp",
  "services/corporate/125-years-entrance-columns-green-white-gold-stars.webp",
  "services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp",
  "river-fox-events-nxtgen-corporate-entrance-columns-side-angle.webp",
  "services/corporate/bocketts-farm-easter-bunny-booth-balloon-garland.webp",
  "river-fox-events-corporate-atrium-twin-balloon-arches.webp",
  "services/corporate/restaurant-entrance-garland-black-gold-balloons.webp",
  "services/corporate/shop-entrance-arch-green-white-balloons.webp",
  // Nothing already shown higher up the page: not in "I'm asked for most", not in the intro.
];

/**
 * Home page "Recent work" (Matt, 2026-11-17): Laura's latest work, newest
 * first, a mix of everything she does (not only balloons).
 *
 * The first three are her newest Instagram posts that aren't in the gallery
 * yet (already graded, in src/assets/home/recent/); to refresh, replace one
 * with her next post, newest first. After them come the first events of
 * Children's parties, Milestones and Corporate, taking turns: those sections
 * list their newest work first, so this follows the Our work page.
 */
const lead = (
  source: string, title: string, alt: string, [s, m, l]: [string, string, string], height: number,
): ViewerItem => ({
  source, title, alt, src: m, srcSet: `${s} 400w, ${m} 700w, ${l} 1000w`, large: l,
  width: 1000, height, seen: true,
});

export const HOME_RECENT_LEAD: ViewerItem[] = [
  // Instagram post of 13 Nov 2026
  lead("recent/christmas-door-garland-salon", "Christmas door garland", "Spruce door garland with red berries and white and silver baubles framing a beauty salon entrance", [xmas400, xmas700, xmas1000], 1329),
  // Instagram post of 13 Jul 2026
  lead("recent/gaming-party-duke", "Children's party, gaming theme", "Tron, Fortnite and Marshmello party backdrop with a Duke unlocks Level 8 sign and blue and black balloon garlands", [game400, game700, game1000], 1000),
  // Instagram post of 5 Oct 2026
  lead("recent/unicorn-party-ava", "Children's party, unicorns and rainbows", "Painted unicorn cut-out beside a holographic shimmer wall and pastel balloons on a pink party backdrop", [uni400, uni700, uni1000], 1000),
];

/** Gallery photos to follow the lead, as `{ alt }` picks, one per event, sections taking turns. */
export const homeRecentPicks = (count: number): { alt: string }[] => {
  const skip = /rishi-summer-party|halloween/;
  const lists = ["childrens-parties", "milestones", "corporate"].map((id) =>
    orderedEvents(GALLERY.find((s) => s.id === id)!)
      .map((e) => e.photos[0])
      .filter((p) => !skip.test(p.source)),
  );
  const out: { alt: string }[] = [];
  for (let i = 0; out.length < count && lists.some((l) => i < l.length); i++)
    for (const l of lists) if (i < l.length && out.length < count) out.push({ alt: l[i].alt });
  return out;
};
