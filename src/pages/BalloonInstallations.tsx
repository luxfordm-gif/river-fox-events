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
import FaqSection from "@/components/rfx/FaqSection";
import ServicesCards from "@/components/rfx/ServicesCards";
import { WHAT_WE_MAKE } from "@/data/balloonTiles";
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

/* Second half of the intro: one still photo of a whole styled setting (Matt
   split the intro into two 50/50s, 2026-11-09). Chosen because no other
   page uses it; the Two Wild photo was already on several. */
const SETTING_PHOTO = galleryPhoto(
  "services/childrens-parties/garden-picnic-party-pastel-balloons-low-table.webp"
);

/* "Balloons as part of the whole room": one large photo, then a column of
   five (Matt, 2026-11-07). The gallery's 1400px copies keep the page light.
   2026-11-09: the Stubbs gender reveal sign came out, and the bunny picnic
   (mostly table) became Peter Rabbit, where the balloons lead. */
const RECENT_WORK = [
  "journal/dylan-christening-first-birthday/dylan-first-birthday-teddy-cutout-chrome-gold-balloons.webp",
  "services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp",
  "services/childrens-parties/peter-rabbit-first-birthday-blue-balloon-backdrop.webp",
  "services/milestones/gloria-80th-birthday-table-centrepiece-burhill.webp",
  "services/milestones/13th-birthday-pink-light-up-numbers-garland.webp",
].map((source) => {
  const p = galleryPhoto(source);
  return { src: p.large, alt: p.alt };
});

/* "What we make": eight balloon pieces as small square tiles, just the
   name, each linking on to the service page where that piece usually lives
   (Matt, 2026-11-08). Order alternates colours so similar photos don't sit
   side by side; on phones they pair up two across. None repeat the hero or
   the inspiration strip. Alts come from the gallery (one image, one alt). */

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
    q: "How much do balloon decorations cost in Surrey?",
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
    q: "Do you do balloon decorations for weddings, adult birthdays and businesses?",
    a: "Yes. Alongside children's parties I style weddings, 18ths, 40ths, 50ths and christenings, and branded balloon installs for shops, offices and launches.",
    aNode: (
      <>
        Yes. Alongside children's parties I style weddings,{" "}
        <a href="/milestone-celebrations/" className="text-link">18ths, 40ths, 50ths and christenings</a>, and{" "}
        <a href="/corporate-brand-styling/" className="text-link">branded balloon installs</a>{" "}
        for shops, offices and launches.
      </>
    ),
  },
  {
    q: "Which areas do you cover?",
    a: "I'm based in Horley and cover all of Surrey, including Reigate, Cobham, Oxted, Esher, Weybridge and Guildford, plus nearby parts of London, Sussex and Kent. Just mention your postcode when you enquire.",
  },
];

/* Reviews that talk about the balloons in the customer's own words. Helen A
   (the arch) and Emily Stimson (the stack) added 2026-11-09 so the page's
   reviews name the balloon pieces themselves. */
