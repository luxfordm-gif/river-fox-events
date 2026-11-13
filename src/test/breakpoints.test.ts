import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * One phone breakpoint (Matt, 2026-11-13). Phones are up to 767px and
 * tablets start at 768px, the same as Tailwind's `md:`. Some rules used to
 * switch at 760 / 761px, so between 761 and 767px half the page was laid out
 * for a phone and half for a tablet. This fails if a stylesheet uses any
 * other breakpoint between 700 and 799px.
 */
const SRC = join(__dirname, "..");
const sheets = [join(SRC, "index.css"), ...readdirSync(join(SRC, "styles")).filter((f) => f.endsWith(".css")).map((f) => join(SRC, "styles", f))];

describe("breakpoints", () => {
  it("phone/tablet switch is always 767 / 768px", () => {
    const bad: string[] = [];
    for (const f of sheets) {
      for (const m of readFileSync(f, "utf8").matchAll(/@media[^{]*?(max|min)-width:\s*(7\d\d)px/g)) {
        const ok = (m[1] === "max" && m[2] === "767") || (m[1] === "min" && m[2] === "768");
        if (!ok) bad.push(`${f.split("/src/")[1]}: ${m[0]}`);
      }
    }
    expect(bad, `Use (max-width: 767px) / (min-width: 768px):\n${bad.join("\n")}`).toEqual([]);
  });
});
