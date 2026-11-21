import { useEffect, useRef, useState } from "react";
import { ChevronRight, Facebook, Instagram } from "lucide-react";
import { useScrollY } from "@/hooks/useRiverFox";
import { whatsappHref } from "@/lib/whatsapp";

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
      <div className="rfx-footer-inner footer-top relative overflow-hidden">
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
            className="rfx-footer-mark whitespace-nowrap relative text-on-deep/10"
            style={{
              transform: `translateY(calc(var(--rfx-mark-parallax) * ${Math.min(80, y * 0.025)}px)) translateX(${revealed ? 0 : -40}px)`,
              opacity: revealed ? 1 : 0,
              transition: "opacity var(--motion-drift) ease, transform var(--motion-drift) var(--ease-soft)",
            }}
          >
            River&nbsp;
            <em className="italic text-accent-warm/[0.22]">
              Fox
            </em>
            {/* Animated sheen sweep, clipped to the letters so it never
                shows as a box behind them. */}
            <span
              aria-hidden="true"
              className="rfx-footer-sheen absolute inset-0 pointer-events-none"
              style={{ animation: revealed ? "rfx-sheen 6s ease-in-out infinite" : undefined }}
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
            className="md:hidden footer-divider"
            style={{ borderTop: "1px solid hsl(var(--text-on-dark) / 0.18)" }}
            aria-hidden="true"
          />

          {/* Footer columns */}
          <div className="grid grid-cols-1 md:grid-cols-[repeat(4,auto)] xl:grid-cols-[repeat(5,auto)] md:justify-between cards-gap footer-grid rfx-md-stack">
            <div className="footer-brand md:col-span-4 xl:col-span-1">
              <div className="t-wordmark-lg whitespace-nowrap">
                RIVER&nbsp;FOX&nbsp;EVENTS
              </div>
              <p
                className="t-meta measure-card heading-to-text text-ink-faint"
              >
                Luxury event styling across Surrey. Formerly known as Lollipop Balloons.
              </p>
            </div>
            <div>
              <div className="t-overline footer-title text-on-deep">
                Services
              </div>
              <div className="t-meta link-list">
                <a href="/childrens-parties/" className="opacity-85 hover:opacity-100 block">Children's party styling</a>
                <a href="/milestone-celebrations/" className="opacity-85 hover:opacity-100 block">Milestone celebration styling</a>
                <a href="/corporate-brand-styling/" className="opacity-85 hover:opacity-100 block">Corporate event styling</a>
                <a href="/balloon-installations/" className="opacity-85 hover:opacity-100 block">Balloon decorations</a>
                <a href="/christmas-door-garlands/" className="opacity-85 hover:opacity-100 block">Christmas door garlands</a>
                <a href="/commercial-christmas-decorations/" className="opacity-85 hover:opacity-100 block">Christmas for businesses</a>
              </div>
            </div>
            <div>
              <div className="t-overline footer-title text-on-deep">
                The studio
              </div>
              <div className="t-meta link-list">
                <a href="/our-work/" className="opacity-85 hover:opacity-100 block">Our work</a>
                <a href="/#about" className="opacity-85 hover:opacity-100 block">About Laura</a>
                <a href="/#process" className="opacity-85 hover:opacity-100 block">How it works</a>
                <a href="/#faq" className="opacity-85 hover:opacity-100 block">FAQ</a>
                <a href="/journal/" className="opacity-85 hover:opacity-100 block">Journal</a>
              </div>
            </div>
            {/* Same order on every screen: Services, The studio, Areas I cover, Contact. */}
            <div>
              <a
                href="/areas-we-cover/"
                className="t-overline footer-title flex w-fit items-center icon-gap no-underline hover:underline underline-offset-4 decoration-on-deep/50 text-on-deep"
              >
                Areas I cover
                <ChevronRight
                  size={11}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="opacity-75 -mt-px"
                />
              </a>
              <div className="t-meta link-list text-ink-faint">
                <p className="measure-card">
                  Surrey and London, plus Sussex and west Kent.
                </p>
                <a href="/areas-we-cover/" className="opacity-85 hover:opacity-100 block">
                  See every town
                </a>
              </div>
            </div>
            <div>
              <a
                href="/contact/"
                className="t-overline footer-title flex w-fit items-center icon-gap no-underline hover:underline underline-offset-4 decoration-on-deep/50 text-on-deep"
              >
                Contact
                <ChevronRight
                  size={11}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="opacity-75 -mt-px"
                />
              </a>
              <div className="t-meta link-list text-ink-faint">
                <a href="mailto:Riverfoxevents@gmail.com" className="hover:opacity-100 opacity-85 block">
                  Riverfoxevents@gmail.com
                </a>
                <a
                  href={whatsappHref("Hi Laura, I'm enquiring about River Fox Events")}
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
                <a href="https://www.facebook.com/riverfoxeventssurrey" target="_blank" rel="noreferrer" className="hover:opacity-100 opacity-85 block">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div
            className="t-meta footer-bar border-t grid items-center border-on-deep/15 text-ink-faint"
          >
            <div className="text-left">© {new Date().getFullYear()} River Fox Events</div>
            <div className="footer-bar-social flex actions">
              <a
                href="https://www.instagram.com/riverfox_events/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram - @riverfox_events"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border transition-opacity hover:opacity-100 opacity-85 border-on-deep/25 text-on-deep"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/riverfoxeventssurrey"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook - River Fox Events"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border transition-opacity hover:opacity-100 opacity-85 border-on-deep/25 text-on-deep"
              >
                <Facebook className="w-4 h-4" />
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
