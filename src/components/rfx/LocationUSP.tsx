import { useEffect, useRef, useState } from "react";
import { ICON_REGISTRY, type IncludedIconKey } from "./CPIncluded";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";

type LocationUSPProps = {
  cityName?: string;
  /** Per-town paragraph. This block is the most prominent body text on a
   *  location page, so Google tends to pull it as the search snippet -
   *  pass a unique value per town so results don't all look identical.
   *  Falls back to the generic templated copy below when omitted. */
  body?: string;
};

/**
 * The practical "realistically, why us?" reasons. These are genuine,
 * universal service facts (experience, full service, stress-free planning,
 * setup and collection), so they're intentionally the same on every
 * location page - they sit beneath the unique per-town paragraph above,
 * which is the text Google uses for search snippets. The "eight years" and
 * "400+ events" figures match the homepage About stats - keep them in sync.
 */
const TRUST_POINTS: { icon: IncludedIconKey; label: string; body: string }[] = [
  {
    icon: "badge",
    label: "Eight years in Surrey",
    body: "More than 400 events styled across Surrey.",
  },
  {
    icon: "palette",
    label: "Full-service styling",
    body: "Concept, design and every detail, in-house.",
  },
  {
    icon: "heart",
    label: "Calm from start to finish",
    body: "One point of contact, from first idea to the day.",
  },
  {
    icon: "sparkle",
    label: "Setup and collection",
    body: "Installed before guests arrive, cleared away after.",
  },
];

const firstSentence = (text: string) => text.match(/^.*?[.?!](?=\s|$)/)?.[0] ?? text;

const LocationUSP = ({ cityName, body }: LocationUSPProps = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(el);
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

        <div
          ref={ref}
          className="text-to-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 cards-gap"
        >
          {TRUST_POINTS.map(({ icon, label, body: pointBody }, i) => {
            const Icon = ICON_REGISTRY[icon];
            return (
              <div
                key={label}
                className="flex flex-col items-center text-center card-inset"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity .9s cubic-bezier(.22,.7,.2,1) ${
                    i * 120
                  }ms, transform .9s cubic-bezier(.22,.7,.2,1) ${i * 120}ms`,
                }}
              >
                <div className="flex items-center justify-center icon-above w-16 h-16 rounded-full bg-surface-warm text-accent-warm">
                  <Icon strokeWidth={1.4} size={26} />
                </div>
                <h3 className="t-h6 text-ink">
                  {label}
                </h3>
                <p
                  className="t-small text-ink-soft title-to-text max-w-[240px]"
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
