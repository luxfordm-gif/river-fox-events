const PLACES = [
  "Cobham",
  "Weybridge",
  "Esher",
  "Oxshott",
  "Guildford",
  "Reigate",
  "Farnham",
  "Horsham",
  "London",
];

const Ticker = () => {
  // Repeat for seamless loop
  const all = [...PLACES, ...PLACES, ...PLACES];
  return (
    <section
      aria-label="Areas we deliver to"
      className="border-y border-ink/10 bg-background"
    >
      <div className="container-rfx py-6 md:py-7">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-10 items-center">
          <div className="font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink-soft whitespace-nowrap text-center md:text-left">
            We deliver across
          </div>
          <div className="overflow-hidden relative">
            <div
              className="flex gap-10 whitespace-nowrap"
              style={{
                animation: "rfx-marq 45s linear infinite",
                width: "max-content",
                willChange: "transform",
              }}
            >
              {all.map((p, i) => (
                <span
                  key={i}
                  className="font-serif-rf text-ink inline-flex items-center gap-10"
                  style={{
                    fontSize: "clamp(18px, 2vw, 24px)",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p}
                  <span className="text-accent-warm text-[0.5em]">✳</span>
                </span>
              ))}
            </div>
            {/* edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ticker;
