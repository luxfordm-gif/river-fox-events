import { useEffect, useState } from "react";

/**
 * Thin reading-progress bar fixed to the very top of the viewport. Width
 * tracks the user's vertical scroll position as a percentage of the
 * document. Sits above the nav (z-300) and the page-transition overlay.
 */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      setPct(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[300] h-[2px] pointer-events-none"
      style={{ background: "hsl(var(--ink) / 0.06)" }}
    >
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background: "hsl(var(--accent-warm))",
          transition: "width 0.08s linear",
        }}
      />
    </div>
  );
};

export default ReadingProgress;
