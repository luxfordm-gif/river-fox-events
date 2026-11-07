import { useEffect } from "react";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import { INSPIRATION_BALLOONS } from "@/data/inspiration";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import ServiceHero from "@/components/rfx/ServiceHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPPricing from "@/components/rfx/CPPricing";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import ServicesCards, { type ServiceCardItem } from "@/components/rfx/ServicesCards";
import LocationGallery from "@/components/rfx/LocationGallery";
import Experiences from "@/components/rfx/Experiences";
import LocationTrust from "@/components/rfx/LocationTrust";
import { LATEST_WORK } from "@/data/locations/_makeLocation";
import { galleryPhoto } from "@/data/gallery";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { whatsappHref } from "@/lib/whatsapp";
import { findRoute, REVIEWS } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  routeServiceSchema,
  upsertJsonLd,
} from "@/seo/headTags";

import imgHero from "@/assets/pastel-safari-anaya-two-wild-ballroom-surrey.webp";
import imgHeroMobile from "@/assets/river-fox-events-fairy-first-birthday-kayla-arch-marquee-portrait.webp";
import imgRainbowFive from "@/assets/cp-celebrations.webp";
import imgRoseGold40 from "@/assets/40th-birthday-rose-gold-marquee-surrey.webp";
import imgDinosaurFinished from "@/assets/journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp";

/* Photos from the Our work gallery: its resized copies and its one alt per photo. */
const fromGallery = (source: string) => {
  const p = galleryPhoto(source);
  return { src: p.src, srcSet: p.srcSet, alt: p.alt, position: p.position };
};

/* "It usually starts with a balloon arch": a story-style run of balloon-led
   photos, in the order Matt picked them (2026-11-07): Reeva's arch first, the rainbow 5 last.
   Photos not in the gallery reuse the alt they carry elsewhere on the site. */
const INTRO_SLIDES = [
  fromGallery("river-fox-events-pastel-birthday-reeva-entrance-arch.webp"),
  fromGallery("services/childrens-parties/bell-tent-picnic-pastel-balloons-garden.webp"),
  { src: imgRoseGold40, alt: "Rose gold light-up 40 marquee with a blush and chrome balloon installation in a hall with a wall clock" },
  fromGallery("services/milestones/baby-shower-sage-gold-balloons-baby-blocks.webp"),
  { src: imgRainbowFive, alt: "Rainbow balloon hoop around a light-up 5 with a pastel balloon installation" },
];

/* "Balloons as part of the whole room": one large photo, then a column of
   six (Matt, 2026-11-07). The gallery's 1400px copies keep the page light. */
const RECENT_WORK = [
  "journal/dylan-christening-first-birthday/dylan-first-birthday-teddy-cutout-chrome-gold-balloons.webp",
  "services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp",
  "services/childrens-parties/bunny-picnic-party-pink-arches-low-table.webp",
  "river-fox-events-baby-stubbs-gender-reveal-he-or-she-arch.webp",
  "services/milestones/gloria-80th-birthday-table-centrepiece-burhill.webp",
  "services/milestones/13th-birthday-pink-light-up-numbers-garland.webp",
].map((source) => {
  const p = galleryPhoto(source);
  return { src: p.large, alt: p.alt };
});

/* Five things Laura makes with balloons. Each card links on to the
   occasion page where that piece usually lives, so balloons stay the way
   in rather than the end point. */
const WHAT_WE_MAKE: ServiceCardItem[] = [
  {
    title: "Organic arches",
    blurb:
      "Loose, cloud-like arches in mixed sizes and tones, built to frame a cake table, a doorway or a backdrop. They're the piece most children's parties are built around.",
    href: "/childrens-parties/",
    cta: "Children's parties",
  },
  {
    title: "Balloon garlands",
    blurb:
      "Garlands that trail along a fireplace, a staircase or the top of a backdrop, in a palette matched to the occasion. Lovely for 40ths, christenings and baby showers.",
    href: "/milestone-celebrations/",
    cta: "Milestone celebrations",
  },
  {
    title: "Hoops & backdrops",
    blurb:
      "A balloon hoop or arched backdrop board personalised with a name and wrapped in your colours. It gives every guest a photo spot to gather around.",
    href: "/childrens-parties/",
    cta: "Children's parties",
  },
  {
    title: "Number & letter stacks",
    blurb:
      "Stacked balloon numbers and letters, sized to stand beside the cake table or greet guests at the door. A simple way to mark a first birthday, an 18th or a 50th.",
    href: "/milestone-celebrations/",
    cta: "Milestone celebrations",
  },
  {
    title: "Shopfront & corporate installs",
    blurb:
      "Branded arches and window displays for salons, shops, launches and office events, matched to your brand colours. Installed before you open and collected when you're finished.",
    href: "/corporate-brand-styling/",
    cta: "Corporate & brand",
  },
];

const FAQS = [
  {
    q: "How long do balloon arches last?",
    a: "Indoors, an arch stays full and bright for several days, often longer. Outdoors, sun and heat shorten that, so I'll always suggest the best spot and timing for your garden.",
  },
  {
    q: "Do you install and collect?",
    a: "Yes. I install everything before your guests arrive and come back afterwards to take it all down, so there's nothing left for you to deal with.",
  },
  {
    q: "How much does a balloon arch cost?",
    a: "It depends on the size, the colours and where it's going, so I quote each one to your design. If you'd like the backdrop, props and name board too, full party styling starts from £300.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as you can, especially for summer weekends and school holidays. Balloons can often be done at shorter notice, so if your date is close, do still get in touch.",
  },
  {
    q: "Can I choose my own colours?",
    a: "Yes. Send me your palette, a theme or a photo you love and I'll match the balloons to it, with names or messages added in vinyl if you'd like.",
  },
  {
    q: "Can I add balloons to a fully styled party?",
    a: "Yes, and it's what most families do. Full styling starts with the balloons and builds the backdrop, props and name board around them, from £300.",
  },
  {
    q: "Which areas do you cover?",
    a: "I'm based in Horley and cover all of Surrey, including Reigate, Cobham, Oxted, Esher, Weybridge and Guildford, plus nearby parts of London, Sussex and Kent. Just mention your postcode when you enquire.",
  },
];

