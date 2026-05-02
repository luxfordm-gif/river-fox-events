const USPS = [
  {
    title: "No packages, only proposals",
    body: "Every event designed from scratch around your vision — no recycled menus.",
  },
  {
    title: "Personally led by Laura",
    body: "One stylist, one client, no handovers. The person you brief is the person who installs.",
  },
  {
    title: "End-to-end, fully handled",
    body: "Design, sourcing, build, install, breakdown. Nothing left for you on the day.",
  },
  {
    title: "Editorial standard",
    body: "Considered detail throughout. Never overdone, never off-the-shelf.",
  },
];

const LocationUSP = () => {
  return (
    <section
      id="usps"
      className="rfx-section dark"
      aria-label="What makes River Fox Events different"
    >
      <div className="container-rfx">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-10">
          {USPS.map((u, i) => (
            <div key={u.title} className="fade-up" style={{ transitionDelay: `${i * 80}ms` }}>
              <div
                className="h-px w-8 mb-6"
                aria-hidden="true"
                style={{ background: "hsl(var(--accent-warm) / 0.7)" }}
              />
              <h3
                className="font-serif-rf"
                style={{
                  fontSize: "clamp(20px, 1.6vw, 24px)",
                  lineHeight: 1.18,
                  fontWeight: 400,
                  letterSpacing: "-0.012em",
                  color: "hsl(var(--on-deep))",
                }}
              >
                {u.title}
              </h3>
              <p
                className="mt-4 text-[14.5px] leading-[1.65]"
                style={{ color: "hsl(var(--on-deep-soft))", textWrap: "pretty" }}
              >
                {u.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationUSP;
