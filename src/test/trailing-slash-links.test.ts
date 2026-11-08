import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Netlify serves every page at its trailing-slash address (/childrens-parties/)
 * and 301s the no-slash version there. Canonicals and the sitemap use the slash,
 * so internal links must too: a link to "/childrens-parties" costs a redirect
 * hop and sends Google a weaker, mixed signal (Matt, 2026-11-08).
 */
const SRC = join(__dirname, "..");
const LINK = /(?:href|to)\s*[=:]\s*\{?["'`](\/[a-z0-9][a-z0-9/-]*[a-z0-9])["'`#?]/g;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "test" ? [] : files(path);
    return /\.(tsx?|jsx?)$/.test(name) ? [path] : [];
  });

describe("internal links", () => {
  it("end in a trailing slash", () => {
    const missing = files(SRC).flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(LINK)].map(
        (m) => `${file.replace(SRC, "src")}: ${m[1]}`
      )
    );
    expect(missing).toEqual([]);
  });
});
