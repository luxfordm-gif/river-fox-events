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
      className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 md:max-w-xl z-[200] rounded-large bg-surface-deep text-on-deep shadow-[0_24px_60px_-20px_hsl(var(--text-primary)/0.45)] px-5 py-4 md:px-6 md:py-5 flex flex-col gap-4 md:flex-row md:items-center md:gap-6"
    >
      {/* Matt, 2026-11-12: Accept always sits in the far-right corner. Tablet
          and up is one row, copy left and buttons right. On phones one row was
          too tight, so the copy runs full width with the buttons under it. */}
      <p className="t-meta min-w-0 md:flex-1">
        We use cookies for analytics and ads, only if you accept.{" "}
        <a
          href="/privacy/"
          className="text-link whitespace-nowrap"
        >
          Privacy &amp; cookies
        </a>
      </p>
      <div className="shrink-0 self-end flex items-center gap-4 md:self-auto">
        <button
          type="button"
          onClick={decline}
          className="t-label opacity-80 hover:opacity-100 underline underline-offset-4"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          className="btn-solid-rf accent !py-2 !px-4"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
