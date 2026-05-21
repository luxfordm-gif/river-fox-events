import { useEffect, useRef, useState } from "react";

// Column 1 - Jungle theme.
import junglA from "@/assets/river-fox-events-jungle-theme-safari-jeep-balloon-garland.webp";
import junglB from "@/assets/river-fox-events-jungle-theme-safari-tablescape-elephant.webp";
import junglC from "@/assets/river-fox-events-jungle-theme-lion-plates-overhead.webp";

// Column 2 - Pastel safari / pastel entrance decor.
import pastelA from "@/assets/river-fox-events-pastel-entrance-decor-arch.webp";
import pastelB from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-table-setting.webp";
import pastelC from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-marquee-close-up.webp";

// Column 3 - Fairy first birthday.
import fairyA from "@/assets/river-fox-events-fairy-first-birthday-kayla-tablescape-overhead.webp";
import fairyB from "@/assets/river-fox-events-fairy-first-birthday-kayla-table-florals.webp";
import fairyC from "@/assets/river-fox-events-fairy-first-birthday-kayla-arch-marquee-portrait.webp";

/**
 * Three-column editorial hero with rotating slides.
 *
 * Each column holds three slides that crossfade in sync, with a small
 * left-to-right stagger so the swap travels across the row rather than
 * blinking all at once. Slower fade (~1.6s) and longer dwell (5s) to keep
 * the hero feeling calm.
 *
 * Wrappers use the source images' native aspect ratios so nothing gets
 * cropped. Centre column is wider (and taller) than the side columns to
 * preserve the staggered editorial feel.
 *
 * SEO REMINDER: keep alt strings descriptive - theme, palette and
 * "River Fox Events" must always be present, per-slide.
 */

type HeroSlide = { src: string; alt: string };

type HeroColumn = {
  /** Three slides that rotate in this column. */
  slides: [HeroSlide, HeroSlide, HeroSlide];
  /** Column width as % of the row. */
  widthPct: number;
  /** CSS aspect-ratio of the column frame. */
  aspect: string;
  /** Parallax speed (lower = more subtle). */
  speed: number;
};

// Frames advance as a set: at any moment all three columns show photos
// from the same theme. Frame 0 = jungle, frame 1 = pastel safari, frame 2 =
// fairy first birthday. Per-column slides are listed in theme order so the
// shared activeSlide index maps directly to the frame.
const COLUMNS: HeroColumn[] = [
  {
    // Left column.
    slides: [
      {
        src: junglA,
        alt: "Jungle theme children's birthday in Surrey by River Fox Events - safari jeep prop with leafy balloon garland",
      },
      {
        src: pastelA,
        alt: "Pastel birthday entrance styling by River Fox Events - soft pastel balloon arch with floral accents at a Surrey venue",
      },
      {
        src: fairyC,
        alt: "Fairy first birthday arch and light-up one marquee for Kayla in Surrey by River Fox Events - pink and lilac balloons with mossy detail",
      },
    ],
    widthPct: 30,
    aspect: "760 / 1000",
    speed: 0.18,
  },
  {
    // Centre column (taller, wider).
    slides: [
      {
        src: junglB,
        alt: "Jungle theme tablescape by River Fox Events - elephant centrepiece with monstera runner and safari balloons",
      },
      {
        src: pastelB,
        alt: "Pastel safari Two Wild tablescape for Anaya's second birthday in Surrey by River Fox Events - pink place settings, foliage runner",
      },
      {
        src: fairyB,
        alt: "Fairy first birthday floral table detail for Kayla in Surrey by River Fox Events - soft pinks, blush and trailing greenery",
      },
    ],
    widthPct: 36,
    aspect: "760 / 1088",
    speed: 0.08,
  },
  {
    // Right column.
    slides: [
      {
        src: junglC,
        alt: "Jungle theme overhead place setting by River Fox Events - lion-printed plates with raffia and animal-print napkins",
      },
      {
        src: pastelC,
        alt: "Close-up of the pink light-up two marquee from Anaya's pastel safari Two Wild birthday in Surrey by River Fox Events",
      },
      {
        src: fairyA,
        alt: "Fairy first birthday tablescape overhead for Kayla in Surrey by River Fox Events - pastel place settings, mossy runner and trailing florals",
      },
    ],
    widthPct: 30,
    aspect: "760 / 1000",
    speed: 0.18,
  },
];

