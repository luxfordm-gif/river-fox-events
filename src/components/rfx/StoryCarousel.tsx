import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Pause, Play } from "lucide-react";

export type StorySlide = {
  src: string;
  srcSet?: string;
  alt: string;
  /** CSS object-position if the subject isn't centred in a 4:5 crop. */
  position?: string;
};

type StoryCarouselProps = {
  slides: StorySlide[];
  /** Milliseconds each photo shows before moving on. */
  duration?: number;
  sizes?: string;
  label?: string;
};

/**
 * Instagram-story style photo carousel: a row of thin bars along the bottom,
 * the current one filling over `duration`, then the next photo fades in.
 * Tap the right of the photo for the next one, the left third for the
 * previous one. It pauses while hovered, while a finger is held down, when
 * it's off screen or the tab is hidden, and via the pause button. With
 * reduced motion it never advances on its own.
 */
const StoryCarousel = ({
  slides,
  duration = 5000,
  sizes = "(min-width: 768px) 45vw, 92vw",
  label = "Balloon installations",
}: StoryCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [held, setHeld] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pressStart = useRef(0);

  const count = slides.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const el = rootRef.current;
    const io = el ? new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 }) : null;
    if (el && io) io.observe(el);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  // Warm the next photo so the fade never waits on the network.
  useEffect(() => {
    const next = slides[(index + 1) % count];
    if (!next) return;
    const img = new Image();
    if (next.srcSet) img.srcset = next.srcSet;
    img.sizes = sizes;
    img.src = next.src;
  }, [index, slides, count, sizes]);

  const paused = hovered || held || userPaused || !onScreen || !tabVisible || reduceMotion;

  // A hold longer than this is a pause, not a tap.
  const HOLD_MS = 250;
  const onPointerDown = () => { pressStart.current = Date.now(); setHeld(true); };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const longPress = Date.now() - pressStart.current > HOLD_MS;
    setHeld(false);
    if (longPress) return;
    const r = e.currentTarget.getBoundingClientRect();
    go(e.clientX - r.left < r.width / 3 ? -1 : 1);
  };

  return (
    <div
      ref={rootRef}
      className="story"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setHeld(false); }}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          srcSet={s.srcSet}
          sizes={sizes}
          alt={s.alt}
          aria-hidden={i === index ? undefined : true}
          className={`story__img ${i === index ? "is-on" : ""}`}
          style={s.position ? { objectPosition: s.position } : undefined}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      ))}

      {/* Tap area: left third goes back, the rest goes forward. */}
      <div
        className="story__tap"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setHeld(false)}
        aria-hidden="true"
      />

      <div className="story__top">
        <div className="story__bars" aria-hidden="true">
          {slides.map((s, i) => (
            <span key={s.src} className="story__bar">
              <span
                key={i === index ? `on-${index}` : `off-${i}`}
                className={`story__fill ${i < index ? "is-done" : i === index ? "is-on" : ""}`}
                style={i === index ? { animationDuration: `${duration}ms`, animationPlayState: paused ? "paused" : "running" } : undefined}
                onAnimationEnd={i === index ? () => go(1) : undefined}
              />
            </span>
          ))}
        </div>
        <button
          type="button"
          className="story__pause"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {userPaused ? <Play size={14} strokeWidth={2} /> : <Pause size={14} strokeWidth={2} />}
        </button>
      </div>

      <span className="sr-only" aria-live="polite">
        Photo {index + 1} of {count}
      </span>
      {/* Keyboard: hidden until focused, then shown over the photo. */}
      <div className="story__keys">
        <button type="button" className="story__key" onClick={() => go(-1)}>Previous photo</button>
        <button type="button" className="story__key" onClick={() => go(1)}>Next photo</button>
      </div>
    </div>
  );
};

export default StoryCarousel;
