import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = { q: string; a: string };
type ChildrensFAQProps = {
  faqs?: FAQ[];
  headingId?: string;
  /** Item to open by default. Pass `false` to start with all closed. */
  defaultOpen?: string | false;
  paddingTop?: string;
  paddingBottom?: string;
};

const DEFAULT_FAQS: FAQ[] = [
  {
    q: "How far in advance should I book?",
    a: "We recommend enquiring at least 6–8 weeks ahead for children's parties. Popular dates — particularly weekends in school holidays — book up quickly. If your date is sooner, do still get in touch; we'll always tell you honestly whether we can do it justice in the time available.",
  },
  {
    q: "Do you travel to my home or venue?",
    a: "Yes. We come to you — your home, garden, a private venue, a restaurant or a hotel. Setup happens before guests arrive and full breakdown is included afterwards, so the day feels effortless from start to finish.",
  },
  {
    q: "Can I choose my own theme?",
    a: "Absolutely. Every River Fox party is built from scratch around your child's vision — there are no off-the-shelf packages. Bring your inspiration (a Pinterest board, a single object, a favourite story) and Laura will design around it.",
  },
  {
    q: "How much does children's party styling cost in Surrey?",
    a: "Our parties start from £460 for an intimate single focal point. Full room styling typically sits between £1,200 and £2,500, with large-scale transformations from £2,500+. Every event is individually quoted following a discovery call so the proposal reflects exactly what you want.",
  },
  {
    q: "What happens on the day?",
    a: "We arrive ahead of guests and set everything up — installations, balloons, signage, cake table, the lot. You walk into a finished space. Once the celebration is over, we return for a full breakdown so you don't have to lift a finger.",
  },
  {
    q: "Do you style parties outside Surrey?",
    a: "Surrey is home, but we regularly travel into London and the surrounding Home Counties for the right project. Just mention your location when you enquire and we'll let you know.",
  },
];

const ChildrensFAQ = ({
  faqs = DEFAULT_FAQS,
  headingId = "cp-faq-heading",
  defaultOpen = "item-0",
  paddingTop,
  paddingBottom = "48px",
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
        <div className="text-center mb-14">
          <h2
            id={headingId}
            className="font-serif-rf"
            style={{
              fontSize: "clamp(36px, 4vw, 72px)",
              lineHeight: 1.06,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            Questions{" "}
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
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpen === false ? undefined : defaultOpen}
            className="w-full"
          >
            {faqs.map((it, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="faq-rf-item border-t border-ink/20 last:border-b last:border-ink/20"
              >
                <AccordionTrigger className="faq-rf-trigger group hover:no-underline py-7 [&>svg]:hidden">
                  <div className="grid grid-cols-[60px_1fr_40px] items-baseline gap-6 w-full text-left max-md:grid-cols-[40px_1fr_32px] max-md:gap-3.5">
                    <span className="font-mono-rf text-[11px] tracking-[0.22em] text-ink-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif-rf font-light text-ink leading-[1.25] tracking-[-0.018em] text-[clamp(20px,2.4vw,30px)]">
                      {it.q}
                    </span>
                    <span className="faq-rf-plus inline-flex items-center justify-center text-[22px] font-light text-ink transition-transform duration-500 ease-out">
                      +
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="faq-rf-content overflow-hidden text-base">
                  <div className="grid grid-cols-[60px_1fr_40px] gap-6 max-md:grid-cols-[40px_1fr_32px] max-md:gap-3.5">
                    <p className="col-start-2 text-[15px] leading-[1.7] text-ink-soft max-w-[680px] pt-2 pb-4">
                      {it.a}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default ChildrensFAQ;
