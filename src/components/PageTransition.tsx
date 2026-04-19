import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Subtle fade-in on each route change.
 *
 * Strategy: keep a full-screen overlay above the page. When the pathname
 * changes, snap the overlay to opacity 1 with NO transition (covering the
 * incoming page instantly), then on the next frame transition it back to 0.
 * This gives a clean fade-in of the new page with no flash from the old
 * content showing first.
 */
const PageTransition = () => {
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const firstMount = useRef(true);
  const [, force] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (firstMount.current) {
      firstMount.current = false;
      // Initial load — keep hidden, no animation
      el.style.transition = "none";
      el.style.opacity = "0";
      return;
    }

    // 1. Snap to fully covered (no transition) so the new page is hidden
    el.style.transition = "none";
    el.style.opacity = "1";
    // Force layout flush
    void el.offsetHeight;
    // Reset scroll while overlay covers everything
    window.scrollTo(0, 0);

    // 2. On next frame, animate the overlay back out to reveal the new page
    const raf = window.requestAnimationFrame(() => {
      el.style.transition = "opacity .38s ease-out";
      el.style.opacity = "0";
    });
    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  // Subscribe to pathname so the effect runs
  void force;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        background: "hsl(var(--background))",
        opacity: 0,
      }}
    />
  );
};

export default PageTransition;
