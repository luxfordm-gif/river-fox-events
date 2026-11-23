import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Brand and social rules live in the Brand Pack canvas (Matt, 2026-11-23). The River Fox tools draw from one
// config file, tools/river-fox/brand-pack.json, where every block names the canvas board it was copied from.
// This fails if a brand colour or font setting is written back into a tool, or a block loses its board.
const root = join(__dirname, "../../tools/river-fox");
const TOOLS = ["text/thumb.cjs", "text/mkcopy2.cjs", "review/review.cjs", "captions/anim.cjs"];
const pack = JSON.parse(readFileSync(join(root, "brand-pack.json"), "utf8"));

describe("River Fox tools read brand values from brand-pack.json", () => {
  it.each(TOOLS)("%s loads the config and holds no brand colour of its own", (file) => {
    const src = readFileSync(join(root, file), "utf8");
    expect(src).toContain("brand-pack.json");
    const code = src.split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
    expect(code.match(/#(FCFBF8|F7EEE9|191C17|494E46|C69490)/gi) ?? []).toEqual([]);
  });

  it("the cover tool holds no font weight, tracking or handle position of its own", () => {
    const src = readFileSync(join(root, "text/thumb.cjs"), "utf8");
    expect(src.match(/font-weight:\s*\d|letter-spacing:\s*-?[\d.]|@RIVERFOX/g) ?? []).toEqual([]);
  });

  it("every block names the canvas board it came from", () => {
    const missing: string[] = [];
    // a block is covered by its own board or by the board of a block above it
    const walk = (node: unknown, path: string, covered: boolean) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) return;
      const o = node as Record<string, unknown>;
      const here = covered || "board" in o;
      const leaves = Object.entries(o).filter(([k, v]) => k !== "board" && k !== "toolOwn" && (typeof v !== "object" || Array.isArray(v)));
      if (leaves.length && !here) missing.push(path);
      for (const [k, v] of Object.entries(o)) if (k !== "toolOwn") walk(v, `${path}.${k}`, here);
    };
    for (const k of Object.keys(pack).filter((k) => !k.startsWith("_") && typeof pack[k] === "object")) walk(pack[k], k, false);
    expect(missing).toEqual([]);
  });

  it("holds the cover rules from the boards Covers and thumbnails and Light photos and long hooks", () => {
    const c = pack.cover;
    expect(c.type).toMatchObject({ weight: 500, opticalSize: 144, tracking: "-0.008em", wordSpacing: "0.07em" });
    expect(c.longHook).toMatchObject({ moreThanWords: 3, line2Scale: 0.68, line2MinPxAt1080: 96 });
    // one gradient for every photo cover, over the whole image: no light or standard variants, no tool-made threshold
    expect(c.fade.light).toBeUndefined();
    expect(c.fade.standard).toBeUndefined();
    expect(c.fade.toolOwn).toBeUndefined();
    expect(c.fade.stops[0]).toEqual([28, 0]);
    expect(c.fade.stops.at(-1)).toEqual([100, 0.58]);
    expect(c.fade.shadow).toContain("10px rgba(25,28,23,0.45)");
    expect(pack.handle.weight).toBe(500);
    expect(c.layout["9x16"]).toMatchObject({ handleTopY: 1500, handlePx: 28 });
  });

  it("the cover tool has no light-photo test and no fade option", () => {
    const src = readFileSync(join(root, "text/thumb.cjs"), "utf8");
    expect(src).not.toMatch(/lightAbove|fade\[|flag\('fade'/);
    expect(src).toContain("moreThanWords");
  });

  it("holds the settled review and caption numbers", () => {
    expect(pack.review.shortUpToChars).toBe(160);
    expect(pack.review.toolOwn.longFrom).toBeUndefined();
    expect(pack.captions.stress.scale).toBe(1.3);
  });
});
