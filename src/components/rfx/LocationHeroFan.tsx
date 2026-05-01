import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.webp";
import hero2 from "@/assets/hero-2.webp";
import hero3 from "@/assets/hero-3.webp";

/**
 * Tablet/desktop hero imagery for location pages — three portrait
 * images stacked on top of each other on first paint, then animated
 * outward into a soft fan. All three are anchored at the same bottom
 * line so the centre card (15% larger) scales up out of the bottom.
 * Side cards rotate around their bottom-centre point so their bottoms
 * stay pinned as they tilt.
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

  const transition = "transform 1.4s cubic-bezier(0.22, 0.7, 0.2, 1) 0.15s";
  const sideShadow = "0 22px 56px -22px hsl(var(--ink) / 0.28)";
  const centerShadow = "0 30px 72px -22px hsl(var(--ink) / 0.34)";

  // All three images share this base. Anchor at the bottom of the
  // canvas, horizontally centred. Rotation pivot at bottom-centre so
  // tilts don't lift the bottom edge off the line.
  const sideImg =
    "absolute bottom-[6%] left-1/2 w-[32%] max-w-[340px] object-cover rounded-[10px] will-change-transform";
  const sideStyle = {
    aspectRatio: "3 / 4" as const,
    transformOrigin: "bottom center" as const,
    transition,
    boxShadow: sideShadow,
  };

  return (
    <section
      aria-label="River Fox Events imagery"
      // Removed `overflow-hidden` so the deep drop shadows on the cards
      // can extend past the section edges without being clipped. Padding
      // around the canvas gives the shadows room to breathe.
      className="hidden md:block relative bg-transparent py-6 md:py-10"
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: "1100px",
          // Locks the section height so absolute-positioned images have
          // a consistent canvas. Centre card is taller (15% larger) so
          // the canvas needs to fit it from bottom anchor up.
          height: "clamp(480px, 68vh, 660px)",
        }}
      >
        {/* Left back — tilts and slides left */}
        <img
          src={hero1}
          alt="Pastel children's party tablescape with balloon installation in Cobham Surrey by River Fox Events"
          className={sideImg}
          style={{
            ...sideStyle,
            transform: fanned
              ? "translateX(-50%) translateX(-12vw) rotate(-7deg)"
              : "translateX(-50%) rotate(0deg)",
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
          className={sideImg}
          style={{
            ...sideStyle,
            transform: fanned
              ? "translateX(-50%) translateX(12vw) rotate(7deg)"
              : "translateX(-50%) rotate(0deg)",
            zIndex: 2,
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={900}
          height={1200}
        />

        {/* Centre front — 15% wider than the side cards, anchored at
            the same bottom line so it scales up out of the bottom. */}
        <img
          src={hero2}
          alt="Editorial tablescape detail with peonies and silk ribbons for a Weybridge celebration by River Fox Events"
          className="absolute bottom-[6%] left-1/2 w-[37%] max-w-[400px] object-cover rounded-[10px]"
          style={{
            aspectRatio: "3 / 4",
            transform: "translateX(-50%)",
            transformOrigin: "bottom center",
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
