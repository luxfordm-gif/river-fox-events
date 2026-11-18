import { useState, type ReactNode } from "react";
import ShowMoreButton from "@/components/rfx/ShowMoreButton";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
/**
 * Service tile cards (Matt, 2026-11-18): "what I make" on the Balloons page and
 * "what I love making" on the three main service pages. A light card per tile
 * (hairline stroke, faint gradient), a small square photo on the left and the
 * name on the right. The name is an h3 in body text (t-small), so it keeps its
 * weight for search without shouting. Two across on phones and tablets, four
 * across from 1100px, running wider than the page margin.
 *
 * `initialCount` shows that many, then a compact "Show more" slides the rest
 * down. Keep the tile count even so every row ends full (12 or 16; the main
 * pages use 8 shown). A tile links on only when it has an href - a sub-service
 * page or a journal article - and the rest stay plain names (Matt, 2026-11-09).
 * Names must fit two lines at 360px wide: check no h3 overflows.
 *
 * This replaced the phone swipe carousel on 2026-11-18, and the older
 * three-card services layout before it (retired 2026-11-08). Don't bring either
 * back: every "our services" block uses the homepage's Experiences component.
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
  /** Show this many, then a "Show more" that slides the rest down. */
  initialCount?: number;
};

const ServicesCards = ({
  items,
  heading,
  intro,
  sectionId = "services",
  headingId = "services-cards-heading",
  divided = false,
  initialCount,
}: ServicesCardsProps) => {
  const [expanded, setExpanded] = useState(false);
  const firstItems = initialCount ? items.slice(0, initialCount) : items;
  const moreItems = initialCount ? items.slice(initialCount) : [];

  const renderItem = (s: ServiceCardItem) => {
    const card = (
      <>
        <div className="relative aspect-square overflow-hidden rounded-large">
          {s.image && (
            <img
              src={s.image}
              srcSet={s.srcSet}
              sizes="96px"
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

        <ul className="tile-card-grid">{firstItems.map(renderItem)}</ul>
        {moreItems.length > 0 && (
          <>
            <div className="tile-more" data-state={expanded ? "open" : "closed"}>
              <div className="tile-more__inner">
                <ul className="tile-card-grid" aria-hidden={!expanded}>
                  {moreItems.map(renderItem)}
                </ul>
              </div>
            </div>
            {!expanded && <ShowMoreButton compact onClick={() => setExpanded(true)} />}
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesCards;
