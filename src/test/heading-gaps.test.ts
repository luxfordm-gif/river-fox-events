import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * One heading-to-text gap (Matt, 2026-11-13): "it worries me when the gap
 * between the H1 and body is different to the section headers and body".
 *
 * The paragraph straight under any heading (a hero H1, a section H2, the
 * Christmas SectionTitle) takes its space from --gap-heading-text, through
 * the .heading-to-text class. Hand-set margins (mt-3, md:mt-0, mt-6 ...) on
 * that paragraph were how the hero gaps drifted to 0-28px while sections sat
 * at 12. This test finds the first element after each closing heading tag
 * and fails if it sets its own top margin.
 */
const SRC = join(__dirname, "..");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "ui" || name === "test" ? [] : walk(path);
    return name.endsWith(".tsx") && name !== "StyleGuide.tsx" ? [path] : [];
  });

// Closing heading, then optional JSX comments / whitespace, then the next tag.
const AFTER_HEADING = /<\/(h1|h2|SectionTitle|SectionHeading)>\s*(?:\{\/\*[\s\S]*?\*\/\}\s*)*<(p|div)\b([^>]*)>/g;
const TEXT_ROLE = /\bt-(lead|body|small)\b/;
const OWN_MARGIN = /(?:^|[\s"'`{])(?:[a-z]+:)*!?-?mt-/;

describe("heading to text: one gap, from the token", () => {
  it("text directly under a heading uses .heading-to-text, not its own margin", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(AFTER_HEADING)) {
        const attrs = m[3];
        if (!TEXT_ROLE.test(attrs) && !/heading-to-text/.test(attrs)) continue;
        if (OWN_MARGIN.test(attrs)) {
          const line = text.slice(0, m.index).split("\n").length;
          offenders.push(`${relative(SRC, file)}:${line} <${m[2]}${attrs.slice(0, 90)}>`);
        }
      }
    }
    expect(offenders, `Use className="heading-to-text" instead of a margin:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("section titles use the shared SectionHeading, not a hand-built <h2 className=\"t-h2\">", () => {
    // Deliberate exceptions: the home mission line (its own width and word
    // reveal) and the About counter (a number in the heading size).
    const ALLOWED = ["components/rfx/Mission.tsx", "components/rfx/About.tsx", "components/rfx/SectionHeading.tsx"];
    const offenders = walk(SRC)
      .filter((f) => !ALLOWED.some((a) => f.endsWith(a)))
      .filter((f) => /<h2[^>]*className=\{?["`][^"`]*\bt-h2\b/.test(readFileSync(f, "utf8")))
      .map((f) => relative(SRC, f));
    expect(offenders, `Use <SectionHeading> (src/components/rfx/SectionHeading.tsx):\n${offenders.join("\n")}`).toEqual([]);
  });
});
