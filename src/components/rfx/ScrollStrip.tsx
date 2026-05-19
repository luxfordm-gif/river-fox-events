import { useEffect, useRef } from "react";
import hero1 from "@/assets/baby-shower-baby-in-bloom-arch-surrey.webp";
import hero2 from "@/assets/jungle-elephant-tablescape-surrey.webp";
import hero3 from "@/assets/fairy-first-kayla-table-setting-surrey.webp";
import expChildren from "@/assets/dinosaur-childrens-party-styling-surrey.webp";
import expMilestone from "@/assets/40th-birthday-rose-gold-marquee-surrey.webp";
import expCorporate from "@/assets/corporate-gala-styling-surrey.webp";
import cpCelebrations from "@/assets/cp-celebrations.webp";

// SEO REMINDER: every image in this strip must have descriptive alt text
// that names the styling shown (theme, palette, props) plus the Surrey town
// where relevant. Never empty, never "image"/"photo". Update alt strings
// here whenever the source imagery changes.
const STRIP_IMAGES = [
  { src: hero1, alt: "Dusty blue and white balloon arch with 'Baby in Bloom' backdrop for a Surrey baby shower by River Fox Events", aspect: "760 / 1000" },
  { src: expMilestone, alt: "Rose gold 40th birthday light-up marquee numbers with blush and chrome balloon garland styled in Surrey by River Fox Events", aspect: "760 / 980" },
  { src: hero2, alt: "Jungle theme children's birthday styling in Surrey by River Fox Events — elephant centrepiece, monstera runner and balloons", aspect: "760 / 1088" },
  { src: expChildren, alt: "Sage green dinosaur children's birthday styling in Surrey by River Fox Events — name sign and balloon installation", aspect: "820 / 1089" },
  { src: hero3, alt: "Pink and lilac fairy first birthday styling in Surrey by River Fox Events — Kayla backdrop, light-up one and mossy runner", aspect: "760 / 1000" },
  { src: expCorporate, alt: "Corporate gala event styling in Surrey by River Fox Events — navy blue gold cream balloon garland and branded backdrop", aspect: "820 / 1093" },
  { src: cpCelebrations, alt: "Children's birthday styling in Surrey by River Fox Events — tailored pastel balloon installation with floral accents", aspect: "1468 / 1920" },
];

/**
 * Scroll-driven horizontal image strip.
 *
 * The horizontal translation of the image track is mapped from the section's
 * scroll progress through the viewport. No auto-play, no controls — purely
 * driven by vertical scroll position.
 */
type ScrollStripImage = { src: string; alt: string; aspect?: string };
type ScrollStripProps = {
  /** When provided, overrides the default homepage image set (e.g. a
   *  location page passes its 3 heroFan images so the scroll-driven
   *  strip stays in sync with the desktop fan). */
  images?: ScrollStripImage[];
};

const ScrollStrip = ({ images }: ScrollStripProps = {}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cached layout — measured on resize / IntersectionObserver entry only,
    // never per scroll frame, to avoid forced reflows.
    let cachedTop = 0;
    let cachedHeight = 0;
    let cachedVH = window.innerHeight || 1;
    let cachedMaxTranslate = 0;
    let cachedSpeed = 0.26;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      cachedTop = rect.top + window.scrollY;
      cachedHeight = rect.height;
      cachedVH = window.innerHeight || 1;
      const trackWidth = track.scrollWidth;
      const containerWidth = section.clientWidth;
      cachedMaxTranslate = Math.max(0, trackWidth - containerWidth);
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      // Speed is calibrated to the default 7-image homepage strip. When a
      // caller passes a shorter custom set (e.g. a location page's 3 hero
      // images), the available scroll distance is much smaller, so we bump
      // the multiplier to get a comparable feel of horizontal movement.
      const fewImages = (images ?? STRIP_IMAGES).length < 5;
      cachedSpeed = fewImages ? 0.95 : isMobile ? 0.22 : 0.26;
    };

    const update = () => {
      rafRef.current = 0;
      const top = cachedTop - window.scrollY;
      const total = cachedHeight + cachedVH;
      const raw = (cachedVH - top) / total;
      const progress = Math.max(0, Math.min(1, raw));
      const x = reduceMotion ? 0 : -progress * cachedMaxTranslate * cachedSpeed;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
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
      className="lg:hidden overflow-hidden py-[20px]"
      style={{ background: "hsl(var(--linen))" }}
    >
      <div
        ref={trackRef}
        className="flex gap-3 md:gap-4 will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <style>{`
          :root { --strip-item-w: 48vw; }
          @media (min-width: 768px) {
            :root {
              /* 3 images visible with a partial 4th peeking in.
                 Account for 16px (gap-4) gaps between items. */
              --strip-item-w: calc((100vw - (3 * 16px)) / 3.5);
            }
          }
        `}</style>
        {(images ?? STRIP_IMAGES).map((img, i) => (
          <div
            key={i}
            className="relative flex-none overflow-hidden ph ph-warm rounded-[14px] rfx-rounded-img"
            style={{ width: "var(--strip-item-w)", aspectRatio: img.aspect ?? "3 / 4" }}
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
