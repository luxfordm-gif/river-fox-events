import { useEffect } from "react";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import { INSPIRATION_MILESTONES } from "@/data/inspiration";
import ServicesCards from "@/components/rfx/ServicesCards";
import { MILESTONE_TILES, withoutTilePhotos } from "@/data/serviceTiles";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import ServiceHero from "@/components/rfx/ServiceHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPPricing from "@/components/rfx/CPPricing";
import CPLocations from "@/components/rfx/CPLocations";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { whatsappHref } from "@/lib/whatsapp";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  routeServiceSchema,
  upsertJsonLd,
} from "@/seo/headTags";

import imgHero from "@/assets/milestone-celebration-styling-collage-surrey.webp";
import imgHeroMobile from "@/assets/milestone-celebration-styling-collage-portrait-surrey.webp";
import imgIntro from "@/assets/river-fox-events-veuve-cliquot-angela-georgia-arch-wide.webp";
import imgIntroHover from "@/assets/river-fox-events-veuve-cliquot-angela-georgia-balloon-disco-close-up.webp";
import imgOccasions from "@/assets/river-fox-events-baby-stubbs-gender-reveal-he-or-she-arch.webp";
import imgOccasionsHover from "@/assets/river-fox-events-baby-stubbs-gender-reveal-wildflower-detail.webp";

const FAQS = [
  {
    q: "How far in advance should I book a milestone event?",
    a: "I'd suggest enquiring 8–12 weeks ahead for milestone celebrations, especially for spring and summer weekends, which book quickly. If your date is sooner, do get in touch and I'll tell you honestly what's possible.",
  },
  {
    q: "Do you travel to my home or venue?",
    a: "Yes, I come to you: your home, garden, a private venue, a restaurant or a hotel. I set up before guests arrive and pack everything away once the celebration is over.",
  },
  {
    q: "Can I choose specific colours and themes?",
    a: "Yes. Bring a palette, a Pinterest board or a single photo and I'll design the numbers, balloons and backdrop around it.",
  },
  {
    q: "How much does milestone celebration styling cost in Surrey?",
    a: "Milestone celebrations start from £300, with larger or more involved designs typically ranging from £800 to £1,500+.",
  },
  {
    q: "What happens on the day?",
    a: "I arrive ahead of your guests and dress the room: balloon installations, the tables, signage and light-up numbers, all in place before anyone walks in. Afterwards I come back to pack everything away.",
  },
  {
    q: "Do you style events outside Surrey?",
    a: "Surrey is home, but I regularly travel into London and the surrounding Home Counties. Tell me where the celebration is when you enquire and I'll confirm.",
  },
];

const Milestones = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/milestone-celebrations")!;
    applyMeta(route);

    const serviceId = "rfx-jsonld-svc-milestone-celebrations";
    const svc = routeServiceSchema(route);
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = "rfx-jsonld-bc-milestone-celebrations";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);

    return () => {
      removeJsonLd(serviceId);
      removeJsonLd(breadcrumbId);
    };
  }, []);

  return (
    <div className="min-h-screen page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main>
        <ServiceHero
          image={imgHero}
          imageAlt="Collage of milestone celebration setups - pink and tangerine birthday board, blue balloon arches, a lit coral 40 number and a neutral styled arch"
          mobileImage={imgHeroMobile}
          mobileImageAlt="Pink and tangerine birthday balloon display with a Happy Birthday board, above blue baby-reveal arches and a Reeva is 2 sign"
          headingId="ms-hero-heading"
          whatsappHref={whatsappHref(
            "Hi Laura, I'd love to talk about styling a milestone celebration. My date and postcode are "
          )}
          lines={[
            <>Milestone events,</>,
            <>
              <em className="t-accent">
                styled your way.
              </em>
            </>,
          ]}
          sub={
            <>
              Light-up numbers,{" "}
              <a href="/balloon-installations/" className="text-link">
                balloon walls
              </a>{" "}
              and personalised backdrops for 30ths, 40ths, anniversaries and
              christenings, set up before guests arrive and cleared away after.
            </>
          }
        />

        <CPReveal
          id="ms-intro"
          imageSide="right"
          image={imgOccasions}
          alt="He or She balloon arch in soft blue and pink for the Stubbs family gender reveal"
          hoverImage={imgOccasionsHover}
          hoverAlt="Wildflower and dried-grass detail on the Stubbs gender reveal, in soft pinks, blues and pampas"
          tone="ph-warm"
          headline={
            <>
              Occasions worth{" "}
              <em className="t-accent">
                marking.
              </em>
            </>
          }
        >
          <p>
            I style 30ths, 40ths, anniversaries and christenings at home, in a
            private room, a restaurant or a hotel.
          </p>
          <p>
            Usually that means light-up numbers, a balloon garland in your
            colours and a backdrop for the photos.
          </p>
        </CPReveal>

        <CPReveal
          id="ms-occasions"
          imageSide="left"
          image={imgIntro}
          alt="Champagne-themed birthday arch in tangerine, white and gold balloons for Angela and Georgia"
          hoverImage={imgIntroHover}
          hoverAlt="Mirrored disco-ball centrepiece nested in tangerine and white balloons at Angela and Georgia's celebration"
          tone="ph-blush"
          imageScale={1.07}
          headline={
            <>
              Every milestone,{" "}
              <em className="t-accent">
                beautifully marked.
              </em>
            </>
          }
        >
          <p>
            From a 21st to a 70th, a baby shower to a wedding anniversary, I'll
            ask who it's for, what they love and where it's happening, then
            design the numbers, colours and backdrop around that.
          </p>
        </CPReveal>

        {/* "What we do": photo tiles like the balloon page's, linking on
            only where a sub-service page or article exists. Sits under the last
            50/50 section (Matt, 2026-11-09). */}
        <ServicesCards
          divided
          sectionId="ms-what-we-do"
          headingId="ms-do-heading"
          items={MILESTONE_TILES}
          heading={
            <>
              Where I{" "}
              <em className="t-accent">start.</em>
            </>
          }
          intro="Every milestone is individually designed around your colours and venue. These come up most, but nothing here is a package."
        />

        <Process sectionId="how-it-works" />

        <InspirationStrip id="ms-inspiration" lead="Celebrations I've" accent="already styled." images={withoutTilePhotos(INSPIRATION_MILESTONES, MILESTONE_TILES)} />

        <CPPricing
          heading={
            <>
              A celebration that feels as special as{" "}
              <em className="t-accent">
                the moment itself.
              </em>
            </>
          }
          intro="From christenings to milestone birthdays, styling starts from £300 and every quote follows a short call."
          ctaLabel="Enquire now"
        />

        <ChildrensFAQ faqs={FAQS} headingId="ms-faq-heading" />

        <CPLocations />

        <Enquire defaultEventType="Milestone celebration" />
      </main>
      <Footer />
    </div>
  );
};

export default Milestones;
