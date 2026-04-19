const TIERS = [
  {
    price: "From £600",
    label: "Intimate",
    body: "A single styled focal point — cake table, balloon installation or backdrop. Perfect for smaller, considered celebrations at home.",
  },
  {
    price: "From £1,200",
    label: "Full room styling",
    body: "Most popular. A complete styled space — cake table, sculptural balloons, signage and considered detail throughout.",
  },
  {
    price: "From £2,500",
    label: "Premium transformation",
    body: "Large-scale, fully bespoke installations. Floral arches, statement backdrops, end-to-end design.",
  },
];

const CPPricing = () => {
  return (
    <section
      id="pricing"
      className="rfx-section warm"
      aria-labelledby="cp-pricing-heading"
    >
      <div className="container-rfx">
        <div className="text-center mb-14 md:mb-20">
          <div className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-6 fade-up">
            Investment
          </div>
          <h2
            id="cp-pricing-heading"
            className="font-serif-rf fade-up max-w-[18ch] mx-auto"
            style={{
              fontSize: "clamp(44px, 5.4vw, 84px)",
              lineHeight: 1.04,
              fontWeight: 300,
              letterSpacing: "-0.028em",
            }}
          >
            Beautifully styled celebrations{" "}
            <em className="italic font-light text-accent-warm">from £600.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 border-t border-ink/15">
          {TIERS.map((t, i) => (
            <div
              key={t.label}
              className={`fade-up py-10 md:py-14 px-2 md:px-10 ${
                i > 0 ? "md:border-l border-ink/15" : ""
              } ${
                i === 1 ? "md:bg-[hsl(var(--surface-alt)/0.6)] relative" : ""
              }`}
            >
              {i === 1 && (
                <div className="absolute top-4 right-4 font-mono-rf text-[9.5px] tracking-[0.22em] uppercase text-accent-warm">
                  Most popular
                </div>
              )}
              <div
                className="font-serif-rf"
                style={{
                  fontSize: "clamp(34px, 3.6vw, 48px)",
                  lineHeight: 1,
                  fontWeight: 300,
                  letterSpacing: "-0.022em",
                }}
              >
                {t.price}
              </div>
              <div className="font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink-soft mt-4">
                {t.label}
              </div>
              <p className="text-[14.5px] leading-[1.7] text-ink-soft mt-5 max-w-[320px]">
                {t.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[13.5px] text-ink-soft mt-12 max-w-[560px] mx-auto fade-up">
          All events are individually quoted following a discovery call — so the
          proposal reflects exactly what you have in mind.
        </p>
      </div>
    </section>
  );
};

export default CPPricing;
