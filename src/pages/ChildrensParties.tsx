import { useEffect } from "react";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import { INSPIRATION_CHILDRENS } from "@/data/inspiration";
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
    <div className="min-h-screen bg-background text-foreground nav-solid">
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
              <a href="/balloon-installations/" className="underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors">
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
              More than a party,{" "}
              <em className="t-accent">
                a memory in the making.
              </em>
            </>
          }
        >
          <p>
            I design celebrations that transform your home or venue into
            something your child and every guest will remember long after the
            day is done.
          </p>
          <p>
            Every River Fox Events party is individually designed,
            tailored to your child, your space and the atmosphere you want
            to create.
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
              Every milestone,{" "}
              <em className="t-accent">
                beautifully marked.
              </em>
            </>
          }
        >
          <p>
            From initial concept to final installation, every detail is
            carefully planned and brought together seamlessly.
          </p>
          <p>
            No two events are ever the same. Every detail is shaped around you,
            your guests and the feeling you want the day to hold.
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
              Whatever your vision,{" "}
              <em className="t-accent">
                we can create it.
              </em>
            </>
          }
        >
          <p>
            Whatever your space, we create custom backdrops, themed props
            and styled details that turn it into something immersive and
            visually striking.
          </p>
          <p>
            From popular first birthday themes such as Wild One and Berry
            First, to epic Frozen parties and enchanting Harry Potter
            themes - everything designed to feel special, effortless, and
            remembered long after the day itself.
          </p>
        </CPReveal>

        <InspirationStrip id="cp-inspiration" accent="your next party." images={INSPIRATION_CHILDRENS} />

        <div id="how-it-works">
          <Process />
        </div>

        <CPPricing footnote="" />

        <ChildrensFAQ />

        <CPLocations />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default ChildrensParties;
