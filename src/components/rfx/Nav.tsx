import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#experiences", label: "Experiences" },
  { href: "#work", label: "Approach" },
  { href: "#about", label: "Studio" },
];
const NAV_LINKS_RIGHT = [
  { href: "#process", label: "How it works" },
  { href: "#kindness", label: "Kind words" },
  { href: "#enquire", label: "Enquire" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="rfx-nav">
        <div className="rfx-nav-row nav-left">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a href="#top" className="flex flex-col items-center gap-1 no-underline" aria-label="River Fox Events — home">
          <span className="text-[15px] font-medium tracking-[0.22em] leading-none">
            RIVER&nbsp;FOX&nbsp;EVENTS
          </span>
          <span className="font-mono-rf text-[9px] tracking-[0.3em] uppercase text-ink-soft">
            Surrey
          </span>
        </a>
        <div className="rfx-nav-row nav-right justify-end">
          {NAV_LINKS_RIGHT.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center"
        >
          <span
            className={`block w-5 h-px bg-ink transition-transform duration-300 ${
              open ? "translate-y-[3px] rotate-45" : "-translate-y-1"
            }`}
          />
          <span
            className={`block w-5 h-px bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[3px] -rotate-45" : "translate-y-1"
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[99] bg-background transition-opacity duration-500 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-rfx pt-28 pb-12 flex flex-col gap-2">
          {[...NAV_LINKS, ...NAV_LINKS_RIGHT].map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif-rf text-[40px] leading-tight py-2 text-ink no-underline"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
                transition: `opacity .5s ease ${i * 60}ms, transform .5s ease ${i * 60}ms`,
              }}
            >
              {l.label}
            </a>
          ))}
          <div className="hairline mt-10" />
          <p className="text-sm text-ink-soft mt-8 leading-relaxed">
            hello@riverfoxevents.co.uk
            <br />
            Based in Surrey · Replied within 48 hours.
          </p>
        </div>
      </div>
    </>
  );
};

export default Nav;
