import type { ReactNode } from "react";
import type { LocationConfig } from "./types";
import imgWhatWeDo from "@/assets/cp-celebrations.webp";
import imgOccasions from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgGalleryMain from "@/assets/dinosaur-themed-birthday-party-surrey.webp";
import imgGallery1 from "@/assets/christening-blessing-styling-surrey.webp";
import imgGallery2 from "@/assets/corporate-gala-styling-surrey.webp";
import imgGallery3 from "@/assets/cp-included.webp";

// Latest Work - shared image pool for location pages. Each entry has a single
// canonical alt that describes the photo (no per-town interpolation, per the
// "one image, one alt" rule in CLAUDE.md). Towns pick 6 of these 10 keys via
// the optional `images` override on makeLocation.
import lw40thRoseGold from "@/assets/river-fox-events-40th-birthday-rose-gold-marquee-sunlit.webp";
import lwBabyShowerBloom from "@/assets/river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp";
import lwStubbsGenderReveal from "@/assets/river-fox-events-baby-stubbs-gender-reveal-arch-side-angle.webp";
import lwDinosaurAyaan from "@/assets/river-fox-events-dinosaur-theme-ayaan-arch-side-angle.webp";
import lwFairyKayla from "@/assets/river-fox-events-fairy-first-birthday-kayla-tablescape-overhead.webp";
import lwJungleElephant from "@/assets/river-fox-events-jungle-theme-safari-tablescape-elephant.webp";
import lwNamingHarveyDaisy from "@/assets/river-fox-events-naming-ceremony-harvey-daisy-foreground.webp";
import lwPastelSafariAnaya from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-table-setting.webp";
import lwVeuveDisco from "@/assets/river-fox-events-veuve-cliquot-angela-georgia-balloon-disco-close-up.webp";
import lwWonkaChocolateArch from "@/assets/river-fox-events-willy-wonka-savanna-chocolate-bar-arch.webp";

/**
 * `balanced: true` means the subject sits centrally in the frame and the
 * shot can safely take the rotated/scaled right slot of the hero fan.
 * Off-centre / side-angle / overhead shots must NOT be used in heroFan
 * slot 3 - they read as visually skewed once tilted +7°.
 */
export const LATEST_WORK = {
  "40th-rose-gold": {
    src: lw40thRoseGold,
    alt: "Sunlit 40th birthday rose gold marquee numbers with blush and chrome balloon garland styled by River Fox Events",
    balanced: true,
  },
  "baby-shower-bloom": {
    src: lwBabyShowerBloom,
    alt: "Dusty blue and white Baby in Bloom balloon arch with floral accents styled for a Surrey baby shower by River Fox Events",
    balanced: true,
  },
  "stubbs-gender-reveal": {
    src: lwStubbsGenderReveal,
    alt: "Side angle of the He or She balloon arch in soft blue and pink for the Stubbs family gender reveal by River Fox Events",
    balanced: false,
  },
  "dinosaur-ayaan": {
    src: lwDinosaurAyaan,
    alt: "Side angle of Ayaan's dinosaur birthday balloon arch - sage and cream balloons with crate props and personalised signage by River Fox Events",
    balanced: false,
  },
  "fairy-kayla": {
    src: lwFairyKayla,
    alt: "Overhead view of Kayla's fairy first birthday tablescape with pastel place settings, mossy runner and trailing florals by River Fox Events",
    balanced: false,
  },
  "jungle-elephant": {
    src: lwJungleElephant,
    alt: "Jungle theme birthday tablescape with elephant centrepiece, monstera runner and balloon installation by River Fox Events",
    balanced: true,
  },
  "naming-harvey-daisy": {
    src: lwNamingHarveyDaisy,
    alt: "Daisies and wildflowers in the foreground of Harvey's garden naming ceremony arch styled by River Fox Events",
    balanced: false,
  },
  "pastel-safari-anaya": {
    src: lwPastelSafariAnaya,
    alt: "Pastel safari Two Wild table setting for Anaya's second birthday with pink place settings, foliage runner and balloon detail by River Fox Events",
    balanced: false,
  },
  "veuve-disco": {
    src: lwVeuveDisco,
    alt: "Close-up of a mirrored disco-ball centrepiece nested in tangerine and white balloons for Angela and Georgia's champagne-themed celebration by River Fox Events",
    balanced: true,
  },
  "wonka-chocolate-arch": {
    src: lwWonkaChocolateArch,
    alt: "Oversized chocolate bar arch from Savanna's Willy Wonka fifth birthday styling with purple, brown and gold palette by River Fox Events",
    balanced: true,
  },
} as const;

export type LocationImageKey = keyof typeof LATEST_WORK;

