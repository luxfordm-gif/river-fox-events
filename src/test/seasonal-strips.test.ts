import { describe, expect, it } from "vitest";
import * as strips from "@/data/inspiration";

/** Christmas photos leave the photo strips on 3 January (Matt, 2026-11-24):
 *  each one is marked `seasonal`, and InstagramStrip drops marked photos once
 *  christmasOn() is off. This catches a Christmas photo added without it. */
describe("seasonal photo strips", () => {
  const lists = Object.entries(strips).filter(([, v]) => Array.isArray(v)) as [string, { src: string; alt: string; seasonal?: boolean }[]][];

  it("every Christmas photo in a strip is marked seasonal", () => {
    for (const [name, list] of lists)
      for (const img of list)
        if (/christmas|xmas|garland.*bauble|bauble/i.test(`${img.src} ${img.alt}`)) expect(img.seasonal, `${name}: ${img.alt}`).toBe(true);
  });

  it("the home and corporate strips each hold three, and keep enough photos after the season", () => {
    for (const name of ["INSPIRATION_HOME", "INSPIRATION_CORPORATE"]) {
      const list = lists.find(([n]) => n === name)![1];
      expect(list.filter((i) => i.seasonal).length, name).toBe(3);
      expect(list.filter((i) => !i.seasonal).length, name).toBeGreaterThanOrEqual(6);
    }
  });
});
