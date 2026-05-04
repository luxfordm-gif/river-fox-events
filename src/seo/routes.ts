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
  sameAs: ["https://www.instagram.com/lollipop_balloonsx/"],
};

export const ROUTES: RouteSEO[] = [
  {
    path: "/",
    title: "Event Styling Studio in Surrey & London | River Fox Events",
    description:
      "Trusted by Surrey families and brand teams to design celebrations that genuinely stand out. Children's parties, milestones and corporate events, by Laura.",
    priority: 1.0,
    changefreq: "monthly",
  },
  {
    path: "/childrens-parties",
    title: "Children's Party Stylist Surrey | River Fox Events",
    description:
      "Themed children's parties Surrey parents actually relax at. Full-room styling, balloon installations, tablescapes — every detail handled by Laura.",
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
    title: "Milestone Birthday & Anniversary Styling | River Fox Events",
    description:
      "Milestone birthdays that feel as significant as the day itself. 21sts, 40ths, 70ths, baby showers, anniversaries — designed personally by Laura, Surrey.",
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
    title: "Corporate Event & Brand Stylist Surrey | River Fox Events",
    description:
      "Corporate events that elevate the brand they represent. Activations, launches and openings styled by Laura — trusted by P&G, The Range and Foxhills.",
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
      "Statement styling for celebrations at Titsey Place, Limpsfield and across Oxted. Parties and milestones from £460, personally by Laura.",
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
    title: "Luxury Event Styling in Cobham | River Fox Events",
    description:
      "Studio-led styling at Painshill Park, Stoke d'Abernon and across Cobham. Statement parties and milestones from £460, personally by Laura.",
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
      "Statement balloon installations and milestone celebrations in Weybridge from £460. Personally designed and installed by Laura.",
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
    title: "Esher Party & Event Stylist | River Fox Events",
    description:
      "Personally designed celebrations at Sandown Park, Claygate and across Esher. Considered parties and milestones, installed and managed by Laura.",
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
    title: "Reigate Party & Event Stylist | River Fox Events",
    description:
      "Layered tablescapes, milestone parties and at-home celebrations in Reigate. Personally designed and installed by Laura.",
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
      "Themed children's parties, milestones and balloon installations in Oxshott. Personally designed and installed by Laura.",
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
    title: "Guildford Party & Event Stylist | River Fox Events",
    description:
      "Ceiling drapery, balloon installations and milestone parties in Guildford from £460. Personally designed and installed by Laura.",
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
    title: "Walton-on-Thames Party & Event Stylist | River Fox Events",
    description:
      "Country-house and at-home celebrations at Oatlands, Hersham and across Walton-on-Thames. Considered styling personally designed by Laura.",
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
      "Editorial event styling around Denbies, Westcott and the Surrey Hills near Dorking. Layered, considered celebrations personally designed by Laura.",
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
    title: "Party Stylist East Grinstead Sussex | River Fox Events",
    description:
      "Full-service styling delivered to East Grinstead and across West Sussex. From design through to clear-down, personally handled by Laura.",
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
    title: "Lingfield Party & Event Stylist | River Fox Events",
    description:
      "Considered, personal styling at Lingfield Park, Dormansland and across the Surrey/Sussex border. Parties and milestones designed by Laura.",
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
    title: "Crawley Party & Event Stylist | River Fox Events",
    description:
      "Easy reach across West Sussex from Crawley — full-service event styling for celebrations from concept to clear-down, personally by Laura.",
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
      "Statement balloon installations, milestone parties and at-home styling in Horsham. Personally designed and installed by Laura.",
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
    title: "Haywards Heath Party & Event Stylist | River Fox Events",
    description:
      "Studio-led styling across mid-Sussex, from Haywards Heath to Lindfield and Cuckfield. Full-service event styling from £460, by Laura.",
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
    title: "Luxury Event Styling in Tunbridge Wells | River Fox Events",
    description:
      "Studio-led event styling in Tunbridge Wells — milestone parties, brand activations and at-home celebrations across Kent. Personally by Laura.",
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
      "West Kent events, fully managed from setup to breakdown — including Sevenoaks, Riverhead, Otford and Seal. Personally designed by Laura.",
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
    title: "Party Stylist Forest Row East Sussex | River Fox Events",
    description:
      "East Sussex country-house events, fully managed from setup to breakdown — including Forest Row, Hartfield and Ashdown Forest, by Laura.",
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
    title: "Editorial Event Styling Lewes | River Fox Events",
    description:
      "A short drive from Lewes — full-service East Sussex country-house celebrations. From design to clear-down, personally handled by Laura.",
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
    title: "Party Stylist Brighton & Hove | River Fox Events",
    description:
      "A short drive from Brighton — full-service event styling across Brighton, Hove and East Sussex. From design to breakdown, by Laura.",
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
    breadcrumbName: "Journal",
    ogImage: "/og/beyond-the-balloon-arch.webp",
    priority: 0.7,
    changefreq: "weekly",
  },
  // Journal articles: breadcrumbName is the article title shown in the
  // 3-level BreadcrumbList (Home → Journal → Article). postbuild.mjs picks
  // up the /journal/* prefix and emits the 3-level chain into static HTML
  // using the same script id as Article.tsx, so the runtime injection and
  // the static one don't double up.
  {
    path: "/journal/two-wild-safari-second-birthday",
    title:
      "Two Wild: a Safari Second Birthday in Horley, Surrey | River Fox Events",
    description:
      "Behind the scenes of Amiya's 'Two Wild' safari second birthday at Horley Community Centre — concept renders to finished install. Pastel safari styling by Laura at River Fox Events.",
    breadcrumbName: "Two Wild: a safari second birthday in Horley",
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
    breadcrumbName: "Six children's party themes shaping 2026",
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
    breadcrumbName: "From design to delivery",
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
    breadcrumbName: "Beyond the balloon arch",
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
    breadcrumbName: "Lollipop Balloons is now River Fox Events",
    ogImage: "/og/lollipop-balloons-to-river-fox-events.webp",
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
