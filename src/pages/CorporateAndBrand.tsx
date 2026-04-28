import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import CPHero from "@/components/rfx/CPHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPPricing from "@/components/rfx/CPPricing";
import CPLocations from "@/components/rfx/CPLocations";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import CPIncluded, { type IncludedItem } from "@/components/rfx/CPIncluded";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";

import imgHero from "@/assets/corporate-gala-styling-surrey.webp";
import imgIntro from "@/assets/corporate-event-styling-surrey.webp";
import imgWhat from "@/assets/hero-3.webp";
import imgBrands from "@/assets/studio.webp";

const SERVICES = [
  {
    label: "Product launches",
    value: "Statement installs that put your product centre stage",
  },
  {
    label: "Retail openings",
    value: "Eye-catching entrance and in-store styling",
  },
  {
    label: "PR activations",
    value: "Shareable moments designed to generate coverage",
  },
  {
    label: "Office celebrations",
    value: "Company milestones and team events styled properly",
  },
  {
    label: "Branded environments",
    value: "Cohesive design aligned to your brand guidelines",
  },
];

const BRANDS = [
  "P&G",
  "The Range",
  "Taylor Wimpey",
  "Foxhills",
  "Enterprise Mobility",
  "Arun Estates",
  "Dawghouse Pizza Co.",
];

const TRUST_LOGOS = [
  "P&G",
  "The Range",
  "Taylor Wimpey",
  "Foxhills",
  "Enterprise Mobility",
  "Arun Estates",
  "Dawghouse Pizza Co.",
  "Design Boss Diary",
  "Stribe Fitness",
  "Squid Group",
];

const INCLUDED_ITEMS: IncludedItem[] = [
  {
    icon: "palette",
    label: "Brand-aligned concept",
    body: "Designed against your brand guidelines, palette and event objectives.",
  },
  {
    icon: "archway",
    label: "Statement installations",
    body: "Entrance displays, branded backdrops and photo moments that stop guests.",
  },
  {
    icon: "badge",
    label: "Branded signage & props",
    body: "Logos, messaging and on-brand finish — cohesive throughout.",
  },
  {
    icon: "megaphone",
    label: "Multi-zone activation",
    body: "Cohesive styling across entrances, focal points and supporting areas.",
  },
  {
    icon: "heart",
    label: "Pro install & breakdown",
    body: "Set up before guests arrive, cleared without fuss after the event.",
  },
];

const TIERS = [
  {
    price: "From £600",
    label: "Single zone",
    body: "A focused single installation — entrance display, photo moment or branded backdrop for one zone.",
  },
  {
    price: "From £1,200",
    label: "Multi-zone styling",
    body: "Most popular. Multiple branded styling moments across the event — entrances, focal points and supporting detail.",
  },
  {
    price: "From £2,500",
    label: "Large-scale activation",
    body: "Full venue activation, large-format installations, dedicated install team — designed end to end.",
  },
];

const CORPORATE_STEPS = [
  {
    n: "01",
    title: "Share your brief",
    body:
      "Tell us about the event — date, venue, brand guidelines and objectives. A short call follows to talk through the detail.",
  },
  {
    n: "02",
    title: "Concept & proposal",
    body:
      "We design a brand-aligned concept with clear pricing — installations, materials and timeline mapped against your brief.",
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
    a: "Product launches, retail and showroom openings, PR activations, brand events, office celebrations and milestone team events. Anything where the environment matters — from a single statement entrance to a full venue activation.",
  },
  {
    q: "Do you work with brand guidelines and specific colour palettes?",
    a: "Yes — every corporate project is aligned to your brand. Share your guidelines, palette and any reference creative and we'll design installations that feel cohesive and on-brand throughout.",
  },
  {
    q: "How far in advance should we book?",
    a: "Ideally 8–12 weeks ahead for larger activations. Shorter timelines are possible for single-zone installs — get in touch as early as you can and we'll tell you honestly what's deliverable.",
  },
  {
    q: "Do you travel outside Surrey?",
    a: "Yes. We regularly install across Surrey and London, and travel further for the right project. Mention your venue when you enquire.",
  },
  {
    q: "Can you provide a quote before we commit?",
    a: "Always. After a short discovery call we send a tailored proposal with clear pricing, recommended installations and timeline — no commitment to proceed.",
  },
  {
    q: "What's included in a corporate installation?",
    a: "Concept design, all materials and installations, professional setup before the event, on-the-day support where needed, and full breakdown afterwards. Quoted as one inclusive figure — no surprises.",
  },
];

