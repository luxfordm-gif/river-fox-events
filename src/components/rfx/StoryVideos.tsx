import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

/* One portrait thumbnail that opens a full-screen, Instagram-story style
   player. Videos only load once the tile is tapped, so the page itself only
   pays for the thumbnail. With several videos they play in order with
   progress bars; tap right for next, left for previous. */

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
  /** Text on the button over the thumbnail. */
  cta: string;
  /** Focal point for the thumbnail crop, e.g. "50% 40%". */
  thumbPosition?: string;
};

const StoryVideos = ({ stories, thumb, thumbSrcSet, thumbAlt, cta, thumbPosition = "50% 50%" }: Props) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchY = useRef<number | null>(null);
  const single = stories.length === 1;

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => {
    if (index < stories.length - 1) setIndex(index + 1);
    else setOpen(false);
  }, [index, stories.length]);
  const prev = useCallback(() => {
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

  const openAt = (i: number) => {
    setIndex(i);
    setPaused(false);
    setOpen(true);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchY.current !== null && e.changedTouches[0].clientY - touchY.current > 80) close();
    touchY.current = null;
  };

  const story = stories[index];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => openAt(0)}
        className="group relative block w-[240px] md:w-[256px] aspect-[9/16] rounded-[16px] overflow-hidden mx-auto shadow-[0_18px_40px_-18px_hsl(var(--ink)/0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        aria-haspopup="dialog"
      >
        <img
          src={thumb}
          srcSet={thumbSrcSet}
          sizes="(min-width: 768px) 256px, 240px"
          alt={thumbAlt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 grid place-items-center w-16 h-16 rounded-full bg-white/85 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1 fill-[hsl(var(--ink))]">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
        <span className="absolute left-3 right-3 bottom-4 btn-solid-rf accent justify-center !px-3 !gap-2 whitespace-nowrap">
          {cta} <span aria-hidden="true">→</span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cta}
          className="fixed inset-0 z-[200] grid place-items-center bg-black/90"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative h-[100dvh] w-full md:h-[min(92dvh,calc(100vw*16/9))] md:w-auto md:aspect-[9/16] md:rounded-[18px] overflow-hidden bg-black">
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
              <button type="button" className="absolute inset-0 w-full h-full cursor-pointer" aria-label={paused ? "Play" : "Pause"} onClick={togglePause} />
            ) : (
              <>
                <button type="button" className="absolute left-0 top-0 h-full w-1/3 cursor-w-resize" aria-label="Previous video" onClick={prev} />
                <button type="button" className="absolute right-0 top-0 h-full w-2/3 cursor-e-resize" aria-label="Next video" onClick={next} />
              </>
            )}

            {/* Progress bars */}
            <div className="absolute top-3 left-3 right-3 flex gap-1 pointer-events-none" aria-hidden="true">
              {stories.map((s, i) => (
                <span key={s.src} className="h-[3px] flex-1 rounded-full bg-white/35 overflow-hidden">
                  <span
                    className="block h-full bg-white transition-[width] duration-200 ease-linear"
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

            {paused && (
              <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-16 h-16 rounded-full bg-black/40">
                <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1 fill-white"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoryVideos;
