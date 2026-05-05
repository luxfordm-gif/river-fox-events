import { BUSINESS, REVIEWS, SITE, findRoute, type RouteSEO } from "./routes";

/**
 * Client-side <head> updates after hydration.
 *
 * Single helper used by every page so meta tags, canonical link and JSON-LD
 * are emitted consistently. Source descriptions live in routes.ts — pages
 * never hard-code SEO copy.
 */

type SchemaJson = Record<string, unknown>;

const upsertMeta = (
  name: string,
  content: string,
  attr: "name" | "property" = "name"
) => {
  let el = document.querySelector(
    `meta[${attr}="${name}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let link = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

export const upsertJsonLd = (id: string, data: SchemaJson) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.remove();
};

const canonicalPath = (path: string) =>
  path === "/" ? "/" : path.endsWith("/") ? path : path + "/";

export const applyMeta = (route: Pick<RouteSEO, "title" | "description" | "ogImage" | "path">) => {
  const ogImage = SITE.url + (route.ogImage ?? SITE.defaultOgImage);
  const url = SITE.url + canonicalPath(route.path);

  document.title = route.title;
  upsertMeta("description", route.description);
  upsertMeta("og:title", route.title, "property");
  upsertMeta("og:description", route.description, "property");
  upsertMeta("og:type", "website", "property");
  upsertMeta("og:image", ogImage, "property");
  upsertMeta("og:url", url, "property");
  upsertMeta("og:site_name", SITE.name, "property");
  upsertMeta("twitter:card", "summary_large_image");
  upsertMeta("twitter:title", route.title);
  upsertMeta("twitter:description", route.description);
  upsertMeta("twitter:image", ogImage);
  upsertCanonical(url);
};

/** Build a BreadcrumbList from routes.ts. Returns null for the homepage. */
export const breadcrumbSchema = (path: string): SchemaJson | null => {
  if (path === "/") return null;
  const route = findRoute(path);
  if (!route?.breadcrumbName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.url + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.breadcrumbName,
        item: SITE.url + canonicalPath(path),
      },
    ],
  };
};

/**
 * Service schema with the shared LocalBusiness as `provider`. `areaServed`
 * lives on the Service only — never duplicated on the provider.
 */
export const serviceSchema = (params: {
  serviceType: string;
  description: string;
  areaServed: string | string[];
  lowPrice?: string;
}): SchemaJson => ({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: params.serviceType,
  description: params.description,
  areaServed: params.areaServed,
  provider: BUSINESS,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    reviewCount: REVIEWS.length,
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.a },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    reviewBody: r.q,
    ...(r.href ? { url: r.href } : {}),
  })),
  ...(params.lowPrice
    ? {
        offers: {
          "@type": "AggregateOffer",
          lowPrice: params.lowPrice,
          priceCurrency: "GBP",
        },
      }
    : {}),
});

/** Build a Service schema directly from a RouteSEO entry. */
export const routeServiceSchema = (route: RouteSEO): SchemaJson | null => {
  if (!route.service) return null;
  return serviceSchema({
    serviceType: route.service.serviceType,
    description: route.description,
    areaServed: route.service.areaServed,
    lowPrice: route.service.lowPrice,
  });
};

/**
 * ContactPage schema — tells Google "this URL is the contact page for the
 * shared LocalBusiness", reinforcing the NAP signal and entity association.
 */
export const contactPageSchema = (path: string, description: string): SchemaJson => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: SITE.url + canonicalPath(path),
  name: `Contact ${SITE.name}`,
  description,
  mainEntity: BUSINESS,
});

export const localBusinessSchema = (description: string): SchemaJson => ({
  "@context": "https://schema.org",
  ...BUSINESS,
  description,
  areaServed: [
    "Surrey",
    "London",
    "Cobham",
    "Weybridge",
    "Esher",
    "Oxshott",
    "Reigate",
    "Horley",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    reviewCount: REVIEWS.length,
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.a },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    reviewBody: r.q,
    ...(r.href ? { url: r.href } : {}),
  })),
});
