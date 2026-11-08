/**
 * Finds the vertical gaps inside a live section on the /style-guide/ page, so
 * Matt can annotate spacing (Matt, 2026-11-08). Measures what's on screen at
 * the current width; nothing here changes the section.
 */

export type GapKind = "heading" | "text" | "image" | "button" | "block";

export type GapMark = {
  top: number;
  left: number;
  width: number;
  height: number;
  from: GapKind;
  to: GapKind;
  /** The gap comes from the shared .heading-to-body rule. */
  shared: boolean;
  /** Section padding rather than a gap between two elements. */
  padding?: "top" | "bottom";
};

const HEADING = "h1, h2, h3, h4, h5, h6, .t-display, .t-h1, .t-h2, .t-h3, .t-h4, .t-h5, .t-h6, .t-quote";
const TEXT = "p, blockquote, li, .t-lead, .t-body, .t-small, .t-meta, .t-overline";
const BUTTON = ".btn-solid-rf, .btn-ghost-rf, .btn-link-rf, button";

const visible = (el: Element) => {
  const r = el.getBoundingClientRect();
  if (r.width < 2 || r.height < 2) return false;
  const cs = getComputedStyle(el);
  return cs.display !== "none" && cs.visibility !== "hidden" && cs.position !== "absolute" && cs.position !== "fixed";
};

/** What an element is, looking through single-child wrappers. */
export const kindOf = (el: Element): GapKind => {
  let node: Element = el;
  for (let i = 0; i < 4; i++) {
    if (node.matches(HEADING)) return "heading";
    if (node.matches(BUTTON)) return "button";
    if (node.matches("img, picture, video, .ph, .rounded-large")) return "image";
    if (node.matches(TEXT)) return "text";
    const kids = [...node.children].filter(visible);
    if (kids.length !== 1) break;
    node = kids[0];
  }
  const hasText = (el.textContent ?? "").trim().length > 0;
  if (!hasText && el.querySelector("img, video, picture")) return "image";
  return "block";
};

/** Bottom of the visible text for headings (their padding-bottom is only
 *  room for descenders), otherwise the element's own bottom. */
const visualBottom = (el: Element, kind: GapKind) => {
  if (kind === "heading") {
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    if (r.height > 0) return r.bottom;
  }
  return el.getBoundingClientRect().bottom;
};

export const findGaps = (root: HTMLElement): GapMark[] => {
  const base = root.getBoundingClientRect();
  const marks: GapMark[] = [];
  const seen = new Set<string>();

  const section = root.firstElementChild as HTMLElement | null;
  if (section) {
    const cs = getComputedStyle(section);
    const r = section.getBoundingClientRect();
    const pt = parseFloat(cs.paddingTop);
    const pb = parseFloat(cs.paddingBottom);
    if (pt >= 4) marks.push({ top: r.top - base.top, left: 0, width: r.width, height: pt, from: "block", to: "block", shared: false, padding: "top" });
    if (pb >= 4) marks.push({ top: r.bottom - base.top - pb, left: 0, width: r.width, height: pb, from: "block", to: "block", shared: false, padding: "bottom" });
  }

  for (const el of root.querySelectorAll("*")) {
    if (el.closest(".sg-gap-layer") || !visible(el)) continue;
    let next = el.nextElementSibling;
    while (next && !visible(next)) next = next.nextElementSibling;
    if (!next) continue;

    const a = el.getBoundingClientRect();
    const b = next.getBoundingClientRect();
    const left = Math.max(a.left, b.left);
    const right = Math.min(a.right, b.right);
    if (right - left < 24 || b.top < a.bottom - 1) continue; // side by side, not stacked

    const from = kindOf(el);
    const to = kindOf(next);
    // Two layout groups: only the main rows of a section (e.g. the heading
    // row to the card grid), not every nested wrapper.
    if (from === "block" && to === "block" && !el.parentElement?.matches(".container-rfx, section, main > div")) continue;

    const bottom = visualBottom(el, from);
    const gap = b.top - bottom;
    if (gap < 4 || gap > 320) continue;

    const key = `${Math.round(bottom)}:${Math.round(gap)}:${Math.round(left / 40)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    marks.push({
      top: bottom - base.top,
      left: left - base.left,
      width: right - left,
      height: gap,
      from,
      to,
      shared: el.matches(".heading-to-content, .heading-to-text, .text-to-content, .title-to-text") || next.matches(".heading-to-text, .text-to-content, .title-to-text") || !!el.querySelector(":scope > .heading-to-content:last-child"),
    });
  }
  return marks;
};
