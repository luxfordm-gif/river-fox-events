import { QUOTES } from "./Testimonials";

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

        <div className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-ink/10 text-center">
          <p className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft">
            Recent clients include
          </p>
          <p
            className="mt-4 font-serif-rf text-ink"
            style={{
              fontSize: "clamp(20px, 1.6vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            P&amp;G &nbsp;·&nbsp; The Range &nbsp;·&nbsp; Foxhills
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationTrust;
