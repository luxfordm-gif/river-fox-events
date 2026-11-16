import { useEffect, useLayoutEffect, useMemo, useRef, useState, Fragment } from "react";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";
import { ChevronUp, LayoutGrid, X } from "lucide-react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import { Tile, Viewer } from "@/components/rfx/PhotoViewer";
import type { ViewerItem } from "@/components/rfx/PhotoViewer";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta, breadcrumbSchema, removeJsonLd, upsertJsonLd } from "@/seo/headTags";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { GALLERY, orderedEvents, resolvePhoto } from "@/data/gallery";
import type { GalleryEvent, GallerySection } from "@/data/gallery";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";

/**
 * /our-work/ - a curated gallery of Laura's real events, grouped by occasion.
 * All content comes from src/data/gallery.ts; this file is layout only.
 * Every photo opens a full-screen viewer that steps through its section.
 */

type OpenViewer = (sectionId: string, index: number) => void;

const GRID_SIZES = "(min-width: 1440px) 440px, (min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw";
const THUMB_SIZES = "(min-width: 1440px) 220px, (min-width: 1280px) 15vw, (min-width: 768px) 22vw, 46vw";
const COMPACT_SIZES = "(min-width: 1440px) 330px, (min-width: 768px) 23vw, 46vw";

/* One event: a large lead photo, up to two smaller tiles beneath, caption. */
const EventCard = ({
  event, compact, firstIndex, open, eager,
}: { event: GalleryEvent; compact?: boolean; firstIndex: number; open: (i: number) => void; eager?: boolean }) => {
  const [lead, ...rest] = event.photos.map(resolvePhoto);
  const extras = rest.slice(0, 2);
  return (
    <figure className="gallery-event fade-up m-0" data-title={event.title}>
      <Tile photo={lead} sizes={compact ? COMPACT_SIZES : GRID_SIZES} onOpen={() => open(firstIndex)} eager={eager} />
      {extras.length > 0 && (
        <div className={`grid photos-gap photos-gap-top ${extras.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {extras.map((p, i) => (
            <Tile
              key={p.source}
              photo={p}
              sizes={extras.length === 1 ? GRID_SIZES : THUMB_SIZES}
              crop={extras.length === 1 ? "16 / 10" : "1 / 1"}
              onOpen={() => open(firstIndex + 1 + i)}
              eager={eager}
            />
          ))}
        </div>
      )}
      <figcaption className="photo-caption">
        <span
          className="block t-small text-ink"
          style={{ textWrap: "balance" }}
        >
          {event.title}
        </span>
        {event.place && (
          <span
            className="block meta-below t-overline text-ink-soft"
          >
            {event.place}
          </span>
        )}
      </figcaption>
    </figure>
  );
};

/* Column count for the photo grid, following the same breakpoints as the
   rest of the site (phone 1, tablet 2, laptop 3; Christmas 2 then 4). */
const columnsFor = (compact?: boolean) => {
  if (typeof window === "undefined") return compact ? 4 : 3;
  const md = window.matchMedia("(min-width: 768px)").matches;
  const xl = window.matchMedia("(min-width: 1280px)").matches;
  return compact ? (md ? 4 : 2) : xl ? 3 : md ? 2 : 1;
};
const useColumns = (compact?: boolean) => {
  const [n, setN] = useState(() => columnsFor(compact));
  useEffect(() => {
    const onResize = () => setN(columnsFor(compact));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [compact]);
  return n;
};

/* Rough height of an event card, in column widths, from each photo's shape. */
const cardHeight = (e: GalleryEvent) => {
  const [lead, ...rest] = e.photos.map(resolvePhoto);
  const extras = rest.slice(0, 2).length;
  return lead.height / lead.width + (extras === 1 ? 0.66 : extras === 2 ? 0.52 : 0) + 0.22;
};

/* Lay events out row by row: each goes into the currently shortest column,
   so the first events fill the top row from left to right (CSS columns
   would put them all down the first column instead). */
const balance = (events: GalleryEvent[], n: number, measured: Record<string, number> = {}) => {
  const cols: number[][] = Array.from({ length: n }, () => []);
  const heights = new Array(n).fill(0);
  // Real card heights (in column widths) once they have been drawn; the photo-shape estimate until then.
  const size = (i: number) => measured[events[i].title] ?? cardHeight(events[i]);
  events.forEach((e, i) => {
    const c = heights.indexOf(Math.min(...heights));
    cols[c].push(i);
    heights[c] += size(i);
  });
  // Even out the bottoms (Matt, 2026-11-07: "never a massive gap"). Only cards
  // below the first row may move, so the top row keeps its order:
  // try every move (to the end of another column) and every swap, keep the one
  // that most reduces the difference between the tallest and shortest column.
  const movable = (i: number) => i >= n; // everything below the first row
  const spread = (hs: number[]) => Math.max(...hs) - Math.min(...hs);
  for (let step = 0; step < 40 && n > 1; step++) {
    let best = spread(heights) - 0.01, apply: (() => void) | null = null;
    for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
      if (a === b) continue;
      cols[a].forEach((i, ai) => {
        if (!movable(i)) return;
        // move i from column a to the end of column b
        const hs = heights.slice(); hs[a] -= size(i); hs[b] += size(i);
        if (spread(hs) < best) { best = spread(hs); apply = () => { cols[a].splice(ai, 1); cols[b].push(i); heights[a] = hs[a]; heights[b] = hs[b]; }; }
        // or swap i with a card j in column b
        cols[b].forEach((j, bj) => {
          if (!movable(j) || a > b) return;
          const d = size(i) - size(j);
          const hs2 = heights.slice(); hs2[a] -= d; hs2[b] += d;
          if (spread(hs2) < best) { best = spread(hs2); apply = () => { cols[a][ai] = j; cols[b][bj] = i; heights[a] = hs2[a]; heights[b] = hs2[b]; }; }
        });
      });
    }
    if (!apply) break;
    (apply as () => void)();
  }
  // Keep each column in list order, so moved cards sit in their natural place.
  cols.forEach((c) => c.sort((x, y) => x - y));
  return cols;
};

const Section = ({
  section, events, index, openViewer,
}: { section: GallerySection; events: GalleryEvent[]; index: number; openViewer: OpenViewer }) => {
  const n = useColumns(section.compact);
  // Half of each section shows at first; "Show more" reveals the rest.
  // Columns are filled in order, so the first half keeps its place when
  // the rest is added underneath.
  const [expanded, setExpanded] = useState(false);
  const initial = Math.ceil(events.length / 2);
  const shown = expanded ? events : events.slice(0, initial);
  const hidden = events.length - shown.length;
  // Card heights measured after the first layout (key: event title), so the
  // columns balance on what's actually on screen rather than an estimate.
  const [measured, setMeasured] = useState<{ n: number; sizes: Record<string, number> }>({ n: 0, sizes: {} });
  const cols = useMemo(
    () => balance(shown, n, measured.n === n ? measured.sizes : {}),
    [shown, n, measured]
  );
  // Cards scale gently up into view as you scroll (Matt, 2026-11-07). Off for
  // reduced motion and for the prerender (navigator.webdriver), so the built
  // HTML and anyone without JavaScript always see every photo.
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || navigator.webdriver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    grid.classList.add("gallery-anim");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    grid.querySelectorAll(".gallery-event:not(.is-in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cols]);
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const colEl = grid?.querySelector<HTMLElement>(".gallery-col");
    if (!grid || !colEl) return;
    const w = colEl.getBoundingClientRect().width;
    if (!w) return;
    const gap = parseFloat(getComputedStyle(colEl).rowGap || "0") || 0;
    const sizes: Record<string, number> = {};
    grid.querySelectorAll<HTMLElement>(".gallery-event[data-title]").forEach((el) => {
      sizes[el.dataset.title!] = (el.offsetHeight + gap) / w;
    });
    const prev = measured.n === n ? measured.sizes : {};
    const changed = Object.keys(sizes).some((k) => Math.abs((prev[k] ?? 0) - sizes[k]) > 0.02);
    if (changed) setMeasured({ n, sizes: { ...prev, ...sizes } });
  }, [cols, n, measured]);
  // Index of each event's first photo within the section's viewer list.
  let running = 0;
  const starts = events.map((e) => {
    const s = running;
    running += Math.min(e.photos.length, 3);
    return s;
  });
  const cards = events.map((e, i) => (
    <EventCard
      key={e.title}
      event={e}
      // The first two rows of the first section (2 x the column count: 6 on
      // a 3-column laptop, 2 on a phone) load straight away; every other
      // photo on the page is lazy (Matt, 2026-11-07).
      eager={index === 0 && i < n * 2}
      compact={section.compact}
      firstIndex={starts[i]}
      open={(n) => openViewer(section.id, n)}
    />
  ));
  return (
    <section
      id={section.id}
      className={`rfx-section gallery-section${index % 2 === 1 ? " white" : ""}`}
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="container-rfx">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between cards-gap heading-to-content">
          <h2
            id={`${section.id}-heading`}
            className="t-h3 fade-up m-0"
          >
            {section.titleLead}{" "}
            <em className="t-accent">{section.titleAccent}</em>
          </h2>
        </div>
        <div
          ref={gridRef}
          className={section.compact ? "gallery-cols gallery-cols--compact" : "gallery-cols"}
          style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}
        >
          {cols.map((idx, c) => (
            <div key={c} className="gallery-col">
              {idx.map((i) => cards[i])}
            </div>
          ))}
        </div>
        {hidden > 0 && (
          <div className="text-to-content flex justify-center">
            <button type="button" className="btn-ghost-rf" onClick={() => setExpanded(true)}>
              Show {hidden} more <span aria-hidden="true">↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

/* Floating section nav: slides up from the bottom once the header tabs have
   scrolled away, highlights the section in view, and tucks away again at
   the end of the page so it never sits over the enquiry button or footer. */
const SectionDock = ({
  sections, tabsRef, endRef,
}: {
  sections: { id: string; short: string; label: string; count: number }[];
  tabsRef: RefObject<HTMLElement>;
  endRef: RefObject<HTMLElement>;
}) => {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const pastTabs = (tabsRef.current?.getBoundingClientRect().bottom ?? 0) < 0;
      const beforeEnd = (endRef.current?.getBoundingClientRect().top ?? Infinity) > vh * 0.8;
      setShow(pastTabs && beforeEnd);
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < vh * 0.4) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections, tabsRef, endRef]);

  // Laptops: the site's smooth scroll (Lenis) eases anchor jumps itself.
  // Phones use native scrolling, so ease the jump here instead.
  const onJump = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false);
    if (!window.matchMedia("(pointer: coarse) and (max-width: 1024px)").matches) return;
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  // Phones: one button showing the current section; tapping it opens a menu.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!show) setMenuOpen(false); }, [show]);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <>
      {/* Laptop and tablet: the full bar of sections. */}
      <nav className={`work-dock ${show ? "is-on" : ""}`} aria-label="Jump to an occasion" aria-hidden={!show}>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            tabIndex={show ? undefined : -1}
            aria-current={active === s.id ? "true" : undefined}
            className={`work-dock__link no-underline-fx ${active === s.id ? "is-active" : ""}`}
            onClick={(e) => onJump(e, s.id)}
          >
            {s.short}
          </a>
        ))}
      </nav>

      {/* Phone: a single floating button that opens a menu of sections. */}
      <div ref={menuRef} className={`work-fab ${show ? "is-on" : ""} ${menuOpen ? "is-open" : ""}`} aria-hidden={!show}>
        <div className="work-fab__menu" id="work-fab-menu" role="menu" aria-label="Jump to an occasion">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              role="menuitem"
              tabIndex={menuOpen ? undefined : -1}
              aria-current={active === s.id ? "true" : undefined}
              className={`work-fab__item no-underline-fx ${active === s.id ? "is-active" : ""}`}
              onClick={(e) => onJump(e, s.id)}
            >
              <span>{s.label}</span>
              <span className="work-fab__count">{s.count}</span>
            </a>
          ))}
        </div>
        <button
          type="button"
          className="work-fab__btn"
          tabIndex={show ? undefined : -1}
          aria-expanded={menuOpen}
          aria-controls="work-fab-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X size={18} strokeWidth={1.75} /> : <LayoutGrid size={18} strokeWidth={1.75} />}
          <span className="work-fab__label">{menuOpen ? "Jump to" : current?.label}</span>
          <ChevronUp size={16} strokeWidth={1.75} className="work-fab__chev" />
        </button>
      </div>
    </>
  );
};

const OurWork = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/our-work")!;
    applyMeta(route);
    const breadcrumbId = "rfx-jsonld-bc-our-work";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);
    return () => removeJsonLd(breadcrumbId);
  }, []);

  const sections = useMemo(
    () =>
      GALLERY.map((s) => {
        const events = orderedEvents(s);
        const items: ViewerItem[] = events.flatMap((e) =>
          e.photos.slice(0, 3).map((p) => ({ ...resolvePhoto(p), title: e.title, place: e.place }))
        );
        return { section: s, events, items };
      }),
    []
  );

  const headerEndRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLElement>(null);
  const dockSections = useMemo(
    () => sections.map(({ section, events }) => ({ id: section.id, short: section.short, label: section.label, count: events.length })),
    [sections]
  );
  const [viewer, setViewer] = useState<{ sectionId: string; index: number } | null>(null);
  const openViewer: OpenViewer = (sectionId, index) => setViewer({ sectionId, index });
  const active = viewer && sections.find((s) => s.section.id === viewer.sectionId);

  return (
    <div className="min-h-screen page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main>
        <PageHeader
          tone="paper"
          divider
          title="Our work, by occasion."
          intro="Real parties and events Laura has styled across Surrey, grouped so you can find the kind of day you have in mind."
        >
          {/* Plain text links down to each occasion, between the intro and
              the line (Matt, 2026-11-08). Not buttons. */}
          <nav className="page-header__links" aria-label="Jump to an occasion">
            <span className="t-small text-ink-soft">Navigate to:</span>
            {dockSections.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 && <span className="page-header__sep" aria-hidden="true" />}
                <a href={`#${s.id}`} className="t-small text-ink no-underline-fx text-link">
                  {s.label}
                </a>
              </Fragment>
            ))}
          </nav>
        </PageHeader>
        {/* Marker at the foot of the header: the occasion dock appears once
            this has scrolled off the top. */}
        <div ref={headerEndRef} aria-hidden="true" />

        {sections.map(({ section, events }, i) => (
          <Section key={section.id} section={section} events={events} index={i} openViewer={openViewer} />
        ))}

        <section ref={endRef} className="rfx-section" aria-labelledby="our-work-cta">
          <div className="container-rfx text-center">
            <SectionHeading id="our-work-cta" className="fade-up">
              Have an event <em className="t-accent">in mind?</em>
            </SectionHeading>
            <SectionIntro>
              Message me the date and the occasion, and I'll get back to you
              with ideas and a quote.
            </SectionIntro>
            <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent text-to-action">
              Reserve your date <span>→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SectionDock sections={dockSections} tabsRef={headerEndRef} endRef={endRef} />

      {active && viewer && (
        <Viewer
          items={active.items}
          index={viewer.index}
          onIndex={(index) => setViewer({ sectionId: viewer.sectionId, index })}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
};

export default OurWork;
