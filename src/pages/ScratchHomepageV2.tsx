/* THROWAWAY PROTOTYPE: homepage layout test at /scratch/homepage-v2/.
   noindex + nofollow, not in the sitemap, nav or footer. Nothing here is
   shared with the live homepage; delete this file, its stylesheet, the route
   in App.tsx and routes.ts to remove it. Any text in [square brackets] is
   placeholder. */
import { useEffect, useState } from "react";
import "./scratch-homepage-v2.css";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import ChristmasHero from "@/components/rfx/ChristmasHero";
import Mission from "@/components/rfx/Mission";
import Experiences from "@/components/rfx/Experiences";
import Testimonials from "@/components/rfx/Testimonials";
import FaqSection from "@/components/rfx/FaqSection";
import InstagramFollow from "@/components/rfx/InstagramFollow";
import { SectionHeading } from "@/components/rfx/SectionHeading";
import { HOME_FAQS } from "@/data/homeFaqs";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { whatsappHref } from "@/lib/whatsapp";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta } from "@/seo/headTags";
import dino from "@/assets/dinosaur-childrens-party-styling-surrey.webp";
import forty from "@/assets/40th-birthday-rose-gold-marquee-surrey.webp";
import gala from "@/assets/corporate-gala-styling-surrey.webp";
import laura from "@/assets/laura-portrait.webp";
import finished from "@/assets/journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp";
import detail from "@/assets/journal/from-design-to-delivery/dinosaur-party-detail-surrey.webp";

const EVENTS = [
  {
    img: dino,
    alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts",
    type: "[Children's party · Surrey]",
    line: "[One line on the brief, e.g. a sage jungle theme for a fifth birthday at home]",
  },
  {
    img: forty,
    alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock",
    type: "[Milestone birthday · Surrey]",
    line: "[One line on the brief, e.g. a soft pink 40th with a light-up number]",
  },
  {
    img: gala,
    alt: "Navy, gold and cream balloons around a Children in Need Pudsey backdrop at a corporate gala",
    type: "[Corporate gala · Surrey]",
    line: "[One line on the brief, e.g. a charity gala backdrop in the brand colours]",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Share your vision",
    body: "Send me your date, venue and any ideas you have so far. I'll then give you a call to talk it through.",
    img: detail,
    alt: "Close-up of dinosaur party details: sage balloons, foliage and wooden crates",
  },
  {
    n: "02",
    title: "Your proposal",
    body: "I put together a concept with a moodboard, colour palette and visuals, so you know exactly how it will look before anything is made.",
    img: null,
    alt: "",
  },
  {
    n: "03",
    title: "Installation",
    body: "I set everything up before your first guest arrives, so you walk into a finished space. Afterwards, I pack it all down and take it away.",
    img: finished,
    alt: "Finished dinosaur party in a Surrey home: sage balloon arch, AYAAN name sign, dinosaur cutouts and wooden explorer crates",
  },
];

const FORM_WHATSAPP = whatsappHref("Hi Laura, I'd like a quote for an event. My date and postcode are ");

/* Enquiry form copy for this page only: same look as the live one, but no
   form name (so the page-wide form tracking ignores it), no Netlify
   attributes and a disabled submit, so nothing can be sent. */
