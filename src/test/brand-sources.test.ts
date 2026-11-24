import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// The Brand Pack artifact is the brand book: there is no brand PDF, as a source or as a fallback, and no note, skill or
// tool quotes a version of the pack (Matt, 2026-11-24). The voice rules live only in docs/voice.md.
// This fails if a PDF source or a pack or book version number comes back.
const root = join(__dirname, "../..");
const PLACES = ["CLAUDE.md", "README.md", "docs", "src/data/articles/AUTHORING.md", "src/data/articles/NEW-ARTICLE.md", ".claude/skills/river-fox", "tools/river-fox", "tools/photo-grade/README.md", "tools/photo-grade/src"];
const TEXT = /\.(md|cjs|mjs|js|json|py|sh|html)$/;
const files = (p: string): string[] => {
  const full = join(root, p);
  if (!statSync(full, { throwIfNoEntry: false })) return [];
  if (statSync(full).isFile()) return [full];
  return readdirSync(full).filter((n) => n !== "node_modules" && n !== "__pycache__").flatMap((n) => files(join(p, n)));
};
const lines = PLACES.flatMap(files).filter((f) => TEXT.test(f)).flatMap((f) =>
  readFileSync(f, "utf8").split("\n").map((text, i) => ({ where: `${relative(root, f)}:${i + 1}`, text })));

describe("brand rules come from the live Brand Pack, never a PDF or a version", () => {
  it("no PDF is named as a brand source", () => {
    const bad = lines.filter(({ text }) => /\bpdfs?\b/i.test(text) && !/no (brand )?pdf|nothing reads|pdfs until then/i.test(text));
    expect(bad.map((l) => l.where)).toEqual([]);
  });

  it("no pack or book version number is quoted", () => {
    const bad = lines.filter(({ text }) => /(brand ?book|brand ?pack|social pack|pack|book)\s*(v|version\s*)\d+(\.\d+)?/i.test(text) || /\bv1\.\d{2}\b/.test(text));
    expect(bad.map((l) => l.where)).toEqual([]);
  });

  it("the voice rules have one home that the notes point to", () => {
    expect(readFileSync(join(root, "docs/voice.md"), "utf8")).toContain("only place the voice rules are written");
    for (const f of ["CLAUDE.md", ".claude/skills/river-fox/SKILL.md", "src/data/articles/AUTHORING.md"]) {
      expect(readFileSync(join(root, f), "utf8")).toContain("docs/voice.md");
    }
  });
});
