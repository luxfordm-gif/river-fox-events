import expChildren from "@/assets/exp-children.jpg";
import expMilestone from "@/assets/exp-milestone.jpg";
import expCorporate from "@/assets/exp-corporate.jpg";

const ITEMS = [
  {
    title: "Children's Party Styling",
    body:
      "Immersive themed parties designed to feel magical for children — and completely effortless for you.",
    img: expChildren,
    alt: "Whimsical immersive children's party setup with pastel balloon arch and themed installation",
    href: "#enquire",
    tone: "",
  },
  {
    title: "Milestone Celebrations",
    body:
      "Statement styling for 21sts, 40ths, 70ths, baby showers and anniversaries. Life's biggest moments, honoured properly.",
    img: expMilestone,
    alt: "Anniversary celebration with round tables, balloon centerpieces and a glittering shimmer wall backdrop",
    href: "#enquire",
    tone: "ph-warm",
  },
  {
    title: "Corporate & Brand Styling",
    body:
      "Design-led installations for launches, openings and activations. Trusted by P&G, The Range, Foxhills and more.",
    img: expCorporate,
    alt: "Corporate brand launch with tall floral arrangement, branded backdrop and champagne reception",
    href: "#enquire",
    tone: "ph-blush",
  },
];

const Experiences = () => {
  return (
    <section id="experiences" className="rfx-section white" aria-labelledby="exp-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 mb-10 md:mb-16 items-end rfx-md-stack">
          <h2
            id="exp-heading"
            className="font-serif-rf fade-up m-0 text-center md:text-left"
            style={{
              fontSize: "clamp(44px, 5.6vw, 88px)",
              lineHeight: 1.06,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            Our signature{" "}
            <em className="italic font-light text-accent-warm">experiences.</em>
          </h2>
          <p className="text-[15.5px] leading-[1.6] text-ink-soft max-w-[440px] pb-3 text-center md:text-left mx-auto md:mx-0">
            Three considered services, each fully bespoke. We work with a small
            number of clients each month so every event receives Laura's
            personal attention from concept to install.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 border-t border-ink/20 pt-8 md:pt-12 rfx-md-stack">
          {ITEMS.map((it, i) => (
            <a
              key={i}
              href={it.href}
              className={`exp-card rfx-svc-card flex flex-col gap-2 md:gap-4 px-7 ${i > 0 ? "md:border-l" : ""} border-ink/10`}
            >
              <div
                className={`exp-img-wrap ph rounded-sm ${it.tone} fade-up rfx-svc-img`}
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
                <span className="exp-cta">
                  Discover <span aria-hidden>→</span>
                </span>
              </div>
              <h3
                className="font-serif-rf exp-title mt-3 md:mt-4"
                style={{
                  fontSize: 30,
                  lineHeight: 1.18,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                {it.title}
              </h3>
              <p className="text-[14.5px] leading-[1.65] text-ink-soft max-w-[360px]">
                {it.body}
              </p>
              <span className="btn-link-rf self-start mt-2">
                Enquire <span className="arr">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
