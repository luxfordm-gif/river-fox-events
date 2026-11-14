import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Instagram } from "lucide-react";
import "@/styles/instagram-strip.css";

export type InstagramStripImage = { src: string; alt: string };

type InstagramStripProps = {
  images: InstagramStripImage[];
  href?: string;
  handle?: string;
  /** false: plain photos, no link out to Instagram and no "Opens Instagram"
   *  overlay, badge or label (the two Christmas garland pages). */
  linked?: boolean;
};

/**
 * A slow, endless row of Instagram photos. Every tile links to the
 * Instagram profile; hovering a tile shows the handle and "Opens Instagram"
 * so it's clear the link leaves the site (on touch screens a small badge sits
 * on each tile instead). Hovering anywhere on the row pauses it.
 *
 * The set is rendered twice and the track slides by half its width
 * (rfx-marq), so the loop is seamless and there's never a gap at either end,
 * however wide the screen - as long as one set is wider than the screen.
 * A short list is repeated until a set has at least MIN_PER_SET photos
 * (10 x 340px tiles covers a 2560px screen); with only five photos the
 * corporate strip left an empty stretch at the end of each loop on wide
 * screens (Matt, 2026-11-09). Reduced motion: no animation, the row scrolls
 * sideways by hand instead.
 *
 * Touch screens (phones, tablets): the row still drifts at the same slow
 * speed, but it is a real scrolling row, so it can be swiped left and right
 * as well (Matt, 2026-11-09). A CSS slide can't be swiped, so there the
 * drift moves the scroll position instead (useSwipeDrift). Touching it
 * pauses the drift; it carries on a moment after the finger lifts. Without
 * JavaScript it falls back to the CSS slide.
 */
/** How long after the last swipe the drift picks up again. */
const RESUME_AFTER_MS = 1500;

/** On touch screens, drive the row by scroll position so it can be swiped. */
const useSwipeDrift = (count: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [swipe, setSwipe] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setSwipe(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const list = el?.firstElementChild as HTMLElement | null;
    if (!swipe || !el || !list || !count) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // One set's width: from the first photo to the first photo of the copy.
    const setWidth = () => {
      const second = list.children[count] as HTMLElement | undefined;
      return second ? second.offsetLeft - (list.children[0] as HTMLElement).offsetLeft : 0;
    };
    // Start on the copy, so there is a whole set to swipe back into.
    let pos = setWidth();
    el.scrollLeft = pos;
    let userUntil = 0;
    let touching = false;
    let onScreen = true;
    let last = performance.now();
    let frame = 0;

    // The two copies look identical, so jumping one set width keeps the
    // loop endless in both directions without anything visibly moving.
    const wrap = () => {
      const w = setWidth();
      if (!w) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft <= 1) el.scrollLeft += w;
      else if (el.scrollLeft >= max - 1) el.scrollLeft -= w;
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const w = setWidth();
      if (!reduced && onScreen && !touching && now > userUntil && w) {
        // Same pace as the CSS slide: one set every count x 10 seconds.
        pos += (w / (count * 10000)) * dt;
        const max = el.scrollWidth - el.clientWidth;
        if (pos >= max - 1) pos -= w;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    };

    // A scroll we didn't make is the visitor swiping: hold the drift.
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - pos) > 2) {
        userUntil = performance.now() + RESUME_AFTER_MS;
        wrap();
        pos = el.scrollLeft;
      }
    };
    const onDown = () => { touching = true; };
    const onUp = () => {
      touching = false;
      userUntil = performance.now() + RESUME_AFTER_MS;
      pos = el.scrollLeft;
    };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; });
    io.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchend", onUp, { passive: true });
    el.addEventListener("touchcancel", onUp, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("touchcancel", onUp);
    };
  }, [swipe, count]);

  return { ref, swipe };
};

const MIN_PER_SET = 10;
const InstagramStrip = ({
  images,
  href = "https://www.instagram.com/riverfox_events/",
  handle = "@riverfox_events",
  linked = true,
}: InstagramStripProps) => {
  const repeats = images.length ? Math.ceil(MIN_PER_SET / images.length) : 0;
  const set = Array.from({ length: repeats }, () => images).flat();
  const { ref, swipe } = useSwipeDrift(set.length);
  return (
  <div ref={ref} className={`xmas-ig${swipe ? " is-swipe" : ""}`} style={{ "--ig-duration": `${set.length * 10}s` } as CSSProperties}>
    <ul className="xmas-ig__track">
      {[0, 1].map((copy) =>
        set.map((img, i) => {
          /* Only the first appearance of each photo is read out and tabbable. */
          const repeat = copy === 1 || i >= images.length;
          return (
          <li key={`${copy}-${i}`} className="xmas-ig__item" aria-hidden={repeat ? true : undefined}>
            {!linked ? (
              <div className="xmas-ig__tile">
                <img src={img.src} alt={repeat ? "" : img.alt} width={560} height={700} loading="lazy" decoding="async" />
              </div>
            ) : (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={repeat ? -1 : undefined}
              data-track-text={img.alt}
              className="xmas-ig__tile"
            >
              <img src={img.src} alt={repeat ? "" : img.alt} width={560} height={700} loading="lazy" decoding="async" />
              <span className="sr-only">(opens Instagram, {handle})</span>
              <span className="xmas-ig__over" aria-hidden="true">
                <Instagram size={22} strokeWidth={1.5} />
                <span className="xmas-ig__handle">{handle}</span>
                <span className="xmas-ig__note">Opens Instagram ↗</span>
              </span>
              <span className="xmas-ig__badge" aria-hidden="true">
                <Instagram size={14} strokeWidth={1.8} />
              </span>
            </a>
            )}
          </li>
          );
        })
      )}
    </ul>
  </div>
  );
};

export default InstagramStrip;
