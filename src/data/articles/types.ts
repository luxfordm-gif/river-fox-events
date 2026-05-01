import type { ComponentType } from "react";

/**
 * Lightweight metadata for an article — used by the journal index, related
 * cards and SEO helpers. Kept minimal so we can list/sort without pulling
 * in the full article body.
 */
export type ArticleSummary = {
  slug: string;
  title: string;
  /** Subtitle / dek shown under the title in the hero. Optional. */
  subtitle?: string;
  /** Short 1–2 sentence teaser used on the journal index and in
   *  related-article cards. */
  teaser: string;
  /** Description used for <meta name="description"> and og:description. */
  metaDescription: string;
  /** ISO 8601 date string. e.g. "2026-05-01". */
  publishedAt: string;
  /** Optional ISO 8601 update date. */
  updatedAt?: string;
  /** Author's display name. Defaults to "Laura" in components. */
  authorName?: string;
  /** Estimated read time in minutes. */
  readMinutes: number;
  /** Path (under /public or imported) to a 1200×630 share image. Falls
   *  back to /social-share.jpg if not provided. */
  ogImage?: string;
  /** Slugs of related articles to surface at the foot of this one. */
  relatedSlugs?: string[];
};

/**
 * Full article = summary + the JSX body component. Body is pulled in via
 * static import (not lazy / code-split) so prerender can capture it. */
export type Article = ArticleSummary & {
  Body: ComponentType;
};
