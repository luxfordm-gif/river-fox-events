import { useEffect, useState } from "react";
import heroImg from "@/assets/cp-hero-frame.jpg";

const CPHero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative w-full bg-background overflow-hidden pt-[110px] md:pt-[120px]"
      aria-labelledby="cp-hero-heading"
    >
      <div className="container-rfx relative">
        {/* Top-left framed copy */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 relative z-[3]">
          <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col">
            <div
              className="font-mono-rf text-[10.5px] tracking-[0.3em] uppercase text-ink-soft mb-5 fade-up in"
              style={{ fontWeight: 600 }}
            >
              Children's Party Styling · Surrey
            </div>
            <h1
              id="cp-hero-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(38px, 4.6vw, 64px)",
                lineHeight: 0.98,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                textWrap: "balance",
                color: "hsl(var(--ink))",
              }}
            >
              <span className="word-reveal in">
                <span>Magical for children.</span>
              </span>
              <br />
              <span className="word-reveal in delay-1">
                <span>
                  Effortless for{" "}
                  <em
                    className="italic font-normal text-accent-warm"
                  >
                    parents.
                  </em>
                </span>
              </span>
            </h1>

            <p
              className="text-[15.5px] leading-[1.65] mt-6 fade-up in text-ink-soft max-w-[420px]"
              style={{ textWrap: "pretty" }}
            >
              Immersive, beautifully designed children's parties across Surrey —
              every detail considered, nothing left to chance.
            </p>

            <div className="flex items-center gap-5 flex-wrap mt-8 fade-up in">
              <a href="#enquire" className="btn-solid-rf accent">
                Start planning <span>→</span>
              </a>
              <a href="#how-it-works" className="btn-link-rf">
                See how it works <span className="arr">↓</span>
              </a>
            </div>
          </div>

          {/* Image — central / right */}
          <div className="col-span-12 md:col-span-7 lg:col-span-8 relative">
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                aspectRatio: "5/4",
                boxShadow:
                  "0 30px 80px -30px hsl(var(--ink) / 0.35), 0 10px 30px -15px hsl(var(--ink) / 0.18)",
              }}
            >
              <img
                src={heroImg}
                alt="Joyful child laughing at a beautifully styled outdoor birthday party in Surrey, with peach balloon installation and a floral cake table"
                className="absolute inset-0 w-full h-full object-cover"
                width={1920}
                height={1080}
              />
            </div>
          </div>
        </div>

        {/* Oversized wordmark — Luffu-style framing under the image */}
        <div
          className="relative -mt-[6vw] md:-mt-[7vw] pointer-events-none select-none fade-up in"
          aria-hidden="true"
        >
          <div
            className="font-serif-rf leading-[0.85] text-ink"
            style={{
              fontSize: "clamp(110px, 19vw, 320px)",
              fontWeight: 300,
              letterSpacing: "-0.05em",
              fontStyle: "italic",
            }}
          >
            River Fox
          </div>
        </div>
      </div>

      {/* Animated scroll cue */}
      <a
        href="#cp-celebrations"
        aria-label="Scroll to next section"
        className={`absolute right-6 md:right-12 bottom-8 z-[3] flex flex-col items-center gap-2 transition-opacity duration-500 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ color: "hsl(var(--ink) / 0.7)" }}
      >
        <span
          className="font-mono-rf text-[9.5px] tracking-[0.3em] uppercase"
          style={{ color: "hsl(var(--ink-soft))" }}
        >
          Scroll
        </span>
        <span className="rfx-scroll-cue" aria-hidden="true">
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8 L7 14 L13 8"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </section>
  );
};

export default CPHero;
