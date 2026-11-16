import { useCallback, useRef, useState } from "react";

/**
 * A phone swipe row with pagination dots (the .tcard-dot style): pass
 * `track` as the ref of the scrolling list and `onScroll` as its scroll
 * handler; `active` is the item in the centre of the row, so the right dot lights
 * up, and `goTo(i)` glides item i to the centre when its dot is tapped.
 * Used by the photo tiles (ServicesCards).
 */
export const useSwipeDots = <T extends HTMLElement = HTMLUListElement>() => {
  const track = useRef<T>(null);
  const [active, setActive] = useState(0);

  // Tiles snap to the centre of the row, so "current" is the tile whose
  // centre is nearest the row's centre.
  const centreOf = (item: Element) => (item as HTMLElement).offsetLeft + (item as HTMLElement).offsetWidth / 2;

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el || !el.children.length) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    Array.from(el.children).forEach((c, i) => {
      if (Math.abs(centreOf(c) - mid) < Math.abs(centreOf(el.children[nearest]) - mid)) nearest = i;
    });
    setActive(nearest);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const item = el?.children[i];
    if (!el || !item) return;
    el.scrollTo({ left: centreOf(item) - el.clientWidth / 2, behavior: "smooth" });
  }, []);

  return { track, active, onScroll, goTo };
};
