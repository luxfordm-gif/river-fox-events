import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

/* Pages where the bar would repeat a booking button already there, or isn't
   for visitors. */
const SKIP = ["/contact", "/christmas-door-garlands", "/style-guide", "/brand-book"];

/**
 * Booking strip at the very top of every page, phones only (Matt,
 * 2026-11-17, like Wispr Flow's announcement bar). It sits above the nav and
 * scrolls away with the page; the fixed nav starts below it and slides up to
 * the top as the strip leaves (`--bar-offset`, set here). The whole strip is
 * the link: one tap to the enquiry form, which `handleEnquireClick` scrolls
 * to on pages that have one and otherwise opens on the home page.
 *
 * While <html data-top-bar="on"> the page is pushed down by `--bar-height`
 * (index.css). Hidden while the phone menu is open.
 */
const BookingBar = () => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const skipped = SKIP.some((p) => window.location.pathname.startsWith(p));
      const menuOpen = document.body.style.overflow === "hidden";
      const show = phone.matches && !skipped && !menuOpen;
      setOn(show);
      if (show) root.setAttribute("data-top-bar", "on");
      else root.removeAttribute("data-top-bar");
      const bar = parseFloat(getComputedStyle(root).getPropertyValue("--bar-height")) || 0;
      root.style.setProperty("--bar-offset", `${show ? Math.max(0, bar - window.scrollY) : 0}px`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const mo = new MutationObserver(update);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    const poll = window.setInterval(update, 800); // page changes inside the site
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mo.disconnect();
      window.clearInterval(poll);
      root.removeAttribute("data-top-bar");
      root.style.removeProperty("--bar-offset");
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
