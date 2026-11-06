import { describe, expect, it } from "vitest";
import { buildLegacyRedirects, legacyPairs } from "../../scripts/legacy-redirects.mjs";
import { ROUTES } from "@/seo/routes";

describe("old Lollipop Balloons redirects", () => {
  const pairs = new Map(legacyPairs(ROUTES));
  const out = buildLegacyRedirects(ROUTES);

  it("maps the requested old paths", () => {
    expect(pairs.get("/services/balloons")).toBe("/childrens-parties/");
    expect(pairs.get("/services/luxury-kids-parties")).toBe("/childrens-parties/");
    expect(pairs.get("/services/events")).toBe("/milestone-celebrations/");
    expect(pairs.get("/services/corporate")).toBe("/corporate-brand-styling/");
    expect(pairs.get("/about")).toBe("/#about");
    expect(pairs.get("/contact")).toBe("/contact/");
    expect(pairs.get("/location/*")).toBe("/");
  });

  it("covers every location page under both old prefixes", () => {
    const towns = ROUTES.map((r) => r.path.match(/^\/party-styling-(.+)$/)?.[1]).filter(Boolean);
    expect(towns.length).toBeGreaterThan(0);
    for (const town of towns) {
      expect(pairs.get(`/location/balloon-arches-near-${town}`)).toBe(`/party-styling-${town}/`);
      expect(pairs.get(`/location/luxury-children-party-styling-${town}`)).toBe(`/party-styling-${town}/`);
    }
  });

  it("sends old towns without a page to the nearest one", () => {
    expect(pairs.get("/location/balloon-arches-near-redhill")).toBe("/party-styling-reigate/");
  });

  it("forces 301s on www and non-www, ending in a home-page catch-all", () => {
    for (const host of ["https://lollipopballoonssurrey.co.uk", "https://www.lollipopballoonssurrey.co.uk"]) {
      expect(out).toMatch(new RegExp(`^${host}/services/balloons +https://riverfoxevents\\.co\\.uk/childrens-parties/  301!$`, "m"));
      expect(out).toMatch(new RegExp(`^${host}/\\* +https://riverfoxevents\\.co\\.uk/  301!$`, "m"));
    }
    expect(out).not.toMatch(/ 302/);
  });

  it("never redirects /contact on the new domain (it would loop)", () => {
    expect(out).not.toMatch(/^\/contact +/m);
  });
});
