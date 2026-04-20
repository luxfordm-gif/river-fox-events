import { useEffect, useRef } from "react";
import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";

/**
 * Three-image editorial layout for laptop + desktop.
 *
 * Layout:
 *   - Three images side by side, 12px gaps.
 *   - Centre image is tallest; left and right are slightly shorter.
 *   - All three are vertically centred so shorter images stagger
 *     symmetrically within the centre image's height.
 *   - Each image has a subtle parallax tied to vertical scroll. The centre
 *     image moves at a slower rate than the side images for layered depth.
 *   - Total parallax travel is capped at ~30px and uses a smooth ease.
 *
 * SEO REMINDER: keep alt strings descriptive — theme, palette, Surrey
 * town and "River Fox Events" must always be present.
 */
const IMAGES = [
  {
    src: hero1,
    alt: "Pastel children's party tablescape with balloon installation in Cobham Surrey by River Fox Events",
    // side image — shorter
    height: 78,
    speed: 0.18,
  },
  {
    src: hero2,
    alt: "Editorial tablescape detail with peonies and silk ribbons for a Weybridge celebration by River Fox Events",
    // centre image — tallest
    height: 100,
    speed: 0.08,
  },
  {
    src: hero3,
    alt: "Vintage cake stand styled with florals for a Surrey children's party by River Fox Events",
    height: 78,
    speed: 0.18,
  },
];

const HeroEditorial = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const rafRef = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const update = () => {
      rafRef.current = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (just below viewport) → 0 (centred) → 1 (just above)
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        const speed = IMAGES[i].speed; // fraction of 30px max travel
        const y = reduceMotion ? 0 : clamped * -30 * speed * 3.3; // ~30px max
        img.style.transform = `translate3d(0, ${y}px, 0) scale(1.06)`;
      });
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
      className="hidden md:block overflow-hidden bg-transparent"
    >
      <div className="container-rfx" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div
          className="flex items-center justify-center"
          style={{ gap: 12, height: "clamp(380px, 48vw, 560px)" }}
        >
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative flex-1 overflow-hidden ph ph-warm rounded-sm"
              style={{ height: `${img.height}%` }}
            >
              <img
                ref={(el) => (imgRefs.current[i] = el)}
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                style={{
                  transform: "translate3d(0,0,0) scale(1.06)",
                  transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
                loading={i === 1 ? "eager" : "lazy"}
                fetchPriority={i === 1 ? "high" : "auto"}
                decoding="async"
                width={1024}
                height={1280}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroEditorial;