const BALLOON_REVIEWS = REVIEWS.filter((r) =>
  ["Samantha", "Sarah Lupinski", "Lee Dunn", "Helen A", "Emily Stimson"].includes(r.a)
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
    <div className="min-h-screen page-paper text-foreground nav-solid nav-paper">
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
            /* No "across Surrey" in the heading (Matt, 2026-11-13): the title,
               description and intro still carry the location. */
            <>Balloon decorations,</>,
            <>
              <em className="t-accent">
                styled around your celebration.
              </em>
            </>,
          ]}
          sub="Organic arches, garlands, balloon walls and number stacks, sized and coloured to your room, with backdrops, props and name boards when you want the whole space styled."
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
              <em className="t-accent">
                with a balloon arch.
              </em>
            </>
          }
        >
          {/* Short direct answer near the top, for search and AI answers
              (SEO Vendor GEO audit, 2026-11-09). The copy is shared evenly
              between this half and the next (Matt, 2026-11-09). */}
          <p>
            I design and install balloon decorations across Surrey: organic
            arches, garlands, balloon walls, number stacks and table
            centrepieces, each sized and coloured to your room.
          </p>
          <p>
            Balloon arches are where I started, and plenty of people still
            come to me just for balloon arch hire or a few balloon garlands.
          </p>
        </CPReveal>

        <CPReveal
          id="bi-setting"
          imageSide="left"
          image={SETTING_PHOTO.src}
          alt={SETTING_PHOTO.alt}
          tone="ph-warm"
          headline={
            <>
              Then I style{" "}
              <em className="t-accent">
                everything around them.
              </em>
            </>
          }
        >
          <p>
            Over eight years and 400+ events, I've learned balloons look their
            best when{" "}
            <a href="/journal/beyond-the-balloon-arch/" className="text-link">
              the room is styled around them
            </a>
            . So I build the whole setting: backdrops, props, name boards and
            tablescapes chosen to sit with the balloons.
          </p>
          <p>
            From my Horley studio I cover all of Surrey, from homes in{" "}
            <a href="/party-styling-reigate/" className="text-link">Reigate</a>{" "}
            and <a href="/party-styling-oxted/" className="text-link">Oxted</a>{" "}
            to garden parties in{" "}
            <a href="/party-styling-cobham/" className="text-link">Cobham</a>,{" "}
            <a href="/party-styling-esher/" className="text-link">Esher</a> and{" "}
            <a href="/party-styling-weybridge/" className="text-link">Weybridge</a>.
            I set everything up before your guests arrive and come back to
            take it down afterwards.
          </p>
        </CPReveal>

        {/* `divided`: the same rule after the 50/50s as the other service
            pages (Matt, 2026-11-09). */}
        <ServicesCards
          divided
          sectionId="what-we-make"
          headingId="bi-make-heading"
          items={WHAT_WE_MAKE}
          heading={
            <>
              The balloon decorations{" "}
              <em className="t-accent">I'm asked for most.</em>
            </>
          }
          intro="Arches and garlands are where most celebrations start. Every one is sized and coloured to your space, and most become part of a bigger setup."
        />

        <LocationGallery
          id="bi-gallery"
          heading={
            <>
              Recent <em className="t-accent">work.</em>
            </>
          }
          intro="A few recent setups where the arch or garland is one layer of the styling, alongside the backdrop, the props and the table."
          mainImage={imgDinosaurFinished}
          mainImageAlt="Finished dinosaur party in a Surrey home: sage balloon arch, AYAAN name sign, dinosaur cutouts and wooden explorer crates"
          images={RECENT_WORK}
        />

        <Process sectionId="how-it-works" />

        {/* Heading, a short direct answer and the button: the two price
            cards were taken out (Matt, 2026-11-08); the question heading and
            answer were added for search and AI answers (2026-11-09). */}
        <CPPricing
          heading={
            <>
              How much do balloon decorations{" "}
              <em className="t-accent">cost?</em>
            </>
          }
          intro="Each design is quoted to its size, colours and venue, so a single garland costs much less than a full balloon wall. If you'd like the backdrop, props and name board as well, full party styling starts from £300."
          ctaLabel="Enquire now"
          footnote=""
        />

        {/* Onward to the three full-styling services - the point of this
            page is to move balloon searchers into these. */}
        <Experiences
          sectionId="bi-services"
          align="centre"
          heading={
            <>
              Want the whole room{" "}
              <em className="t-accent">styled?</em>
            </>
          }
        />

        <LocationTrust reviews={BALLOON_REVIEWS} />

        <InspirationStrip id="bi-inspiration" lead="Installs I've" accent="already built." images={INSPIRATION_BALLOONS} />

        <FaqSection
          faqs={FAQS}
          headingId="bi-faq-heading"
        />

        <Enquire />

      </main>
      <Footer />
    </div>
  );
};

export default BalloonInstallations;
