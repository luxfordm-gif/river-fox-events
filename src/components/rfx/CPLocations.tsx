const AREAS = [
  "Cobham",
  "Weybridge",
  "Esher",
  "Oxshott",
  "Guildford",
  "Reigate",
  "Farnham",
  "Horsham",
  "Camberley",
  "Woking",
];

const CPLocations = () => {
  return (
    <section
      id="locations"
      className="rfx-section white"
      style={{ paddingTop: "72px", paddingBottom: "72px" }}
      aria-labelledby="cp-locations-heading"
    >
      <div className="container-rfx">
        <div className="flex flex-col items-center text-center max-w-[760px] mx-auto fade-up">
          <h2
            id="cp-locations-heading"
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.0,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Areas we{" "}
            <em className="italic font-light text-accent-warm">cover.</em>
          </h2>
          <p
            className="mt-6 text-[16px] leading-[1.7] text-ink-soft max-w-[560px]"
            style={{ textWrap: "pretty" }}
          >
            Based in Surrey and travelling across the county and into London for
            clients who care about the difference that detail makes. Wherever
            the celebration, we come to you — set up before guests arrive and
            broken down once the day is done.
          </p>

          <ul className="mt-12 grid grid-cols-2 sm:grid-cols-2 gap-x-12 w-full max-w-[520px] border-t border-ink/15">
            {AREAS.map((a, i) => (
              <li
                key={a}
                className="flex items-baseline gap-3 py-3 border-b border-ink/15 font-serif-rf text-[18px] font-light tracking-[-0.012em] text-ink"
              >
                <span className="font-mono-rf text-[10px] tracking-[0.18em] text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {a}
              </li>
            ))}
          </ul>

          <div className="mt-14 w-full overflow-hidden rounded-sm border border-ink/15 shadow-[0_22px_44px_-22px_hsl(var(--ink)/0.18)]">
            <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
              <iframe
                title="Map of Surrey areas covered by River Fox Events"
                src="https://www.google.com/maps?q=Cobham,Surrey,UK&z=10&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0 grayscale-[0.15]"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CPLocations;
