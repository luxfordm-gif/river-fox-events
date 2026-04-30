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
];

export const findRoute = (path: string): RouteSEO | undefined =>
  ROUTES.find((r) => r.path === path);
