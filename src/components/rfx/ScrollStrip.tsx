import { useEffect, useRef } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import expChildren from "@/assets/exp-children.jpg";
import expMilestone from "@/assets/exp-milestone.jpg";

const STRIP_IMAGES = [
  { src: hero1, alt: "Styled children's party tablescape with pastel balloons" },
  { src: expMilestone, alt: "Milestone celebration with floral arch and candles" },
  { src: hero2, alt: "Elegant tablescape detail with peonies and ribbons" },
  { src: expChildren, alt: "Children's party styling with bespoke signage" },
  { src: hero3, alt: "Detail of styled cake on a vintage cake stand" },
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
      className="overflow-hidden"
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
          :root { --strip-h: 260px; }
          @media (min-width: 768px) { :root { --strip-h: 420px; } }
        `}</style>
        {STRIP_IMAGES.map((img, i) => (
          <div
            key={i}
            className="relative flex-none h-full overflow-hidden ph ph-warm"
            style={{ aspectRatio: "4/5" }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
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
