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

const Index = () => {
  useFadeUp();
  useNavScroll();

  // SEO + structured data
  useEffect(() => {
    document.title = "Children's Party Stylist Surrey | River Fox Events";

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc =
      "Bespoke children's party styling, milestone celebrations and corporate events across Surrey. River Fox Events — immersive, considered design from £460. Based in Surrey, serving Cobham, Weybridge, Esher, Oxshott and beyond.";
    setMeta("description", desc);
    setMeta("og:title", "Children's Party Stylist Surrey | River Fox Events", "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", "website", "property");

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + window.location.pathname;

    // JSON-LD: LocalBusiness
    const ldId = "rfx-jsonld";
    let script = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = ldId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "River Fox Events",
      description: desc,
      url: window.location.origin,
      email: "hello@riverfoxevents.co.uk",
      areaServed: ["Surrey", "Cobham", "Weybridge", "Esher", "Oxshott", "London"],
      address: {
        "@type": "PostalAddress",
        addressRegion: "Surrey",
        addressCountry: "GB",
      },
      priceRange: "££",
      sameAs: ["https://instagram.com/riverfoxevents"],
    });
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
