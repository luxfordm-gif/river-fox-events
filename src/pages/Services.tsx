import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import Breadcrumbs from "@/components/rfx/Breadcrumbs";
import Experiences, { type ExpItem } from "@/components/rfx/Experiences";
import { SERVICES_HEADING, SERVICES_INTRO } from "@/data/servicesCopy";
import Enquire from "@/components/rfx/Enquire";
import LocationUSP from "@/components/rfx/LocationUSP";
import LocationTrust from "@/components/rfx/LocationTrust";
import FaqSection from "@/components/rfx/FaqSection";
import LocationPhotoGrid from "@/components/rfx/LocationPhotoGrid";
import { homeRecentPicks } from "@/data/recentWork";
import { HOME_FAQS } from "@/data/homeFaqs";
import { galleryPhoto } from "@/data/gallery";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { christmasOn } from "@/lib/announcementBar";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { findRoute } from "@/seo/routes";
import { applyMeta, breadcrumbSchema, removeJsonLd, upsertJsonLd } from "@/seo/headTags";

/**
 * /services/ - the services hub (Matt, 2026-11-24). Kept small and built only
 * from existing parts and Laura's existing words:
 *   - H1 and intro: the home page's services heading and intro.
 *   - The three main cards: the home page's services section (Experiences),
 *     with the prices left off (no prices on this page).
 *   - Three smaller cards: each card's text is the first line under that
 *     page's own headline, word for word. The photos (and their alt text)
 *     come from the Our work gallery. Link labels: "See Christmas door
 *     garlands" is the Our work page's; "See balloon ideas" and "See business
 *     garlands" were written to match the three above (Matt to confirm).
 *   - Then the town pages' Why River Fox Events?, Recent celebrations (their
 *     heading and intro), Kind words,
 *     and the home page FAQs without the price question.
 *   - The two Christmas cards go with the Christmas switch-off: christmasOn()
 *     (christmasEndsOn in src/data/announcementBar.ts, 3 January 2027), the
 *     same switch that takes them out of the menu and footer.
 */

const photo = (source: string) => {
  const p = galleryPhoto(source);
  return { img: p.src, srcSet: p.srcSet, alt: p.alt };
};

const BALLOONS: ExpItem = {
  title: "Balloon decorations",
  // The Balloons page hero line.
  body: "Organic arches, garlands, balloon walls and number stacks, sized and coloured to your room, with backdrops, props and name boards when you want the whole space styled.",
  href: "/balloon-installations/",
  cta: "See balloon ideas",
  ...photo("river-fox-events-pastel-birthday-reeva-entrance-arch.webp"),
};

const CHRISTMAS: ExpItem[] = [
  {
    title: "Christmas door garlands",
    // The Christmas door garlands hero line.
    body: "Each garland is individually styled for your home or business and installed by hand across Surrey, with optional January takedown.",
    href: "/christmas-door-garlands/",
    // The Our work page's link to this page.
    cta: "See Christmas door garlands",
    ...photo("christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp"),
  },
  {
    title: "Christmas for businesses",
    // The Christmas for businesses hero line.
    body: "I dress shopfronts, salons, restaurants and offices across Surrey with garlands matched to your brand, installed by hand around your opening hours, with optional January takedown.",
    href: "/commercial-christmas-decorations/",
    cta: "See business garlands",
    ...photo("christmas/instagram/reigate-restaurant-red-gold-garland-blue-doors.webp"),
  },
];

/* The home page FAQs, without the price question (no prices on this page). */
const FAQS = HOME_FAQS.filter((f) => !f.a.includes("£"));

/* Recent celebrations: the town pages' photo wall (ten photos, three rows),
   with a mix of every service, newest first (the home page's picks). */
const RECENT_PICKS = homeRecentPicks(10);

const Services = () => {
  useFadeUp();
  useNavScroll();
  const more = christmasOn() ? [BALLOONS, ...CHRISTMAS] : [BALLOONS];

  useEffect(() => {
    const route = findRoute("/services")!;
    applyMeta(route);
    // Same id as the copy postbuild writes into the page, so they don't double up.
    const breadcrumbId = "rfx-jsonld-bc-services";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);
    return () => removeJsonLd(breadcrumbId);
  }, []);

  return (
    <div className="min-h-screen page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main>
        {/* Same top as Our work and Contact, line under the intro (Matt, 2026-11-24). */}
        <PageHeader
          divider
          id="services-heading"
          above={<Breadcrumbs path="/services" />}
          title={SERVICES_HEADING}
          intro={SERVICES_INTRO}
        >
          <div className="text-to-action flex justify-center">
            <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
              Reserve your date <span className="t-icon">→</span>
            </a>
          </div>
        </PageHeader>

        <Experiences hideHeading labelledBy="services-heading" hidePrices eagerFirst sectionId="services-list" more={more} />

        {/* The town pages' sections, in their order (Matt, 2026-11-24): Why
            River Fox Events?, Recent celebrations, Kind words with the
            client logos, FAQs (no Ideas strip, Matt 2026-11-24). */}
        <LocationUSP noIntro />

        <LocationPhotoGrid
          id="services-recent"
          wide
          slug="services"
          topUp={false}
          count={RECENT_PICKS.length}
          picks={RECENT_PICKS}
          heading={
            <>
              Recent <em className="t-accent">celebrations.</em>
            </>
          }
          intro="Every River Fox Events celebration is completely bespoke and tailored to you."
        />

        <LocationTrust />

        <FaqSection faqs={FAQS} headingId="services-faq-heading" />

        <Enquire hidePrice />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
