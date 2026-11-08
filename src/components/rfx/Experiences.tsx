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
      "Immersive themed parties designed to feel magical for children - and completely effortless for you.",
    img: expChildren,
    alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts",
    href: "/childrens-parties/",
    cta: "See the parties",
    tone: "",
  },
  {
    title: "Milestone celebrations",
    body:
      "Refined styling for life's biggest moments, from christenings and baby showers to 40ths and anniversaries.",
    img: expMilestone,
    alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock",
    href: "/milestone-celebrations/",
    cta: "See the celebrations",
    tone: "ph-warm",
  },
  {
    title: "Corporate & brand styling",
    body:
      "Thoughtfully styled installations for launches, openings and activations. Trusted by P&G, The Range, Foxhills and more.",
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
      className={`exp-card rfx-svc-card flex flex-col gap-2 md:gap-4 px-7 ${i > 0 ? "md:border-l" : ""} border-ink/10`}
    >
      <div
        ref={wrap}
        className={`exp-img-wrap ph rounded-media ${it.tone} fade-up rfx-svc-img ${compact ? "rfx-svc-img--compact" : ""} relative overflow-hidden`}
        style={{ aspectRatio: compact ? "3/2" : "4/5" }}
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
      </div>
      <h3 className="t-h4 exp-title mt-3 md:mt-4">
        {it.title}
      </h3>
      <p className="t-body-sm text-ink-soft max-w-[360px]">
        {it.body}
      </p>
      <span className="btn-link-rf t-ui self-start mt-auto pt-4 md:pt-6">
        {it.cta} <span className="arr">→</span>
      </span>
    </a>
  );
};

type ExperiencesProps = {
  /** Override the section heading. Defaults to the homepage copy. */
  heading?: ReactNode;
  /** Override the right-column intro paragraph. */
  intro?: ReactNode;
  /** Override the section id (used for in-page anchor links). */
  sectionId?: string;
  /** Show the "Just after a balloon arch or garland?" line under the cards.
   *  Off on /balloon-installations/ itself. */
  showBalloonLink?: boolean;
  /** Shorter, landscape photos (about half the height). Used on
   *  /balloon-installations/, where these cards repeat the homepage. */
  compactImages?: boolean;
  /** Homepage: show one of four photo sets, chosen per page load. */
  rotatePhotos?: boolean;
};

const Experiences = ({
  heading,
  intro,
  sectionId = "experiences",
  showBalloonLink = true,
  compactImages = false,
  rotatePhotos = false,
}: ExperiencesProps = {}) => {
  const [setIndex] = useState(() => (rotatePhotos ? pickHomeSet() : 0));
  const items = rotatePhotos
    ? ITEMS.map((it, i) => ({ ...it, ...HOME_SETS[setIndex][i], extraZoom: setIndex === 0 ? it.extraZoom : undefined }))
    : ITEMS;
  return (
    <section id={sectionId} className="rfx-section white" aria-labelledby="exp-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 mb-10 md:mb-16 items-end rfx-md-stack">
          <h2
            id="exp-heading"
            className="t-h2 fade-up m-0 text-center md:text-left"
          >
            {heading ?? (
              <>
                Our signature{" "}
                <em className="t-accent">experiences.</em>
              </>
            )}
          </h2>
          <p className="t-lead text-ink-soft pb-3 text-center md:text-left mx-auto md:mx-0">
            {intro ??
              "Our work centres on three core experiences: children's parties, milestone celebrations and corporate installations. Each one is individually designed, with a focus on aesthetic, flow and detail."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[56px] md:gap-0 md:border-t md:border-ink/20 pt-0 md:pt-12">
          {items.map((it, i) => (
            <ExpCard key={i} it={it} i={i} compact={compactImages} />
          ))}
        </div>

        {showBalloonLink ? (
          <p className="t-body-sm mt-12 md:mt-14 text-center text-ink-soft fade-up">
            Just after a balloon arch or garland?{" "}
            <a href="/balloon-installations/" className="btn-link-rf t-ui ml-1">
              Balloon installations <span className="arr">→</span>
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default Experiences;
