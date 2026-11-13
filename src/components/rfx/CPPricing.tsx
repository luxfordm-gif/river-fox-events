import { ReactNode, useEffect, useRef, useState } from "react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

export type PricingTier = {
  label: string;
  price: string;
  body?: string;
  /** Any value marks the tier as the popular one: it gets the "Most popular"
   *  tag and the accent border (the text itself isn't shown any more). */
  note?: string;
};

type CPPricingProps = {
  /** Optional price tiers shown between the heading and the CTA. Omit for
   *  the heading-only block used on the service and town pages. */
  tiers?: PricingTier[];
  heading?: ReactNode;
  /** Short line between the heading and the button (heading, body copy,
   *  button - Matt, 2026-11-08). Defaults to the quoting line when there are
   *  no tiers; the tiers do that job when present. */
  intro?: ReactNode;
  ctaLabel?: string;
  footnote?: string;
};

const DEFAULT_HEADING: ReactNode = (
  <>
    Beautifully styled celebrations{" "}
    <em className="t-accent">from £300.</em>
  </>
);

const DEFAULT_INTRO =
  "Every celebration is quoted individually after a short call, so the price reflects exactly what you have in mind.";

const CPPricing = ({
  tiers,
  heading = DEFAULT_HEADING,
  intro,
  ctaLabel = "Enquire now",
  footnote = "",
}: CPPricingProps = {}) => {
  // Copy fades up as the box scrolls into view (Matt, 2026-11-08).
  const body = intro ?? (tiers && tiers.length > 0 ? null : DEFAULT_INTRO);
  const boxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      className="rfx-section white rfx-pricing"
      aria-labelledby="cp-pricing-heading"
    >
      {/* Boxed, not a full-width band: a soft Warm card inside the page
          margins (Matt, 2026-11-08). */}
      <div className="container-rfx">
        <div ref={boxRef} className={`rfx-pricing-box rounded-large ${inView ? "is-in" : ""}`}>
        <div className="text-center heading-to-content">
          <h2
            id="cp-pricing-heading"
            className="t-h2 rfx-reveal max-w-[20ch] mx-auto"
            style={{ textWrap: "balance" }}
          >
            {heading}
          </h2>
          {body ? (
            <p className="t-body text-ink-soft max-w-[460px] mx-auto heading-to-text rfx-reveal rfx-reveal-2">
              {body}
            </p>
          ) : null}
        </div>

        {tiers && tiers.length > 0 ? (
          /* Option cards, as on the Christmas garlands (Matt, 2026-11-08). */
          <div
            className={`option-cards grid-cols-1 ${
              tiers.length === 2 ? "md:grid-cols-2 max-w-[960px]" : "md:grid-cols-3"
            } rfx-reveal rfx-reveal-2`}
          >
            {tiers.map((t) => (
              <div key={t.label} className={`option-card${t.note ? " is-popular" : ""}`}>
                {t.note ? <p className="option-card__tag"><span className="tag">Most popular</span></p> : null}
                <h3 className="t-h4 text-ink">{t.label}</h3>
                <p className="t-small italic text-accent-warm title-to-text">{t.price}</p>
                {t.body ? <p className="t-small text-ink-soft heading-to-text max-w-[40ch]">{t.body}</p> : null}
              </div>
            ))}
          </div>
        ) : null}

        <div className="text-center text-to-content rfx-reveal rfx-reveal-3 flex flex-col items-center button-trust-gap">
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent t-label">
            {ctaLabel} <span>→</span>
          </a>
          {footnote ? (
            <p className="t-meta text-ink-soft max-w-[560px] mx-auto">
              {footnote}
            </p>
          ) : null}
        </div>
        </div>
      </div>
    </section>
  );
};

export default CPPricing;
