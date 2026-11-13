import { useEffect } from "react";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import { INSPIRATION_TOWNS } from "@/data/inspiration";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import CPLocations from "@/components/rfx/CPLocations";
import CPPricing from "@/components/rfx/CPPricing";
import FaqSection from "@/components/rfx/FaqSection";
import Experiences from "@/components/rfx/Experiences";
import LocationGallery from "@/components/rfx/LocationGallery";
import LocationUSP from "@/components/rfx/LocationUSP";
import LocationTrust from "@/components/rfx/LocationTrust";
import ScrollStrip from "@/components/rfx/ScrollStrip";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { whatsappHref } from "@/lib/whatsapp";
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
      // routes.ts is the one source for titles, so the tab title doesn't
      // change once the page's JavaScript loads.
      title: route?.title ?? loc.seoTitle,
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
          lowPrice: "300",
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
    <div className="min-h-screen page-paper text-foreground rfx-tight-mobile nav-solid nav-paper">
      <Nav />
      <main>
        {/* Same top space as the service heroes, scaling on big screens
            (Matt, 2026-11-08). Homepage-style hero: centred copy + CTA, then mobile scroll
            strip and desktop editorial 3-image grid below. Same shape as
            <Hero /> on the homepage so location pages feel of-a-piece. */}
        <section
          id="top"
          className="rfx-hero rfx-hero-scale hero-foot"
          aria-labelledby={`loc-${loc.slug}-hero-heading`}
        >
          <div className="container-rfx">
            {/* mb tightened (was mb-10/mb-14) so the cards sit closer to
                the CTA button - about 22px less air on both breakpoints. */}
            <div className="rfx-hero-intro flex flex-col items-center text-center">
              <h1
                id={`loc-${loc.slug}-hero-heading`}
                // t-h1, not t-display: location titles like "Your
                // Walton-on-Thames party stylist." run ~16em wide in
                // Fraunces, so the display size overflows the container.
                // Mobile max-w is 20ch so longer town names ("Oxshott",
                // "Walton-on-Thames") aren't forced into a narrow column.
                className="t-h1 max-w-[20ch] md:max-w-none mx-auto break-words text-pretty"
              >
                {loc.hero.lines.map((line, i) => (
                  <span
                    key={i}
                    className={`word-reveal in${i > 0 ? ` delay-${i}` : ""}`}
                  >
                    <span>{line}</span>
                    {/* Use a plain space between segments - let the
                        browser wrap naturally instead of forcing a hard
                        line break that orphans words at certain
                        breakpoints. */}
                    {i < loc.hero.lines.length - 1 && " "}
                  </span>
                ))}
              </h1>
              {loc.hero.sub && (
                <p className="t-lead text-ink-soft max-w-[520px] heading-to-text fade-up in text-center">
                  {loc.hero.sub}
                </p>
              )}
              {/* Phones also get WhatsApp Laura now, pre-filled with the
                  town. Matching widths, stacked. No See our work here: the
                  services section just below has it (Matt, 2026-11-09). */}
              <div className="text-to-action actions mx-auto grid w-fit md:grid-flow-col md:auto-cols-fr fade-up in">
                <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent justify-center">
                  Reserve your date{" "}
                  <span className="t-icon">→</span>
                </a>
                <a
                  href={whatsappHref(
                    `Hi Laura, I'd love to talk about styling a party in ${loc.cityName}. My date is `
                  )}
                  className="btn-ghost-rf justify-center md:hidden"
                >
                  WhatsApp Laura now
                </a>
              </div>
            </div>
          </div>

          {/* Mobile: scroll-driven horizontal strip using the same 3
              heroFan images as the desktop fan, so the two breakpoints
              stay in sync visually. Hidden from md up. */}
          <div className="md:hidden">
            <ScrollStrip images={loc.hero.fanImages} />
          </div>
          <LocationHeroFan images={loc.hero.fanImages} spreadOnHover />
        </section>

        {/* Services moved up - visitors should know what we offer before
            they read prose. The same section as the homepage (rotating
            photos), with this town's own heading and intro (Matt, 2026-11-08). */}
        <Experiences
          align="stacked"
          sectionId={`loc-${loc.slug}-services`}
          heading={loc.servicesHeading}
          intro={
            loc.servicesIntro ?? (
              <>
                Each event is individually designed, with a focus on
                aesthetic, flow and detail. I take on a small number of
                clients each month so I can give every event my full
                attention, from the first idea to the install.
              </>
            )
          }
        />

        <LocationUSP cityName={loc.cityName} body={loc.uspBody} />

        <LocationGallery
          id="loc-gallery"
          eyebrow={loc.gallery.eyebrow}
          heading={loc.gallery.heading}
          intro={loc.gallery.intro}
          mainImage={loc.gallery.mainImage}
          mainImageAlt={loc.gallery.mainImageAlt}
          images={loc.gallery.images}
        />

        <Process sectionId="how-it-works" />

        <CPPricing
          heading={loc.pricing.heading}
          ctaLabel="Reserve your date"
          footnote={loc.pricing.footnote}
        />

        <LocationTrust />

        <InspirationStrip id={`loc-${loc.slug}-inspiration`} accent="your celebration." images={INSPIRATION_TOWNS} />

        <FaqSection
          faqs={loc.faqs}
          headingId={`loc-${loc.slug}-faq-heading`}
          defaultOpen={false}
        />

        <CPLocations
          eyebrow={loc.nearby.eyebrow}
          heading={loc.nearby.heading}
          intro={loc.nearby.intro}
          areas={loc.nearby.areas}
          mapQuery={loc.nearby.mapQuery}
          mapTitle={loc.nearby.mapTitle}
          currentSlug={loc.slug}
        />

        <Enquire venuePlaceholder={`e.g. at home in ${loc.cityName}`} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
