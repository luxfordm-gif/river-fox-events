import { useEffect, useRef, useState, type ReactNode } from "react";
import { useImageParallax } from "@/hooks/useImageParallax";

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
  /** Override the parallax overscale on the image (default 1.18). Lower = less zoomed in. */
  imageScale?: number;
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
  imageScale = 1.18,
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

  // Parallax — translate the inner <img> upward inside its clipped wrapper.
  useImageParallax(sectionRef, imgRef, { intensity: 10, scale: imageScale });

  const imageBlock = (
    <div
      className={`relative w-full cp-reveal-img-wrap md:sticky md:top-24 md:self-start ${hideImageOnMobile ? "hidden md:block" : ""}`}
      style={{ aspectRatio: "4/5" }}
    >
      {/* Inner zoom-out reveal: starts small (centred), expands to fill */}
      <div
        className={`absolute inset-0 ph ${tone} overflow-hidden rounded-[14px]`}
        style={{
          transform: visible ? "scale(1)" : "scale(0.92)",
          opacity: visible ? 1 : 0.2,
          transition:
            "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transformOrigin: "center center",
          willChange: "transform, opacity",
          boxShadow: visible
            ? "0 22px 44px -22px hsl(var(--ink) / 0.22), 0 10px 22px -12px hsl(var(--ink) / 0.12)"
            : "0 0 0 hsl(var(--ink) / 0)",
        }}
      >
        {/*
          SEO REMINDER: The `alt` prop passed to <CPReveal> must describe the
          exact image (theme, palette, location) and include "River Fox Events"
          plus relevant Surrey town keywords. Never empty, never generic.
        */}
        <img
          ref={imgRef}
          src={image}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover z-[2] will-change-transform"
          style={{ transform: `translate3d(0,0,0) scale(${imageScale})` }}
          loading="lazy"
          decoding="async"
          width={1280}
          height={1600}
        />
      </div>
    </div>
  );

  const contentBlock = (
    <div
      className="cp-reveal-content flex flex-col justify-center"
      style={{
        opacity: visible ? 1 : 0.2,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 180ms, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 180ms",
      }}
    >
      <h2
        className="font-serif-rf"
        style={{
          fontSize: "clamp(34px, 3.4vw, 56px)",
          lineHeight: 1.0,
          fontWeight: 400,
          letterSpacing: "-0.025em",
          textWrap: "balance",
        }}
      >
        {headline}
      </h2>
      <div
        className="cp-reveal-body mt-5 md:mt-7 text-[16px] leading-[1.7] text-ink-soft max-w-[520px] space-y-5"
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
      className={`rfx-section white cp-reveal-section${hideImageOnMobile ? " cp-reveal-no-img" : ""}`}
      aria-labelledby={id ? `${id}-h` : undefined}
    >
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-center rfx-md-stack">
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
