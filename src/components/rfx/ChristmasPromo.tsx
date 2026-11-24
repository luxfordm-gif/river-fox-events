import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import "@/styles/christmas.css";
import { christmasOn } from "@/lib/announcementBar";
import { trackEvent } from "@/lib/track";

import bow160 from "@/assets/christmas/burgundy-velvet-bow-160.webp";
import pine160 from "@/assets/christmas/pine-branch-fairy-lights-frosted-cone-160.webp";
import pine320 from "@/assets/christmas/pine-branch-fairy-lights-frosted-cone-320.webp";
import pine480 from "@/assets/christmas/pine-branch-fairy-lights-frosted-cone-480.webp";
import imgGeorgian from "@/assets/christmas/instagram/georgian-door-gold-champagne-garland.webp";
import imgPilates from "@/assets/christmas/instagram/pink-pilates-studio-garland-blush-red-baubles.webp";
import imgNavy from "@/assets/christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp";
import imgReigate from "@/assets/christmas/instagram/reigate-restaurant-red-gold-garland-blue-doors.webp";
// MOCK-UP (Matt, 2026-11-24): a stand-in loop made from the Worplesdon porch
// photos. Swap in a short cut of Laura's Worplesdon time-lapse (2:3, 576x864,
// no sound, under 1MB) with the same file name pattern.
import promoVideo from "@/assets/christmas/video/worplesdon-porch-garland-standin-2x3.mp4";
import promoPoster from "@/assets/christmas/video/worplesdon-porch-garland-poster-2x3.webp";

const PAGE = "/christmas-door-garlands/";
const DISMISS_KEY = "rfx-xmas-promo-dismissed";
const DESKTOP = "(min-width: 768px)";

/** Which version a visitor saw, for the promo_* events: the video card or the phone photo bar. */
const variant = () => (window.matchMedia(DESKTOP).matches ? "video_card" : "photo_bar");

/* Phone bar only. Decorative: the card's link carries the meaning, so these alts stay empty. */
const DECK = [imgGeorgian, imgPilates, imgNavy, imgReigate];


/**
 * Floating "Christmas door garlands" card, pinned bottom-right (a slim bar
 * along the bottom on phones).
 *
 * MOCK-UP (Matt, 2026-11-24): on desktop, a card filled by a looping video
 * of a garland going up, the words over the video (like the Black Friday
 * card Matt shared). Phones keep the bar as it was (Matt, 2026-11-24): a
 * small deck of doorway photos that shuffles, on deep pine green with a lit
 * spruce branch on the right edge.
 *
 * Shows about a second after load, once the cookie banner (which uses the
 * same corner) has been answered. Closing it is remembered. Never shows
 * on the Christmas page itself, nor while the home Christmas video hero is
 * on screen (Matt, 2026-11-10). Uses the Christmas edition's colours by
 * carrying the .rfx-xmas class.
 */
