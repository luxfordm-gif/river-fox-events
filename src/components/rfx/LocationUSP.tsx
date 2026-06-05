import { useEffect, useRef, useState } from "react";
import { ICON_REGISTRY, type IncludedIconKey } from "./CPIncluded";

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
    body: "We've styled celebrations across Surrey for eight years, with more than 400 events brought to life.",
  },
  {
    icon: "palette",
    label: "Full-service styling",
    body: "One studio for the whole look - concept, design and every styled detail handled in-house.",
  },
  {
    icon: "heart",
    label: "Planning made calm",
    body: "We take the stress out of organising, guiding each decision so you can simply enjoy the lead-up.",
  },
  {
    icon: "sparkle",
    label: "Setup and collection",
    body: "We deliver, install and return to clear everything away afterwards. Nothing for you to set up or carry.",
  },
];

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
      style={{ paddingTop: 0, paddingBottom: "80px" }}
      aria-label="Why choose River Fox Events"
    >
      <div className="container-rfx">
        <div className="text-center heading-to-body">
          <h2
            className="font-serif-rf"
            style={{
              fontSize: "clamp(34px, 3.6vw, 56px)",
              lineHeight: 1.05,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Why choose{" "}
            <em className="italic font-light text-accent-warm">
              River Fox Events?
            </em>
          </h2>
        </div>
        <p
          className="mx-auto max-w-[680px] text-center text-[16px] leading-[1.75] text-ink-soft fade-up"
          style={{ textWrap: "pretty" }}
        >
          {body ?? (
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
        </p>

        <div
          ref={ref}
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6"
        >
          {TRUST_POINTS.map(({ icon, label, body: pointBody }, i) => {
            const Icon = ICON_REGISTRY[icon];
            return (
              <div
                key={label}
                className="flex flex-col items-center text-center px-4"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity .9s cubic-bezier(.22,.7,.2,1) ${
                    i * 120
                  }ms, transform .9s cubic-bezier(.22,.7,.2,1) ${i * 120}ms`,
                }}
              >
                <div
                  className="flex items-center justify-center mb-5"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "hsl(var(--surface-warm))",
                    color: "hsl(var(--accent-warm))",
                  }}
                >
                  <Icon strokeWidth={1.4} size={26} />
                </div>
                <h3
                  className="font-serif-rf text-ink"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1.15,
                    fontWeight: 400,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {label}
                </h3>
                <p
                  className="text-[14px] leading-[1.6] text-ink-soft mt-2.5 max-w-[240px]"
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
