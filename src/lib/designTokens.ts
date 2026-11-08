/**
 * Reads the design system straight from the stylesheet source, for the hidden
 * /style-guide/ page. Nothing here is a copy of a token: change a value or a
 * comment in src/index.css and the style guide shows the change.
 *
 * Only the style guide imports this (it's lazy-loaded), so the raw CSS never
 * reaches ordinary visitors.
 */

export type Token = {
  name: string;
  value: string;
  /** The comment after the declaration in the stylesheet, if any. */
  note: string;
};

/** A media block that overrides :root tokens, e.g. phones below 768px or
 *  laptops between 768 and 1439px. */
export type TokenOverride = { minWidth: number; maxWidth: number; tokens: Record<string, string> };

export type TokenSheet = {
  /** Base :root tokens, in source order. */
  tokens: Token[];
  overrides: TokenOverride[];
  /** Declarations of every rule whose selectors are all .t-* classes. */
  textStyles: Record<string, Record<string, string>>;
};

/** Index of the brace that closes the block opening at `open`, skipping comments. */
const closingBrace = (css: string, open: number) => {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css.startsWith("/*", i)) {
      i = css.indexOf("*/", i + 2) + 1;
      continue;
    }
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return i;
  }
  return css.length;
};

const DECL = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*([\s\S]*?)\*\/)?/g;

const readTokens = (body: string): Token[] =>
  [...body.matchAll(DECL)].map((m) => ({
    name: m[1],
    value: m[2].trim(),
    note: (m[3] ?? "").replace(/\s+/g, " ").trim(),
  }));

/** Tokens in the first `selector {` block (e.g. ":root" or ".rfx-xmas"). */
export const blockTokens = (css: string, selector: string): Token[] => {
  const at = css.search(new RegExp(`(^|\\n)\\s*${selector.replace(".", "\\.")}\\s*\\{`));
  if (at < 0) return [];
  const open = css.indexOf("{", at);
  return readTokens(css.slice(open + 1, closingBrace(css, open)));
};

export const parseTokenSheet = (css: string): TokenSheet => {
  const tokens = blockTokens(css, ":root");

  const overrides: TokenOverride[] = [];
  for (const m of css.matchAll(/@media\s*([^{]*?)\{\s*(?:\/\*[\s\S]*?\*\/\s*)*:root\s*\{/g)) {
    const cond = m[1];
    if (/prefers|hover|print/.test(cond)) continue;
    const open = m.index! + m[0].length - 1;
    const body = css.slice(open + 1, closingBrace(css, open));
    overrides.push({
      minWidth: Number(/min-width:\s*(\d+)px/.exec(cond)?.[1] ?? 0),
      maxWidth: Number(/max-width:\s*(\d+)px/.exec(cond)?.[1] ?? Infinity),
      tokens: Object.fromEntries(readTokens(body).map((t) => [t.name, t.value])),
    });
  }

  const textStyles: TokenSheet["textStyles"] = {};
  const plain = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = m[1].split(",").map((s) => s.trim());
    if (!selectors.every((s) => /^\.t-[\w-]+$/.test(s))) continue;
    const decls = Object.fromEntries(
      m[2]
        .split(";")
        .map((d) => d.split(":"))
        .filter((p) => p.length >= 2)
        .map(([k, ...v]) => [k.trim(), v.join(":").trim()])
    );
    for (const s of selectors) textStyles[s.slice(1)] = { ...textStyles[s.slice(1)], ...decls };
  }

  return { tokens, overrides, textStyles };
};

/** A token's value at a given screen width (base value plus any phone overrides). */
export const tokenAt = (sheet: TokenSheet, name: string, width: number): string | undefined => {
  let value = sheet.tokens.find((t) => t.name === name)?.value;
  for (const o of sheet.overrides) if (width >= o.minWidth && width <= o.maxWidth && o.tokens[name]) value = o.tokens[name];
  return value;
};

/** Resolve var(--x) references (one level is all the stylesheet uses). */
export const resolveVars = (sheet: TokenSheet, value: string, width: number): string =>
  value.replace(/var\((--[\w-]+)\)/g, (_, n) => {
    const v = tokenAt(sheet, n, width);
    return v === undefined ? `var(${n})` : resolveVars(sheet, v, width);
  });

/**
 * Pixel value of a size like "clamp(34px, 4.4vw, 68px)" or
 * "calc(10vw - 10px)" at a screen width. Returns null for anything else
 * (em, %, keywords).
 */
export const pxAt = (value: string, width: number): number | null => {
  const expr = value
    .replace(/(-?[\d.]+)vw/g, (_, n) => String((Number(n) * width) / 100))
    .replace(/(-?[\d.]+)px/g, "$1");
  // Only numbers, arithmetic and clamp/calc/min/max may reach the evaluator.
  if (!/^[\d.\s+\-*/(),]*$/.test(expr.replace(/clamp|calc|min|max/g, ""))) return null;
  try {
    const fn = new Function(
      "clamp",
      "calc",
      "min",
      "max",
      `return (${expr});`
    ) as (...a: unknown[]) => number;
    const n = fn(
      (lo: number, v: number, hi: number) => Math.min(Math.max(v, lo), hi),
      (v: number) => v,
      Math.min,
      Math.max
    );
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

/* ---------- colour helpers ---------- */

/** "100 8% 10%" or "100 8% 10% / 0.10" → [h, s, l, alpha] */
export const parseHsl = (value: string): [number, number, number, number] | null => {
  const m = /^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+))?$/.exec(value.trim());
  return m ? [Number(m[1]), Number(m[2]), Number(m[3]), m[4] ? Number(m[4]) : 1] : null;
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 255)) as [number, number, number];
};

export const hslToHex = (h: number, s: number, l: number) =>
  "#" + hslToRgb(h, s, l).map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();

const luminance = ([r, g, b]: [number, number, number]) => {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

/** WCAG contrast ratio between two opaque HSL colours. */
export const contrast = (a: [number, number, number], b: [number, number, number]) => {
  const la = luminance(hslToRgb(...a));
  const lb = luminance(hslToRgb(...b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
