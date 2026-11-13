import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/rfx/SectionHeading";

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
      "Send me your date, venue and any ideas you have so far. I'll then give you a call to talk it through.",
  },
  {
    n: "02",
    title: "Your proposal",
    body:
      "I put together a concept with a moodboard, colour palette and visuals, so you know exactly how it will look before anything is made.",
  },
  {
    n: "03",
    title: "Installation",
    body:
      "I set everything up before your first guest arrives, so you walk into a finished space. Afterwards, I pack it all down and take it away.",
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
        <div className="heading-to-content">
          <SectionHeading id="process-heading" className="text-center text-ink">
            How it{" "}
            <em className="t-accent">works.</em>
          </SectionHeading>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-1 md:grid-cols-3 cards-gap border-t border-divider rule-to-content"
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              style={{
                opacity: stepsIn ? 1 : 0,
                transform: stepsIn ? "translateX(0)" : "translateX(-32px)",
                transition: `opacity var(--motion-reveal) var(--ease-soft) ${i * 180}ms, transform var(--motion-reveal) var(--ease-soft) ${i * 180}ms`,
              }}
            >
              <div
                className="t-overline label-to-title overflow-hidden inline-block"
              >
                <span
                  className="inline-block text-accent-warm"
                  style={{
                    transform: stepsIn ? "translateX(0)" : "translateX(-110%)",
                    transition: `transform var(--motion-reveal) var(--ease-soft) ${i * 180 + 80}ms`,
                  }}
                >
                  {s.n} /
                </span>
              </div>
              <h3 className="t-h5 text-ink">
                {s.title}
              </h3>
              <p className="t-small text-ink-soft title-to-text text-wrap">
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
