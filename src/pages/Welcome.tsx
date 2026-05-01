import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Experiences from "@/components/rfx/Experiences";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta } from "@/seo/headTags";

/**
 * Transitional landing page for the rebrand — the destination for any
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
        <section className="container-rfx pt-28 md:pt-36 pb-12 md:pb-16 text-center">
          <div
            className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-7"
            style={{ fontWeight: 600 }}
          >
            Formerly Lollipop Balloons
          </div>

          <h1
            className="font-serif-rf max-w-[18ch] mx-auto"
            style={{
              fontSize: "clamp(40px, 5.5vw, 84px)",
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: "-0.028em",
              textWrap: "balance",
            }}
          >
            Welcome to{" "}
            <em className="italic font-light text-accent-warm">
              River Fox Events.
            </em>
          </h1>

          <p
            className="mt-7 max-w-[44ch] mx-auto text-[18px] md:text-[20px] leading-[1.5] text-ink-soft font-serif-rf font-light italic"
            style={{ textWrap: "pretty" }}
          >
            A new name, the same hands. Same studio in Surrey. Same level of
            detail.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a href="/" className="btn-solid-rf accent">
              Explore our work <span>→</span>
            </a>
            <a
              href="/journal/lollipop-balloons-to-river-fox-events/"
              className="btn-link-rf"
              style={{ fontWeight: 600 }}
            >
              Read the rebrand story <span className="arr">→</span>
            </a>
          </div>
        </section>

        <section className="container-rfx pb-12 md:pb-16">
          <div
            className="max-w-[680px] mx-auto px-6 font-serif-rf text-ink text-center space-y-6"
            style={{ fontSize: "18px", lineHeight: 1.7 }}
          >
            <p>
              If you've worked with us under the name{" "}
              <strong>Lollipop Balloons</strong>, nothing about how we work
              has changed. Same Horley studio. Same designer (Laura). Same
              approach — bespoke, nothing off a shelf, every detail
              considered.
            </p>
            <p>
              The new name reflects the wider work we now do — children's
              parties, milestone celebrations and corporate brand styling —
              without losing the playfulness.
            </p>
            <p>
              Have a look around. We've designed a new home for everything.
            </p>
          </div>
        </section>

        <Experiences
          sectionId="welcome-services"
          heading={
            <>
              Our three{" "}
              <em className="italic font-light text-accent-warm">services.</em>
            </>
          }
          intro="Children's parties, milestone celebrations and corporate event styling — all designed and delivered personally by Laura across Surrey."
        />

        <section className="container-rfx py-16 md:py-20 text-center">
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
