/**
 * Announcement bar copy: the strip pinned to the top of every page on phones
 * (AnnouncementBar.tsx). Edit the lines here; no component needs touching.
 *
 * How a line works:
 *  - "text" is the whole line, and the whole bar is tappable. A closing "›"
 *    shows as the chevron. The part after the first full stop or question mark
 *    is the link words (kept apart so they can be styled).
 *  - Keep each line short enough for one line at 360px wide (about 50
 *    characters with the chevron). Longer ones wrap on small phones.
 *  - "link" is where a tap goes. When it is "/contact/" and the page has its
 *    own enquiry form, the tap goes to that form instead.
 *  - Paths need the trailing slash.
 */

/** Turn on while Christmas door garlands are the focus. Off = the normal
 *  lines below on every page. It also switches itself off on the date below
 *  (UK time, Matt 2026-11-17), so nobody has to remember in January. */
export const christmasMode = true;
export const christmasEndsOn = "2027-01-03";

export type BarLine = { text: string; link: string };

/** Shown only while christmasMode is on, on these pages. */
export const christmasPaths = ["/", "/christmas-door-garlands/"];
export const christmasLine: BarLine = {
  text: "December dates now booking. Check yours ›",
  link: "/christmas-door-garlands/#enquire",
};

/** Any page not listed in pageLines. Also used on the two Christmas pages
 *  when christmasMode is off. */
export const defaultLine: BarLine = {
  text: "Got a date in mind? Check we're free ›",
  link: "/contact/",
};

/** Page-specific lines. null = no bar on that page. */
export const pageLines: Record<string, BarLine | null> = {
  "/childrens-parties/": {
    text: "Planning a birthday? Check your date ›",
    link: "/contact/",
  },
  "/milestone-celebrations/": {
    text: "Something to celebrate? Check your date ›",
    link: "/contact/",
  },
  "/corporate-brand-styling/": {
    text: "Planning a work event? Check your date ›",
    link: "/contact/",
  },
  "/balloon-installations/": {
    text: "More than balloons? See our styling ›",
    link: "/our-work/",
  },
  "/contact/": null,
};

/** Pages that never show the bar (hidden pages, not for visitors). */
export const noBarPaths = ["/style-guide/"];
