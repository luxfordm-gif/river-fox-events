import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Design-system guard (Matt, 2026-11-08): every reusable component and page,
 * the Christmas page included, takes its typography and corners from the
 * design system, never from a hard-coded value.
 *
 *   Text:    one named style per element - .t-display .t-h1 .t-h2 .t-h2-sm
 *            .t-h3 .t-quote .t-h4 .t-faq .t-caption .t-lead .t-body .t-body-sm
 *            .t-meta .t-ui .t-eyebrow (+ .t-accent for the italic highlight)
 *   Corners: rounded-card / rounded-media / rounded-control / rounded-chip
 *   Values:  tokens in src/index.css :root (--fs-*, --lh-*, --ls-*, --fw-*, --radius-*)
 *
 * If this fails, use (or add) a named style or token instead of a raw value.
 */
const SRC = join(__dirname, "..");
const ROOT = join(SRC, "..");

const walk = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      // shadcn/ui primitives are a vendored library; tests are not UI.
      return name === "ui" || name === "test" ? [] : walk(path, ext);
    }
    return ext.test(name) ? [path] : [];
  });

const lineOf = (text: string, index: number) => text.slice(0, index).split("\n").length;
const where = (file: string, text: string, index: number) => `${relative(ROOT, file)}:${lineOf(text, index)}`;

/* ---------- components and pages (.tsx) ---------- */

// Inline style props. Only a token or a size relative to the parent (em) is allowed.
const INLINE = /\b(fontSize|lineHeight|letterSpacing|fontWeight|fontFamily|borderRadius)\s*:\s*([^,}\n]+)/g;
const INLINE_OK = /^["'`]?(var\(--(fs|lh|ls|fw|radius|font)-[a-z0-9-]+\)|[\d.]+em|inherit|0)["'`]?$/;

// Tailwind classes that hard-code typography or corners.
const CLASS_BAD = [
  /\btext-\[[\d.]+(px|rem|em)\]/g,
  /\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/g,
  /\btext-(display|h1|h2|h3|h4|faq)\b/g,
  /\bleading-(\[[^\]]+\]|none|tight|snug|normal|relaxed|loose|\d+)\b/g,
  /\btracking-(\[[^\]]+\]|tighter|tight|normal|wide|wider|widest)\b/g,
  /\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g,
  /\brounded-\[[^\]]+\]/g,
  /(?<![\w-])(font-serif-rf|font-mono-rf)\b/g,
];

describe("design system: components and pages", () => {
  const files = walk(SRC, /\.tsx$/);

  it("found the component files", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  it("no inline font size, line height, letter-spacing, weight, family or radius", () => {
    const bad: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const m of text.matchAll(INLINE)) {
        if (!INLINE_OK.test(m[2].trim())) bad.push(`${where(f, text, m.index!)}  ${m[1]}: ${m[2].trim()}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("no hard-coded Tailwind type or radius classes", () => {
    const bad: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const re of CLASS_BAD) for (const m of text.matchAll(re)) bad.push(`${where(f, text, m.index!)}  ${m[0]}`);
    }
    expect(bad).toEqual([]);
  });
});

/* ---------- stylesheets ---------- */

const CSS_DECL = /(?<![\w-])(font-size|line-height|letter-spacing|font-weight|border-radius|font-family)\s*:\s*([^;}]+)/g;
// Allowed without a token: neutral values and sizes relative to the parent.
const CSS_OK = /^(0|1|inherit|normal|initial|unset|50%|[\d.]+em)(\s*!important)?$/;

describe("design system: stylesheets", () => {
  const sheets = [join(SRC, "index.css"), ...walk(join(SRC, "styles"), /\.css$/)];

  it("every type and corner value comes from a token", () => {
    const bad: string[] = [];
    for (const f of sheets) {
      const text = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
      for (const m of text.matchAll(CSS_DECL)) {
        const value = m[2].trim();
        if (value.includes("var(--") || CSS_OK.test(value)) continue;
        bad.push(`${where(f, text, m.index!)}  ${m[1]}: ${value}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
