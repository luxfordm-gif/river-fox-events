import type { ReactNode } from "react";
import InstagramStrip, { type InstagramStripImage } from "@/components/rfx/InstagramStrip";

type InspirationStripProps = {
  id: string;
  /** Italic end of "A little inspiration for ...", e.g. "your next party." */
  accent: ReactNode;
  images: InstagramStripImage[];
  /** No bottom padding: when the next section has the same background (the FAQs on the town and
   *  Balloons pages), its own top padding is the whole gap, as on the rest of the page. */
  flushBottom?: boolean;
  /** Shorter top padding, when it sits right under "Kind words" (town and Balloons pages). */
  compactTop?: boolean;
};

/**
 * "A little inspiration for your next ..." - the same endless Instagram strip
 * as the Christmas page, for the service pages. Every tile links to
 * @riverfox_events. The title uses the shared section size (--fs-h2).
 */
const InspirationStrip = ({ id, accent, images, flushBottom, compactTop }: InspirationStripProps) => (
  <section className={`rfx-section white rfx-inspiration${flushBottom ? " !pb-0" : ""}${compactTop ? " !pt-12 md:!pt-14" : ""}`} aria-labelledby={`${id}-heading`}>
    <div className="container-rfx">
      <div className="max-w-[760px] mx-auto text-center fade-up">
        <h2
          id={`${id}-heading`}
          className="font-serif-rf"
          style={{ fontSize: "var(--fs-h2)", lineHeight: 1.0, fontWeight: 400, letterSpacing: "-0.025em", textWrap: "balance" }}
        >
          A little inspiration for <em className="italic font-light text-accent-warm">{accent}</em>
        </h2>
      </div>
    </div>
    <div className="mt-12 md:mt-14">
      <InstagramStrip images={images} />
    </div>
  </section>
);

export default InspirationStrip;
