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
      className="relative w-screen overflow-hidden -mt-px"
      style={{ height: "100dvh", minHeight: "100vh" }}
      aria-labelledby="cp-hero-heading"
    >
      {/* Full-bleed image */}
      <img
        src={heroImg}
        alt="Beautifully styled outdoor children's birthday celebration in Surrey with peach balloon installation, peonies and a dressed cake table"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />

      {/* Overlay — darker top for nav legibility, deep bottom for headline */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--ink) / 0.55) 0%, hsl(var(--ink) / 0.18) 28%, hsl(var(--ink) / 0.18) 50%, hsl(var(--ink) / 0.55) 78%, hsl(var(--ink) / 0.85) 100%)",
        }}
      />

      {/* Headline — lower half */}
      <div className="relative z-[2] h-full w-full flex flex-col items-center justify-end pb-[18vh] md:pb-[14vh] px-6">
        <h1
          id="cp-hero-heading"
          className="font-serif-rf text-center mx-auto"
          style={{
            fontSize: "clamp(64px, 10vw, 148px)",
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
      </div>

      {/* Animated scroll cue — larger, centred */}
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
