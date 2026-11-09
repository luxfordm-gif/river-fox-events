import type { CSSProperties } from "react";
import { Instagram } from "lucide-react";
import "@/styles/instagram-strip.css";

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
 * however wide the screen - as long as one set is wider than the screen.
 * A short list is repeated until a set has at least MIN_PER_SET photos
 * (10 x 340px tiles covers a 2560px screen); with only five photos the
 * corporate strip left an empty stretch at the end of each loop on wide
 * screens (Matt, 2026-11-09). Reduced motion: no animation, the row scrolls
 * sideways by hand instead.
 */
const MIN_PER_SET = 10;
const InstagramStrip = ({
  images,
  href = "https://www.instagram.com/riverfox_events/",
  handle = "@riverfox_events",
}: InstagramStripProps) => {
  const repeats = images.length ? Math.ceil(MIN_PER_SET / images.length) : 0;
  const set = Array.from({ length: repeats }, () => images).flat();
  return (
  <div className="xmas-ig" style={{ "--ig-duration": `${set.length * 10}s` } as CSSProperties}>
    <ul className="xmas-ig__track">
      {[0, 1].map((copy) =>
        set.map((img, i) => {
          /* Only the first appearance of each photo is read out and tabbable. */
          const repeat = copy === 1 || i >= images.length;
          return (
          <li key={`${copy}-${i}`} className="xmas-ig__item" aria-hidden={repeat ? true : undefined}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={repeat ? -1 : undefined}
              className="xmas-ig__tile"
            >
              <img src={img.src} alt={repeat ? "" : img.alt} width={560} height={700} loading="lazy" decoding="async" />
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
          );
        })
      )}
    </ul>
  </div>
  );
};

export default InstagramStrip;
