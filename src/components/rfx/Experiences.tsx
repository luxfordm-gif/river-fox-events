import { useRef, useState, type ReactNode } from "react";
import expChildren from "@/assets/dinosaur-childrens-party-styling-surrey.webp";
import expMilestone from "@/assets/40th-birthday-rose-gold-marquee-surrey.webp";
import expCorporate from "@/assets/corporate-gala-styling-surrey.webp";
import { useImageParallax } from "@/hooks/useImageParallax";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { galleryPhoto } from "@/data/gallery";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
import { SERVICES_HEADING } from "@/data/servicesCopy";

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
    fromGallery("services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp", "100% 50%"),
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
    title: "Children's party decorations",
    body:
      "Themed backdrops, balloon arches and party tables, set up at home or at your venue.",
    price: "From £300.",
    img: expChildren,
    alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts",
    href: "/childrens-parties/",
    cta: "See party ideas",
    tone: "",
    badge: "Most popular",
  },
  {
    title: "Milestone birthday decorations",
    body:
      "Styling for 18ths, 40ths, 50ths, christenings and baby showers, built on site.",
    price: "From £300.",
    img: expMilestone,
    alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock",
    href: "/milestone-celebrations/",
    cta: "See milestone ideas",
    tone: "ph-warm",
  },
  {
    title: "Corporate event styling",
    body:
      "Launches, openings and brand activations, quoted to your brief. Trusted by P&G, The Range and Foxhills.",
    img: expCorporate,
    alt: "Navy, gold and cream balloons around a Children in Need Pudsey backdrop at a corporate gala",
    href: "/corporate-brand-styling/",
    cta: "See the brand work",
    tone: "ph-blush",
    extraZoom: 1.25,
  },
];

export interface ExpItem {
  title: string;
  body: string;
  /** Shown after the body, unless the section hides prices (/services/). */
  price?: string;
  img: string;
  alt: string;
  href: string;
  /** Button label under the card, e.g. "See the parties". Leave it out for
   *  a card that shows its title arrow at every width instead (/services/
   *  smaller cards). */
  cta?: string;
  tone?: string;
  extraZoom?: number;
  /** Small label on the photo, e.g. "Most popular" (Matt, 2026-11-08). */
  badge?: string;
  srcSet?: string;
  position?: string;
}

/* Phones only: each card ends in a hairline arrow at the right of its title
   and the text link under the card is hidden (Matt, 2026-11-17). From tablet
   up the text link stays. Set to false to bring the text link back on phones
   too; the full old version is also kept on the branch
   backup/services-cards-text-links. */
const PHONE_ARROWS = true;
const Arrow = () => (
  <span className="exp-arrow" aria-hidden="true">
    <svg viewBox="0 0 56 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12h53M43 2.5 54 12 43 21.5" />
    </svg>
  </span>
);

