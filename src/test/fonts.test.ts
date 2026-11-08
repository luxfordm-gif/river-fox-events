import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Google Fonts (css2) answers a badly formed request with a 400 and no fonts,
 * and the site silently falls back to Georgia and the system sans. That
 * happened for months (Matt, 2026-11-08). These are Google's rules for the
 * family spec: axis names in alphabetical order, every tuple with one value
 * per axis, tuples in ascending order.
 */
const css = readFileSync(join(__dirname, "..", "index.css"), "utf8");
const urls = [...css.matchAll(/@import url\("(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"\)/g)].map((m) => m[1]);

const families = urls.flatMap((u) => new URL(u).searchParams.getAll("family"));

describe("Google Fonts request", () => {
  it("loads the site's three fonts", () => {
    const names = families.map((f) => f.split(":")[0]);
    expect(names).toEqual(expect.arrayContaining(["Fraunces", "DM Sans", "JetBrains Mono"]));
  });

  it.each(families.filter((f) => f.includes("@")))("%s follows Google's axis rules", (family) => {
    const [, spec] = family.split(":");
    const [axesPart, tuplesPart] = spec.split("@");
    const axes = axesPart.split(",");
    expect(axes, "axes must be in alphabetical order").toEqual([...axes].sort());

    const tuples = tuplesPart.split(";").map((t) => t.split(","));
    for (const t of tuples) expect(t.length, `tuple "${t}" needs one value per axis`).toBe(axes.length);

    const key = (t: string[]) => t.map((v) => parseFloat(v));
    const sorted = [...tuples].sort((a, b) => {
      const ka = key(a), kb = key(b);
      for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
      return 0;
    });
    expect(tuples, "tuples must be in ascending order").toEqual(sorted);
  });
});
