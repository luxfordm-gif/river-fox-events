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

/** Apply `.in` to `.fade-up` elements when they enter the viewport. */
export function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".fade-up:not(.in)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-6% 0px -6% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
