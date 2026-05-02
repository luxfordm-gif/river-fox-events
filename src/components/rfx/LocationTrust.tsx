import { QUOTES } from "./Testimonials";
import logoPg from "@/assets/client-pg.webp";
import logoTheRange from "@/assets/client-the-range.png";
import logoFoxhills from "@/assets/client-foxhills.webp";

/**
 * Logos sit at different bounding-box heights on purpose. P&G is a
 * stacked mark with a 2.3:1 ratio; The Range and Foxhills are
 * horizontal wordmarks at ~4.7:1. Rendering all three at one common
 * height makes P&G look small and lonely. Per-logo heights below are
 * tuned so the marks read as visually equal in weight on the row.
 */
const CLIENT_LOGOS = [
  {
    src: logoPg,
    alt: "P&G",
    width: 600,
    height: 260,
    // ~48px → 56px tall; widest end gives the stacked mark proper presence
    sizeClass: "h-12 md:h-[56px]",
  },
  {
    src: logoTheRange,
    alt: "The Range",
    width: 357,
    height: 76,
    sizeClass: "h-7 md:h-8",
  },
  {
    src: logoFoxhills,
    alt: "Foxhills",
    width: 640,
    height: 133,
    sizeClass: "h-7 md:h-8",
  },
];

const Stars = () => (
  <span className="tcard-stars" aria-label="Five stars">
    {"★★★★★"}
  </span>
);

const LocationTrust = () => {
  return (
    <section
      id="trust"
      className="rfx-section"
      aria-labelledby="trust-heading"
    >
      <div className="container-rfx">
        <div className="text-center mb-8 md:mb-10">
          <h2
            id="trust-heading"
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 4.2vw, 76px)",
              lineHeight: 1.04,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            Kind <em className="italic font-light text-accent-warm">words.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 sm:px-8 md:px-16 lg:px-0">
          {QUOTES.map((t, i) => (
            <figure key={i} className="tcard fade-up">
              <Stars />
              <blockquote className="tcard-quote font-thin text-ink-soft">{t.q}</blockquote>
              <figcaption className="tcard-meta">
                <span className="name">{t.a}</span>
                <span>{t.loc}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-ink/10">
          <p className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft text-center">
            Recent clients include
          </p>
          <ul
            className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 md:gap-x-24 list-none p-0 m-0"
            aria-label="Recent clients"
          >
            {CLIENT_LOGOS.map((c) => (
              <li key={c.alt} className="flex items-center justify-center">
                <img
                  src={c.src}
                  alt={c.alt}
                  width={c.width}
                  height={c.height}
                  loading="lazy"
                  decoding="async"
                  className={`block w-auto ${c.sizeClass}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LocationTrust;