const DetailRows = ({
  rows,
}: {
  rows: { label: string; value: string }[];
}) => (
  <ul className="mt-2 border-t border-ink/15">
    {rows.map((r) => (
      <li
        key={r.label}
        className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-1 md:gap-8 py-5 border-b border-ink/15"
      >
        <span className="font-serif-rf text-[18px] md:text-[20px] font-light leading-[1.25] tracking-[-0.012em] text-ink">
          {r.label}
        </span>
        <span className="text-[14.5px] leading-[1.6] text-ink-soft md:text-right">
          {r.value}
        </span>
      </li>
    ))}
  </ul>
);

const CorporateAndBrand = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    document.title =
      "Corporate Event Styling Surrey London | River Fox Events";

    const setMeta = (
      name: string,
      content: string,
      attr: "name" | "property" = "name"
    ) => {
      let el = document.querySelector(
        `meta[${attr}="${name}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc =
      "Design-led corporate event styling and brand installations across Surrey and London. Product launches, retail openings, office events. Trusted by P&G, The Range and more.";
    setMeta("description", desc);
    setMeta(
      "og:title",
      "Corporate Event Styling Surrey London | River Fox Events",
      "property"
    );
    setMeta("og:description", desc, "property");
    setMeta("og:type", "website", "property");

    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + window.location.pathname;

    const ldId = "rfx-jsonld-corporate";
    let script = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = ldId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Corporate Event Styling and Brand Installations",
      provider: {
        "@type": "LocalBusiness",
        name: "River Fox Events",
        areaServed: ["Surrey", "London", "Cobham", "Weybridge"],
        email: "hello@riverfoxevents.co.uk",
        url: window.location.origin,
      },
      areaServed: "Surrey and London, England",
      description: desc,
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "600",
        priceCurrency: "GBP",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <CPHero
          image={imgHero}
          imageAlt="Corporate brand activation styling by River Fox Events Surrey — branded entrance installation, sculptural balloons and considered design at a London product launch"
          headingId="cb-hero-heading"
          scrollTarget="#cb-intro"
          lines={[
            <>Installations that</>,
            <>
              elevate your{" "}
              <em
                className="italic font-normal"
                style={{ color: "hsl(var(--accent))" }}
              >
                brand.
              </em>
            </>,
          ]}
          sub="Design-led event styling for launches, openings, office celebrations and brand activations — trusted by leading brands across Surrey and London."
        />

        <section
          id="cb-trust"
          aria-labelledby="cb-trust-heading"
          className="rfx-section"
          style={{ paddingTop: "96px", paddingBottom: "96px" }}
        >
          <div className="container-rfx text-center">
            <h2
              id="cb-trust-heading"
              className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft"
              style={{ fontWeight: 600, marginBottom: "48px" }}
            >
              Trusted by
            </h2>
            <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 md:gap-y-14 list-none p-0 m-0">
              {TRUST_LOGOS.map((name) => (
                <li
                  key={name}
                  className="flex items-center justify-center"
                >
                  <span
                    className="text-ink text-center"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(12px, 1.15vw, 16px)",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      lineHeight: 1.25,
                      opacity: 0.4,
                      transition: "opacity 0.3s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLSpanElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLSpanElement).style.opacity = "0.4";
                    }}
                  >
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CPReveal
          id="cb-intro"
          imageSide="right"
          image={imgIntro}
          alt="Corporate event styling in Surrey by River Fox Events — branded backdrop, statement installation and on-brand colour palette for a corporate launch"
          tone="ph-warm"
          hideImageOnMobile
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
            moment they walk in — and what they remember long after they
            leave.
          </p>
          <p>
            We work with brands and businesses across Surrey and London to
            design impactful event styling — from statement installations and
            branded backdrops to entrance displays and photo moments that stop
            guests in their tracks.
          </p>
        </CPReveal>

        <CPReveal
          id="cb-services"
          imageSide="left"
          image={imgWhat}
          alt="PR activation and brand installation by River Fox Events — sculptural floral arch and branded photo moment at a London brand event"
          tone="ph-blush"
          headline={
            <>
              Every brief, met with{" "}
              <em className="italic font-light text-accent-warm">
                precision.
              </em>
            </>
          }
        >
          <p>
            From single-zone installations to full venue activations — every
            project is scoped, designed and delivered against your objectives.
          </p>
          <DetailRows rows={SERVICES} />
        </CPReveal>

        <CPReveal
          id="cb-brands"
          imageSide="right"
          image={imgBrands}
          alt="River Fox Events studio in Cobham, Surrey — design and styling base for corporate brand activations across Surrey and London"
          tone="ph-warm"
          headline={
            <>
              Trusted by{" "}
              <em className="italic font-light text-accent-warm">
                leading brands.
              </em>
            </>
          }
        >
          <p>
            River Fox Events has delivered installations for brands including
            P&amp;G, The Range, Taylor Wimpey, Foxhills, Enterprise Mobility,
            Arun Estates and Dawghouse Pizza Co.
          </p>
          <ul className="mt-7 grid grid-cols-2 gap-x-8 max-w-[520px] border-t border-ink/15">
            {BRANDS.map((b, i) => (
              <li
                key={b}
                className="flex items-baseline gap-3 py-2.5 border-b border-ink/15 font-serif-rf text-[17px] font-light tracking-[-0.012em] text-ink"
              >
                <span className="font-mono-rf text-[10px] tracking-[0.18em] text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {b}
              </li>
            ))}
          </ul>
        </CPReveal>

        <CPIncluded
          sectionId="cb-included-grid"
          headingId="cb-included-heading"
          eyebrow="What's included"
          heading={
            <>
              Every detail handled.{" "}
              <em className="italic font-light text-accent-warm">
                Nothing left to chance.
              </em>
            </>
          }
          items={INCLUDED_ITEMS}
          intro={
            <>
              Every brand activation is scoped, designed and delivered against
              your objectives — one inclusive proposal, no surprises.
            </>
          }
          outro={
            <>
              Designed, installed and broken down by our team — so your
              colleagues can focus on the event itself.
            </>
          }
        />

        <CPPricing
          tiers={TIERS}
          heading={
            <>
              Professional installs{" "}
              <em className="italic font-light text-accent-warm">from £600.</em>
            </>
          }
          ctaLabel="Share your brief"
          footnote="All projects are individually quoted. Share your brief and we'll respond with a tailored proposal within 48 hours."
        />

        <div id="how-it-works">
          <Process
            steps={CORPORATE_STEPS}
            intro={
              <>
                A clear, professional process — from first brief through to
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
            "Richmond",
            "Wimbledon",
            "Central London",
            "West London",
          ]}
          intro={
            <>
              Based in Surrey and installing regularly across London — for
              brands and businesses that care about how their event looks and
              feels. Wherever the venue, our team installs before guests
              arrive and returns for full breakdown afterwards.
            </>
          }
          mapQuery="Surrey,England,UK&z=8"
          mapTitle="Map of Surrey and London — areas covered by River Fox Events"
        />

        <Enquire defaultEventType="Corporate event" />
      </main>
      <Footer />
    </div>
  );
};

export default CorporateAndBrand;
