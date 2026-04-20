import { useEffect, useRef } from "react";
import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";
import expChildren from "@/assets/exp-children.webp";
import expMilestone from "@/assets/exp-milestone.webp";
import expCorporate from "@/assets/exp-corporate.webp";
import cpCelebrations from "@/assets/cp-celebrations.webp";

// SEO REMINDER: every image in this strip must have descriptive alt text
// that names the styling shown (theme, palette, props) plus the Surrey town
// where relevant. Never empty, never "image"/"photo". Update alt strings
// here whenever the source imagery changes.
const STRIP_IMAGES = [
  { src: hero1, alt: "Pastel children's party tablescape with balloon installation in Cobham Surrey by River Fox Events" },
  { src: expMilestone, alt: "Milestone celebration styling in Surrey by River Fox Events — floral arch and candlelit cake table" },
  { src: hero2, alt: "Editorial tablescape detail with peonies and silk ribbons for a Weybridge celebration by River Fox Events" },
  { src: expChildren, alt: "Immersive children's birthday party styling in Esher Surrey — bespoke signage and themed installation by River Fox Events" },
  { src: hero3, alt: "Vintage cake stand styled with florals for a Surrey children's party by River Fox Events" },
  { src: expCorporate, alt: "Corporate brand event styling in Surrey by River Fox Events — branded backdrop and sculptural florals" },
  { src: cpCelebrations, alt: "Organic balloon arch in blush and sage for a children's party in Oxshott Surrey by River Fox Events" },
];

/**
 * Scroll-driven horizontal image strip.
 *
 * The horizontal translation of the image track is mapped from the section's
 * scroll progress through the viewport. No auto-play, no controls — purely
 * driven by vertical scroll position.
 */
const ScrollStrip = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      rafRef.current = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: 0 when section top hits bottom of viewport,
      // 1 when section bottom leaves top of viewport.
      const total = rect.height + vh;
      const raw = (vh - rect.top) / total;
      const progress = Math.max(0, Math.min(1, raw));

      const trackWidth = track.scrollWidth;
      const containerWidth = section.clientWidth;
      const maxTranslate = Math.max(0, trackWidth - containerWidth);

      const x = reduceMotion ? 0 : -progress * maxTranslate;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!visibleRef.current) return;
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visibleRef.current = e.isIntersecting;
          if (e.isIntersecting) update();
        }
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );
    io.observe(section);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="River Fox Events imagery"
      className="overflow-hidden py-[20px] md:py-[40px]"
      style={{ background: "hsl(var(--linen))" }}
    >
      <div
        ref={trackRef}
        className="flex gap-3 md:gap-4 will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0)",
          height: "var(--strip-h, 260px)",
        }}
      >
        <style>{`
          :root { --strip-h: 260px; --strip-item-w: 68vw; }
          @media (min-width: 768px) {
            :root {
              --strip-h: 520px;
              /* 3.5 images visible with a partial 4th peeking in.
                 Account for 16px (gap-4) gaps between items. */
              --strip-item-w: calc((100vw - (3 * 16px)) / 3.5);
            }
          }
        `}</style>
        {STRIP_IMAGES.map((img, i) => (
          <div
            key={i}
            className="relative flex-none h-full overflow-hidden ph ph-warm"
            style={{ width: "var(--strip-item-w)" }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
              width={1024}
              height={1280}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScrollStrip;
