/**
 * Single source of truth for per-route SEO metadata.
 * Consumed by:
 *  - Page components (client-side <head> updates after hydration)
 *  - scripts/inject-meta.mjs (build-time per-route static HTML)
 *  - scripts/generate-sitemap.mjs (sitemap.xml)
 *
 * IMPORTANT: keep "path" matching the React Router path exactly.
 */

export type RouteSEO = {
  path: string;
  title: string;
  description: string;
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

export const ROUTES: RouteSEO[] = [
  {
    path: "/",
    title: "Luxury Event Styling Surrey | Children's Parties, Milestones & Brand | River Fox Events",
    description:
      "Bespoke event styling across Surrey — children's parties, milestone celebrations and corporate brand installations. Personally designed and delivered by Laura. From £600.",
    priority: 1.0,
    changefreq: "monthly",
  },
  {
    path: "/childrens-parties",
    title: "Children's Party Stylist Surrey | River Fox Events",
    description:
      "Bespoke children's party styling across Surrey. Immersive themed parties, balloon installations and full-room transformations from £460 — designed and delivered personally by Laura at River Fox Events.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/milestone-celebrations",
    title: "Milestone Celebration Styling Surrey | River Fox Events",
    description:
      "Bespoke milestone celebration styling across Surrey. 21sts, 30ths, 40ths, 50ths, 70ths, baby showers and anniversaries — personally designed by Laura. From £600.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/corporate-brand-styling",
    title: "Corporate Event Styling Surrey London | River Fox Events",
    description:
      "Design-led corporate event styling and brand installations across Surrey and London. Product launches, retail openings, office events. Trusted by P&G, The Range and more.",
    priority: 0.8,
    changefreq: "monthly",
  },
];

export const findRoute = (path: string): RouteSEO | undefined =>
  ROUTES.find((r) => r.path === path);
