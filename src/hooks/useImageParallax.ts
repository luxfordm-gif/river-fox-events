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

    let translatePct = 0;
    let currentScale = scale;
    let targetScale = scale;
    let raf = 0;

    const apply = () => {
      img.style.transform = `translate3d(0, ${translatePct}%, 0) scale(${currentScale})`;
    };

    const readHoverZoom = () => {
      const v = parseFloat(
        getComputedStyle(wrap).getPropertyValue("--hover-zoom").trim() || "1"
      );
      return isNaN(v) ? 1 : v;
    };

    const updateScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      translatePct = reduceMotion ? 0 : clamped * -intensity;
      apply();
      raf = 0;
    };

    const tickScale = () => {
      // Smoothly ease currentScale toward targetScale
      const diff = targetScale - currentScale;
      if (Math.abs(diff) < 0.0005) {
        currentScale = targetScale;
        apply();
        return;
      }
      currentScale += diff * 0.08;
      apply();
      requestAnimationFrame(tickScale);
    };

    const onEnter = () => {
      targetScale = scale * readHoverZoom();
      requestAnimationFrame(tickScale);
    };
    const onLeave = () => {
      targetScale = scale;
      requestAnimationFrame(tickScale);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Hover lives on the closest .exp-card if present, else the wrapper itself
    const hoverTarget = wrap.closest<HTMLElement>(".exp-card") || wrap;
    hoverTarget.addEventListener("mouseenter", onEnter);
    hoverTarget.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      hoverTarget.removeEventListener("mouseenter", onEnter);
      hoverTarget.removeEventListener("mouseleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [wrapRef, imgRef, intensity, scale]);
}
