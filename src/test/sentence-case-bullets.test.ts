import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Bullet points are sentence case: every list item starts with a capital
 * letter, even when the list finishes a lead-in sentence ending in a colon
 * (Matt, 2026-11-09). Checks the first word of each <li> in components and
 * data files, including text that starts on the line after the tag.
 */
const SRC = join(__dirname, "..");
// <li ...> then optional whitespace / {" "} / an opening tag like <strong> or <a ...>
const LI = /<li\b[^>]*>(?:\s|\{"\s*"\}|<(?!\/)[a-zA-Z][^>]*>)*([a-z][\w'-]*)/g;

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    // components/ui is the stock shadcn kit: no site copy, and its class
    // strings contain ">" that would read as the end of a tag.
    if (statSync(path).isDirectory()) return name === "test" || path.endsWith("components/ui") ? [] : files(path);
    return /\.(tsx|jsx)$/.test(name) ? [path] : [];
  });

describe("bullet points", () => {
  it("start with a capital letter", () => {
    const lower = files(SRC).flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(LI)].map(
        (m) => `${file.replace(SRC, "src")}: "${m[1]}…"`
      )
    );
    expect(lower).toEqual([]);
  });
});
