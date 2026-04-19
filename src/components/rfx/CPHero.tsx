import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/cp-hero-frame.jpg";

const CPHero = () => {
  const [scrolled, setScrolled] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (reduceMotion) return;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight || 1;
        // Progress 0 → 1 as the user scrolls one viewport height
        const p = Math.min(1, Math.max(0, y / vh));
        if (imgRef.current) {
          // Zoom out from 1.28 → 1.05 while parallaxing upward.
          const scale = 1.28 - p * 0.23;
          const translate = y * 0.35;
          imgRef.current.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
        }
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      className="relative w-screen overflow-hidden -mt-px"
      style={{ height: "100dvh", minHeight: "100vh" }}
      aria-labelledby="cp-hero-heading"
    >
      {/* Full-bleed image with parallax */}
      <img
        ref={imgRef}
        src={heroImg}
        alt="Beautifully styled outdoor children's birthday celebration in Surrey with peach balloon installation, peonies and a dressed cake table"
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1.15)" }}
        width={1920}
        height={1080}
      />

      {/* Overlay — even, slightly darker for centred copy legibility */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--ink) / 0.30) 0%, hsl(var(--ink) / 0.42) 50%, hsl(var(--ink) / 0.55) 100%)",
        }}
      />

      {/* Headline — dead centre */}
      <div className="relative z-[2] h-full w-full flex flex-col items-center justify-center px-6 text-center">
        <h1
          id="cp-hero-heading"
          className="font-serif-rf mx-auto"
          style={{
            fontSize: "clamp(56px, 9vw, 132px)",
            lineHeight: 0.96,
            fontWeight: 400,
            letterSpacing: "-0.04em",
            color: "hsl(var(--background))",
            textWrap: "balance",
            maxWidth: "16ch",
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
          className="word-reveal in delay-2 mt-2 md:mt-3 max-w-[44ch] mx-auto text-[15px] md:text-[17px] leading-[1.6]"
          style={{
            color: "hsl(var(--background) / 0.9)",
            textWrap: "pretty",
          }}
        >
          Immersive, beautifully designed children's parties across Surrey —
          every detail considered, nothing left to chance.
        </p>
      </div>

      {/* Animated scroll cue */}
      <a
        href="#cp-celebrations"
        aria-label="Scroll to next section"
        className={`absolute left-1/2 -translate-x-1/2 bottom-8 z-[3] flex flex-col items-center gap-3 transition-opacity duration-500 ${
          scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ color: "hsl(var(--background) / 0.95)" }}
      >
        <span
          className="font-mono-rf text-[10.5px] tracking-[0.32em] uppercase"
          style={{ color: "hsl(var(--background) / 0.85)" }}
        >
          Scroll
        </span>
        <span className="rfx-scroll-cue" aria-hidden="true">
          <svg
            width="22"
            height="34"
            viewBox="0 0 22 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 13 L11 22 L20 13"
              stroke="currentColor"
              strokeWidth="1.4"
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
