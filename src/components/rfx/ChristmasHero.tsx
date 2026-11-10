import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import "@/styles/christmas.css";
import "@/styles/christmas-hero.css";

import familyVideo169 from "@/assets/home/christmas-hero/christmas-ready-family-garland-montage-16x9.mp4";
import familyVideo916 from "@/assets/home/christmas-hero/christmas-ready-family-garland-montage-9x16.mp4";
import familyPoster960 from "@/assets/home/christmas-hero/family-cheering-under-jewel-bauble-door-garland-960.webp";
import familyPoster1440 from "@/assets/home/christmas-hero/family-cheering-under-jewel-bauble-door-garland-1440.webp";
import familyPoster1920 from "@/assets/home/christmas-hero/family-cheering-under-jewel-bauble-door-garland-1920.webp";
import familyPosterTall480 from "@/assets/home/christmas-hero/family-cheering-under-jewel-bauble-door-garland-portrait-480.webp";
import familyPosterTall720 from "@/assets/home/christmas-hero/family-cheering-under-jewel-bauble-door-garland-portrait-720.webp";
import bizVideo169 from "@/assets/christmas/business-hero/christmas-ready-pizzeria-garland-film-16x9.mp4";
import bizVideo916 from "@/assets/christmas/business-hero/christmas-ready-pizzeria-garland-film-9x16.mp4";
import bizPoster960 from "@/assets/christmas/business-hero/pizzeria-chef-cheering-under-red-gold-door-garland-960.webp";
import bizPoster1440 from "@/assets/christmas/business-hero/pizzeria-chef-cheering-under-red-gold-door-garland-1440.webp";
import bizPoster1920 from "@/assets/christmas/business-hero/pizzeria-chef-cheering-under-red-gold-door-garland-1920.webp";
import bizPosterTall480 from "@/assets/christmas/business-hero/pizzeria-chef-cheering-under-red-gold-door-garland-portrait-480.webp";
import bizPosterTall720 from "@/assets/christmas/business-hero/pizzeria-chef-cheering-under-red-gold-door-garland-portrait-720.webp";

/* Two films (Matt, 2026-11-10): the family one on home and the door
   garlands page, the pizzeria one only on the business Christmas page. Same
   headline, each with its own sub line. */
const FILMS = {
  family: {
    video169: familyVideo169,
    video916: familyVideo916,
    poster960: familyPoster960,
    poster1440: familyPoster1440,
    poster1920: familyPoster1920,
    posterTall480: familyPosterTall480,
    posterTall720: familyPosterTall720,
    text: (
      <>
        Garlands so good your neighbours
        <br className="hidden md:inline" /> will take it&nbsp;personally.
      </>
    ),
  },
  business: {
    video169: bizVideo169,
    video916: bizVideo916,
    poster960: bizPoster960,
    poster1440: bizPoster1440,
    poster1920: bizPoster1920,
    posterTall480: bizPosterTall480,
    posterTall720: bizPosterTall720,
    text: (
      <>
        Give your shopfront the Christmas it deserves.
        {/* Three even lines from tablet up, so "your hours" isn't left alone. */}
        <br className="hidden md:inline" /> Fresh spruce or faux garlands,
        <br className="hidden md:inline" /> fitted around your&nbsp;hours.
      </>
    ),
  },
} as const;

const PAGE = "/christmas-door-garlands/";

/* Phones and portrait tablets get the 9:16 cut, everything else the 16:9. */
const TALL = "(orientation: portrait)";

/* The faces "Be Christmas ready." cuts between, in order (christmas-hero.css
   styles each one). Fraunces comes first so the page opens, and settles with
   reduced motion, on the brand serif. */
const FACES = ["serif", "poster", "script", "sans", "fat", "italic"] as const;
const EXTRA_FONTS = ["Anton", "Great Vibes", "Abril Fatface"];

/* How long each face holds before the next cut. Maple's runs at about half a
   second; a touch slower suits River Fox. */
const STEP_MS = 600;

/**
 * Home page Christmas hero (Matt, 2026-11-10, after getmaple.ca): the
 * "Christmas ready." family montage loops full width under the nav, and the
 * headline, "Be Christmas ready." (Matt's wording), flicks between six
 * typefaces over it, then Matt's sub line and a button to the Christmas page.
 *
 * The headline is live text, not a Lottie or GIF: sharp at any size, a few KB,
 * and readable by search engines. Only the first face is in the prerendered
 * HTML; the other five join once their fonts have loaded, so the flicker never
 * shows a fallback font. The video is chosen after load (so the static page
 * only carries the poster), skipped with reduced motion or Save-Data, and
 * paused, with the flicker, whenever the hero is off screen.
 *
 * Two layouts (Matt, 2026-11-10: "on the homepage, because most people land
 * there, and on the Christmas pages"):
 *   top  - home: first thing under the nav, a little shorter than the screen
 *          so the next section peeks in.
 *   zoom - Christmas pages, below the hero intro: no button (you're already
 *          there), a little shorter, and starts small with rounded corners,
 *          growing to full width as it scrolls up the screen (the page's own
 *          scroll, a transform so it stays smooth). Its video is only fetched
 *          as it comes near.
 */
type Props = {
  variant?: "top" | "zoom";
  /** false hides the button. */
  cta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  onCtaClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Which film and sub line: the family one, or the pizzeria for businesses. */
  film?: keyof typeof FILMS;
};

