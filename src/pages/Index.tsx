import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Hero from "@/components/rfx/Hero";
import InstagramFollow from "@/components/rfx/InstagramFollow";
import Experiences from "@/components/rfx/Experiences";
import RevealWord from "@/components/rfx/RevealWord";
import About from "@/components/rfx/About";
import Process from "@/components/rfx/Process";
import Testimonials from "@/components/rfx/Testimonials";
import FAQ from "@/components/rfx/FAQ";
import Enquire from "@/components/rfx/Enquire";
import Footer from "@/components/rfx/Footer";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  localBusinessSchema,
  removeJsonLd,
  upsertJsonLd,
} from "@/seo/headTags";

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
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Experiences />
        <About />
        <RevealWord lines={["Calm to plan, <em>unforgettable</em> on the day."]} />
        <Process />
        <Testimonials />
        <InstagramFollow />
        <FAQ />
        <Enquire />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
