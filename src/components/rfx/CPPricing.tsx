import { ReactNode } from "react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

export type PricingTier = {
  label: string;
  price: string;
  body?: string;
  /** Small line under the tier, e.g. "Most families book this one." The
   *  tier with a note gets the soft highlighted background. */
  note?: string;
};

type CPPricingProps = {
  /** Optional price tiers shown between the heading and the CTA. Omit for
   *  the heading-only block used on the service and town pages. */
  tiers?: PricingTier[];
  heading?: ReactNode;
  ctaLabel?: string;
  footnote?: string;
};

const DEFAULT_HEADING: ReactNode = (
  <>
    Beautifully styled celebrations{" "}
    <em className="italic font-light text-accent-warm">from £300.</em>
  </>
);

const DEFAULT_FOOTNOTE =
  "All events are individually quoted following a discovery call - so the proposal reflects exactly what you have in mind.";

const CPPricing = ({
  tiers,
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
              fontSize: "var(--fs-h2)",
              lineHeight: 1.0,
              fontWeight: 300,
              letterSpacing: "-0.028em",
              textWrap: "balance",
            }}
          >
            {heading}
          </h2>
        </div>

        {tiers && tiers.length > 0 ? (
          <div
            className={`grid grid-cols-1 ${
              tiers.length === 2 ? "md:grid-cols-2 max-w-[880px]" : "md:grid-cols-3"
            } mx-auto mb-10 md:mb-12 border-t border-ink/15 fade-up`}
          >
            {tiers.map((t, i) => (
              <div
                key={t.label}
                className={`py-9 md:py-12 px-6 md:px-10 text-center ${
                  i > 0 ? "border-t md:border-t-0 md:border-l border-ink/15" : ""
                } ${t.note ? "bg-[hsl(var(--surface-alt)/0.6)]" : ""}`}
              >
                <div
                  className="font-mono-rf text-[10.5px] tracking-[0.24em] uppercase text-ink-soft"
                  style={{ fontWeight: 600 }}
                >
                  {t.label}
                </div>
                <div
                  className="font-serif-rf mt-4"
                  style={{
                    fontSize: "var(--fs-h3)",
                    lineHeight: 1,
                    fontWeight: 300,
                    letterSpacing: "-0.022em",
                  }}
                >
                  {t.price}
                </div>
                {t.body ? (
                  <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-soft">
                    {t.body}
                  </p>
                ) : null}
                {t.note ? (
                  <p className="mt-3 text-[13.5px] italic text-accent-warm">
                    {t.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

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
