import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import CPHero from "@/components/rfx/CPHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPPricing from "@/components/rfx/CPPricing";
import CPLocations from "@/components/rfx/CPLocations";
import CPIncluded from "@/components/rfx/CPIncluded";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import Testimonials from "@/components/rfx/Testimonials";
import NotFound from "./NotFound";
import { findLocation } from "@/data/locations";
import type { LocationConfig } from "@/data/locations/types";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";

const ThemesNumberedList = ({ themes }: { themes: string[] }) => (
  <ul className="!mt-7 grid grid-cols-2 gap-x-8 max-w-[520px] border-t border-ink/15">
    {themes.map((t, i) => (
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
);

const useLocationSEO = (loc: LocationConfig) => {
  useEffect(() => {
    document.title = loc.seoTitle;

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

    const desc = loc.seoDescription;
    setMeta("description", desc);
    const ogImage = window.location.origin + "/social-share.jpg";
    setMeta("og:title", loc.seoTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", ogImage, "property");
    setMeta(
      "og:url",
      window.location.origin + window.location.pathname,
      "property"
    );
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", loc.seoTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", ogImage);

    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + window.location.pathname;

    const ldId = `rfx-jsonld-loc-${loc.slug}`;
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
      serviceType: "Event Styling",
      provider: {
        "@type": "LocalBusiness",
        name: "River Fox Events",
        areaServed: loc.jsonLdAreaServed,
        email: "hello@riverfoxevents.co.uk",
        telephone: "+44 7872 114191",
        url: window.location.origin,
      },
      areaServed: loc.jsonLdAreaServed.join(", "),
      description: desc,
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "460",
        priceCurrency: "GBP",
      },
    });

    return () => {
      const el = document.getElementById(ldId);
      if (el) el.remove();
    };
  }, [loc]);
};

const LocationPage = () => {
  useFadeUp();
  useNavScroll();
  const { pathname } = useLocation();
  const slug = pathname.replace(/\/$/, "").replace(/^\/party-styling-/, "");
  const loc = findLocation(slug);

  useLocationSEO(
    loc ??
      ({
        slug: "missing",
        seoTitle: "",
        seoDescription: "",
        jsonLdAreaServed: [],
      } as unknown as LocationConfig)
  );

  if (!loc) return <NotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <CPHero
          lines={loc.hero.lines}
          sub={loc.hero.sub}
          image={loc.hero.image}
          imageAlt={
            loc.hero.imageAlt ??
            `Luxury event styling in ${loc.cityName} by River Fox Events — bespoke balloon installation and dressed celebration space`
          }
          scrollTarget="#loc-what-we-do"
        />

        <CPReveal
          id="loc-what-we-do"
          imageSide={loc.whatWeDo.imageSide}
          image={loc.whatWeDo.image}
          alt={loc.whatWeDo.imageAlt}
          tone={loc.whatWeDo.tone}
          headline={loc.whatWeDo.headline}
        >
          {loc.whatWeDo.body}
        </CPReveal>

        <CPReveal
          id="loc-occasions"
          imageSide={loc.occasions.imageSide}
          image={loc.occasions.image}
          alt={loc.occasions.imageAlt}
          tone={loc.occasions.tone}
          headline={loc.occasions.headline}
        >
          {loc.occasions.body}
        </CPReveal>

        <CPReveal
          id="loc-themes"
          imageSide={loc.themes.imageSide}
          image={loc.themes.image}
          alt={loc.themes.imageAlt}
          tone={loc.themes.tone}
          headline={loc.themes.headline}
        >
          {loc.themes.body}
          {loc.themes.themesList && (
            <ThemesNumberedList themes={loc.themes.themesList} />
          )}
        </CPReveal>

        <CPIncluded
          eyebrow={loc.included.eyebrow}
          heading={loc.included.heading}
          items={loc.included.items}
          outro={loc.included.closingLine}
          sectionId="loc-included"
          headingId="loc-included-heading"
        />

        <CPPricing
          heading={loc.pricing.heading}
          tiers={loc.pricing.tiers}
          ctaLabel="Start planning"
          footnote={loc.pricing.footnote}
        />

        <div id="how-it-works">
          <Process />
        </div>

        <ChildrensFAQ
          faqs={loc.faqs}
          headingId={`loc-${loc.slug}-faq-heading`}
          defaultOpen={false}
          paddingBottom="120px"
        />

        <Testimonials noDivider paddingTop="32px" paddingBottom="64px" />

        <CPLocations
          eyebrow={loc.nearby.eyebrow}
          heading={loc.nearby.heading}
          intro={loc.nearby.intro}
          areas={loc.nearby.areas}
          mapQuery={loc.nearby.mapQuery}
          mapTitle={loc.nearby.mapTitle}
          paddingTop="120px"
        />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
