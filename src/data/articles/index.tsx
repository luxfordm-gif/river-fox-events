import type { Article, ArticleSummary } from "./types";
import LollipopRebrandBody from "./lollipop-balloons-to-river-fox-events";

/**
 * Master list of articles. Order = newest first.
 *
 * To add a new article:
 *   1. Create `src/data/articles/<slug>.tsx` exporting the body component.
 *   2. Import it here and add an entry below.
 *   3. Add the route to `src/seo/routes.ts` so it prerenders + appears
 *      in the sitemap.
 *   4. (Optional) Add the previous article's slug to this one's
 *      `relatedSlugs`, and vice versa.
 */
export const ARTICLES: Article[] = [
  {
    slug: "lollipop-balloons-to-river-fox-events",
    title: "Lollipop Balloons is now River Fox Events",
    subtitle:
      "A new name, the same hands. Same studio in Surrey. Same level of detail.",
    teaser:
      "After several years as Lollipop Balloons, we're stepping into a new name — and explaining why.",
    metaDescription:
      "Lollipop Balloons is now River Fox Events. Same designer (Laura), same Surrey studio, new name reflecting children's parties, milestones and corporate event styling.",
    publishedAt: "2026-05-01",
    readMinutes: 3,
    relatedSlugs: [],
    Body: LollipopRebrandBody,
  },
];

export const findArticle = (slug: string): Article | undefined =>
  ARTICLES.find((a) => a.slug === slug);

export const summariseArticle = (a: Article): ArticleSummary => {
  // strip the Body component out so summary can be passed to client
  // components without dragging the full article tree along
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Body, ...summary } = a;
  return summary;
};

export const findRelated = (slug: string): ArticleSummary[] => {
  const article = findArticle(slug);
  if (!article?.relatedSlugs?.length) return [];
  return article.relatedSlugs
    .map((s) => findArticle(s))
    .filter((a): a is Article => Boolean(a))
    .map(summariseArticle);
};

export type { Article, ArticleSummary };
