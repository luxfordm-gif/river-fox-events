import { useEffect, useRef, useState } from "react";
import bow160 from "@/assets/christmas/burgundy-velvet-bow-160.webp";
import { ChevronDown } from "lucide-react";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

const SERVICES = [
  { href: "/childrens-parties/", label: "Children's parties" },
  { href: "/milestone-celebrations/", label: "Milestone celebrations" },
  { href: "/corporate-brand-styling/", label: "Corporate & brand" },
  { href: "/balloon-installations/", label: "Balloon decorations" },
];

/* Seasonal service, set apart below a divider with a velvet bow. */
const SEASONAL = { href: "/christmas-door-garlands/", label: "Christmas door garlands" };

/* Desktop dropdown: the bow jingles once on hover (Matt, 2026-11-07). The
   class comes off only when the animation ends, so leaving mid-jingle lets it
   finish, and a new hover can't restart it part-way. */
const jingleBow = (e: React.MouseEvent<HTMLElement>) => {
  const bow = e.currentTarget.querySelector("img");
  if (!bow || bow.classList.contains("bow-jingle")) return;
  bow.classList.add("bow-jingle");
  bow.addEventListener("animationend", () => bow.classList.remove("bow-jingle"), { once: true });
};

const ABOUT_LINKS = [
  { href: "/#about", label: "About Laura" },
  { href: "/#kindness", label: "Client reviews" },
  { href: "/journal/", label: "Read the journal" },
];

/** `enquireHref`: pages with their own enquire form pass "#enquire" so the
    button never points at the home page form. */
const Nav = ({ enquireHref = ENQUIRE_HREF }: { enquireHref?: string } = {}) => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const servicesCloseTimer = useRef<number | null>(null);
  const aboutCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const unlock = () => {
      document.body.style.overflow = "";
      root.style.removeProperty("--scroll-lock-gap");
    };
    if (!open) {
      unlock();
      return;
    }
    // Locking the page removes the scrollbar (where it takes up space), which
    // widens the page and nudges the centred logo; fill its width back in.
    const gap = window.innerWidth - root.clientWidth;
    if (gap > 0) root.style.setProperty("--scroll-lock-gap", `${gap}px`);
    document.body.style.overflow = "hidden";
    return unlock;
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
          <a href="/" className="t-label">Home</a>
          <div
            className="relative flex"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
          >
            <button
              type="button"
              className="nav-trigger p-0 t-label text-inherit"
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
              className={`nav-menu-wrap absolute left-0 top-full transition-all duration-300 ${
                servicesOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <div className="min-w-[240px] bg-surface-alt border border-ink/10 shadow-[0_24px_60px_-20px_hsl(var(--text-primary)/0.22)] nav-menu">
                {SERVICES.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="no-underline-fx nav-menu__item t-label text-ink hover:underline underline-offset-4 decoration-ink/60"
                  >
                    {s.label}
                  </a>
                ))}
                <div className="nav-menu__rule border-t border-ink/10" aria-hidden="true" />
                <a
                  href={SEASONAL.href}
                  onMouseEnter={jingleBow}
                  className="no-underline-fx nav-menu__item t-label text-ink hover:underline underline-offset-4 decoration-ink/60"
                >
                  <img src={bow160} alt="" aria-hidden="true" className="w-[18px] h-auto -my-1" width={160} height={165} />
                  {SEASONAL.label}
                </a>
              </div>
            </div>
          </div>
          <a href="/our-work/" className="t-label whitespace-nowrap">Our work</a>
          <div
            className="relative flex"
            onMouseEnter={handleAboutEnter}
            onMouseLeave={handleAboutLeave}
          >
            <button
              type="button"
              className="nav-trigger p-0 t-label text-inherit"
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
              className={`nav-menu-wrap absolute left-0 top-full transition-all duration-300 ${
                aboutOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <div className="min-w-[200px] bg-surface-alt border border-ink/10 shadow-[0_24px_60px_-20px_hsl(var(--text-primary)/0.22)] nav-menu">
                {ABOUT_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="no-underline-fx nav-menu__item t-label text-ink hover:underline underline-offset-4 decoration-ink/60"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <a href="/contact/" className="t-label">Contact</a>
        </div>
        <a href="/" className="no-underline-fx flex flex-col items-start md:items-center gap-1 justify-self-start md:justify-self-auto" aria-label="River Fox Events - home">
          <span className="t-wordmark">
            RIVER&nbsp;FOX&nbsp;EVENTS
          </span>
          {/* Phones show the name on one line (Matt, 2026-11-13). */}
          <span className="t-overline text-ink-soft hidden md:block">
            Surrey
          </span>
        </a>
        <div className="rfx-nav-row nav-right justify-end">
          <a href={enquireHref} onClick={handleEnquireClick} className="btn-solid-rf accent t-label btn-compact">
            Enquire now <span>→</span>
          </a>
        </div>

        {/* Mobile toggle - refined "menu / close" label */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="lg:hidden absolute right-5 top-1/2 -translate-y-1/2 flex items-center icon-gap px-3 h-9 t-overline text-ink"
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

      {/* Mobile drawer - scrollable so long menus / short viewports don't clip.
          Only the background fades in; the links arrive with it, all at once
          (the one-by-one slide-down got repetitive, Matt 2026-11-09). */}
      <div
        data-track-location="menu"
        className={`fixed inset-0 z-[99] bg-surface-alt overflow-y-auto overscroll-contain transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-rfx nav-sheet">
          <div className="nav-sheet__links">
          {[
            { href: "/", label: "Home" },
            { href: "/childrens-parties/", label: "Children's parties" },
            { href: "/milestone-celebrations/", label: "Milestone celebrations" },
            { href: "/corporate-brand-styling/", label: "Corporate & brand" },
            { href: "/balloon-installations/", label: "Balloon decorations" },
            { href: SEASONAL.href, label: "Christmas garlands", seasonal: true },
            { href: "/our-work/", label: "Our work" },
            { href: "/#about", label: "About" },
            { href: "/contact/", label: "Contact" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`t-h4 text-ink no-underline ${
                "seasonal" in l ? "nav-sheet__seasonal border-y border-ink/10" : ""
              }`}
            >
              {"seasonal" in l && (
                <img src={bow160} alt="" aria-hidden="true" className="w-[30px] h-auto" width={160} height={165} />
              )}
              {l.label}
            </a>
          ))}
          </div>

          <div className="hairline" />
          <div className="nav-sheet__more">
          <a
            href="/journal/"
            onClick={() => setOpen(false)}
            className="t-overline text-ink no-underline inline-flex items-center icon-gap"
          >
            Read the journal <span aria-hidden>→</span>
          </a>
          <a
            href="/#kindness"
            onClick={() => setOpen(false)}
            className="t-overline text-ink no-underline inline-flex items-center icon-gap"
          >
            Client reviews <span aria-hidden>→</span>
          </a>
          <a
            href="https://www.instagram.com/riverfox_events/"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="t-overline text-ink no-underline inline-flex items-center icon-gap"
          >
            Follow us on Instagram <span aria-hidden>→</span>
          </a>
          </div>
          <p className="t-small text-ink-soft">
            Riverfoxevents@gmail.com
            <br />
            Based in Surrey · By appointment.
          </p>

          <a
            href={enquireHref}
            onClick={(e) => {
              setOpen(false);
              handleEnquireClick(e);
            }}
            className="btn-solid-rf accent t-label self-start"
          >
            Enquire now <span>→</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Nav;
