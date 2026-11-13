import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Shadows, page layers and motion come from the design system (Matt,
 * 2026-11-13), like type, spacing, corners and colours.
 *
 * - Shadows: var(--shadow-*) in stylesheets (Christmas: --xmas-shadow-*),
 *   shadow-rest / lift / soft / card / menu / panel / float / on-photo in
 *   components. No hand-written shadow-[...] or Tailwind's shadow-lg.
 * - Page layers: z-index 50 and up is a --layer-* token (z-float, z-menu,
 *   z-nav, z-promo, z-modal, z-top). Small orders inside one component
 *   (1, 2, 3) stay plain numbers.
 * - Motion: speeds are --motion-* (duration-quick, duration-base ...),
 *   curves are --ease-* (ease-soft, ease-reveal ...). Allowed raw: under
 *   0.1s (tiny nudges) and 2s or more (long loops such as the Instagram
 *   strip), and the plain keywords ease / linear / ease-in / ease-out.
 *
 * The tokens themselves are defined in :root (index.css) and .rfx-xmas
 * (christmas.css); lines that define a --custom-property are skipped.
 */
const SRC = join(__dirname, "..");
const walk = (dir: string, ext: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "test" ? [] : walk(path, ext);
    return name.endsWith(ext) && name !== "StyleGuide.tsx" ? [path] : [];
  });

const stripComments = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
const lineOf = (t: string, i: number) => t.slice(0, i).split("\n").length;
const seconds = (n: string, unit: string) => parseFloat(n) / (unit === "ms" ? 1000 : 1);
const midRange = (n: string, unit: string) => {
  const s = seconds(n, unit);
  return s >= 0.1 && s < 2;
};

/** Every declaration in every stylesheet that isn't a token definition. */
const declarations = () =>
  walk(SRC, ".css").flatMap((f) => {
    const t = stripComments(readFileSync(f, "utf8"));
    return [...t.matchAll(/(?<![\w-])([a-z-]+)\s*:([^;{}]*);/g)].map((m) => ({
      where: `${relative(SRC, f)}:${lineOf(t, m.index ?? 0)}`,
      prop: m[1],
      value: m[2],
    }));
  });

const componentHits = (re: RegExp, keep: (m: RegExpMatchArray) => boolean = () => true) =>
  walk(SRC, ".tsx").flatMap((f) => {
    const t = readFileSync(f, "utf8");
    return [...t.matchAll(re)].filter(keep).map((m) => `${relative(SRC, f)}:${lineOf(t, m.index ?? 0)} ${m[0].slice(0, 70)}`);
  });

describe("effects: shadows, layers and motion on tokens", () => {
  it("stylesheet shadows use a shadow token", () => {
    const bad = declarations()
      .filter((d) => /^(box-shadow|text-shadow|filter)$/.test(d.prop))
      .filter((d) => d.prop !== "filter" || /drop-shadow/.test(d.value))
      .filter((d) => /\d+px|hsl\(|rgba?\(|#[0-9a-f]{3}/i.test(d.value))
      .map((d) => `${d.where} ${d.prop}:${d.value.trim().slice(0, 60)}`);
    expect(bad, `Use var(--shadow-...) instead:\n${bad.join("\n")}`).toEqual([]);
  });

  it("stylesheet page layers use a layer token", () => {
    const bad = declarations()
      .filter((d) => d.prop === "z-index" && /^\s*\d+\s*$/.test(d.value) && parseInt(d.value) >= 50)
      .map((d) => `${d.where} z-index:${d.value}`);
    expect(bad, `Use var(--layer-...) instead:\n${bad.join("\n")}`).toEqual([]);
  });

  it("stylesheet motion uses speed and curve tokens", () => {
    const bad = declarations()
      .filter((d) => /^(transition|animation)(-duration|-delay|-timing-function)?$/.test(d.prop))
      .filter((d) => /cubic-bezier/.test(d.value) || [...d.value.matchAll(/(?<![\w.-])(\d*\.?\d+)(ms|s)\b/g)].some((m) => midRange(m[1], m[2])))
      .map((d) => `${d.where} ${d.prop}:${d.value.trim().slice(0, 60)}`);
    expect(bad, `Use var(--motion-...) / var(--ease-...) instead:\n${bad.join("\n")}`).toEqual([]);
  });

  it("components use the shadow classes", () => {
    const bad = componentHits(/(?<![\w-])shadow-(\[[^\]]*\]|sm|md|lg|xl|2xl|inner)(?![\w-])/g);
    expect(bad, `Use shadow-rest / lift / soft / card / menu / panel / float / on-photo:\n${bad.join("\n")}`).toEqual([]);
  });

  it("components use the layer classes", () => {
    const bad = componentHits(/(?<![\w-])z-(\[\d+\]|\d+)(?![\w-])/g, (m) => parseInt(m[1].replace(/\D/g, "")) >= 50);
    expect(bad, `Use z-float / menu / nav / promo / modal / top:\n${bad.join("\n")}`).toEqual([]);
  });

  it("components use the motion classes and tokens", () => {
    const classes = componentHits(/(?<![\w-])(duration-(\d+|\[[^\]]*\])|ease-\[[^\]]*\])/g);
    const curves = componentHits(/cubic-bezier\(/g);
    const inline = componentHits(/(?<![\w.$}-])(\d*\.?\d+)(ms|s)\s+(ease|linear|var\(--ease)/g, (m) => midRange(m[1], m[2]));
    const bad = [...classes, ...curves, ...inline];
    expect(bad, `Use duration-quick / base / slow ..., ease-soft / reveal ..., or var(--motion-...):\n${bad.join("\n")}`).toEqual([]);
  });
});
