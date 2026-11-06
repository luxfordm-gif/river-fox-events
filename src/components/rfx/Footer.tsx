import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Instagram } from "lucide-react";
import { useScrollY } from "@/hooks/useRiverFox";
import { LOCATIONS } from "@/data/locations";

const FOOTER_LOCATIONS_VISIBLE = 5;

const Footer = () => {
  const y = useScrollY();
  const watermarkRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const visibleLocations = showAllLocations
    ? LOCATIONS
    : LOCATIONS.slice(0, FOOTER_LOCATIONS_VISIBLE);
  const hasMoreLocations = LOCATIONS.length > FOOTER_LOCATIONS_VISIBLE;

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
      <div className="rfx-footer-inner relative pt-[54px] md:pt-24 overflow-hidden">
        {/* Big watermark - slow drift, parallax, masked sheen. The fade-in
            mask sits on a layer the size of the footer, so it always starts
            from clear at the footer's top edge. (On the text itself it was
            sized to the letters, which on wide screens are taller than the
            footer: the tall italic F was already solid where the footer
            edge sliced it.) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0.55) 45%, #000 70%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0.55) 45%, #000 70%)",
          }}
        >
        <div
          ref={watermarkRef}
          className="rfx-footer-mark-wrap absolute left-0 right-0 flex items-end justify-center"
        >
          {/* Phones: sized so the whole "River Fox" fits the width and sits
              on the footer's bottom edge, no parallax push. md+: the large
              cropped watermark. Sizes live in index.css (.rfx-footer-mark). */}
          <div
            className="rfx-footer-mark font-serif-rf whitespace-nowrap relative"
            style={{
              lineHeight: 0.78,
              letterSpacing: "-0.05em",
              color: "hsl(var(--on-deep) / 0.10)",
              transform: `translateY(calc(var(--rfx-mark-parallax) * ${Math.min(80, y * 0.025)}px)) translateX(${revealed ? 0 : -40}px)`,
              opacity: revealed ? 1 : 0,
              transition: "opacity 1.6s ease, transform 1.8s cubic-bezier(.2,.7,.2,1)",
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
            {/* Animated sheen sweep, clipped to the letters so it never
                shows as a box behind them. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(100deg, transparent 35%, hsl(var(--accent-warm) / 0.18) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: revealed ? "rfx-sheen 6s ease-in-out infinite" : undefined,
                mixBlendMode: "screen",
              }}
            >
              River&nbsp;<em className="italic">Fox</em>
            </span>
          </div>
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
          {/* Mobile-only divider so the footer reads as a clear section break. */}
          <div
            className="md:hidden mb-12"
            style={{ borderTop: "1px solid hsl(var(--on-deep) / 0.18)" }}
            aria-hidden="true"
          />

          {/* Footer columns */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 mb-16 rfx-md-stack">
            <div className="mb-8 md:mb-0">
              <div className="text-[22px] font-medium tracking-[0.22em] leading-none whitespace-nowrap">
                RIVER&nbsp;FOX&nbsp;EVENTS
              </div>
              <p
                className="text-[13.5px] leading-[1.7] max-w-[360px] mt-7"
                style={{ color: "hsl(var(--on-deep-soft))" }}
              >
                Luxury event styling across Surrey. Formerly known as Lollipop Balloons.
              </p>
            </div>
            <div>
              <div className="eyebrow font-semibold mb-4" style={{ color: "hsl(var(--on-deep))" }}>
                Services
              </div>
              <div className="text-[13.5px] leading-loose">
                <a href="/childrens-parties/" className="opacity-85 hover:opacity-100 block">Children's Parties</a>
                <a href="/milestone-celebrations/" className="opacity-85 hover:opacity-100 block">Milestones</a>
                <a href="/corporate-brand-styling/" className="opacity-85 hover:opacity-100 block">Corporate</a>
                <a href="/balloon-installations/" className="opacity-85 hover:opacity-100 block">Balloon Installations</a>
                <a href="/christmas-door-garlands/" className="opacity-85 hover:opacity-100 block">Christmas Garlands</a>
              </div>
            </div>
            <div>
              <div className="eyebrow font-semibold mb-4" style={{ color: "hsl(var(--on-deep))" }}>
                Locations
              </div>
              <div className="text-[13.5px] leading-loose">
                {visibleLocations.map((loc) => (
                  <a
                    key={loc.slug}
                    href={`/party-styling-${loc.slug}/`}
                    className="opacity-85 hover:opacity-100 block"
                  >
                    {loc.cityName}
                  </a>
                ))}
                {hasMoreLocations && (
                  <button
                    type="button"
                    onClick={() => setShowAllLocations((s) => !s)}
                    aria-expanded={showAllLocations}
                    className="mt-2 inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer text-[13.5px] opacity-70 hover:opacity-100 text-inherit"
                  >
                    {showAllLocations ? "Show less" : "Show more"}
                    <ChevronDown
                      size={12}
                      strokeWidth={1.25}
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${
                        showAllLocations ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="eyebrow font-semibold mb-4" style={{ color: "hsl(var(--on-deep))" }}>
                Studio
              </div>
              <div className="text-[13.5px] leading-loose">
                <a href="/our-work/" className="opacity-85 hover:opacity-100 block">Our Work</a>
                <a href="/#about" className="opacity-85 hover:opacity-100 block">About Laura</a>
                <a href="/#process" className="opacity-85 hover:opacity-100 block">How it works</a>
                <a href="/#faq" className="opacity-85 hover:opacity-100 block">FAQ</a>
                <a href="/journal/" className="opacity-85 hover:opacity-100 block">Journal</a>
              </div>
            </div>
            <div>
              <a
                href="/contact/"
                className="eyebrow font-semibold mb-4 inline-flex items-center gap-1 no-underline hover:underline underline-offset-4 decoration-[hsl(var(--on-deep))]/50"
                style={{ color: "hsl(var(--on-deep))" }}
              >
                Contact
                <ChevronRight
                  size={11}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="opacity-75 -mt-px"
                />
              </a>
              <div className="text-[13.5px] leading-loose" style={{ color: "hsl(var(--on-deep-soft))" }}>
                <a href="mailto:Riverfoxevents@gmail.com" className="hover:opacity-100 opacity-85 block">
                  Riverfoxevents@gmail.com
                </a>
                <a
                  href="https://wa.me/447872114191?text=Hi%20Laura%2C%20I%27m%20enquiring%20about%20River%20Fox%20Events"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Message Laura on WhatsApp"
                  className="hover:opacity-100 opacity-85 block"
                >
                  WhatsApp Laura
                </a>
                <a href="tel:+447872114191" className="hover:opacity-100 opacity-85 block">
                  07872 114191
                </a>
                <a href="https://www.instagram.com/riverfox_events/" target="_blank" rel="noreferrer" className="hover:opacity-100 opacity-85 block">
                  @riverfox_events
                </a>
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t grid grid-cols-3 items-center gap-3 text-[11px] font-mono-rf tracking-[0.08em]"
            style={{ borderColor: "hsl(var(--on-deep) / 0.15)", color: "hsl(var(--on-deep-soft))" }}
          >
            <div className="text-left">© {new Date().getFullYear()} River Fox Events</div>
            <div className="flex justify-center">
              <a
                href="https://www.instagram.com/riverfox_events/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram - @riverfox_events"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border transition-opacity hover:opacity-100 opacity-85"
                style={{ borderColor: "hsl(var(--on-deep) / 0.25)", color: "hsl(var(--on-deep))" }}
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <div className="text-right">
              <a href="/privacy/" className="opacity-85 hover:opacity-100">
                Privacy &amp; cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
