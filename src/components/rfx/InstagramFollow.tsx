import { Instagram } from "lucide-react";

/** Lightweight Instagram CTA block — no gallery, links straight to the profile. */
const InstagramFollow = () => {
  return (
    <section
      id="instagram"
      className="rfx-section"
      aria-labelledby="instagram-heading"
    >
      <div className="container-rfx">
        <div className="border-t border-b border-ink/15 py-20 md:py-28 fade-up">
          <div className="flex flex-col items-center text-center max-w-[680px] mx-auto">
            <div className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-7 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
              Behind the scenes
              <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
            </div>

            <h2
              id="instagram-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(38px, 5.4vw, 76px)",
                lineHeight: 1.04,
                fontWeight: 300,
                letterSpacing: "-0.028em",
              }}
            >
              Follow along on{" "}
              <em className="italic font-light text-accent-warm">Instagram.</em>
            </h2>

            <p className="text-[16px] leading-[1.7] text-ink-soft mt-7 max-w-[480px]">
              Sneak peeks, install days and the small details that make every
              River Fox celebration feel like itself.
            </p>

            <a
              href="https://instagram.com/riverfoxevents"
              target="_blank"
              rel="noreferrer"
              className="btn-solid-rf accent mt-10"
              aria-label="Follow River Fox Events on Instagram"
            >
              <Instagram size={16} aria-hidden="true" />
              @riverfoxevents
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramFollow;
