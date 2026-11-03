import type { CSSProperties } from "react";
import { Instagram } from "lucide-react";

export type InstagramStripImage = { src: string; alt: string };

type InstagramStripProps = {
  images: InstagramStripImage[];
  href?: string;
  handle?: string;
};

/**
 * A slow, endless row of Instagram photos. Every tile links to the
 * Instagram profile; hovering a tile shows the handle and "Opens Instagram"
 * so it's clear the link leaves the site (on touch screens a small badge sits
 * on each tile instead). Hovering anywhere on the row pauses it.
 *
 * The set is rendered twice and the track slides by half its width
 * (rfx-marq), so the loop is seamless and there's never a gap at either end,
 * however wide the screen. Reduced motion: no animation, the row scrolls
 * sideways by hand instead.
 */
const InstagramStrip = ({
  images,
  href = "https://www.instagram.com/riverfox_events/",
  handle = "@riverfox_events",
}: InstagramStripProps) => (
  <div className="xmas-ig" style={{ "--ig-duration": `${images.length * 10}s` } as CSSProperties}>
    <ul className="xmas-ig__track">
      {[0, 1].map((copy) =>
        images.map((img) => (
          <li key={`${copy}-${img.src}`} className="xmas-ig__item" aria-hidden={copy === 1 ? true : undefined}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={copy === 1 ? -1 : undefined}
              className="xmas-ig__tile"
            >
              <img src={img.src} alt={copy === 1 ? "" : img.alt} width={560} height={700} loading="lazy" decoding="async" />
              <span className="sr-only">(opens Instagram, {handle})</span>
              <span className="xmas-ig__over" aria-hidden="true">
                <Instagram size={22} strokeWidth={1.5} />
                <span className="xmas-ig__handle">{handle}</span>
                <span className="xmas-ig__note">Opens Instagram ↗</span>
              </span>
              <span className="xmas-ig__badge" aria-hidden="true">
                <Instagram size={14} strokeWidth={1.8} />
              </span>
            </a>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default InstagramStrip;
