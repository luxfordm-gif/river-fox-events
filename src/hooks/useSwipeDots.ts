import { useCallback, useRef, useState } from "react";

/**
 * A phone swipe row with pagination dots (the .tcard-dot style): pass
 * `track` as the ref of the scrolling list and `onScroll` as its scroll
 * handler; `active` is the item at the left of the row, so the right dot lights
 * up, and `goTo(i)` glides item i to the left when its dot is tapped.
 * Used by the photo tiles (ServicesCards).
 */
export const useSwipeDots = <T extends HTMLElement = HTMLUListElement>() => {
  const track = useRef<T>(null);
  const [active, setActive] = useState(0);

  // Tiles sit at the left of the row (the first lines up with the page
  // margin, Matt 2026-11-16), so "current" is the tile whose left edge is
  // nearest the row's left padding; at the very end the last tile counts.
  const padLeft = (el: HTMLElement) => parseFloat(getComputedStyle(el).paddingLeft) || 0;
  const leftOf = (el: HTMLElement, item: Element) => (item as HTMLElement).offsetLeft - padLeft(el);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el || !el.children.length) return;
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) {
      setActive(el.children.length - 1);
      return;
    }
    let nearest = 0;
    Array.from(el.children).forEach((c, i) => {
      if (Math.abs(leftOf(el, c) - el.scrollLeft) < Math.abs(leftOf(el, el.children[nearest]) - el.scrollLeft)) nearest = i;
    });
    setActive(nearest);
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const item = el?.children[i];
    if (!el || !item) return;
    el.scrollTo({ left: leftOf(el, item), behavior: "smooth" });
  }, []);

  return { track, active, onScroll, goTo };
};
