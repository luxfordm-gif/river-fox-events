import { ReactNode } from "react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

type CPPricingProps = {
  heading?: ReactNode;
  ctaLabel?: string;
  footnote?: string;
};

const DEFAULT_HEADING: ReactNode = (
  <>
    Beautifully styled celebrations{" "}
    <em className="italic font-light text-accent-warm">from £460.</em>
  </>
);

const DEFAULT_FOOTNOTE =
  "All events are individually quoted following a discovery call - so the proposal reflects exactly what you have in mind.";

const CPPricing = ({
  heading = DEFAULT_HEADING,
  ctaLabel = "Enquire now",
  footnote = DEFAULT_FOOTNOTE,
}: CPPricingProps = {}) => {
  return (
    <section
      id="pricing"
      className="rfx-section warm"
      aria-labelledby="cp-pricing-heading"
    >
      <div className="container-rfx">
        <div className="text-center mb-10 md:mb-12">
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

        <div className="text-center fade-up flex flex-col items-center gap-6">
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
            {ctaLabel} <span>→</span>
          </a>
          {footnote ? (
            <p className="text-[13.5px] text-ink-soft max-w-[560px] mx-auto">
              {footnote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default CPPricing;
