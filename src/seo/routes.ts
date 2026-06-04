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
  sameAs: ["https://www.instagram.com/lollipop_balloonsx/"],
};

/**
 * Real customer reviews from Laura's Google profile (historic Lollipop Balloons listing).
 * Shared between the on-page Testimonials carousel and the LocalBusiness JSON-LD so
 * Google sees the same review text it would index from the Google profile itself.
 */
export type Review = { q: string; a: string; href?: string };
export const REVIEWS: Review[] = [
  {
    q: "Laura created a beautiful balloon hoop garland for my son's Christening. It was a beautiful piece of decor and we received loads of compliments about it. It really transformed the event hall and was stunning. Laura was really easy to communicate with and had great creative vision for the event. I would highly recommend this company for event decor.",
    a: "Samantha",
    href: "https://goo.gl/maps/3U8ddozdYipptXt16?g_st=ac",
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
    q: "What a brilliant service. The balloon arch was incredible with really good quality balloons. Laura was so speedy at building it - in no time the kitchen was ready for a 15 year old's party. A great backdrop for many selfies. The arch came down really easily with no marks left. Absolutely wonderful - would definitely recommend.",
    a: "Helen A",
    href: "https://maps.app.goo.gl/pxsFhE37FV92P7i19",
  },
];

export const ROUTES: RouteSEO[] = [
  {
    path: "/",
    title: "Party & Event Styling in Surrey | River Fox Events",
    description:
      "Balloon installs, backdrops and styling for parties and events across Surrey and London - tell me your idea and I'll design the room around it, from £460.",
    priority: 1.0,
    changefreq: "monthly",
  },
  {
    path: "/childrens-parties",
    title: "Children's Party Styling in Surrey | River Fox Events",
    description:
      "Balloon installs, backdrops and props for children's parties across Surrey. Bring me the theme and I'll style the room, set up before guests arrive.",
    breadcrumbName: "Children's Parties",
    ogImage: "/og/childrens-parties-surrey.webp",
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
    title: "Milestone Birthday & Celebration Styling | River Fox Events",
    description:
      "Styling for 30ths, 40ths, 50ths and beyond - christenings, anniversaries and baby showers. Balloons, backdrops and a room that feels like the occasion.",
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
    title: "Corporate Event & Brand Styling - Surrey | River Fox Events",
    description:
      "Event styling for launches, award nights and brand activations - installs and signage built around your brand. Trusted by P&G, The Range and Foxhills.",
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
    ogImage: "/og/og-fairy-kayla.webp",
    title: "Children's Party Styling in Oxted | River Fox Events",
    description:
      "Children's party styling in Oxted and across East Surrey - from first birthdays to big themed celebrations, from £460 and individually designed by Laura.",
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
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Cobham Children's Party Styling | River Fox Events",
    description:
      "First birthdays and big themed parties styled across Cobham, Oxshott and Stoke d'Abernon - individually designed and installed by Laura, from £460.",
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
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Weybridge Children's Party Styling | River Fox Events",
    description:
      "Riverside children's parties in Weybridge - first birthdays to big themed celebrations, individually designed and installed by Laura, from £460.",
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
    ogImage: "/og/og-naming-harvey-daisy.webp",
    title: "Esher Children's Party Styling | River Fox Events",
    description:
      "Statement children's parties in Esher and Claygate - first birthdays to big themed celebrations, individually designed and installed by Laura.",
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
    ogImage: "/og/og-naming-harvey-daisy.webp",
    title: "Reigate Children's Party Styling | River Fox Events",
    description:
      "Fifteen minutes from the studio - children's party styling in Reigate, from first birthdays to big themed celebrations, individually designed by Laura.",
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
    ogImage: "/og/og-dinosaur-ayaan.webp",
    title: "Oxshott Children's Party Styling | River Fox Events",
    description:
      "At-home children's parties in Oxshott - first birthdays to big themed celebrations, individually designed and installed by Laura.",
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
    ogImage: "/og/og-pastel-safari-anaya.webp",
    title: "Guildford Children's Party Styling | River Fox Events",
    description:
      "Themed children's parties across Guildford and the GU postcodes - first birthdays to big celebrations, individually designed and installed by Laura.",
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
    ogImage: "/og/og-pastel-safari-anaya.webp",
    title: "Walton-on-Thames Kids' Party Styling | River Fox Events",
    description:
      "Thames-side children's parties in Walton-on-Thames - first birthdays to big themed celebrations, individually designed by Laura.",
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
    ogImage: "/og/og-dinosaur-ayaan.webp",
    title: "Dorking Children's Party Styling | River Fox Events",
    description:
      "Children's parties beneath the Surrey Hills - first birthdays to big themed celebrations in Dorking, individually designed by Laura.",
    breadcrumbName: "Party Styling Dorking",
    service: {
      serviceType: "Event Styling",
      areaServed: ["Dorking", "Westcott", "Brockham", "Mickleham", "Wotton", "Surrey"],
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-epsom",
    ogImage: "/og/og-jungle-elephant.webp",
    title: "Epsom Children's Party Styling | River Fox Events",
    description:
      "North Surrey children's parties in Epsom - first birthdays to big themed celebrations, individually designed and installed by Laura, from £460.",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  // Sussex/Kent corridor - closer to the Horley studio than most Surrey
  // towns, anchored by East Grinstead (closest Sussex town).
  {
    path: "/party-styling-east-grinstead",
    ogImage: "/og/og-fairy-kayla.webp",
    title: "East Grinstead Children's Parties | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-lingfield",
    ogImage: "/og/og-stubbs-gender-reveal.webp",
    title: "Lingfield Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-crawley",
    ogImage: "/og/og-stubbs-gender-reveal.webp",
    title: "Crawley Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-horsham",
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Horsham Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-haywards-heath",
    ogImage: "/og/og-wonka-chocolate-arch.webp",
    title: "Haywards Heath Kids' Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-tunbridge-wells",
    ogImage: "/og/og-fairy-kayla.webp",
    title: "Tunbridge Wells Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-sevenoaks",
    ogImage: "/og/og-jungle-elephant.webp",
    title: "Sevenoaks Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-forest-row",
    ogImage: "/og/og-pastel-safari-anaya.webp",
    title: "Forest Row Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-lewes",
    ogImage: "/og/og-baby-shower-bloom.webp",
    title: "Lewes Children's Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/party-styling-brighton-and-hove",
    ogImage: "/og/og-jungle-elephant.webp",
    title: "Brighton & Hove Kids' Party Styling | River Fox Events",
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
      lowPrice: "460",
    },
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact River Fox Events | Event Stylist Surrey",
    description:
      "Get in touch with Laura at River Fox Events - party and event styling across Surrey and London. WhatsApp, email, or send details about your celebration.",
    breadcrumbName: "Contact",
    priority: 0.7,
    changefreq: "yearly",
  },
  {
    path: "/journal",
    title: "Journal | River Fox Events",
    description:
      "Notes from the studio - event styling trends, behind-the-scenes from Surrey celebrations, and the thinking behind the rooms we style.",
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
    title: "When the garden is the venue | River Fox Events",
    description:
      "Garden milestone styling in Surrey - design moves that make a private-garden 40th, 50th or anniversary feel like a venue, not a marquee. From Laura at River Fox Events.",
    breadcrumbName: "When the garden is the venue",
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
];

export const findRoute = (path: string): RouteSEO | undefined =>
  ROUTES.find((r) => r.path === path);
