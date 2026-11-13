import { useEffect } from "react";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import { INSPIRATION_CORPORATE } from "@/data/inspiration";
import ServicesCards from "@/components/rfx/ServicesCards";
import { CORPORATE_TILES, withoutTilePhotos } from "@/data/serviceTiles";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import ServiceHero from "@/components/rfx/ServiceHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPLocations from "@/components/rfx/CPLocations";
import FaqSection from "@/components/rfx/FaqSection";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  routeServiceSchema,
  upsertJsonLd,
} from "@/seo/headTags";

import imgHero from "@/assets/river-fox-events-corporate-atrium-twin-balloon-arches.webp";
import imgHeroMobile from "@/assets/river-fox-events-pudsey-charity-gala-dinner-navy-gold.webp";
import imgIntro from "@/assets/river-fox-events-theatre-125-anniversary-marquee-wide.webp";
import imgIntroHover from "@/assets/river-fox-events-theatre-125-anniversary-balloon-close-up.webp";
import imgWhat from "@/assets/river-fox-events-nxtgen-corporate-entrance-columns-side-angle.webp";
import imgWhatHover from "@/assets/river-fox-events-nxtgen-corporate-balloon-close-up.webp";

const TRUST_LOGOS = [
  "P&G",
  "The Range",
  "Foxhills",
  "Taylor Wimpey",
  "Enterprise Mobility",
  "Arun Estates",
  "Dawghouse Pizza Co.",
  "Design Boss Diary",
  "Stribe Fitness",
  "Squid Group",
];

const CORPORATE_STEPS = [
  {
    n: "01",
    title: "Share your brief",
    body:
      "Tell me about the event: the date, venue, brand guidelines and what you want it to do. A short call follows to go through the detail.",
  },
  {
    n: "02",
    title: "Concept & proposal",
    body:
      "I design a concept in your brand colours with clear pricing, setting out the installations, materials and timings.",
  },
  {
    n: "03",
    title: "Installation day",
    body:
      "I arrive and install before your event begins, then come back for full breakdown after the last guest leaves.",
  },
];

const FAQS = [
  {
    q: "What types of corporate events do you style?",
    a: "Product launches, retail and showroom openings, PR activations, brand events, office celebrations and milestone team events. From a single branded entrance to a whole venue.",
  },
  {
    q: "Do you work with brand guidelines and specific colour palettes?",
    a: "Yes. Send me your brand guidelines, palette and any reference creative, and I'll design the installations to match.",
  },
  {
    q: "How far in advance should we book?",
    a: "Ideally 8–12 weeks ahead for larger installs. Shorter timelines are often possible for a single display, so get in touch as early as you can and I'll tell you honestly what I can deliver.",
  },
  {
    q: "Do you travel outside Surrey?",
    a: "Yes. I regularly install across Surrey and London, and travel further when the project suits. Mention your venue when you enquire.",
  },
  {
    q: "Can you provide a quote before we commit?",
    a: "Always. After a short call I send a proposal with clear pricing, the installations I'd recommend and a timeline, with no commitment to go ahead.",
  },
  {
    q: "What's included in a corporate installation?",
    a: "The design, all materials and installations, setup before your event and full breakdown afterwards.",
  },
];

