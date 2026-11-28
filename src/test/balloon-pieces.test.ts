import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { PIECE_COUNTS } from "@/components/illustration/BalloonPieces";
import { BALLOON_PIECES } from "@/components/illustration/pieceList";

/**
 * Balloon piece drawings (docs/illustration.md, Matt 2026-11-28).
 *
 * - Every piece has its own id and name.
 * - Every <BalloonPieces pieces={[...]} /> shows 1, 2, 4, 6 or 12 pieces, so
 *   the grid ends on a full row at every width, and names real pieces.
 */
const SRC = join(__dirname, "..");
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "test" ? [] : walk(path);
    return name.endsWith(".tsx") ? [path] : [];
  });

describe("balloon piece drawings", () => {
  it("every piece has its own id and name", () => {
    const ids = BALLOON_PIECES.map((p) => p.id);
    const names = BALLOON_PIECES.map((p) => p.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
    expect(PIECE_COUNTS).toContain(BALLOON_PIECES.length);
  });

  it("every set ends on a full row and names real pieces", () => {
    const known = new Set<string>(BALLOON_PIECES.map((p) => p.id));
    const bad = walk(SRC).flatMap((f) => {
      const t = readFileSync(f, "utf8");
      return [...t.matchAll(/<BalloonPieces[^>]*\bpieces=\{\[([^\]]*)\]\}/g)].flatMap((m) => {
        const ids = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
        const where = `${relative(SRC, f)}:${t.slice(0, m.index).split("\n").length}`;
        return [
          ...(PIECE_COUNTS.includes(ids.length) ? [] : [`${where} shows ${ids.length} pieces (use ${PIECE_COUNTS.join(", ")})`]),
          ...ids.filter((id) => !known.has(id)).map((id) => `${where} unknown piece "${id}"`),
        ];
      });
    });
    expect(bad, bad.join("\n")).toEqual([]);
  });
});
