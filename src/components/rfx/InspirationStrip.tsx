import type { ReactNode } from "react";
import InstagramStrip, { type InstagramStripImage } from "@/components/rfx/InstagramStrip";
import { SectionHeading } from "@/components/rfx/SectionHeading";

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
      <div className="text-center fade-up">
        <SectionHeading id={`${id}-heading`}>
          {lead} <em className="t-accent">{accent}</em>
        </SectionHeading>
      </div>
    </div>
    <div className="below-heading">
      <InstagramStrip images={images} />
    </div>
  </section>
);

export default InspirationStrip;