const ScratchForm = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <section id="enquire" className="rfx-section dark rfx-enquire" aria-labelledby="enquire-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] columns-gap items-start">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-stretch lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="enquire-heading" align="lg-left">
              Let's create something <em className="t-accent">beautiful.</em>
            </SectionHeading>
            <p className="t-lead measure-lead heading-to-text text-ink-faint">
              Celebrations start from £300 and every one is quoted to your brief.{" "}
              <span className="text-on-deep">I take on a limited number each month</span>, so book early, or call me on{" "}
              <a href="tel:+447872114191" data-track-skip className="text-link whitespace-nowrap text-on-deep">
                07872 114191
              </a>
              .
            </p>
            <div className="text-to-action">
              <a href={FORM_WHATSAPP} data-track-skip className="btn-ghost-rf on-dark">
                WhatsApp Laura
              </a>
            </div>
          </div>

          <form className="form-wrap" onSubmit={(e) => e.preventDefault()}>
            <div className="hidden md:block form-title text-left">
              <h3 className="t-h4 text-primary">Tell me about your celebration</h3>
              <p className="hidden lg:block t-small text-ink-soft title-to-text">
                Complete the form below and I'll be in touch to discuss your event in more detail.
              </p>
            </div>
            <div className="form-grid">
              <label className="form-row">
                <span className="lbl">Full name</span>
                <input type="text" placeholder="Your full name" autoComplete="off" />
              </label>
              <label className="form-row">
                <span className="lbl">Email address</span>
                <input type="email" placeholder="you@example.com" autoComplete="off" />
              </label>
              <label className="form-row">
                <span className="lbl">Phone (optional)</span>
                <input type="tel" placeholder="07…" autoComplete="off" />
              </label>
              <label className="form-row">
                <span className="lbl">Event date</span>
                <input type="date" />
              </label>
              <label className="form-row full">
                <span className="lbl">Message</span>
                <textarea rows={3} placeholder="Theme, colours, inspiration, or anything you already have in mind" />
              </label>
            </div>
            <div id="scratch-more-details" hidden={!moreOpen}>
              <div className="form-grid form-more">
                <label className="form-row full">
                  <span className="lbl">Event location / venue</span>
                  <input type="text" placeholder="e.g. at home in Cobham" />
                </label>
                <label className="form-row full">
                  <span className="lbl">Type of event</span>
                  <select defaultValue="">
                    <option value="">Choose one</option>
                    <option>Children's party</option>
                    <option>Milestone celebration</option>
                    <option>Corporate / brand event</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="form-actions flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                aria-expanded={moreOpen}
                aria-controls="scratch-more-details"
                onClick={() => setMoreOpen((o) => !o)}
                className="t-label text-primary w-full sm:w-auto text-left text-pretty sx-extras"
              >
                {moreOpen ? "− Fewer details" : "+ Add more details for a quicker quote (optional)"}
              </button>
              <button
                type="submit"
                disabled
                className="btn-solid-rf accent w-full sm:w-auto justify-center shrink-0 disabled:opacity-60"
              >
                Request my quote <span>→</span>
              </button>
            </div>
            <p className="t-meta text-ink-soft sx-form-note">[Prototype: submit is switched off on this page]</p>
          </form>
        </div>
      </div>
    </section>
  );
};

/* Phones only (CSS hides it from 768px). Shows once the hero has scrolled
   away, hides while the enquiry form is on screen, and sits above the cookie
   banner (never over it) while that is showing. */
