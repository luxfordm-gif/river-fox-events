import { ReactNode, useEffect, useMemo, useState } from "react";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
import ShowMoreButton from "@/components/rfx/ShowMoreButton";
import { Tile, Viewer } from "@/components/rfx/PhotoViewer";
import type { ViewerItem } from "@/components/rfx/PhotoViewer";
import { mixed, seeded, type RecentItem } from "@/data/recentWork";

/**
 * Town pages' "Recent celebrations": a short, clickable photo grid with
 * photos of different shapes, laid out in rows that all end at the same
 * edge (Matt, 2026-11-16: "align rather than stagger at the end").
 *
 * Each row's photos take widths in proportion to their shape, so every photo
 * in a row has the same height, nothing is cropped, and both edges line up.
 * Three rows at every width: from tablet up all the photos, on phones the
 * first six in rows of two (Matt, 2026-11-24: "three rows is definitely
 * enough"). `wide` runs the photos almost full width. Every photo opens the
 * same full-screen viewer as /our-work/.
 *
 * The photos are Laura's latest work, `recentWall()` from
 * src/data/recentWork.ts, the one list behind every wall. The order is mixed
 * on each visit (`mixed()`: shuffled, no two of one service side by side);
 * the prerendered page has a fixed order.
 */

type Props = {
  eyebrow?: string;
  heading?: ReactNode;
  intro?: ReactNode;
  /** The photos, newest first: recentWall(). */
  items: RecentItem[];
  id?: string;
  /** Run the photos almost full width, with a small margin each side. */
  wide?: boolean;
  /** Fixed columns instead of shaped rows (home): 4 per row from 1280px, 3 on tablets, 2 on phones, and only this many whole rows, then "Show more". */
  pageRows?: number;
  /** With `pageRows`: instead of "Show more", end on a "See more" link to this page. */
  moreHref?: string;
};

const SIZES = "(min-width: 1280px) 30vw, (min-width: 768px) 38vw, 46vw";


const ratio = (p: ViewerItem) => p.width / p.height;

/** Split the photos, in order, into `rows` runs of at least two, so the rows
 *  come out as close to the same height as they can (height = 1 / the sum of
 *  the photos' shapes). Brute force: there are only a handful of ways. */
const splitRows = (items: ViewerItem[], rows: number): ViewerItem[][] => {
  const n = items.length;
  let best: number[] = [];
  let bestSpread = Infinity;
  const sum = (a: number, b: number) => items.slice(a, b).reduce((t, p) => t + ratio(p), 0);
  const walk = (from: number, left: number, cuts: number[]) => {
    if (left === 1) {
      if (n - from < 2) return;
      const all = [...cuts, n];
      let prev = 0;
      const heights = all.map((c) => { const h = 1 / sum(prev, c); prev = c; return h; });
      const spread = Math.max(...heights) - Math.min(...heights);
      if (spread < bestSpread) { bestSpread = spread; best = all; }
      return;
    }
    for (let c = from + 2; c <= n - 2 * (left - 1); c++) walk(c, left - 1, [...cuts, c]);
  };
  walk(0, rows, []);
  let prev = 0;
  return best.map((c) => { const r = items.slice(prev, c); prev = c; return r; });
};

const useWide = () => {
  const q = "(min-width: 768px)";
  // The prerendered page is the tablet-and-up layout; phones switch on load.
  const [wide, setWide] = useState(() => (typeof window === "undefined" ? true : window.matchMedia(q).matches));
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
};

/** Photos per row in "Show more" mode: 2 on phones, 3 on tablets, 4 from 1280. */
const useColumns = () => {
  const count = () =>
    typeof window === "undefined" ? 4 : window.matchMedia("(min-width: 1280px)").matches ? 4 : window.matchMedia("(min-width: 768px)").matches ? 3 : 2;
  const [cols, setCols] = useState(count);
  useEffect(() => {
    const on = () => setCols(count());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return cols;
};

/** The prerender (a headless browser) gets one fixed order, so the built
 *  page is the same on every build; real visits get a fresh mix. */
const isPrerender = () => typeof navigator !== "undefined" && navigator.webdriver;

/** Phones: three rows of two. */
const PHONE_PHOTOS = 6;

const LocationPhotoGrid = ({ eyebrow, heading, intro, items, id = "loc-gallery", wide: fullWidth = false, pageRows, moreHref }: Props) => {
  // A different order on every visit (the page is not hydrated from the
  // prerendered HTML, so this can't mismatch).
  const [photos] = useState(() => mixed(items, isPrerender() ? seeded(2026) : Math.random));
  const wide = useWide();
  const cols = useColumns();
  const [pages, setPages] = useState(1);
  const rows = useMemo(() => {
    if (!pageRows) return wide ? splitRows(photos, 3) : splitRows(photos.slice(0, PHONE_PHOTOS), 3);
    const all: ViewerItem[][] = [];
    // Only whole rows: a short last row would stretch its photos across the page.
    for (let i = 0; i + cols <= photos.length; i += cols) all.push(photos.slice(i, i + cols));
    return all;
  }, [photos, wide, pageRows, cols]);
  const shownRows = pageRows ? rows.slice(0, pageRows * pages) : rows;
  const shown = shownRows.flat();
  const hasMore = !!pageRows && shownRows.length < rows.length;
  const [open, setOpen] = useState<number | null>(null);
  let index = -1;

  return (
    <section id={id} className="rfx-section white" aria-labelledby={`${id}-heading`}>
      <div className="container-rfx">
        {(heading || eyebrow || intro) && (
          <div className="text-center fade-up heading-to-content">
            {eyebrow && <div className="t-overline text-ink-soft eyebrow-above">{eyebrow}</div>}
            {heading && <SectionHeading id={`${id}-heading`}>{heading}</SectionHeading>}
            {intro && <SectionIntro>{intro}</SectionIntro>}
          </div>
        )}
        </div>
        <div className={fullWidth ? "container-wide" : "container-rfx"}>
        <div className="flex flex-col photos-gap">
          {shownRows.map((row, r) => (
            <div key={r} className="flex photos-gap">
              {row.map((p) => {
                const i = ++index;
                return (
                  <div key={p.source} className="min-w-0" style={{ flex: `${ratio(p)} 1 0%` }}>
                    <Tile photo={p} sizes={SIZES} onOpen={() => setOpen(i)} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {hasMore && !moreHref && <ShowMoreButton onClick={() => setPages((n) => n + 1)} />}
        {moreHref && (
          <div className="text-to-content flex justify-center">
            <a href={moreHref} className="btn-ghost-rf">
              See more <span className="t-icon">→</span>
            </a>
          </div>
        )}
        </div>
      {open !== null && (
        <Viewer items={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
};

export default LocationPhotoGrid;
