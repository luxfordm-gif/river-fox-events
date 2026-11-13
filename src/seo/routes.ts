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
  /** Scheduled journal article: YYYY-MM-DD it goes live (UK time). Must
   *  match the article's `publishedAt`. Live builds leave the page and its
   *  sitemap entry out until then (scripts/schedule.mjs). */
  publishAt?: string;
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
  // Previously traded as Lollipop Balloons - `alternateName` tells search
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
  sameAs: [
    "https://www.instagram.com/riverfox_events/",
    "https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6",
  ],
};

/**
 * Real customer reviews from Laura's Google profile (historic Lollipop Balloons listing).
 * Shared between the on-page Testimonials carousel and the LocalBusiness JSON-LD so
 * Google sees the same review text it would index from the Google profile itself.
 */
export type Review = { q: string; a: string; href?: string };
/** Every review links to Google: its own share link where there is one,
 *  otherwise Laura's Google reviews page (https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6).
 *  Keep these as plain string literals - scripts/postbuild.mjs reads this
 *  array as text. */
export const REVIEWS: Review[] = [
  {
    // Trimmed for length, her own words kept (Matt, 2026-11-08).
    q: "Laura created a beautiful balloon hoop garland for my son's Christening. We received loads of compliments about it. It really transformed the event hall. I would highly recommend this company for event decor.",
    a: "Samantha",
    href: "https://goo.gl/maps/3U8ddozdYipptXt16?g_st=ac",
  },
  {
    q: "Laura is absolutely fantastic. It was such a smooth and seamless process, from our initial conversation to the design of my son's birthday backdrop and tablescape, and it all brought the wow factor. I highly recommend her and will be using her always.",
    a: "Tolu Balogun",
    href: "https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6",
  },
  {
    q: "Laura designed us the most beautiful balloons and install for our recent business development day in Horley. Everyone commented on them and they were stunning. Efficient, professional and superb with her communication throughout the booking process. I would recommend her to anyone.",
    a: "Suzy Dorran",
    href: "https://maps.app.goo.gl/yae87fhpe2Bxe7VE9",
  },
  {
    q: "Brilliant service by Laura - asked for something suitable for an 18 year old boy with a horse racing theme. Great stack delivered on the day, everyone loved it. Definitely will use again.",
    a: "LP",
    href: "https://maps.app.goo.gl/9ULznEtm7Ps61MVDA",
  },
  {
    q: "I would wholly recommend Laura - she did a fantastic job at supplying the decorations for my daughter's birthday party. The balloons looked absolutely stunning and transformed the room.",
    a: "Sarah Lupinski",
    href: "https://maps.app.goo.gl/fmjXnbTQLsiG36As5",
  },
  {
    q: "An absolutely fabulous display including a balloon garland and kiddies seating area. Would highly recommend and will be reusing Laura.",
    a: "Lee Dunn",
    href: "https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6",
  },
  {
    q: "The lovely Laura did an amazing job at transforming my salon with a gorgeous Christmas balloon display - she really thought about colours that tie in with my branding. I have had so many lovely compliments. My two boys also loved the brilliant Halloween balloons for their party. Can't wait for our next events.",
    a: "Danielle Wayman",
    href: "https://maps.app.goo.gl/an2en7jjetSNTGr27",
  },
  {
    q: "Laura made an amazing display of balloons for my son's 8th birthday back in October. The balloons were still standing in December - such great quality, and an amazing gaming design that my son absolutely loved. Back to her for his 10th birthday soon.",
    a: "Rupi Heron",
    href: "https://maps.app.goo.gl/ZUgNNKsYvjgfjg8G8",
  },
  {
    q: "We had the most beautiful backdrop made for our engagement party - exactly what we asked for. Great service.",
    a: "Emily",
    href: "https://maps.app.goo.gl/N6oQgGKV8R8aLw249",
  },
  {
    q: "I've worked with Laura a couple of times and her work is always impeccable. From decorating my salon to elf arrival balloons, we are always so pleased with everything.",
    a: "Nicola Hewitson",
    href: "https://maps.app.goo.gl/qdUkADHTbZKKj9JM6",
  },
  {
    q: "Amazing balloon stack for my son's first birthday - and with very short notice. Thank you so much Laura.",
    a: "Emily Stimson",
    href: "https://maps.app.goo.gl/WhEBLU9Ax3WcNdQN9",
  },
  {
    q: "The balloon arch was incredible with really good quality balloons ... The arch came down really easily with no marks left.",
    a: "Helen A",
    href: "https://maps.app.goo.gl/pxsFhE37FV92P7i19",
  },
];

