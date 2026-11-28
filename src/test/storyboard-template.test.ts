import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The storyboard page (tools/river-fox/storyboard/page-template.html) is
 * published as an Artifact, so it can't load the site's stylesheet. It
 * repeats the website's tokens under the same names instead (Matt, 28 Nov
 * 2026: "it needs to look more like the website"). This test keeps them equal:
 * change a token in src/index.css and the page must change with it.
 */
const root = join(__dirname, "..", "..");
const site = readFileSync(join(root, "src", "index.css"), "utf8");
const page = readFileSync(join(root, "tools", "river-fox", "storyboard", "page-template.html"), "utf8");

const norm = (v: string) => v.replace(/\s+/g, "");

/** Tokens in the first `:root {` block of a stylesheet (the desktop values). */
function rootTokens(css: string): Map<string, string> {
  const start = css.search(/:root\s*\{/);
  let depth = 0;
  let end = start;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) { end = i; break; }
  }
  const body = css.slice(css.indexOf("{", start) + 1, end).replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Map<string, string>();
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) if (!out.has(m[1])) out.set(m[1], norm(m[2]));
  return out;
}

const siteTokens = rootTokens(site);
const pageTokens = rootTokens(page.slice(page.indexOf("<style>")));
const shared = [...pageTokens.keys()].filter((k) => siteTokens.has(k));

describe("storyboard page uses the website's tokens", () => {
  it("shares the core colours, type and corners", () => {
    expect(shared).toEqual(expect.arrayContaining([
      "--background-light", "--text-primary", "--text-neutral", "--accent", "--accent-dark",
      "--fs-h1", "--fs-h2", "--fs-h4", "--fs-small", "--radius-large", "--radius-small",
    ]));
  });

  it.each(shared)("%s matches src/index.css", (name) => {
    expect(pageTokens.get(name)).toBe(siteTokens.get(name));
  });

  it("never uses the logo pink, which is not a website colour", () => {
    expect(page.toUpperCase()).not.toContain("#F7EEE9");
  });
});
