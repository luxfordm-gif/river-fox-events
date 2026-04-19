import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Subtle full-screen fade between routes.
 * Renders an overlay that fades to opacity 1 briefly on each pathname change,
 * then fades back out. Pointer-events are disabled so it never blocks input.
 */
const PageTransition = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);
  const [firstMount, setFirstMount] = useState(true);

  useEffect(() => {
    if (firstMount) {
      setFirstMount(false);
      return;
    }
    setActive(true);
    // Scroll to top on route change so the new page reveals from the top
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const t = window.setTimeout(() => setActive(false), 280);
    return () => window.clearTimeout(t);
  }, [pathname, firstMount]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        background: "hsl(var(--background))",
        opacity: active ? 1 : 0,
        transition: active
          ? "opacity .22s ease-out"
          : "opacity .42s ease-in .04s",
      }}
    />
  );
};

export default PageTransition;
