import { useEffect, useRef, useState, type ReactNode } from "react";

interface CPRevealProps {
  /** "left" => image on left column. "right" => image on right column. */
  imageSide: "left" | "right";
  image: string;
  alt: string;
  label?: string;
  headline: ReactNode;
  children: ReactNode;
  /** Optional subtle tone class on the image placeholder (ph-warm, ph-blush) */
  tone?: string;
  id?: string;
  /** Hide image on mobile (used for the first section to avoid duplication with hero) */
  hideImageOnMobile?: boolean;
}

/**
 * Two-column section with a scroll-triggered "zoom outward" reveal on the
 * image (it scales from ~0.78 to 1, while content fades up beside it).
 * Image and content alternate sides via `imageSide`.
 */
const CPReveal = ({
  imageSide,
  image,
  alt,
  headline,
  children,
  tone = "ph-warm",
  id,
  hideImageOnMobile = false,
}: CPRevealProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax — translate the inner <img> upward inside its clipped wrapper as
  // the section scrolls through the viewport. Uses rAF + transform for 60fps.
  useEffect(() => {
    const wrap = sectionRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress: -1 (section just below viewport) → 0 (centred) → 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      // Move up to ~12% of image height across the scroll range
      img.style.transform = `translate3d(0, ${clamped * -10}%, 0) scale(1.18)`;
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const imageBlock = (
    <div
      className={`relative w-full cp-reveal-img-wrap ${hideImageOnMobile ? "hidden md:block" : ""}`}
      style={{ aspectRatio: "4/5" }}
    >
      {/* Inner zoom-out reveal: starts small (centred), expands to fill */}
      <div
        className={`absolute inset-0 ph ${tone} overflow-hidden rounded-sm`}
        style={{
          transform: visible ? "scale(1)" : "scale(0.78)",
          opacity: visible ? 1 : 0,
          transition:
            "transform 1.4s cubic-bezier(.22,.7,.2,1), opacity 1.1s ease, box-shadow 1.4s ease",
          transformOrigin: "center center",
          willChange: "transform, opacity",
          boxShadow: visible
            ? "0 22px 44px -22px hsl(var(--ink) / 0.22), 0 10px 22px -12px hsl(var(--ink) / 0.12)"
            : "0 0 0 hsl(var(--ink) / 0)",
        }}
      >
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover z-[2]"
          loading="lazy"
          width={1280}
          height={1600}
        />
      </div>
    </div>
  );

  const contentBlock = (
    <div
      className="flex flex-col justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 1.1s cubic-bezier(.22,.7,.2,1) 180ms, transform 1.1s cubic-bezier(.22,.7,.2,1) 180ms",
      }}
    >
      <h2
        className="font-serif-rf"
        style={{
          fontSize: "clamp(38px, 4.6vw, 64px)",
          lineHeight: 1.0,
          fontWeight: 400,
          letterSpacing: "-0.025em",
          textWrap: "balance",
        }}
      >
        {headline}
      </h2>
      <div
        className="mt-7 text-[16px] leading-[1.7] text-ink-soft max-w-[520px] space-y-5"
        style={{ textWrap: "pretty" }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className="rfx-section white"
      aria-labelledby={id ? `${id}-h` : undefined}
    >
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center min-h-[70vh] rfx-md-stack">
          {imageSide === "left" ? (
            <>
              {imageBlock}
              {contentBlock}
            </>
          ) : (
            <>
              {contentBlock}
              {imageBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CPReveal;