const CorporateAndBrand = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/corporate-brand-styling")!;
    applyMeta(route);

    const serviceId = "rfx-jsonld-svc-corporate-brand-styling";
    const svc = routeServiceSchema(route);
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = "rfx-jsonld-bc-corporate-brand-styling";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);

    return () => {
      removeJsonLd(serviceId);
      removeJsonLd(breadcrumbId);
    };
  }, []);

  return (
    <div className="min-h-screen page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main>
        <ServiceHero
          image={imgHero}
          imageAlt="Twin balloon arches in a corporate office atrium - blue and yellow left, purple right, framing black leather sofas"
          mobileImage={imgHeroMobile}
          mobileImageAlt="Navy and gold balloon installation beside a Pudsey bear at a charity gala dinner"
          headingId="cb-hero-heading"
          lines={[
            <>Corporate event styling</>,
            <>
              <em className="t-accent">
                and brand installations.
              </em>
            </>,
          ]}
          sub="Branded balloon installations, sequin and shimmer walls and signage for launches, award nights and Christmas parties, installed before doors open and cleared away after."
        />

        {/* Client names straight under the hero (Matt, 2026-11-07) */}
        <section
          id="cb-trust"
          aria-labelledby="cb-trust-heading"
          className="rfx-section white section-compact"
        >
          <div className="container-rfx text-center">
            <h2
              id="cb-trust-heading"
              className="t-h5 text-ink"
              style={{ marginBottom: "30px" }}
            >
              Trusted by{" "}
              <em className="t-accent">leading brands.</em>
            </h2>
            <style>{`
              @keyframes rfx-trust-ticker {
                from { transform: translateX(-50%); }
                to   { transform: translateX(0); }
              }
              .rfx-trust-ticker {
                overflow: hidden;
                width: 100%;
                mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
                -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
              }
              .rfx-trust-track {
                display: flex;
                width: max-content;
                animation: rfx-trust-ticker 60s linear infinite;
              }
              .rfx-trust-item {
                flex: 0 0 auto;
                padding: 0 2.75rem;
                color: hsl(var(--text-primary));
                opacity: 0.72;
                white-space: nowrap;
              }
              @media (prefers-reduced-motion: reduce) {
                .rfx-trust-track { animation: none; }
              }
            `}</style>
            <div className="rfx-trust-ticker" aria-label="Brands we have worked with">
              <div className="rfx-trust-track">
                {[...TRUST_LOGOS, ...TRUST_LOGOS].map((name, i) => (
                  <span key={`${name}-${i}`} className="rfx-trust-item t-label uppercase">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CPReveal
          id="cb-intro"
          imageSide="right"
          image={imgIntro}
          alt="125th anniversary light-up marquee numbers on a theatre staircase with cream and gold balloons"
          hoverImage={imgIntroHover}
          hoverAlt="Close-up of cream, gold and pearl balloons beside the 125 anniversary marquee on a theatre staircase"
          tone="ph-warm"
          imageScale={1.07}
          headline={
            <>
              Your brand,{" "}
              <em className="t-accent">
                in the room.
              </em>
            </>
          }
        >
          {/* Short direct answer near the top, for search and AI answers
              (SEO Vendor GEO audit, 2026-11-09). */}
          <p>
            Corporate event styling means dressing your venue so it looks and
            feels like your brand: branded balloon installations,{" "}
            <a href="/journal/shimmer-wall-hire-surrey/" className="text-link">
              sequin and shimmer walls
            </a>
            , logo backdrops and entrance displays, all in your colours. I
            design and install them for businesses across Surrey and London,
            from a single entrance arch to a whole venue.
          </p>
          <p>
            Your logo or signage goes in where it helps, and nowhere it
            doesn't.
          </p>
        </CPReveal>

        <CPReveal
          id="cb-services"
          imageSide="left"
          image={imgWhat}
          alt="NXTGEN branded balloon columns in green and black flanking a black panelled doorway at a corporate entrance"
          hoverImage={imgWhatHover}
          hoverAlt="Close-up of stacked green and black balloons on the NXTGEN column against a black panelled door and brick wall"
          tone="ph-blush"
          headline={
            <>
              In before doors open,{" "}
              <em className="t-accent">
                cleared after.
              </em>
            </>
          }
        >
          <p>
            Most of my corporate work is product launches, shop and restaurant
            openings, office Christmas parties and award nights.
          </p>
          <p>
            I install before your guests arrive and come back to clear
            everything away once the event is over, so there's nothing left
            for your staff to deal with.
          </p>
        </CPReveal>

        {/* "What we do": photo tiles like the balloon page's, linking on
            only where a sub-service page or article exists. Sits under the last
            50/50 section (Matt, 2026-11-09). */}
        <ServicesCards
          divided
          sectionId="cb-what-we-do"
          headingId="cb-do-heading"
          items={CORPORATE_TILES}
          heading={
            <>
              What I can{" "}
              <em className="t-accent">build.</em>
            </>
          }
          intro="No two briefs look the same. These are my most requested pieces, but send me the brand and the space and I'll design around it."
        />

        <Process sectionId="how-it-works" steps={CORPORATE_STEPS} />

        {/* The office party sequin wall stays in the strip as well as its tile:
            it's the only corporate shimmer wall photo (Matt, 2026-11-09). */}
        <InspirationStrip id="cb-inspiration" lead="Events I've" accent="already delivered." images={withoutTilePhotos(INSPIRATION_CORPORATE, CORPORATE_TILES.filter((t) => t.title !== "Sequin walls"))} />

        <FaqSection faqs={FAQS} headingId="cb-faq-heading" />

        <CPLocations
          areas={[
            "Cobham",
            "Weybridge",
            "Esher",
            "Guildford",
            "Woking",
            "Reigate",
            "Horsham",
            "Crawley",
            "Richmond",
            "Wimbledon",
            "Central London",
            "West London",
          ]}
          intro={
            <>
              I'm based in Surrey and install regularly across London, in
              offices, showrooms, hotels and restaurants. Wherever the venue,
              I install before guests arrive and come back for full breakdown
              afterwards.
            </>
          }
          mapQuery="Surrey,England,UK&z=8"
          mapTitle="Map of Surrey and London - areas covered by River Fox Events"
        />

        <Enquire defaultEventType="Corporate event" />
      </main>
      <Footer />
    </div>
  );
};

export default CorporateAndBrand;
