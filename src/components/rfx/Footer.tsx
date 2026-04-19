import { useEffect, useRef, useState } from "react";
import { useScrollY } from "@/hooks/useRiverFox";

const Footer = () => {
  const y = useScrollY();
  const watermarkRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = watermarkRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRevealed(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="relative overflow-hidden bg-surface-deep text-on-deep">
      <div className="relative pt-24 pb-9 overflow-hidden">
        {/* Big watermark — slow drift, parallax, masked sheen */}
        <div
          ref={watermarkRef}
          aria-hidden="true"
          className="absolute left-0 right-0 -bottom-32 pointer-events-none flex items-end justify-center"
        >
          <div
            className="font-serif-rf whitespace-nowrap relative"
            style={{
              fontSize: "clamp(280px, 50vw, 880px)",
              lineHeight: 0.78,
              letterSpacing: "-0.05em",
              color: "hsl(var(--on-deep) / 0.10)",
              transform: `translateY(${Math.min(80, y * 0.025)}px) translateX(${revealed ? 0 : -40}px)`,
              opacity: revealed ? 1 : 0,
              transition: "opacity 1.6s ease, transform 1.8s cubic-bezier(.2,.7,.2,1)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 18%, rgba(0,0,0,0.55) 38%, #000 60%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 18%, rgba(0,0,0,0.55) 38%, #000 60%)",
            }}
          >
            River&nbsp;
            <em
              className="italic"
              style={{
                color: "hsl(var(--accent-warm) / 0.22)",
              }}
            >
              Fox
            </em>
            {/* Animated sheen sweep */}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(100deg, transparent 35%, hsl(var(--accent-warm) / 0.18) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
                animation: revealed ? "rfx-sheen 6s ease-in-out infinite" : undefined,
                mixBlendMode: "screen",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes rfx-sheen {
            0%   { background-position: 200% 0; }
            55%  { background-position: -100% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>

        <div className="container-rfx relative">
          {/* CTA stripe */}
          <div
            className="pb-16 mb-16 border-b"
            style={{ borderColor: "hsl(var(--on-deep) / 0.15)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end rfx-md-stack">
              <h2
                className="font-serif-rf max-w-[900px]"
                style={{
                  fontSize: "clamp(40px, 5.6vw, 96px)",
                  lineHeight: 1.0,
                  fontWeight: 300,
                  letterSpacing: "-0.028em",
                }}
              >
                Ready to begin?{" "}
                <em className="italic font-light" style={{ color: "hsl(var(--accent-warm))" }}>
                  Let's design your celebration.
                </em>
              </h2>
              <a href="#enquire" className="btn-solid-rf accent self-end">
                Start an enquiry <span>→</span>
              </a>
            </div>
          </div>

          {/* Footer columns */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16 rfx-md-stack">
            <div>
              <div className="text-[22px] font-medium tracking-[0.22em] leading-none">
                RIVER&nbsp;FOX
              </div>
              <div
                className="font-mono-rf text-[10px] tracking-[0.28em] uppercase mt-3"
                style={{ color: "hsl(var(--on-deep-soft))" }}
              >
                events · surrey · est. 2017
              </div>
              <p
                className="text-[13.5px] leading-[1.7] max-w-[360px] mt-7"
                style={{ color: "hsl(var(--on-deep-soft))" }}
              >
                Luxury event styling across Surrey's finest occasions.
              </p>
            </div>
            <div>
              <div className="eyebrow font-semibold mb-4" style={{ color: "hsl(var(--on-deep))" }}>
                Experiences
              </div>
              <div className="text-[13.5px] leading-loose">
                <a href="#experiences" className="opacity-85 hover:opacity-100 block">Children's Parties</a>
                <a href="#experiences" className="opacity-85 hover:opacity-100 block">Milestones</a>
                <a href="#experiences" className="opacity-85 hover:opacity-100 block">Corporate</a>
              </div>
            </div>
            <div>
              <div className="eyebrow font-semibold mb-4" style={{ color: "hsl(var(--on-deep))" }}>
                Studio
              </div>
              <div className="text-[13.5px] leading-loose">
                <a href="#about" className="opacity-85 hover:opacity-100 block">About Laura</a>
                <a href="#process" className="opacity-85 hover:opacity-100 block">How it works</a>
                <a href="#faq" className="opacity-85 hover:opacity-100 block">FAQ</a>
              </div>
            </div>
            <div>
              <div className="eyebrow font-semibold mb-4" style={{ color: "hsl(var(--on-deep))" }}>
                Correspond
              </div>
              <div className="text-[13.5px] leading-loose" style={{ color: "hsl(var(--on-deep-soft))" }}>
                <a href="mailto:hello@riverfoxevents.co.uk" className="hover:opacity-100 opacity-85 block">
                  hello@riverfoxevents.co.uk
                </a>
                <a href="https://instagram.com/riverfoxevents" target="_blank" rel="noreferrer" className="hover:opacity-100 opacity-85 block">
                  @riverfoxevents
                </a>
                <span className="block">Surrey & beyond</span>
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t flex justify-between gap-3 flex-wrap text-[11px] font-mono-rf tracking-[0.08em]"
            style={{ borderColor: "hsl(var(--on-deep) / 0.15)", color: "hsl(var(--on-deep-soft))" }}
          >
            <div>© {new Date().getFullYear()} River Fox Events</div>
            <div>Surrey · Luxury event styling</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
