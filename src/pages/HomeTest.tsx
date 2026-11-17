/* THROWAWAY PROTOTYPE: scratch homepage layout test at /home-test/.
   noindex, nofollow, no sitemap, no nav or footer link. Hardcoded on
   purpose. Existing copy is word for word; anything new is [in brackets].
   Delete this file, src/styles/home-test.css and the /home-test route to remove. */
import { useEffect, useRef, useState } from "react";
import "@/styles/home-test.css";
import Nav from "@/components/rfx/Nav";
import ChristmasHero from "@/components/rfx/ChristmasHero";
import Mission from "@/components/rfx/Mission";
import Experiences from "@/components/rfx/Experiences";
import Testimonials from "@/components/rfx/Testimonials";
import FaqSection from "@/components/rfx/FaqSection";
import Enquire from "@/components/rfx/Enquire";
import InstagramFollow from "@/components/rfx/InstagramFollow";
import Footer from "@/components/rfx/Footer";
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
import step1Img from "@/assets/journal/from-design-to-delivery/dinosaur-party-detail-surrey.webp";
import step3Img from "@/assets/journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp";
import laura from "@/assets/laura-portrait.webp";

const EVENTS = [
  {
    img: dino,
    alt: "Sage green dinosaur birthday backdrop with an Ayaan name sign, tropical foliage and dinosaur cutouts",
    kind: "[Children's party · Surrey]",
    line: "[One line on the brief: what the family asked for.]",
  },
  {
    img: forty,
    alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock",
    kind: "[Milestone birthday · Surrey]",
    line: "[One line on the brief: what the family asked for.]",
  },
  {
    img: gala,
    alt: "Navy, gold and cream balloons around a Children in Need Pudsey backdrop at a corporate gala",
    kind: "[Corporate gala · Surrey]",
    line: "[One line on the brief: what the client asked for.]",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Share your vision",
    timing: "[Timing, e.g. 5 minutes]",
    body: "Send me your date, venue and any ideas you have so far. I'll then give you a call to talk it through.",
    img: step1Img,
    alt: "Close-up of dinosaur party details: foliage, a name sign and wooden crate props",
  },
  {
    n: "02",
    title: "Your proposal",
    timing: "[Timing, e.g. within 3 working days]",
    body: "I put together a concept with a moodboard, colour palette and visuals, so you know exactly how it will look before anything is made.",
    img: null,
    alt: "",
  },
  {
    n: "03",
    title: "Installation",
    timing: "[Timing, e.g. on the day, before guests arrive]",
    body: "I set everything up before your first guest arrives, so you walk into a finished space. Afterwards, I pack it all down and take it away.",
    img: step3Img,
    alt: "Finished dinosaur party in a Surrey home: sage balloon arch, AYAAN name sign, dinosaur cutouts and wooden explorer crates",
  },
];

