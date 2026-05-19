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

import imgHero from "@/assets/pastel-safari-anaya-two-wild-ballroom-surrey.webp";
import imgCelebrations from "@/assets/dinosaur-ayaan-arch-surrey.webp";
import imgOccasions from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgThemes from "@/assets/willy-wonka-savanna-chocolate-arch-surrey.webp";

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
          imageAlt="Ballroom safari birthday styling in Surrey by River Fox Events — Anaya, Two Wild arch, balloon pillars and light-up two"
          headingId="cp-hero-heading"
          lines={[
            <>Themed children's parties,</>,
            <>
              <em
                className="italic font-normal"
                style={{ color: "hsl(var(--accent))" }}
              >
                fully styled.
              </em>
            </>,
          ]}
          sub="Playful, immersive and beautifully considered — children's parties in Surrey that feel elevated from the moment guests arrive."
        />

        <CPReveal
          id="cp-celebrations"
          imageSide="right"
          image={imgCelebrations}
          alt="Dinosaur theme children's birthday styling in Surrey by River Fox Events — Ayaan name arch, sage balloons and crate props"
          tone="ph-warm"
          hideImageOnMobile
          imageScale={1.07}
          headline={
            <>
              More than a party —{" "}
              <em className="italic font-light text-accent-warm">
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
            Every River Fox Events party is created from the ground up,
            tailored to your child, your space and the atmosphere you want
            to create.
          </p>
        </CPReveal>

        <CPReveal
          id="cp-occasions"
          imageSide="left"
          image={imgOccasions}
          alt="Elegant birthday party styling in Surrey by River Fox Events — ivory, gold and blush balloon installation with floral accents"
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
          alt="Willy Wonka theme birthday styling in Surrey by River Fox Events — Savanna arch, chocolate bar prop and lollipop foils"
          tone="ph-warm"
          headline={
            <>
              Whatever your vision,{" "}
              <em className="italic font-light text-accent-warm">
                we can create it.
              </em>
            </>
          }
        >
          <p>
            We specialise in large-scale balloon installations, custom
            backdrops and styled details that transform your space into
            something immersive and visually striking.
          </p>
          <p>
            From popular first birthday themes such as Wild One and Berry
            First, to epic Frozen parties and enchanting Harry Potter
            themes — everything designed to feel special, effortless, and
            remembered long after the day itself.
          </p>
        </CPReveal>

        <div id="how-it-works">
          <Process />
        </div>

        <CPPricing />

        <ChildrensFAQ />

        <CPLocations />

        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default ChildrensParties;
