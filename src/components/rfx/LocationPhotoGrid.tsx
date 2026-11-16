import { ReactNode, useEffect, useMemo, useState } from "react";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
import ShowMoreButton from "@/components/rfx/ShowMoreButton";
import { Tile, Viewer } from "@/components/rfx/PhotoViewer";
import type { ViewerItem } from "@/components/rfx/PhotoViewer";
import { GALLERY, orderedEvents, resolvePhoto } from "@/data/gallery";

/**
 * Town pages' "Recent celebrations": a short, clickable photo grid with
 * photos of different shapes, laid out in rows that all end at the same
 * edge (Matt, 2026-11-16: "align rather than stagger at the end").
 *
 * Each row's photos take widths in proportion to their shape, so every photo
 * in a row has the same height, nothing is cropped, and both edges line up.
 * Three rows on tablet and up, rows of two on phones. `wide` runs the photos almost full width (town pages and the Balloons page, Matt 2026-11-16). Every photo opens
 * the same full-screen viewer as /our-work/.
 *
 * The town's own picks (by their one canonical alt) come first; the grid is
 * topped up from the children's parties gallery, starting at a point that
 * depends on the town so neighbouring pages don't show the same set.
 */

type Pick = { alt: string };

type Props = {
  eyebrow?: string;
  heading?: ReactNode;
  intro?: ReactNode;
  /** Town slug, used to vary the top-up photos between towns. */
  slug: string;
  /** The town's own chosen photos, matched to the gallery by alt text. */
  picks: Pick[];
  /** How many photos in all (10 = three rows of 3 or 4). */
  count?: number;
  id?: string;
  /** Run the photos almost full width, with a small margin each side. */
  wide?: boolean;
  /** Fill any gap in `count` from the children's parties gallery (town pages). Off where every photo must be chosen. */
  topUp?: boolean;
  /** Show this many rows, then a "Show more" button for this many more. The photos are shuffled on every load, and laid out a fixed number of photos per row (2 phone, 3 tablet, 4 laptop and up). Off on town pages. */
  pageRows?: number;
};

const SIZES = "(min-width: 1280px) 30vw, (min-width: 768px) 38vw, 46vw";


const allEntries = (): { item: ViewerItem; section: string }[] =>
  GALLERY.flatMap((s) =>
    orderedEvents(s).flatMap((e) =>
      e.photos.map((p) => ({ item: { ...resolvePhoto(p), title: e.title, place: e.place }, section: s.id })),
    ),
  );

const hashOf = (s: string) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0);

const choosePhotos = (slug: string, picks: Pick[], count: number, topUp: boolean): ViewerItem[] => {
  const all = allEntries();
  const chosen: ViewerItem[] = [];
  const seen = new Set<string>();
  for (const pick of picks) {
    const hit = all.find((e) => e.item.alt === pick.alt);
    if (hit && !seen.has(hit.item.source)) {
      chosen.push(hit.item);
      seen.add(hit.item.source);
    }
  }
  // Top up with each children's party's lead photo, starting somewhere that
  // depends on the town.
  // Never Rishi's Summer Party (Matt, 2026-11-08) and no Halloween shots,
  // which are off house style for a town page.
  const skip = /rishi-summer-party|halloween/;
  const pool = all
    .filter((e) => e.section === "childrens-parties" && !skip.test(e.item.source))
    .map((e) => e.item);
  const leads = pool.filter((p, i) => i === pool.findIndex((q) => q.title === p.title));
  const start = hashOf(slug) % Math.max(leads.length, 1);
  for (let k = 0; topUp && k < leads.length && chosen.length < count; k++) {
    const p = leads[(start + k) % leads.length];
    if (!seen.has(p.source)) {
      chosen.push(p);
      seen.add(p.source);
    }
  }
  return chosen.slice(0, count);
};

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

const shuffled = <T,>(items: T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const LocationPhotoGrid = ({ eyebrow, heading, intro, slug, picks, count = 10, id = "loc-gallery", wide: fullWidth = false, topUp = true, pageRows }: Props) => {
  const chosen = useMemo(() => choosePhotos(slug, picks, count, topUp), [slug, picks, count, topUp]);
  // "Show more" mode: a different order on every load (the page is not
  // hydrated from the prerendered HTML, so this can't mismatch).
  const [order] = useState(() => (pageRows ? shuffled(chosen) : chosen));
  const photos = pageRows ? order : chosen;
  const wide = useWide();
  const cols = useColumns();
  const [pages, setPages] = useState(1);
  const rows = useMemo(() => {
    if (!pageRows) return splitRows(photos, wide ? 3 : Math.floor(photos.length / 2));
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
        {hasMore && <ShowMoreButton onClick={() => setPages((n) => n + 1)} />}
        </div>
      {open !== null && (
        <Viewer items={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
};

export default LocationPhotoGrid;
