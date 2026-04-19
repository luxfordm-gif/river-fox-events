const STEPS = [
  {
    n: "01",
    title: "Share your vision",
    body:
      "Tell me about your event. Date, venue, any ideas you have. A short discovery call follows so we can talk through the detail together.",
  },
  {
    n: "02",
    title: "Bespoke proposal",
    body:
      "I create a tailored concept — palette, direction, installations. Every proposal is unique. No templates. No packages.",
  },
  {
    n: "03",
    title: "Installation day",
    body:
      "My team sets up everything before your first guest arrives. You walk into a finished space. We handle breakdown too.",
  },
];

const Process = () => {
  return (
    <section id="process" className="rfx-section dark" aria-labelledby="process-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end mb-16 rfx-md-stack">
          <h2
            id="process-heading"
            className="font-serif-rf m-0"
            style={{
              fontSize: "clamp(40px, 5.4vw, 84px)",
              lineHeight: 1.06,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            How it{" "}
            <em className="italic font-light text-accent-warm">works.</em>
          </h2>
          <p className="text-[15.5px] leading-[1.6] max-w-[440px] m-0 pb-2" style={{ color: "hsl(var(--on-deep-soft))" }}>
            From first message to final installation — everything handled. You
            just enjoy the day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-t pt-10" style={{ borderColor: "hsl(var(--on-deep) / 0.18)" }}>
          {STEPS.map((s) => (
            <div key={s.n} className="pr-3 fade-up">
              <div
                className="font-mono-rf text-[11px] tracking-[0.22em] mb-3 font-medium"
                style={{ color: "hsl(var(--accent-warm))" }}
              >
                {s.n} /
              </div>
              <h3
                className="font-serif-rf mb-4"
                style={{
                  fontSize: 30,
                  fontWeight: 400,
                  lineHeight: 1.12,
                  letterSpacing: "-0.018em",
                }}
              >
                {s.title}
              </h3>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: "hsl(var(--on-deep-soft))" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
