import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";

/**
 * Tablet/desktop hero imagery for location pages — three portrait
 * images stacked on top of each other on first paint, then animated
 * outward into a soft fan: centre image stays put, left back image
 * tilts -7° and slides left, right back image tilts +7° and slides
 * right. Mimics the editorial composition of the reference image.
 *
 * Mobile uses ScrollStrip — this component is hidden below md.
 *
 * Honours `prefers-reduced-motion`: jumps straight to the final fanned
 * state with no transition.
 */
const LocationHeroFan = () => {
  const [fanned, setFanned] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setFanned(true);
      return;
    }
    // Tiny delay so the initial stacked state paints before the fan-out
    // animation kicks in. Without this, browsers race-condition between
    // mount and the transition and you don't see the animation.
    const t = window.setTimeout(() => setFanned(true), 220);
    return () => window.clearTimeout(t);
  }, []);

  const baseImg =
    "absolute top-1/2 left-1/2 w-[34%] max-w-[360px] object-cover rounded-[10px] will-change-transform";
  const transition =
    "transform 1.4s cubic-bezier(0.22, 0.7, 0.2, 1) 0.15s";
  const sideShadow = "0 22px 56px -22px hsl(var(--ink) / 0.28)";
  const centerShadow = "0 30px 72px -22px hsl(var(--ink) / 0.34)";

  return (
    <section
      aria-label="River Fox Events imagery"
      className="hidden md:block relative overflow-hidden bg-transparent"
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: "1100px",
          // Locks the section height so absolute-positioned images have
          // a consistent canvas. Scales down on shorter viewports.
          height: "clamp(440px, 64vh, 620px)",
        }}
      >
        {/* Left back — tilts and slides left */}
        <img
          src={hero1}
          alt="Pastel children's party tablescape with balloon installation in Cobham Surrey by River Fox Events"
          className={baseImg}
          style={{
            aspectRatio: "3 / 4",
            transform: fanned
              ? "translate(-50%, -50%) translateX(-12vw) rotate(-7deg)"
              : "translate(-50%, -50%) rotate(0deg)",
            transition,
            boxShadow: sideShadow,
            zIndex: 1,
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={900}
          height={1200}
        />

        {/* Right back — tilts and slides right */}
        <img
          src={hero3}
          alt="A close-up of a Surrey celebration — peach roses, silk ribbons and candlelight on a dressed table, styled by River Fox Events"
          className={baseImg}
          style={{
            aspectRatio: "3 / 4",
            transform: fanned
              ? "translate(-50%, -50%) translateX(12vw) rotate(7deg)"
              : "translate(-50%, -50%) rotate(0deg)",
            transition,
            boxShadow: sideShadow,
            zIndex: 2,
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={900}
          height={1200}
        />

        {/* Centre front — slightly larger, no rotation */}
        <img
          src={hero2}
          alt="Editorial tablescape detail with peonies and silk ribbons for a Weybridge celebration by River Fox Events"
          className="absolute top-1/2 left-1/2 w-[36%] max-w-[380px] object-cover rounded-[10px]"
          style={{
            aspectRatio: "3 / 4",
            transform: "translate(-50%, -50%)",
            boxShadow: centerShadow,
            zIndex: 3,
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={900}
          height={1200}
        />
      </div>
    </section>
  );
};

export default LocationHeroFan;
