/**
 * Single source of truth for per-route SEO metadata.
 * Consumed by:
 *  - Page components (client-side <head> updates after hydration)
 *  - scripts/postbuild.mjs (build-time per-route static HTML + sitemap)
 *
 * IMPORTANT: keep "path" matching the React Router path exactly. Description
 * strings should sit at 150–160 chars and front-load keyword + location.
 */

export type RouteSEO = {
  path: string;
  title: string;
  description: string;
  /** Visible breadcrumb name (used in BreadcrumbList JSON-LD). Omit for "/". */
  breadcrumbName?: string;
  /** Service schema config. When set, postbuild emits a Service JSON-LD
   *  block with the shared BUSINESS as `provider`. */
  service?: {
    serviceType: string;
    areaServed: string | string[];
    lowPrice?: string;
  };
  ogImage?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  noindex?: boolean;
};

export const SITE = {
  name: "River Fox Events",
  url: "https://riverfoxevents.co.uk",
  defaultOgImage: "/social-share.jpg",
  twitterHandle: "",
};

/**
 * Shared LocalBusiness fields. Used as the `provider` block in every Service
 * schema and as the standalone LocalBusiness on the homepage. Defined once so
 * the data stays consistent across pages.
 */
export const BUSINESS = {
  "@type": "LocalBusiness" as const,
  name: "River Fox Events",
  // Previously traded as Lollipop Balloons — `alternateName` tells search
  // engines the two brands are the same entity so historic links and
  // searches for the old name flow to River Fox Events.
  alternateName: "Lollipop Balloons",
  url: SITE.url,
  image: SITE.url + SITE.defaultOgImage,
  email: "Riverfoxevents@gmail.com",
  telephone: "+44 7872 114191",
  priceRange: "££-£££",
  address: {
    "@type": "PostalAddress" as const,
    streetAddress: "15 Apsley Rd",
    addressLocality: "Horley",
    addressRegion: "Surrey",
    postalCode: "RH6 9RX",
    addressCountry: "GB",
  },
  openingHours: "Mo-Fr 09:00-17:00",
  sameAs: ["https://instagram.com/riverfoxevents"],
};

