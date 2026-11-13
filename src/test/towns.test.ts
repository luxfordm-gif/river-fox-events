import { describe, expect, it } from "vitest";
import { LOCATIONS } from "@/data/locations";
import { TOWNS } from "@/data/locations/towns";

// The light town list (footer, area links, router) must match the full
// town pages exactly: same towns, same order, same names.
describe("town list", () => {
  it("matches LOCATIONS", () => {
    expect(TOWNS).toEqual(LOCATIONS.map((l) => ({ slug: l.slug, cityName: l.cityName })));
  });
});
