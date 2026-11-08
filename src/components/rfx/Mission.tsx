import { useCallback, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

/**
 * Home page mission line, under the hero (Matt, 2026-11-08): one large
 * sentence saying what Laura does and where. The words start faint and
 * darken one after another as the line scrolls up the screen, driven by the
 * page's own scroll. Without JavaScript, or with reduced motion, it is
 * simply full colour.
 */
const LEAD = "I style children's parties, milestone celebrations and brand events across Surrey and London,";
const ACCENT = "each one individually designed.";

const Mission = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);

  const onProgress = useCallback((p: number) => {
    const list = words.current;
    const n = list.length;
    // Each word fades in over a short window, so a soft edge runs along the line.
    const lit = p * (n + 2);
    for (let i = 0; i < n; i++) {
      const t = Math.min(1, Math.max(0, lit - i));
      list[i].style.opacity = String(0.16 + 0.84 * t);
    }
  }, []);

  useScrollProgress(textRef, onProgress, { from: 0.9, to: 0.25 });

  let i = -1;
  const split = (text: string) =>
    text.split(" ").map((w, k) => {
      i += 1;
      const idx = i;
      return (
        <span key={`${idx}-${k}`}>
          <span
            className="mission-word"
            ref={(el) => {
              if (el) words.current[idx] = el;
            }}
          >
            {w}
          </span>{" "}
        </span>
      );
    });

  return (
    <section id="mission" className="rfx-section white" aria-label="What River Fox Events does">
      <div className="container-rfx">
        <p ref={textRef} className="t-h2 text-ink mission-line heading-to-content">
          {split(LEAD)}
          <em className="t-accent">{split(ACCENT)}</em>
        </p>
        <div>
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-ghost-rf">
            Book now <span className="t-icon">→</span>
          </a>
        </div>
        {/* Divider before the services section (Matt, 2026-11-08). */}
        <div className="mission-rule" aria-hidden="true" />
      </div>
    </section>
  );
};

export default Mission;
