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
 * The number of drapes follows the width (about one per 480px, one per 360px
 * on tablets and small laptops), so each one stays a sensible size from a
 * phone to an ultra-wide screen.
 *
 * Laid out entirely in CSS (.xmas-garland in christmas.css), so the
 * prerendered page already has the right garland at every width and the
 * browser picks the right image size straight away (Matt, 2026-11-13: the
 * wreaths took a few seconds). Before, the code measured the width after
 * loading and redrew it, sometimes downloading a second, bigger drape.
 * The markup always carries MAX_DRAPES drapes; CSS shows as many as fit.
 */
const MAX_DRAPES = 6;

// The drawn drape width at each screen width, for the browser's image choice;
// matches the --garland-n steps in christmas.css.
const DRAPE_SIZES =
  "(max-width: 767px) 82vw, (max-width: 899px) 50vw, (max-width: 1259px) 34vw, (max-width: 1366px) 25vw, (max-width: 1679px) 34vw, (max-width: 2159px) 25vw, (max-width: 2639px) 20vw, 17vw";
const BOW_SIZES = "(max-width: 767px) 66px, 120px";

const HeroGarland = () => (
  <div className="xmas-garland" aria-hidden="true">
    <div className="xmas-garland__inner">
      <div className="xmas-garland__drapes">
        {Array.from({ length: MAX_DRAPES }, (_, i) => (
          <img
            key={i}
            src={drape1050}
            srcSet={`${drape700} 700w, ${drape1050} 1050w, ${drape1400} 1400w`}
            sizes={DRAPE_SIZES}
            alt=""
            style={{ "--i": i } as React.CSSProperties}
            width={1400}
            height={401}
            loading="eager"
            fetchPriority={i === 0 ? "high" : undefined}
            decoding="async"
          />
        ))}
      </div>
      <div className="xmas-garland__bows">
        {Array.from({ length: MAX_DRAPES + 1 }, (_, i) => (
          <img
            key={i}
            src={bow160}
            srcSet={`${bow160} 160w, ${bow320} 320w`}
            sizes={BOW_SIZES}
            alt=""
            style={{ "--i": i } as React.CSSProperties}
            width={320}
            height={330}
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
    </div>
  </div>
);

export default HeroGarland;
