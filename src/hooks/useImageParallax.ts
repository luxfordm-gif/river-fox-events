import { useEffect, type RefObject } from "react";

/**
 * Smooth scroll-driven parallax for an <img> inside a clipped wrapper.
 *
 * The image is translated vertically based on how the wrapper sits in the
 * viewport. Uses rAF + translate3d for 60fps and respects prefers-reduced-motion.
 *
 * @param wrapRef  Ref to the clipped wrapper element (the visible "frame")
 * @param imgRef   Ref to the <img> inside the wrapper
 * @param options.intensity   Max % the image translates (default 10)
 * @param options.scale       Image is overscaled by this factor so edges are never visible (default 1.18)
 */
export function useImageParallax(
  wrapRef: RefObject<HTMLElement>,
  imgRef: RefObject<HTMLElement>,
  options: { intensity?: number; scale?: number } = {}
) {
  const { intensity = 10, scale = 1.18 } = options;

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      img.style.transform = `translate3d(0,0,0) scale(${scale})`;
      return;
    }

    let raf = 0;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (just below viewport) → 0 (centred) → 1 (just above viewport)
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      img.style.transform = `translate3d(0, ${clamped * -intensity}%, 0) scale(${scale})`;
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
  }, [wrapRef, imgRef, intensity, scale]);
}
