import { ReactNode, useEffect, useRef, useState } from "react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

type PricingTier = { price: string; label: string; body: string };

type CPPricingProps = {
  tiers?: PricingTier[];
  heading?: ReactNode;
  ctaLabel?: string;
  footnote?: string;
};

const DEFAULT_TIERS: PricingTier[] = [
  {
    price: "From £460",
    label: "Intimate",
    body: "A single styled focal point — cake table, balloon installation or backdrop. Perfect for smaller, considered celebrations at home.",
  },
  {
    price: "From £1,200",
    label: "Full room styling",
    body: "Most popular. A complete styled space — cake table, sculptural balloons, signage and considered detail throughout.",
  },
  {
    price: "From £2,500",
    label: "Premium transformation",
    body: "Large-scale, fully bespoke installations. Floral arches, statement backdrops, end-to-end design.",
  },
];

const DEFAULT_HEADING: ReactNode = (
  <>
    Beautifully styled celebrations{" "}
    <em className="italic font-light text-accent-warm">from £460.</em>
  </>
);

const DEFAULT_FOOTNOTE =
  "All events are individually quoted following a discovery call — so the proposal reflects exactly what you have in mind.";

const CPPricing = ({
  tiers = DEFAULT_TIERS,
  heading = DEFAULT_HEADING,
  ctaLabel = "Book your event",
  footnote = DEFAULT_FOOTNOTE,
}: CPPricingProps = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      className="rfx-section warm"
      aria-labelledby="cp-pricing-heading"
    >
      <div className="container-rfx">
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="cp-pricing-heading"
            className="font-serif-rf fade-up max-w-[20ch] mx-auto"
            style={{
              fontSize: "clamp(40px, 4vw, 72px)",
              lineHeight: 1.0,
              fontWeight: 300,
              letterSpacing: "-0.028em",
              textWrap: "balance",
            }}
          >
            {heading}
          </h2>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-ink/15"
        >
          {tiers.map((t, i) => (
            <div
              key={t.label}
              className={`relative py-10 md:py-14 px-6 md:px-10 ${
                i > 0 ? "border-t md:border-t-0 md:border-l border-ink/15" : ""
              } ${
                i === 1 ? "bg-[hsl(var(--surface-alt)/0.55)] md:bg-[hsl(var(--surface-alt)/0.6)]" : ""
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateY(0) scale(1)"
                  : "translateY(40px) scale(0.94)",
                transition: `opacity 1s cubic-bezier(.22,.7,.2,1) ${
                  i * 180
                }ms, transform 1.1s cubic-bezier(.22,.7,.2,1) ${i * 180}ms`,
              }}
            >
              {i === 1 && tiers.length === 3 && (
                <div
                  className="absolute top-4 right-4 font-mono-rf text-[10px] tracking-[0.24em] uppercase text-accent-warm z-[2]"
                  style={{ fontWeight: 700 }}
                >
                  Most popular
                </div>
              )}
              <div
                className="font-serif-rf overflow-hidden"
                style={{
                  fontSize: "clamp(32px, 2.8vw, 44px)",
                  lineHeight: 1,
                  fontWeight: 300,
                  letterSpacing: "-0.022em",
                }}
              >
                <span
                  className="inline-block"
                  style={{
                    transform: visible ? "translateY(0)" : "translateY(110%)",
                    transition: `transform 1.1s cubic-bezier(.22,.7,.1,1) ${
                      i * 180 + 220
                    }ms`,
                  }}
                >
                  {t.price}
                </span>
              </div>
              <div
                className="font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink-soft mt-1.5"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-12px)",
                  transition: `opacity .9s ease ${
                    i * 180 + 380
                  }ms, transform .9s ease ${i * 180 + 380}ms`,
                }}
              >
                {t.label}
              </div>
              <div className="mt-5 h-px w-10 bg-accent-warm/60" aria-hidden="true" />
              <p
                className="text-[14.5px] leading-[1.7] text-ink-soft mt-5 max-w-[320px]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 1s ease ${
                    i * 180 + 480
                  }ms, transform 1s ease ${i * 180 + 480}ms`,
                }}
              >
                {t.body}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 fade-up flex flex-col items-center gap-6">
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
            {ctaLabel} <span>→</span>
          </a>
          <p className="text-[13.5px] text-ink-soft max-w-[560px] mx-auto">
            {footnote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CPPricing;
