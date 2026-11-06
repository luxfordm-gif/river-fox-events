import { useEffect, type ReactNode } from "react";
import FaqList from "@/components/rfx/FaqList";

type FAQ = { q: string; a: string; aNode?: ReactNode };
type ChildrensFAQProps = {
  faqs?: FAQ[];
  headingId?: string;
  /** Item to open by default. Pass `false` to start with all closed. */
  defaultOpen?: string | false;
  paddingTop?: string;
  paddingBottom?: string;
  /** Heading size token; defaults to the section-title size. */
  headingSize?: string;
};

const DEFAULT_FAQS: FAQ[] = [
  {
    q: "How far in advance should I book?",
    a: "We recommend enquiring at least 6–8 weeks ahead for children's parties. Popular dates - particularly weekends in school holidays - book up quickly. If your date is sooner, do still get in touch; we'll always tell you honestly whether we can create something beautiful in the time available.",
  },
  {
    q: "Do you travel to my home or venue?",
    a: "Yes. We come to you - your home, garden, a private venue, a restaurant or a hotel. Setup happens before guests arrive and full breakdown is included afterwards, so the day feels effortless from start to finish.",
  },
  {
    q: "Can I choose my own theme?",
    a: "Each celebration is individually created and tailored to your style and vision. Any inspiration you have can be shared and developed into a design that feels cohesive and considered.",
  },
  {
    q: "How much does children's party styling cost in Surrey?",
    a: "Our parties start from £460, with larger or more involved designs typically ranging from £1,200 to £2,500+.",
  },
  {
    q: "What happens on the day?",
    a: "We arrive before guests and install every element - balloon installations, backdrops, the cake table, signage. You walk into a finished room. After the party we return for a quiet breakdown.",
    aNode: (
      <>
        We arrive before guests and install every element -{" "}
        <a href="/balloon-installations/" className="underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors">
          balloon installations
        </a>
        , backdrops, the cake table, signage. You walk into a finished room.
        After the party we return for a quiet breakdown.
      </>
    ),
  },
  {
    q: "Do you style parties outside Surrey?",
    a: "Surrey is home, but we regularly travel into London and the surrounding Home Counties for the right project. Just mention your location when you enquire and we'll let you know.",
  },
];

const ChildrensFAQ = ({
  faqs = DEFAULT_FAQS,
  headingId = "cp-faq-heading",
  defaultOpen = false,
  paddingTop,
  paddingBottom = "48px",
  headingSize = "var(--fs-h2)",
}: ChildrensFAQProps = {}) => {
  // Inject FAQPage JSON-LD scoped to this section so search engines can pick up
  // the Q&A as a rich result. We dedupe per headingId so multiple FAQ blocks
  // don't collide.
  useEffect(() => {
    const id = `rfx-jsonld-faq-${headingId}`;
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [faqs, headingId]);

  return (
    <section
      id="faq"
      className="rfx-section white"
      style={{ paddingTop, paddingBottom }}
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        <div className="text-center heading-to-body">
          <h2
            id={headingId}
            className="font-serif-rf"
            style={{
              fontSize: headingSize,
              lineHeight: 1.06,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            Your questions{" "}
            <em className="italic font-light text-accent-warm">answered.</em>
          </h2>
          <p className="text-[15.5px] leading-[1.6] text-ink-soft max-w-[520px] mx-auto mt-6">
            Anything else on your mind?{" "}
            <a
              href="mailto:Riverfoxevents@gmail.com"
              className="text-ink underline-offset-4 underline decoration-ink/30 hover:decoration-ink"
            >
              Riverfoxevents@gmail.com
            </a>
          </p>
        </div>

        <div className="max-w-[980px] mx-auto">
          <FaqList items={faqs} defaultOpen={defaultOpen === false ? null : Number(defaultOpen.replace("item-", ""))} />
        </div>
      </div>
    </section>
  );
};

export default ChildrensFAQ;