export const ROUTES: RouteSEO[] = [
  {
    path: "/",
    title: "Luxury Event Stylist Surrey | River Fox Events",
    description:
      "Surrey event stylist for children's parties, milestone celebrations and corporate brand activations across Surrey and London. From £460, designed by Laura.",
    priority: 1.0,
    changefreq: "monthly",
  },
  {
    path: "/childrens-parties",
    title: "Children's Party Stylist Surrey | River Fox Events",
    description:
      "Surrey children's party stylist — bespoke themed parties, balloon installations and full-room transformations from £460, personally designed by Laura.",
    breadcrumbName: "Children's Parties",
    service: {
      serviceType: "Children's Party Styling",
      areaServed: ["Surrey", "Cobham", "Weybridge", "Esher", "Oxshott", "London"],
      lowPrice: "460",
    },
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/milestone-celebrations",
    title: "Milestone Celebration Styling Surrey | River Fox Events",
    description:
      "Surrey milestone celebration stylist — 21sts, 30ths, 40ths, 50ths, 70ths, baby showers and anniversaries. Bespoke styling from £460, designed by Laura.",
    breadcrumbName: "Milestone Celebrations",
    service: {
      serviceType: "Milestone Celebration Styling",
      areaServed: ["Surrey", "Cobham", "Weybridge", "Esher", "Oxshott", "London"],
      lowPrice: "460",
    },
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/corporate-brand-styling",
    title: "Corporate Event Styling Surrey London | River Fox Events",
    description:
      "Corporate event stylist across Surrey and London — bespoke brand installations, product launches, retail openings and office events from £460, by Laura.",
    breadcrumbName: "Corporate & Brand Styling",
    service: {
      serviceType: "Corporate Event Styling and Brand Installations",
      areaServed: ["Surrey", "London", "Cobham", "Weybridge"],
      lowPrice: "460",
    },
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-oxted",
    title: "Party Stylist Oxted Surrey | River Fox Events",
    description:
      "Oxted party stylist — bespoke children's parties, milestones and corporate events across East Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Oxted",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Oxted", "Limpsfield", "Hurst Green", "Tandridge", "Godstone", "Caterham", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-cobham",
    title: "Party Stylist Cobham Surrey | River Fox Events",
    description:
      "Cobham party stylist — bespoke children's parties, milestones and corporate events across Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Cobham",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Cobham", "Oxshott", "Stoke d'Abernon", "Downside", "Effingham", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-weybridge",
    title: "Party Stylist Weybridge Surrey | River Fox Events",
    description:
      "Weybridge party stylist — bespoke children's parties, milestones and corporate events across Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Weybridge",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Weybridge", "Walton-on-Thames", "Hersham", "Oatlands", "Whiteley Village", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-esher",
    title: "Party Stylist Esher Surrey | River Fox Events",
    description:
      "Esher party stylist — bespoke children's parties, milestones and corporate events across Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Esher",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Esher", "Claygate", "Hinchley Wood", "Long Ditton", "Thames Ditton", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-reigate",
    title: "Party Stylist Reigate Surrey | River Fox Events",
    description:
      "Reigate party stylist — bespoke children's parties, milestones and corporate events across Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Reigate",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Reigate", "Redhill", "Banstead", "Tadworth", "Betchworth", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-oxshott",
    title: "Party Stylist Oxshott Surrey | River Fox Events",
    description:
      "Oxshott party stylist — bespoke children's parties, milestones and corporate events across Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Oxshott",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Oxshott", "Cobham", "Esher", "Stoke d'Abernon", "Leatherhead", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-guildford",
    title: "Party Stylist Guildford Surrey | River Fox Events",
    description:
      "Guildford party stylist — bespoke children's parties, milestones and corporate events across Surrey from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Guildford",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Guildford", "Godalming", "Shalford", "Compton", "Merrow", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-walton-on-thames",
    title: "Party Stylist Walton-on-Thames Surrey | River Fox Events",
    description:
      "Walton-on-Thames party stylist — bespoke children's parties, milestones and corporate events from £460. Every detail personally handled by Laura.",
    breadcrumbName: "Party Styling Walton-on-Thames",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Walton-on-Thames", "Hersham", "Oatlands", "Sunbury", "Shepperton", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-dorking",
    title: "Party Stylist Dorking Surrey | River Fox Events",
    description:
      "Dorking party stylist — bespoke children's parties, milestones and corporate events across the Surrey Hills from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling Dorking",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Dorking", "Westcott", "Brockham", "Mickleham", "Wotton", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  // Sussex/Kent corridor — closer to the Horley studio than most Surrey
  // towns, anchored by East Grinstead (closest Sussex town).
  {
    path: "/party-styling-east-grinstead",
    title: "Party Stylist East Grinstead West Sussex | River Fox Events",
    description:
      "East Grinstead event stylist — bespoke children's celebrations, milestones and corporate events across West Sussex from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling East Grinstead",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "East Grinstead",
        "Felbridge",
        "Forest Row",
        "Ashurst Wood",
        "Dormansland",
        "Lingfield",
        "West Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-lingfield",
    title: "Party Stylist Lingfield Surrey | River Fox Events",
    description:
      "Lingfield event stylist — bespoke children's celebrations, milestones and corporate styling on the Surrey/Sussex border from £460. Personally by Laura.",
    breadcrumbName: "Party Styling Lingfield",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Lingfield",
        "Dormansland",
        "Felbridge",
        "Lingfield Park",
        "Crowhurst",
        "Surrey",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-crawley",
    title: "Party Stylist Crawley West Sussex | River Fox Events",
    description:
      "Crawley event stylist — bespoke children's celebrations, milestones and corporate brand activations across West Sussex from £460. Personally by Laura.",
    breadcrumbName: "Party Styling Crawley",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Crawley",
        "Three Bridges",
        "Ifield",
        "Pound Hill",
        "Maidenbower",
        "Tilgate",
        "West Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-horsham",
    title: "Party Stylist Horsham West Sussex | River Fox Events",
    description:
      "Horsham event stylist — bespoke children's celebrations, milestones and corporate styling across West Sussex from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling Horsham",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Horsham",
        "Warnham",
        "Slinfold",
        "Itchingfield",
        "Mannings Heath",
        "Broadbridge Heath",
        "West Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-haywards-heath",
    title: "Party Stylist Haywards Heath West Sussex | River Fox Events",
    description:
      "Haywards Heath event stylist — bespoke children's celebrations, milestones and corporate events across mid-Sussex from £460. Personally by Laura.",
    breadcrumbName: "Party Styling Haywards Heath",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Haywards Heath",
        "Lindfield",
        "Cuckfield",
        "Ardingly",
        "Balcombe",
        "Wivelsfield",
        "West Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-tunbridge-wells",
    title: "Party Stylist Tunbridge Wells Kent | River Fox Events",
    description:
      "Tunbridge Wells event stylist — bespoke children's celebrations, milestones and corporate styling across Kent from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling Tunbridge Wells",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Tunbridge Wells",
        "Rusthall",
        "Southborough",
        "Pembury",
        "Speldhurst",
        "Langton Green",
        "Kent",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-sevenoaks",
    title: "Party Stylist Sevenoaks Kent | River Fox Events",
    description:
      "Sevenoaks event stylist — bespoke children's celebrations, milestones and corporate styling across west Kent from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling Sevenoaks",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Sevenoaks",
        "Riverhead",
        "Otford",
        "Kemsing",
        "Seal",
        "Weald",
        "Kent",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-forest-row",
    title: "Forest Row & Ashdown Forest Event Stylist | River Fox Events",
    description:
      "Forest Row & Ashdown Forest event stylist — bespoke celebrations, milestones and country-house styling across East Sussex from £460. Personally by Laura.",
    breadcrumbName: "Party Styling Forest Row",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Forest Row",
        "Hartfield",
        "Wych Cross",
        "Coleman's Hatch",
        "Withyham",
        "Ashdown Forest",
        "East Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-lewes",
    title: "Party Stylist Lewes East Sussex | River Fox Events",
    description:
      "Lewes event stylist — bespoke children's celebrations, milestones and country-house styling across East Sussex from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling Lewes",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Lewes",
        "Cliffe",
        "Kingston near Lewes",
        "Rodmell",
        "Glynde",
        "Ringmer",
        "East Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-brighton-and-hove",
    title: "Brighton & Hove Event Stylist | River Fox Events",
    description:
      "Brighton & Hove event stylist — bespoke children's celebrations, milestones and brand activations across the city from £460. Personally handled by Laura.",
    breadcrumbName: "Party Styling Brighton & Hove",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Brighton",
        "Hove",
        "Kemp Town",
        "Preston Park",
        "Rottingdean",
        "Saltdean",
        "East Sussex",
      ],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/journal",
    title: "Journal | River Fox Events",
    description:
      "Notes from the studio — event styling trends, behind-the-scenes from Surrey celebrations, and the thinking behind the rooms we style.",
    ogImage: "/og/beyond-the-balloon-arch.webp",
    priority: 0.7,
    changefreq: "weekly",
  },
  {
    path: "/journal/two-wild-safari-second-birthday",
    title:
      "Two Wild: a Safari Second Birthday in Horley, Surrey | River Fox Events",
    description:
      "Behind the scenes of Amiya's 'Two Wild' safari second birthday at Horley Community Centre — concept renders to finished install. Pastel safari styling by Laura at River Fox Events.",
    ogImage: "/og/two-wild-safari-second-birthday.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/childrens-party-themes-2026",
    title:
      "Children's Party Themes 2026: Six Trending Briefs from a Surrey Studio | River Fox Events",
    description:
      "The six children's party themes Surrey parents are asking for in 2026 — Chateaucore, Bluey done well, soft maximalism, charm-bracelet stations, woodland and Toy Story 5.",
    ogImage: "/og/childrens-party-themes-2026.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/from-design-to-delivery",
    title:
      "From Design to Delivery: Behind a Surrey Children's Party | River Fox Events",
    description:
      "Behind the scenes of a Surrey children's party — from concept render to finished install. Laura on how design, sourcing and delivery come together at River Fox Events.",
    ogImage: "/og/from-design-to-delivery.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/beyond-the-balloon-arch",
    title:
      "Beyond the Balloon Arch: 2026 Surrey Event Styling Trends | River Fox Events",
    description:
      "The balloon arch is no longer the headline. A note from Laura on layered tablescapes, ceiling drapery and the 2026 trends shaping Surrey celebrations.",
    ogImage: "/og/beyond-the-balloon-arch.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/lollipop-balloons-to-river-fox-events",
    title:
      "Lollipop Balloons is now River Fox Events | River Fox Events",
    description:
      "Lollipop Balloons is now River Fox Events. Same designer (Laura), same Surrey studio, new name reflecting the wider work we now do.",
    ogImage: "/og/lollipop-balloons-to-river-fox-events.webp",
    // No breadcrumbName here — Article.tsx injects a 3-level
    // BreadcrumbList (Home → Journal → article) at runtime, which
    // postbuild leaves alone.
    priority: 0.6,
    changefreq: "yearly",
  },
  {
    // Transitional landing page for redirects from the old Lollipop
    // Balloons domain. noindex so it doesn't compete with the homepage
    // in search; still prerendered so visitors land on real content.
    path: "/welcome",
    title:
      "Welcome to River Fox Events | Formerly Lollipop Balloons",
    description:
      "Lollipop Balloons is now River Fox Events. Same designer, same Surrey studio, new name reflecting the wider work we now do.",
    ogImage: "/og/lollipop-balloons-to-river-fox-events.webp",
    noindex: true,
  },
];

export const findRoute = (path: string): RouteSEO | undefined =>
  ROUTES.find((r) => r.path === path);
