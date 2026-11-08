import { useEffect, useState } from "react";
// Fallback photos only (every page passes its own). hero-1 and hero-2 are never shown (Matt, 2026-11-07).
import fanLeft from "@/assets/river-fox-events-40th-birthday-rose-gold-marquee-sunlit.webp";
import fanCentre from "@/assets/river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp";
import hero3 from "@/assets/hero-3.webp";

type FanImage = { src: string; alt: string; objectPosition?: string };
type LocationHeroFanProps = {
  /** Optional per-location override - order is [left, centre, right]. */
  images?: [FanImage, FanImage, FanImage];
  /** Fan the side cards further apart while the pointer is over the fan. */
  spreadOnHover?: boolean;
};

/**
 * Tablet/desktop hero imagery for location pages - three portrait
 * images stacked on top of each other on first paint, then animated
 * outward into a soft fan. All three are anchored at the same bottom
 * line so the centre card (15% larger) scales up out of the bottom.
 * Side cards rotate around their bottom-centre point so their bottoms
 * stay pinned as they tilt.
 *
 * Mobile uses ScrollStrip - this component is hidden below md.
 *
 * With `spreadOnHover`, the side cards open out further (wider and more
 * tilted) while the pointer is over the fan, and settle back on leave.
 *
 * Honours `prefers-reduced-motion`: jumps straight to the final fanned
 * state with no transition.
 */
const LocationHeroFan = ({ images, spreadOnHover = false }: LocationHeroFanProps = {}) => {
  const [fanned, setFanned] = useState(false);
  const [spread, setSpread] = useState(false);

  const fallback: [FanImage, FanImage, FanImage] = [
    {
      src: fanLeft,
      alt: "Sunlit rose gold 40th marquee numbers with a blush and chrome balloon garland",
    },
    {
      src: fanCentre,
      alt: "Dusty blue and white Baby in Bloom balloon arch with floral accents for a baby shower",
    },
    {
      src: hero3,
      alt: "Pastel safari banquet table under tall windows, with sage and pink balloons and a light-up 2",
    },
  ];
  const [left, centre, right] = images ?? fallback;

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

  // The first fan-out keeps its slight delay; once hovering has started the
  // spread uses a slow-in, slow-out ease so it opens and closes smoothly.
  const [settled, setSettled] = useState(false);
  const transition = settled
    ? "transform 1.2s cubic-bezier(0.45, 0, 0.2, 1)"
    : "transform 1.4s cubic-bezier(0.22, 0.7, 0.2, 1) 0.15s";
  const onEnter = spreadOnHover ? () => { setSettled(true); setSpread(true); } : undefined;
  const onLeave = spreadOnHover ? () => setSpread(false) : undefined;
  const sideX = spread ? 14.5 : 12; // vw
  const sideTilt = spread ? 8.5 : 7; // deg
  const sideShadow = "0 22px 56px -22px hsl(var(--text-primary) / 0.28)";
  const centerShadow = "0 30px 72px -22px hsl(var(--text-primary) / 0.34)";

  // All three images share this base. Anchor at the bottom of the
  // canvas, horizontally centred. Rotation pivot at bottom-centre so
  // tilts don't lift the bottom edge off the line.
  const sideImg =
    "absolute bottom-[6%] left-1/2 w-[32%] max-w-[340px] object-cover rounded-large will-change-transform";
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
      className="hidden md:block relative bg-transparent py-3 md:py-5"
    >
      <div
        className="relative mx-auto"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{
          maxWidth: "1100px",
          // Aspect-ratio so the canvas hugs the imagery instead of
          // chasing viewport height. The fixed-height clamp left a big
          // empty band above the images on tall monitors and pushed the
          // images up against the CTA on short browser windows. With
          // an aspect-ratio capped at maxHeight, the canvas tracks
          // container width up to ~1100px and tops out at 580px so the
          // centre card always fits.
          aspectRatio: "1100 / 580",
          maxHeight: "580px",
        }}
      >
        {/* Left back - tilts and slides left */}
        <img
          src={left.src}
          alt={left.alt}
          className={sideImg}
          style={{
            ...sideStyle,
            objectPosition: left.objectPosition,
            transform: fanned
              ? `translateX(-50%) translateX(-${sideX}vw) rotate(-${sideTilt}deg)`
              : "translateX(-50%) rotate(0deg)",
            zIndex: 1,
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={900}
          height={1200}
        />

        {/* Right back - tilts and slides right */}
        <img
          src={right.src}
          alt={right.alt}
          className={sideImg}
          style={{
            ...sideStyle,
            objectPosition: right.objectPosition,
            transform: fanned
              ? `translateX(-50%) translateX(${sideX}vw) rotate(${sideTilt}deg)`
              : "translateX(-50%) rotate(0deg)",
            zIndex: 2,
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={900}
          height={1200}
        />

        {/* Centre front - 15% wider than the side cards, anchored at
            the same bottom line so it scales up out of the bottom. */}
        <img
          src={centre.src}
          alt={centre.alt}
          className="absolute bottom-[6%] left-1/2 w-[37%] max-w-[400px] object-cover rounded-large"
          style={{
            aspectRatio: "3 / 4",
            objectPosition: centre.objectPosition,
            transform: spread ? "translateX(-50%) translateY(-1%)" : "translateX(-50%)",
            transformOrigin: "bottom center",
            transition,
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
