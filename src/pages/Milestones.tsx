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
import CPIncluded, { type IncludedItem } from "@/components/rfx/CPIncluded";
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
import imgIncluded from "@/assets/cp-included.webp";

const OCCASIONS = [
  {
    label: "Milestone birthdays",
    value: "21sts, 30ths, 40ths, 50ths, 60ths, 70ths and beyond",
  },
  {
    label: "Baby showers",
    value: "Beautiful, considered styling for one of life's most joyful moments",
  },
  {
    label: "Anniversaries",
    value: "From intimate dinners to large gatherings",
  },
];

const INCLUDED = [
  {
    label: "Theme & palette",
    value: "Custom design concept built around your vision",
  },
  {
    label: "Statement installations",
    value: "Balloon arches, backdrops and focal points",
  },
  {
    label: "Signage & props",
    value: "Personalised to the occasion",
  },
  {
    label: "Cake & dessert tables",
    value: "Fully styled and dressed",
  },
  {
    label: "Setup & breakdown",
    value: "Fully managed, start to finish",
  },
];

const INCLUDED_ITEMS: IncludedItem[] = [
  {
    icon: "palette",
    label: "Concept & palette",
    body: "A bespoke design concept built around the person being celebrated.",
  },
  {
    icon: "archway",
    label: "Statement installations",
    body: "Balloon arches, backdrops and floral focal points — the showstoppers.",
  },
  {
    icon: "sparkle",
    label: "Personalised signage",
    body: "Names, ages and milestones — bespoke pieces designed for the moment.",
  },
  {
    icon: "cake",
    label: "Cake & dessert tables",
    body: "Fully styled and dressed, every detail considered.",
  },
  {
    icon: "heart",
    label: "Setup & breakdown",
    body: "Fully managed, start to finish — nothing for you to lift.",
  },
];

const TIERS = [
  {
    price: "From £460",
    label: "Intimate",
    body: "Intimate celebrations with a single styled focal point — cake table, statement installation or backdrop.",
  },
  {
    price: "From £1,200",
    label: "Full room styling",
    body: "Most popular. A fully styled space with multiple installations, signage and considered detail throughout.",
  },
  {
    price: "From £2,500",
    label: "Premium transformation",
    body: "Large-scale, premium full-venue transformation — bespoke installations end to end.",
  },
];

const FAQS = [
  {
    q: "How far in advance should I book a milestone event?",
    a: "We recommend enquiring at least 8–12 weeks ahead for milestone celebrations, particularly for spring and summer weekends which book up quickly. If your date is sooner, do still get in touch — we'll always tell you honestly whether we can do it justice.",
  },
  {
    q: "Do you travel to my home or venue?",
    a: "Yes. We come to you — your home, garden, a private venue, restaurant or hotel. Setup happens before guests arrive and full breakdown is included afterwards, so the day feels effortless from start to finish.",
  },
  {
    q: "Can I choose specific colours and themes?",
    a: "Absolutely. Every milestone celebration is built from scratch around you — there are no off-the-shelf packages. Bring your inspiration (a Pinterest board, a colour palette, a favourite memory) and Laura will design around it.",
  },
  {
    q: "How much does milestone celebration styling cost in Surrey?",
    a: "Milestone celebrations start from £460 for an intimate single focal point. Full room styling typically sits between £1,200 and £2,500, with large-scale transformations from £2,500+. Every event is individually quoted following a discovery call.",
  },
  {
    q: "What happens on the day?",
    a: "We arrive ahead of guests and set everything up — installations, balloons, signage, dressed tables, the lot. You walk into a finished space. Once the celebration is over, we return for a full breakdown so you don't have to lift a finger.",
  },
  {
    q: "Do you style events outside Surrey?",
    a: "Surrey is home, but we regularly travel into London and the surrounding Home Counties for the right project. Just mention your location when you enquire and we'll let you know.",
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
        <CPHero
          image={imgHero}
          imageAlt="Elegant milestone birthday styling by River Fox Events Surrey — sophisticated tablescape with candles, florals and considered detail"
          headingId="ms-hero-heading"
          scrollTarget="#ms-intro"
          lines={[
            <>Life's most significant moments,</>,
            <>
              <em
                className="italic font-normal"
                style={{ color: "hsl(var(--accent))" }}
              >
                honoured properly.
              </em>
            </>,
          ]}
          sub="Elegant, bespoke styling for milestone birthdays, baby showers and anniversaries across Surrey."
        />

        <CPReveal
          id="ms-intro"
          imageSide="right"
          image={imgIntro}
          alt="Milestone birthday styling in Surrey by River Fox Events — refined balloon installation with florals and bespoke signage at a private venue"
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
            special as the person being celebrated.
          </p>
          <p>
            I design milestone events that feel elevated and personal — whether
            at home, a private venue, restaurant or hotel.
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
            From milestone birthdays and baby showers to anniversaries, every
            occasion deserves to feel considered. No two events are ever the
            same — every detail is shaped around you and your guests.
          </p>
          <DetailRows rows={OCCASIONS} />
        </CPReveal>

        <CPReveal
          id="ms-included"
          imageSide="right"
          image={imgIncluded}
          alt="Fully styled milestone celebration in Surrey by River Fox Events — dressed cake table, balloon installation, candles and bespoke signage"
          tone="ph-warm"
          headline={
            <>
              Everything handled.{" "}
              <em className="italic font-light text-accent-warm">
                Nothing left to chance.
              </em>
            </>
          }
        >
          <p>
            Every milestone celebration is fully managed, so you can be a
            guest at your own event.
          </p>
          <DetailRows rows={INCLUDED} />
        </CPReveal>

        <CPIncluded
          sectionId="ms-included-grid"
          headingId="ms-included-heading"
          items={INCLUDED_ITEMS}
          intro={
            <>
              Every milestone celebration is fully managed end-to-end, so you
              can be a guest at your own event.
            </>
          }
          outro={
            <>
              Every detail considered, every moment honoured — so you're free
              to enjoy the celebration.
            </>
          }
        />

        <CPPricing
          tiers={TIERS}
          heading={
            <>
              Beautifully styled milestone celebrations{" "}
              <em className="italic font-light text-accent-warm">from £460.</em>
            </>
          }
          ctaLabel="Plan your celebration"
        />

        <div id="how-it-works">
          <Process />
        </div>

        <ChildrensFAQ faqs={FAQS} headingId="ms-faq-heading" />

        <CPLocations />

        <Enquire defaultEventType="Milestone celebration" />
      </main>
      <Footer />
    </div>
  );
};

export default Milestones;
