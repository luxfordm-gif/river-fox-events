import { Instagram } from "lucide-react";
import InstagramStrip from "@/components/rfx/InstagramStrip";
import { INSPIRATION_HOME } from "@/data/inspiration";

/** Instagram CTA block, then an endless strip of recent work (same strip as the Christmas and service pages). */
const InstagramFollow = () => {
  return (
    <section
      id="instagram"
      className="rfx-section rfx-instagram"
      aria-labelledby="instagram-heading"
    >
      <div className="container-rfx">
        <div className="border-t border-ink/15 pt-10 md:pt-14 fade-up rfx-instagram-inner">
          <div className="flex flex-col items-center text-center max-w-[680px] mx-auto">
            <div className="t-eyebrow text-ink-soft mb-7 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
              Behind the scenes
              <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
            </div>

            <h2
              id="instagram-heading"
              className="t-h2"
            >
              Follow along on{" "}
              <em className="t-accent">Instagram.</em>
            </h2>

            <p className="t-lead text-ink-soft mt-7 max-w-[480px]">
              Sneak peeks, install days and the small details that make every
              River Fox celebration feel like itself.
            </p>

            <a
              href="https://www.instagram.com/riverfox_events/"
              target="_blank"
              rel="noreferrer"
              className="btn-solid-rf accent mt-10"
              aria-label="Follow River Fox Events on Instagram"
            >
              <Instagram size={16} aria-hidden="true" />
              @riverfox_events
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 md:mt-14">
        <InstagramStrip images={INSPIRATION_HOME} />
      </div>
    </section>
  );
};

export default InstagramFollow;
