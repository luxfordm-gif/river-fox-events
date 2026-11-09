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
    a: "I'm based in Surrey and mostly work across Cobham, Weybridge, Esher, Oxshott, Guildford, Reigate, Farnham and Horsham. I also travel into London and the surrounding Home Counties - just ask when you enquire.",
    aNode: (
      <>
        I'm based in Surrey and mostly work across{" "}
        <a href="/party-styling-cobham/" className={linkCx}>Cobham</a>,{" "}
        <a href="/party-styling-weybridge/" className={linkCx}>Weybridge</a>,{" "}
        <a href="/party-styling-esher/" className={linkCx}>Esher</a>,{" "}
        <a href="/party-styling-oxshott/" className={linkCx}>Oxshott</a>,{" "}
        <a href="/party-styling-guildford/" className={linkCx}>Guildford</a>,{" "}
        <a href="/party-styling-reigate/" className={linkCx}>Reigate</a>, Farnham and{" "}
        <a href="/party-styling-horsham/" className={linkCx}>Horsham</a>. I also travel into London and the surrounding Home Counties - just ask when you enquire.
      </>
    ),
  },
  {
    q: "How much does event styling cost?",
    a: "Events start from £300. Full room setups and larger installations usually range from £600 to £1,500+. I quote every event individually, so you'll always have a clear proposal before anything is confirmed.",
  },
  {
    q: "How far in advance should I book?",
    a: "I'd suggest enquiring at least 6–8 weeks ahead for children's parties and milestone celebrations. Popular dates, especially weekends in the school holidays, book quickly. Corporate projects can often be done at shorter notice, so it's always worth asking.",
    aNode: (
      <>
        I'd suggest enquiring at least 6–8 weeks ahead for{" "}
        <a href="/childrens-parties/" className={linkCx}>children's parties</a> and{" "}
        <a href="/milestone-celebrations/" className={linkCx}>milestone celebrations</a>. Popular dates, especially weekends in the school holidays, book quickly.{" "}
        <a href="/corporate-brand-styling/" className={linkCx}>Corporate projects</a> can often be done at shorter notice, so it's always worth asking.
      </>
    ),
  },
  {
    q: "Do you travel to my venue or home?",
    a: "Yes, I come to you, whether that's your home, a private venue, a restaurant, an office or a hotel. I set everything up before guests arrive and take it all down afterwards.",
  },
  {
    q: "Can I see examples of your work?",
    a: "The best place to see my work is Instagram at @riverfox_events, where you'll find an archive of past celebrations. There are more photos on the Our work page and on each of the service pages.",
    aNode: (
      <>
        The best place to see my work is{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={linkCx}>Instagram at @riverfox_events</a>, where you'll find an archive of past celebrations. There are more photos on the{" "}
        <a href="/our-work/" className={linkCx}>Our work</a> page and on each of the service pages.
      </>
    ),
  },
  {
    q: "How many events do you take on each month?",
    a: "Only a few. I keep the business small so I can be there for every event, from the first sketch to packing down on the day.",
  },
  {
    q: "Do you style events other than children's parties?",
    a: "Yes - milestone celebrations (21sts, 40ths, 50ths, 70ths, baby showers, anniversaries) and corporate events make up a big part of my work. The services further up this page show all three.",
    aNode: (
      <>
        Yes -{" "}
        <a href="/milestone-celebrations/" className={linkCx}>milestone celebrations</a> (21sts, 40ths, 50ths, 70ths, baby showers, anniversaries) and{" "}
        <a href="/corporate-brand-styling/" className={linkCx}>corporate events</a> make up a big part of my work. The services further up this page show all three.
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
        <div className="text-center heading-to-content">
          <h2
            id="faq-heading"
            className="t-h2"
          >
            {/* "FAQs", as on the service and town pages (Matt, 2026-11-08). */}
            FAQs
          </h2>
        </div>

        <div className="max-w-[980px] mx-auto">
          <FaqList items={FAQS} />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
