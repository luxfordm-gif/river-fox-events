const QUOTES = [
  {
    q: "Everyone commented on how amazing it all looked — it was even better than I had imagined. The whole day felt effortless.",
    a: "Laura",
    loc: "Reigate, Surrey",
  },
  {
    q: "It's gorgeous — thank you for matching it so closely to the picture I sent. It exceeded every expectation. You made my whole day.",
    a: "Daniela",
    loc: "Surrey",
  },
  {
    q: "The display was so beautiful, every guest loved it. You're a star as always — I wouldn't trust anyone else with our family's celebrations.",
    a: "Anna",
    loc: "Camberley, Surrey",
  },
];

const Stars = () => (
  <span className="tcard-stars" aria-label="Five stars">
    {"★★★★★"}
  </span>
);

type TestimonialsProps = {
  noDivider?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
};

const Testimonials = ({
  noDivider = false,
  paddingTop,
  paddingBottom,
}: TestimonialsProps = {}) => {
  return (
    <section
      id="kindness"
      className="rfx-section"
      style={{ paddingTop, paddingBottom }}
      aria-labelledby="kindness-heading"
    >
      <div className="container-rfx">
        {!noDivider && (
          <div className="hairline mb-12 md:mb-16 hidden md:block" aria-hidden="true" />
        )}
        <div className="text-center mb-8 md:mb-10">
          <h2
            id="kindness-heading"
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
      </div>
    </section>
  );
};

export default Testimonials;
