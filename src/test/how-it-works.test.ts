import { describe, expect, it } from "vitest";
import { SCENARIOS, TOWN_SCENARIOS, scenarioForTown } from "@/data/howItWorks";
import { TOWNS } from "@/data/locations/towns";

/**
 * "How it works" scenarios (src/data/howItWorks.ts): each is one example party
 * told as a chat, a hand-drawn concept and a finished photo. These checks keep
 * the data complete and the alt text within the site's rules.
 */
const scenarios = Object.values(SCENARIOS);
const firstWords = (alt: string) => alt.toLowerCase().split(/\s+/).slice(0, 5).join(" ");

describe("how it works scenarios", () => {
  it("every scenario has a chat, a sketch and a photo", () => {
    for (const s of scenarios) {
      expect(s.chat.length, `${s.id} chat`).toBe(4);
      expect(s.chat[0].side, `${s.id} starts with the client`).toBe("them");
      expect(s.chat.some((l) => l.side === "me"), `${s.id} has Laura's reply`).toBe(true);
      expect(s.sketch.src, `${s.id} sketch`).toBeTruthy();
      expect(s.sketch.srcSet, `${s.id} sketch srcset`).toBeTruthy();
      expect(s.photo.src, `${s.id} photo`).toBeTruthy();
    }
  });

  it("alt text is set and no longer than 125 characters", () => {
    for (const s of scenarios) {
      for (const pic of [s.sketch, s.photo]) {
        expect(pic.alt.length, `${s.id}: ${pic.alt}`).toBeGreaterThan(10);
        expect(pic.alt.length, `${s.id}: ${pic.alt}`).toBeLessThanOrEqual(125);
      }
    }
  });

  it("no two different sketches open their alt text with the same five words", () => {
    const seen = new Map<string, string>();
    for (const s of scenarios) {
      const key = firstWords(s.sketch.alt);
      expect(seen.has(key), `${s.id} repeats "${key}" from ${seen.get(key)}`).toBe(false);
      seen.set(key, s.id);
    }
  });

  it("chat copy follows the voice rules: no em dashes, exclamation marks or emoji", () => {
    for (const s of scenarios) {
      for (const line of s.chat) {
        expect(line.text, `${s.id}: ${line.text}`).not.toMatch(/[—!]|\p{Extended_Pictographic}/u);
      }
    }
  });

  it("town pages take the three town scenarios in turn, so neighbouring towns differ", () => {
    expect(TOWN_SCENARIOS.length).toBe(3);
    TOWNS.forEach((_, i) => {
      expect(scenarioForTown(i)).toBe(TOWN_SCENARIOS[i % 3]);
      if (i > 0) expect(scenarioForTown(i).id).not.toBe(scenarioForTown(i - 1).id);
    });
  });
});
