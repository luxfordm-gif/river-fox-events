import { useEffect, useState } from "react";
import { handleEnquireClick } from "@/lib/enquire";
import { lineFor, splitLine, targetFor } from "@/lib/announcementBar";
import { trackEvent } from "@/lib/track";

/**
 * Announcement bar pinned to the very top of every page, phones only (Matt,
 * 2026-11-17, like Wispr Flow's). It stays put while the page scrolls and the
 * fixed nav sits just under it. The words live in `src/data/announcementBar.ts`;
 * this only shows them. The whole bar is the link, and the part after the
 * first full stop or question mark is underlined.
 *
 * While <html data-top-bar="on"> the page, nav, menu and #section jumps all
 * move down by `--bar-height` (index.css). A tap sends `announcement_bar_click`
 * (page path and the line), after cookie consent like every other event.
 */
const BookingBar = () => {
  const [path, setPath] = useState("");
  const [hasForm, setHasForm] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const p = window.location.pathname;
      setPath(p);
      setHasForm(!!document.getElementById("enquire"));
      if (phone.matches && lineFor(p)) root.setAttribute("data-top-bar", "on");
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

  const line = path ? lineFor(path) : null;
  if (!line || (typeof window !== "undefined" && !window.matchMedia("(max-width: 767px)").matches)) return null;
  const { href, samePage } = targetFor(line, path, hasForm);
  const { lead, link, arrow } = splitLine(line.text);
  return (
    <aside className="top-bar" aria-label="Announcement">
      <a
        href={href}
        onClick={(e) => {
          trackEvent("announcement_bar_click", {
            line_text: line.text.replace(/\s*→$/, ""),
            transport_type: "beacon",
          });
          if (samePage) handleEnquireClick(e);
        }}
        className="top-bar__link t-label"
        data-track-skip
      >
        {lead && <>{lead} </>}
        <span className="top-bar__go">
          {link}
          {arrow && <> <span aria-hidden="true">→</span></>}
        </span>
      </a>
    </aside>
  );
};

export default BookingBar;
