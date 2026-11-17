import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { handleEnquireClick } from "@/lib/enquire";
import { lineFor, splitLine, targetFor } from "@/lib/announcementBar";
import { trackEvent } from "@/lib/track";
import type { BarLine } from "@/data/announcementBar";

/**
 * Announcement bar (Matt, 2026-11-17, like Wispr Flow's). One slim strip with a
 * short lead-in and a link ending in a chevron; the whole bar is tappable.
 *
 * Two parts:
 *  - `AnnouncementBarView` is just the look: a line, a link, and (when
 *    `pinned`) fixed to the top of the screen. The style guide uses it too.
 *  - `AnnouncementBar` (default export) is the site-wide one, mounted once in
 *    App.tsx. It picks the line for the page from `src/data/announcementBar.ts`,
 *    works out where a tap goes, and sends `announcement_bar_click` (page path
 *    and the line) after cookie consent like every other event.
 *
 * Phones only. While <html data-announcement-bar="on"> the page, nav, phone
 * menu and #section jumps all move down by `--announcement-height` (index.css).
 * Colours, height and padding are tokens in `:root`; nothing here is a one-off.
 */
export const AnnouncementBarView = ({
  line,
  href,
  pinned = false,
  onClick,
}: {
  line: BarLine;
  href: string;
  /** Fixed to the top of the screen, phones only. Off = an ordinary block. */
  pinned?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => {
  const { lead, link, arrow } = splitLine(line.text);
  return (
    <aside className={`announcement-bar${pinned ? " announcement-bar--pinned" : ""}`} aria-label="Announcement">
      <a
        href={href}
        onClick={onClick}
        className="announcement-bar__link t-label"
        data-track-skip
       
      >
        {lead && <>{lead} </>}
        <span className="announcement-bar__go">
          {link}
          {arrow && <ChevronRight className="announcement-bar__chev" size={16} aria-hidden="true" />}
        </span>
      </a>
    </aside>
  );
};

const AnnouncementBar = () => {
  const [path, setPath] = useState("");
  const [hasForm, setHasForm] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const phone = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const p = window.location.pathname;
      setPath(p);
      setHasForm(!!document.getElementById("enquire"));
      if (phone.matches && lineFor(p)) root.setAttribute("data-announcement-bar", "on");
      else root.removeAttribute("data-announcement-bar");
    };
    update();
    window.addEventListener("resize", update);
    const poll = window.setInterval(update, 800); // page changes inside the site
    return () => {
      window.removeEventListener("resize", update);
      window.clearInterval(poll);
      root.removeAttribute("data-announcement-bar");
    };
  }, []);

  const line = path ? lineFor(path) : null;
  if (!line || (typeof window !== "undefined" && !window.matchMedia("(max-width: 767px)").matches)) return null;
  const { href, samePage } = targetFor(line, path, hasForm);
  return (
    <AnnouncementBarView
      pinned
      line={line}
      href={href}
      onClick={(e) => {
        trackEvent("announcement_bar_click", {
          line_text: line.text.replace(/\s*[→›>]$/, ""),
          transport_type: "beacon",
        });
        if (samePage) handleEnquireClick(e);
      }}
    />
  );
};

export default AnnouncementBar;
