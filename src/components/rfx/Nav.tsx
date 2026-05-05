import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

const SERVICES = [
  { href: "/childrens-parties", label: "Children's parties" },
  { href: "/milestone-celebrations", label: "Milestone celebrations" },
  { href: "/corporate-brand-styling", label: "Corporate & brand" },
];

const ABOUT_LINKS = [
  { href: "/#about", label: "About Laura" },
  { href: "/journal", label: "Read the journal" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const servicesCloseTimer = useRef<number | null>(null);
  const aboutCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleServicesEnter = () => {
    if (servicesCloseTimer.current)
      window.clearTimeout(servicesCloseTimer.current);
    setServicesOpen(true);
  };
  const handleServicesLeave = () => {
    servicesCloseTimer.current = window.setTimeout(
      () => setServicesOpen(false),
      140
    );
  };
  const handleAboutEnter = () => {
    if (aboutCloseTimer.current) window.clearTimeout(aboutCloseTimer.current);
    setAboutOpen(true);
  };
  const handleAboutLeave = () => {
    aboutCloseTimer.current = window.setTimeout(() => setAboutOpen(false), 140);
  };

  return (
    <>
      <nav className="rfx-nav">
        <div className="rfx-nav-row nav-left">
          <a href="/">Home</a>
          <div
            className="relative"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
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
          <div
            className="relative"
            onMouseEnter={handleAboutEnter}
            onMouseLeave={handleAboutLeave}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer text-[13px] text-inherit"
              aria-haspopup="true"
              aria-expanded={aboutOpen}
            >
              About
              <ChevronDown
                size={12}
                strokeWidth={1.25}
                aria-hidden="true"
                className={`transition-transform duration-300 opacity-70 mt-px ${
                  aboutOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`absolute left-0 top-full pt-4 transition-all duration-300 ${
                aboutOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <div className="min-w-[200px] bg-surface-alt border border-ink/10 shadow-[0_24px_60px_-20px_hsl(var(--ink)/0.22)] rounded-2xl py-3 px-1">
                {ABOUT_LINKS.map((s) => (
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
          <a href="/contact">Contact</a>
        </div>
        <a href="/" className="no-underline-fx flex flex-col items-start md:items-center gap-1 justify-self-start md:justify-self-auto md:pt-2" aria-label="River Fox Events — home">
          <span className="text-[15px] font-medium tracking-[0.22em] leading-none">
            RIVER&nbsp;FOX&nbsp;EVENTS
          </span>
          <span className="font-mono-rf text-[9.2px] tracking-[0.3em] uppercase text-ink-soft">
            Surrey
          </span>
        </a>
        <div className="rfx-nav-row nav-right justify-end">
          <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent !py-2 !px-4 !text-[12px]">
            Start planning <span>→</span>
          </a>
        </div>

        {/* Mobile toggle — refined "menu / close" label */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="lg:hidden absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 px-3 h-9 font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink"
        >
          <span className="relative inline-block w-4 h-4 -mt-[2px]" aria-hidden="true">
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

      {/* Mobile drawer — scrollable so long menus / short viewports don't clip */}
      <div
        className={`fixed inset-0 z-[99] bg-background overflow-y-auto overscroll-contain transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-rfx pt-28 pb-12 flex flex-col gap-2">
          {[
            { href: "/", label: "Home" },
            { href: "/childrens-parties", label: "Children's parties" },
            { href: "/milestone-celebrations", label: "Milestone celebrations" },
            { href: "/corporate-brand-styling", label: "Corporate & brand" },
            { href: "/#about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif-rf text-[32px] leading-tight py-1.5 text-ink no-underline"
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
            href={ENQUIRE_HREF}
            onClick={(e) => {
              setOpen(false);
              handleEnquireClick(e);
            }}
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
            href="https://www.instagram.com/lollipop_balloonsx/"
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
          <a
            href="/journal"
            onClick={() => setOpen(false)}
            className="mt-3 font-mono-rf text-[11px] tracking-[0.22em] uppercase text-ink no-underline inline-flex items-center gap-2 self-start"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)",
              transition: `opacity .5s ease 480ms, transform .5s ease 480ms`,
            }}
          >
            Read the journal <span aria-hidden>→</span>
          </a>
          <p className="text-sm text-ink-soft mt-6 leading-relaxed">
            Riverfoxevents@gmail.com
            <br />
            Based in Surrey · By appointment.
          </p>
        </div>
      </div>
    </>
  );
};

export default Nav;
