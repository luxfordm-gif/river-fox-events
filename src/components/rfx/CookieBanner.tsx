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
    // localStorage may be blocked - fail silently, user just won't be remembered
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    });
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
      className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 toast-width z-modal rounded-large bg-surface-deep text-on-deep shadow-card toast-pad text-center md:text-left"
    >
      <p className="t-meta">
        We use cookies for analytics and ads, only if you agree.{" "}
        <a
          href="/privacy/"
          className="text-link"
        >
          Privacy &amp; cookies
        </a>
      </p>
      {/* Phones: copy and buttons centred. Tablet up: left-aligned. Agree
          first, then No thanks (Matt, 2026-11-17). */}
      <div className="text-to-text flex flex-row items-center justify-center md:justify-start actions">
        <button
          type="button"
          onClick={accept}
          className="btn-solid-rf accent btn-compact cookie-agree"
        >
          Agree
        </button>
        <button
          type="button"
          onClick={decline}
          className="t-label opacity-80 hover:opacity-100"
        >
          No thanks
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
