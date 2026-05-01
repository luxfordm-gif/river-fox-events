import { ReactNode, useEffect, useRef, useState } from "react";
import defaultHeroImg from "@/assets/cp-hero-frame.webp";

type CPHeroProps = {
  image?: string;
  imageAlt?: string;
  lines?: ReactNode[];
  sub?: ReactNode;
  scrollTarget?: string;
  headingId?: string;
  /** Compact (≈50dvh) hero used on child pages — hides the sub copy and
   *  the scroll cue, and uses a tighter h1 size. Signals visually that
   *  this is a sub-page rather than a top-level service page. */
  compact?: boolean;
};

const DEFAULT_LINES: ReactNode[] = [
  <>Magical for children.</>,
  <>
    Effortless for{" "}
    <em
      className="italic font-normal"
      style={{ color: "hsl(var(--accent))" }}
    >
      parents.
    </em>
  </>,
];

const DEFAULT_SUB =
  "Immersive, beautifully designed children's parties across Surrey — every detail considered, nothing left to chance.";

const CPHero = ({
  image = defaultHeroImg,
  imageAlt = "Luxury children's birthday party styling by River Fox Events Surrey — peach balloon installation, peonies and dressed cake table at a Cobham celebration",
  lines = DEFAULT_LINES,
  sub = DEFAULT_SUB,
  scrollTarget = "#cp-celebrations",
  headingId = "cp-hero-heading",
  compact = false,
}: CPHeroProps = {}) => {
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
      style={{
        height: compact ? "50dvh" : "100dvh",
        minHeight: compact ? "320px" : "100vh",
      }}
      aria-labelledby={headingId}
    >
      {/*
        Full-bleed hero image with parallax.
        SEO REMINDER: Every <img> on the site MUST have descriptive alt text
        that names what is shown and includes "River Fox Events" plus the
        relevant service + Surrey location. Never use empty alt, "image",
        or "photo". Above-the-fold images use loading="eager" + fetchpriority="high".
      */}
      <img
        ref={imgRef}
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transform: "translate3d(0, 0, 0) scale(1.28)" }}
        loading="eager"
        fetchPriority="high"
        decoding="async"
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

      {/* Headline — centred horizontally, upper-centre vertically on mobile.
          Compact mode skips the off-centre padding and the sub copy. */}
      <div
        className={
          compact
            ? "relative z-[2] h-full w-full flex items-center justify-center px-6 text-center"
            : "relative z-[2] h-full w-full flex flex-col items-center justify-center md:justify-center px-6 text-center pt-[calc(18vh-12px)] md:pt-0 pb-[calc(22vh+12px)] md:pb-0"
        }
      >
        <h1
          id={headingId}
          className="font-serif-rf mx-auto"
          style={{
            fontSize: compact
              ? "clamp(40px, 5vw, 72px)"
              : "clamp(52px, 6.5vw, 110px)",
            lineHeight: compact ? 1.0 : 0.96,
            fontWeight: 400,
            letterSpacing: "-0.04em",
            color: "hsl(var(--background))",
            textWrap: "balance",
            maxWidth: "16ch",
          }}
        >
          {lines.map((line, i) => (
            <span
              key={i}
              className={`word-reveal in${i > 0 ? ` delay-${i}` : ""}`}
            >
              <span>{line}</span>
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>

        {!compact && (
          <p
            className={`word-reveal in delay-${lines.length} mt-3 md:mt-3 max-w-[44ch] mx-auto text-[17px] md:text-[17px] leading-[1.6]`}
            style={{
              color: "hsl(var(--background) / 0.9)",
              textWrap: "pretty",
            }}
          >
            {sub}
          </p>
        )}
      </div>

      {/* Animated scroll cue (skipped in compact mode — there's no
          "scroll past the hero" gesture for half-height heroes). */}
      {!compact && (
        <a
          href={scrollTarget}
          aria-label="Scroll to next section"
          className={`absolute left-1/2 -translate-x-1/2 bottom-[70px] md:bottom-10 z-[3] flex flex-col items-center gap-3 transition-opacity duration-500 ${
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
      )}
    </section>
  );
};

export default CPHero;
