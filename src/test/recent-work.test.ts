import { describe, expect, it } from "vitest";
import { MAX_ENTRIES, RECENT_WORK, WALL_SIZE, mixed, recentWall, seeded } from "@/data/recentWork";

/**
 * The one latest-work list behind every Recent celebrations / Recent work
 * wall (Matt, 2026-11-24). See src/data/recentWork.ts for how to add a piece.
 */
describe("recent work", () => {
  it("every entry is a gallery photo, listed once", () => {
    // recentWall throws for a photo that isn't in the gallery.
    expect(recentWall({ season: true })).toHaveLength(WALL_SIZE);
    const sources = RECENT_WORK.map((e) => e.source);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it(`keeps at most ${MAX_ENTRIES} entries`, () => {
    expect(RECENT_WORK.length).toBeLessThanOrEqual(MAX_ENTRIES);
  });

  it("every wall is full, in and out of season", () => {
    for (const season of [true, false]) {
      // The /services/ wall leaves out its card photos, so check with those too.
      for (const exclude of [[], ["christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp"]]) {
        const wall = recentWall({ season, exclude });
        expect(wall, `season ${season}`).toHaveLength(WALL_SIZE);
        if (!season) expect(wall.some((p) => p.service === "christmas")).toBe(false);
      }
    }
  });

  it("shows the top of the list, newest first", () => {
    expect(recentWall({ season: true }).map((p) => p.source)).toEqual(RECENT_WORK.slice(0, WALL_SIZE).map((e) => e.source));
  });

  it("leaves out photos the page already shows", () => {
    const first = RECENT_WORK[0].source;
    const wall = recentWall({ season: true, exclude: [first] });
    expect(wall).toHaveLength(WALL_SIZE);
    expect(wall.some((p) => p.source === first)).toBe(false);
  });

  it("mixes the order, keeps every photo, and never puts one service side by side when it can help it", () => {
    for (const season of [true, false]) {
      const wall = recentWall({ season });
      // The fewest side-by-side pairs possible: the biggest group, less one,
      // less everything else that can sit between its photos.
      const sizes = Object.values(
        wall.reduce<Record<string, number>>((n, p) => ({ ...n, [p.service]: (n[p.service] ?? 0) + 1 }), {}),
      );
      const biggest = Math.max(...sizes);
      const fewest = Math.max(0, biggest - 1 - (wall.length - biggest));
      for (let seed = 1; seed <= 50; seed++) {
        const out = mixed(wall, seeded(seed));
        expect([...out.map((p) => p.source)].sort()).toEqual([...wall.map((p) => p.source)].sort());
        let pairs = 0;
        for (let i = 1; i < out.length; i++) if (out[i].service === out[i - 1].service) pairs++;
        expect(pairs, `season ${season}, seed ${seed}`).toBe(fewest);
      }
    }
    const wall = recentWall({ season: true });
    // Different visits, different orders.
    const orders = new Set([1, 2, 3, 4, 5].map((s) => mixed(wall, seeded(s)).map((p) => p.source).join()));
    expect(orders.size).toBeGreaterThan(1);
  });
});
