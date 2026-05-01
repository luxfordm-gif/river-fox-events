import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import CPReveal from "@/components/rfx/CPReveal";
import CPLocations from "@/components/rfx/CPLocations";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import Experiences from "@/components/rfx/Experiences";
import LocationGallery from "@/components/rfx/LocationGallery";
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
        {/* Flat coloured-bg hero — signals "child page" with a calm peach
            surface instead of the full-bleed image used on top-level
            service pages. h1 + italic sub copy, centred. */}
        <section
          id="top"
          className="text-center"
          style={{
            background: "hsl(var(--surface-warm))",
            paddingTop: "clamp(96px, 13vh, 160px)",
            paddingBottom: "clamp(72px, 11vh, 128px)",
          }}
          aria-labelledby={`loc-${loc.slug}-hero-heading`}
        >
          <div className="container-rfx">
            <h1
              id={`loc-${loc.slug}-hero-heading`}
              className="font-serif-rf max-w-[18ch] mx-auto"
              style={{
                fontSize: "clamp(44px, 5.5vw, 88px)",
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: "-0.032em",
                color: "hsl(var(--ink))",
                textWrap: "balance",
              }}
            >
              {loc.hero.lines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < loc.hero.lines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            {loc.hero.sub && (
              <p
                className="mt-7 md:mt-9 max-w-[46ch] mx-auto text-[18px] md:text-[20px] leading-[1.5] text-ink-soft font-serif-rf font-light italic"
                style={{ textWrap: "pretty" }}
              >
                {loc.hero.sub}
              </p>
            )}
          </div>
        </section>

        {/* Centred intro block (no image) — first thing under the hero. */}
        <section id="loc-what-we-do" className="rfx-section white">
          <div className="container-rfx">
            <div className="max-w-[680px] mx-auto md:text-center">
              <h2
                className="font-serif-rf"
                style={{
                  fontSize: "clamp(34px, 3.4vw, 56px)",
                  lineHeight: 1.0,
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                  textWrap: "balance",
                }}
              >
                {loc.whatWeDo.headline}
              </h2>
              <div
                className="mt-3 md:mt-7 text-[16px] leading-[1.7] text-ink-soft space-y-5"
                style={{ textWrap: "pretty" }}
              >
                {loc.whatWeDo.body}
              </div>
            </div>
          </div>
        </section>

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

        <LocationGallery
          id="loc-gallery"
          eyebrow={loc.gallery.eyebrow}
          heading={loc.gallery.heading}
          intro={loc.gallery.intro}
          mainImage={loc.gallery.mainImage}
          mainImageAlt={loc.gallery.mainImageAlt}
          images={loc.gallery.images}
        />

        <Experiences
          sectionId={`loc-${loc.slug}-services`}
          heading={
            <>
              Children's parties, milestones &amp; corporate events in{" "}
              <em className="italic font-light text-accent-warm">
                {loc.cityName}.
              </em>
            </>
          }
          intro={
            <>
              Three considered services, each fully bespoke. Whatever the
              occasion in {loc.cityName} — a child's birthday, a 40th, a brand
              launch — Laura designs and delivers it personally.
            </>
          }
        />

        <div id="how-it-works">
          <Process />
        </div>

        <ChildrensFAQ
          faqs={loc.faqs}
          headingId={`loc-${loc.slug}-faq-heading`}
          defaultOpen={false}
          paddingBottom="64px"
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

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
