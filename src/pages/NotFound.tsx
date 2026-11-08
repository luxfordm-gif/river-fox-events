import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
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
      console.warn("404 - non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main className="flex-1 pb-24 md:pb-32">
        <PageHeader
          title={
            <>
              Looks like this page has{" "}
              <em className="t-accent">wandered off.</em>
            </>
          }
          note="404 - Page not found"
          intro="It may have moved, or perhaps it never existed. Head back home, or send us a note about your event - we reply personally."
        >
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/" className="btn-solid-rf">
              Back to homepage <span>→</span>
            </a>
            <a href="/#enquire" onClick={handleEnquireClick} className="btn-solid-rf accent">
              Start an enquiry <span>→</span>
            </a>
          </div>
        </PageHeader>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
