import type { ServiceCardItem } from "@/components/rfx/ServicesCards";
import { galleryPhoto } from "@/data/gallery";

/* Balloon page "What we make" photo tiles (also shown on /style-guide/).
   Plain names, no links (Matt, 2026-11-08). Sixteen since 2026-11-16, picked against a competitor's list (Matt): sixteen so desktop's four across end on a full row, names short enough for one line in a phone tile (about 200px, Fraunces 17px), and sentence case. */
/* The gallery sources the tiles use, so the page's "Recent work" can leave them out. */
export const WHAT_WE_MAKE_SOURCES = new Set<string>();
const tile = (title: string, source: string, position?: string): ServiceCardItem => {
  WHAT_WE_MAKE_SOURCES.add(source);
  const p = galleryPhoto(source);
  return { title, image: p.src, srcSet: p.srcSet, alt: p.alt, position };
};
export const WHAT_WE_MAKE: ServiceCardItem[] = [
  tile("Sailboard backdrops", "river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp", "40% 50%"),
  tile("Hoop garlands", "services/milestones/blush-rose-hoop-garland-living-room.webp"),
  tile("Gender reveals", "river-fox-events-baby-stubbs-gender-reveal-arch-side-angle.webp"),
  tile("Tablescapes", "services/milestones/navy-gold-bubble-balloon-table-centrepieces.webp"),
  tile("Balloon garlands", "journal/dylan-christening-first-birthday/dylan-christening-blue-gold-balloon-feature-wall.webp", "35% 50%"),
  tile("Shimmer walls", "services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp", "35% 50%"),
  tile("Light-up numbers", "services/milestones/18th-birthday-blue-chrome-light-up-numbers.webp"),
  tile("Balloon walls", "services/childrens-parties/halloween-balloon-wall-bright-skeletons-bats.webp"),
  tile("Balloon sculptures", "services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp", "50% 40%"),
  tile("Entrance garlands", "services/corporate/restaurant-entrance-garland-black-gold-balloons.webp"),
  tile("Number balloons", "services/milestones/40th-birthday-champagne-gold-garland-restaurant.webp"),
  tile("Balloon arches", "services/corporate/shop-entrance-arch-green-white-balloons.webp"),
  tile("Balloon columns", "services/corporate/casino-night-balloon-columns-red-black-gold.webp"),
  tile("Corporate installs", "services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp"),
  tile("Organic arches", "services/corporate/lakeside-terrace-navy-balloon-arch.webp", "70% 50%"),
  tile("Welcome signs", "services/milestones/baby-in-bloom-welcome-sign-blue-balloons.webp", "35% 50%"),
];
