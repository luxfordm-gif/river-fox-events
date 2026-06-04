type LocationUSPProps = {
  cityName?: string;
  /** Per-town paragraph. This block is the most prominent body text on a
   *  location page, so Google tends to pull it as the search snippet -
   *  pass a unique value per town so results don't all look identical.
   *  Falls back to the generic templated copy below when omitted. */
  body?: string;
};

const LocationUSP = ({ cityName, body }: LocationUSPProps = {}) => {
  return (
    <section
      id="why-river-fox"
      className="rfx-section white"
      style={{ paddingTop: 0, paddingBottom: "80px" }}
      aria-label="Why choose River Fox Events"
    >
      <div className="container-rfx">
        <div className="text-center mb-8 md:mb-10">
          <h2
            className="font-serif-rf"
            style={{
              fontSize: "clamp(34px, 3.6vw, 56px)",
              lineHeight: 1.05,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Why choose{" "}
            <em className="italic font-light text-accent-warm">
              River Fox Events?
            </em>
          </h2>
        </div>
        <p
          className="mx-auto max-w-[680px] text-center text-[16px] leading-[1.75] text-ink-soft fade-up"
          style={{ textWrap: "pretty" }}
        >
          {body ?? (
            <>
              River Fox Events is known for creating thoughtfully styled
              celebrations
              {cityName ? ` in ${cityName}` : ""} that feel cohesive and
              effortlessly brought together. With a focus on statement
              installations and refined styling, each event is tailored to
              your space and vision - resulting in a finish that feels
              considered, distinctive and ready to be enjoyed.
            </>
          )}
        </p>
      </div>
    </section>
  );
};

export default LocationUSP;
