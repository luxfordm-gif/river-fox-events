import { useEffect, useRef } from "react";
import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";

/**
 * Three-image editorial layout for laptop + desktop.
 *
 * Wrappers use the source images' native 4:5 aspect ratio so nothing
 * gets cropped. Centre column is wider (and therefore taller) than the
 * side columns to preserve the staggered editorial feel.
 *
 * SEO REMINDER: keep alt strings descriptive — theme, palette, Surrey
 * town and "River Fox Events" must always be present.
 */
const IMAGES = [
  {
    src: hero1,
    alt: "Pastel children's party tablescape with balloon installation in Cobham Surrey by River Fox Events",
    widthPct: 30,
    aspect: "900 / 1125",
    speed: 0.18,
  },
  {
    src: hero2,
    alt: "Editorial tablescape detail with peonies and silk ribbons for a Weybridge celebration by River Fox Events",
    widthPct: 36,
    aspect: "900 / 1237",
    speed: 0.08,
  },
  {
    src: hero3,
    alt: "A close-up of a Surrey celebration — peach roses, silk ribbons and candlelight on a dressed table, styled by River Fox Events",
    widthPct: 30,
    aspect: "900 / 1195",
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

    // Cached layout — measured outside the scroll handler to prevent
    // forced reflows on every scroll frame.
    let cachedTop = 0;
    let cachedHeight = 0;
    let cachedVH = window.innerHeight || 1;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      cachedTop = rect.top + window.scrollY;
      cachedHeight = rect.height;
      cachedVH = window.innerHeight || 1;
    };

    const update = () => {
      rafRef.current = 0;
      const top = cachedTop - window.scrollY;
      const progress =
        (top + cachedHeight / 2 - cachedVH / 2) /
        (cachedVH / 2 + cachedHeight / 2);
      const clamped = Math.max(-1, Math.min(1, progress));

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        const speed = IMAGES[i].speed;
        const y = reduceMotion ? 0 : clamped * -30 * speed * 3.3;
        img.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
      });
    };

    const onScroll = () => {
      if (!visibleRef.current) return;
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visibleRef.current = e.isIntersecting;
          if (e.isIntersecting) {
            measure();
            update();
          }
        }
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );
    io.observe(section);

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="River Fox Events imagery"
      className="hidden lg:block overflow-hidden bg-transparent"
    >
      <div className="rfx-hero-edl-track">
        <div
          className="flex items-center justify-center"
          style={{ gap: 12 }}
        >
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden ph ph-warm rounded-[22px] rfx-rounded-img"
              style={{ width: `${img.widthPct}%`, aspectRatio: img.aspect }}
            >
              <img
                ref={(el) => (imgRefs.current[i] = el)}
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                style={{
                  transform: "translate3d(0,0,0) scale(1.02)",
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
