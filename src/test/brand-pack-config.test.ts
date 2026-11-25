import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Brand and social rules live in the Brand Pack canvas (Matt, 2026-11-23). The River Fox tools draw from one
// config file, tools/river-fox/brand-pack.json, where every group says what it is about (its "subject"), never which
// board it sits on: Matt merges and renames boards often (2026-11-25), so naming them made every file go stale.
// This fails if a brand colour or font setting is written back into a tool, a group loses its subject, or a board is named.
const root = join(__dirname, "../../tools/river-fox");
const TOOLS = ["text/thumb.cjs", "text/blocks.cjs", "text/mkcopy2.cjs", "review/review.cjs", "captions/anim.cjs"];
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

  it("every group says what it is about", () => {
    const missing: string[] = [];
    // a block is covered by its own subject or by the subject of a block above it
    const walk = (node: unknown, path: string, covered: boolean) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) return;
      const o = node as Record<string, unknown>;
      const here = covered || "subject" in o;
      const leaves = Object.entries(o).filter(([k, v]) => k !== "subject" && k !== "toolOwn" && (typeof v !== "object" || Array.isArray(v)));
      if (leaves.length && !here) missing.push(path);
      for (const [k, v] of Object.entries(o)) if (k !== "toolOwn") walk(v, `${path}.${k}`, here);
    };
    for (const k of Object.keys(pack).filter((k) => !k.startsWith("_") && typeof pack[k] === "object")) walk(pack[k], k, false);
    expect(missing).toEqual([]);
  });

  it("holds the cover rules (the headline, the soft fade and the handle)", () => {
    const c = pack.cover;
    // text on photos is Instrument Serif Regular, both lines the same size, sized to the words (Brand Pack, 24 Nov 2026)
    expect(c.type).toMatchObject({ font: "Instrument Serif", weight: 400, tracking: "-0.02em" });
    expect(c.longHook).toBeUndefined();
    expect(c.size.fitWidth["9x16"]).toBe(980);
    expect(c.size.maxPx).toBe(310);
    expect(c.capsLine).toMatchObject({ font: "DM Sans", weight: 700, px: 62 });
    // one gradient for every photo cover, over the whole image: no light or standard variants, no tool-made threshold
    expect(c.fade.light).toBeUndefined();
    expect(c.fade.standard).toBeUndefined();
    expect(c.fade.toolOwn).toBeUndefined();
    expect(c.fade.stops[0]).toEqual([28, 0]);
    expect(c.fade.stops.at(-1)).toEqual([100, 0.58]);
    expect(c.fade.shadow).toContain("10px rgba(25,28,23,0.45)");
    expect(pack.handle.weight).toBe(500);
    expect(c.layout["9x16"]).toMatchObject({ handleTopY: 1500, handlePx: 28 });
    expect(pack.videoText).toMatchObject({ font: "Instrument Serif", weight: 400 });
  });

  it("names no Brand Pack board: the skill, the notes and the tools say what to look up, not where it sits", () => {
    expect(readFileSync(join(root, "brand-pack.json"), "utf8")).not.toContain('"board"');
    const named = /\bboards? "[^"]+"|"[^"]{3,60}" board\b|canvas board|pack['’]s board|\.dc\.html/;
    const files = [
      "brand-pack.json", "README.md", "text/thumb.cjs", "text/blocks.cjs", "text/photo-check.cjs", "text/mkcopy2.cjs", "review/review.cjs",
      "captions/anim.cjs", "reels/check.py", "story-builder/story.py", "story-builder/stills.py",
      "instagram-preview/refresh.cjs", "instagram-preview/index.html", "instagram-preview/README.md",
    ].map((f) => join(root, f))
      .concat(["../../.claude/skills/river-fox/SKILL.md", "../../CLAUDE.md", "../../docs/voice.md", "../../tools/photo-grade/src/overlay.mjs"].map((f) => join(__dirname, f)));
    const hits = files.filter((f) => named.test(readFileSync(f, "utf8"))).map((f) => f.split("/").slice(-2).join("/"));
    expect(hits).toEqual([]);
  });

  it("the cover tool has no light-photo test, no fade option and no smaller second line", () => {
    const src = readFileSync(join(root, "text/thumb.cjs"), "utf8");
    expect(src).not.toMatch(/lightAbove|fade\[|line2Scale|longHook/);
  });

  it("holds the settled review and caption numbers", () => {
    expect(pack.review.shortUpToChars).toBe(160);
    expect(pack.review.toolOwn).toBeUndefined();
    expect(pack.review.labelText).toBe("Client review");
    expect(pack.captions.stress.scale).toBe(1.3);
  });

  it("the review tool draws no quote mark", () => {
    const src = readFileSync(join(root, "review/review.cjs"), "utf8");
    expect(src).not.toMatch(/markColour|class="m"/);
  });
});
