import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import ServiceHero from "@/components/rfx/ServiceHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPLocations from "@/components/rfx/CPLocations";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
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
      "Tell us about the event - date, venue, brand guidelines and objectives. A short call follows to talk through the detail.",
  },
  {
    n: "02",
    title: "Concept & proposal",
    body:
      "We design a brand-aligned concept with clear pricing - installations, materials and timeline mapped against your brief.",
  },
  {
    n: "03",
    title: "Installation day",
    body:
      "Our team arrives, installs professionally before your event begins, and returns for full breakdown after the last guest leaves.",
  },
];

const FAQS = [
  {
    q: "What types of corporate events do you style?",
    a: "Product launches, retail and showroom openings, PR activations, brand events, office celebrations and milestone team events. Anything where the environment matters - from a single statement entrance to a full venue activation.",
  },
  {
    q: "Do you work with brand guidelines and specific colour palettes?",
    a: "Yes - every corporate project is aligned to your brand. Share your guidelines, palette and any reference creative and we'll design installations that feel cohesive and on-brand throughout.",
  },
  {
    q: "How far in advance should we book?",
    a: "Ideally 8–12 weeks ahead for larger activations. Shorter timelines are possible for single-zone installs - get in touch as early as you can and we'll tell you honestly what's deliverable.",
  },
  {
    q: "Do you travel outside Surrey?",
    a: "Yes. We regularly install across Surrey and London, and travel further for the right project. Mention your venue when you enquire.",
  },
  {
    q: "Can you provide a quote before we commit?",
    a: "Always. After a short discovery call we send a tailored proposal with clear pricing, recommended installations and timeline - no commitment to proceed.",
  },
  {
    q: "What's included in a corporate installation?",
    a: "Concept design, all materials and installations, professional setup before the event and full breakdown afterwards.",
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
    <div className="min-h-screen bg-background text-foreground nav-solid">
      <Nav />
      <main>
        <ServiceHero
          image={imgHero}
          imageAlt="Twin balloon arches in a corporate office atrium - blue and yellow left, purple right, framing black leather sofas"
          mobileImage={imgHeroMobile}
          mobileImageAlt="Navy and gold balloon installation at the Pudsey charity gala dinner - sophisticated event styling by River Fox Events"
          headingId="cb-hero-heading"
          lines={[
            <>Corporate event styling</>,
            <>
              <em
                className="italic font-normal"
                style={{ color: "hsl(var(--accent))" }}
              >
                and brand installations.
              </em>
            </>,
          ]}
          sub="We design and install visually impactful setups for brands, launches and events across Surrey and London - balancing creativity with a refined, on-brand finish."
        />

        <CPReveal
          id="cb-intro"
          imageSide="right"
          image={imgIntro}
          alt="125th anniversary light-up marquee numbers on a theatre staircase with cream and gold balloons styled by River Fox Events for a Surrey corporate milestone"
          hoverImage={imgIntroHover}
          hoverAlt="Close-up of cream, gold and pearl balloon detail beside the 125 anniversary marquee on a theatre staircase styled by River Fox Events"
          tone="ph-warm"
          imageScale={1.07}
          headline={
            <>
              Your event environment is{" "}
              <em className="italic font-light text-accent-warm">
                your brand.
              </em>
            </>
          }
        >
          <p>
            A thoughtfully styled installation shapes how guests feel the
            moment they walk in - and what they remember long after they
            leave.
          </p>
          <p>
            We work with brands and businesses across Surrey and London to
            design impactful event styling - from statement installations and
            branded backdrops to entrance displays and photo moments that stop
            guests in their tracks.
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
              Every brief,{" "}
              <em className="italic font-light text-accent-warm">
                carefully considered.
              </em>
            </>
          }
        >
          <p>
            Each installation is tailored to your space and objectives,
            ensuring it feels aligned, considered and professionally
            executed.
          </p>
          <p>
            From product launches to in-store moments and brand activations,
            we create installations designed to capture attention and elevate
            the environment.
          </p>
        </CPReveal>

        <section
          id="cb-trust"
          aria-labelledby="cb-trust-heading"
          className="rfx-section white pt-16 pb-12 md:pt-20 md:pb-16"
        >
          <div className="container-rfx text-center">
            <h2
              id="cb-trust-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(36px, 3.6vw, 56px)",
                lineHeight: 1.04,
                fontWeight: 300,
                letterSpacing: "-0.025em",
                marginBottom: "40px",
              }}
            >
              Trusted by{" "}
              <em className="italic font-light text-accent-warm">
                leading brands.
              </em>
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
                font-family: var(--font-sans);
                font-size: clamp(12px, 1.05vw, 15px);
                font-weight: 600;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                line-height: 1.25;
                color: hsl(var(--ink));
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
                  <span key={`${name}-${i}`} className="rfx-trust-item">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="cb-closing"
          className="rfx-section warm"
          aria-labelledby="cb-closing-heading"
        >
          <div className="container-rfx text-center">
            <h2
              id="cb-closing-heading"
              className="font-serif-rf fade-up max-w-[22ch] mx-auto"
              style={{
                fontSize: "clamp(36px, 4vw, 64px)",
                lineHeight: 1.04,
                fontWeight: 300,
                letterSpacing: "-0.025em",
              }}
            >
              Polished, purposeful and{" "}
              <em className="italic font-light text-accent-warm">
                seamlessly delivered.
              </em>
            </h2>
            <p className="text-[15.5px] leading-[1.7] text-ink-soft max-w-[520px] mx-auto mt-6">
              Every event is individually quoted based on your
              requirements.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={ENQUIRE_HREF}
                onClick={handleEnquireClick}
                className="btn-solid-rf accent"
              >
                Enquire now <span>→</span>
              </a>
            </div>
          </div>
        </section>

        <div id="how-it-works">
          <Process
            steps={CORPORATE_STEPS}
            intro={
              <>
                A clear, professional process - from first brief through to
                full breakdown after the last guest leaves.
              </>
            }
          />
        </div>

        <ChildrensFAQ faqs={FAQS} headingId="cb-faq-heading" />

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
              Based in Surrey and installing regularly across London - for
              brands and businesses that care about how their event looks and
              feels. Wherever the venue, our team installs before guests
              arrive and returns for full breakdown afterwards.
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
