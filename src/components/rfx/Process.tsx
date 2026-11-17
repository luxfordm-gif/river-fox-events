import { SectionHeading } from "@/components/rfx/SectionHeading";
import ChatDemo from "@/components/rfx/ChatDemo";
import { SCENARIOS, type Scenario } from "@/data/howItWorks";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import "@/styles/how-it-works.css";

type ProcessStep = { n: string; title: string; body: string };

type ProcessProps = {
  steps?: ProcessStep[];
  /** The example party shown in the three steps (chat, sketch, finished photo). */
  scenario?: Scenario;
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

/** The line under the button. Set-up is included; take-down is an extra, so it isn't promised here. */
const REASSURANCE = "No obligation · Proposal in a day or two · Set‑up included";

/* "How it works" (redesigned 2026-11-17): the heading, then three steps, each
   with a picture over its title. The pictures tell one story: step 1 a short
   WhatsApp-style chat with Laura, step 2 the hand-drawn concept she sends, step
   3 the finished event. They come from a scenario (src/data/howItWorks.ts), so
   each page shows a party that suits it. Steps stack on phones, three across
   from tablet up; the enquiry button sits under them.
   No dark band: the section shares its neighbours' background, and the
   same-background rule in index.css gives it one Section gap above and below. */
const Process = ({
  steps = DEFAULT_STEPS,
  scenario = SCENARIOS.dinosaur,
  tone = "white",
  sectionId = "process",
}: ProcessProps = {}) => {
  const { chat, sketch, photo } = scenario;

  /** The picture for step 1, 2 or 3 (steps after the third have none). */
  const media = (index: number) => {
    if (index === 0) return <ChatDemo lines={chat} />;
    const picture = index === 1 ? sketch : index === 2 ? photo : null;
    if (!picture) return null;
    return (
      <img
        src={picture.src}
        srcSet={picture.srcSet}
        sizes="(min-width: 768px) 33vw, 100vw"
        alt={picture.alt}
        loading="lazy"
        decoding="async"
        width={1100}
        height={733}
      />
    );
  };

  return (
    <section id={sectionId} className={`rfx-section ${tone === "white" ? "white" : ""}`} aria-labelledby="process-heading">
      <div className="container-rfx">
        <div className="heading-to-content">
          <SectionHeading id="process-heading" className="text-center text-ink">
            How it{" "}
            <em className="t-accent">works.</em>
          </SectionHeading>
        </div>

        <ol className="hiw-steps">
          {steps.map((s, i) => (
            <li key={s.n}>
              {i < 3 && (
                <div className={`hiw-media rounded-large ${i === 0 ? "hiw-media-chat" : ""}`}>{media(i)}</div>
              )}
              <h3 className="t-h5 text-ink media-to-title">
                <span className="text-accent-warm">{s.n}.</span> {s.title}
              </h3>
              <p className="t-small text-ink-soft title-to-text text-wrap">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="hiw-cta text-to-action">
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
            Enquire now <span className="t-icon">→</span>
          </a>
          <p className="t-meta text-ink-soft text-balance">{REASSURANCE}</p>
        </div>
      </div>
    </section>
  );
};

export default Process;
