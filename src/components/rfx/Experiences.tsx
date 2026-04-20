import { useRef } from "react";
import expChildren from "@/assets/exp-children.webp";
import expMilestone from "@/assets/exp-milestone.webp";
import expCorporate from "@/assets/exp-corporate.webp";
import { useImageParallax } from "@/hooks/useImageParallax";

const ITEMS = [
  {
    title: "Children's Party Styling",
    body:
      "Immersive themed parties designed to feel magical for children — and completely effortless for you.",
    img: expChildren,
    alt: "Children's party styling in Surrey by River Fox Events — whimsical pastel balloon arch and themed installation for a birthday celebration",
    href: "/childrens-parties",
    tone: "",
  },
  {
    title: "Milestone Celebrations",
    body:
      "Statement styling for 21sts, 40ths, 70ths, baby showers and anniversaries. Life's biggest moments, honoured properly.",
    img: expMilestone,
    alt: "Milestone celebration styling in Surrey by River Fox Events — round tables, balloon centrepieces and a shimmer wall backdrop for an anniversary",
    href: "#enquire",
    tone: "ph-warm",
  },
  {
    title: "Corporate & Brand Styling",
    body:
      "Design-led installations for launches, openings and activations. Trusted by P&G, The Range, Foxhills and more.",
    img: expCorporate,
    alt: "Corporate event styling in Surrey by River Fox Events — tall floral arrangement, branded backdrop and champagne reception for a brand launch",
    href: "#enquire",
    tone: "ph-blush",
  },
];

interface ExpItem {
  title: string;
  body: string;
  img: string;
  alt: string;
  href: string;
  tone: string;
}

const ExpCard = ({ it, i }: { it: ExpItem; i: number }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useImageParallax(wrap, img, { intensity: 7, scale: 1.14 });
  return (
    <a
      href={it.href}
      className={`exp-card rfx-svc-card flex flex-col gap-2 md:gap-4 px-7 ${i > 0 ? "md:border-l" : ""} border-ink/10`}
    >
      <div
        ref={wrap}
        className={`exp-img-wrap ph rounded-sm ${it.tone} fade-up rfx-svc-img relative overflow-hidden`}
        style={{ aspectRatio: "4/5" }}
      >
        {/*
          SEO REMINDER: Alt text on each card describes the specific service +
          Surrey location and includes "River Fox Events". Update the ITEMS
          alt strings above when changing imagery — never leave generic alt.
        */}
        <img
          ref={img}
          src={it.img}
          alt={it.alt}
          className="absolute inset-0 w-full h-full object-cover z-[2] will-change-transform"
          style={{ transform: "translate3d(0,0,0) scale(1.14)" }}
          loading="lazy"
          decoding="async"
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
  );
};

const Experiences = () => {
  return (
    <section id="experiences" className="rfx-section white" aria-labelledby="exp-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 mb-10 md:mb-16 items-end rfx-md-stack">
          <h2
            id="exp-heading"
            className="font-serif-rf fade-up m-0 text-center md:text-left"
            style={{
              fontSize: "clamp(54px, 5.6vw, 88px)",
              lineHeight: 1.04,
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-0 border-t border-ink/20 pt-8 md:pt-12 rfx-md-stack">
          {ITEMS.map((it, i) => (
            <ExpCard key={i} it={it} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
