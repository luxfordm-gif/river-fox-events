import { QUOTES } from "./Testimonials";
import logoPg from "@/assets/client-pg.webp";
import logoTheRange from "@/assets/client-the-range.png";
import logoFoxhills from "@/assets/client-foxhills.webp";

const CLIENT_LOGOS = [
  { src: logoPg, alt: "P&G", width: 600, height: 260 },
  { src: logoTheRange, alt: "The Range", width: 357, height: 76 },
  { src: logoFoxhills, alt: "Foxhills", width: 642, height: 137 },
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
          <p className="mt-4 text-[14px] text-ink-soft font-mono-rf tracking-[0.18em] uppercase">
            Recent celebrations across Surrey and Sussex
          </p>
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
            className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20 list-none p-0 m-0"
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
                  className="block h-9 md:h-10 w-auto opacity-80"
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