/** Per-location image picks from the LATEST_WORK pool.
 *  heroFan order is [left, centre, right] - centre is the largest card. */
export type LocationImages = {
  heroFan: [LocationImageKey, LocationImageKey, LocationImageKey];
  galleryMain: LocationImageKey;
  galleryThumbs: [LocationImageKey, LocationImageKey, LocationImageKey];
};

/**
 * Inputs for a Surrey town location page. The builder fans these out into
 * a full LocationConfig with hero, occasions, gallery, included, pricing,
 * FAQs and "where we work" sections.
 *
 * Required fields drive the templated copy. Optional `unique*` fields let a
 * town file inject bespoke local content (specific venues, postcode quirks,
 * local character) so each page reads as genuinely different to crawlers
 * and humans - not a near-duplicate of its neighbours.
 */
type LocationInput = {
  slug: string;
  cityName: string;
  /** Override the H1's "Your {city} party stylist." with bespoke phrasing.
   *  Use when the standard line reads awkwardly (e.g. "Your Brighton & Hove
   *  party stylist."). Should still slot Laura/personalisation into a
   *  visible italic phrase further down. */
  uniqueHeroLine?: ReactNode;
  /** Override the hero subline. */
  uniqueHeroSub?: ReactNode;
  /** Override the SEO title (≤60 chars including " | River Fox Events"). */
  uniqueSeoTitle?: string;
  /** Override the H1 region word ("Surrey") in seoTitle generation when
   *  the town isn't strictly Surrey. */
  seoTitleRegion?: string;
  /** Regional bucket, used in body copy. e.g. "Surrey", "East Surrey", "North Surrey". */
  region: string;
  /** Surrounding villages - populates the "we work across X, Y, Z" body copy and FAQs. */
  nearbyVillages: string[];
  /** Bullet list shown in the "Where we work" section. */
  areas: string[];
  /** Google Maps query string, e.g. "Cobham,Surrey,England,UK&z=11". */
  mapQuery: string;
  /** Areas served in the Service JSON-LD. Keep tight to the town + immediate area. */
  jsonLdAreaServed: string[];
  /** Override the auto-generated SEO description (≤160 chars). */
  uniqueSeoDescription?: string;
  /** Bespoke single paragraph rendered before the templated paragraph in
   *  "What we do". String input gets wrapped in <p>; use uniqueWhatWeDoBody
   *  if you need multiple paragraphs of bespoke local copy. */
  uniqueWhatWeDoLead?: ReactNode;
  /** Multiple paragraphs of bespoke local copy for the "What we do" body.
   *  Caller is responsible for own <p> wrappers. Renders before the templated
   *  paragraph; supersedes uniqueWhatWeDoLead when both are present. */
  uniqueWhatWeDoBody?: ReactNode;
  /** Bespoke single paragraph rendered before the templated paragraph in "Occasions". */
  uniqueOccasionsLead?: ReactNode;
  /** Multiple paragraphs of bespoke local copy for the "Occasions" body.
   *  Caller is responsible for own <p> wrappers. */
  uniqueOccasionsBody?: ReactNode;
  /** Replaces the default "Do you style events in [town]?" answer. Use to
   *  list specific venues / postcode coverage / repeat-client mentions. */
  uniquePresenceAnswer?: string;
  /** Replaces the default "How far in advance should I book?" answer. Use
   *  to mention local seasonal pressure (e.g. summer river season,
   *  Brighton festival, school catchments). */
  uniqueLeadTimeAnswer?: string;
  /** Extra town-specific Q&A inserted after the standard set. */
  uniqueExtraFaq?: { q: string; a: string };
  /** Multiple extra Q&As inserted after the standard set. Renders after
   *  uniqueExtraFaq if both are provided. */
  uniqueExtraFaqs?: { q: string; a: string }[];
  /** Bespoke local-prose section rendered between the gallery and
   *  "How it works". Must be written per location - three short
   *  paragraphs referencing real local entities. Never copy-paste. */
  uniqueLocalProse?: LocationConfig["localProse"];
  /** Per-location image picks from the LATEST_WORK pool. Pass keys for the
   *  two reveal blocks plus four gallery slots. If omitted, falls back to
   *  the legacy shared defaults. Alt text is taken from the registry so
   *  each image carries one canonical alt across the site. */
  images?: LocationImages;
};

