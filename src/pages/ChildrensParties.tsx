import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Testimonials from "@/components/rfx/Testimonials";
import Enquire from "@/components/rfx/Enquire";
import CPHero from "@/components/rfx/CPHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPPricing from "@/components/rfx/CPPricing";
import CPLocations from "@/components/rfx/CPLocations";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";

import imgCelebrations from "@/assets/cp-celebrations.jpg";
import imgOccasions from "@/assets/cp-occasions.jpg";
import imgThemes from "@/assets/cp-themes.jpg";
import imgIncluded from "@/assets/cp-included.jpg";

const OCCASIONS = [
  {
    label: "Birthday parties",
    value: "From first birthdays to big themed celebrations",
  },
  {
    label: "Christenings & naming days",
    value: "Elegant, considered and completely bespoke",
  },
  {
    label: "Seasonal celebrations",
    value: "Christmas, Easter, summer garden parties",
  },
];

const THEMES = [
  "Fairy garden",
  "Jungle",
  "Princess",
  "Barbie",
  "Enchanted forest",
  "Under the sea",
  "Safari",
  "Boho floral",
  "Frozen",
  "Woodland",
  "Superhero",
  "Vintage tea party",
];

const INCLUDED = [
  {
    label: "Theme & palette",
    value: "Bespoke design concept built around your vision",
  },
  {
    label: "Balloon installations",
    value: "Statement sculptural arrangements",
  },
  {
    label: "Backdrops & signage",
    value: "Personalised to your celebration",
  },
  {
    label: "Cake & party tables",
    value: "Fully styled and dressed",
  },
  {
    label: "Setup & breakdown",
    value: "Fully managed, start to finish",
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

const ChildrensParties = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    document.title =
      "Children's Party Stylist Surrey | River Fox Events";

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
      "Bespoke children's party styling across Surrey. Immersive themed parties, balloon installations and full-room transformations from £600 — designed and delivered personally by Laura at River Fox Events.";
    setMeta("description", desc);
    setMeta(
      "og:title",
      "Children's Party Stylist Surrey | River Fox Events",
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

    const ldId = "rfx-jsonld-cp";
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
      serviceType: "Children's Party Styling",
      provider: {
        "@type": "LocalBusiness",
        name: "River Fox Events",
        areaServed: ["Surrey", "Cobham", "Weybridge", "Esher", "Oxshott", "London"],
        email: "hello@riverfoxevents.co.uk",
        url: window.location.origin,
      },
      areaServed: "Surrey, England",
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
        <CPHero />

        <CPReveal
          id="cp-celebrations"
          imageSide="right"
          image={imgCelebrations}
          alt="Pastel balloon arch over a beautifully styled cake table at a Surrey children's birthday party"
          tone="ph-warm"
          label="Children's celebrations"
          headline={
            <>
              Your child's birthday is more than a party.{" "}
              <em className="italic font-light text-accent-warm">
                It's a memory in the making.
              </em>
            </>
          }
        >
          <p>
            I design celebrations that transform your home or venue into
            something your child and every guest will remember long after the
            day is done.
          </p>
          <p>
            Every River Fox Events party is built from scratch around your
            vision — no packages, no templates.
          </p>
        </CPReveal>

        <CPReveal
          id="cp-occasions"
          imageSide="left"
          image={imgOccasions}
          alt="Elegant first birthday tablescape with cream linens, candles and a soft pastel balloon cluster"
          tone="ph-blush"
          label="Occasions"
          headline={
            <>
              Every milestone,{" "}
              <em className="italic font-light text-accent-warm">
                beautifully marked.
              </em>
            </>
          }
        >
          <DetailRows rows={OCCASIONS} />
        </CPReveal>

        <CPReveal
          id="cp-themes"
          imageSide="right"
          image={imgThemes}
          alt="Whimsical fairy garden party styling with hanging florals, soft draped fabric and dappled natural light"
          tone="ph-warm"
          label="Popular themes"
          headline={
            <>
              Whatever the vision,{" "}
              <em className="italic font-light text-accent-warm">
                we can build it.
              </em>
            </>
          }
        >
          <p>Some of the most popular themes Laura creates across Surrey.</p>
          <ul className="flex flex-wrap gap-2 max-w-[560px] !mt-6">
            {THEMES.map((t) => (
              <li
                key={t}
                className="font-mono-rf text-[11px] tracking-[0.16em] uppercase text-ink border border-ink/15 rounded-full px-3.5 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
          <p className="!mt-6 italic text-ink">
            Every celebration is completely bespoke — bring your inspiration and
            we'll design around it.
          </p>
        </CPReveal>

        <CPReveal
          id="cp-included"
          imageSide="left"
          image={imgIncluded}
          alt="Beautifully styled cake on a vintage stand beneath a sculptural pastel balloon arrangement"
          tone="ph-blush"
          label="What's included"
          headline={
            <>
              Everything handled.{" "}
              <em className="italic font-light text-accent-warm">
                Nothing left to chance.
              </em>
            </>
          }
        >
          <DetailRows rows={INCLUDED} />
          <p className="italic text-ink !mt-6">
            All handled seamlessly, so you can enjoy every moment.
          </p>
        </CPReveal>

        <CPPricing />

        <div id="how-it-works">
          <Process />
        </div>

        <ChildrensFAQ />

        <CPLocations />

        <Testimonials />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default ChildrensParties;
