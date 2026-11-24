import { describe, expect, it } from "vitest";
import { ROUTES, SITE } from "@/seo/routes";
import { breadcrumbSchema, breadcrumbTrail } from "@/seo/headTags";
import { TOWNS } from "@/data/locations/towns";

/**
 * Visible breadcrumbs (Matt, 2026-11-24):
 *   town pages     Home > Areas I cover > [Town]
 *   service pages  Home > Services > [Service]
 * The visible trail (Breadcrumbs.tsx) and the BreadcrumbList JSON-LD both come
 * from breadcrumbTrail(), so they match; this checks the trails themselves.
 */
const SERVICE_PAGES = [
  "/childrens-parties",
  "/milestone-celebrations",
  "/corporate-brand-styling",
  "/balloon-installations",
  "/christmas-door-garlands",
  "/commercial-christmas-decorations",
];

describe("breadcrumbs", () => {
  it("every town page reads Home > Areas I cover > [Town]", () => {
    expect(TOWNS.length).toBe(19);
    for (const t of TOWNS) {
      const trail = breadcrumbTrail(`/party-styling-${t.slug}`);
      expect(trail, t.slug).toEqual([
        { name: "Home", path: "/" },
        { name: "Areas I cover", path: "/areas-we-cover/" },
        { name: t.cityName, path: `/party-styling-${t.slug}/` },
      ]);
    }
  });

  it("every service page reads Home > Services > [Service]", () => {
    for (const p of SERVICE_PAGES) {
      const trail = breadcrumbTrail(p);
      expect(trail.map((c) => c.path), p).toEqual(["/", "/services/", `${p}/`]);
      expect(trail[1].name).toBe("Services");
    }
  });

  it("the JSON-LD names and links are the visible trail", () => {
    for (const r of ROUTES.filter((r) => r.breadcrumbName)) {
      const trail = breadcrumbTrail(r.path);
      const schema = breadcrumbSchema(r.path) as { itemListElement: { name: string; item: string; position: number }[] };
      expect(schema.itemListElement, r.path).toEqual(
        trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: SITE.url + c.path })),
      );
    }
  });

  it("every parent is a real page", () => {
    for (const r of ROUTES.filter((r) => r.breadcrumbParent)) {
      expect(ROUTES.some((p) => p.path === r.breadcrumbParent && p.breadcrumbName), r.path).toBe(true);
    }
  });
});
