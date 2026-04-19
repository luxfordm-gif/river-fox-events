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
      aria-labelledby="cp-locations-heading"
    >
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-20 items-center rfx-md-stack">
          <div className="fade-up">
            <div className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-6">
              Where we work
            </div>
            <h2
              id="cp-locations-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(40px, 5vw, 72px)",
                lineHeight: 1.04,
                fontWeight: 300,
                letterSpacing: "-0.025em",
              }}
            >
              Surrey, with{" "}
              <em className="italic font-light text-accent-warm">love.</em>
            </h2>
            <p className="mt-7 text-[16px] leading-[1.7] text-ink-soft max-w-[480px]">
              Based in Surrey and travelling across the county and into London
              for clients who care about the difference that detail makes.
              Wherever the celebration, we come to you — set up before guests
              arrive and break down once the day is done.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-2 gap-y-2 max-w-[520px]">
              {AREAS.map((a) => (
                <li
                  key={a}
                  className="font-mono-rf text-[11px] tracking-[0.18em] uppercase text-ink border border-ink/15 rounded-full px-3.5 py-1.5"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-up">
            <div
              className="ph ph-blush relative overflow-hidden rounded-sm"
              style={{ aspectRatio: "4/3" }}
            >
              <iframe
                title="River Fox Events — Surrey service area"
                src="https://www.google.com/maps?q=Surrey,%20England&z=10&output=embed"
                className="absolute inset-0 w-full h-full z-[2] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CPLocations;
