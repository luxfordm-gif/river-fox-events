import { useRef, useState, type ReactNode } from "react";
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
  blurb: string;
  href: string;
  /** Link label at the foot of the card. Defaults to "Discover". */
  cta?: string;
  /** Optional photo across the top of the card (the town pages' three service cards). */
  image?: string;
  srcSet?: string;
  alt?: string;
  /** CSS object-position, to keep the subject in frame when the tile crops the photo. */
  position?: string;
};

/* Bento layout (the five balloon cards on /balloon-installations/, Matt 2026-11-08).
   Desktop, 4 columns: tile 1 is 2x2 (the hero tile), tile 2 is 2x1 top right,
   tiles 3 and 4 are 1x1, tile 5 runs the full width along the bottom.
   Tablet: 2 equal columns. Phone: a swipe carousel with the next card
   peeking in and dots underneath, like the reviews (Matt, 2026-11-08). */
const BENTO_TILES = [
  { span: "lg:col-span-2 lg:row-span-2", sizes: "(min-width: 768px) 50vw, 80vw" },
  { span: "lg:col-span-2", sizes: "(min-width: 768px) 50vw, 80vw" },
  { span: "", sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw" },
  { span: "", sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw" },
  { span: "lg:col-span-4", sizes: "(min-width: 1024px) 100vw, (min-width: 768px) 50vw, 80vw" },
];

type ServicesCardsProps = {
  /** Override the three default service cards (e.g. the five balloon
   *  cards on /balloon-installations/). Five items lay out 3 + 2 on desktop. */
  items?: ServiceCardItem[];
  /** "bento": mixed tile sizes for five photo cards (see BENTO_TILES). */
  layout?: "grid" | "bento";
  heading?: ReactNode;
  intro?: ReactNode;
  sectionId?: string;
  headingId?: string;
};

const ServicesCards = ({
  items = SERVICES,
  layout = "grid",
  heading,
  intro,
  sectionId = "services",
  headingId = "services-cards-heading",
}: ServicesCardsProps = {}) => {
  const bento = layout === "bento";

  /* Phone carousel: track which card is centred so the right dot lights up. */
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onTrackScroll = () => {
    const el = track.current;
    if (!el) return;
    const centre = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    Array.from(el.children).forEach((c, i) => {
      const card = c as HTMLElement;
      const nearestCard = el.children[nearest] as HTMLElement;
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
      const best = Math.abs(nearestCard.offsetLeft + nearestCard.offsetWidth / 2 - centre);
      if (dist < best) nearest = i;
    });
    setActive(nearest);
  };
  const goTo = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

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

        <div
          ref={bento ? track : undefined}
          onScroll={bento ? onTrackScroll : undefined}
          className={
            bento
              ? // Phone: sideways swipe row that runs to the screen edges. Tablet up: the grid.
                "relative flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-8 px-8 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:grid-rows-3"
              : `grid grid-cols-1 gap-5 md:gap-7 ${items.length === 5 ? "md:grid-cols-6" : "md:grid-cols-3"}`
          }
        >
          {items.map((s: ServiceCardItem, i) => (
            <a
              key={s.title}
              href={s.href}
              className={`
                group relative flex flex-col rounded-[18px] no-underline-fx overflow-hidden
                ${s.image ? "" : "p-7 md:p-9"}
                ${bento ? `shrink-0 basis-[86%] snap-center md:basis-auto ${BENTO_TILES[i]?.span ?? ""}` : items.length === 5 ? (i < 3 ? "md:col-span-2" : "md:col-span-3") : ""}
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
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${
                    // Desktop bento: the photo grows to fill whatever height the tile has.
                    bento ? "lg:aspect-auto lg:flex-1 lg:min-h-[220px]" : ""
                  }`}
                >
                  <img
                    src={s.image}
                    srcSet={s.srcSet}
                    sizes={bento ? BENTO_TILES[i]?.sizes : "(min-width: 768px) 31vw, calc(100vw - 48px)"}
                    alt={s.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={s.position ? { objectPosition: s.position } : undefined}
                  />
                </div>
              )}
              {/* Bento: the text keeps its natural height so the photo takes up the rest of the tile. */}
              <div className={s.image ? `flex flex-col ${bento ? "lg:flex-none" : ""} flex-1 p-7 md:p-8` : "contents"}>
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

        {bento && (
          <div
            className="flex md:hidden justify-center gap-2 mt-5"
            role="tablist"
            aria-label="Choose a card"
          >
            {items.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${s.title}`}
                onClick={() => goTo(i)}
                className={`tcard-dot ${i === active ? "is-active" : ""}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesCards;
