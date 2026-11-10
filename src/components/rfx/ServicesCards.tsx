import type { ReactNode } from "react";
import { useSwipeDots } from "@/hooks/useSwipeDots";
/**
 * Photo tiles: a grid of small square photos with just the name underneath
 * (the balloon page's "What we make", and "What we do" on the three main
 * service pages). A tile links on only when it has an href - a sub-service
 * page or a journal article - and the rest stay plain names (Matt,
 * 2026-11-09). Phones get a swipe carousel with dots.
 *
 * The old three-card services layout that lived here was retired on
 * 2026-11-08 (Matt): every "our services" section uses the homepage's
 * Experiences component, with its rotating photos, so it looks the same
 * everywhere. Don't bring a second version back.
 */
export type ServiceCardItem = {
  title: string;
  /** Optional: where the tile leads (a sub-service page or a journal article).
      Leave it off and the tile is a plain name, as on the balloon page. */
  href?: string;
  image?: string;
  srcSet?: string;
  alt?: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  position?: string;
};

type ServicesCardsProps = {
  items: ServiceCardItem[];
  heading?: ReactNode;
  intro?: ReactNode;
  sectionId?: string;
  headingId?: string;
  /** A soft divider halfway through the gap above, separating the tiles from
      the 50/50 sections (Matt, 2026-11-09: every service page that has
      50/50s above its tiles, the balloon page included once its intro
      became two 50/50s). */
  divided?: boolean;
};

const ServicesCards = ({
  items,
  heading,
  intro,
  sectionId = "services",
  headingId = "services-cards-heading",
  divided = false,
}: ServicesCardsProps) => {
  /* Tiles on phones: a swipe row; the dot of the tile nearest the centre lights up. */
  const { track, active, onScroll: onTrackScroll, goTo } = useSwipeDots();

  return (
    <section
      id={sectionId}
      className={`rfx-section white${divided ? " rfx-divided" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        {divided && <div className="rfx-divided-rule" aria-hidden="true" />}
        {(heading || intro) && (
          <div className="text-center max-w-[760px] mx-auto mb-12 md:mb-16 fade-up">
            {heading && (
              <h2
                id={headingId}
                className="t-h2"
                style={{ textWrap: "balance" }}
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p
                className="t-lead heading-to-text max-w-[560px] mx-auto text-ink-soft"
                style={{ textWrap: "pretty" }}
              >
                {intro}
              </p>
            )}
          </div>
        )}

        {/* Small square photo and the name. Plain tiles have no hover (Matt,
            2026-11-08); a tile with an href is a link, its name underlined
            like every text link and its photo easing in by 5% on hover.
            Phones: a swipe carousel to the screen edges, next tile peeking
            in, dots underneath. Tablet up: 4 across. */}
          <>
          <ul
            ref={track}
            onScroll={onTrackScroll}
            className="relative flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-8 px-5 scroll-px-5 list-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-x-7 md:gap-y-10 md:max-w-[1040px] md:mx-auto md:px-0 md:overflow-visible"
          >
            {items.map((s) => {
              const tile = (
                <>
                  <div className="relative aspect-square overflow-hidden rounded-large">
                    {s.image && (
                      <img
                        src={s.image}
                        srcSet={s.srcSet}
                        sizes="(min-width: 1100px) 240px, (min-width: 768px) 22vw, 60vw"
                        alt={s.alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        className="tile-img absolute inset-0 w-full h-full object-cover"
                        style={s.position ? { objectPosition: s.position } : undefined}
                      />
                    )}
                  </div>
                  <h3
                    className="t-h6 mt-3 md:mt-4 text-center text-ink"
                  >
                    {s.href ? <span className="text-link">{s.title}</span> : s.title}
                  </h3>
                </>
              );
              return (
                <li key={s.title} className="shrink-0 basis-[62%] snap-center md:basis-auto">
                  {s.href ? (
                    <a href={s.href} className="tile-link block">{tile}</a>
                  ) : (
                    <div className="block">{tile}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex md:hidden justify-center gap-2 mt-6" role="tablist" aria-label="Choose a tile">
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
          </>
      </div>
    </section>
  );
};

export default ServicesCards;
