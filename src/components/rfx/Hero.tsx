import ScrollStrip from "@/components/rfx/ScrollStrip";
import HeroEditorial, { HERO_EDITORIAL_IMAGES } from "@/components/rfx/HeroEditorial";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

const Hero = () => {
  return (
    <section id="top" className="rfx-hero rfx-hero-home rfx-hero-scale pb-4 md:pb-6" aria-labelledby="hero-heading">
      <div className="container-rfx">
        {/* Centered editorial intro */}
        <div className="rfx-hero-intro mb-10 md:mb-14 flex flex-col items-center text-center">

          <h1
            id="hero-heading"
            className="t-display max-w-none mx-auto break-words text-pretty"
          >
            <span className="word-reveal in">
              <span>Parties&nbsp;and events,</span>
            </span>
            <br />
            <span className="word-reveal in delay-1">
              <span>
                styled in{" "}
                <em className="t-accent">Surrey.</em>
              </span>
            </span>
          </h1>

          <p className="t-lead text-ink-soft max-w-[520px] mt-3 md:mt-4 fade-up in text-center">
            Children's parties, milestone birthdays and brand events, from a
            single balloon arch to the whole room. I design each one, set it up
            before your guests arrive and clear it away after.
          </p>

          <div className="flex items-center justify-center gap-5 flex-wrap mt-10 fade-up in">
            <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
              Reserve your date <span className="t-icon">→</span>
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
