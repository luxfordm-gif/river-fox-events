import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from "react";

/* One portrait thumbnail that opens a full-screen, Instagram-story style
   player. Videos only load once the tile is tapped, so the page itself only
   pays for the thumbnail. With several videos they play in order with
   progress bars at the top and a "1 of 6" counter at the bottom; tap or
   swipe left for next, tap the left edge or swipe right for previous, swipe
   down to close.

   Optional `fan`: stills from the other videos tucked behind the tile. They
   fan out like a hand of cards on hover (and once as a hint when the tile
   scrolls into view; on touch screens again now and then while it sits
   idle). Clicking a fanned card opens the player at that video. */

export type Story = {
  src: string;
  /** Still shown while the video loads. */
  poster?: string;
  /** Short description for screen readers. */
  label: string;
};

type Props = {
  stories: Story[];
  thumb: string;
  thumbSrcSet?: string;
  thumbAlt: string;
  /** Text on the button over the thumbnail (and the player's label). */
  cta: string;
  /** Hide the button when a heading above already says it; the play mark
      sits centred and `cta` stays as the tile's accessible name. */
  hideCta?: boolean;
  /** Focal point for the thumbnail crop, e.g. "50% 40%". */
  thumbPosition?: string;
  /** Stills that fan out behind the tile, left to right; `story` is the
      index of the video each one opens. Four reads best. */
  fan?: { src: string; story: number }[];
};

/* Rest and fanned positions for up to four cards, outside in. Cards pivot
   from the bottom centre, like a hand of cards. */
const FAN_SLOTS = [
  { rest: -5, open: -14, x: -26 },
  { rest: -2.5, open: -7, x: -13 },
  { rest: 2.5, open: 7, x: 13 },
  { rest: 5, open: 14, x: 26 },
];
const fanSlots = (n: number) => (n >= 4 ? FAN_SLOTS : n === 2 ? [FAN_SLOTS[1], FAN_SLOTS[2]] : FAN_SLOTS.slice(0, n));

