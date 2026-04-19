import { useEffect, useState } from "react";

/** Track scrollY with rAF coalescing. Used for parallax. */
export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setY(window.scrollY);
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/** Apply `.in` to `.fade-up` elements when they are well inside the viewport. */
export function useFadeUp() {
  useEffect(() => {
    const observed = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      // Trigger only once the element is ~18% inside the viewport from the bottom.
      { rootMargin: "0px 0px -18% 0px", threshold: 0.18 }
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>(".fade-up:not(.in)").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    observeAll();
    // Re-scan after layout settles (covers late-mounted children).
    const t1 = window.setTimeout(observeAll, 250);
    const t2 = window.setTimeout(observeAll, 1200);

    // Safety net: anything still hidden after 4s gets shown so content
    // can never end up permanently invisible (e.g. observer edge cases).
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".fade-up:not(.in)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("in");
        }
      });
    }, 4000);

    return () => {
      io.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(safety);
    };
  }, []);
}

/** Toggle `.scrolled` on the fixed nav when the user has scrolled. */
export function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector(".rfx-nav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
