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
        <div className="text-center max-w-[760px] mx-auto fade-up">
          <p className="t-overline text-ink-soft mb-5">
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="t-h2"
            style={{ textWrap: "balance" }}
          >
            {heading}
          </h2>
        </div>

        <div
          className="max-w-[680px] mx-auto t-body text-ink-soft space-y-5 md:space-y-6 heading-to-text fade-up"
          style={{ textWrap: "pretty" }}
        >
          {body}
        </div>
      </div>
    </section>
  );
};

export default LocationLocalProse;
