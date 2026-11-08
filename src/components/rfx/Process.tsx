import { useEffect, useRef, useState } from "react";

type ProcessStep = { n: string; title: string; body: string };

type ProcessProps = {
  steps?: ProcessStep[];
};

const DEFAULT_STEPS: ProcessStep[] = [
  {
    n: "01",
    title: "Share your vision",
    body:
      "Share your event details, including date, venue and any initial ideas. We'll then arrange a short call to refine the direction together.",
  },
  {
    n: "02",
    title: "Tailored proposal",
    body:
      "We develop a tailored concept for your event, with considered moodboards, colour palettes and visuals - giving you complete clarity before we bring everything to life.",
  },
  {
    n: "03",
    title: "Installation",
    body:
      "Everything is set up by our events team before your first guest arrives, so you walk into a beautifully decorated space, ready to enjoy the moment. After the event we pack down and take it all away.",
  },
];

/* "How it works": heading and three steps. The intro line beside the heading
   was removed across the site (Matt, 2026-11-07). */
const Process = ({ steps = DEFAULT_STEPS }: ProcessProps = {}) => {
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
        <div className="mb-6 md:mb-16">
          <h2
            id="process-heading"
            className="t-h2 m-0 text-center md:text-left"
          >
            How it{" "}
            <em className="t-accent">works.</em>
          </h2>
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
                className="t-eyebrow mb-3 overflow-hidden inline-block"
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
              <h3 className="t-h3 mb-2">
                {s.title}
              </h3>
              <p className="t-body-sm" style={{ color: "hsl(var(--on-deep-soft))" }}>
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
