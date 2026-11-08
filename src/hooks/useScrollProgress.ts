import { useEffect, type RefObject } from "react";

/**
 * Calls `onProgress(p)` with 0..1 as an element's top edge moves up the
 * screen: 0 while its top is at `from` (a fraction of the viewport height,
 * 1 = bottom edge), 1 once it reaches `to`. Driven by the page's own scroll,
 * so on phones it follows the finger rather than playing on a timer.
 *
 * With reduced motion it reports 1 once and stops.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement>,
  onProgress: (p: number) => void,
  { from = 1, to = 0.3 }: { from?: number; to?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onProgress(1);
      return;
    }
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const top = el.getBoundingClientRect().top / vh;
      const p = Math.min(1, Math.max(0, (from - top) / (from - to)));
      if (p !== last) {
        last = p;
        onProgress(p);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
    // onProgress is expected to be stable (it only writes to refs / styles).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, from, to]);
}
