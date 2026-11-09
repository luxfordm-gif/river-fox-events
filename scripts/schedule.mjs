/**
 * Scheduled journal articles (Matt, 2026-11-09).
 *
 * An article (and its route in src/seo/routes.ts) can carry a future date.
 * On the live site (Netlify's "production" builds) it stays out of every
 * page, the journal list and the sitemap until that date. Deploy previews
 * and local builds show everything, so drafts can be read before they go
 * out. `.github/workflows/publish-scheduled-articles.yml` triggers a fresh
 * build each morning a scheduled article is due.
 *
 * Dates are compared as YYYY-MM-DD in UK time.
 */

export const londonDate = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

export const TODAY = londonDate();
export const HIDE_SCHEDULED = process.env.CONTEXT === "production";

/** True when a route with this `publishAt` (or none) belongs in the build. */
export const isLive = (publishAt) => !publishAt || !HIDE_SCHEDULED || publishAt <= TODAY;
