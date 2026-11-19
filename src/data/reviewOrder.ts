import { REVIEWS, type Review } from "@/seo/routes";

/**
 * Which review comes first on each service page (Matt, 2026-11-18). The words
 * are never edited, only the order: the reviews that match the page lead, and
 * the rest follow in their usual order. Names are the review authors, as
 * written in REVIEWS (src/seo/routes.ts).
 */
const reviewsLeadingWith = (authors: string[]): Review[] => {
  const lead = authors
    .map((a) => REVIEWS.find((r) => r.a === a))
    .filter((r): r is Review => Boolean(r));
  return [...lead, ...REVIEWS.filter((r) => !lead.includes(r))];
};

/* A child's birthday backdrop and tablescape, a daughter's party, an 8th, a first birthday, kids' seating. */
export const CHILDRENS_REVIEWS = reviewsLeadingWith(["Tolu Balogun", "Sarah Lupinski", "Rupi Heron", "Emily Stimson", "Lee Dunn"]);

/* A Christening, an 18th, an engagement party, then the birthdays. */
export const MILESTONE_REVIEWS = reviewsLeadingWith(["Sam", "L P", "Emily", "Rupi Heron", "Sarah Lupinski"]);

/* A business day, two salons, then the stacks and arches. */
export const CORPORATE_REVIEWS = reviewsLeadingWith(["Suzy Dorran", "Danielle Wayman", "Nicola Hewitson", "Helen A", "L P"]);

/* The balloon pieces themselves: an arch, a hoop garland, a stack, a garland. */
export const BALLOON_REVIEWS = reviewsLeadingWith(["Helen A", "Sam", "Emily Stimson", "Rupi Heron", "Lee Dunn"]);
