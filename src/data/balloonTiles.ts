import type { ServiceCardItem } from "@/components/rfx/ServicesCards";
import { galleryPhoto } from "@/data/gallery";

/* Balloon page "What we make" photo tiles (also shown on /style-guide/). */
const tile = (title: string, href: string, source: string, position?: string): ServiceCardItem => {
  const p = galleryPhoto(source);
  return { title, href, image: p.src, srcSet: p.srcSet, alt: p.alt, position };
};
export const WHAT_WE_MAKE: ServiceCardItem[] = [
  tile("Organic arches", "/childrens-parties/", "river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp", "40% 50%"),
  tile("Hoops & backdrops", "/childrens-parties/", "services/milestones/heart-hoop-red-blush-balloons-heart-foils.webp"),
  tile("Balloon garlands", "/milestone-celebrations/", "journal/dylan-christening-first-birthday/dylan-christening-blue-gold-balloon-feature-wall.webp", "35% 50%"),
  tile("Balloon walls", "/childrens-parties/", "services/childrens-parties/halloween-balloon-wall-bright-skeletons-bats.webp"),
  tile("Number & letter stacks", "/milestone-celebrations/", "services/milestones/18th-birthday-blue-chrome-light-up-numbers.webp"),
  tile("Balloon columns", "/corporate-brand-styling/", "services/corporate/casino-night-balloon-columns-red-black-gold.webp"),
  tile("Table centrepieces", "/milestone-celebrations/", "services/milestones/navy-gold-bubble-balloon-table-centrepieces.webp"),
  tile("Shopfront installs", "/corporate-brand-styling/", "services/corporate/shop-entrance-arch-green-white-balloons.webp"),
];

