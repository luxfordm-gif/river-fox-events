import type { ReactNode } from "react";
import InstagramStrip, { type InstagramStripImage } from "@/components/rfx/InstagramStrip";

type InspirationStripProps = {
  id: string;
  /** Italic end of "Ideas for ...", e.g. "your party." Shortened from "A little inspiration for your next ..." (Matt, 2026-11-08). */
  accent: ReactNode;
  /** Plain start of the heading, before the italic accent. Defaults to
      "Ideas for"; the service pages use their own, e.g. "Parties we've"
      + "already made." (Matt, 2026-11-09). */
  lead?: string;
  images: InstagramStripImage[];
};

/**
 * "Ideas for your ..." - the same endless Instagram strip
 * as the Christmas page, for the service pages. Every tile links to
 * @riverfox_events. The title uses the shared section size (--fs-h2).
 */
const InspirationStrip = ({ id, accent, lead = "Ideas for", images }: InspirationStripProps) => (
  <section className="rfx-section white rfx-inspiration" aria-labelledby={`${id}-heading`}>
    <div className="container-rfx">
      <div className="max-w-[760px] mx-auto text-center fade-up">
        <h2
          id={`${id}-heading`}
          className="t-h2"
          style={{ textWrap: "balance" }}
        >
          {lead} <em className="t-accent">{accent}</em>
        </h2>
      </div>
    </div>
    <div className="mt-12 md:mt-14">
      <InstagramStrip images={images} />
    </div>
  </section>
);

export default InspirationStrip;
