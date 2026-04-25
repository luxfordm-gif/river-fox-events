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
import CPIncluded from "@/components/rfx/CPIncluded";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";

import imgCelebrations from "@/assets/cp-celebrations.webp";
import imgOccasions from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgThemes from "@/assets/dinosaur-themed-birthday-party-surrey.webp";

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
      "Bespoke children's party styling across Surrey. Immersive themed parties, balloon installations and full-room transformations from £460 — designed and delivered personally by Laura at River Fox Events.";
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
          alt="Immersive children's birthday party styling in Cobham Surrey by River Fox Events — pastel balloon arch and styled cake tablescape"
          tone="ph-warm"
          hideImageOnMobile
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
          alt="Luxury milestone birthday party styling in Surrey by River Fox Events — illuminated 40 sign with pink and gold balloon arch"
          tone="ph-blush"
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
          alt="Sage green dinosaur themed children's birthday party styling in Surrey by River Fox Events — personalised Ayaan name sign, balloon garland, dinosaur cut-outs, wooden crates and lush tropical foliage"
          tone="ph-warm"
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
          <ul className="!mt-7 grid grid-cols-2 gap-x-8 max-w-[520px] border-t border-ink/15">
            {THEMES.map((t, i) => (
              <li
                key={t}
                className="flex items-baseline gap-3 py-2.5 border-b border-ink/15 font-serif-rf text-[17px] font-light tracking-[-0.012em] text-ink"
              >
                <span className="font-mono-rf text-[10px] tracking-[0.18em] text-ink-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="!mt-6 italic text-ink">
            Every celebration is completely bespoke — bring your inspiration and
            we'll design around it.
          </p>
        </CPReveal>

        <CPIncluded />


        <CPPricing />

        <div id="how-it-works">
          <Process />
        </div>

        <ChildrensFAQ />

        <CPLocations />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default ChildrensParties;
