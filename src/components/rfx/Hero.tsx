import ScrollStrip from "@/components/rfx/ScrollStrip";
import HeroEditorial, { HERO_EDITORIAL_IMAGES } from "@/components/rfx/HeroEditorial";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

const Hero = () => {
  return (
    <section id="top" className="rfx-hero pt-[106px] md:pt-[134px] pb-4 md:pb-6" aria-labelledby="hero-heading">
      <div className="container-rfx">
        {/* Centered editorial intro */}
        <div className="mb-10 md:mb-14 flex flex-col items-center text-center">

          <h1
            id="hero-heading"
            className="font-serif-rf max-w-[14ch] md:max-w-none mx-auto break-words text-pretty"
            style={{
              fontSize: "clamp(56px, 7vw, 120px)",
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: "-0.038em",
            }}
          >
            <span className="word-reveal in">
              <span>Immersive celebrations,</span>
            </span>
            <br />
            <span className="word-reveal in delay-1">
              <span>
                thoughtfully{" "}
                <em className="italic font-normal text-accent-warm">designed.</em>
              </span>
            </span>
          </h1>

          <p className="text-[16.5px] leading-[1.65] text-ink-soft max-w-[520px] mt-1 md:mt-5 fade-up in text-center">
            Luxury event styling in Surrey, specialising in children's
            parties, milestone celebrations and bespoke installations.
          </p>

          <div className="flex items-center justify-center gap-5 flex-wrap mt-10 fade-up in">
            <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
              Enquire <span style={{ fontSize: "1.35em", lineHeight: 1 }}>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile: scroll-driven horizontal slideshow showing the same 3
          images as the desktop editorial fan, in the same order.
          Laptop/desktop: editorial 3-image layout with subtle parallax. */}
      <ScrollStrip images={HERO_EDITORIAL_IMAGES} />
      <HeroEditorial />
    </section>
  );
};

export default Hero;
