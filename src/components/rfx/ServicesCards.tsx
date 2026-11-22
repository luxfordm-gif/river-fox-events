import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Viewer, type ViewerItem } from "@/components/rfx/PhotoViewer";
import { trackTileSwipe } from "@/lib/track";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
/**
 * Service tile cards (Matt, 2026-11-18): "what I make" on the Balloons page and
 * "what I love making" on the three main service pages. A light card per tile
 * (hairline stroke, faint gradient): the photo on top, square and large, and the
 * name under it. The name is an h3 in body text (t-small), so it keeps its
 * weight for search without shouting.
 *
 * Phones: a centred swipe row, about 1.6 cards in view with a neighbour
 * peeking in on both sides (`--tile-card-width`), and pagination dots under
 * it. The row loops like "Kind words": the last card sits to the left of the
 * first, so there is never an empty space (Matt, 2026-11-22). Tablet up: a
 * grid, four across, all tiles shown. Tiles are 12 or 16 so rows end full.
 * Tiles are plain names, never links (Matt, 2026-11-18: a tap that opened a
 * journal article was unexpected). A tap opens the photo larger in the same
 * full-screen viewer as /our-work/ and the town pages (arrows, swipe, Esc).
 * On a mouse, a card lifts and tilts toward the pointer.
 *
 * History: a centred swipe row with one tile in view was replaced by a two-across
 * grid of small side-photo cards (2026-11-18), which was too small, and then by
 * this. The older three-card services layout was retired on 2026-11-08: every
 * "our services" block uses the homepage's Experiences component.
 */
/* A tile is a resolved Our work photo plus its short name, so the same item opens
   in the full-screen viewer. */
export type ServiceCardItem = ViewerItem;

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
  /** Optional content under the tiles, centred (e.g. a "See our work" button). */
  footer?: ReactNode;
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
  footer,
}: ServicesCardsProps) => {
  /* The same looping carousel as the reviews, on phones only: from tablet up
     it is switched off and the row is a plain grid. */
  const [viewport, api] = useEmblaCarousel({
    align: "center",
    loop: true,
    breakpoints: { "(min-width: 768px)": { active: false } },
  });
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dots = Math.ceil(items.length / CARDS_PER_DOT);

  /* The lit dot follows the card in the middle; the first move along a row
     is counted once (tile_swipe). */
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const i = api.selectedScrollSnap();
      setActive(Math.floor(i / CARDS_PER_DOT));
      if (i > 0) trackTileSwipe(api.containerNode());
    };
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);
  const goTo = (i: number) => api?.scrollTo(i * CARDS_PER_DOT);

  const openAt = (i: number) => () => setOpen(i);

  /* Mouse only: lean the card toward the pointer (a fraction -0.5 to 0.5 across
     the card, which the CSS multiplies by --tile-card-tilt). */
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tilt-x", String(-((e.clientY - r.top) / r.height - 0.5)));
    el.style.setProperty("--tilt-y", String((e.clientX - r.left) / r.width - 0.5));
  };
  const untilt = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--tilt-x", "0");
    e.currentTarget.style.setProperty("--tilt-y", "0");
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

        <div ref={viewport} className="tile-card-viewport">
        <ul className="tile-card-row">
          {items.map((s, i) => (
            <li key={s.title}>
              <div className="tile-card" data-track-photo={s.source} data-track-text={s.title} onClick={openAt(i)} onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="relative aspect-square overflow-hidden rounded-large">
                  <img
                    src={s.src}
                    srcSet={s.srcSet}
                    sizes="(min-width: 1100px) 320px, (min-width: 768px) 22vw, 60vw"
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={s.position ? { objectPosition: s.position } : undefined}
                  />
                  <button type="button" className="absolute inset-0" aria-label={`View larger: ${s.title}`} />
                </div>
                <h3 className="t-small text-ink">{s.title}</h3>
              </div>
            </li>
          ))}
        </ul>
        </div>
        <div className="carousel-dots md:hidden" role="tablist" aria-label="Choose a tile">
          {Array.from({ length: dots }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show tiles ${i * CARDS_PER_DOT + 1} to ${Math.min((i + 1) * CARDS_PER_DOT, items.length)}`}
              onClick={() => goTo(i)}
              className={`tcard-dot ${i === active ? "is-active" : ""}`}
            />
          ))}
        </div>
        {footer && <div className="text-to-action flex justify-center">{footer}</div>}
      </div>
      {open !== null && (
        <Viewer items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
};

export default ServicesCards;
