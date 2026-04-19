import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const SERVICES = [
  { href: "#experiences", label: "Children's parties" },
  { href: "#experiences", label: "Milestones" },
  { href: "#experiences", label: "Corporate" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <>
      <nav className="rfx-nav">
        <div className="rfx-nav-row nav-left">
          <a href="#top">Home</a>
          <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer text-[13px] text-inherit"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown
                size={12}
                strokeWidth={1.25}
                aria-hidden="true"
                className={`transition-transform duration-300 opacity-70 mt-px ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`absolute left-0 top-full pt-4 transition-all duration-300 ${
                servicesOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <div className="min-w-[240px] bg-surface-alt border border-ink/10 shadow-[0_24px_60px_-20px_hsl(var(--ink)/0.22)] rounded-2xl py-3 px-1">
                {SERVICES.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="no-underline-fx block px-5 py-2.5 text-[13px] text-ink hover:underline underline-offset-4 decoration-ink/60"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="#about">About</a>
        </div>
        <a href="#top" className="no-underline-fx flex flex-col items-start md:items-center gap-1 justify-self-start md:justify-self-auto" aria-label="River Fox Events — home">
          <span className="text-[15px] font-medium tracking-[0.22em] leading-none">
            RIVER&nbsp;FOX&nbsp;EVENTS
          </span>
          <span className="font-mono-rf text-[9px] tracking-[0.3em] uppercase text-ink-soft">
            Surrey
          </span>
        </a>
        <div className="rfx-nav-row nav-right justify-end">
          <a href="#enquire" className="btn-solid-rf accent !py-2 !px-4 !text-[12px]">
            Start planning <span>→</span>
          </a>
        </div>

        {/* Mobile toggle — refined "menu / close" label */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 h-9 font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink"
        >
          <span className="relative inline-block w-4 h-4" aria-hidden="true">
            <span
              className={`absolute left-0 right-0 top-1/2 h-px bg-ink transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-1/2 h-px bg-ink transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[3px]"
              }`}
            />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[99] bg-background transition-opacity duration-500 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-rfx pt-28 pb-12 flex flex-col gap-2">
          {[
            { href: "#top", label: "Home" },
            { href: "#experiences", label: "Children's parties" },
            { href: "#experiences", label: "Milestones" },
            { href: "#experiences", label: "Corporate" },
            { href: "#about", label: "About" },
          ].map((l, i) => (
            <a
              key={l.label}
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

          <a
            href="#enquire"
            onClick={() => setOpen(false)}
            className="btn-solid-rf accent mt-8 self-start"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .5s ease 360ms, transform .5s ease 360ms`,
            }}
          >
            Start planning <span>→</span>
          </a>

          <div className="hairline mt-10" />
          <a
            href="https://instagram.com/riverfoxevents"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="mt-8 font-mono-rf text-[11px] tracking-[0.22em] uppercase text-ink no-underline inline-flex items-center gap-2 self-start"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .5s ease 420ms, transform .5s ease 420ms`,
            }}
          >
            Follow us on Instagram <span aria-hidden>→</span>
          </a>
          <p className="text-sm text-ink-soft mt-6 leading-relaxed">
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
