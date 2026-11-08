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
/**
 * Land on "#section" after the page has rendered it. The browser's own jump
 * happens before React has drawn the section, so links like "/#kindness"
 * from another page used to stop at the top. Looks for the section for up
 * to a second, then settles once more when images have loaded (they shift
 * the layout), unless the visitor has started scrolling themselves.
 */
function landOnHash(hash: string): () => void {
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return () => {};
  let raf = 0;
  let cancelled = false;
  const started = performance.now();
  const go = () => {
    if (cancelled) return false;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    return !!target;
  };
  const find = () => {
    if (go()) return;
    if (performance.now() - started < 1000) raf = window.requestAnimationFrame(find);
  };
  raf = window.requestAnimationFrame(find);
  const stop = () => { cancelled = true; };
  const onLoad = () => go();
  window.addEventListener("wheel", stop, { passive: true, once: true });
  window.addEventListener("touchstart", stop, { passive: true, once: true });
  window.addEventListener("keydown", stop, { once: true });
  if (document.readyState !== "complete") window.addEventListener("load", onLoad, { once: true });
  const late = window.setTimeout(go, 700);
  return () => {
    cancelled = true;
    window.cancelAnimationFrame(raf);
    window.clearTimeout(late);
    window.removeEventListener("load", onLoad);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };
}

const PageTransition = () => {
  const { pathname, hash } = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const firstMount = useRef(true);
  const [, force] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (firstMount.current) {
      firstMount.current = false;
      // Initial load - keep hidden, no animation
      el.style.transition = "none";
      el.style.opacity = "0";
      return hash ? landOnHash(hash) : undefined;
    }

    // 1. Snap to fully covered (no transition) so the new page is hidden
    el.style.transition = "none";
    el.style.opacity = "1";
    // Force layout flush
    void el.offsetHeight;
    // Reset scroll while overlay covers everything (or land on the linked
    // section, below).
    window.scrollTo(0, 0);
    const unland = hash ? landOnHash(hash) : null;

    // 2. On next frame, animate the overlay back out to reveal the new page
    const raf = window.requestAnimationFrame(() => {
      el.style.transition = "opacity .38s ease-out";
      el.style.opacity = "0";
    });
    return () => {
      window.cancelAnimationFrame(raf);
      unland?.();
    };
    // Only a change of page runs this; the hash is read when it does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
