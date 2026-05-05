import { type CSSProperties, ReactNode, useEffect, useRef } from "react";

type ServiceHeroProps = {
  image: string;
  imageAlt: string;
  lines: ReactNode[];
  sub: ReactNode;
  headingId?: string;
};

const ServiceHero = ({
  image,
  imageAlt,
  lines,
  sub,
  headingId = "service-hero-heading",
}: ServiceHeroProps) => {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const el = imgWrapRef.current;
        const img = imgRef.current;
        if (el) {
          const progress = reduceMotion
            ? 1
            : Math.min(1, Math.max(0, window.scrollY / 520));
          const marginVw = 5 * (1 - progress);
          const radius = 16 * (1 - progress);
          // Image starts slightly zoomed in (1.05) and settles to 1.0 as it
          // expands to full width — prevents the hard background edge being
          // visible during the transition.
          const scale = 1.05 - 0.05 * progress;
          el.style.marginLeft = `${marginVw}vw`;
          el.style.marginRight = `${marginVw}vw`;
          el.style.borderRadius = `${radius}px`;
          if (img) img.style.transform = `scale(${scale})`;
        }
        raf = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" aria-labelledby={headingId} className="pt-[106px] md:pt-[134px] pb-0">
      {/* Text — same position and style as home page H1 */}
      <div className="container-rfx">
        <div className="mb-10 md:mb-14 flex flex-col items-center text-center">
          <h1
            id={headingId}
            className="font-serif-rf max-w-[14ch] md:max-w-none mx-auto break-words text-pretty"
            style={{
              fontSize: "clamp(52px, 6.5vw, 110px)",
              lineHeight: 0.96,
              fontWeight: 400,
              letterSpacing: "-0.038em",
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                className={`word-reveal in${i > 0 ? ` delay-${i}` : ""}`}
              >
                <span>{line}</span>
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          <p
            className={`word-reveal in delay-${lines.length} mt-6 max-w-[44ch] mx-auto text-[17px] leading-[1.65] text-ink-soft text-center`}
            style={{ textWrap: "pretty" } as CSSProperties}
          >
            {sub}
          </p>
        </div>
      </div>

      {/* Expanding image — starts inset from edges, fills full width on scroll.
          Mobile uses a taller aspect ratio (~40% deeper than desktop) so the
          image fills the frame without showing background above/below. */}
      <div className="overflow-hidden">
        <div
          ref={imgWrapRef}
          style={{
            marginLeft: "5vw",
            marginRight: "5vw",
            borderRadius: "16px",
            overflow: "hidden",
            willChange: "margin, border-radius",
          }}
        >
          <img
            ref={imgRef}
            src={image}
            alt={imageAlt}
            className="w-full block object-cover aspect-[2/3] md:aspect-[16/7]"
            style={{ transform: "scale(1.05)", willChange: "transform" }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1920}
            height={840}
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