const StoryVideos = ({ stories, thumb, thumbSrcSet, thumbAlt, cta, thumbPosition = "50% 50%", fan, hideCta = false }: Props) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hint, setHint] = useState(false);
  // "Tap or swipe" tip on the first video, until the viewer moves on once.
  const [showTip, setShowTip] = useState(false);
  const learned = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const [peek, setPeek] = useState(false);
  const single = stories.length === 1;

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => {
    learned.current = true;
    setShowTip(false);
    if (index < stories.length - 1) setIndex(index + 1);
    else setOpen(false);
  }, [index, stories.length]);
  const prev = useCallback(() => {
    learned.current = true;
    setShowTip(false);
    if (index > 0) setIndex(index - 1);
    else if (videoRef.current) videoRef.current.currentTime = 0;
  }, [index]);
  const togglePause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  // Lock page scroll, wire up the keyboard, and hand focus back on close.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, next, prev, togglePause]);

  // Return focus to the tile after closing (not on first render).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) wasOpen.current = true;
    else if (wasOpen.current) triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Start each story from the top. Try with sound first (the tap that opened
  // the player usually allows it); if the browser refuses, play muted and
  // leave the sound button for the viewer.
  useEffect(() => {
    if (!open) return;
    const v = videoRef.current;
    if (!v) return;
    setProgress(0);
    v.currentTime = 0;
    v.muted = muted;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      void v.play().catch(() => setPaused(true));
    });
    // `muted` is read once per story on purpose; toggling it is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // Show the phone "next" arrow briefly at the start of each video.
  useEffect(() => {
    if (!open) return;
    setHint(true);
    const t = window.setTimeout(() => setHint(false), 2500);
    return () => window.clearTimeout(t);
  }, [open, index]);

  // Explain tap / swipe for a few seconds on the first video only.
  useEffect(() => {
    if (!open || single || index !== 0 || learned.current) return;
    setShowTip(true);
    const t = window.setTimeout(() => setShowTip(false), 4000);
    return () => window.clearTimeout(t);
  }, [open, index, single]);

  // Fan the cards out once when the tile comes into view, so the stack reads
  // as several films. Touch screens can't hover, so there it repeats a couple
  // of times while the tile sits on screen untouched.
  const hasFan = !!fan?.length;
  useEffect(() => {
    const el = fanRef.current;
    if (!el || !hasFan) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const touch = window.matchMedia("(hover: none)").matches;
    let shown = 0;
    let idle: number | undefined;
    let close: number | undefined;
    const doPeek = () => {
      shown += 1;
      setPeek(true);
      close = window.setTimeout(() => setPeek(false), 1300);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(idle);
        if (!entry.isIntersecting) return;
        if (shown === 0) window.setTimeout(doPeek, 350);
        if (touch) {
          idle = window.setInterval(() => {
            if (shown >= 3) window.clearInterval(idle);
            else doPeek();
          }, 7000);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(idle);
      window.clearTimeout(close);
    };
  }, [hasFan]);

  const openAt = (i: number) => {
    setIndex(i);
    setPaused(false);
    setOpen(true);
  };

  // Touch is handled here rather than through clicks, which phones don't
  // always send after a swipe. Handled touches cancel the browser's own click
  // so nothing fires twice. Mouse and keyboard still use the buttons.
  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      // Like Instagram: swipe left for the next video, right for the previous.
      e.preventDefault();
      if (single) return;
      if (dx < 0) next();
      else prev();
    } else if (dy > 80 && dy > Math.abs(dx)) {
      e.preventDefault();
      close();
    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      const zone = (e.target as HTMLElement).closest("[data-zone]")?.getAttribute("data-zone");
      if (!zone) return; // sound, close etc. keep their normal click
      e.preventDefault();
      if (zone === "next") next();
      else if (zone === "prev") prev();
      else togglePause();
    }
  };

  const story = stories[index];

  return (
    <>
      <div
        ref={fanRef}
        className={`story-fan relative w-[240px] md:w-[min(320px,calc((100svh-160px)*9/16))] lg:w-[min(380px,calc((100svh-160px)*9/16))] xl:w-[min(420px,calc((100svh-160px)*9/16))] aspect-[9/16] mx-auto ${peek ? "is-peek" : ""}`}
      >
      {fan &&
        fanSlots(fan.length).map((slot, i) => (
          <span
            key={fan[i].src}
            aria-hidden="true"
            onClick={() => openAt(fan[i].story)}
            className="story-fan-card"
            style={
              {
                "--rest": `${slot.rest}deg`,
                "--open": `${slot.open}deg`,
                "--x": `${slot.x}%`,
                zIndex: Math.abs(slot.x) > 20 ? 1 : 2,
              } as CSSProperties
            }
          >
            <img src={fan[i].src} alt="" loading="lazy" decoding="async" width={540} height={960} />
          </span>
        ))}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => openAt(0)}
        className="story-fan-front group absolute inset-0 z-[3] block w-full h-full rounded-large overflow-hidden shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        aria-haspopup="dialog"
        aria-label={hideCta ? cta : undefined}
      >
        <img
          src={thumb}
          srcSet={thumbSrcSet}
          sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, (min-width: 768px) 320px, 240px"
          alt={thumbAlt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.03]"
          style={{ objectPosition: thumbPosition }}
          loading="lazy"
          decoding="async"
          width={720}
          height={1280}
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10" />
        {/* Play mark */}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 ${hideCta ? "top-1/2" : "top-[42%]"} -translate-x-1/2 -translate-y-1/2 grid place-items-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-sm shadow-on-photo transition-transform duration-quick group-hover:scale-110`}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-9 md:h-9 ml-1 fill-[hsl(var(--text-primary))]">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
        {/* How many videos are inside, so the series is obvious before tapping. */}
        {!single && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 inline-flex items-center gap-1.5 rounded-small bg-black/50 backdrop-blur-sm px-2.5 py-1 t-label text-white">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth={2} strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="7" width="13" height="14" rx="2" />
              <path d="M8 3h11a2 2 0 0 1 2 2v12" />
            </svg>
            {stories.length} videos
          </span>
        )}
        {!hideCta && (
          <span className="absolute left-3 right-3 bottom-4 md:left-5 md:right-5 md:bottom-5 btn-solid-rf accent justify-center !px-3 !gap-2 whitespace-nowrap">
            {cta} <span aria-hidden="true">→</span>
          </span>
        )}
      </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cta}
          className="fixed inset-0 z-modal grid place-items-center bg-black/95 touch-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative h-[100dvh] w-full md:h-[min(88dvh,calc(100vw*16/9))] md:w-auto md:aspect-[9/16]">
          <div className="absolute inset-0 md:rounded-large overflow-hidden bg-black">
            <video
              ref={videoRef}
              key={story.src}
              src={story.src}
              poster={story.poster}
              playsInline
              preload="auto"
              aria-label={story.label}
              className="absolute inset-0 w-full h-full object-contain md:object-cover"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress(v.currentTime / v.duration);
              }}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              onEnded={next}
            />

            {/* Tap zones: previous / next, or pause for a single video. */}
            {single ? (
              <button type="button" className="absolute inset-0 w-full h-full cursor-pointer" data-zone="pause" aria-label={paused ? "Play" : "Pause"} onClick={togglePause} />
            ) : (
              <>
                <button type="button" className="absolute left-0 top-0 h-full w-1/3 cursor-w-resize" data-zone="prev" aria-label="Previous video" onClick={prev} />
                <button type="button" className="absolute right-0 top-0 h-full w-2/3 cursor-e-resize" data-zone="next" aria-label="Next video" onClick={next} />
              </>
            )}

            {/* Dark fades so the bars, buttons and counter read over bright footage. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
            {!single && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 to-transparent" />}

            {/* Progress bars, one per video */}
            <div className="absolute top-3 left-3 right-3 flex gap-1.5 pointer-events-none" aria-hidden="true">
              {stories.map((s, i) => (
                <span key={s.src} className="h-[4px] md:h-[5px] flex-1 rounded-full bg-white/40 overflow-hidden">
                  <span
                    className="block h-full bg-white transition-[width] duration-quick ease-linear"
                    style={{ width: `${i < index ? 100 : i === index ? progress * 100 : 0}%` }}
                  />
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="absolute top-7 left-3 grid place-items-center w-11 h-11 rounded-full bg-black/35 text-white"
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 9h3l5-4v14l-5-4H4z" />
                {muted ? <path d="M16 9l5 6M21 9l-5 6" /> : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />}
              </svg>
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="absolute top-7 right-3 grid place-items-center w-11 h-11 rounded-full bg-black/35 text-white"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Bottom: which video of how many (announced to screen readers
                too), with a short "tap or swipe" tip above it at the start. */}
            {!single && (
              <div className="pointer-events-none absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`rounded-full bg-black/45 px-4 py-2 t-meta text-white transition-opacity duration-slow ${showTip ? "opacity-100" : "opacity-0"}`}
                >
                  Tap or swipe for the next video
                </span>
                <span
                  aria-live="polite"
                  className="h-9 inline-flex items-center rounded-full bg-black/35 px-4 t-label text-white tabular-nums"
                >
                  <span className="sr-only">Video </span>
                  {index + 1} of {stories.length}
                </span>
              </div>
            )}

            {/* Phones: a "there's more" arrow at the right edge for the first
                moments of each video. Taps fall through to the next zone. */}
            {!single && index < stories.length - 1 && (
              <span
                aria-hidden="true"
                className={`md:hidden pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-black/40 text-white transition-opacity duration-slow ${hint ? "opacity-100" : "opacity-0"}`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
              </span>
            )}

            {paused && (
              <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-16 h-16 rounded-full bg-black/40">
                <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1 fill-white"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
            )}
          </div>

            {/* Laptop and up: big previous / next arrows either side of the video. */}
            {!single && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  disabled={index === 0}
                  className="hidden md:grid absolute right-full mr-6 top-1/2 -translate-y-1/2 place-items-center w-14 h-14 rounded-full bg-white/90 text-[hsl(var(--text-primary))] transition hover:scale-105 hover:bg-white disabled:opacity-30 disabled:hover:scale-100"
                  aria-label="Previous video"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="hidden md:grid absolute left-full ml-6 top-1/2 -translate-y-1/2 place-items-center w-14 h-14 rounded-full bg-white/90 text-[hsl(var(--text-primary))] transition hover:scale-105 hover:bg-white"
                  aria-label={index < stories.length - 1 ? "Next video" : "Close"}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoryVideos;
