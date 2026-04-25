import ScrollStrip from "@/components/rfx/ScrollStrip";
import HeroEditorial from "@/components/rfx/HeroEditorial";
import leafShadow from "@/assets/hero-leaf-shadow.png";

const Hero = () => {
  return (
    <section id="top" className="rfx-hero pt-[96px] md:pt-[124px] pb-4 md:pb-6 relative overflow-hidden" aria-labelledby="hero-heading">
      <div
        aria-hidden
        className="rfx-hero-leaf"
        style={{ backgroundImage: `url(${leafShadow})` }}
      />
      <div className="container-rfx relative z-[1]">
        {/* Centered editorial intro */}
        <div className="mb-10 md:mb-14 flex flex-col items-center text-center">

          <h1
            id="hero-heading"
            className="font-serif-rf max-w-[14ch] md:max-w-none mx-auto break-words text-pretty"
            style={{
              fontSize: "clamp(60px, 10vw, 132px)",
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

          <p className="text-[16.5px] leading-[1.65] text-ink-soft max-w-[520px] mt-6 md:mt-10 fade-up in text-center">
            Children's parties, milestone moments and corporate events
            across Surrey — created around your vision, delivered with calm.
          </p>

          <div className="flex items-center justify-center gap-5 flex-wrap mt-10 fade-up in">
            <a href="#enquire" className="btn-solid-rf accent">
              Start planning <span>→</span>
            </a>
            <a href="#experiences" className="btn-link-rf">
              See our work <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile: scroll-driven horizontal slideshow. Laptop/desktop: editorial 3-image layout with subtle parallax. */}
      <ScrollStrip />
      <HeroEditorial />
    </section>
  );
};

export default Hero;
