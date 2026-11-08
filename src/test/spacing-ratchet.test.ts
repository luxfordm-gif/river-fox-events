import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Spacing ratchet (Matt, 2026-11-08): "when I say increase, decrease or next
 * size down, don't hard-code it - it needs to be a system".
 *
 * Spacing has tokens in src/index.css (--section-y, --section-gap,
 * --gap-heading-text, --gap-heading-content, --gap-text-content,
 * --gap-label-title, --gap-title-body, --gutter ...) and classes that use them
 * (.heading-to-text, .heading-to-content, .text-to-content, .label-to-title,
 * .title-to-text, the same-background section rule). Older one-off values
 * still exist; this test counts them and fails if the count goes UP, so new
 * work can only use tokens. When you move a value onto a token, lower the
 * baseline below to lock the gain in.
 */
const BASELINE = {
  stylesheetRawSpacing: 134, // padding / margin / gap declarations with a px, rem, vw or vh value and no var()
  arbitrarySpacingClasses: 12, // Tailwind pt-[134px], gap-[56px] ...
  inlineSpacingStyles: 6, // style={{ paddingTop: ... }}
};

const SRC = join(__dirname, "..");
const walk = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "ui" || name === "test" ? [] : walk(path, ext);
    return ext.test(name) ? [path] : [];
  });

const sheets = [join(SRC, "index.css"), ...walk(join(SRC, "styles"), /\.css$/)].filter((f) => !f.endsWith("style-guide.css"));
const components = walk(SRC, /\.tsx$/).filter((f) => !f.endsWith("StyleGuide.tsx"));

const DECL = /(?<![\w-])(padding|margin|gap|row-gap|column-gap|padding-(?:top|bottom|left|right)|margin-(?:top|bottom|left|right))\s*:\s*([^;}]+)/g;
const ARBITRARY = /(?<![\w-])!?(?:[a-z]+:)*!?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-y|space-x)-\[[^\]]*\d+(?:px|rem)[^\]]*\]/g;
const INLINE = /\b(padding|margin|gap)(Top|Bottom|Left|Right)?\s*:\s*["'`]?\d/g;

const count = (files: string[], re: RegExp, keep: (m: RegExpMatchArray) => boolean = () => true) =>
  files.reduce((n, f) => {
    const text = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    return n + [...text.matchAll(re)].filter(keep).length;
  }, 0);

describe("spacing: no new hard-coded values", () => {
  it("stylesheets don't gain raw spacing values (use a spacing token)", () => {
    const n = count(sheets, DECL, (m) => /\d+(\.\d+)?(px|rem|vw|vh)/.test(m[2]) && !m[2].includes("var(--"));
    expect(n, `raw spacing values in stylesheets: ${n} (baseline ${BASELINE.stylesheetRawSpacing}). Use a token from :root.`).toBeLessThanOrEqual(BASELINE.stylesheetRawSpacing);
  });

  it("components don't gain one-off Tailwind spacing like pt-[134px]", () => {
    const n = count(components, ARBITRARY);
    expect(n, `arbitrary spacing classes: ${n} (baseline ${BASELINE.arbitrarySpacingClasses})`).toBeLessThanOrEqual(BASELINE.arbitrarySpacingClasses);
  });

  it("components don't gain inline spacing styles", () => {
    const n = count(components, INLINE);
    expect(n, `inline spacing styles: ${n} (baseline ${BASELINE.inlineSpacingStyles})`).toBeLessThanOrEqual(BASELINE.inlineSpacingStyles);
  });
});