export function makeLocation(input: LocationInput): LocationConfig {
  const {
    slug,
    cityName,
    region,
    nearbyVillages,
    areas,
    mapQuery,
    jsonLdAreaServed,
    uniqueHeroLine,
    uniqueHeroSub,
    uniqueSeoTitle,
    seoTitleRegion,
    uniqueSeoDescription,
    uniqueWhatWeDoLead,
    uniqueWhatWeDoBody,
    uniqueOccasionsLead,
    uniqueOccasionsBody,
    uniquePresenceAnswer,
    uniqueLeadTimeAnswer,
    uniqueExtraFaq,
    uniqueExtraFaqs,
    uniqueLocalProse,
    images,
  } = input;

  const villagesIntro = nearbyVillages.slice(0, 3).join(", ");
  const villagesFaq = nearbyVillages.slice(0, 4).join(", ");

  // Resolve image picks. Falls back to legacy shared defaults if a town
  // hasn't been migrated yet - keeps untouched location files working.
  if (images && !LATEST_WORK[images.heroFan[2]].balanced) {
    throw new Error(
      `[makeLocation:${slug}] heroFan slot 3 must be a balanced image - "${images.heroFan[2]}" is off-centre and will read skewed once tilted. Use one of: ${Object.entries(
        LATEST_WORK
      )
        .filter(([, v]) => v.balanced)
        .map(([k]) => k)
        .join(", ")}.`
    );
  }
  const heroFanImages = images
    ? (images.heroFan.map((k) => LATEST_WORK[k]) as [
        { src: string; alt: string },
        { src: string; alt: string },
        { src: string; alt: string }
      ])
    : undefined;
  const galMain = images
    ? LATEST_WORK[images.galleryMain]
    : {
        src: imgGalleryMain,
        alt: `Sage green dinosaur themed children's birthday party styling in ${cityName} by River Fox Events - personalised name sign, balloon garland and lush foliage`,
      };
  const galThumbs = images
    ? images.galleryThumbs.map((k) => LATEST_WORK[k])
    : [
        {
          src: imgGallery1,
          alt: `Christening styling in ${cityName} Surrey by River Fox Events - soft ivory and blush balloon installation with floral accents`,
        },
        {
          src: imgGallery2,
          alt: "Corporate gala styling in Surrey by River Fox Events - elegant tablescape with statement floral centrepiece",
        },
        {
          src: imgGallery3,
          alt: "Children's party styling in Surrey by River Fox Events - fully styled cake table with personalised signage",
        },
      ];

  return {
    slug,
    cityName,
    region,
    seoTitle:
      uniqueSeoTitle ??
      `Party Stylist ${cityName} ${
        seoTitleRegion ?? "Surrey"
      } | River Fox Events`,
    seoDescription:
      uniqueSeoDescription ??
      `${cityName} party stylist - tailored children's parties, milestones and corporate events across ${region} from £460. Every detail personally handled by Laura.`,
    hero: {
      lines: [
        uniqueHeroLine ?? <>Event styling in {cityName},</>,
        <>
          <em className="italic font-normal text-accent-warm">
            designed around you.
          </em>
        </>,
      ],
      sub: uniqueHeroSub ?? (
        <>
          Bespoke event styling in {cityName} and across {region} -
          children's parties, milestone celebrations and tailored
          installations.
        </>
      ),
      fanImages: heroFanImages,
    },
    whatWeDo: {
      image: imgWhatWeDo,
      imageAlt: `Tailored event styling in ${cityName} by River Fox Events - pastel balloon installation with organic textures and soft floral accents`,
      imageSide: "right",
      tone: "ph-warm",
      headline: (
        <>
          Your celebration,{" "}
          <em className="italic font-light text-accent-warm">
            completely taken care of.
          </em>
        </>
      ),
      body: (
        <>
          {uniqueWhatWeDoBody
            ? uniqueWhatWeDoBody
            : uniqueWhatWeDoLead && <p>{uniqueWhatWeDoLead}</p>}
          <p>
            We work with families and businesses across {cityName}
            {villagesIntro ? `, ${villagesIntro}` : ""} and the surrounding
            villages - individually designing celebrations around your
            vision, then handling every detail on the day.
          </p>
        </>
      ),
    },
    occasions: {
      image: imgOccasions,
      imageAlt: `Elegant birthday party styling in ${cityName} by River Fox Events - ivory, gold and soft blush balloon installation with floral accents`,
      imageSide: "left",
      tone: "ph-blush",
      headline: (
        <>
          Every occasion,{" "}
          <em className="italic font-light text-accent-warm">
            honoured properly.
          </em>
        </>
      ),
      body: (
        <>
          {uniqueOccasionsBody
            ? uniqueOccasionsBody
            : uniqueOccasionsLead && <p>{uniqueOccasionsLead}</p>}
          <p>
            Children's birthdays, christenings, milestone moments, baby
            showers and corporate events across {region} - every {cityName}
            celebration shaped around the people, the venue and the feeling
            of the day.
          </p>
        </>
      ),
    },
    gallery: {
      eyebrow: "Through our lens",
      heading: (
        <>
          A glimpse of recent{" "}
          <em className="italic font-light text-accent-warm">celebrations.</em>
        </>
      ),
      intro: (
        <>
          Every River Fox Events celebration is completely bespoke and
          tailored to you.
        </>
      ),
      mainImage: galMain.src,
      mainImageAlt: galMain.alt,
      images: galThumbs,
    },
    included: {
      eyebrow: "The full River Fox experience",
      heading: (
        <>
          Everything handled.{" "}
          <em className="italic font-light text-accent-warm">
            Nothing left to chance.
          </em>
        </>
      ),
      items: [
        {
          icon: "palette",
          label: "Design concept",
          body: "A tailored theme and colour palette built entirely around your vision.",
        },
        {
          icon: "sparkle",
          label: "Installations",
          body: "Statement balloon sculptures, arches and focal points.",
        },
        {
          icon: "archway",
          label: "Backdrops & signage",
          body: "Personalised pieces designed for your celebration.",
        },
        {
          icon: "cake",
          label: "Cake & party tables",
          body: "Fully styled and dressed to the last detail.",
        },
        {
          icon: "heart",
          label: "Setup & breakdown",
          body: "Fully managed, start to finish - nothing for you to lift.",
        },
      ],
      closingLine: (
        <>
          We arrive before your first guest and leave once everything is
          cleared. You do nothing except enjoy the day.
        </>
      ),
    },
    pricing: {
      heading: (
        <>
          Beautifully styled celebrations in {cityName}{" "}
          <em className="italic font-light text-accent-warm">from £460.</em>
        </>
      ),
      tiers: [
        {
          price: "From £460",
          label: "Intimate",
          body: "Intimate celebrations · Single focal point installation.",
        },
        {
          price: "From £1,200",
          label: "Full styling",
          body: "Full styling · Multiple installations · Backdrops and tablescape.",
        },
        {
          price: "From £2,500",
          label: "Premium",
          body: "Large-scale events · Premium full-venue transformation.",
        },
      ],
      footnote:
        "All pricing is indicative - every proposal is tailored.",
    },
    localProse: uniqueLocalProse,
    faqs: [
      {
        q: `Do you style events in ${cityName}?`,
        a:
          uniquePresenceAnswer ??
          `Yes - ${cityName} is part of our regular ${region} coverage, along with ${villagesFaq} and the surrounding villages.`,
      },
      {
        q: "Are you a party planner or party stylist? What's the difference?",
        a: "River Fox Events is an event styling studio. While a planner manages logistics such as venues, suppliers and timelines, our focus is on the visual experience - creating statement installations and cohesive styling that transform your space. We specialise in large-scale balloon installations, custom backdrops and thoughtfully styled details, ensuring your celebration feels considered and ready to enjoy.",
      },
      {
        q: "How far in advance should I book?",
        a:
          uniqueLeadTimeAnswer ??
          `For events in ${cityName} we recommend enquiring at least 6–8 weeks ahead, particularly for weekend dates during school holidays - these book up quickly. That said, always worth asking as last-minute availability does occasionally come up.`,
      },
      {
        q: "Do you travel to my home or venue?",
        a: `Yes - whether it's your home, a village hall, a restaurant, a hotel or a private hire space in or around ${cityName}, we come to you. Setup and breakdown are fully included.`,
      },
      {
        q: `How much does event styling cost in ${cityName}?`,
        a: `Pricing depends on the type of celebration and the scope of the brief. Typically our events start from £460, with larger or more involved designs ranging from £1,200 – £2,500+.`,
      },
      {
        q: "Can I choose my own theme and colours?",
        a: "Each celebration is shaped around your style and vision. Any inspiration you have can be shared and developed into a design that feels cohesive and considered.",
      },
      {
        q: "What happens on the day?",
        a: `We arrive ahead of your event to install every detail - from statement installations to custom backdrops, tablescapes and styled elements - ensuring everything is in place before guests arrive. Once the celebration has finished, we return for a seamless breakdown.`,
      },
      ...(uniqueExtraFaq ? [uniqueExtraFaq] : []),
      ...(uniqueExtraFaqs ?? []),
    ],
    nearby: {
      eyebrow: "Where we work",
      heading: (
        <>
          Styling celebrations across{" "}
          <em className="italic font-light text-accent-warm">
            {cityName} and {region}.
          </em>
        </>
      ),
      intro: (
        <>
          Based in Surrey, River Fox Events styles celebrations across{" "}
          {areas.join(", ")} and into London. Not sure if we cover your
          area? Just ask.
        </>
      ),
      areas,
      mapQuery,
      mapTitle: `Map of ${cityName} and ${region} - areas covered by River Fox Events`,
    },
    jsonLdAreaServed,
  };
}