/* Zoom layout: the size it starts at, and how much the growth is held back
   for the second half of the scroll (1 = steady; higher = slower start).
   Matt, 2026-11-10: halfway between the first try (0.84, steady) and 0.6 / 1.6. */
const ZOOM_FROM = 0.72;
const ZOOM_EASE = 1.3;

const ChristmasHero = ({
  variant = "top",
  cta = true,
  ctaHref = PAGE,
  ctaLabel = "Book your Christmas garland",
  onCtaClick,
  film = "family",
}: Props) => {
  const { video169, video916, poster960, poster1440, poster1920, posterTall480, posterTall720, text } =
    FILMS[film];
  const zoom = variant === "zoom";
  const wrapRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(!zoom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flickRef = useRef<HTMLSpanElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Zoom layout: wait until it's within a screen of view before fetching video.
  useEffect(() => {
    if (near) return;
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const onGrow = useCallback(
    (p: number) => {
      const frame = sectionRef.current;
      if (!zoom || !frame) return;
      const e = Math.pow(p, ZOOM_EASE);
      const scale = ZOOM_FROM + (1 - ZOOM_FROM) * e;
      frame.style.setProperty("--zoom", scale.toFixed(4));
      // Corners stay the Large radius on screen, easing to square at full width.
      frame.style.setProperty("--corner", ((1 - e) / scale).toFixed(4));
    },
    [zoom]
  );
  useScrollProgress(wrapRef, onGrow, { from: 1, to: 0.12 });

  // Pick the cut for this screen shape, and swap if the phone turns.
  useEffect(() => {
    if (!near || reduced()) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const mq = window.matchMedia(TALL);
    const pick = () => setVideoSrc(mq.matches ? video916 : video169);
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, [near, video169, video916]);

  // Start the flicker once the extra faces are in. Until Google's stylesheet
  // has arrived, load() finds no matching face and returns nothing, so keep
  // asking for a few seconds (on a cold phone load it lands after this runs).
  useEffect(() => {
    if (reduced() || !document.fonts?.load) return;
    let cancelled = false;
    let tries = 0;
    let t = 0;
    const attempt = () => {
      Promise.all(EXTRA_FONTS.map((f) => document.fonts.load(`1em "${f}"`, "Be Christmas ready.")))
        .then((sets) => {
          if (cancelled) return;
          if (sets.every((s) => s.length > 0)) setFontsReady(true);
          else if (++tries < 16) t = window.setTimeout(attempt, 400);
        })
        .catch(() => {
          /* a font failed: stay on Fraunces */
        });
    };
    attempt();
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  // Cut between faces while the hero is on screen; pause the video with it.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let timer = 0;
    let face = 0;
    const show = (i: number) => {
      const el = flickRef.current;
      if (el) el.dataset.face = String(i);
    };
    const start = () => {
      if (!fontsReady || timer) return;
      timer = window.setInterval(() => {
        face = (face + 1) % FACES.length;
        show(face);
      }, STEP_MS);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      const v = videoRef.current;
      if (entry.isIntersecting) {
        start();
        if (v && v.paused) v.play().catch(() => {});
      } else {
        stop();
        if (v && !v.paused) v.pause();
      }
    });
    io.observe(section);
    return () => {
      stop();
      io.disconnect();
    };
  }, [fontsReady, videoSrc]);

  const frame = (
    <div
      id="christmas-hero"
      ref={sectionRef}
      className={`rfx-xmas xhero xhero--${variant}${playing ? " is-playing" : ""}`}
    >
      <div className="xhero__media" aria-hidden="true">
        <picture>
          <source
            media={TALL}
            srcSet={`${posterTall480} 480w, ${posterTall720} 720w`}
            sizes="100vw"
            width={720}
            height={1280}
          />
          <img
            src={poster1440}
            srcSet={`${poster960} 960w, ${poster1440} 1440w, ${poster1920} 1920w`}
            sizes="100vw"
            alt=""
            width={1920}
            height={1080}
            loading={zoom ? "lazy" : "eager"}
            fetchPriority={zoom ? "auto" : "high"}
            decoding="async"
            className="xhero__poster"
          />
        </picture>
        {videoSrc && (
          <video
            key={videoSrc}
            ref={videoRef}
            className="xhero__video"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onPlaying={() => setPlaying(true)}
          />
        )}
      </div>

      <div className="xhero__content container-rfx">
        <h2 id="christmas-hero-heading" className="xhero__title">
          <span className="sr-only">Be Christmas ready.</span>
          <span ref={flickRef} className="xhero__flick" data-face="0" aria-hidden="true">
            {(fontsReady ? FACES : FACES.slice(0, 1)).map((f) => (
              <span key={f} className={`xhero__face xhero__face--${f}`}>
                {/* Phones: "Be" on a line of its own, as "Be Christmas" won't fit. */}
                Be
                <br className="md:hidden" />
                <span className="hidden md:inline"> </span>
                Christmas
                <br />
                ready.
              </span>
            ))}
          </span>
        </h2>
        {/* One line, a step up from body text (Matt, 2026-11-10). */}
        <p className="t-h4 xhero__text">{text}</p>
        {cta && (
          <a href={ctaHref} onClick={onCtaClick} className="btn-solid-rf accent xhero__cta">
            {ctaLabel} <span className="t-icon">→</span>
          </a>
        )}
      </div>
    </div>
  );

  return (
    <section
      ref={wrapRef}
      className={zoom ? "rfx-section white xhero-zoom" : "xhero-top"}
      aria-labelledby="christmas-hero-heading"
    >
      {frame}
    </section>
  );
};

export default ChristmasHero;
