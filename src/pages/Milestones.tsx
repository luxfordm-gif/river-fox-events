import { useEffect } from "react";
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
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  routeServiceSchema,
  upsertJsonLd,
} from "@/seo/headTags";

import imgHero from "@/assets/hero-2.webp";
import imgIntro from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgOccasions from "@/assets/christening-blessing-styling-surrey.webp";

const FAQS = [
  {
    q: "How far in advance should I book a milestone event?",
    a: "We recommend enquiring 8–12 weeks in advance for milestone celebrations, particularly for spring and summer weekends which book quickly. If your date is sooner, you're welcome to get in touch — we'll always advise honestly on what's possible.",
  },
  {
    q: "Do you travel to my home or venue?",
    a: "Yes. We come to you — your home, garden, a private venue, restaurant or hotel. Setup happens before guests arrive and full breakdown is included afterwards, so the day feels effortless from start to finish.",
  },
  {
    q: "Can I choose specific colours and themes?",
    a: "Every milestone is shaped around you — bring a palette, a Pinterest board or a single reference and the design grows from there.",
  },
  {
    q: "How much does milestone celebration styling cost in Surrey?",
    a: "Milestone celebrations start from £460, with larger or more involved designs typically ranging from £1,200 to £2,500+. Every event is individually quoted following a discovery call.",
  },
  {
    q: "What happens on the day?",
    a: "We arrive ahead of your guests and dress the space — installations, tablescapes, signage and styled details, all in place before anyone walks in. We return afterwards to pack everything away.",
  },
  {
    q: "Do you style events outside Surrey?",
    a: "Surrey is home, but we regularly travel into London and the surrounding Home Counties for the right project. Just mention your location when you enquire and we'll let you know.",
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
    <div className="min-h-screen bg-background text-foreground nav-solid">
      <Nav />
      <main>
        <ServiceHero
          image={imgHero}
          imageAlt="Elegant milestone birthday styling by River Fox Events Surrey — sophisticated tablescape with candles, florals and considered detail"
          headingId="ms-hero-heading"
          lines={[
            <>Milestone events,</>,
            <>
              <em
                className="italic font-normal"
                style={{ color: "hsl(var(--accent))" }}
              >
                considered in detail.
              </em>
            </>,
          ]}
          sub="Considered event styling for milestone birthdays, baby showers and anniversaries across Surrey — life's most significant moments, honoured properly."
        />

        <CPReveal
          id="ms-intro"
          imageSide="right"
          image={imgIntro}
          alt="Milestone birthday styling in Surrey by River Fox Events — refined balloon installation with florals and personalised signage at a private venue"
          tone="ph-warm"
          hideImageOnMobile
          imageScale={1.07}
          headline={
            <>
              Some occasions deserve more than{" "}
              <em className="italic font-light text-accent-warm">
                decoration.
              </em>
            </>
          }
        >
          <p>
            A milestone birthday or anniversary isn't just another event. It's
            a marker — a moment that deserves a setting as considered and
            special as the person and occasion being celebrated.
          </p>
          <p>
            I design events that feel elevated and personal — whether at
            home, a private venue, restaurant or hotel.
          </p>
        </CPReveal>

        <CPReveal
          id="ms-occasions"
          imageSide="left"
          image={imgOccasions}
          alt="Christening and naming day styling in Surrey by River Fox Events — soft pastel installation with personalised signage and floral detail"
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
          <p>
            Whether it's a 21st or 70th birthday, anniversary, baby shower
            or christening, each event is designed with a focus on
            atmosphere, balance and detail.
          </p>
        </CPReveal>

        <div id="how-it-works">
          <Process />
        </div>

        <CPPricing
          heading={
            <>
              A celebration that feels as special as{" "}
              <em className="italic font-light text-accent-warm">
                the moment itself.
              </em>
            </>
          }
          ctaLabel="Enquire now"
          footnote="Beautifully styled milestone celebrations from £460. Every event is individually quoted following a discovery call — so the proposal reflects exactly what you have in mind."
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