export const ROUTES: RouteSEO[] = [
  {
    path: "/",
    // Title trimmed to 60 chars (Matt, 2026-11-09). The old name moved into the
    // description so people still searching "Lollipop Balloons" see it in the
    // result; JSON-LD alternateName carries it too. The brand is named in the
    // description too: an SEO Vendor Insight Igniter run (2026-11-09) found AI
    // didn't pick up "River Fox Events" as an entity when it only read "by Laura".
    title: "Party & Event Styling in Surrey | River Fox Events",
    description:
      "Party and event styling in Surrey by Laura at River Fox Events, formerly Lollipop Balloons: balloon arches, backdrops and whole-room styling, from £300.",
    priority: 1.0,
    changefreq: "monthly",
  },
  {
    path: "/childrens-parties",
    title: "Children's Party Styling in Surrey | River Fox Events",
    description:
      "Kids party decorations across Surrey, from balloon arches to themed backdrops and character props, set up before guests arrive and cleared away afterwards.",
    breadcrumbName: "Children's Parties",
    ogImage: "/og/childrens-parties-surrey.webp",
    service: {
      serviceType: "Children's Party Styling",
      areaServed: ["Surrey", "Cobham", "Weybridge", "Esher", "Oxshott", "London"],
      lowPrice: "300",
    },
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/milestone-celebrations",
    title: "Milestone Celebration Styling in Surrey | River Fox Events",
    description:
      "Milestone birthday decorations in Surrey, from light-up numbers and balloon walls for 40ths and 50ths to christening and baby shower backdrops, from £300.",
    breadcrumbName: "Milestone Celebrations",
    service: {
      serviceType: "Milestone Celebration Styling",
      areaServed: ["Surrey", "Cobham", "Weybridge", "Esher", "Oxshott", "London"],
      lowPrice: "300",
    },
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/corporate-brand-styling",
    title: "Corporate Event Styling in Surrey | River Fox Events",
    description:
      "Corporate event styling in Surrey and London: branded balloon installs, sequin walls and logo backdrops for product launches and award nights, trusted by P&G.",
    breadcrumbName: "Corporate & Brand Styling",
    service: {
      serviceType: "Corporate Event Styling and Brand Installations",
      areaServed: ["Surrey", "London", "Cobham", "Weybridge"],
      lowPrice: "300",
    },
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/balloon-installations",
    title: "Balloon Arches & Installations in Surrey | River Fox Events",
    // "Balloon decorations for parties" (170/mo UK) and "...for weddings" (260/mo)
    // lead the description: SEO Vendor Better Keywords AI, 2026-11-09.
    description:
      "Balloon decorations for parties, weddings and business launches across Surrey: organic arches, garlands, balloon walls and number stacks, installed by Laura.",
    breadcrumbName: "Balloon Installations",
    service: {
      // "Balloon decorations" is the phrase people search (RankLens, 2026-11-09).
      serviceType: "Balloon Decorations and Installations",
      // Same town list as /christmas-door-garlands.
      areaServed: [
        "Surrey", "Cobham", "Esher", "Weybridge", "Oxshott", "Walton-on-Thames",
        "Kingston", "Twickenham", "East Molesey", "Kingswood", "Tadworth", "Banstead", "Epsom", "Leatherhead",
        "Dorking", "Reigate", "Redhill", "Guildford", "Oxted", "Horley",
      ],
      // No lowPrice: balloon-only work is quoted to size.
    },
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/christmas-door-garlands",
    title: "Christmas Door Garlands in Surrey | River Fox Events",
    description:
      "Christmas door garlands in Surrey for homes, porches and shopfronts. Fresh spruce or faux, styled to your paintwork, put up for you and taken down in January.",
    breadcrumbName: "Christmas Door Garlands",
    ogImage: "/og/christmas-door-garlands.webp",
    service: {
      serviceType: "Christmas Door Garland Installation",
      areaServed: [
        "Surrey", "Cobham", "Esher", "Weybridge", "Oxshott", "Walton-on-Thames",
        "Kingston", "Twickenham", "East Molesey", "Kingswood", "Tadworth", "Banstead", "Epsom", "Leatherhead",
        "Dorking", "Reigate", "Redhill", "Guildford", "Oxted", "Horley",
      ],
    },
    priority: 0.8,
    changefreq: "weekly",
  },
  {
    // Business version of the Christmas page, for the Business ad group
    // (Matt, 2026-11-09). Same component, variant="business".
    path: "/commercial-christmas-decorations",
    title: "Commercial Christmas Decorations | River Fox Events",
    description:
      "Commercial Christmas decorations in Surrey: entrance garlands for shops, salons, restaurants and offices, matched to your brand and installed by hand by Laura.",
    breadcrumbName: "Commercial Christmas Decorations",
    ogImage: "/og/commercial-christmas-decorations.webp",
    service: {
      serviceType: "Commercial Christmas Decorations",
      areaServed: [
        "Surrey", "Cobham", "Esher", "Weybridge", "Oxshott", "Walton-on-Thames",
        "Kingston", "Twickenham", "East Molesey", "Kingswood", "Tadworth", "Banstead", "Epsom", "Leatherhead",
        "Dorking", "Reigate", "Redhill", "Guildford", "Oxted", "Horley",
      ],
    },
    priority: 0.7,
    changefreq: "weekly",
  },
  {
    path: "/party-styling-oxted",
    ogImage: "/og/og-fairy-kayla.webp",
    title: "Party Styling in Oxted | River Fox Events",
    description:
      "Party decorations in Oxted, Limpsfield and Hurst Green. Balloon arches, painted name boards and themed props, installed and collected by Laura, from £300.",
    breadcrumbName: "Party Styling Oxted",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Oxted", "Limpsfield", "Hurst Green", "Tandridge", "Godstone", "Caterham", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-cobham",
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Party Styling in Cobham | River Fox Events",
    description:
      "Balloon arches, garlands and photo backdrops for Cobham and Stoke d'Abernon parties. Designed by Laura, set up on the morning and taken down after, from £300.",
    breadcrumbName: "Party Styling Cobham",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Cobham", "Oxshott", "Stoke d'Abernon", "Downside", "Effingham", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-weybridge",
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Party Styling in Weybridge | River Fox Events",
    description:
      "Weybridge birthday decorations, from balloon hoops and light-up numbers to painted sailboards, for homes on St George's Hill and Oatlands Park. From £300.",
    breadcrumbName: "Party Styling Weybridge",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Weybridge", "Walton-on-Thames", "Hersham", "Oatlands", "Whiteley Village", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-esher",
    ogImage: "/og/og-naming-harvey-daisy.webp",
    title: "Party Styling in Esher | River Fox Events",
    description:
      "Party balloons and backdrops in Esher, Claygate and Thames Ditton, from first birthdays to Sandown Park events. Everything set up and cleared away by Laura.",
    breadcrumbName: "Party Styling Esher",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Esher", "Claygate", "Hinchley Wood", "Long Ditton", "Thames Ditton", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-reigate",
    ogImage: "/og/og-naming-harvey-daisy.webp",
    title: "Party Styling in Reigate | River Fox Events",
    description:
      "Fifteen minutes from the studio - children's party styling in Reigate, from first birthdays to big themed celebrations, individually designed by Laura.",
    breadcrumbName: "Party Styling Reigate",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Reigate", "Redhill", "Banstead", "Tadworth", "Betchworth", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-oxshott",
    ogImage: "/og/og-dinosaur-ayaan.webp",
    title: "Party Styling in Oxshott | River Fox Events",
    description:
      "Children's party decorators for at-home parties in Oxshott, with balloon installations, themed backdrops and props. Rated 5.0 on Google, takedown included.",
    breadcrumbName: "Party Styling Oxshott",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Oxshott", "Cobham", "Esher", "Stoke d'Abernon", "Leatherhead", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-guildford",
    ogImage: "/og/og-pastel-safari-anaya.webp",
    title: "Party Styling in Guildford | River Fox Events",
    description:
      "Themed children's parties across Guildford and the GU postcodes - first birthdays to big celebrations, individually designed and installed by Laura.",
    breadcrumbName: "Party Styling Guildford",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Guildford", "Godalming", "Shalford", "Compton", "Merrow", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-walton-on-thames",
    ogImage: "/og/og-pastel-safari-anaya.webp",
    title: "Party Styling in Walton-on-Thames | River Fox Events",
    description:
      "Walton-on-Thames kids party decorations, with balloon garlands, soft-seat picnic setups and themed props for homes in Hersham. Rated 5.0 on Google reviews.",
    breadcrumbName: "Party Styling Walton-on-Thames",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Walton-on-Thames", "Hersham", "Oatlands", "Sunbury", "Shepperton", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-dorking",
    ogImage: "/og/og-dinosaur-ayaan.webp",
    title: "Party Styling in Dorking | River Fox Events",
    description:
      "Children's parties beneath the Surrey Hills - first birthdays to big themed celebrations in Dorking, individually designed by Laura.",
    breadcrumbName: "Party Styling Dorking",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Dorking", "Westcott", "Brockham", "Mickleham", "Wotton", "Surrey"],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-epsom",
    ogImage: "/og/og-jungle-elephant.webp",
    title: "Party Styling in Epsom | River Fox Events",
    description:
      "Birthday party decorators in Epsom, Ashtead and Ewell. Number balloons, character cutouts and photo backdrops, delivered, set up and collected, from £300.",
    breadcrumbName: "Party Styling Epsom",
    service: {
      serviceType: "Event Styling",
      areaServed: [
        "Epsom",
        "Ewell",
        "Ashtead",
        "Leatherhead",
        "Banstead",
        "Tadworth",
        "Surrey",
      ],
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  // Sussex/Kent corridor - closer to the Horley studio than most Surrey
  // towns, anchored by East Grinstead (closest Sussex town).
  {
    path: "/party-styling-east-grinstead",
    ogImage: "/og/og-fairy-kayla.webp",
    title: "Party Styling in East Grinstead | River Fox Events",
    description:
      "Kids' party styling in East Grinstead and the RH19 area - first birthdays through to big themed celebrations, individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-lingfield",
    ogImage: "/og/og-stubbs-gender-reveal.webp",
    title: "Party Styling in Lingfield | River Fox Events",
    description:
      "Village children's parties in Lingfield and along the Surrey/Sussex border - first birthdays to themed celebrations, individually designed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-crawley",
    ogImage: "/og/og-stubbs-gender-reveal.webp",
    title: "Party Styling in Crawley | River Fox Events",
    description:
      "Children's birthday styling in Crawley and across West Sussex, from first birthdays to big themed parties - individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-horsham",
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Party Styling in Horsham | River Fox Events",
    description:
      "Big themed birthdays and first-birthday styling in Horsham - children's parties individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-haywards-heath",
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Party Styling in Haywards Heath | River Fox Events",
    description:
      "Kids' birthday styling across Haywards Heath, Lindfield and Cuckfield - first birthdays to themed parties, individually designed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-tunbridge-wells",
    ogImage: "/og/og-fairy-kayla.webp",
    title: "Party Styling in Tunbridge Wells | River Fox Events",
    description:
      "Kent children's parties in Tunbridge Wells - first birthdays to big themed celebrations, individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-sevenoaks",
    ogImage: "/og/og-jungle-elephant.webp",
    title: "Party Styling in Sevenoaks | River Fox Events",
    description:
      "West Kent children's parties in Sevenoaks - first birthdays to big themed celebrations, individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-forest-row",
    ogImage: "/og/og-pastel-safari-anaya.webp",
    title: "Party Styling in Forest Row | River Fox Events",
    description:
      "Forest-edge children's parties across the Ashdown Forest - first birthdays to big themed celebrations, individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-lewes",
    ogImage: "/og/og-baby-shower-bloom.webp",
    title: "Party Styling in Lewes | River Fox Events",
    description:
      "Themed first birthdays and children's parties in Lewes and the East Sussex villages, individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-brighton-and-hove",
    ogImage: "/og/og-jungle-elephant.webp",
    title: "Party Styling in Brighton & Hove | River Fox Events",
    description:
      "Children's parties styled across Brighton & Hove and East Sussex, from first birthdays to themed celebrations - individually designed and installed by Laura.",
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
      lowPrice: "300",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Laura | River Fox Events",
    description:
      "Get in touch with Laura at River Fox Events - party and event styling across Surrey and London. WhatsApp, email, or send details about your celebration.",
    breadcrumbName: "Contact",
    priority: 0.7,
    changefreq: "yearly",
  },
  {
    path: "/our-work",
    title: "Balloon & Party Styling Gallery, Surrey | River Fox Events",
    description:
      "Real Surrey events styled by Laura: dinosaur and safari birthdays, milestone balloon arches, christenings, corporate galas and Christmas door garlands.",
    breadcrumbName: "Our Work",
    ogImage: "/og/our-work.webp",
    priority: 0.8,
    changefreq: "monthly",
  },
  {
    path: "/journal",
    title: "Journal | River Fox Events",
    description:
      "Notes from the studio - event styling trends, behind-the-scenes from Surrey celebrations, and the thinking behind the rooms I style.",
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
    path: "/journal/balloon-backdrop-ideas-home-parties",
    title: "Balloon Backdrop Ideas for Home Parties | River Fox Events",
    description:
      "Seven balloon backdrop ideas for parties at home in Surrey, from a navy and gold kitchen panel to light-up numbers in a living room and a picnic on the lawn.",
    breadcrumbName: "Balloon backdrop ideas for parties at home",
    ogImage: "/og/balloon-backdrop-ideas-home-parties.webp",
    priority: 0.6,
    changefreq: "monthly",
    publishAt: "2026-12-03",
  },
  {
    path: "/journal/balloon-arch-garland-or-wall",
    title: "Balloon Arch, Garland or Wall? A Guide | River Fox Events",
    description:
      "Choosing between a balloon arch, garland or balloon wall in Surrey? How room size, ceiling height and where guests gather decide it, with advice from Laura.",
    breadcrumbName: "Arch, garland or wall: which suits your room?",
    ogImage: "/og/balloon-arch-garland-or-wall.webp",
    priority: 0.6,
    changefreq: "monthly",
    publishAt: "2026-11-26",
  },
  {
    path: "/journal/questions-to-ask-a-balloon-decorator",
    title: "Questions to Ask a Balloon Decorator | River Fox Events",
    description:
      "Booking a balloon decorator in Surrey? Eight questions to ask first, from what the quote covers to how long arches last indoors and outdoors, answered by Laura.",
    breadcrumbName: "Questions to ask a balloon decorator",
    ogImage: "/og/questions-to-ask-a-balloon-decorator.webp",
    priority: 0.6,
    changefreq: "monthly",
    publishAt: "2026-11-19",
  },
  {
    path: "/journal/christmas-balloon-decorations-surrey",
    title: "Christmas Balloon Decorations, Surrey | River Fox Events",
    description:
      "Christmas balloon decorations for Surrey offices, shops, salons and venues: entrance arches, Merry Christmas panels and party backdrops, set up before you open.",
    breadcrumbName: "Christmas balloons for offices, shops and venues",
    ogImage: "/og/christmas-balloon-decorations-surrey.webp",
    priority: 0.6,
    changefreq: "monthly",
    publishAt: "2026-11-12",
  },
  {
    path: "/journal/50th-birthday-decorations-surrey",
    title: "50th Birthday Decorations in Surrey | River Fox Events",
    description:
      "Ideas for 50th birthday decorations in Surrey, from navy and gold sequin walls to hot pink light-up numbers, designed by Laura and set up before guests arrive.",
    breadcrumbName: "Styling a 50th that feels like them",
    ogImage: "/og/50th-birthday-decorations-surrey.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/shimmer-wall-hire-surrey",
    title: "Shimmer & Sequin Wall Hire in Surrey | River Fox Events",
    description:
      "Shimmer wall and sequin wall hire in Surrey for milestone birthdays, children's parties and office Christmas parties, framed with balloons and set up for you.",
    breadcrumbName: "Shimmer wall hire, styled around your room",
    ogImage: "/og/shimmer-wall-hire-surrey.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/hiring-an-event-stylist-surrey",
    title: "Hiring an Event Stylist in Surrey | River Fox Events",
    description:
      "Hiring an event stylist in Surrey? Here's what's included, from the render and palette to set-up and pack-down, what it costs and why one person does it all.",
    breadcrumbName: "What's included when you hire an event stylist",
    ogImage: "/og/hiring-an-event-stylist-surrey.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/christmas-decorations-surrey",
    title: "Christmas Party Decorations in Surrey | River Fox Events",
    description:
      "Christmas party decorations in Surrey, from fresh or faux doorway garlands for homes and shops to sequin walls and LED balloons for the office Christmas party.",
    breadcrumbName: "Christmas decorations, from front door to dance floor",
    ogImage: "/og/christmas-decorations-surrey.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/baby-shower-themes-2026",
    title: "Baby Shower Themes 2026: 10 Styling Ideas | River Fox Events",
    description:
      "Ten baby shower themes for 2026, from neutral and sage palettes to Little Sunshine and Adventure Awaits. Balloon installations and backdrops across Surrey.",
    breadcrumbName: "Baby shower themes shaping 2026",
    ogImage: "/og/og-baby-shower-bloom.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/dylan-christening-first-birthday",
    title: "Dylan's Christening & First Birthday | River Fox Events",
    description:
      "Dylan's combined christening and first birthday near Walton-on-Thames - a sky-blue and chrome-gold balloon hoop with a personalised backdrop, styled by Laura.",
    breadcrumbName: "Dylan's Christening & First Birthday",
    ogImage: "/og/dylan-christening-first-birthday.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/willy-wonka-fifth-birthday-savanna",
    title: "Savanna's Willy Wonka Fifth Birthday in Surrey | River Fox Events",
    description:
      "Savanna's Willy Wonka fifth birthday in Surrey - purple-and-gold ticket arch, lollipop swirls and a personalised cocoa-bar plinth. Case study from Laura.",
    breadcrumbName: "Savanna's Willy Wonka fifth birthday",
    ogImage: "/og/willy-wonka-fifth-birthday-savanna.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/garden-milestone-styling-surrey",
    title: "Summer Garden Party Styling in Surrey | River Fox Events",
    description:
      "How to style a summer garden party in Surrey so it feels part of the garden, not dropped on top - palette, zones, power, weather and the prep, from Laura.",
    breadcrumbName: "Summer garden parties done right",
    ogImage: "/og/garden-milestone-styling-surrey.webp",
    priority: 0.6,
    changefreq: "monthly",
  },
  {
    path: "/journal/two-wild-safari-second-birthday",
    title:
      "Two Wild: a Safari Second Birthday in Horley, Surrey | River Fox Events",
    description:
      "Behind the scenes of Amiya's 'Two Wild' safari second birthday at Horley Community Centre - concept renders to finished install. Pastel safari styling by Laura at River Fox Events.",
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
      "The six children's party themes Surrey parents are asking for in 2026 - Chateaucore, Bluey done well, soft maximalism, charm-bracelet stations, woodland and Toy Story 5.",
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
      "Behind the scenes of a Surrey children's party - from concept render to finished install. Laura on how design, sourcing and delivery come together at River Fox Events.",
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
  {
    path: "/privacy",
    title: "Privacy & Cookies | River Fox Events",
    description:
      "How River Fox Events handles your information when you enquire, plus the analytics cookie this site uses and how to opt out.",
    breadcrumbName: "Privacy & cookies",
    noindex: true,
  },
  {
    // Test copy of the garland page for a deploy preview (Matt, 2026-11-13).
    // noindex keeps it out of search and the sitemap; nothing links to it.
    path: "/christmas-door-garlands-test",
    title: "Christmas Door Garlands Test | River Fox Events",
    description:
      "Test version of the Christmas door garlands page with reviews, a shorter booking form and a thank-you step, for comparison before any change goes live.",
    noindex: true,
  },
  {
    // Hidden design reference for Matt (2026-11-08): every token, text style
    // and reusable section. noindex keeps it out of search and the sitemap;
    // nothing links to it.
    path: "/style-guide",
    title: "Style Guide | River Fox Events",
    description:
      "Internal design reference for River Fox Events: colour tokens, named text styles, corners, buttons and every reusable section.",
    noindex: true,
  },
];

export const findRoute = (path: string): RouteSEO | undefined =>
  ROUTES.find((r) => r.path === path);