const StickyBar = () => {
  const [show, setShow] = useState(false);
  const [lift, setLift] = useState(0);

  useEffect(() => {
    const hero = document.querySelector("main > section");
    const form = document.getElementById("enquire");
    let pastHero = false;
    let formOn = false;
    const update = () => setShow(pastHero && !formOn);
    const heroIo = hero
      ? new IntersectionObserver(([e]) => {
          pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
          update();
        })
      : null;
    const formIo = form
      ? new IntersectionObserver(([e]) => {
          formOn = e.isIntersecting;
          update();
        })
      : null;
    if (hero) heroIo?.observe(hero);
    if (form) formIo?.observe(form);

    const measure = () => {
      const banner = document.querySelector<HTMLElement>('[aria-label="Cookie preferences"]');
      setLift(banner ? Math.ceil(banner.getBoundingClientRect().height) + 16 : 0);
    };
    measure();
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    return () => {
      heroIo?.disconnect();
      formIo?.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      className={`sx-sticky${show ? " is-on" : ""}`}
      style={{ bottom: lift ? `${lift + 8}px` : undefined }}
      aria-hidden={!show}
    >
      <a href={ENQUIRE_HREF} onClick={handleEnquireClick} data-track-skip className="btn-solid-rf accent" tabIndex={show ? 0 : -1}>
        Enquire now
      </a>
      <a href={FORM_WHATSAPP} data-track-skip className="btn-ghost-rf" tabIndex={show ? 0 : -1}>
        WhatsApp Laura
      </a>
    </div>
  );
};

const ScratchHomepageV2 = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    applyMeta(findRoute("/scratch/homepage-v2")!);
  }, []);

  return (
    <div className="min-h-screen page-paper text-foreground nav-paper sx-page">
      <Nav />
      <main>
        {/* 1. Hero (as live: the Christmas video hero) */}
        <ChristmasHero trust />

        {/* 2. Headline + occasion cards (swipe row on phones) */}
        <Mission asTitle />
        <div className="sx-swipe">
          <Experiences
            align="centre"
            intro="Tell me what you're celebrating and I'll design around it, from one balloon arch to a full room."
          />
        </div>

        {/* 3. Recent events (new) */}
        <section id="recent-events" className="rfx-section white" aria-labelledby="recent-heading">
          <div className="container-rfx">
            <div className="heading-to-content text-center">
              <SectionHeading id="recent-heading">
                [Recent <em className="t-accent">events.</em>]
              </SectionHeading>
            </div>
            <div className="sx-events">
              {EVENTS.map((ev) => (
                <article key={ev.type} className="sx-event">
                  <div className="sx-event__photo rounded-large">
                    <img src={ev.img} alt={ev.alt} loading="lazy" decoding="async" width={1024} height={1280} />
                  </div>
                  <p className="t-overline text-ink-soft sx-event__type">{ev.type}</p>
                  <p className="t-body text-ink">{ev.line}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Kind words (as live) */}
        <Testimonials noDivider />

        {/* 5. How it works (redesign) */}
        <section id="process" className="rfx-section white" aria-labelledby="process-heading">
          <div className="container-rfx">
            <div className="heading-to-content">
              <SectionHeading id="process-heading" className="text-center text-ink">
                How it <em className="t-accent">works.</em>
              </SectionHeading>
            </div>
            <ol className="sx-steps">
              {STEPS.map((s) => (
                <li key={s.n} className="sx-step">
                  <span className="sx-step__num t-overline text-accent-warm">{s.n}</span>
                  <div className="sx-step__media rounded-large">
                    {s.img ? (
                      <img src={s.img} alt={s.alt} loading="lazy" decoding="async" width={800} height={600} />
                    ) : (
                      <div className="sx-step__ph t-meta">[moodboard example]</div>
                    )}
                  </div>
                  <div className="sx-step__text">
                    <h3 className="t-h5 text-ink">{s.title}</h3>
                    <p className="t-meta text-accent-warm sx-step__timing">[timing]</p>
                    <p className="t-small text-ink-soft title-to-text text-wrap">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="sx-process-cta">
              <a href={ENQUIRE_HREF} onClick={handleEnquireClick} data-track-skip className="btn-solid-rf accent">
                Reserve your date <span className="t-icon">→</span>
              </a>
              <p className="t-meta text-ink-soft">[No obligation · Reply within X · Setup and pack-down included]</p>
            </div>
          </div>
        </section>

        {/* 6. Meet Laura (slim) */}
        <section id="about" className="rfx-section white" aria-labelledby="about-heading">
          <div className="container-rfx">
            <div className="sx-laura">
              <div className="sx-laura__photo rounded-large">
                <img
                  src={laura}
                  alt="Laura, the founder and stylist, photographed amongst Surrey bluebells in a branded tee"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={1499}
                />
              </div>
              <div className="sx-laura__text">
                <div className="t-overline text-ink-soft eyebrow-above">Meet Laura, Founder</div>
                <SectionHeading id="about-heading" align="left">
                  Personally designed. <em className="t-accent">Personally delivered.</em>
                </SectionHeading>
                <p className="t-body heading-to-text text-ink measure-lead">
                  <strong>
                    I started River Fox Events after running a teepee sleepover business and realising how much I loved
                    creating moments that stay with you.
                  </strong>
                </p>
                <a href="/#about" data-track-skip className="btn-link-rf t-label text-to-action">
                  [More about Laura] <span className="arr">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ (as live) */}
        <FaqSection faqs={HOME_FAQS} headingId="faq-heading" />

        {/* 8. Closing CTA + enquiry form (submit disabled) */}
        <ScratchForm />

        {/* 9. Instagram (as live) */}
        <InstagramFollow />
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
};

export default ScratchHomepageV2;