const ChristmasPromo = () => {
  const [show, setShow] = useState(false);
  const [front, setFront] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Gone with the rest of the Christmas campaign (3 January 2027).
    if (!christmasOn()) return;
    if (window.location.pathname.startsWith("/christmas-door-garlands")) return;
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      /* storage blocked: still fine to show */
    }
    const consentAnswered = () => {
      try {
        const c = localStorage.getItem("rfx-consent");
        return c === "granted" || c === "denied";
      } catch {
        return true;
      }
    };
    // Appear about a second after load. If the cookie banner (same corner)
    // is still waiting for an answer, check again until it's been answered.
    let t = 0;
    // While the home page's Christmas video hero is on screen the card would
    // only repeat it, so it waits until the hero has scrolled away.
    const hero = document.getElementById("christmas-hero");
    let heroInView = !!hero;
    let ready = false;
    const update = () => setShow(ready && !heroInView);
    const io = hero
      ? new IntersectionObserver(([e]) => {
          heroInView = e.isIntersecting;
          update();
        })
      : null;
    if (hero && io) io.observe(hero);
    const tryShow = () => {
      if (consentAnswered()) {
        ready = true;
        update();
      } else t = window.setTimeout(tryShow, 600);
    };
    t = window.setTimeout(tryShow, 1100);
    return () => {
      window.clearTimeout(t);
      io?.disconnect();
    };
  }, []);

  // Counted once per page view, so clicks can be read against views.
  useEffect(() => {
    if (show) trackEvent("promo_view", { location: "promo", variant: variant() });
  }, [show]);

  // The video only downloads and plays once the card is on screen, and stays
  // on its poster (the finished door) with reduced motion.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!show) {
      v.pause();
      return;
    }
    // Desktop only: phones show the photo deck and never fetch the video.
    if (!window.matchMedia(DESKTOP).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {
      /* autoplay refused: the poster stays, which is fine */
    });
  }, [show]);

  // Phone bar: every few seconds the front photo slides out and tucks in at the back.
  useEffect(() => {
    if (!show) return;
    if (window.matchMedia(DESKTOP).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setFront((f) => (f + 1) % DECK.length), 3200);
    return () => window.clearInterval(t);
  }, [show]);

  const onPromoClick = () =>
    trackEvent("promo_click", { location: "promo", variant: variant(), transport_type: "beacon" });

  const dismiss = () => {
    trackEvent("promo_close", { location: "promo", variant: variant() });
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* not remembered, that's all */
    }
  };

  return (
    <aside
      className={`rfx-xmas xmas-promo${show ? " is-shown" : ""}`}
      aria-label="Christmas door garlands"
      aria-hidden={show ? undefined : true}
    >
      <img src={bow160} alt="" aria-hidden="true" className="xmas-promo__bow" width={160} height={165} />
      <button type="button" className="xmas-promo__close" onClick={dismiss} aria-label="Close" tabIndex={show ? 0 : -1}>
        <X size={16} strokeWidth={1.8} />
      </button>

      {/* Phone bar: decorative branch, clipped by the card's rounded corners. */}
      <span className="xmas-promo__pine" aria-hidden="true">
        <img
          src={pine320}
          srcSet={`${pine160} 160w, ${pine320} 320w, ${pine480} 480w`}
          sizes="150px"
          alt=""
          width={320}
          height={428}
          loading="lazy"
          decoding="async"
        />
      </span>
      <div className="xmas-promo__deck" aria-hidden="true">
        {DECK.map((src, i) => {
          const pos = (i - front + DECK.length) % DECK.length; // 0 = front
          return (
            <img
              key={src}
              src={src}
              alt=""
              className="xmas-promo__card"
              data-pos={pos}
              width={560}
              height={700}
              loading="lazy"
              fetchPriority="low"
              decoding="async"
            />
          );
        })}
      </div>

      {/* Desktop card: the video fills it. Decorative: the link carries the meaning. */}
      <div className="xmas-promo__media" aria-hidden="true">
        <video
          ref={videoRef}
          src={promoVideo}
          poster={promoPoster}
          muted
          loop
          playsInline
          preload="none"
          width={576}
          height={864}
        />
      </div>

      {/* Desktop card: centred, with a solid button. */}
      <div className="xmas-promo__body hidden md:flex">
        <p className="t-overline text-ink-soft">Now booking</p>
        <h2 className="xmas-promo__title xmas-promo__title--card t-h5">
          <span className="xmas-promo__line">Get your Christmas</span>
          <br />
          <em className="t-accent">garlands.</em>
        </h2>
        {/* Opens the top of the Christmas page, not its form (Matt, 2026-11-08). */}
        <a href={PAGE} className="btn-solid-rf accent xmas-promo__cta" tabIndex={show ? 0 : -1} onClick={onPromoClick}>
          Find out more <span>→</span>
        </a>
      </div>

      {/* Phone bar: lighter, a text link instead of a chunky button (Matt,
          2026-11-04). */}
      <div className="xmas-promo__body md:hidden">
        <h2 className="xmas-promo__title t-h5">A little Christmas magic.</h2>
        <a href={PAGE} className="btn-link-rf xmas-promo__link" tabIndex={show ? 0 : -1} onClick={onPromoClick}>
          Explore garlands <span className="arr">→</span>
        </a>
      </div>
    </aside>
  );
};

export default ChristmasPromo;
