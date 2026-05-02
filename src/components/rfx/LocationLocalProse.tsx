import type { ReactNode } from "react";

type LocationLocalProseProps = {
  eyebrow: string;
  heading: ReactNode;
  body: ReactNode;
  headingId?: string;
};

const LocationLocalProse = ({
  eyebrow,
  heading,
  body,
  headingId = "loc-local-prose-heading",
}: LocationLocalProseProps) => {
  return (
    <section
      id="local-prose"
      className="rfx-section"
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-12 fade-up">
          <p
            className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-5"
            style={{ fontWeight: 600 }}
          >
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="font-serif-rf"
            style={{
              fontSize: "clamp(36px, 3.8vw, 60px)",
              lineHeight: 1.05,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            {heading}
          </h2>
        </div>

        <div
          className="max-w-[680px] mx-auto text-[16px] md:text-[17px] leading-[1.75] text-ink-soft space-y-5 md:space-y-6 fade-up"
          style={{ textWrap: "pretty" }}
        >
          {body}
        </div>
      </div>
    </section>
  );
};

export default LocationLocalProse;
