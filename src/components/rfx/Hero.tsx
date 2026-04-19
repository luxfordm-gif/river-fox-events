import { useEffect, useState } from "react";
import heroMain from "@/assets/hero-1.jpg";
import heroSide from "@/assets/hero-2.jpg";
import heroSmall from "@/assets/hero-3.jpg";
import { useScrollY } from "@/hooks/useRiverFox";

const MOBILE_SLIDES = [
  { src: heroMain, alt: "Beautifully styled children's party tablescape with pastel balloon installation, Surrey garden" },
  { src: heroSide, alt: "Elegant milestone celebration installation with floral arch and candles" },
  { src: heroSmall, alt: "Detail of a styled cake on a vintage cake stand with pastel ribbons and peonies" },
];

const Hero = () => {
  const y = useScrollY();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % MOBILE_SLIDES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <section id="top" className="pt-[96px] md:pt-[124px] pb-12 md:pb-16" aria-labelledby="hero-heading">
      <div className="container-rfx">
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

        {/* Mobile: fading carousel of 3 images. Tablet/Desktop: 3-image editorial strip with parallax */}
        <div className="md:hidden -mx-5">
          <div className="ph ph-warm overflow-hidden relative" style={{ aspectRatio: "4/5" }}>
            {MOBILE_SLIDES.map((s, i) => (
              <img
                key={i}
                src={s.src}
                alt={s.alt}
                className="absolute inset-0 w-full h-full object-cover z-[2] transition-opacity duration-[1400ms] ease-in-out"
                style={{ opacity: slide === i ? 1 : 0 }}
                width={1024}
                height={1280}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
            {/* slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
              {MOBILE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className="h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: slide === i ? 28 : 14,
                    background: slide === i ? "hsl(var(--background))" : "hsl(var(--background) / 0.5)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[1fr_1.35fr_0.9fr] gap-4 md:gap-5 items-start">
          <div
            className="relative md:pt-16"
            style={{
              transform: `translateY(${y * -0.05}px)`,
              willChange: "transform",
            }}
          >
            <div className="ph ph-warm overflow-hidden rounded-sm" style={{ aspectRatio: "4/5" }}>
              <img
                src={heroMain}
                alt="Beautifully styled children's party tablescape with pastel balloon installation, Surrey garden"
                className="absolute inset-0 w-full h-full object-cover z-[2]"
                width={1024}
                height={1280}
              />
            </div>
          </div>
          <div
            className="relative md:pt-10"
            style={{
              transform: `translateY(${y * -0.05}px)`,
              willChange: "transform",
            }}
          >
            <div className="ph overflow-hidden rounded-sm" style={{ aspectRatio: "3/4" }}>
              <img
                src={heroSide}
                alt="Elegant milestone celebration installation with floral arch and candles"
                className="absolute inset-0 w-full h-full object-cover z-[2]"
                loading="lazy"
                width={1024}
                height={1408}
              />
            </div>
          </div>
          <div
            className="relative md:pt-24"
            style={{
              transform: `translateY(${y * -0.05}px)`,
              willChange: "transform",
            }}
          >
            <div className="ph ph-blush overflow-hidden rounded-sm" style={{ aspectRatio: "4/5" }}>
              <img
                src={heroSmall}
                alt="Detail of a styled cake on a vintage cake stand with pastel ribbons and peonies"
                className="absolute inset-0 w-full h-full object-cover z-[2]"
                loading="lazy"
                width={1024}
                height={1280}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
