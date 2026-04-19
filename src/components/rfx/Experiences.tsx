import expChildren from "@/assets/exp-children.jpg";
import expMilestone from "@/assets/exp-milestone.jpg";
import expCorporate from "@/assets/exp-corporate.jpg";

const ITEMS = [
  {
    n: "(i)",
    title: "Children's Party Styling",
    body:
      "Immersive themed parties designed to feel magical for children — and completely effortless for you.",
    img: expChildren,
    alt: "Whimsical immersive children's party setup with pastel balloon arch and themed installation",
    tone: "",
  },
  {
    n: "(ii)",
    title: "Milestone Celebrations",
    body:
      "Statement styling for 21sts, 40ths, 70ths, baby showers and anniversaries. Life's biggest moments, honoured properly.",
    img: expMilestone,
    alt: "Sophisticated milestone celebration tablescape with candles and lush floral runner",
    tone: "ph-warm",
  },
  {
    n: "(iii)",
    title: "Corporate & Brand Styling",
    body:
      "Design-led installations for launches, openings and activations. Trusted by P&G, The Range, Foxhills and more.",
    img: expCorporate,
    alt: "Corporate brand activation styling with elegant floral wall installation",
    tone: "ph-blush",
  },
];

const Experiences = () => {
  return (
    <section id="experiences" className="rfx-section white" aria-labelledby="exp-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14 md:mb-16 items-end rfx-md-stack">
          <div>
            <div className="eyebrow mb-6">(01) — Signature Experiences</div>
            <h2
              id="exp-heading"
              className="font-serif-rf fade-up"
              style={{
                fontSize: "clamp(40px, 5.4vw, 84px)",
                lineHeight: 1.02,
                fontWeight: 300,
                letterSpacing: "-0.025em",
              }}
            >
              Our signature{" "}
              <em className="italic font-light text-accent-warm">experiences.</em>
            </h2>
          </div>
          <p className="text-[15.5px] leading-[1.6] text-ink-soft max-w-[440px]">
            Three considered services, each fully bespoke. We work with a small
            number of clients each month so every event receives Laura's
            personal attention from concept to install.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 border-t border-ink/20 pt-12 rfx-md-stack">
          {ITEMS.map((it, i) => (
            <article
              key={i}
              className={`rfx-svc-card flex flex-col gap-4 px-7 ${i > 0 ? "md:border-l" : ""} border-ink/10`}
            >
              <div
                className={`ph overflow-hidden ${it.tone} fade-up`}
                style={{ aspectRatio: "4/5" }}
              >
                <img
                  src={it.img}
                  alt={it.alt}
                  className="absolute inset-0 w-full h-full object-cover z-[2]"
                  loading="lazy"
                  width={1024}
                  height={1280}
                />
                <span className="ph-num">pl. 0{i + 5}</span>
                <span className="ph-label">{it.title.toLowerCase()}</span>
              </div>
              <div className="mt-2">
                <span className="font-mono-rf text-[10px] tracking-[0.2em] uppercase text-ink-soft">
                  {it.n}
                </span>
              </div>
              <h3
                className="font-serif-rf -mt-1"
                style={{
                  fontSize: 30,
                  lineHeight: 1.08,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                {it.title}
              </h3>
              <p className="text-[14.5px] leading-[1.65] text-ink-soft max-w-[360px]">
                {it.body}
              </p>
              <a href="#enquire" className="btn-link-rf self-start mt-2">
                Enquire <span className="arr">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
