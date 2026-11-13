import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Hero from "@/components/rfx/Hero";
import InstagramFollow from "@/components/rfx/InstagramFollow";
import Experiences from "@/components/rfx/Experiences";
import Mission from "@/components/rfx/Mission";
import RevealWord from "@/components/rfx/RevealWord";
import About from "@/components/rfx/About";
import Process from "@/components/rfx/Process";
import Testimonials from "@/components/rfx/Testimonials";
import FaqSection from "@/components/rfx/FaqSection";
import { HOME_FAQS } from "@/data/homeFaqs";
import Enquire from "@/components/rfx/Enquire";
import Footer from "@/components/rfx/Footer";
import ChristmasPromo from "@/components/rfx/ChristmasPromo";
import ChristmasHero from "@/components/rfx/ChristmasHero";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  localBusinessSchema,
  removeJsonLd,
  upsertJsonLd,
} from "@/seo/headTags";

/** On while the Christmas campaign runs: video hero, no title section. */
const CHRISTMAS_CAMPAIGN = true;

const Index = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/")!;
    applyMeta(route);

    const ldId = "rfx-jsonld";
    upsertJsonLd(ldId, localBusinessSchema(route.description));
    return () => removeJsonLd(ldId);
  }, []);

  return (
    <div className="min-h-screen page-paper text-foreground nav-paper">
      <Nav />
      <main>
        {/* Christmas season: the video hero takes the top of the page and
            runs straight into the mission line, which stands in as the
            page title (Matt, 2026-11-11). After Christmas, set
            CHRISTMAS_CAMPAIGN to false to bring the title section back. */}
        {CHRISTMAS_CAMPAIGN && <ChristmasHero trust />}
        {!CHRISTMAS_CAMPAIGN && <Hero />}
        <Mission asTitle={CHRISTMAS_CAMPAIGN} />
        <Experiences align="centre" />
        <About />
        <Process tone="cream" />
        <Testimonials noDivider />
        <InstagramFollow />
        <FaqSection faqs={HOME_FAQS} headingId="faq-heading" />
        <Enquire />
      </main>
      <Footer />
      {/* Mock-up: Christmas garlands card, home page only for review. */}
      <ChristmasPromo />
    </div>
  );
};

export default Index;
