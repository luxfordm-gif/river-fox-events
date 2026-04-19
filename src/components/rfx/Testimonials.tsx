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

const Testimonials = () => {
  return (
    <section
      id="kindness"
      className="rfx-section blush"
      aria-labelledby="kindness-heading"
    >
      <div className="container-rfx">
        <div className="text-center mb-14">
          <h2
            id="kindness-heading"
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 5.4vw, 84px)",
              lineHeight: 1.04,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            Kind <em className="italic font-light text-accent-warm">words.</em>
          </h2>
          <p className="text-[15.5px] leading-[1.6] text-ink-soft max-w-[480px] mx-auto mt-6">
            Every quote is genuine — from clients who trusted us with their
            most important celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUOTES.map((t, i) => (
            <figure key={i} className="tcard fade-up">
              <Stars />
              <blockquote className="tcard-quote font-thin text-zinc-600">{t.q}</blockquote>
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
