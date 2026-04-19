import { useState } from "react";

const FAQS = [
  {
    q: "What areas do you cover?",
    a: "River Fox Events is based in Surrey and primarily works across Cobham, Weybridge, Esher, Oxshott, Guildford, Reigate, Farnham and Horsham. We also travel into London and the surrounding Home Counties for the right project — just ask when you enquire.",
  },
  {
    q: "How much does event styling cost?",
    a: "Our events start from £600. Full room transformations and premium installations typically range from £1,200 to £3,500+. Every event is bespoke, so we'll always give you a clear proposal before anything is confirmed.",
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
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="rfx-section white" aria-labelledby="faq-heading">
      <div className="container-rfx">
        <div className="text-center mb-14">
          <div className="eyebrow mb-7">(04) — FAQ</div>
          <h2
            id="faq-heading"
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 5.4vw, 84px)",
              lineHeight: 1.02,
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
              href="mailto:hello@riverfoxevents.co.uk"
              className="text-ink underline-offset-4 underline decoration-ink/30 hover:decoration-ink"
            >
              hello@riverfoxevents.co.uk
            </a>
          </p>
        </div>

        <div className="max-w-[980px] mx-auto">
          {FAQS.map((it, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? "open" : ""}`}
              onClick={() => setOpen(open === i ? -1 : i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(open === i ? -1 : i);
                }
              }}
              aria-expanded={open === i}
            >
              <div className="faq-head">
                <span className="font-mono-rf text-[11px] tracking-[0.22em] text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="q">{it.q}</span>
                <span className="faq-plus">+</span>
              </div>
              <div className="faq-body">
                <p>{it.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
