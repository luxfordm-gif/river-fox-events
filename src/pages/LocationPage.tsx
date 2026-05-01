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
import ScrollStrip from "@/components/rfx/ScrollStrip";
import HeroEditorial from "@/components/rfx/HeroEditorial";
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
            <div className="mb-10 md:mb-14 flex flex-col items-center text-center">
              <h1
                id={`loc-${loc.slug}-hero-heading`}
                className="font-serif-rf max-w-[14ch] md:max-w-none mx-auto break-words text-pretty"
                style={{
                  fontSize: "clamp(56px, 7vw, 120px)",
                  lineHeight: 1.02,
                  fontWeight: 400,
                  letterSpacing: "-0.038em",
                }}
              >
                {loc.hero.lines.map((line, i) => (
                  <span
                    key={i}
                    className={`word-reveal in${i > 0 ? ` delay-${i}` : ""}`}
                  >
                    <span>{line}</span>
                    {i < loc.hero.lines.length - 1 && <br />}
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

          <ScrollStrip />
          <HeroEditorial />
        </section>

        {/* 50/50 image + copy — first content section under the hero. */}
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
