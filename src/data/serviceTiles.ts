import type { ServiceCardItem } from "@/components/rfx/ServicesCards";
import type { InstagramStripImage } from "@/components/rfx/InstagramStrip";
import { galleryPhoto } from "@/data/gallery";

/* "What we do" photo tiles on the three main service pages, built like the
   balloon page's "What we make" (Matt, 2026-11-09). A tile links on only when
   there's a sub-service page or a journal article that is really about it;
   the rest are plain names. Keep the links tight - add one when a page or
   article exists, never point a tile somewhere loosely related.
   Photos come from the Our work gallery (one image, one alt) and none repeat
   the page's hero or its intro sections. Orders alternate colours so similar
   photos don't sit side by side. */
const tile = (title: string, source: string, href?: string, position?: string): ServiceCardItem => {
  const p = galleryPhoto(source);
  return { title, href, image: p.src, srcSet: p.srcSet, alt: p.alt, position };
};

export const CHILDRENS_TILES: ServiceCardItem[] = [
  tile("Balloon arches", "river-fox-events-pastel-birthday-reeva-entrance-arch.webp", "/balloon-installations/"),
  tile("Light-up letters", "services/childrens-parties/halloween-boo-light-up-letters-spiders.webp"),
  tile("Welcome signs", "services/childrens-parties/aurelia-first-birthday-welcome-sign-pink.webp"),
  tile("Table styling", "services/childrens-parties/dinosaur-table-roar-plates-foliage-runner.webp", "/journal/beyond-the-balloon-arch/"),
  tile("Picnic setups", "services/childrens-parties/bell-tent-picnic-pastel-balloons-garden.webp"),
  tile("Character cutouts", "services/childrens-parties/peter-rabbit-first-birthday-blue-balloon-backdrop.webp"),
  tile("Themed backdrops", "services/childrens-parties/onederland-first-birthday-ava-garden-backdrop.webp", "/journal/childrens-party-themes-2026/"),
  tile("Themed props", "services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp"),
];

export const MILESTONE_TILES: ServiceCardItem[] = [
  tile("Balloon garlands", "services/milestones/40th-birthday-champagne-gold-garland-restaurant.webp", "/balloon-installations/"),
  tile("Light-up numbers", "services/milestones/70th-birthday-sage-gold-light-up-numbers.webp"),
  tile("Christenings", "journal/dylan-christening-first-birthday/dylan-christening-arched-welcome-panel-balloon-garland.webp", "/journal/dylan-christening-first-birthday/"),
  tile("Sequin walls", "services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp", "/journal/shimmer-wall-hire-surrey/"),
  tile("Garden parties", "journal/garden-milestone-styling-surrey/garden-milestone-banquet-table-oxted.webp", "/journal/garden-milestone-styling-surrey/"),
  tile("Table centrepieces", "services/milestones/gloria-80th-birthday-table-centrepiece-burhill.webp"),
  tile("Baby showers", "services/milestones/baby-in-bloom-barn-twin-arches-dusty-blue.webp", "/journal/baby-shower-themes-2026/"),
  tile("Balloon hoops", "services/milestones/blush-rose-hoop-garland-living-room.webp"),
];

export const CORPORATE_TILES: ServiceCardItem[] = [
  tile("Branded balloon installs", "services/corporate/125-years-entrance-columns-green-white-gold-stars.webp", "/balloon-installations/"),
  tile("Sequin walls", "journal/christmas-decorations-surrey/gold-sequin-wall-black-gold-balloons-office-party.webp", "/journal/shimmer-wall-hire-surrey/"),
  tile("Christmas parties", "journal/christmas-decorations-surrey/merry-christmas-panel-silver-navy-balloon-garland.webp", "/journal/christmas-decorations-surrey/"),
  tile("Shop openings", "services/corporate/dawghouse-pizza-takeaway-opening-garland-epsom.webp"),
  tile("Logo backdrops", "services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp"),
  tile("Themed event nights", "services/corporate/casino-night-balloon-columns-red-black-gold.webp"),
  tile("Christmas shopfronts", "christmas/instagram/pink-shopfront-red-white-window-garland.webp", "/christmas-door-garlands/"),
  tile("Entrance displays", "services/corporate/restaurant-entrance-garland-black-gold-balloons.webp"),
];

/* A page's "Ideas for..." strip minus any photo already used in its tiles,
   so the same photo never shows twice on one page. */
export const withoutTilePhotos = (
  strip: InstagramStripImage[],
  tiles: ServiceCardItem[]
): InstagramStripImage[] => {
  const used = new Set(tiles.map((t) => t.image));
  return strip.filter((img) => !used.has(img.src));
};
