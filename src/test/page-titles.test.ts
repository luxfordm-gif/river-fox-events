import { describe, expect, it } from "vitest";
import { ROUTES } from "@/seo/routes";

/**
 * Title patterns (Matt, 2026-11-10). Titles live only in src/seo/routes.ts;
 * the build copies each into <title>, og:title and twitter:title, and the
 * pages re-apply the same string after load.
 *   - Service pages: "[Service] in Surrey | River Fox Events" (Commercial
 *                    Christmas drops "in Surrey" to stay under 60 characters)
 *   - Town pages:    "Party Styling in [Town] | River Fox Events", the town
 *                    taken from the URL slug ("walton-on-thames" keeps its hyphens)
 *   - Everything else ends "| River Fox Events" (the /welcome landing page aside)
 */
const SUFFIX = " | River Fox Events";

// Hyphens become spaces, except in names that are hyphenated themselves; the
// ampersand in "Brighton & Hove" matches the page copy (Matt, 2026-11-10).
const TOWN_NAMES: Record<string, string> = {
  "walton-on-thames": "Walton-on-Thames",
  "brighton-and-hove": "Brighton & Hove",
};
const townFromSlug = (slug: string) =>
  TOWN_NAMES[slug] ??
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

describe("page titles", () => {
  it("every town page reads 'Party Styling in [Town] | River Fox Events'", () => {
    const towns = ROUTES.filter((r) => r.path.startsWith("/party-styling-"));
    expect(towns.length).toBeGreaterThan(0);
    for (const r of towns) {
      const town = townFromSlug(r.path.replace("/party-styling-", ""));
      expect(r.title, r.path).toBe(`Party Styling in ${town}${SUFFIX}`);
    }
  });

  it("every page ends with the same suffix", () => {
    for (const r of ROUTES.filter((r) => r.path !== "/welcome")) {
      expect(r.title.endsWith(SUFFIX), `${r.path}: ${r.title}`).toBe(true);
      expect(r.title.indexOf(SUFFIX), r.path).toBe(r.title.length - SUFFIX.length);
    }
  });

  it("no two pages share a title", () => {
    const titles = ROUTES.map((r) => r.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
