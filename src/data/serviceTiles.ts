import type { ServiceCardItem } from "@/components/rfx/ServicesCards";
import type { InstagramStripImage } from "@/components/rfx/InstagramStrip";
import { galleryPhoto } from "@/data/gallery";

/* "What we do" photo tiles on the three main service pages, built like the
   balloon page's "What we make" (Matt, 2026-11-09). Tiles are plain names with
   no links (Matt, 2026-11-18: a tap that opened a journal article was
   unexpected).
   Photos come from the Our work gallery (one image, one alt) and none repeat
   the page's hero or its intro sections. Orders alternate colours so similar
   photos don't sit side by side. */
const tile = (title: string, source: string, position?: string): ServiceCardItem => {
  const p = galleryPhoto(source);
  return { ...p, title, position: position ?? p.position };
};

export const CHILDRENS_TILES: ServiceCardItem[] = [
  tile("Full theme parties", "services/childrens-parties/jungle-party-long-table-lion-plates-soft-play.webp"),
  tile("Balloon arches", "river-fox-events-pastel-birthday-reeva-entrance-arch.webp"),
  tile("Light-up letters", "services/childrens-parties/halloween-boo-light-up-letters-spiders.webp"),
  tile("Shimmer walls", "services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp"),
  tile("Sailboards", "river-fox-events-fairy-first-birthday-kayla-arch-marquee-portrait.webp"),
  tile("Welcome signs", "services/childrens-parties/aurelia-first-birthday-welcome-sign-pink.webp"),
  tile("Table styling", "services/childrens-parties/dinosaur-table-roar-plates-foliage-runner.webp"),
  tile("Picnic setups", "services/childrens-parties/bell-tent-picnic-pastel-balloons-garden.webp"),
  tile("Character cutouts", "services/childrens-parties/peter-rabbit-first-birthday-blue-balloon-backdrop.webp"),
  tile("Themed backdrops", "services/childrens-parties/onederland-first-birthday-ava-garden-backdrop.webp"),
  tile("Themed props", "services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp"),
  tile("Balloon walls", "services/childrens-parties/halloween-balloon-wall-bright-skeletons-bats.webp"),
];

export const MILESTONE_TILES: ServiceCardItem[] = [
  tile("40th birthdays", "river-fox-events-40th-birthday-rose-gold-marquee-sunlit.webp"),
  tile("50th birthdays", "services/milestones/50th-birthday-pink-light-up-numbers-teal-garland.webp"),
  tile("Gender reveals", "river-fox-events-baby-stubbs-gender-reveal-arch-side-angle.webp"),
  tile("Baby showers", "services/milestones/baby-in-bloom-barn-twin-arches-dusty-blue.webp"),
  tile("Sailboards", "river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp"),
  tile("Christenings", "journal/dylan-christening-first-birthday/dylan-christening-arched-welcome-panel-balloon-garland.webp"),
  tile("Light-up numbers", "services/milestones/70th-birthday-sage-gold-light-up-numbers.webp"),
  tile("Sequin walls", "services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp"),
  tile("Balloon garlands", "services/milestones/40th-birthday-champagne-gold-garland-restaurant.webp"),
  tile("Garden parties", "journal/garden-milestone-styling-surrey/garden-milestone-banquet-table-oxted.webp"),
  tile("Balloon hoops", "services/milestones/blush-rose-hoop-garland-living-room.webp"),
  tile("Naming ceremonies", "river-fox-events-naming-ceremony-harvey-arch-side-angle.webp"),
];

export const CORPORATE_TILES: ServiceCardItem[] = [
  tile("Balloon arches", "services/corporate/lakeside-terrace-navy-balloon-arch.webp"),
  tile("Balloon stacks", "services/corporate/125-years-entrance-columns-green-white-gold-stars.webp"),
  tile("Balloon garlands", "services/corporate/restaurant-entrance-garland-black-gold-balloons.webp"),
  tile("Sequin walls", "journal/christmas-decorations-surrey/gold-sequin-wall-black-gold-balloons-office-party.webp"),
  tile("Logo backdrops", "services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp"),
  tile("Sailboards", "journal/christmas-decorations-surrey/merry-christmas-panel-silver-navy-balloon-garland.webp"),
  tile("Shop openings", "services/corporate/dawghouse-pizza-takeaway-opening-garland-epsom.webp"),
  tile("Themed events", "services/corporate/casino-night-balloon-columns-red-black-gold.webp"),
  tile("Christmas shopfronts", "christmas/instagram/pink-shopfront-red-white-window-garland.webp"),
  tile("Entrance displays", "services/corporate/shop-entrance-arch-green-white-balloons.webp"),
  tile("Table centrepieces", "services/milestones/navy-gold-bubble-balloon-table-centrepieces.webp"),
  tile("Seasonal events", "services/corporate/bocketts-farm-easter-bunny-booth-balloon-garland.webp"),
];

/* A page's "Ideas for..." strip minus any photo already used in its tiles,
   so the same photo never shows twice on one page. */
export const withoutTilePhotos = (
  strip: InstagramStripImage[],
  tiles: ServiceCardItem[]
): InstagramStripImage[] => {
  const used = new Set(tiles.map((t) => t.src));
  return strip.filter((img) => !used.has(img.src));
};
