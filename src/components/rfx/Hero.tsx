import heroMain from "@/assets/hero-1.jpg";
import heroSide from "@/assets/hero-2.jpg";
import heroSmall from "@/assets/hero-3.jpg";
import { useScrollY } from "@/hooks/useRiverFox";

const Hero = () => {
  const y = useScrollY();
  return (
    <section id="top" className="pt-[152px] pb-24 md:pb-32" aria-labelledby="hero-heading">
      <div className="container-rfx">
        <div className="mb-16 md:mb-20">
          <h1
            id="hero-heading"
            className="font-serif-rf text-left max-w-[18ch]"
            style={{
              fontSize: "clamp(48px, 9vw, 152px)",
              lineHeight: 0.92,
              fontWeight: 300,
              letterSpacing: "-0.035em",
            }}
          >
            <span className="word-reveal in">
              <span>Immersive&nbsp;celebrations,</span>
            </span>
            <br />
            <span className="word-reveal in delay-1">
              <span>
                thoughtfully{" "}
                <em className="italic font-light text-accent-warm">designed.</em>
              </span>
            </span>
          </h1>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12 md:mt-14 items-end fade-up"
          >
            <p className="text-[16.5px] leading-[1.6] text-ink-soft max-w-[480px]">
              Children's parties, milestone moments and corporate events
              across Surrey — created around your vision, delivered with calm.
            </p>
            <div className="flex md:justify-end items-center gap-5 flex-wrap">
              <a href="#enquire" className="btn-solid-rf accent">
                Start planning <span>→</span>
              </a>
              <a href="#experiences" className="btn-link-rf">
                See our work <span className="arr">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3-image editorial strip */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.35fr_0.9fr] gap-4 md:gap-5">
          <div
            className="relative md:pt-16"
            style={{ transform: `translateY(${y * 0.04}px)` }}
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
            className="relative"
            style={{ transform: `translateY(${y * -0.055}px)` }}
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
            className="relative md:pt-32"
            style={{ transform: `translateY(${y * 0.025}px)` }}
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
