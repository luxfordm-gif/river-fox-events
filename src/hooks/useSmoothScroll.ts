import { useEffect } from "react";

/**
 * Same-page anchor links (href="#id") glide to their section instead of
 * jumping. Ordinary scrolling is left entirely to the browser: the old Lenis
 * wheel hijack added a delay and, whenever the page was busy for a frame,
 * caught up in a visible jump on Mac trackpads (Matt, 2026-11-07).
 *
 * The fixed nav offset comes from `scroll-padding-top` in index.css.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement | null)?.closest?.("a");
      const href = target?.getAttribute("href");
      if (!href) return;
      let hash = "";
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
        hash = url.hash.slice(1);
      } catch {
        return;
      }
      const el = hash ? document.getElementById(hash) : null;
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior, block: "start" });
      history.pushState(null, "", `#${hash}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
