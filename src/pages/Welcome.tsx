import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import Experiences from "@/components/rfx/Experiences";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta } from "@/seo/headTags";

/**
 * Transitional landing page for the rebrand - the destination for any
 * 301 redirects coming from the old Lollipop Balloons URL(s). Marked
 * noindex in routes.ts so it doesn't compete with the homepage in
 * search, but still prerendered so people redirected here see content
 * instantly.
 *
 * Strips the rich animation of the homepage in favour of a calm "we've
 * moved" message + clear paths to the homepage, the rebrand article and
 * the three core services.
 */
const Welcome = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/welcome");
    if (route) applyMeta(route);
  }, []);

  return (
    <div className="min-h-screen article-bg text-foreground nav-solid">
      <Nav />
      <main>
        <PageHeader
          title={
            <>
              Welcome to{" "}
              <em className="t-accent">River Fox Events.</em>
            </>
          }
          note="Formerly Lollipop Balloons"
          intro="A new name, the same hands. Same studio in Surrey. Same level of detail."
        >
          <div className="text-to-action flex flex-col sm:flex-row items-center justify-center actions">
            <a href="/our-work/" className="btn-solid-rf accent">
              Explore our work <span>→</span>
            </a>
            <a
              href="/journal/lollipop-balloons-to-river-fox-events/"
              className="btn-link-rf"
            >
              Read the rebrand story <span className="arr">→</span>
            </a>
          </div>
        </PageHeader>

        <section className="container-rfx section-bottom">
          <div
            className="measure-reading mx-auto article-pad t-lead text-ink text-center paragraphs"
          >
            <p>
              If you've worked with us under the name{" "}
              <strong>Lollipop Balloons</strong>, nothing about how we work
              has changed. Same Horley studio. Same designer (Laura). Same
              approach - tailored, nothing off a shelf, every detail
              considered.
            </p>
            <p>
              The new name reflects the wider work we now do - children's
              parties, milestone celebrations and corporate brand styling -
              without losing the playfulness.
            </p>
            <p>
              Have a look around. We've designed a new home for everything.
            </p>
          </div>
        </section>

        <Experiences sectionId="welcome-services" />

        <section className="container-rfx rfx-section text-center">
          <a href="/" className="btn-solid-rf accent">
            Visit the homepage <span>→</span>
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Welcome;
