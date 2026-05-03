import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import { useNavScroll } from "@/hooks/useRiverFox";
import { handleEnquireClick } from "@/lib/enquire";

const NotFound = () => {
  const location = useLocation();
  useNavScroll();

  useEffect(() => {
    document.title = "Page not found | River Fox Events";

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    // Critical: tell Google not to index 404 routes.
    setMeta("robots", "noindex, follow");
    setMeta("description", "The page you're looking for doesn't exist.");

    if (process.env.NODE_ENV !== "production") {
      console.warn("404 — non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-32 md:py-40">
        <div className="text-center max-w-[640px] mx-auto">
          <div
            className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-5"
            style={{ fontWeight: 600 }}
          >
            404 — Page not found
          </div>
          <h1
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 4.5vw, 80px)",
              lineHeight: 1.0,
              fontWeight: 300,
              letterSpacing: "-0.028em",
              textWrap: "balance",
            }}
          >
            Looks like this page has{" "}
            <em className="italic font-light text-accent-warm">wandered off.</em>
          </h1>
          <p
            className="text-[16px] md:text-[17px] leading-[1.65] text-ink-soft mt-7 max-w-[520px] mx-auto"
            style={{ textWrap: "pretty" }}
          >
            It may have moved, or perhaps it never existed. Head back home, or
            send us a note about your event — we reply personally.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/" className="btn-solid-rf">
              Back to homepage <span>→</span>
            </a>
            <a href="/#enquire" onClick={handleEnquireClick} className="btn-solid-rf accent">
              Start an enquiry <span>→</span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
