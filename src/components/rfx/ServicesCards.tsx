import type { ReactNode } from "react";
import { galleryPhoto } from "@/data/gallery";

const photo = (source: string) => {
  const p = galleryPhoto(source);
  return { image: p.src, srcSet: p.srcSet, alt: p.alt };
};

/**
 * Stripped-back services cross-link block. Used on location pages where
 * the full Experiences component (with parallax photography) would feel
 * repetitive next to the homepage. Three minimal cards - title, short
 * blurb, arrow - with a soft pinky-peach stroke and gentle drop shadow.
 */
const SERVICES = [
  {
    title: "Children's Party Styling",
    blurb:
      "Backdrops, balloon garlands and props built around your child's theme, from dinosaurs to fairy first birthdays, set up before guests arrive.",
    href: "/childrens-parties/",
    cta: "See children's parties",
    ...photo("river-fox-events-jungle-theme-fourever-wild-full-setup.webp"),
  },
  {
    title: "Milestone Celebrations",
    blurb:
      "Light-up numbers, garlands and personalised boards for 18ths, 40ths, christenings and baby showers.",
    href: "/milestone-celebrations/",
    cta: "See milestones",
    ...photo("services/milestones/13th-birthday-pink-light-up-numbers-garland.webp"),
  },
  {
    title: "Corporate Installations",
    blurb:
      "Branded arches, entrance columns and photo walls for launches, galas and office parties, in your brand colours.",
    href: "/corporate-brand-styling/",
    cta: "See corporate work",
    ...photo("river-fox-events-theatre-125-anniversary-marquee-wide.webp"),
  },
];

export type ServiceCardItem = {
  title: string;
  /** Card description. Not shown in the "tiles" layout. */
  blurb?: string;
  href: string;
  /** Link label at the foot of the card. Defaults to "Discover". */
  cta?: string;
  /** Optional photo across the top of the card (the town pages' three service cards). */
  image?: string;
  srcSet?: string;
  alt?: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  position?: string;
};

type ServicesCardsProps = {
  /** Override the three default service cards (e.g. the balloon tiles
   *  on /balloon-installations/). */
  items?: ServiceCardItem[];
  /** "tiles": a compact grid of small square photos with just the name
   *  underneath, each linking on (the balloon page's "What we make"). */
  layout?: "cards" | "tiles";
  heading?: ReactNode;
  intro?: ReactNode;
  sectionId?: string;
  headingId?: string;
};

const ServicesCards = ({
  items = SERVICES,
  layout = "cards",
  heading,
  intro,
  sectionId = "services",
  headingId = "services-cards-heading",
}: ServicesCardsProps = {}) => {
  return (
    <section
      id={sectionId}
      className="rfx-section white"
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        {(heading || intro) && (
          <div className="text-center max-w-[760px] mx-auto mb-12 md:mb-16 fade-up">
            {heading && (
              <h2
                id={headingId}
                className="font-serif-rf"
                style={{
                  fontSize: "var(--fs-h2)",
                  lineHeight: 1.05,
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                  textWrap: "balance",
                }}
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p
                className="mt-6 max-w-[560px] mx-auto text-[16px] leading-[1.65] text-ink-soft"
                style={{ textWrap: "pretty" }}
              >
                {intro}
              </p>
            )}
          </div>
        )}

        {layout === "tiles" ? (
          /* Simple tile grid (Matt, 2026-11-08): small square photo, just the name,
             the whole tile links to the service. 2 across on phones, 4 from tablet up. */
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-7 md:gap-y-10 max-w-[1040px] mx-auto list-none p-0">
            {items.map((s) => (
              <li key={s.title}>
                <a href={s.href} className="group block no-underline-fx">
                  <div className="relative aspect-square overflow-hidden rounded-[14px]">
                    {s.image && (
                      <img
                        src={s.image}
                        srcSet={s.srcSet}
                        sizes="(min-width: 1100px) 240px, (min-width: 768px) 22vw, 45vw"
                        alt={s.alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        style={s.position ? { objectPosition: s.position } : undefined}
                      />
                    )}
                  </div>
                  <h3
                    className="mt-3 md:mt-4 text-center font-serif-rf text-ink transition-colors duration-300 group-hover:text-accent-warm"
                    style={{ fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.2, fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    {s.title}
                  </h3>
                </a>
              </li>
            ))}
          </ul>
        ) : (
        <div className="grid grid-cols-1 gap-5 md:gap-7 md:grid-cols-3">
          {items.map((s: ServiceCardItem) => (
            <a
              key={s.title}
              href={s.href}
              className={`
                group relative flex flex-col rounded-[18px] no-underline-fx overflow-hidden
                ${s.image ? "" : "p-7 md:p-9"}
                transition-all duration-300 ease-out
                hover:-translate-y-[2px]
                hover:shadow-[0_14px_36px_-14px_hsl(var(--ink)/0.18)]
                hover:border-[hsl(var(--accent-warm)/0.65)]
              `}
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--accent-warm) / 0.35)",
                boxShadow: "0 6px 22px -14px hsl(var(--ink) / 0.12)",
              }}
            >
              {s.image && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    srcSet={s.srcSet}
                    sizes="(min-width: 768px) 31vw, calc(100vw - 48px)"
                    alt={s.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className={s.image ? "flex flex-col flex-1 p-7 md:p-8" : "contents"}>
              <h3
                className="font-serif-rf text-ink"
                style={{
                  fontSize: "var(--fs-h4)",
                  lineHeight: 1.18,
                  fontWeight: 400,
                  letterSpacing: "-0.012em",
                }}
              >
                {s.title}
              </h3>
              <p
                className={`${s.image ? "mt-2" : "mt-4"} text-[14.5px] leading-[1.6] text-ink-soft flex-1`}
                style={{ textWrap: "pretty" }}
              >
                {s.blurb}
              </p>
              {/* Same link style as the homepage cards (normal case, underlined), easier to read than spaced capitals (Matt, 2026-11-07). */}
              <span className="btn-link-rf self-start mt-7" style={{ fontWeight: 600 }}>
                {s.cta ?? "Discover"} <span className="arr">→</span>
              </span>
              </div>
            </a>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default ServicesCards;
