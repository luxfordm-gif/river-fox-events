import { useEffect, useRef, useState } from "react";

import drape700 from "@/assets/christmas/garland-swag-red-gold-baubles-berries-700.webp";
import drape1050 from "@/assets/christmas/garland-swag-red-gold-baubles-berries-1050.webp";
import drape1400 from "@/assets/christmas/garland-swag-red-gold-baubles-berries-1400.webp";
import bow160 from "@/assets/christmas/burgundy-velvet-bow-160.webp";
import bow320 from "@/assets/christmas/burgundy-velvet-bow-320.webp";

/**
 * Hero garland: one drape image repeated edge to edge, with a velvet bow
 * over every join (and over both screen edges, so the garland never ends
 * bare). The drape's two ends sit at the same height, so neighbouring drapes
 * meet cleanly under the bow.
 *
 * The number of drapes follows the width (about one per 480px), so each one
 * stays a sensible size from a phone to an ultra-wide screen.
 */

const DRAPE_RATIO = 622 / 2172; // height / width of the trimmed drape
const JOIN_Y = 60 / 622; // where the drape ends meet, as a share of its height
const BOW_RATIO = 1168 / 1136; // height / width of the trimmed bow
const KNOT = { x: 0.5, y: 0.24 }; // knot position within the bow

const HeroGarland = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1440);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth || 1440);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = Math.max(1, Math.round(w / 480));
  const tileW = w / n;
  const tileH = tileW * DRAPE_RATIO;
  const overlap = tileW * 0.02; // drapes tuck slightly under each other at the join
  const bowW = Math.min(120, Math.max(60, tileW * 0.2));
  const bowH = bowW * BOW_RATIO;
  const joinY = tileH * JOIN_Y;
  const padTop = Math.max(0, bowH * KNOT.y - joinY) + 4;

  return (
    <div
      ref={ref}
      className="xmas-garland relative w-full overflow-hidden"
      style={{ height: padTop + tileH + 6 }}
      aria-hidden="true"
    >
      {Array.from({ length: n }, (_, i) => (
        <img
          key={`d${i}`}
          src={drape1050}
          srcSet={`${drape700} 700w, ${drape1050} 1050w, ${drape1400} 1400w`}
          sizes={`${Math.ceil(tileW + overlap)}px`}
          alt=""
          className="absolute block max-w-none"
          style={{ left: i * tileW - overlap / 2, top: padTop, width: tileW + overlap, height: "auto" }}
          width={1400}
          height={401}
          loading="eager"
          decoding="async"
        />
      ))}
      {Array.from({ length: n + 1 }, (_, i) => (
        <img
          key={`b${i}`}
          src={bow160}
          srcSet={`${bow160} 160w, ${bow320} 320w`}
          sizes={`${Math.ceil(bowW)}px`}
          alt=""
          className="absolute block max-w-none"
          style={{ left: i * tileW - bowW * KNOT.x, top: padTop + joinY - bowH * KNOT.y, width: bowW, height: "auto" }}
          width={320}
          height={330}
          loading="eager"
          decoding="async"
        />
      ))}
    </div>
  );
};

export default HeroGarland;
