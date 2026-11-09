import type { ServiceCardItem } from "@/components/rfx/ServicesCards";
import { galleryPhoto } from "@/data/gallery";

/* Balloon page "What we make" photo tiles (also shown on /style-guide/).
   Plain names, no links (Matt, 2026-11-08). */
const tile = (title: string, source: string, position?: string): ServiceCardItem => {
  const p = galleryPhoto(source);
  return { title, image: p.src, srcSet: p.srcSet, alt: p.alt, position };
};
export const WHAT_WE_MAKE: ServiceCardItem[] = [
  tile("Organic arches", "river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp", "40% 50%"),
  tile("Hoops & backdrops", "services/milestones/heart-hoop-red-blush-balloons-heart-foils.webp"),
  tile("Balloon garlands", "journal/dylan-christening-first-birthday/dylan-christening-blue-gold-balloon-feature-wall.webp", "35% 50%"),
  tile("Balloon walls", "services/childrens-parties/halloween-balloon-wall-bright-skeletons-bats.webp"),
  tile("Number & letter stacks", "services/milestones/18th-birthday-blue-chrome-light-up-numbers.webp"),
  tile("Balloon columns", "services/corporate/casino-night-balloon-columns-red-black-gold.webp"),
  tile("Table centrepieces", "services/milestones/navy-gold-bubble-balloon-table-centrepieces.webp"),
  tile("Shopfront installs", "services/corporate/shop-entrance-arch-green-white-balloons.webp"),
];

