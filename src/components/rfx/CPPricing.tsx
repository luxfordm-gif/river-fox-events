import { ReactNode, useEffect, useRef, useState } from "react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";

type CPPricingProps = {
  heading?: ReactNode;
  /** Short line between the heading and the button (heading, body copy,
   *  button - Matt, 2026-11-08). Defaults to the quoting line. The price
   *  option cards were removed on 2026-11-13: Laura only shows "from £300". */
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
  heading = DEFAULT_HEADING,
  intro,
  ctaLabel = "Enquire now",
  footnote = "",
}: CPPricingProps = {}) => {
  // Copy fades up as the box scrolls into view (Matt, 2026-11-08).
  const body = intro ?? DEFAULT_INTRO;
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
          <SectionHeading id="cp-pricing-heading" className="rfx-reveal">{heading}</SectionHeading>
          {body ? (
            <SectionIntro size="body" className="text-ink-soft rfx-reveal rfx-reveal-2">{body}</SectionIntro>
          ) : null}
        </div>

        <div className="text-center text-to-content rfx-reveal rfx-reveal-3 flex flex-col items-center button-trust-gap">
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent t-label">
            {ctaLabel} <span>→</span>
          </a>
          {footnote ? (
            <p className="t-meta text-ink-soft measure-lead mx-auto">
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
