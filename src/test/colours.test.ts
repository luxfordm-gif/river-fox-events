import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Colours come from the named brand colours (Matt, 2026-11-13).
 *
 * - No inline colour styles: style={{ color / background / borderColor }}.
 *   Use the Tailwind names (text-on-deep, text-ink-faint, bg-surface-warm ...).
 * - Borders and hairlines use the hairline colours (border-hair,
 *   border-divider, border-hair-strong), not border-ink/10, /15, /20, /30.
 * - No raw hex colours in components. Allowed: the snow illustration's
 *   shading (SnowCap), the footer's fade mask (black only sets transparency)
 *   and the video player's white controls over footage (StoryVideos).
 */
const SRC = join(__dirname, "..");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "ui" || name === "test" ? [] : walk(path);
    return name.endsWith(".tsx") && name !== "StyleGuide.tsx" ? [path] : [];
  });
const files = walk(SRC);
const hits = (re: RegExp, allow: string[] = []) =>
  files
    .filter((f) => !allow.some((a) => f.endsWith(a)))
    .flatMap((f) => {
      const t = readFileSync(f, "utf8");
      return [...t.matchAll(re)].map((m) => `${relative(SRC, f)}:${t.slice(0, m.index).split("\n").length} ${m[0].slice(0, 70)}`);
    });

describe("colours: named brand colours only", () => {
  it("no inline colour styles", () => {
    const bad = hits(/style=\{\{[^}]*\b(?:color|background(?:Color)?|borderColor)\s*:/g);
    expect(bad, `Use a colour class instead:\n${bad.join("\n")}`).toEqual([]);
  });

  it("borders use the hairline colours", () => {
    const bad = hits(/(?<![\w-])border-ink\/\d+/g);
    expect(bad, `Use border-hair / border-divider / border-hair-strong:\n${bad.join("\n")}`).toEqual([]);
  });

  it("no raw hex colours in components", () => {
    const bad = hits(/["'`(\s]#[0-9a-fA-F]{3,8}\b/g, ["rfx/SnowCap.tsx", "rfx/Footer.tsx", "rfx/StoryVideos.tsx"]);
    expect(bad, `Use a named colour:\n${bad.join("\n")}`).toEqual([]);
  });
});
