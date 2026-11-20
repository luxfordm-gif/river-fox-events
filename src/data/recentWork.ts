import { GALLERY, orderedEvents } from "@/data/gallery";
import type { ViewerItem } from "@/components/rfx/PhotoViewer";
import xmas400 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-400.webp";
import xmas700 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-700.webp";
import xmas1000 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-1000.webp";
import porch400 from "@/assets/gallery/porch-garland-arch-wreath-front-wide-house-view-400.webp";
import porch700 from "@/assets/gallery/porch-garland-arch-wreath-front-wide-house-view-700.webp";
import porch1000 from "@/assets/gallery/porch-garland-arch-wreath-front-wide-house-view-1000.webp";
import game400 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-400.webp";
import game700 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-700.webp";
import game1000 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-1000.webp";
import uni400 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-400.webp";
import uni700 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-700.webp";
import uni1000 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-1000.webp";

/**
 * Home page "Recent work" (Matt, 2026-11-17): Laura's latest work, newest
 * first, a mix of everything she does (not only balloons).
 *
 * The first four are her newest Instagram posts that aren't in the gallery
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
  // Christmas porch garland, Worplesdon (20 Nov 2026); same file as the Our work photo
  lead("christmas/porch/porch-garland-arch-wreath-front-wide-house-view.webp", "Timber porch garland", "Wide view of a white house with a spruce and gold bauble garland over its porch and a wreath on the door", [porch400, porch700, porch1000], 1324),
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
