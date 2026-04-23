import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth-scroll hijack. Dampens vertical scrolling so the page
 * eases into motion rather than snapping — gives the site a slow, premium,
 * "luxury" scroll feel. Disabled automatically when the user prefers
 * reduced motion.
 *
 * Also intercepts in-page anchor link clicks (href="#id") and routes them
 * through Lenis so navigation between sections eases instead of jumping.
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

    // Intercept anchor clicks for smooth in-page navigation
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement | null)?.closest?.("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      let hash = "";
      let samePath = false;
      if (href.startsWith("#")) {
        hash = href.slice(1);
        samePath = true;
      } else {
        try {
          const url = new URL(href, window.location.href);
          if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) {
            hash = url.hash.slice(1);
            samePath = true;
          }
        } catch {
          return;
        }
      }
      if (!samePath || !hash) return;

      const el = document.getElementById(hash);
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el, { offset: -80, duration: 1.6 });
      history.pushState(null, "", `#${hash}`);
    };

    document.addEventListener("click", onClick);

    // Smoothly handle initial hash on load
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { offset: -80, duration: 1.6, immediate: false });
      });
    }

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
