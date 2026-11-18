import { useRef, useState, type ReactNode } from "react";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
/**
 * Service tile cards (Matt, 2026-11-18): "what I make" on the Balloons page and
 * "what I love making" on the three main service pages. A light card per tile
 * (hairline stroke, faint gradient): the photo on top, square and large, and the
 * name under it. The name is an h3 in body text (t-small), so it keeps its
 * weight for search without shouting.
 *
 * Phones: a left-aligned swipe row, about 1.6 cards in view with the next one
 * peeking in (`--tile-card-width`), and pagination dots under it. Tablet up: a
 * grid, four across, all tiles shown. Tiles are 12 or 16 so rows end full.
 * A tile links on only when it has an href - a sub-service page or a journal
 * article - and the rest stay plain names (Matt, 2026-11-09).
 *
 * History: a centred swipe row with one tile in view was replaced by a two-across
 * grid of small side-photo cards (2026-11-18), which was too small, and then by
 * this. The older three-card services layout was retired on 2026-11-08: every
 * "our services" block uses the homepage's Experiences component.
 */
export type ServiceCardItem = {
  title: string;
  /** Optional: where the tile leads (a sub-service page or a journal article).
      Leave it off and the tile is a plain name. */
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
      50/50s above its tiles). */
  divided?: boolean;
  /** An optional last card with no photo (soft peach, serif words), e.g. "Fully bespoke
      to your needs." It closes the row and is not a link. */
  endCard?: ReactNode;
};

/* Two cards per dot, so twelve or sixteen cards don't make a wall of dots. */
const CARDS_PER_DOT = 2;

const ServicesCards = ({
  items,
  heading,
  intro,
  sectionId = "services",
  headingId = "services-cards-heading",
  divided = false,
  endCard,
}: ServicesCardsProps) => {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const total = items.length + (endCard ? 1 : 0);
  const dots = Math.ceil(total / CARDS_PER_DOT);

  /* The lit dot follows how far along the row you've swiped. */
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setActive(max > 0 ? Math.round((el.scrollLeft / max) * (dots - 1)) : 0);
  };
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (i / (dots - 1)) * max, behavior: "smooth" });
  };

  return (
    <section
      id={sectionId}
      className={`rfx-section white${divided ? " rfx-divided" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        {divided && <div className="rfx-divided-rule" aria-hidden="true" />}
        {(heading || intro) && (
          <div className="text-center heading-to-content fade-up">
            {heading && <SectionHeading id={headingId}>{heading}</SectionHeading>}
            {intro && <SectionIntro>{intro}</SectionIntro>}
          </div>
        )}

        <ul ref={track} onScroll={onScroll} className="tile-card-row">
          {items.map((s) => {
            const card = (
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
                <h3 className="t-small text-ink">
                  {s.href ? <span className="text-link">{s.title}</span> : s.title}
                </h3>
              </>
            );
            return (
              <li key={s.title}>
                {s.href ? (
                  <a href={s.href} className="tile-link tile-card">{card}</a>
                ) : (
                  <div className="tile-card">{card}</div>
                )}
              </li>
            );
          })}
          {endCard && (
            <li>
              <div className="tile-card tile-card--end">{endCard}</div>
            </li>
          )}
        </ul>
        <div className="carousel-dots md:hidden" role="tablist" aria-label="Choose a tile">
          {Array.from({ length: dots }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show tiles ${i * CARDS_PER_DOT + 1} to ${Math.min((i + 1) * CARDS_PER_DOT, total)}`}
              onClick={() => goTo(i)}
              className={`tcard-dot ${i === active ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesCards;
