import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { handleEnquireClick } from "@/lib/enquire";
import { lineFor, splitLine, targetFor } from "@/lib/announcementBar";
import { trackEvent } from "@/lib/track";
import type { BarLine } from "@/data/announcementBar";

/**
 * Announcement bar (Matt, 2026-11-17, like Wispr Flow's). One slim strip with a
 * short lead-in and a link ending in a chevron; the whole bar is tappable. It
 * is pinned to the top of the screen and stays there as you scroll; the fixed
 * nav sits directly under it (Matt, 2026-11-17: it first scrolled away).
 *
 * Two parts:
 *  - `AnnouncementBarView` is just the look: a line, a link, and (when
 *    `atTop`) pinned to the top of the screen. The style guide uses it too.
 *  - `AnnouncementBar` (default export) is the site-wide one, mounted once in
 *    App.tsx. It picks the line for the page from `src/data/announcementBar.ts`,
 *    works out where a tap goes, and sends `announcement_bar_click` (page path
 *    and the line) after cookie consent like every other event.
 *
 * Phones only. While <html data-announcement-bar="on"> the page and the phone
 * menu make room for it (`--announcement-height`, index.css).
 * Colours, height and padding are tokens in `:root`; nothing here is a one-off.
 */
export const AnnouncementBarView = ({
  line,
  href,
  atTop = false,
  onClick,
}: {
  line: BarLine;
  href: string;
  /** Pinned to the top of the screen, phones only. Off = an ordinary block. */
  atTop?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => {
  const { lead, link, arrow } = splitLine(line.text);
  return (
    <aside className={`announcement-bar${atTop ? " announcement-bar--top" : ""}`} aria-label="Announcement">
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

/** What the site-wide bar knows about the page, read once the page is on screen. */
type PageState = { path: string; phone: boolean; hasForm: boolean };

const AnnouncementBar = () => {
  // Null until the page has rendered, so the prerendered HTML and the first
  // client render match (no bar in either).
  const [page, setPage] = useState<PageState | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const phoneQuery = window.matchMedia("(max-width: 767px)");
    const update = () => {
      const path = window.location.pathname;
      const phone = phoneQuery.matches;
      setPage({ path, phone, hasForm: !!document.getElementById("enquire") });
      if (phone && lineFor(path)) root.setAttribute("data-announcement-bar", "on");
      else root.removeAttribute("data-announcement-bar");
    };
    update();
    // Every link on the site is an ordinary page load, so the page only
    // changes under the bar when the screen crosses the phone breakpoint.
    phoneQuery.addEventListener("change", update);
    return () => {
      phoneQuery.removeEventListener("change", update);
      root.removeAttribute("data-announcement-bar");
    };
  }, []);

  const line = page?.phone ? lineFor(page.path) : null;
  if (!page || !line) return null;
  const { href, samePage } = targetFor(line, page.path, page.hasForm);
  return (
    <AnnouncementBarView
      atTop
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
