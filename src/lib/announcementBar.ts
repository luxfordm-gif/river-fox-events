import {
  type BarLine,
  christmasLine,
  christmasEndsOn,
  christmasMode,
  christmasPaths,
  defaultLine,
  noBarPaths,
  pageLines,
} from "@/data/announcementBar";

const withSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);

/** Christmas mode, unless its end date has passed (the day starts at midnight
 *  UK time). */
export function christmasOn(now: Date = new Date()): boolean {
  if (!christmasMode) return false;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(now); // YYYY-MM-DD
  return today < christmasEndsOn;
}

/** The bar's line for a page, or null when the page has none. */
export function lineFor(pathname: string, mode: boolean = christmasOn()): BarLine | null {
  const path = withSlash(pathname);
  if (noBarPaths.includes(path)) return null;
  if (path in pageLines) return pageLines[path];
  if (mode && christmasPaths.includes(path)) return christmasLine;
  return defaultLine;
}

/** Where a tap goes. A "/contact/" link goes to the page's own enquiry form
 *  when it has one. `samePage` means the link is on the page already, so it
 *  scrolls instead of loading. */
export function targetFor(line: BarLine, pathname: string, hasForm: boolean) {
  const path = withSlash(pathname);
  const href = line.link === "/contact/" && hasForm ? `${path}#enquire` : line.link;
  return { href, samePage: href.split("#")[0] === path };
}

/** Split a line at its first full stop or question mark: the lead-in, and the
 *  link part (text and a trailing arrow, if any). */
export function splitLine(text: string) {
  const m = /^(.*?[.?])\s+(.+)$/.exec(text);
  const lead = m ? m[1] : "";
  const rest = m ? m[2] : text;
  const arrow = /[→›>]$/.test(rest);
  return { lead, link: arrow ? rest.slice(0, -1).trim() : rest, arrow };
}
