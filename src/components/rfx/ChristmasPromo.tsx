import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "@/styles/christmas.css";

import bow160 from "@/assets/christmas/burgundy-velvet-bow-160.webp";
import pine160 from "@/assets/christmas/pine-branch-fairy-lights-frosted-cone-160.webp";
import pine320 from "@/assets/christmas/pine-branch-fairy-lights-frosted-cone-320.webp";
import pine480 from "@/assets/christmas/pine-branch-fairy-lights-frosted-cone-480.webp";
import imgGeorgian from "@/assets/christmas/instagram/georgian-door-gold-champagne-garland.webp";
import imgPilates from "@/assets/christmas/instagram/pink-pilates-studio-garland-blush-red-baubles.webp";
import imgNavy from "@/assets/christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp";
import imgReigate from "@/assets/christmas/instagram/reigate-restaurant-red-gold-garland-blue-doors.webp";

const PAGE = "/christmas-door-garlands/";
const DISMISS_KEY = "rfx-xmas-promo-dismissed";

/* Decorative: the card's link carries the meaning, so these alts stay empty. */
const DECK = [imgGeorgian, imgPilates, imgNavy, imgReigate];

/**
 * Floating "Christmas door garlands" card, pinned bottom-right (a slim bar
 * along the bottom on phones). A small deck of doorway photos shuffles: every
 * few seconds the front photo slides out and tucks in at the back.
 *
 * Deep pine green with a lit spruce branch on the right edge (Matt,
 * 2026-11-09: the cream version blended into the page).
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

  useEffect(() => {
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

  useEffect(() => {
    if (!show) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setFront((f) => (f + 1) % DECK.length), 3200);
    return () => window.clearInterval(t);
  }, [show]);

  const dismiss = () => {
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
      {/* Decorative branch, clipped by the card's rounded corners. */}
      <span className="xmas-promo__pine" aria-hidden="true">
        <img
          src={pine320}
          srcSet={`${pine160} 160w, ${pine320} 320w, ${pine480} 480w`}
          sizes="(max-width: 767px) 150px, 200px"
          alt=""
          width={320}
          height={428}
          decoding="async"
        />
      </span>
      <button type="button" className="xmas-promo__close" onClick={dismiss} aria-label="Close" tabIndex={show ? 0 : -1}>
        <X size={16} strokeWidth={1.8} />
      </button>

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
              decoding="async"
            />
          );
        })}
      </div>

      {/* Desktop card: centred, with a solid button. */}
      <div className="xmas-promo__body hidden md:block">
        <p className="t-overline text-ink-soft">Now booking</p>
        <h2 className="xmas-promo__title t-h5">
          Get your Christmas{" "}
          <br />
          <em className="t-accent">garlands.</em>
        </h2>
        <p className="xmas-promo__text t-meta">Fresh or faux, styled to your door.</p>
        {/* Opens the top of the Christmas page, not its form (Matt, 2026-11-08). */}
        <a href={PAGE} className="btn-solid-rf accent xmas-promo__cta" tabIndex={show ? 0 : -1}>
          Find out more <span>→</span>
        </a>
      </div>

      {/* Phone bar: lighter, a text link instead of a chunky button (Matt,
          2026-11-04). */}
      <div className="xmas-promo__body md:hidden">
        <h2 className="xmas-promo__title t-h5">A little Christmas magic.</h2>
        <a href={PAGE} className="btn-link-rf xmas-promo__link" tabIndex={show ? 0 : -1}>
          Explore garlands <span className="arr">→</span>
        </a>
      </div>
    </aside>
  );
};

export default ChristmasPromo;
