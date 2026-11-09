import type { ReactNode } from "react";
import type { LocationConfig } from "./types";
import imgWhatWeDo from "@/assets/cp-celebrations.webp";
import imgOccasions from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgGalleryMain from "@/assets/dinosaur-themed-birthday-party-surrey.webp";
import imgGallery1 from "@/assets/christening-blessing-styling-surrey.webp";
import imgGallery2 from "@/assets/corporate-gala-styling-surrey.webp";

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
import lwPastelSafariAnaya from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-tablescape.webp";
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
    alt: "Sunlit rose gold 40th marquee numbers with a blush and chrome balloon garland",
    balanced: true,
  },
  "baby-shower-bloom": {
    src: lwBabyShowerBloom,
    alt: "Dusty blue and white Baby in Bloom balloon arch with floral accents for a baby shower",
    balanced: true,
  },
  "stubbs-gender-reveal": {
    src: lwStubbsGenderReveal,
    alt: "Side angle of the He or She balloon arch in soft blue and pink for the Stubbs gender reveal",
    balanced: false,
  },
  "dinosaur-ayaan": {
    src: lwDinosaurAyaan,
    alt: "Side angle of Ayaan's dinosaur birthday arch, with sage and cream balloons, crate props and personalised signage",
    balanced: false,
  },
  "fairy-kayla": {
    src: lwFairyKayla,
    alt: "Overhead view of Kayla's fairy first birthday table with pastel place settings, a mossy runner and trailing greenery",
    balanced: false,
  },
  "jungle-elephant": {
    src: lwJungleElephant,
    alt: "Jungle tablescape with an elephant centrepiece, monstera runner, giraffe-print plates and safari balloons",
    balanced: true,
  },
  "naming-harvey-daisy": {
    src: lwNamingHarveyDaisy,
    alt: "Daisies and wildflowers in the foreground of Harvey's garden naming ceremony arch",
    balanced: false,
  },
  "pastel-safari-anaya": {
    src: lwPastelSafariAnaya,
    alt: "Pastel safari Two Wild table for Anaya's second birthday, with pink place settings, a foliage runner and a light-up two",
    balanced: false,
  },
  "veuve-disco": {
    src: lwVeuveDisco,
    alt: "Mirrored disco-ball centrepiece nested in tangerine and white balloons at Angela and Georgia's celebration",
    balanced: true,
  },
  "wonka-chocolate-arch": {
    src: lwWonkaChocolateArch,
    alt: "Oversized chocolate bar arch from Savanna's Willy Wonka fifth birthday in purple, brown and gold",
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
  /** Bespoke paragraph for the "Why River Fox Events?" block.
   *  Must be unique per town - Google pulls this as the search-result
   *  snippet, so a shared value makes every location look identical.
   *  Falls back to a generic templated paragraph when omitted. */
  uniqueUspBody?: string;
  /** Override the "What I style." services-cards heading/intro.
   *  Use on children's-party-led pages to demote the block to a secondary
   *  "we also style X" framing. Falls back to the shared default. */
  uniqueServicesHeading?: ReactNode;
  uniqueServicesIntro?: ReactNode;
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
    uniqueUspBody,
    uniqueServicesHeading,
    uniqueServicesIntro,
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
        alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts",
      };
  const galThumbs = images
    ? images.galleryThumbs.map((k) => LATEST_WORK[k])
    : [
        {
          src: imgGallery1,
          alt: "Blush, champagne and pearl balloon garlands either side of a christening panel with a cross and a draped plinth",
        },
        {
          src: imgGallery2,
          alt: "Navy, gold and cream balloons around a Children in Need Pudsey backdrop at a corporate gala",
        },
        // was cp-included, which is never shown (Matt, 2026-11-07)
        LATEST_WORK["fairy-kayla"],
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
      `${cityName} party stylist - tailored children's parties, milestones and corporate events across ${region} from £300. Every detail personally handled by Laura.`,
    hero: {
      lines: [
        uniqueHeroLine ?? <>Event styling in {cityName},</>,
        <>
          <em className="t-accent">
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
          <em className="t-accent">
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
            I work with families and businesses across {cityName}
            {villagesIntro ? `, ${villagesIntro}` : ""} and the surrounding
            villages, designing each celebration around your ideas and
            handling every detail on the day.
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
          <em className="t-accent">
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
      heading: (
        <>
          Recent{" "}
          <em className="t-accent">celebrations.</em>
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
          <em className="t-accent">
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
          I arrive before your first guest and leave once everything is
          cleared. You do nothing except enjoy the day.
        </>
      ),
    },
    pricing: {
      heading: (
        <>
          Styling in {cityName}{" "}
          <em className="t-accent">from £300.</em>
        </>
      ),
      tiers: [
        {
          price: "From £300",
          label: "Intimate",
          body: "Intimate celebrations · Single focal point installation.",
        },
        {
          price: "From £800",
          label: "Full styling",
          body: "Full styling · Multiple installations · Backdrops and tablescape.",
        },
        {
          price: "From £1,500",
          label: "Premium",
          body: "Large-scale events · Premium full-venue transformation.",
        },
      ],
      footnote:
        "All pricing is indicative - every proposal is tailored.",
    },
    uspBody: uniqueUspBody,
    servicesHeading: uniqueServicesHeading,
    servicesIntro: uniqueServicesIntro,
    localProse: uniqueLocalProse,
    faqs: [
      {
        q: `Do you style events in ${cityName}?`,
        a:
          uniquePresenceAnswer ??
          `Yes - ${cityName} is part of my regular ${region} coverage, along with ${villagesFaq} and the surrounding villages.`,
      },
      {
        q: "Are you a party planner or party stylist? What's the difference?",
        a: "I'm a party stylist. I design the decorations, bring them to your home or venue, set everything up before guests arrive and take it all down afterwards. That covers balloon installations, backdrops, signs and themed props. The venue, food and entertainment stay with you, or with your planner if you have one.",
        // Linked phrases go to the journal piece that's really about them,
        // so every town page feeds the journal (2026-11-09).
        aNode: (
          <>
            I'm a{" "}
            <a href="/journal/hiring-an-event-stylist-surrey/" className="text-link">
              party stylist
            </a>
            . I design the decorations, bring them to your home or venue, set
            everything up before guests arrive and take it all down
            afterwards. That covers balloon installations, backdrops, signs
            and themed props. The venue, food and entertainment stay with you,
            or with your planner if you have one.
          </>
        ),
      },
      {
        q: "How far in advance should I book?",
        a:
          uniqueLeadTimeAnswer ??
          `For events in ${cityName}, I'd suggest enquiring at least 6–8 weeks ahead, especially for weekends in the school holidays, as these book up quickly. It's still worth asking at shorter notice, as dates do sometimes come free.`,
      },
      {
        q: "Do you travel to my home or venue?",
        a: `Yes, I come to you, whether it's your home, a village hall, a restaurant, a hotel or a private hire space in or around ${cityName}. Setting up and taking everything down are both included.`,
      },
      {
        q: `How much does event styling cost in ${cityName}?`,
        a: `It depends on the type of celebration and the size of the brief. Events start from £300, with larger or more involved designs usually ranging from £800 to £1,500+.`,
      },
      {
        q: "Can I choose my own theme and colours?",
        a: "Yes. Send me a theme, a colour palette or a photo you love, and I'll design the celebration around it.",
      },
      {
        q: "What happens on the day?",
        a: `I arrive before your guests and install everything, from the balloon installations to the backdrops, tablescapes and signage, so it's all in place when people walk in. Once the celebration is over, I come back to pack it all away.`,
        aNode: (
          <>
            I arrive before your guests and{" "}
            <a href="/journal/from-design-to-delivery/" className="text-link">
              install everything
            </a>
            , from the balloon installations to the backdrops, tablescapes and
            signage, so it's all in place when people walk in. Once the
            celebration is over, I come back to pack it all away.
          </>
        ),
      },
      ...(uniqueExtraFaq ? [uniqueExtraFaq] : []),
      ...(uniqueExtraFaqs ?? []),
    ],
    nearby: {
      eyebrow: "Where I work",
      heading: (
        <>
          Styling celebrations across{" "}
          <em className="t-accent">
            {cityName} and {region}.
          </em>
        </>
      ),
      intro: (
        <>
          Every piece is designed and prepared at my studio in Horley,
          then brought to you and installed on the day. I travel across
          Surrey and into London, so if your venue isn't listed below,
          just ask.
        </>
      ),
      areas,
      mapQuery,
      mapTitle: `Map of ${cityName} and ${region} - areas covered by River Fox Events`,
    },
    jsonLdAreaServed,
  };
}
