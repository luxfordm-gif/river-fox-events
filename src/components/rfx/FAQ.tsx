import { useEffect, type ReactNode } from "react";
import FaqList from "@/components/rfx/FaqList";
import { removeJsonLd, upsertJsonLd } from "@/seo/headTags";

const linkCx =
  "text-ink underline-offset-4 underline decoration-ink/30 hover:decoration-ink";

const INSTAGRAM_URL = "https://www.instagram.com/riverfox_events/";

type FAQItem = { q: string; a: string; aNode?: ReactNode };

const FAQS: FAQItem[] = [
  {
    q: "What areas do you cover?",
    a: "River Fox Events is based in Surrey and primarily works across Cobham, Weybridge, Esher, Oxshott, Guildford, Reigate, Farnham and Horsham. We also travel into London and the surrounding Home Counties for the right project - just ask when you enquire.",
  },
  {
    q: "How much does event styling cost?",
    a: "Our events start from £300. Full room transformations and premium installations typically range from £800 to £1,500+. Every event is tailored, so we'll always give you a clear proposal before anything is confirmed.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend enquiring at least 6–8 weeks ahead for children's parties and milestone celebrations. Popular dates - particularly weekends in school holidays - book quickly. Corporate projects can often be accommodated with shorter lead times, so it's always worth asking.",
    aNode: (
      <>
        We recommend enquiring at least 6–8 weeks ahead for{" "}
        <a href="/childrens-parties/" className={linkCx}>children's parties</a> and{" "}
        <a href="/milestone-celebrations/" className={linkCx}>milestone celebrations</a>. Popular dates - particularly weekends in school holidays - book quickly.{" "}
        <a href="/corporate-brand-styling/" className={linkCx}>Corporate projects</a> can often be accommodated with shorter lead times, so it's always worth asking.
      </>
    ),
  },
  {
    q: "Do you travel to my venue or home?",
    a: "Yes. We come to you - whether that's your home, a private venue, a restaurant, a corporate space or a hotel. We set everything up before guests arrive and take care of full breakdown afterwards.",
  },
  {
    q: "Can I see examples of your work?",
    a: "The best way to see Laura's work is on Instagram at @riverfox_events, where you'll find a full archive of past celebrations. You can also see selected work across our services pages.",
    aNode: (
      <>
        The best way to see Laura's work is on{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkCx}>Instagram at @riverfox_events</a>, where you'll find a full archive of past celebrations. You can also see selected work across our services pages.
      </>
    ),
  },
  {
    q: "How many events do you take on each month?",
    a: "Deliberately few. Keeping our client list small means every event receives Laura's full personal attention - from design concept through to the day itself. We'd rather do fewer events exceptionally well than many events adequately.",
  },
  {
    q: "Do you style events other than children's parties?",
    a: "Yes - milestone celebrations (21sts, 40ths, 50ths, 70ths, baby showers, anniversaries) and corporate events are both core services. See our Signature Experiences for the full picture.",
    aNode: (
      <>
        Yes -{" "}
        <a href="/milestone-celebrations/" className={linkCx}>milestone celebrations</a> (21sts, 40ths, 50ths, 70ths, baby showers, anniversaries) and{" "}
        <a href="/corporate-brand-styling/" className={linkCx}>corporate events</a> are both core services. See our Signature Experiences for the full picture.
      </>
    ),
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
        <div className="text-center heading-to-body">
          <h2
            id="faq-heading"
            className="t-h2"
          >
            Questions{" "}
            <em className="t-accent">answered.</em>
          </h2>
          <p className="t-body-sm text-ink-soft max-w-[520px] mx-auto mt-6">
            If you don't see what you need here, just ask -{" "}
            <a
              href="mailto:Riverfoxevents@gmail.com"
              className="text-ink underline-offset-4 underline decoration-ink/30 hover:decoration-ink"
            >
              Riverfoxevents@gmail.com
            </a>
          </p>
        </div>

        <div className="max-w-[980px] mx-auto">
          <FaqList items={FAQS} />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
