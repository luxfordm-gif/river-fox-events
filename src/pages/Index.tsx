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
    const title = "Luxury Event Styling Surrey | Children's Parties, Milestones & Brand | River Fox Events";
    document.title = title;

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
      "Bespoke event styling across Surrey — children's parties, milestone celebrations and corporate brand installations. Personally designed and delivered by Laura. From £600.";
    const ogImage = window.location.origin + "/social-share.jpg";
    setMeta("description", desc);
    setMeta("og:title", title, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:url", window.location.origin + "/", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", ogImage);

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
      image: ogImage,
      email: "Riverfoxevents@gmail.com",
      telephone: "+44 7872 114191",
      areaServed: ["Surrey", "London", "Cobham", "Weybridge", "Esher", "Oxshott", "Reigate", "Horley"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "15 Apsley Rd",
        addressLocality: "Horley",
        postalCode: "RH6 9RX",
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
