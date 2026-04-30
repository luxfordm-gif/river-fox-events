import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { removeJsonLd, upsertJsonLd } from "@/seo/headTags";

const FAQS = [
  {
    q: "What areas do you cover?",
    a: "River Fox Events is based in Surrey and primarily works across Cobham, Weybridge, Esher, Oxshott, Guildford, Reigate, Farnham and Horsham. We also travel into London and the surrounding Home Counties for the right project — just ask when you enquire.",
  },
  {
    q: "How much does event styling cost?",
    a: "Our events start from £460. Full room transformations and premium installations typically range from £1,200 to £3,500+. Every event is bespoke, so we'll always give you a clear proposal before anything is confirmed.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend enquiring at least 6–8 weeks ahead for children's parties and milestone celebrations. Popular dates — particularly weekends in school holidays — book quickly. Corporate projects can often be accommodated with shorter lead times, so it's always worth asking.",
  },
  {
    q: "Do you travel to my venue or home?",
    a: "Yes. We come to you — whether that's your home, a private venue, a restaurant, a corporate space or a hotel. We set everything up before guests arrive and take care of full breakdown afterwards.",
  },
  {
    q: "Can I see examples of your work?",
    a: "The best way to see Laura's work is on Instagram at @riverfoxevents, where you'll find a full archive of past celebrations. You can also see selected work across our services pages.",
  },
  {
    q: "How many events do you take on each month?",
    a: "Deliberately few. Keeping our client list small means every event receives Laura's full personal attention — from design concept through to the day itself. We'd rather do fewer events exceptionally well than many events adequately.",
  },
  {
    q: "Do you style events other than children's parties?",
    a: "Yes — milestone celebrations (21sts, 40ths, 50ths, 70ths, baby showers, anniversaries) and corporate events are both core services. See our Signature Experiences for the full picture.",
  },
];

const FAQ = () => {
  useEffect(() => {
    const id = "rfx-jsonld-faq-home";
    upsertJsonLd(id, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    return () => removeJsonLd(id);
  }, []);

  return (
    <section id="faq" className="rfx-section white" aria-labelledby="faq-heading">
      <div className="container-rfx">
        <div className="text-center mb-14">
          <h2
            id="faq-heading"
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
            If you don't see what you need here, just ask —{" "}
            <a
              href="mailto:Riverfoxevents@gmail.com"
              className="text-ink underline-offset-4 underline decoration-ink/30 hover:decoration-ink"
            >
              Riverfoxevents@gmail.com
            </a>
          </p>
        </div>

        <div className="max-w-[980px] mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((it, i) => (
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
                <AccordionContent
                  className="faq-rf-content overflow-hidden text-base"
                  forceMount
                >
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

export default FAQ;