const ExpCard = ({
  it,
  compact,
  hidePrice,
  titleTag: Title = "h3",
  eager = false,
}: {
  it: ExpItem;
  compact?: boolean;
  hidePrice?: boolean;
  titleTag?: "h2" | "h3";
  /** On the first screen (/services/): load now, not lazily. */
  eager?: boolean;
}) => {
  const arrowAlways = !it.cta;
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const baseScale = 1.14 * (it.extraZoom ?? 1);
  useImageParallax(wrap, img, { intensity: 7, scale: baseScale });
  // Phones only: the photo starts a little smaller and grows to full size as
  // the card scrolls up, like the photos on the service pages (Matt,
  // 2026-11-16). Follows the scroll, finished state with reduced motion.
  useScrollProgress(
    wrap,
    (p) => {
      const phone = window.matchMedia("(max-width: 767px)").matches;
      wrap.current?.style.setProperty("--card-grow", String(phone ? p : 1));
    },
    { from: 1, to: 0.55 }
  );
  return (
    <a
      href={it.href}
      className={`exp-card rfx-svc-card flex flex-col${arrowAlways ? " exp-card--arrow" : ""}`}
    >
      <div
        ref={wrap}
        className={`exp-img-wrap ph rounded-large ${it.tone ?? ""} rfx-svc-img ${compact ? "rfx-svc-img--compact" : ""} relative overflow-hidden`}
        style={{ aspectRatio: compact ? "3/2" : "var(--service-photo-ratio)" }}
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
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          width={1024}
          height={1280}
        />
        {it.badge && <span className="exp-badge t-label">{it.badge}</span>}
      </div>
      {/* The last word drops to its own line so the title doesn't run wide
          at this size (Matt, 2026-11-17). */}
      <div className={PHONE_ARROWS || arrowAlways ? "exp-title-row media-to-title" : "contents"}>
      <Title className="t-h4 exp-title media-to-title text-pretty">
        {it.title.slice(0, it.title.lastIndexOf(" "))}
        <br />
        {it.title.slice(it.title.lastIndexOf(" ") + 1)}
      </Title>
      {(PHONE_ARROWS || arrowAlways) && <Arrow />}
      </div>
      <p className="t-small text-ink-soft measure-card title-to-text">
        {it.body}
        {it.price && !hidePrice && <> {it.price}</>}
      </p>
      {it.cta && (
        <span className={`btn-link-rf t-label self-start mt-auto card-action ${PHONE_ARROWS ? "exp-link-tablet-up" : ""}`}>
          {it.cta} <span className="arr">→</span>
        </span>
      )}
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
  /** No heading block: the page's own H1 and intro sit above the cards
   *  (/services/). `labelledBy` then names that heading, and the card
   *  titles become h2 (same look) so the outline doesn't skip a level. */
  hideHeading?: boolean;
  labelledBy?: string;
  /** Leave "From £300" off the cards (/services/ has no prices). */
  hidePrices?: boolean;
  /** Smaller cards in a row under the three (/services/): shorter photos,
   *  the title arrow at every width. */
  more?: ExpItem[];
  /** The cards are near the top of the page (/services/): the first photo
   *  loads straight away, as the largest thing on a phone's first screen. */
  eagerFirst?: boolean;
};

const Experiences = ({
  heading,
  intro,
  sectionId = "experiences",
  compactImages = false,
  rotatePhotos = true,
  align = "split",
  hideHeading = false,
  labelledBy,
  hidePrices = false,
  more,
  eagerFirst = false,
}: ExperiencesProps = {}) => {
  const title = heading ?? SERVICES_HEADING;
  const [setIndex] = useState(() => (rotatePhotos ? pickHomeSet() : 0));
  const items = rotatePhotos
    ? ITEMS.map((it, i) => ({ ...it, ...HOME_SETS[setIndex][i], extraZoom: setIndex === 0 ? it.extraZoom : undefined }))
    : ITEMS;
  return (
    <section id={sectionId} className="rfx-section white" aria-labelledby={hideHeading ? labelledBy : "exp-heading"}>
      <div className="container-rfx">
        {hideHeading ? null : align === "centre" ? (
          <div className="heading-to-content text-center flex flex-col items-center">
            <SectionHeading id="exp-heading" className="fade-up">
              {title}
            </SectionHeading>
            {intro && <SectionIntro>{intro}</SectionIntro>}
          </div>
        ) : align === "stacked" ? (
          <div className="heading-to-content text-center flex flex-col items-center">
            <SectionHeading id="exp-heading" className="fade-up">
              {title}
            </SectionHeading>
            {intro && <SectionIntro>{intro}</SectionIntro>}
            <div className="text-to-content">
              <a href="/our-work/" className="btn-ghost-rf">
                See our work <span className="t-icon">→</span>
              </a>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 columns-gap heading-to-content items-end rfx-md-stack">
          <SectionHeading id="exp-heading" align="md-left" className="fade-up text-center md:text-left">
            {title}
          </SectionHeading>
          {/* Right column: "See our work" anchored far right (Matt, 2026-11-08).
              The homepage drops the intro line; town pages and Balloons keep
              their own intro (unique copy for search) above the button. */}
          <div className="flex flex-col items-center md:items-end actions pb-3">
            {intro && (
              <p className="t-lead text-ink-soft text-center md:text-left">{intro}</p>
            )}
            <a href="/our-work/" className="btn-ghost-rf">
              See our work <span className="t-icon">→</span>
            </a>
          </div>
        </div>
        )}

        <div className="exp-grid grid grid-cols-1 md:grid-cols-3">
          {items.map((it, i) => (
            <ExpCard key={it.href} it={it} compact={compactImages} hidePrice={hidePrices} titleTag={hideHeading ? "h2" : "h3"} eager={eagerFirst && i === 0} />
          ))}
        </div>

        {more?.length ? (
          <div className="exp-grid exp-grid--more grid grid-cols-1 md:grid-cols-3">
            {more.map((it) => (
              <ExpCard key={it.href} it={it} compact hidePrice={hidePrices} titleTag={hideHeading ? "h2" : "h3"} />
            ))}
          </div>
        ) : null}

      </div>
    </section>
  );
};

export default Experiences;