const RecentEvents = () => (
  <section id="recent-events" className="rfx-section white" aria-labelledby="recent-heading">
    <div className="container-rfx">
      <div className="heading-to-content text-center flex flex-col items-center">
        <SectionHeading id="recent-heading">
          [Recent <em className="t-accent">events.</em>]
        </SectionHeading>
      </div>
      <div className="ht-events">
        {EVENTS.map((e) => (
          <article key={e.kind} className="ht-event">
            <div className="ht-event-img rounded-large">
              <img src={e.img} alt={e.alt} loading="lazy" decoding="async" width={1024} height={1280} />
            </div>
            <p className="t-overline text-ink-soft media-to-title">{e.kind}</p>
            <p className="t-body text-ink-soft">{e.line}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="process" className="rfx-section" aria-labelledby="process-heading">
    <div className="container-rfx">
      <div className="heading-to-content">
        <SectionHeading id="process-heading" className="text-center text-ink">
          How it <em className="t-accent">works.</em>
        </SectionHeading>
      </div>
      <ol className="ht-steps">
        {STEPS.map((s) => (
          <li key={s.n} className="ht-step">
            <span className="ht-num t-overline text-accent-warm">{s.n}</span>
            <div className="ht-step-body">
              <div className="ht-step-img rounded-large">
                {s.img ? (
                  <img src={s.img} alt={s.alt} loading="lazy" decoding="async" />
                ) : (
                  <div className="ht-grey t-label text-ink-soft">[moodboard example]</div>
                )}
              </div>
              <h3 className="t-h5 text-ink">{s.title}</h3>
              <p className="t-meta text-ink-soft">{s.timing}</p>
              <p className="t-small text-ink-soft title-to-text text-wrap">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="ht-process-cta">
        <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
          Reserve your date <span className="t-icon">→</span>
        </a>
        <p className="t-meta text-ink-soft">[No obligation · Reply within X · Setup and pack-down included]</p>
      </div>
    </div>
  </section>
);

const MeetLaura = () => (
  <section id="about" className="rfx-section warm" aria-labelledby="about-heading">
    <div className="container-rfx">
      <div className="ht-laura">
        <div className="ht-laura-img rounded-large">
          <img
            src={laura}
            alt="Laura, the founder and stylist, photographed amongst Surrey bluebells in a branded tee"
            loading="lazy"
            decoding="async"
            width={1200}
            height={1499}
          />
        </div>
        <div>
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
          {/* No About page exists yet; points at the live homepage section. */}
          <a href="/#about" className="btn-link-rf t-label text-to-action">
            [More about Laura] <span className="arr">→</span>
          </a>
        </div>
      </div>
    </div>
  </section>
);

/** Phones only, after the hero has scrolled away. Sits below the cookie
 *  banner (z-float 90 < z-modal 200), so it never covers it. */
const StickyBar = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector("main > section");
      const end = hero ? hero.getBoundingClientRect().bottom + window.scrollY : window.innerHeight;
      setShow(window.scrollY > end - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`ht-bar ${show ? "in" : ""}`} aria-hidden={!show}>
      <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent" tabIndex={show ? 0 : -1}>
        Enquire now
      </a>
      <a
        href={whatsappHref("Hi Laura, I'd like a quote for an event. My date and postcode are ")}
        className="btn-ghost-rf"
        tabIndex={show ? 0 : -1}
      >
        WhatsApp Laura
      </a>
    </div>
  );
};

/** The real form, with submit switched off and typing kept away from the
 *  tracker (a window-level capture listener runs before its document one). */
const TestEnquire = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const btn = el.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) btn.disabled = true;
    const block = (e: Event) => {
      if (el.contains(e.target as Node)) e.stopPropagation();
    };
    const stopSubmit = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("input", block, true);
    window.addEventListener("change", block, true);
    el.addEventListener("submit", stopSubmit, true);
    return () => {
      window.removeEventListener("input", block, true);
      window.removeEventListener("change", block, true);
      el.removeEventListener("submit", stopSubmit, true);
    };
  }, []);
  return (
    <div ref={ref}>
      <Enquire />
    </div>
  );
};

const HomeTest = () => {
  useFadeUp();
  useNavScroll();
  useEffect(() => {
    applyMeta(findRoute("/home-test")!);
    let m = document.querySelector('meta[name="robots"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "robots");
      document.head.appendChild(m);
    }
    m.setAttribute("content", "noindex, nofollow");
  }, []);

  return (
    <div className="ht-page min-h-screen page-paper text-foreground nav-paper">
      <Nav />
      <main>
        <ChristmasHero trust />
        <Mission asTitle />
        <Experiences
          align="centre"
          intro="Tell me what you're celebrating and I'll design around it, from one balloon arch to a full room."
        />
        <RecentEvents />
        <Testimonials noDivider />
        <HowItWorks />
        <MeetLaura />
        <FaqSection faqs={HOME_FAQS} headingId="faq-heading" />
        <TestEnquire />
        <InstagramFollow />
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
};

export default HomeTest;
