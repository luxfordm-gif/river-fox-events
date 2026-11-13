import { Instagram } from "lucide-react";
import InstagramStrip from "@/components/rfx/InstagramStrip";
import { INSPIRATION_HOME } from "@/data/inspiration";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";

/** Instagram CTA block, then an endless strip of recent work (same strip as the Christmas and service pages). */
const InstagramFollow = () => {
  return (
    <section
      id="instagram"
      className="rfx-section rfx-instagram"
      aria-labelledby="instagram-heading"
    >
      <div className="container-rfx">
        <div className="border-t border-divider rule-to-content fade-up rfx-instagram-inner">
          <div className="flex flex-col items-center text-center max-w-[680px] mx-auto">
            <div className="t-overline text-ink-soft eyebrow-above inline-flex items-center icon-gap">
              <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
              Behind the scenes
              <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
            </div>

            <SectionHeading id="instagram-heading">
              Follow along on{" "}
              <em className="t-accent">Instagram.</em>
            </SectionHeading>

            <SectionIntro>
              Sneak peeks, install days and the small details that make every
              River Fox celebration feel like itself.
            </SectionIntro>

            <a
              href="https://www.instagram.com/riverfox_events/"
              target="_blank"
              rel="noreferrer"
              className="btn-solid-rf accent text-to-action"
              aria-label="Follow River Fox Events on Instagram"
            >
              <Instagram size={16} aria-hidden="true" />
              @riverfox_events
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="text-to-content">
        <InstagramStrip images={INSPIRATION_HOME} />
      </div>
    </section>
  );
};

export default InstagramFollow;
