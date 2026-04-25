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

    // Cached layout (read only on resize / when wrapper enters viewport),
    // never inside the scroll handler — avoids forced reflows.
    let cachedTop = 0;
    let cachedHeight = 0;
    let cachedVH = window.innerHeight || 1;
    let inView = false;

    const apply = () => {
      img.style.transform = `translate3d(0, ${translatePct}%, 0) scale(${currentScale})`;
    };

    const readHoverZoom = () => {
      const v = parseFloat(
        getComputedStyle(wrap).getPropertyValue("--hover-zoom").trim() || "1"
      );
      return isNaN(v) ? 1 : v;
    };

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      cachedTop = rect.top + window.scrollY;
      cachedHeight = rect.height;
      cachedVH = window.innerHeight || 1;
    };

    const updateScroll = () => {
      raf = 0;
      // Use cached layout + current scrollY (no layout read per frame).
      const top = cachedTop - window.scrollY;
      const progress =
        (top + cachedHeight / 2 - cachedVH / 2) /
        (cachedVH / 2 + cachedHeight / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      translatePct = reduceMotion ? 0 : clamped * -intensity;
      apply();
    };

    const tickScale = () => {
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
      if (!inView) return;
      if (raf) return;
      raf = window.requestAnimationFrame(updateScroll);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    // Only listen to scroll while wrapper is near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting;
          if (e.isIntersecting) {
            measure();
            updateScroll();
          }
        }
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    io.observe(wrap);

    measure();
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const hoverTarget = wrap.closest<HTMLElement>(".exp-card") || wrap;
    hoverTarget.addEventListener("mouseenter", onEnter);
    hoverTarget.addEventListener("mouseleave", onLeave);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      hoverTarget.removeEventListener("mouseenter", onEnter);
      hoverTarget.removeEventListener("mouseleave", onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [wrapRef, imgRef, intensity, scale]);
}
