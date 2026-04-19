import { useEffect, useState } from "react";
import heroImg from "@/assets/cp-celebrations.jpg";

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
      className="relative w-full h-screen min-h-[640px] overflow-hidden"
      aria-labelledby="cp-hero-heading"
    >
      {/* Full-bleed image */}
      <img
        src={heroImg}
        alt="Beautifully styled children's birthday celebration with pastel balloon arch, peonies and a dressed cake table in Surrey"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Readability gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--ink) / 0.42) 0%, hsl(var(--ink) / 0.18) 38%, hsl(var(--ink) / 0.22) 62%, hsl(var(--ink) / 0.62) 100%)",
        }}
      />

      {/* Centered content */}
      <div className="relative z-[2] h-full w-full flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-[1100px] mx-auto">
          <div
            className="font-mono-rf text-[10.5px] tracking-[0.3em] uppercase mb-7 fade-up in"
            style={{ color: "hsl(var(--background) / 0.85)" }}
          >
            Children's Party Styling · Surrey
          </div>

          <h1
            id="cp-hero-heading"
            className="font-serif-rf mx-auto"
            style={{
              fontSize: "clamp(54px, 8.4vw, 116px)",
              lineHeight: 0.98,
              fontWeight: 400,
              letterSpacing: "-0.038em",
              color: "hsl(var(--background))",
              textWrap: "balance",
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
                  className="italic font-normal"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  parents.
                </em>
              </span>
            </span>
          </h1>

          <p
            className="text-[16.5px] leading-[1.65] max-w-[560px] mt-7 md:mt-9 fade-up in"
            style={{
              color: "hsl(var(--background) / 0.88)",
              textWrap: "balance",
            }}
          >
            Immersive, beautifully designed children's parties across Surrey —
            every detail considered, nothing left to chance.
          </p>

          <div className="flex items-center justify-center gap-5 flex-wrap mt-9 fade-up in">
            <a href="#enquire" className="btn-solid-rf accent">
              Start planning <span>→</span>
            </a>
            <a
              href="#how-it-works"
              className="btn-link-rf"
              style={{ color: "hsl(var(--background))" }}
            >
              See how it works <span className="arr">↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Animated scroll cue */}
      <a
        href="#cp-celebrations"
        aria-label="Scroll to next section"
        className={`absolute left-1/2 -translate-x-1/2 bottom-8 z-[3] flex flex-col items-center gap-2 transition-opacity duration-500 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ color: "hsl(var(--background) / 0.9)" }}
      >
        <span
          className="font-mono-rf text-[9.5px] tracking-[0.3em] uppercase"
          style={{ color: "hsl(var(--background) / 0.75)" }}
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