// Hand-picked 3-image set for the mobile ScrollStrip. The desktop hero
// rotates through all 9 photos in three themed frames; mobile keeps a
// tighter, curated trio so the strip stays scannable on a phone.
export const HERO_EDITORIAL_IMAGES = [
  {
    src: fairyA,
    alt: "Fairy first birthday tablescape overhead for Kayla in Surrey by River Fox Events - pastel place settings, mossy runner and trailing florals",
    widthPct: 30,
    aspect: "760 / 1000",
    speed: 0.18,
  },
  {
    src: junglB,
    alt: "Jungle theme tablescape by River Fox Events - elephant centrepiece with monstera runner and safari balloons",
    widthPct: 36,
    aspect: "760 / 1088",
    speed: 0.08,
  },
  {
    src: fairyC,
    alt: "Fairy first birthday arch and light-up one marquee for Kayla in Surrey by River Fox Events - pink and lilac balloons with mossy detail",
    widthPct: 30,
    aspect: "760 / 1000",
    speed: 0.18,
  },
];

// Timings for the auto-rotation. Tweak these to taste.
const SLIDE_INTERVAL_MS = 5000; // Dwell on each slide before advancing.
const FADE_DURATION_MS = 1600; // How long the crossfade itself takes.
const STAGGER_PER_COL_MS = 250; // Left-to-right offset between columns.

const HeroEditorial = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Refs as [colIndex][slideIndex] so parallax can apply the same transform
  // to all stacked imgs in a column.
  const imgRefs = useRef<(HTMLImageElement | null)[][]>(
    COLUMNS.map(() => [null, null, null])
  );
  const rafRef = useRef(0);
  const visibleRef = useRef(false);

  // Single shared index so all columns advance together. The visual stagger
  // is achieved via per-column transition-delay, not by offsetting the index.
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveSlide((n) => (n + 1) % 3);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cached layout - measured outside the scroll handler to prevent
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

      imgRefs.current.forEach((column, colIdx) => {
        const speed = COLUMNS[colIdx].speed;
        const y = reduceMotion ? 0 : clamped * -30 * speed * 3.3;
        column.forEach((img) => {
          if (!img) return;
          img.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
        });
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
          style={{ gap: 16 }}
        >
          {COLUMNS.map((col, colIdx) => (
            <div
              key={colIdx}
              className="relative overflow-hidden ph ph-warm rounded-[14px] rfx-rounded-img"
              style={{ width: `${col.widthPct}%`, aspectRatio: col.aspect }}
            >
              {col.slides.map((slide, sIdx) => {
                const active = sIdx === activeSlide;
                return (
                  <img
                    key={slide.src}
                    ref={(el) => (imgRefs.current[colIdx][sIdx] = el)}
                    src={slide.src}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                    style={{
                      transform: "translate3d(0,0,0) scale(1.02)",
                      // Parallax transform updates use a quick easing; opacity
                      // is a separate, slower transition for the crossfade.
                      transition: `opacity ${FADE_DURATION_MS}ms ease ${colIdx * STAGGER_PER_COL_MS}ms, transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                      opacity: active ? 1 : 0,
                    }}
                    // First slide of every column is eager so the hero is
                    // fully populated on first paint. The other two preload
                    // as lazy with high priority so the first crossfade
                    // doesn't show a flash of empty.
                    loading={sIdx === 0 ? "eager" : "lazy"}
                    fetchPriority={sIdx === 0 ? "high" : "auto"}
                    decoding="async"
                    width={1024}
                    height={1280}
                    aria-hidden={active ? undefined : true}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroEditorial;
