import type { Article, ArticleSummary } from "./types";
import LollipopRebrandBody from "./lollipop-balloons-to-river-fox-events";
import BeyondTheBalloonArchBody from "./beyond-the-balloon-arch";
import FromDesignToDeliveryBody from "./from-design-to-delivery";
import ChildrensPartyThemes2026Body from "./childrens-party-themes-2026";
import TwoWildSafariSecondBirthdayBody from "./two-wild-safari-second-birthday";

import lollipopCard from "@/assets/luxury-event-stylist-surrey-river-fox-events.webp";
import beyondTheArchCard from "@/assets/luxury-party-styling-occasions-surrey.webp";
import designToDeliveryCard from "@/assets/journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp";
import childrensThemesCard from "@/assets/jungle-themed-childrens-party-styling-surrey.webp";
import twoWildCard from "@/assets/journal/two-wild-safari-second-birthday/two-wild-safari-feature-backdrop-concept-horley-surrey.webp";

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
    slug: "two-wild-safari-second-birthday",
    title: "Two Wild: a safari second birthday in Horley",
    subtitle:
      "How a 'Two Wild' celebration at Horley Community Centre moved from two concept renders to a finished room.",
    teaser:
      "Amiya's 'Two Wild' second birthday at Horley Community Centre — designed across two render boards, sourced over three weeks, installed in six hours.",
    metaDescription:
      "Behind the scenes of Amiya's 'Two Wild' safari second birthday at Horley Community Centre — concept renders to finished install. Pastel safari styling by Laura at River Fox Events.",
    publishedAt: "2026-05-02",
    readMinutes: 7,
    relatedSlugs: ["from-design-to-delivery", "childrens-party-themes-2026", "beyond-the-balloon-arch"],
    cardImage: twoWildCard,
    ogImage: "/og/two-wild-safari-second-birthday.webp",
    category: "Behind the scenes",
    Body: TwoWildSafariSecondBirthdayBody,
  },
  {
    slug: "childrens-party-themes-2026",
    title: "Six children's party themes shaping 2026",
    subtitle:
      "From Chateaucore to charm-bracelet stations — the briefs landing in our Surrey studio right now.",
    teaser:
      "Themes are still everything for a 4th or 6th — but the version of \"themed\" parents are asking for in 2026 is grown-up and personal. Here's the brief-bag.",
    metaDescription:
      "Six children's party themes Surrey parents are asking for in 2026 — Chateaucore, Bluey done well, soft maximalism, charm-bracelet stations, woodland and Toy Story 5. From Laura at River Fox Events.",
    publishedAt: "2026-05-01",
    readMinutes: 6,
    relatedSlugs: ["from-design-to-delivery", "two-wild-safari-second-birthday", "beyond-the-balloon-arch", "lollipop-balloons-to-river-fox-events"],
    cardImage: childrensThemesCard,
    ogImage: "/og/childrens-party-themes-2026.webp",
    category: "Trends",
    Body: ChildrensPartyThemes2026Body,
  },
  {
    slug: "from-design-to-delivery",
    title: "From design to delivery",
    subtitle:
      "How a dinosaur-themed celebration in Surrey moved from a hand-drawn render to a finished room.",
    teaser:
      "Every setup begins long before the day itself. Walking through Ayaan's dinosaur celebration — render, sourcing, install — to show how the sketch becomes the room.",
    metaDescription:
      "Behind the scenes of a Surrey children's party — from concept render to finished install. Laura on how design, sourcing and delivery come together at River Fox Events.",
    publishedAt: "2026-05-01",
    readMinutes: 6,
    relatedSlugs: ["two-wild-safari-second-birthday", "childrens-party-themes-2026", "beyond-the-balloon-arch", "lollipop-balloons-to-river-fox-events"],
    cardImage: designToDeliveryCard,
    ogImage: "/og/from-design-to-delivery.webp",
    category: "Behind the scenes",
    Body: FromDesignToDeliveryBody,
  },
  {
    slug: "beyond-the-balloon-arch",
    title: "Beyond the balloon arch",
    subtitle:
      "Why Surrey celebrations are trading entrance installations for layered tablescapes in 2026.",
    teaser:
      "The balloon arch ruled the entrance for a decade. In 2026, the same budget is moving onto the table — a note from Laura on what's changing and why.",
    metaDescription:
      "The balloon arch is no longer the headline. A note from Laura on layered tablescapes, ceiling drapery and the 2026 trends shaping Surrey celebrations.",
    publishedAt: "2026-05-01",
    readMinutes: 5,
    relatedSlugs: ["childrens-party-themes-2026", "from-design-to-delivery", "lollipop-balloons-to-river-fox-events"],
    cardImage: beyondTheArchCard,
    ogImage: "/og/beyond-the-balloon-arch.webp",
    category: "Trends",
    Body: BeyondTheBalloonArchBody,
  },
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
    relatedSlugs: ["beyond-the-balloon-arch"],
    cardImage: lollipopCard,
    cardImagePosition: "center 60%",
    ogImage: "/og/lollipop-balloons-to-river-fox-events.webp",
    category: "Studio news",
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
