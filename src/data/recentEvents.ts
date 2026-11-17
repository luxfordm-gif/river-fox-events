/**
 * "Recent events" on the home page (Matt, 2026-11-17): Laura's latest work,
 * the best photo of each kind of event, newest first. The first one is the
 * large lead photo. Captions are shortened from Laura's own Instagram posts.
 *
 * To refresh: take her newest photos from @riverfox_events, grade them (the
 * edit-laura-photos skill), export a `website` set (400, 700, 1000 wide) into
 * src/assets/home/recent/, and replace an entry below. If all her latest posts
 * are one kind of event, show only the best and move on to the next kind.
 */
import xmas400 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-400.webp";
import xmas700 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-700.webp";
import xmas1000 from "@/assets/home/recent/christmas-spruce-door-garland-beauty-salon-entrance-red-berries-white-baubles-1000.webp";
import game400 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-400.webp";
import game700 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-700.webp";
import game1000 from "@/assets/home/recent/gaming-party-duke-level-8-tron-fortnite-marshmello-backdrop-blue-black-balloons-1000.webp";
import uni400 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-400.webp";
import uni700 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-700.webp";
import uni1000 from "@/assets/home/recent/unicorn-rainbow-party-ava-name-sign-shimmer-wall-pastel-balloons-1000.webp";

export type RecentEvent = {
  /** Small caps label over the caption. */
  kind: string;
  /** One line on the brief. */
  line: string;
  src: string;
  srcSet: string;
  alt: string;
  /** CSS object-position, to keep the subject in the crop. */
  position: string;
};

const sizes = (small: string, medium: string, large: string) => `${small} 400w, ${medium} 700w, ${large} 1000w`;

export const RECENT_EVENTS: RecentEvent[] = [
  {
    // Instagram post of 13 Nov 2026
    kind: "Christmas door garland",
    line: "I've now dressed this salon doorway four years running, in spruce, red berries and white and silver baubles.",
    src: xmas1000,
    srcSet: sizes(xmas400, xmas700, xmas1000),
    alt: "Spruce door garland with red berries and white and silver baubles framing a beauty salon entrance",
    position: "50% 38%",
  },
  {
    // Instagram post of 13 Jul 2026
    kind: "Children's party · Gaming theme",
    line: "Level 8 unlocked: Tron, Fortnite and Marshmello backdrops with blue, purple and black balloon garlands.",
    src: game1000,
    srcSet: sizes(game400, game700, game1000),
    alt: "Tron, Fortnite and Marshmello party backdrop with a Duke unlocks Level 8 sign and blue and black balloon garlands",
    position: "50% 50%",
  },
  {
    // Instagram post of 5 Oct 2026
    kind: "Children's party · Unicorns and rainbows",
    line: "Soft pastels, a shimmer wall and a unicorn for a little girl's dream party.",
    src: uni1000,
    srcSet: sizes(uni400, uni700, uni1000),
    alt: "Painted unicorn cut-out beside a holographic shimmer wall and pastel balloons on a pink party backdrop",
    position: "50% 88%",
  },
];
