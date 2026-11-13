import { useEffect, type ReactNode } from "react";
import FaqList from "@/components/rfx/FaqList";
import { removeJsonLd, upsertJsonLd } from "@/seo/headTags";
import type { FaqItem } from "@/data/homeFaqs";

/**
 * The FAQ section: one component for every page (home, service, town and
 * Christmas), replacing the two near-identical FAQ components on 2026-11-13.
 * Questions come from the page; with none it shows the children's party
 * questions below.
 */
type FaqSectionProps = {
  faqs?: FaqItem[];
  headingId?: string;
  /** Item to open by default. Pass `false` to start with all closed. */
  defaultOpen?: string | false;
  /** Extra class on the section, e.g. the Christmas page's own padding (.xmas-faq). */
  className?: string;
  /** Named text style for the heading; defaults to the section title (t-h2). */
  headingClass?: string;
  /** Section title. "FAQs" on the service and town pages; the Christmas page
   *  keeps "Your questions answered." (Matt, 2026-11-08). */
  heading?: ReactNode;
};

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "How far in advance should I book?",
    a: "I'd suggest enquiring at least 6–8 weeks ahead for children's parties. Popular dates, especially weekends in the school holidays, book up quickly. If your date is sooner, do still get in touch, and I'll tell you honestly what I can do in the time.",
  },
  {
    q: "Do you travel to my home or venue?",
    a: "Yes, I come to you: your home, garden, a private venue, a restaurant or a hotel. I set up before guests arrive and take everything down afterwards, so there's nothing left for you to do.",
  },
  {
    q: "Can I choose my own theme?",
    a: "Yes. Send me a theme, a colour palette or a photo you love, and I'll design the party around it.",
  },
  {
    q: "How much does children's party styling cost in Surrey?",
    a: "Parties start from £300, with larger or more involved designs usually ranging from £600 to £1,500+.",
  },
  {
    q: "What happens on the day?",
    a: "I arrive before your guests and install everything: the balloon decorations, backdrops, the cake table and signage. You walk into a finished room, and after the party I come back to pack it all away.",
    aNode: (
      <>
        I arrive before your guests and install everything: the{" "}
        <a href="/balloon-installations/" className="text-link">
          balloon decorations
        </a>
        , backdrops, the cake table and signage. You walk into a finished
        room, and after the party I come back to pack it all away.
      </>
    ),
  },
  {
    q: "Do you style parties outside Surrey?",
    a: "Surrey is home, but I regularly travel into London and the surrounding Home Counties. Just mention your location when you enquire and I'll let you know.",
  },
];

const FaqSection = ({
  faqs = DEFAULT_FAQS,
  headingId = "cp-faq-heading",
  defaultOpen = false,
  className = "",
  headingClass = "t-h2",
  heading = "FAQs",
}: FaqSectionProps = {}) => {
  // Inject FAQPage JSON-LD scoped to this section so search engines can pick up
  // the Q&A as a rich result. We dedupe per headingId so multiple FAQ blocks
  // don't collide.
  useEffect(() => {
    const id = `rfx-jsonld-faq-${headingId}`;
    upsertJsonLd(id, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    return () => removeJsonLd(id);
  }, [faqs, headingId]);

  return (
    <section
      id="faq"
      className={`rfx-section white ${className}`}
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        <div className="text-center heading-to-content">
          <h2
            id={headingId}
            className={headingClass}
          >
            {heading}
          </h2>
        </div>

        <div className="max-w-[980px] mx-auto">
          <FaqList items={faqs} defaultOpen={defaultOpen === false ? null : Number(defaultOpen.replace("item-", ""))} />
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
