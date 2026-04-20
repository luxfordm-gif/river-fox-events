import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth-scroll hijack. Dampens vertical scrolling so the page
 * eases into motion rather than snapping — gives the site a slow, premium,
 * "luxury" scroll feel. Disabled automatically when the user prefers
 * reduced motion.
 *
 * Tuning notes:
 * - duration: higher = slower / longer ease (1.4s is noticeably calm)
 * - easing: a smooth decelerating curve, matches our global animation curve
 * - wheelMultiplier < 1 reduces wheel intensity for that "heavier" feel
 * - touchMultiplier < 1 keeps touch scrolling controlled but still natural
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.9,
      lerp: 0.09,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
