/**
 * Our work - the gallery page at /our-work/.
 *
 * This file is the whole page's content. To add Laura's new photos:
 *
 *   1. Put the processed WebP in src/assets/ (see src/assets/README.md for
 *      naming). Give it a content-descriptive filename.
 *   2. Add an event (or a photo to an existing event) below. `source` is the
 *      path inside src/assets/. The first photo of an event is the big one;
 *      up to two more show as smaller tiles underneath.
 *   3. Run `node scripts/gallery-images.mjs` - it makes the small, medium and
 *      large copies the page loads (src/assets/gallery/) and records each
 *      photo's size so the page doesn't jump while images load.
 *
 * Alt text rule: one image file, one alt. If the file is already used
 * elsewhere on the site, copy its existing alt rather than writing a new one
 * (`LATEST_WORK` in src/data/locations/_makeLocation.tsx holds the canonical
 * ones). Max 125 characters for new alts, and describe the photo, not the
 * page.
 *
 * Captions are short and plain: the theme or occasion, plus the town or venue
 * when we know it. No em dashes, no exclamation marks.
 */

import manifest from "@/assets/gallery/manifest.json";

export type GalleryPhoto = {
  /** Path inside src/assets/, e.g. "river-fox-events-....webp". */
  source: string;
  alt: string;
  /** CSS object-position for the cropped small tiles, if the subject isn't centred. */
  position?: string;
};

export type GalleryEvent = {
  /** Short plain caption: the theme or occasion. */
  title: string;
  /** Town or venue, when known. */
  place?: string;
  /** 1-3 photos. The first is shown large. */
  photos: GalleryPhoto[];
};

export type GallerySection = {
  /** Anchor id, e.g. /our-work/#childrens-parties */
  id: string;
  /** Short label for the jump links at the top of the page. */
  label: string;
  /** Section title: plain words, then the italic accent word(s). */
  titleLead: string;
  titleAccent: string;
  intro: string;
  /** The service page this section links on to. */
  link: { href: string; label: string };
  /** Single-photo events in a tighter grid (used for Christmas doorways). */
  compact?: boolean;
  events: GalleryEvent[];
};

