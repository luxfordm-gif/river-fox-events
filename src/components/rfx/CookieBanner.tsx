import { useEffect, useState } from "react";

const STORAGE_KEY = "rfx-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const setConsent = (value: "granted" | "denied") => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage may be blocked — fail silently, user just won't be remembered
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: value });
  }
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem(STORAGE_KEY);
      if (choice !== "granted" && choice !== "denied") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    setConsent("granted");
    setVisible(false);
  };
  const decline = () => {
    setConsent("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 md:max-w-[420px] z-[200] rounded-2xl bg-surface-deep text-on-deep shadow-[0_24px_60px_-20px_hsl(var(--ink)/0.45)] px-5 py-4 md:px-6 md:py-5"
    >
      <p className="text-[13.5px] leading-[1.55]">
        We use a single analytics cookie (Google Analytics) to understand how
        the site is used. No advertising, no tracking across other sites. See
        our{" "}
        <a
          href="/privacy/"
          className="underline underline-offset-4 decoration-on-deep/50 hover:decoration-on-deep"
        >
          privacy &amp; cookies
        </a>{" "}
        page.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={accept}
          className="btn-solid-rf accent !py-2 !px-4 !text-[12px]"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={decline}
          className="text-[13px] opacity-80 hover:opacity-100 underline underline-offset-4"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
