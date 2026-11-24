import { useEffect, useRef, useState } from "react";
import badge128 from "@/assets/usp-icons/eight-years-in-surrey-icon-128.webp";
import badge256 from "@/assets/usp-icons/eight-years-in-surrey-icon-256.webp";
import palette128 from "@/assets/usp-icons/full-service-styling-icon-128.webp";
import palette256 from "@/assets/usp-icons/full-service-styling-icon-256.webp";
import heart128 from "@/assets/usp-icons/calm-from-start-to-finish-icon-128.webp";
import heart256 from "@/assets/usp-icons/calm-from-start-to-finish-icon-256.webp";
import sparkle128 from "@/assets/usp-icons/setup-and-collection-icon-128.webp";
import sparkle256 from "@/assets/usp-icons/setup-and-collection-icon-256.webp";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";

type LocationUSPProps = {
  cityName?: string;
  /** Per-town paragraph. This block is the most prominent body text on a
   *  location page, so Google tends to pull it as the search snippet -
   *  pass a unique value per town so results don't all look identical.
   *  Falls back to the generic templated copy below when omitted. */
  body?: string;
  /** No line under the heading, just the four points (/services/: the town
   *  pages' line is each town's own, Matt 2026-11-24). */
  noIntro?: boolean;
};

/**
 * The practical "realistically, why us?" reasons. These are genuine,
 * universal service facts (experience, full service, stress-free planning,
 * setup and collection), so they're intentionally the same on every
 * location page - they sit beneath the unique per-town paragraph above,
 * which is the text Google uses for search snippets. The "eight years" and
 * "400+ events" figures match the homepage About stats - keep them in sync.
 */
const TRUST_POINTS: { icon: { s1: string; s2: string }; label: string; body: string }[] = [
  {
    icon: { s1: badge128, s2: badge256 },
    label: "Eight years in Surrey",
    body: "More than 400 events styled across Surrey.",
  },
  {
    icon: { s1: palette128, s2: palette256 },
    label: "Full-service styling",
    body: "Concept, design and every detail, in-house.",
  },
  {
    icon: { s1: heart128, s2: heart256 },
    label: "Calm throughout",
    body: "One point of contact, from first idea to the day.",
  },
  {
    icon: { s1: sparkle128, s2: sparkle256 },
    label: "Setup and collection",
    body: "Installed before guests arrive, cleared away after.",
  },
];

const firstSentence = (text: string) => text.match(/^.*?[.?!](?=\s|$)/)?.[0] ?? text;

const LocationUSP = ({ cityName, body, noIntro = false }: LocationUSPProps = {}) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shown, setShown] = useState<boolean[]>(() => TRUST_POINTS.map(() => false));
  // Side by side from 1024px up: stagger them. Stacked on phones and tablets: each fades as it scrolls in.
  const [inRow, setInRow] = useState(false);

  useEffect(() => {
    setInRow(window.matchMedia("(min-width: 1024px)").matches);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = itemRefs.current.indexOf(e.target as HTMLDivElement);
          if (i >= 0) setShown((prev) => prev.map((v, j) => (j === i ? true : v)));
          io.unobserve(e.target);
        });
      },
      // Wait until about half the item is on screen and a little clear of the bottom edge, so the fade is seen.
      { threshold: 0.5, rootMargin: "0px 0px -8% 0px" }
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="why-river-fox"
      className="rfx-section white"
      aria-label="Why River Fox Events"
    >
      <div className="container-rfx">
        <div className="text-center">
          <SectionHeading>
            Why{" "}
            <em className="t-accent">
              River Fox Events?
            </em>
          </SectionHeading>
        </div>
        {!noIntro && (
        <SectionIntro className="text-center text-ink-soft fade-up">
          {/* First sentence only: still unique per town, half the words (Matt, 2026-11-07). */}
          {body ? firstSentence(body) : (
            <>
              River Fox Events is known for creating thoughtfully styled
              celebrations
              {cityName ? ` in ${cityName}` : ""} that feel cohesive and
              effortlessly brought together. With a focus on statement
              installations and refined styling, each event is tailored to
              your space and vision - resulting in a finish that feels
              considered, distinctive and ready to be enjoyed.
            </>
          )}
        </SectionIntro>
        )}

        <div
          className="text-to-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 cards-gap"
        >
          {TRUST_POINTS.map(({ icon, label, body: pointBody }, i) => {
            return (
              <div
                key={label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="usp-item text-center card-inset motion-reduce:!opacity-100"
                style={{
                  opacity: shown[i] ? 1 : 0,
                  transition: `opacity var(--motion-reveal) var(--ease-soft) calc(var(--motion-stagger) * ${
                    inRow ? i : 0
                  })`,
                }}
              >
                <img
                  src={icon.s1}
                  srcSet={`${icon.s1} 128w, ${icon.s2} 256w`}
                  sizes="64px"
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  className="icon-above w-16 h-16 rounded-full"
                />
                <h3 className="t-h5 text-ink text-balance">
                  {label}
                </h3>
                <p
                  className="t-small text-ink-soft usp-title-to-text measure-card"
                  style={{ textWrap: "pretty" }}
                >
                  {pointBody}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LocationUSP;
