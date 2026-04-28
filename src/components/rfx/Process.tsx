import { ReactNode, useEffect, useRef, useState } from "react";

type ProcessStep = { n: string; title: string; body: string };

type ProcessProps = {
  steps?: ProcessStep[];
  intro?: ReactNode;
};

const DEFAULT_STEPS: ProcessStep[] = [
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

const DEFAULT_INTRO: ReactNode = (
  <>
    From first message to final installation — everything handled. You just
    enjoy the day.
  </>
);

const Process = ({ steps = DEFAULT_STEPS, intro = DEFAULT_INTRO }: ProcessProps = {}) => {
  const stepsRef = useRef<HTMLDivElement>(null);
  const [stepsIn, setStepsIn] = useState(false);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStepsIn(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="rfx-section dark" aria-labelledby="process-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 items-end mb-6 md:mb-16 rfx-md-stack">
          <h2
            id="process-heading"
            className="font-serif-rf m-0 text-center md:text-left"
            style={{
              fontSize: "clamp(54px, 5.6vw, 88px)",
              lineHeight: 1.04,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            How it works.
          </h2>
          <p className="text-[15.5px] leading-[1.6] max-w-[440px] m-0 pb-3 text-center md:text-left mx-auto md:mx-0" style={{ color: "hsl(var(--on-deep-soft))" }}>
            {intro}
          </p>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 border-t pt-8 md:pt-10"
          style={{ borderColor: "hsl(var(--on-deep) / 0.18)" }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="pr-3"
              style={{
                opacity: stepsIn ? 1 : 0,
                transform: stepsIn ? "translateX(0)" : "translateX(-32px)",
                transition: `opacity .9s cubic-bezier(.22,.7,.2,1) ${i * 180}ms, transform .9s cubic-bezier(.22,.7,.2,1) ${i * 180}ms`,
              }}
            >
              <div
                className="font-mono-rf text-[11px] tracking-[0.22em] mb-3 font-medium overflow-hidden inline-block"
              >
                <span
                  className="inline-block"
                  style={{
                    color: "hsl(var(--accent-warm))",
                    transform: stepsIn ? "translateX(0)" : "translateX(-110%)",
                    transition: `transform 1s cubic-bezier(.22,.7,.2,1) ${i * 180 + 80}ms`,
                  }}
                >
                  {s.n} /
                </span>
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
