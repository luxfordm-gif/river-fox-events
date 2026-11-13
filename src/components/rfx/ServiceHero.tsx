import { type CSSProperties, ReactNode, useEffect, useRef, Fragment } from "react";
import TrustLine from "./TrustLine";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

type ServiceHeroProps = {
  image: string;
  imageAlt: string;
  /** Optional mobile-only hero image. When set, the desktop hero stays as
   *  `image` and the mobile (< md) viewport renders `mobileImage` instead.
   *  Use when the desktop shot doesn't crop well into a portrait frame. */
  mobileImage?: string;
  mobileImageAlt?: string;
  lines: ReactNode[];
  sub: ReactNode;
  headingId?: string;
  /** Pre-filled WhatsApp link. When set, phones (below md) get a
   *  "WhatsApp Laura now" ghost button under Reserve your date. */
  whatsappHref?: string;
};

const ServiceHero = ({
  image,
  imageAlt,
  mobileImage,
  mobileImageAlt,
  lines,
  sub,
  headingId = "service-hero-heading",
  whatsappHref,
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
          // Image starts slightly zoomed in (1.05) and settles to 1.0 as it
          // expands to full width - prevents the hard background edge being
          // visible during the transition.
          const scale = 1.05 - 0.05 * progress;
          el.style.marginLeft = `${marginVw}vw`;
          el.style.marginRight = `${marginVw}vw`;
          el.style.borderRadius = `calc(var(--radius-large) * ${1 - progress})`;
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
    <section id="top" aria-labelledby={headingId} className="rfx-hero-scale pb-0">
      {/* Text - same position and style as home page H1 */}
      <div className="container-rfx">
        <div className="rfx-hero-intro mb-10 md:mb-14 flex flex-col items-center text-center">
          <h1
            id={headingId}
            className="t-display max-w-none mx-auto break-words text-pretty"
          >
            {/* Each entry in `lines` is its own line. The break sits between
                the reveal wrappers (inline blocks), as on the home hero; inside
                them it didn't break the headline (Matt, 2026-11-08). A line
                too long for the screen wraps evenly ("Balloon decorations /
                across Surrey,") instead of leaving one word on its own. */}
            {lines.map((line, i) => (
              <Fragment key={i}>
                <span className={`word-reveal in${i > 0 ? ` delay-${i}` : ""}`}>
                  <span className="text-balance">{line}</span>
                </span>
                {i < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </h1>

          <p
            className={`word-reveal in delay-${lines.length} mt-3 md:mt-0 max-w-[44ch] mx-auto t-lead text-ink-soft text-center`}
            style={{ textWrap: "pretty" } as CSSProperties}
          >
            {sub}
          </p>

          {/* Matching widths, stacked, as on Christmas Door Garlands. */}
          <div className="mt-8 mx-auto grid gap-3 w-fit fade-up in">
            <a
              href={ENQUIRE_HREF}
              onClick={handleEnquireClick}
              className="btn-solid-rf accent justify-center"
            >
              Reserve your date{" "}
              <span className="t-icon">→</span>
            </a>
            {whatsappHref ? (
              <a href={whatsappHref} className="btn-ghost-rf justify-center md:hidden">
                WhatsApp Laura now
              </a>
            ) : null}
          </div>
          <TrustLine linked className="text-center fade-up in" />
        </div>
      </div>

      {/* Expanding image - starts inset from edges, fills full width on scroll.
          Mobile uses a taller aspect ratio (~40% deeper than desktop) so the
          image fills the frame without showing background above/below. */}
      <div className="overflow-hidden">
        <div
          ref={imgWrapRef}
          className="rounded-large"
          style={{
            marginLeft: "5vw",
            marginRight: "5vw",
            overflow: "hidden",
            willChange: "margin, border-radius",
          }}
        >
          {mobileImage ? (
            // `<picture>` is the only HTML-spec guarantee that the browser
            // fetches exactly one source per viewport. Two visibility-toggled
            // `<img>` elements both request their `src` regardless of `display`.
            // The inner `<img>` alt is mobile-first (Googlebot indexes the
            // mobile crawl) - the desktop fallback shares the same alt since
            // both shots describe River Fox Events corporate styling work.
            <picture>
              <source media="(min-width: 768px)" srcSet={image} />
              <img
                ref={imgRef}
                src={mobileImage}
                alt={mobileImageAlt ?? imageAlt}
                className="w-full block object-cover aspect-[2/3] md:aspect-[16/7]"
                style={{ transform: "scale(1.05)", willChange: "transform" }}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1920}
                height={840}
              />
            </picture>
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
