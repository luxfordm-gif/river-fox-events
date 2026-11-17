import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

/* Pages where the bar would repeat a booking button already there, or isn't
   for visitors. */
const SKIP = ["/contact", "/christmas-door-garlands", "/style-guide", "/brand-book"];

/**
 * Booking strip pinned to the very top of every page, phones only (Matt,
 * 2026-11-17, like Wispr Flow's announcement bar). It stays put while the
 * page scrolls and the fixed nav sits just under it. The whole strip is
 * the link: one tap to the enquiry form, which `handleEnquireClick` scrolls
 * to on pages that have one and otherwise opens on the home page.
 *
 * While <html data-top-bar="on"> the page, nav, menu and #section jumps all
 * move down by `--bar-height` (index.css).
 */
const BookingBar = () => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const skipped = SKIP.some((p) => window.location.pathname.startsWith(p));
      const show = phone.matches && !skipped;
      setOn(show);
      if (show) root.setAttribute("data-top-bar", "on");
      else root.removeAttribute("data-top-bar");
    };
    update();
    window.addEventListener("resize", update);
    const poll = window.setInterval(update, 800); // page changes inside the site
    return () => {
      window.removeEventListener("resize", update);
      window.clearInterval(poll);
      root.removeAttribute("data-top-bar");
    };
  }, []);

  if (!on) return null;
  return (
    <aside className="top-bar" aria-label="Book Laura">
      <a
        href={ENQUIRE_HREF}
        onClick={handleEnquireClick}
        className="top-bar__link t-label"
        data-track-location="top-bar"
      >
        Limited dates each month. Reserve your date <ChevronRight size={16} aria-hidden="true" className="top-bar__chev" />
      </a>
    </aside>
  );
};

export default BookingBar;
