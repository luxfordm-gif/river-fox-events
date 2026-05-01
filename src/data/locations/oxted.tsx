import type { LocationConfig } from "./types";
import imgWhatWeDo from "@/assets/cp-celebrations.webp";
import imgOccasions from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgGalleryMain from "@/assets/dinosaur-themed-birthday-party-surrey.webp";
import imgGallery1 from "@/assets/christening-blessing-styling-surrey.webp";
import imgGallery2 from "@/assets/corporate-gala-styling-surrey.webp";
import imgGallery3 from "@/assets/cp-included.webp";
import imgGallery4 from "@/assets/hero-2.webp";

const oxted: LocationConfig = {
  slug: "oxted",
  cityName: "Oxted",
  seoTitle: "Party Stylist Oxted Surrey | River Fox Events",
  seoDescription:
    "Oxted party stylist — bespoke children's parties, milestones and corporate events across East Surrey from £460. Every detail personally handled by Laura.",
  hero: {
    lines: [
      <>Your Oxted party stylist.</>,
      <>
        Every detail,{" "}
        <em className="italic font-normal text-accent-warm">
          personally handled.
        </em>
      </>,
    ],
    sub: (
      <>
        Celebrations brought to life in Oxted — personally designed, installed
        and managed.
      </>
    ),
  },
  whatWeDo: {
    image: imgWhatWeDo,
    imageAlt:
      "Bespoke event styling in Oxted by River Fox Events — pastel balloon installation with organic textures and soft floral accents",
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
        <p>
          We work with families and businesses across Oxted, Limpsfield, Hurst
          Green and the surrounding villages — designing celebrations from
          scratch around your vision, then handling every detail on the day.
        </p>
      </>
    ),
  },
  occasions: {
    image: imgOccasions,
    imageAlt:
      "Elegant birthday party styling in Oxted by River Fox Events — ivory, gold and soft blush balloon installation with floral accents",
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
        <p>
          Children's birthdays, christenings, milestone moments, baby showers
          and corporate events across East Surrey — every Oxted celebration
          shaped around the people, the venue and the feeling of the day.
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
        Every River Fox Events celebration is completely bespoke — bring your
        inspiration and we'll design around it.
      </>
    ),
    mainImage: imgGalleryMain,
    mainImageAlt:
      "Sage green dinosaur themed children's birthday party styling in Oxted by River Fox Events — personalised name sign, balloon garland and lush foliage",
    images: [
      {
        src: imgGallery1,
        alt: "Christening styling in Oxted Surrey by River Fox Events — soft ivory and blush balloon installation with floral accents",
      },
      {
        src: imgGallery2,
        alt: "Corporate gala styling in Surrey by River Fox Events — elegant tablescape with statement floral centrepiece",
      },
      {
        src: imgGallery3,
        alt: "Children's party styling in Surrey by River Fox Events — fully styled cake table with personalised signage",
      },
      {
        src: imgGallery4,
        alt: "Bespoke celebration styling in Surrey by River Fox Events — sculptural balloon installation and dressed party space",
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
        We arrive before your first guest and leave once everything is cleared.
        You do nothing except enjoy the day.
      </>
    ),
  },
  pricing: {
    heading: (
      <>
        Beautifully styled celebrations in Oxted{" "}
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
      "Every event is individually quoted following a short discovery call. Get in touch with your vision and we'll come back to you personally within 48 hours.",
  },
  faqs: [
    {
      q: "Do you style events in Oxted?",
      a: "Yes — Oxted and the surrounding East Surrey villages including Limpsfield, Hurst Green, Tandridge, Godstone and Caterham are areas we work in regularly. We come to you, set everything up and handle the full breakdown once the day is done.",
    },
    {
      q: "Are you a party planner or a party stylist — what's the difference?",
      a: "We're event stylists — which means we focus entirely on how your celebration looks and feels. We design the concept, source and create every element, install everything on the day, and take it all down afterwards. You get the vision, the wow factor, and none of the logistics. Think of it as having a creative director for your celebration.",
    },
    {
      q: "How far in advance should I book?",
      a: "For events in Oxted we recommend enquiring at least 6–8 weeks ahead, particularly for weekend dates during school holidays — these book up quickly. That said, always worth asking as last-minute availability does occasionally come up.",
    },
    {
      q: "Do you travel to my home or venue?",
      a: "Yes — whether it's your home, a village hall, a restaurant, a hotel or a private hire space in or around Oxted, we come to you. Setup and breakdown are fully included.",
    },
    {
      q: "How much does event styling cost in Oxted?",
      a: "Event styling in Oxted starts from £460. Most full celebrations with multiple styling elements fall in the £1,200–£2,000 range. Every event is individually quoted — get in touch for a bespoke quote based on your vision.",
    },
    {
      q: "Can I choose my own theme and colours?",
      a: "Every celebration is completely bespoke. Bring your inspiration — a Pinterest board, a colour, a feeling — and we'll design around it. If you're not sure yet, we'll work through it together on a discovery call.",
    },
    {
      q: "What happens on the day?",
      a: "We arrive before your guests and handle all setup. Once everything is in place the space is yours to enjoy completely. We return after the celebration to take everything down — you don't need to think about it.",
    },
  ],
  nearby: {
    eyebrow: "Where we work",
    heading: (
      <>
        Styling celebrations across{" "}
        <em className="italic font-light text-accent-warm">
          Oxted and East Surrey.
        </em>
      </>
    ),
    intro: (
      <>
        Based in Surrey, River Fox Events styles celebrations across Oxted,
        Limpsfield, Hurst Green, Tandridge, Godstone, Caterham, Redhill,
        Reigate, Cobham, Esher, Weybridge, Oxshott, Guildford and into London.
        Not sure if we cover your area? Just ask.
      </>
    ),
    areas: [
      "Oxted",
      "Limpsfield",
      "Hurst Green",
      "Tandridge",
      "Godstone",
      "Caterham",
      "Redhill",
      "Reigate",
      "Cobham",
      "Esher",
      "Weybridge",
      "Oxshott",
    ],
    mapQuery: "Oxted,Surrey,England,UK&z=10",
    mapTitle:
      "Map of Oxted and East Surrey — areas covered by River Fox Events",
  },
  jsonLdAreaServed: [
    "Oxted",
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Surrey",
  ],
};

export default oxted;
