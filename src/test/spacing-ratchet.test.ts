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
  stylesheetRawSpacing: 123, // padding / margin / gap declarations with a px, rem, vw or vh value and no var()
  arbitrarySpacingClasses: 6, // Tailwind pt-[134px], gap-[56px] ...
  inlineSpacingStyles: 6, // style={{ paddingTop: ... }}
  // Tailwind's own spacing scale in a className: mt-6, mb-10, gap-3, px-4 ...
  // (0 is neutral and not counted). These slipped past the checks above and
  // were behind the uneven heading and hero gaps found on 2026-11-13. The
  // token migration moves them onto spacing tokens a batch at a time; lower
  // this number after each batch so it can't creep back up.
  tailwindScaleSpacing: 320,
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

// mt-6, md:gap-3, -ml-4, !pt-2 ... inside className strings only, so prose
// that happens to contain "p-4" isn't counted.
const SCALE = /(?<![\w\-[/])(?:[a-z0-9]+:)*!?-?(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-y|space-x)-(\d+(?:\.5)?|px)(?![\w\-[\]])/g;
const CLASSNAME = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g;
const countScale = (files: string[]) =>
  files.reduce((n, f) => {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(CLASSNAME)) {
      const cls = m[1] ?? m[2] ?? m[3] ?? "";
      n += [...cls.matchAll(SCALE)].filter((c) => c[1] !== "0").length;
    }
    return n;
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

  it("components don't gain Tailwind scale spacing like mt-6 or gap-3 (use a token class)", () => {
    const n = countScale(components);
    expect(n, `Tailwind scale spacing classes: ${n} (baseline ${BASELINE.tailwindScaleSpacing}). Use a spacing token class (.heading-to-text, .text-to-content ...) instead.`).toBeLessThanOrEqual(BASELINE.tailwindScaleSpacing);
  });

  it("components don't gain inline spacing styles", () => {
    const n = count(components, INLINE);
    expect(n, `inline spacing styles: ${n} (baseline ${BASELINE.inlineSpacingStyles})`).toBeLessThanOrEqual(BASELINE.inlineSpacingStyles);
  });
});
