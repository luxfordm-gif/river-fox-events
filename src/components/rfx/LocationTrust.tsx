import TestimonialsCarousel from "./TestimonialsCarousel";
import type { Review } from "@/seo/routes";
import logoPg from "@/assets/client-pg.webp";
import logoTheRange from "@/assets/client-the-range.webp";
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
    // P&G is a stacked mark - kept noticeably taller than the wordmarks
    // but pulled back from the previous 48–56px so it doesn't dominate
    // the row visually.
    sizeClass: "h-[34px] md:h-[42px]",
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

type LocationTrustProps = {
  /** Show a chosen subset of reviews. Defaults to every review. */
  reviews?: Review[];
};

const LocationTrust = ({ reviews }: LocationTrustProps = {}) => {
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
            className="t-h2"
          >
            Kind <em className="t-accent">words.</em>
          </h2>
        </div>

        <TestimonialsCarousel reviews={reviews} />

        <div className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-ink/10">
          <p className="t-eyebrow text-ink-soft text-center">
            Recent clients include
          </p>
          <ul
            className="mt-8 grid grid-cols-3 items-center gap-x-6 gap-y-8 md:gap-x-12 list-none p-0 m-0"
            aria-label="Recent clients"
          >
            {CLIENT_LOGOS.map((c) => (
              <li key={c.alt} className="flex items-center justify-center min-w-0">
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