/* Reviews that talk about the balloons and how the whole room looked. */
const BALLOON_REVIEWS = REVIEWS.filter((r) =>
  ["Samantha", "Sarah Lupinski", "Lee Dunn"].includes(r.a)
);

const BalloonInstallations = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/balloon-installations")!;
    applyMeta(route);

    const serviceId = "rfx-jsonld-svc-balloon-installations";
    const svc = routeServiceSchema(route);
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = "rfx-jsonld-bc-balloon-installations";
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
          imageAlt="Ballroom long table for a pastel safari second birthday, flanked by pink, sage and gold balloon columns under chandeliers"
          mobileImage={imgHeroMobile}
          mobileImageAlt="Kayla's fairy first birthday arch in pink and lilac balloons with a light-up one and mossy detail"
          headingId="bi-hero-heading"
          whatsappHref={whatsappHref(
            "Hi Laura, I'd like a quote for a balloon installation. My date and postcode are "
          )}
          lines={[
            <>Balloons are where it starts,</>,
            <>
              <em
                className="italic font-normal text-accent-warm"
              >
                styling is where it shines.
              </em>
            </>,
          ]}
          sub="Arches, garlands and number stacks installed across Surrey, with backdrops, props and name boards when you want the whole room styled."
        />

        <CPReveal
          id="bi-intro"
          imageSide="right"
          image={LATEST_WORK["naming-harvey-daisy"].src}
          alt={LATEST_WORK["naming-harvey-daisy"].alt}
          slides={INTRO_SLIDES}
          tone="ph-warm"
          headline={
            <>
              It usually starts{" "}
              <em className="italic font-light text-accent-warm">
                with a balloon arch.
              </em>
            </>
          }
        >
          <p>
            Most celebrations start with a balloon arch or a garland, and
            that's where I started too. Over eight years and more than 400
            events, I've learned that balloons look their best when the rest
            of the room is styled around them.
          </p>
          <p>
            So now I build the whole setting: backdrops, props, personalised
            name boards and tablescapes, all chosen to sit with the balloons
            rather than compete with them.
          </p>
          <p>
            I work from my studio in Horley and cover the whole of Surrey,
            from family homes in Reigate and Oxted to garden parties in
            Cobham, Esher and Weybridge.
          </p>
        </CPReveal>

        <ServicesCards
          sectionId="what-we-make"
          headingId="bi-make-heading"
          items={WHAT_WE_MAKE}
          heading={
            <>
              What we{" "}
              <em className="italic font-light text-accent-warm">make.</em>
            </>
          }
          intro="Every piece is installed on the day and collected afterwards, and each one can be the start of a fully styled room."
        />

        <LocationGallery
          id="bi-gallery"
          eyebrow="Recent work"
          heading={
            <>
              Balloons as part of{" "}
              <em className="italic font-light text-accent-warm">
                the whole room.
              </em>
            </>
          }
          intro="A few recent setups where the arch or garland is one layer of the styling, alongside the backdrop, the props and the table."
          mainImage={imgDinosaurFinished}
          mainImageAlt="Finished dinosaur party in a Surrey home: sage balloon arch, AYAAN name sign, dinosaur cutouts and wooden explorer crates"
          images={RECENT_WORK}
        />

        <div id="how-it-works">
          <Process />
        </div>

        <CPPricing
          heading={
            <>
              Start with the balloons,{" "}
              <em className="italic font-light text-accent-warm">
                or style the whole room.
              </em>
            </>
          }
          tiers={[
            {
              label: "Balloon installation only",
              // No from-price: balloon-only work runs from a single helium
              // balloon to a full arch, so one number would mislead.
              price: "Quoted to size",
              body: "From a single helium balloon to a full arch.",
            },
            {
              label: "Full party styling",
              price: "From £300",
              body: "Balloons, backdrops and props.",
              note: "Most families book this one.",
            },
          ]}
          ctaLabel="Enquire now"
          footnote=""
        />

        {/* Onward to the three full-styling services - the point of this
            page is to move balloon searchers into these. */}
        <Experiences
          sectionId="bi-services"
          showBalloonLink={false}
          heading={
            <>
              Want the whole room{" "}
              <em className="italic font-light text-accent-warm">styled?</em>
            </>
          }
          intro="Balloons are one part of what I do. These are the three ways I style a full celebration, with the balloons built in."
        />

        <LocationTrust reviews={BALLOON_REVIEWS} />

        <InspirationStrip id="bi-inspiration" accent="your next balloon installation." images={INSPIRATION_BALLOONS} flushBottom compactTop />

        <ChildrensFAQ
          faqs={FAQS}
          headingId="bi-faq-heading"
          paddingBottom="64px"
        />

        <Enquire />

        <section
          aria-label="See a fully styled party"
          className="py-14 md:py-20 text-center"
          style={{ background: "hsl(var(--surface-alt))" }}
        >
          <div className="container-rfx">
            <a href="/childrens-parties/" className="btn-link-rf">
              See what a fully styled party looks like{" "}
              <span className="arr">→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BalloonInstallations;
