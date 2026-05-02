import type { ReactNode } from "react";
import type { LocationConfig } from "./types";
import imgWhatWeDo from "@/assets/cp-celebrations.webp";
import imgOccasions from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgGalleryMain from "@/assets/dinosaur-themed-birthday-party-surrey.webp";
import imgGallery1 from "@/assets/christening-blessing-styling-surrey.webp";
import imgGallery2 from "@/assets/corporate-gala-styling-surrey.webp";
import imgGallery3 from "@/assets/cp-included.webp";

/**
 * Inputs for a Surrey town location page. The builder fans these out into
 * a full LocationConfig with hero, occasions, gallery, included, pricing,
 * FAQs and "where we work" sections.
 *
 * Required fields drive the templated copy. Optional `unique*` fields let a
 * town file inject bespoke local content (specific venues, postcode quirks,
 * local character) so each page reads as genuinely different to crawlers
 * and humans — not a near-duplicate of its neighbours.
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
  /** Surrounding villages — populates the "we work across X, Y, Z" body copy and FAQs. */
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
   *  "How it works". Must be written per location — three short
   *  paragraphs referencing real local entities. Never copy-paste. */
  uniqueLocalProse?: LocationConfig["localProse"];
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
  } = input;

  const villagesIntro = nearbyVillages.slice(0, 3).join(", ");
  const villagesFaq = nearbyVillages.slice(0, 4).join(", ");

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
      `${cityName} party stylist — bespoke children's parties, milestones and corporate events across ${region} from £460. Every detail personally handled by Laura.`,
    hero: {
      lines: [
        uniqueHeroLine ?? <>Your {cityName} party stylist.</>,
        <>
          Every detail,{" "}
          <em className="italic font-normal text-accent-warm">
            personally handled.
          </em>
        </>,
      ],
      sub: uniqueHeroSub ?? (
        <>
          Celebrations brought to life in {cityName} — personally designed,
          installed and managed.
        </>
      ),
    },
    whatWeDo: {
      image: imgWhatWeDo,
      imageAlt: `Bespoke event styling in ${cityName} by River Fox Events — pastel balloon installation with organic textures and soft floral accents`,
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
            villages — designing celebrations from scratch around your
            vision, then handling every detail on the day.
          </p>
        </>
      ),
    },
    occasions: {
      image: imgOccasions,
      imageAlt: `Elegant birthday party styling in ${cityName} by River Fox Events — ivory, gold and soft blush balloon installation with floral accents`,
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
            showers and corporate events across {region} — every {cityName}
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
          Every River Fox Events celebration is completely bespoke — bring
          your inspiration and we'll design around it.
        </>
      ),
      mainImage: imgGalleryMain,
      mainImageAlt: `Sage green dinosaur themed children's birthday party styling in ${cityName} by River Fox Events — personalised name sign, balloon garland and lush foliage`,
      images: [
        {
          src: imgGallery1,
          alt: `Christening styling in ${cityName} Surrey by River Fox Events — soft ivory and blush balloon installation with floral accents`,
        },
        {
          src: imgGallery2,
          alt: "Corporate gala styling in Surrey by River Fox Events — elegant tablescape with statement floral centrepiece",
        },
        {
          src: imgGallery3,
          alt: "Children's party styling in Surrey by River Fox Events — fully styled cake table with personalised signage",
        },
      ],
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
          body: "A bespoke theme and colour palette built entirely around your vision.",
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
          body: "Fully managed, start to finish — nothing for you to lift.",
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
        "All pricing is indicative — every proposal is bespoke.",
    },
    localProse: uniqueLocalProse,
    faqs: [
      {
        q: `Do you style events in ${cityName}?`,
        a:
          uniquePresenceAnswer ??
          `Yes — ${cityName} and the surrounding ${region} villages including ${villagesFaq} are areas we work in regularly. We come to you, set everything up and handle the full breakdown once the day is done.`,
      },
      {
        q: "Are you a party planner or a party stylist — what's the difference?",
        a: "We're event stylists — which means we focus entirely on how your celebration looks and feels. We design the concept, source and create every element, install everything on the day, and take it all down afterwards. You get the vision, the wow factor, and none of the logistics. Think of it as having a creative director for your celebration.",
      },
      {
        q: "How far in advance should I book?",
        a:
          uniqueLeadTimeAnswer ??
          `For events in ${cityName} we recommend enquiring at least 6–8 weeks ahead, particularly for weekend dates during school holidays — these book up quickly. That said, always worth asking as last-minute availability does occasionally come up.`,
      },
      {
        q: "Do you travel to my home or venue?",
        a: `Yes — whether it's your home, a village hall, a restaurant, a hotel or a private hire space in or around ${cityName}, we come to you. Setup and breakdown are fully included.`,
      },
      {
        q: `How much does event styling cost in ${cityName}?`,
        a: `Pricing depends on the type of celebration. Our children's party styling, milestone celebration and corporate event pages each show full price tiers. Every ${cityName} event is individually quoted following a short discovery call.`,
      },
      {
        q: "Can I choose my own theme and colours?",
        a: "Every celebration is completely bespoke. Bring your inspiration — a Pinterest board, a colour, a feeling — and we'll design around it. If you're not sure yet, we'll work through it together on a discovery call.",
      },
      {
        q: "What happens on the day?",
        a: "We arrive before your guests and handle all setup. Once everything is in place the space is yours to enjoy completely. We return after the celebration to take everything down — you don't need to think about it.",
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
      mapTitle: `Map of ${cityName} and ${region} — areas covered by River Fox Events`,
    },
    jsonLdAreaServed,
  };
}
