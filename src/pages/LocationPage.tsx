import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import CPLocations from "@/components/rfx/CPLocations";
import CPPricing from "@/components/rfx/CPPricing";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import ServicesCards from "@/components/rfx/ServicesCards";
import LocationGallery from "@/components/rfx/LocationGallery";
import LocationUSP from "@/components/rfx/LocationUSP";
import LocationTrust from "@/components/rfx/LocationTrust";
import LocationLocalProse from "@/components/rfx/LocationLocalProse";
import ScrollStrip from "@/components/rfx/ScrollStrip";
import LocationHeroFan from "@/components/rfx/LocationHeroFan";
import NotFound from "./NotFound";
import { findLocation } from "@/data/locations";
import type { LocationConfig } from "@/data/locations/types";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  routeServiceSchema,
  serviceSchema,
  upsertJsonLd,
} from "@/seo/headTags";

const useLocationSEO = (loc: LocationConfig) => {
  useEffect(() => {
    const path = `/party-styling-${loc.slug}`;
    const route = findRoute(path);

    applyMeta({
      title: loc.seoTitle,
      description: loc.seoDescription,
      path,
    });

    const serviceId = `rfx-jsonld-svc-party-styling-${loc.slug}`;
    const svc = route
      ? routeServiceSchema(route)
      : serviceSchema({
          serviceType: "Event Styling",
          description: loc.seoDescription,
          areaServed: loc.jsonLdAreaServed,
          lowPrice: "460",
        });
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = `rfx-jsonld-bc-party-styling-${loc.slug}`;
    const breadcrumbs = route ? breadcrumbSchema(path) : null;
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);

    return () => {
      removeJsonLd(serviceId);
      removeJsonLd(breadcrumbId);
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
    <div className="min-h-screen bg-background text-foreground rfx-tight-mobile nav-solid">
      <Nav />
      <main>
        {/* Homepage-style hero: centred copy + CTA, then mobile scroll
            strip and desktop editorial 3-image grid below. Same shape as
            <Hero /> on the homepage so location pages feel of-a-piece. */}
        <section
          id="top"
          className="rfx-hero pt-[96px] md:pt-[124px] pb-4 md:pb-6"
          aria-labelledby={`loc-${loc.slug}-hero-heading`}
        >
          <div className="container-rfx">
            {/* mb tightened (was mb-10/mb-14) so the cards sit closer to
                the CTA button — about 22px less air on both breakpoints. */}
            <div className="mb-4 md:mb-9 flex flex-col items-center text-center">
              <h1
                id={`loc-${loc.slug}-hero-heading`}
                className="font-serif-rf max-w-[20ch] md:max-w-none mx-auto break-words text-pretty"
                style={{
                  // Smaller than the homepage h1 (which clamps to 120px).
                  // Location titles like "Your Walton-on-Thames party
                  // stylist." run ~16em wide in Fraunces, so a 120px max
                  // overflows the 1440px container. 80px keeps every
                  // location's first line on one row at desktop.
                  //
                  // Mobile max-w bumped from 14ch to 20ch so longer town
                  // names ("Oxshott", "Walton-on-Thames") aren't forced
                  // into a narrow column — gives the h1 more breathing
                  // room across the typical phone viewport.
                  fontSize: "clamp(40px, 5.5vw, 80px)",
                  lineHeight: 1.04,
                  fontWeight: 400,
                  letterSpacing: "-0.032em",
                }}
              >
                {loc.hero.lines.map((line, i) => (
                  <span
                    key={i}
                    className={`word-reveal in${i > 0 ? ` delay-${i}` : ""}`}
                  >
                    <span>{line}</span>
                    {/* Use a plain space between segments — let the
                        browser wrap naturally instead of forcing a hard
                        line break that orphans words at certain
                        breakpoints. */}
                    {i < loc.hero.lines.length - 1 && " "}
                  </span>
                ))}
              </h1>
              {loc.hero.sub && (
                <p className="text-[16.5px] leading-[1.65] text-ink-soft max-w-[520px] mt-1 md:mt-10 fade-up in text-center">
                  {loc.hero.sub}
                </p>
              )}
              <div className="flex items-center justify-center gap-5 flex-wrap mt-10 fade-up in">
                <a href="#enquire" className="btn-solid-rf accent">
                  Start planning{" "}
                  <span style={{ fontSize: "1.35em", lineHeight: 1 }}>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile-only carousel — wrapper class hides it from md up so
              tablets and desktops see the LocationHeroFan instead. */}
          <div className="md:hidden">
            <ScrollStrip />
          </div>
          <LocationHeroFan />
        </section>

        {/* Services moved up — visitors should know what we offer
            before they read prose. Three cards link to the dedicated
            service pages. */}
        <ServicesCards
          sectionId={`loc-${loc.slug}-services`}
          heading={
            <>
              Three services, fully bespoke.{" "}
              <em className="italic font-light text-accent-warm">
                In {loc.cityName} and {loc.region}.
              </em>
            </>
          }
        />

        <LocationUSP />

        <LocationGallery
          id="loc-gallery"
          eyebrow={loc.gallery.eyebrow}
          heading={loc.gallery.heading}
          intro={loc.gallery.intro}
          mainImage={loc.gallery.mainImage}
          mainImageAlt={loc.gallery.mainImageAlt}
          images={loc.gallery.images}
        />

        {loc.localProse && (
          <LocationLocalProse
            eyebrow={loc.localProse.eyebrow}
            heading={loc.localProse.heading}
            body={loc.localProse.body}
            headingId={`loc-${loc.slug}-local-prose-heading`}
          />
        )}

        <div id="how-it-works">
          <Process />
        </div>

        <CPPricing
          tiers={loc.pricing.tiers}
          heading={loc.pricing.heading}
          ctaLabel="Start planning"
          footnote={loc.pricing.footnote}
        />

        <LocationTrust />

        <ChildrensFAQ
          faqs={loc.faqs}
          headingId={`loc-${loc.slug}-faq-heading`}
          defaultOpen={false}
          paddingBottom="64px"
        />

        <Enquire venuePlaceholder={`e.g. at home in ${loc.cityName}`} />

        <CPLocations
          eyebrow={loc.nearby.eyebrow}
          heading={loc.nearby.heading}
          intro={loc.nearby.intro}
          areas={loc.nearby.areas}
          mapQuery={loc.nearby.mapQuery}
          mapTitle={loc.nearby.mapTitle}
          currentSlug={loc.slug}
        />
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
