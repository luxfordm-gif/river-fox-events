import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import CPHero from "@/components/rfx/CPHero";
import CPPricing from "@/components/rfx/CPPricing";
import CPLocations from "@/components/rfx/CPLocations";
import CPIncluded from "@/components/rfx/CPIncluded";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import Testimonials from "@/components/rfx/Testimonials";
import NotFound from "./NotFound";
import { findLocation } from "@/data/locations";
import type {
  DetailRow,
  LocationConfig,
  LocationCopyBlock,
} from "@/data/locations/types";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";

const DetailRows = ({ rows }: { rows: DetailRow[] }) => (
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

const ThemePills = ({ pills }: { pills: string[] }) => (
  <ul className="mt-8 flex flex-wrap gap-2.5 max-w-[720px]">
    {pills.map((p) => (
      <li
        key={p}
        className="px-4 py-2 rounded-full border border-ink/20 bg-[hsl(var(--surface-warm)/0.5)] font-serif-rf text-[15px] font-light tracking-[-0.01em] text-ink"
      >
        {p}
      </li>
    ))}
  </ul>
);

const toneClass = (tone?: LocationCopyBlock["tone"]) => {
  if (tone === "warm") return "rfx-section warm";
  if (tone === "blush") return "rfx-section";
  return "rfx-section white";
};

const CopyBlock = ({
  block,
  sectionId,
}: {
  block: LocationCopyBlock;
  sectionId: string;
}) => {
  const headingId = `${sectionId}-heading`;
  return (
    <section
      id={sectionId}
      className={toneClass(block.tone)}
      aria-labelledby={headingId}
    >
      <div className="container-rfx">
        <div className="max-w-[820px] fade-up">
          <div
            className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-4"
            style={{ fontWeight: 600 }}
          >
            {block.eyebrow}
          </div>
          <h2
            id={headingId}
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.0,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            {block.headline}
          </h2>
          {block.body && (
            <div
              className="mt-7 text-[16px] leading-[1.7] text-ink-soft space-y-4 max-w-[640px]"
              style={{ textWrap: "pretty" }}
            >
              {block.body}
            </div>
          )}
          {block.rows && <DetailRows rows={block.rows} />}
          {block.themePills && <ThemePills pills={block.themePills} />}
          {block.closingLine && (
            <p className="mt-8 italic text-ink font-serif-rf text-[18px] leading-[1.5] max-w-[640px]">
              {block.closingLine}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

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

  // Hooks must run unconditionally — call with a stable fallback then short-circuit render.
  useLocationSEO(loc ?? ({ slug: "missing", seoTitle: "", seoDescription: "", jsonLdAreaServed: [] } as unknown as LocationConfig));

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

        <CopyBlock block={loc.whatWeDo} sectionId="loc-what-we-do" />
        <CopyBlock block={loc.occasions} sectionId="loc-occasions" />
        <CopyBlock block={loc.themes} sectionId="loc-themes" />

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
        />

        <Testimonials />

        <CPLocations
          eyebrow={loc.nearby.eyebrow}
          heading={loc.nearby.heading}
          intro={loc.nearby.intro}
          areas={loc.nearby.areas}
          mapQuery={loc.nearby.mapQuery}
          mapTitle={loc.nearby.mapTitle}
        />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
