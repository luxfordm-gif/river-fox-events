import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

const DISMISS_KEY = "rfx-booking-bar-dismissed";

/* Pages where the bar would repeat something already there: these have their
   own booking button, a different bottom bar, or aren't for visitors. */
const SKIP = ["/contact", "/our-work", "/christmas-door-garlands", "/style-guide", "/brand-book"];

/**
 * Floating booking bar, phones only (Matt, 2026-11-17). A slim rounded bar
 * lifts up from the bottom once the visitor has scrolled past the first
 * screen, on every page, so the enquiry form is always one tap away. The tap
 * scrolls to the form on pages that have one and otherwise opens the home
 * page form (`handleEnquireClick`).
 *
 * Stays out of the way: hidden while the enquiry form is on screen, while
 * the cookie notice is unanswered, while the home page's Christmas card is
 * open (same slot), and for the rest of the visit once closed.
 */
const BookingBar = () => {
  const [show, setShow] = useState(false);
  const closed = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) closed.current = true;
    } catch {
      /* storage blocked: still fine to show */
    }
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      if (closed.current) return;
      const path = window.location.pathname;
      const skipped = SKIP.some((p) => path.startsWith(p));
      let consent = true;
      try {
        const c = localStorage.getItem("rfx-consent");
        consent = c === "granted" || c === "denied";
      } catch {
        /* storage blocked */
      }
      const form = document.getElementById("enquire")?.getBoundingClientRect();
      const formInView = !!form && form.top < window.innerHeight && form.bottom > 0;
      const xmasOpen = !!document.querySelector(".xmas-promo.is-shown");
      setShow(
        phone.matches && !skipped && consent && !formInView && !xmasOpen &&
          window.scrollY > window.innerHeight * 0.8
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const poll = window.setInterval(update, 1000); // cookie answer, Christmas card, page changes
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearInterval(poll);
    };
  }, []);

  const dismiss = () => {
    closed.current = true;
    setShow(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* not remembered, that's all */
    }
  };

  return (
    <aside
      className={`booking-bar${show ? " is-shown" : ""}`}
      aria-label="Book Laura"
      aria-hidden={show ? undefined : true}
    >
      <span className="booking-bar__msg t-meta">Limited dates<br />each month</span>
      <a
        href={ENQUIRE_HREF}
        onClick={handleEnquireClick}
        className="booking-bar__btn t-label"
        data-track-location="booking-bar"
        tabIndex={show ? undefined : -1}
      >
        Reserve your date <span aria-hidden="true">→</span>
      </a>
      <button type="button" className="booking-bar__close" aria-label="Close" onClick={dismiss} tabIndex={show ? undefined : -1}>
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  );
};

export default BookingBar;