export const GALLERY: GallerySection[] = [
  {
    id: "childrens-parties",
    label: "Children's parties",
    titleLead: "Children's",
    titleAccent: "parties.",
    intro:
      "Themed birthdays, first birthdays and christenings, each one individually designed around the child.",
    link: { href: "/childrens-parties/", label: "See children's party styling" },
    events: [
      {
        title: "Fourever Wild jungle party",
        photos: [
          {
            source: "river-fox-events-jungle-theme-fourever-wild-full-setup.webp",
            alt: "Fourever Wild jungle party setup with white safari jeep, balloon garland, giraffe, zebra and lion cub by a bamboo backdrop",
          },
          {
            source: "river-fox-events-jungle-theme-safari-tablescape-elephant.webp",
            alt: "Jungle theme birthday tablescape with elephant centrepiece, monstera runner and balloon installation by River Fox Events",
          },
          {
            source: "river-fox-events-jungle-theme-lion-plates-overhead.webp",
            alt: "Jungle theme overhead place setting by River Fox Events - lion-printed plates with raffia and animal-print napkins",
          },
        ],
      },
      {
        title: "Anaya's pastel safari second birthday",
        photos: [
          {
            source: "river-fox-events-pastel-safari-anaya-two-wild-tablescape.webp",
            alt: "Pastel safari Two Wild table setting for Anaya's second birthday with pink place settings, foliage runner and balloon detail by River Fox Events",
          },
          {
            source: "pastel-safari-anaya-two-wild-ballroom-surrey.webp",
            alt: "Long pastel safari banquet table in a chandeliered ballroom, with a Two Wild arch, light-up two and balloon columns",
          },
          {
            source: "river-fox-events-pastel-safari-anaya-two-wild-marquee-close-up.webp",
            alt: "Close-up of the pink light-up two marquee from Anaya's pastel safari Two Wild birthday in Surrey by River Fox Events",
          },
        ],
      },
      {
        title: "Kayla's fairy first birthday",
        photos: [
          {
            source: "river-fox-events-fairy-first-birthday-kayla-arch-marquee-portrait.webp",
            alt: "Fairy first birthday arch and light-up one marquee for Kayla in Surrey by River Fox Events - pink and lilac balloons with mossy detail",
          },
          {
            source: "river-fox-events-fairy-first-birthday-kayla-tablescape-overhead.webp",
            alt: "Overhead view of Kayla's fairy first birthday tablescape with pastel place settings, mossy runner and trailing florals by River Fox Events",
          },
        ],
      },
      {
        title: "Kai's one-o-saurus first birthday",
        photos: [
          {
            source: "services/childrens-parties/kai-one-o-saurus-first-birthday-dinosaur-backdrop.webp",
            alt: "Sage, rust and cream balloon garland over a green Kai is a one-o-saurus panel, with dinosaur cutouts and a white plinth",
          },
          {
            source: "services/childrens-parties/kai-one-o-saurus-dinosaur-cutouts-side-angle.webp",
            alt: "Side view of painted dinosaur cutouts and a rust, sage and gold garland on Kai's one-o-saurus backdrop",
          },
        ],
      },
      {
        title: "Ayaan's dinosaur birthday",
        photos: [
          {
            source: "dinosaur-ayaan-arch-surrey.webp",
            alt: "Dinosaur theme children's birthday styling in Surrey by River Fox Events - Ayaan name arch, sage balloons and crate props",
          },
          {
            source: "river-fox-events-dinosaur-theme-ayaan-arch-close-up-portrait.webp",
            alt: "Close-up portrait of Ayaan's dinosaur arch - sage and cream balloons with tropical foliage and personalised signage by River Fox Events",
          },
        ],
      },
      {
        title: "Savanna's Willy Wonka fifth birthday",
        photos: [
          {
            source: "river-fox-events-willy-wonka-savanna-chocolate-bar-arch.webp",
            alt: "Oversized chocolate bar arch from Savanna's Willy Wonka fifth birthday styling with purple, brown and gold palette by River Fox Events",
          },
          {
            source: "river-fox-events-willy-wonka-savanna-bar-prop-close-up.webp",
            alt: "Close-up of the oversized chocolate-bar prop with lilac balloons, lollipop foil and mushroom props from Savanna's Willy Wonka fifth birthday styled in Surrey by River Fox Events",
          },
        ],
      },
      {
        title: "Ava's ONEderland first birthday",
        photos: [
          {
            source: "services/childrens-parties/onederland-first-birthday-ava-garden-backdrop.webp",
            alt: "Wonderland first birthday backdrop in a garden, with checkerboard and pastel balloons, playing cards and toadstools",
          },
        ],
      },
      {
        title: "Amiya's Two Wild second birthday",
        place: "Horley Community Centre",
        photos: [
          {
            source: "journal/two-wild-safari-second-birthday/two-wild-safari-second-birthday-styling-horley-surrey.webp",
            alt: "Finished Two Wild safari second birthday styling at Horley Community Centre in Surrey by River Fox Events - pastel balloon garland with foliage, personalised Amiya safari name panel, marquee 2 with pink bulb lights, twelve seat banquet table dressed with foliage runner, plush elephant centrepiece, pink scallop plates, zebra print salad plates and gold cutlery",
          },
        ],
      },
      {
        title: "Aristotle's dinosaur fifth birthday",
        photos: [
          {
            source: "services/childrens-parties/aristotle-dinosaur-fifth-birthday-jungle-backdrop.webp",
            alt: "Jungle dinosaur backdrop for Aristotle's fifth birthday with green and orange balloons, tree stump plinths and a stegosaurus",
          },
        ],
      },
      {
        title: "Peter Rabbit first birthday",
        photos: [
          {
            source: "services/childrens-parties/peter-rabbit-first-birthday-blue-balloon-backdrop.webp",
            alt: "Sky blue and sage balloon garland around a ONE panel with a Peter Rabbit cutout, picket fence and grass mat",
          },
        ],
      },
      {
        title: "Dylan's christening and first birthday",
        photos: [
          {
            source: "journal/dylan-christening-first-birthday/dylan-christening-blue-gold-balloon-feature-wall.webp",
            alt: "Sky blue, chrome gold and ivory balloon hoop beside an arched welcome backdrop against a black starlight wall",
          },
          {
            source: "journal/dylan-christening-first-birthday/dylan-first-birthday-teddy-cutout-chrome-gold-balloons.webp",
            alt: "Painted rabbit cutout in a party hat holding a gift box at the foot of a chrome gold, sky blue and ivory balloon cluster",
          },
        ],
      },
      {
        title: "Pastel bunny picnic party",
        photos: [
          {
            source: "services/childrens-parties/bunny-picnic-party-pink-arches-low-table.webp",
            alt: "Low picnic table with cushions in front of pink arched panels, daisy balloons and a bunny cutout in a marquee",
          },
        ],
      },
      {
        title: "Rishi's summer party",
        photos: [
          {
            source: "services/childrens-parties/rishi-summer-party-bright-balloon-backdrop.webp",
            alt: "Turquoise, coral and lemon balloons around a Rishi's Summer Party panel, with beach balls on a garden patio",
          },
        ],
      },
      {
        title: "Reeva's pastel birthday entrance",
        photos: [
          {
            source: "river-fox-events-pastel-birthday-reeva-entrance-arch.webp",
            alt: "Pastel birthday entrance arch for Reeva in Surrey by River Fox Events - blush, peach and cream balloon arch over a welcome easel",
          },
        ],
      },
    ],
  },
  {
    id: "milestones",
    label: "Milestones",
    titleLead: "Milestone",
    titleAccent: "celebrations.",
    intro:
      "Big birthdays, baby showers, gender reveals and naming days, styled at home, in the garden or at the venue.",
    link: { href: "/milestone-celebrations/", label: "See milestone styling" },
    events: [
      {
        title: "Angela and Georgia's champagne celebration",
        photos: [
          {
            source: "river-fox-events-veuve-cliquot-angela-georgia-arch-wide.webp",
            alt: "Champagne-themed milestone birthday arch in tangerine, white and gold balloons for Angela and Georgia, styled in Surrey by River Fox Events",
          },
          {
            source: "river-fox-events-veuve-cliquot-angela-georgia-balloon-disco-close-up.webp",
            alt: "Close-up of a mirrored disco-ball centrepiece nested in tangerine and white balloons for Angela and Georgia's champagne-themed celebration by River Fox Events",
          },
        ],
      },
      {
        title: "Rose gold 40th birthday",
        photos: [
          {
            source: "river-fox-events-40th-birthday-rose-gold-marquee-sunlit.webp",
            alt: "Sunlit 40th birthday rose gold marquee numbers with blush and chrome balloon garland styled by River Fox Events",
          },
        ],
      },
      {
        title: "70th birthday in sage and gold",
        photos: [
          {
            source: "services/milestones/70th-birthday-sage-gold-light-up-numbers.webp",
            alt: "Light-up 70 marquee numbers with a sage, white and gold balloon garland in a living room",
          },
        ],
      },
      {
        title: "Gloria's 80th birthday",
        place: "Burhill",
        photos: [
          {
            source: "services/milestones/gloria-80th-birthday-table-centrepiece-burhill.webp",
            alt: "Gold Gloria's 80th Birthday bubble balloon on a silver and gold centrepiece at a laid dinner table",
          },
        ],
      },
      {
        title: "Pastel garden birthday",
        place: "Oxted",
        photos: [
          {
            source: "journal/garden-milestone-styling-surrey/garden-milestone-balloon-arch.webp",
            alt: "Pastel balloon garland in cream, peach, lilac and butter yellow wrapping a tall pink arched backdrop with hand-lettered Happy Birthday signage, set on a garden lawn against summer planting.",
          },
          {
            source: "journal/garden-milestone-styling-surrey/garden-milestone-banquet-table-oxted.webp",
            alt: "Long banquet-style picnic on a lawn with floor cushions, a cheesecloth runner, place settings and a tall pastel arched backdrop with balloon garland behind.",
          },
        ],
      },
      {
        title: "The Stubbs family gender reveal",
        photos: [
          {
            source: "river-fox-events-baby-stubbs-gender-reveal-he-or-she-arch.webp",
            alt: "He or she balloon arch in soft blue and pink for the Stubbs family gender reveal styled in Surrey by River Fox Events",
          },
          {
            source: "river-fox-events-baby-stubbs-gender-reveal-wildflower-detail.webp",
            alt: "Wildflower and dried-grass detail on the Stubbs gender reveal styling - close-up of soft pinks, blues and pampas by River Fox Events",
          },
        ],
      },
      {
        title: "Harvey's garden naming ceremony",
        photos: [
          {
            source: "river-fox-events-naming-ceremony-harvey-daisy-foreground.webp",
            alt: "Daisies and wildflowers in the foreground of Harvey's garden naming ceremony arch styled by River Fox Events",
          },
          {
            source: "river-fox-events-naming-ceremony-harvey-arch-side-angle.webp",
            alt: "Pale blue, white and gold balloon arch around a white panel on a garden lawn for Harvey's naming ceremony",
          },
        ],
      },
      {
        title: "Baby in Bloom baby shower",
        photos: [
          {
            source: "river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp",
            alt: "Dusty blue and white Baby in Bloom balloon arch with floral accents styled for a Surrey baby shower by River Fox Events",
          },
          {
            source: "services/milestones/baby-in-bloom-barn-twin-arches-dusty-blue.webp",
            alt: "Dusty blue and white balloon garlands either side of twin arched panels in a timber-framed barn",
          },
          {
            source: "services/milestones/baby-in-bloom-welcome-sign-blue-balloons.webp",
            alt: "Pale blue balloon cloud at the foot of a baby shower welcome sign on an easel",
          },
        ],
      },
      {
        title: "Pink 50th birthday",
        photos: [
          {
            source: "services/milestones/50th-birthday-pink-light-up-numbers-teal-garland.webp",
            alt: "Hot pink light-up 50 marquee numbers framed by a teal, blush and chrome garland in a function room",
          },
        ],
      },
      {
        title: "Navy and gold 50th birthday",
        photos: [
          {
            source: "services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp",
            alt: "Gold sequin wall framed by navy and gold balloons beside blue light-up 50 numbers in a panelled room",
          },
        ],
      },
      {
        title: "Champagne 40th birthday",
        photos: [
          {
            source: "services/milestones/40th-birthday-champagne-gold-garland-restaurant.webp",
            alt: "Champagne, ivory and gold balloon garland climbing a patterned wall beside rose gold 40 foil numbers",
          },
        ],
      },
      {
        title: "Pink Baby in Bloom garden shower",
        photos: [
          {
            source: "services/milestones/baby-in-bloom-pink-garden-baby-shower.webp",
            alt: "Pink Baby in Bloom arched panels with a magenta balloon arch and a rattan chair on a garden lawn",
          },
        ],
      },
      {
        title: "Sage and gold baby shower",
        photos: [
          {
            source: "services/milestones/baby-shower-sage-gold-balloons-baby-blocks.webp",
            alt: "Sage, ivory and gold balloon garland with dried pampas beside a Baby panel and BABY letter blocks",
          },
        ],
      },
      {
        title: "18th birthday in blue and chrome",
        photos: [
          {
            source: "services/milestones/18th-birthday-blue-chrome-light-up-numbers.webp",
            alt: "Light-up 18 numbers with a blue and chrome balloon garland and starburst foils on a balcony",
          },
        ],
      },
      {
        title: "Gina's 13th birthday",
        photos: [
          {
            source: "services/milestones/gina-13th-birthday-navy-gold-kitchen-backdrop.webp",
            alt: "Navy and gold balloons around a Happy Birthday Gina panel and light-up 13 numbers in a kitchen",
          },
        ],
      },
      {
        title: "Pink 13th birthday",
        photos: [
          {
            source: "services/milestones/13th-birthday-pink-light-up-numbers-garland.webp",
            alt: "Hot pink and magenta balloon garland beside pink light-up 13 numbers in a conservatory",
          },
        ],
      },
      {
        title: "Blush christening blessing",
        photos: [
          {
            source: "christening-blessing-styling-surrey.webp",
            alt: "Blush, champagne and pearl balloon garlands either side of a christening panel with a cross and a draped plinth",
          },
        ],
      },
    ],
  },
  {
    id: "corporate",
    label: "Corporate & brand",
    titleLead: "Corporate",
    titleAccent: "& brand.",
    intro:
      "Branded entrances, gala dinners, anniversaries and office parties, set up around the working day.",
    link: { href: "/corporate-brand-styling/", label: "See corporate styling" },
    events: [
      {
        title: "A theatre's 125th anniversary",
        photos: [
          {
            source: "river-fox-events-theatre-125-anniversary-marquee-wide.webp",
            alt: "125th anniversary light-up marquee numbers on a theatre staircase with cream and gold balloons styled by River Fox Events for a Surrey corporate milestone",
          },
          {
            source: "river-fox-events-theatre-125-anniversary-balloon-close-up.webp",
            alt: "Close-up of cream, gold and pearl balloon detail beside the 125 anniversary marquee on a theatre staircase styled by River Fox Events",
          },
        ],
      },
      {
        title: "125 years, front entrance",
        photos: [
          {
            source: "services/corporate/125-years-entrance-columns-green-white-gold-stars.webp",
            alt: "Green, white and gold balloon columns with 125 Years star foils either side of a grand entrance",
          },
        ],
      },
      {
        title: "Enterprise Mobility branded backdrop",
        photos: [
          {
            source: "services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp",
            alt: "Black, gold and champagne balloon garlands framing a navy Enterprise Mobility logo backdrop",
          },
        ],
      },
      {
        title: "NXTGEN branded entrance",
        photos: [
          {
            source: "river-fox-events-nxtgen-corporate-entrance-columns-side-angle.webp",
            alt: "NXTGEN branded balloon columns in green and black flanking a black panelled doorway at a corporate entrance",
          },
          {
            source: "river-fox-events-nxtgen-corporate-balloon-close-up.webp",
            alt: "Close-up of stacked green and black balloons on the NXTGEN column against a black panelled door and brick wall",
          },
        ],
      },
      {
        title: "Easter Bunny Booth",
        place: "Bockett's Farm Park",
        photos: [
          {
            source: "services/corporate/bocketts-farm-easter-bunny-booth-balloon-garland.webp",
            alt: "Pastel balloon garland with daisy balloons and a bunny topper around an Easter Bunny Booth flower wall",
          },
        ],
      },
      {
        title: "Pudsey charity gala dinner",
        photos: [
          {
            source: "river-fox-events-pudsey-charity-gala-dinner-navy-gold.webp",
            alt: "Navy and gold balloon installation at the Pudsey charity gala dinner - sophisticated event styling by River Fox Events",
          },
        ],
      },
      {
        title: "Twin arches in an office atrium",
        photos: [
          {
            source: "river-fox-events-corporate-atrium-twin-balloon-arches.webp",
            alt: "Twin balloon arches in a corporate office atrium - blue and yellow left, purple right, framing black leather sofas",
          },
        ],
      },
      {
        title: "Restaurant entrance in black and gold",
        photos: [
          {
            source: "services/corporate/restaurant-entrance-garland-black-gold-balloons.webp",
            alt: "Restaurant glass entrance doors framed by a black, gold and champagne balloon garland",
          },
        ],
      },
      {
        title: "Café counter garland",
        photos: [
          {
            source: "services/corporate/cafe-counter-garland-forest-green-cream-black.webp",
            alt: "Forest green, cream and black balloon garland around a café serving counter with a menu screen",
          },
        ],
      },
      {
        title: "Shop entrance arch in brand green",
        photos: [
          {
            source: "services/corporate/shop-entrance-arch-green-white-balloons.webp",
            alt: "Lime green and white balloon arch around the glass door of a 24-hour shop",
          },
        ],
      },
      {
        title: "Casino night columns",
        photos: [
          {
            source: "services/corporate/casino-night-balloon-columns-red-black-gold.webp",
            alt: "Two red, black, white and gold balloon columns topped with giant playing cards",
          },
        ],
      },
      {
        title: "Office Christmas party sequin wall",
        photos: [
          {
            source: "journal/christmas-decorations-surrey/gold-sequin-wall-black-gold-balloons-office-party.webp",
            alt: "Gold mirror sequin wall framed by an organic garland of black and chrome gold balloons on a checkerboard floor",
          },
        ],
      },
      {
        title: "Merry Christmas works party",
        photos: [
          {
            source: "journal/christmas-decorations-surrey/merry-christmas-panel-silver-navy-balloon-garland.webp",
            alt: "Silver, navy and white balloon garland climbing a painted Merry Christmas panel beside a white tree and blue neon light",
          },
        ],
      },
    ],
  },
  {
    id: "christmas",
    label: "Christmas",
    titleLead: "Christmas",
    titleAccent: "doorways.",
    intro:
      "Spruce garlands for front doors, shopfronts and restaurants, put up for you and taken down in January.",
    link: { href: "/christmas-door-garlands/", label: "See Christmas door garlands" },
    compact: true,
    events: [
      {
        title: "Restaurant doorway",
        place: "Reigate",
        photos: [
          {
            source: "christmas/instagram/reigate-restaurant-red-gold-garland-blue-doors.webp",
            alt: "Blue restaurant double doors in Reigate edged with red and gold bauble garlands",
          },
        ],
      },
      {
        title: "Pilates studio",
        place: "East Molesey",
        photos: [
          {
            source: "christmas/instagram/pink-pilates-studio-garland-blush-red-baubles.webp",
            alt: "Pink pilates studio doorway in East Molesey dressed in spruce with blush, white and red baubles",
          },
        ],
      },
      {
        title: "Navy door in jewel baubles",
        photos: [
          {
            source: "christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp",
            alt: "Navy front door beneath a spruce arch crowded with pink, purple, teal and gold baubles",
          },
        ],
      },
      {
        title: "Georgian door in gold and champagne",
        photos: [
          {
            source: "christmas/instagram/georgian-door-gold-champagne-garland.webp",
            alt: "Georgian black door at number 16 framed in spruce with gold and champagne baubles and stars",
          },
        ],
      },
      {
        title: "Salon frontage in true red",
        photos: [
          {
            source: "christmas/instagram/glass-salon-true-red-corner-garland.webp",
            alt: "Glass salon frontage with a spruce corner garland weighed down with true-red baubles",
          },
        ],
      },
      {
        title: "Brick porch pillars",
        photos: [
          {
            source: "christmas/instagram/brick-pillars-red-gold-garlands-sage-door.webp",
            alt: "Brick porch pillars wound with red, gold and green garlands either side of a sage door",
          },
        ],
      },
      {
        title: "Medispa entrance in frosted white",
        photos: [
          {
            source: "christmas/instagram/medispa-entrance-frosted-white-silver-garland.webp",
            alt: "Medispa entrance framed in frosted spruce with white and silver baubles",
          },
        ],
      },
      {
        title: "White door in pink and plum",
        photos: [
          {
            source: "christmas/instagram/white-door-wreath-pink-plum-garland.webp",
            alt: "White front door edged in a spruce garland of pink, plum, gold and red baubles",
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Image lookup - turns a `source` into the gallery-sized copies.      */
/* ------------------------------------------------------------------ */

const COPIES = import.meta.glob<string>("/src/assets/gallery/*.webp", {
  eager: true,
  import: "default",
});

type ManifestEntry = { width: number; height: number; widths: number[] };
const SIZES = manifest as Record<string, ManifestEntry>;

export type ResolvedPhoto = GalleryPhoto & {
  src: string;
  srcSet: string;
  width: number;
  height: number;
};

const baseName = (source: string) =>
  source.replace(/^.*\//, "").replace(/\.webp$/, "");

export function resolvePhoto(photo: GalleryPhoto): ResolvedPhoto {
  const base = baseName(photo.source);
  const entry = SIZES[base];
  if (!entry) {
    throw new Error(
      `Gallery photo "${photo.source}" has no gallery copies. Run: node scripts/gallery-images.mjs`
    );
  }
  const urls = entry.widths.map((w) => {
    const url = COPIES[`/src/assets/gallery/${base}-${w}.webp`];
    if (!url) throw new Error(`Missing gallery copy ${base}-${w}.webp`);
    return { w, url };
  });
  return {
    ...photo,
    // Middle size as the fallback src for browsers that ignore srcset.
    src: urls[Math.min(1, urls.length - 1)].url,
    srcSet: urls.map(({ w, url }) => `${url} ${w}w`).join(", "),
    width: entry.width,
    height: entry.height,
  };
}
