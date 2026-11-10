import { useRef, useState, type ReactNode } from "react";
import expChildren from "@/assets/dinosaur-childrens-party-styling-surrey.webp";
import expMilestone from "@/assets/40th-birthday-rose-gold-marquee-surrey.webp";
import expCorporate from "@/assets/corporate-gala-styling-surrey.webp";
import { useImageParallax } from "@/hooks/useImageParallax";
import { galleryPhoto } from "@/data/gallery";

type CardPhoto = { img: string; srcSet?: string; alt: string; position?: string };
const fromGallery = (source: string, position?: string): CardPhoto => {
  const p = galleryPhoto(source);
  return { img: p.src, srcSet: p.srcSet, alt: p.alt, position };
};

/* Homepage only: four hand-picked sets of the strongest photos, [children's,
   milestone, corporate]. One is picked at random on each page load (never the
   same set twice running) and stays put while the page is open (Matt, 2026-11-07). */
const HOME_SETS: CardPhoto[][] = [
  [
    { img: expChildren, alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts" },
    { img: expMilestone, alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock" },
    { img: expCorporate, alt: "Navy, gold and cream balloons around a Children in Need Pudsey backdrop at a corporate gala" },
  ],
  [
    fromGallery("river-fox-events-jungle-theme-fourever-wild-full-setup.webp"),
    fromGallery("services/milestones/13th-birthday-pink-light-up-numbers-garland.webp", "58% 50%"),
    fromGallery("river-fox-events-theatre-125-anniversary-marquee-wide.webp"),
  ],
  [
    fromGallery("river-fox-events-fairy-first-birthday-kayla-arch-marquee-portrait.webp"),
    fromGallery("river-fox-events-veuve-cliquot-angela-georgia-arch-wide.webp"),
    fromGallery("river-fox-events-nxtgen-corporate-entrance-columns-side-angle.webp"),
  ],
  [
    fromGallery("river-fox-events-willy-wonka-savanna-chocolate-bar-arch.webp"),
    fromGallery("services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp", "96% 50%"),
    fromGallery("services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp"),
  ],
];
const pickHomeSet = () => {
  if (typeof window === "undefined" || navigator.webdriver) return 0; // the prerender always bakes set 1
  let last = -1;
  try { last = Number(sessionStorage.getItem("rfx-home-set") ?? localStorage.getItem("rfx-home-set") ?? -1); } catch { /* storage blocked */ }
  let next = Math.floor(Math.random() * HOME_SETS.length);
  if (next === last) next = (next + 1) % HOME_SETS.length;
  try { localStorage.setItem("rfx-home-set", String(next)); } catch { /* storage blocked */ }
  return next;
};

const ITEMS = [
  {
    title: "Children's party styling",
    body:
      "Themed backdrops, arches and party tables, set up at home or at your venue.",
    img: expChildren,
    alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts",
    href: "/childrens-parties/",
    cta: "See the parties",
    tone: "",
    badge: "Most popular",
  },
  {
    title: "Milestone celebrations",
    body:
      "Refined styling for christenings, baby showers, 40ths and anniversaries.",
    img: expMilestone,
    alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock",
    href: "/milestone-celebrations/",
    cta: "See the celebrations",
    tone: "ph-warm",
  },
  {
    title: "Corporate & brand styling",
    body:
      "Launches, openings and activations. Trusted by P&G, The Range and Foxhills.",
    img: expCorporate,
    alt: "Navy, gold and cream balloons around a Children in Need Pudsey backdrop at a corporate gala",
    href: "/corporate-brand-styling/",
    cta: "See the brand work",
    tone: "ph-blush",
    extraZoom: 1.25,
  },
];

interface ExpItem {
  title: string;
  body: string;
  img: string;
  alt: string;
  href: string;
  /** Button label under the card, e.g. "See the parties". */
  cta: string;
  tone: string;
  extraZoom?: number;
  /** Small label on the photo, e.g. "Most popular" (Matt, 2026-11-08). */
  badge?: string;
  srcSet?: string;
  position?: string;
}

const ExpCard = ({ it, i, compact }: { it: ExpItem; i: number; compact?: boolean }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const baseScale = 1.14 * (it.extraZoom ?? 1);
  useImageParallax(wrap, img, { intensity: 7, scale: baseScale });
  return (
    <a
      href={it.href}
      className="exp-card rfx-svc-card flex flex-col"
    >
      <div
        ref={wrap}
        className={`exp-img-wrap ph rounded-large ${it.tone} fade-up rfx-svc-img ${compact ? "rfx-svc-img--compact" : ""} relative overflow-hidden`}
        style={{ aspectRatio: compact ? "3/2" : "1/1" }}
      >
        {/*
          ALT TEXT: describe what is in the photo (max 125 characters, no
          brand name - CLAUDE.md). One image file, one alt across the site:
          reuse the alt the same file has elsewhere.
        */}
        <img
          ref={img}
          src={it.img}
          srcSet={it.srcSet}
          sizes={it.srcSet ? "(min-width: 768px) 31vw, calc(100vw - 56px)" : undefined}
          alt={it.alt}
          className="absolute inset-0 w-full h-full object-cover z-[2] will-change-transform"
          style={{ transform: `translate3d(0,0,0) scale(${baseScale})`, objectPosition: it.position }}
          loading="lazy"
          decoding="async"
          width={1024}
          height={1280}
        />
        {it.badge && <span className="exp-badge t-label">{it.badge}</span>}
      </div>
      <h3 className="t-h5 exp-title mt-5 md:mt-8">
        {it.title}
      </h3>
      <p className="t-small text-ink-soft max-w-[360px] title-to-text">
        {it.body}
      </p>
      <span className="btn-link-rf t-label self-start mt-auto pt-6 md:pt-9">
        {it.cta} <span className="arr">→</span>
      </span>
    </a>
  );
};

type ExperiencesProps = {
  /** Override the section heading. Defaults to the homepage copy. */
  heading?: ReactNode;
  /** Intro paragraph above the "See our work" button (town pages, Balloons).
   *  None on the homepage. */
  intro?: ReactNode;
  /** Override the section id (used for in-page anchor links). */
  sectionId?: string;
  /** Shorter, landscape photos (about half the height). Used on
   *  /balloon-installations/, where these cards repeat the homepage. */
  compactImages?: boolean;
  /** "centre": just a centred heading, no intro or button (homepage and
   *  Balloons page).
   *  "stacked": centred heading, the intro under it, then See our work (town
   *  pages). Default "split": heading left, See our work right.
   *  Matt, 2026-11-08. */
  align?: "split" | "centre" | "stacked";
  /** One of four photo sets, chosen per page load. On everywhere: this is
   *  the one services section, the same on every page (Matt, 2026-11-08). */
  rotatePhotos?: boolean;
};

const Experiences = ({
  heading,
  intro,
  sectionId = "experiences",
  compactImages = false,
  rotatePhotos = true,
  align = "split",
}: ExperiencesProps = {}) => {
  const title = heading ?? (
    <>
      Find your <em className="t-accent">occasion.</em>
    </>
  );
  const [setIndex] = useState(() => (rotatePhotos ? pickHomeSet() : 0));
  const items = rotatePhotos
    ? ITEMS.map((it, i) => ({ ...it, ...HOME_SETS[setIndex][i], extraZoom: setIndex === 0 ? it.extraZoom : undefined }))
    : ITEMS;
  return (
    <section id={sectionId} className="rfx-section white" aria-labelledby="exp-heading">
      <div className="container-rfx">
        {align === "centre" ? (
          <div className="heading-to-content text-center">
            <h2 id="exp-heading" className="t-h2 fade-up m-0 text-center">
              {title}
            </h2>
          </div>
        ) : align === "stacked" ? (
          <div className="heading-to-content text-center flex flex-col items-center">
            <h2 id="exp-heading" className="t-h2 fade-up m-0 text-center" style={{ textWrap: "balance" }}>
              {title}
            </h2>
            {intro && (
              <p className="t-lead text-ink-soft text-center max-w-[620px] heading-to-text" style={{ textWrap: "pretty" }}>{intro}</p>
            )}
            <div className="text-to-content">
              <a href="/our-work/" className="btn-ghost-rf">
                See our work <span className="t-icon">→</span>
              </a>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 heading-to-content items-end rfx-md-stack">
          <h2
            id="exp-heading"
            className="t-h2 fade-up m-0 text-center md:text-left"
          >
            {title}
          </h2>
          {/* Right column: "See our work" anchored far right (Matt, 2026-11-08).
              The homepage drops the intro line; town pages and Balloons keep
              their own intro (unique copy for search) above the button. */}
          <div className="flex flex-col items-center md:items-end gap-5 pb-3">
            {intro && (
              <p className="t-lead text-ink-soft text-center md:text-left">{intro}</p>
            )}
            <a href="/our-work/" className="btn-ghost-rf">
              See our work <span className="t-icon">→</span>
            </a>
          </div>
        </div>
        )}

        <div className="exp-grid grid grid-cols-1 md:grid-cols-3 gap-[56px]">
          {items.map((it, i) => (
            <ExpCard key={i} it={it} i={i} compact={compactImages} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experiences;
