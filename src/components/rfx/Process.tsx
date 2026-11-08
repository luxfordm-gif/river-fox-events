import { useEffect, useRef, useState } from "react";

type ProcessStep = { n: string; title: string; body: string };

type ProcessProps = {
  steps?: ProcessStep[];
  /** Background, matching the section below so there's no colour band
   *  (Matt, 2026-11-08): "white" before pricing / FAQs, "cream" before the
   *  homepage reviews. */
  tone?: "white" | "cream";
  /** Anchor id ("how-it-works" on the service and town pages). */
  sectionId?: string;
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
      "We develop a tailored concept with moodboards, colour palettes and visuals, so you know exactly how it will look before we begin.",
  },
  {
    n: "03",
    title: "Installation",
    body:
      "Our team sets everything up before your first guest arrives, so you walk into a finished space. Afterwards, we pack down and take it away.",
  },
];

/* "How it works": centred heading and three steps. The intro line beside the
   heading was removed (Matt, 2026-11-07). No dark band since 2026-11-08: the
   section shares its neighbours' background, and the same-background rule in
   index.css gives it one Section gap above and below. */
const Process = ({ steps = DEFAULT_STEPS, tone = "white", sectionId = "process" }: ProcessProps = {}) => {
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
    <section id={sectionId} className={`rfx-section ${tone === "white" ? "white" : ""}`} aria-labelledby="process-heading">
      <div className="container-rfx">
        <div className="mb-6 md:mb-10">
          <h2
            id="process-heading"
            className="t-h2 m-0 text-center text-ink"
          >
            How it{" "}
            <em className="t-accent">works.</em>
          </h2>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 border-t border-divider pt-8 md:pt-10"
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
                className="t-overline label-to-title overflow-hidden inline-block"
              >
                <span
                  className="inline-block"
                  style={{
                    color: "hsl(var(--accent-dark))",
                    transform: stepsIn ? "translateX(0)" : "translateX(-110%)",
                    transition: `transform 1s cubic-bezier(.22,.7,.2,1) ${i * 180 + 80}ms`,
                  }}
                >
                  {s.n} /
                </span>
              </div>
              <h3 className="t-h5 text-ink">
                {s.title}
              </h3>
              <p className="t-small text-ink-soft title-to-text">
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
