import { useEffect } from "react";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import { INSPIRATION_CHILDRENS } from "@/data/inspiration";
import ServicesCards from "@/components/rfx/ServicesCards";
import { CHILDRENS_TILES, withoutTilePhotos } from "@/data/serviceTiles";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Process from "@/components/rfx/Process";
import Enquire from "@/components/rfx/Enquire";
import ServiceHero from "@/components/rfx/ServiceHero";
import CPReveal from "@/components/rfx/CPReveal";
import CPPricing from "@/components/rfx/CPPricing";
import CPLocations from "@/components/rfx/CPLocations";
import FaqSection from "@/components/rfx/FaqSection";
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

import imgHero from "@/assets/river-fox-events-jungle-theme-fourever-wild-full-setup.webp";
import imgHeroMobile from "@/assets/river-fox-events-jungle-theme-safari-tablescape-elephant.webp";
import imgCelebrations from "@/assets/dinosaur-ayaan-arch-surrey.webp";
import imgCelebrationsHover from "@/assets/river-fox-events-dinosaur-theme-ayaan-arch-close-up-portrait.webp";
import imgOccasions from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-tablescape.webp";
import imgOccasionsHover from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-marquee-close-up.webp";
import imgThemes from "@/assets/willy-wonka-savanna-chocolate-arch-surrey.webp";
import imgThemesHover from "@/assets/river-fox-events-willy-wonka-savanna-bar-prop-close-up.webp";

const ChildrensParties = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/childrens-parties")!;
    applyMeta(route);

    const serviceId = "rfx-jsonld-svc-childrens-parties";
    const svc = routeServiceSchema(route);
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = "rfx-jsonld-bc-childrens-parties";
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
          imageAlt="Fourever Wild jungle party setup with white safari jeep, balloon garland, giraffe, zebra and lion cub by a bamboo backdrop"
          mobileImage={imgHeroMobile}
          mobileImageAlt="Jungle tablescape with an elephant centrepiece, monstera runner, giraffe-print plates and safari balloons"
          headingId="cp-hero-heading"
          whatsappHref={whatsappHref(
            "Hi Laura, I'd love to talk about styling my child's party. My date and postcode are "
          )}
          lines={[
            <>Themed children's parties,</>,
            <>
              <em className="t-accent">
                fully styled.
              </em>
            </>,
          ]}
          sub={
            <>
              <a href="/balloon-installations/" className="text-link">
                Balloon arches
              </a>
              , themed backdrops and painted name signs, set up across Surrey
              before your guests arrive and cleared away afterwards.
            </>
          }
        />

        <CPReveal
          id="cp-celebrations"
          imageSide="right"
          image={imgOccasions}
          alt="Pastel safari Two Wild table for Anaya's second birthday, with pink place settings, a foliage runner and a light-up two"
          hoverImage={imgOccasionsHover}
          hoverAlt="Close-up of the pink light-up two marquee at Anaya's pastel safari birthday, with sage and pink balloons"
          tone="ph-warm"
          headline={
            <>
              Your child's party,{" "}
              <em className="t-accent">
                set up for you.
              </em>
            </>
          }
        >
          <p>
            I build the whole party setting: balloon arches, themed
            backdrops, painted name signs, props and the party table.
          </p>
          <p>
            I set it up at your home, garden or venue before anyone arrives,
            and clear it all away once the last guest has gone.
          </p>
        </CPReveal>

        <CPReveal
          id="cp-occasions"
          imageSide="left"
          image={imgCelebrations}
          alt="Ayaan's dinosaur birthday arch with sage balloons, a personalised name sign and wooden crate props"
          hoverImage={imgCelebrationsHover}
          hoverAlt="Close-up of Ayaan's dinosaur arch, with sage and cream balloons, tropical foliage and a personalised sign"
          tone="ph-blush"
          imageScale={1.07}
          headline={
            <>
              Sketched first,{" "}
              <em className="t-accent">
                then built.
              </em>
            </>
          }
        >
          <p>
            Before the day, I send you a visual of the setup, so you can see
            the arch, the colours and the name sign in place.
          </p>
          <p>
            I'm there to install it too, so what you see in the sketch is
            what you walk into.
          </p>
        </CPReveal>

        <CPReveal
          id="cp-themes"
          imageSide="right"
          image={imgThemes}
          alt="Purple and lilac balloon arch with a gold Savanna ticket panel, cocoa-bar plinth, lollipop swirls and a number 5 column"
          hoverImage={imgThemesHover}
          hoverAlt="Close-up of the chocolate-bar prop with lilac balloons, a lollipop foil and mushroom props at Savanna's Wonka party"
          tone="ph-warm"
          headline={
            <>
              Whatever the theme,{" "}
              <em className="t-accent">
                I'll make it work.
              </em>
            </>
          }
        >
          <p>
            Wild One, Berry First, Frozen, Harry Potter or a dinosaur phase:
            I make the backdrop, props and signs to match, sized to fit your
            room.
          </p>
          <p>
            Savanna's Willy Wonka party had a chocolate-bar plinth and a gold
            ticket with her name on it.
          </p>
        </CPReveal>

        {/* "What we do": photo tiles like the balloon page's, linking on
            only where a sub-service page or article exists. Sits under the last
            50/50 section (Matt, 2026-11-09). */}
        <ServicesCards
          divided
          sectionId="cp-what-we-do"
          headingId="cp-do-heading"
          items={CHILDRENS_TILES}
          heading={
            <>
              What I love{" "}
              <em className="t-accent">making.</em>
            </>
          }
          intro="Tell me the theme and I'll build the party around it. These are the pieces families ask for most, but anything goes."
        />

        <Process sectionId="how-it-works" />

        <InspirationStrip id="cp-inspiration" lead="Parties I've" accent="already made." images={withoutTilePhotos(INSPIRATION_CHILDRENS, CHILDRENS_TILES)} />

        <CPPricing footnote="" />

        <FaqSection />

        <CPLocations />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default ChildrensParties;
