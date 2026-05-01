import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Stripped-back services cross-link block. Used on location pages where
 * the full Experiences component (with parallax photography) would feel
 * repetitive next to the homepage. Three minimal cards — title, short
 * blurb, arrow — with a soft pinky-peach stroke and gentle drop shadow.
 */
const SERVICES = [
  {
    title: "Children's Party Styling",
    blurb:
      "Immersive themed parties, balloon installations and full-room transformations — designed and installed personally by Laura.",
    href: "/childrens-parties/",
  },
  {
    title: "Milestone Celebrations",
    blurb:
      "Statement styling for 21sts, 40ths, 70ths, baby showers and anniversaries. Life's biggest moments, honoured properly.",
    href: "/milestone-celebrations/",
  },
  {
    title: "Corporate & Brand Styling",
    blurb:
      "Design-led installations for launches, openings and brand activations. Trusted by P&G, The Range and more.",
    href: "/corporate-brand-styling/",
  },
];

type ServicesCardsProps = {
  heading?: ReactNode;
  intro?: ReactNode;
  sectionId?: string;
  headingId?: string;
};

const ServicesCards = ({
  heading,
  intro,
  sectionId = "services",
  headingId = "services-cards-heading",
}: ServicesCardsProps = {}) => {
  return (
    <section
      id={sectionId}
      className="rfx-section white"
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        {(heading || intro) && (
          <div className="text-center max-w-[760px] mx-auto mb-12 md:mb-16 fade-up">
            {heading && (
              <h2
                id={headingId}
                className="font-serif-rf"
                style={{
                  fontSize: "clamp(34px, 3.6vw, 56px)",
                  lineHeight: 1.05,
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                  textWrap: "balance",
                }}
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p
                className="mt-6 max-w-[560px] mx-auto text-[16px] leading-[1.65] text-ink-soft"
                style={{ textWrap: "pretty" }}
              >
                {intro}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
          {SERVICES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="
                group relative flex flex-col p-7 md:p-9 rounded-[18px] no-underline-fx
                transition-all duration-300 ease-out
                hover:-translate-y-[2px]
                hover:shadow-[0_14px_36px_-14px_hsl(var(--ink)/0.18)]
                hover:border-[hsl(var(--accent-warm)/0.65)]
              "
              style={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--accent-warm) / 0.35)",
                boxShadow: "0 6px 22px -14px hsl(var(--ink) / 0.12)",
              }}
            >
              <h3
                className="font-serif-rf text-ink"
                style={{
                  fontSize: "clamp(22px, 2.2vw, 28px)",
                  lineHeight: 1.18,
                  fontWeight: 400,
                  letterSpacing: "-0.012em",
                }}
              >
                {s.title}
              </h3>
              <p
                className="mt-4 text-[14.5px] leading-[1.6] text-ink-soft flex-1"
                style={{ textWrap: "pretty" }}
              >
                {s.blurb}
              </p>
              <span
                className="mt-7 inline-flex items-center gap-2 font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink group-hover:gap-3 transition-all"
                style={{ fontWeight: 600 }}
              >
                Discover
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-[2px]"
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesCards;
