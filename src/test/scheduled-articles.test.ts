import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Scheduled journal articles (Matt, 2026-11-09). An article dated in the
 * future is hidden on the live site by two separate checks: the app reads the
 * article's `publishedAt`, the prerender/sitemap read the route's `publishAt`.
 * They must agree, or a scheduled page would be built (empty) or listed early.
 */
const SRC = join(__dirname, "..");
const articles = readFileSync(join(SRC, "data/articles/index.tsx"), "utf8");
const routes = readFileSync(join(SRC, "seo/routes.ts"), "utf8");

const ARTICLE_DATES = new Map(
  [...articles.matchAll(/slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => [m[1], m[2]])
);
const ROUTE_BLOCKS = [...routes.matchAll(/\{\s*path:\s*"\/journal\/([^"]+)"([\s\S]*?)\n  \}/g)].map((m) => ({
  slug: m[1],
  publishAt: m[2].match(/publishAt:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1],
}));

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

describe("scheduled articles", () => {
  it("every article has a journal route", () => {
    const routed = new Set(ROUTE_BLOCKS.map((r) => r.slug));
    expect([...ARTICLE_DATES.keys()].filter((s) => !routed.has(s))).toEqual([]);
  });

  it("a route's publishAt matches its article's publishedAt", () => {
    const mismatched = ROUTE_BLOCKS.filter((r) => r.publishAt && r.publishAt !== ARTICLE_DATES.get(r.slug)).map(
      (r) => `${r.slug}: route ${r.publishAt}, article ${ARTICLE_DATES.get(r.slug)}`
    );
    expect(mismatched).toEqual([]);
  });

  it("every article dated after today has publishAt on its route", () => {
    const missing = ROUTE_BLOCKS.filter((r) => (ARTICLE_DATES.get(r.slug) ?? "") > today && !r.publishAt).map(
      (r) => r.slug
    );
    expect(missing).toEqual([]);
  });
});
