import { Suspense, useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Route, Routes, matchRoutes } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import CookieBanner from "@/components/rfx/CookieBanner";
import { TOWNS } from "./data/locations/towns";
import { lazyPage } from "./lib/lazyPage";

/* Each page's code downloads only when that page is open (speed pass,
   2026-11-13). Before, every page and every article was in one 915KB file
   that each visitor downloaded on arrival. main.tsx waits for the current
   page's code before React takes over the prerendered HTML, so nothing
   flashes; a finger or mouse landing on a link starts that page's download
   (see preloadOnIntent below). */
const Index = lazyPage(() => import("./pages/Index.tsx"));
const ChildrensParties = lazyPage(() => import("./pages/ChildrensParties.tsx"));
const Milestones = lazyPage(() => import("./pages/Milestones.tsx"));
const CorporateAndBrand = lazyPage(() => import("./pages/CorporateAndBrand.tsx"));
const BalloonInstallations = lazyPage(() => import("./pages/BalloonInstallations.tsx"));
const ChristmasDoorways = lazyPage(() => import("./pages/ChristmasDoorways.tsx"));
const OurWork = lazyPage(() => import("./pages/OurWork.tsx"));
const LocationPage = lazyPage(() => import("./pages/LocationPage.tsx"));
const Journal = lazyPage(() => import("./pages/Journal.tsx"));
const Welcome = lazyPage(() => import("./pages/Welcome.tsx"));
const Contact = lazyPage(() => import("./pages/Contact.tsx"));
const Privacy = lazyPage(() => import("./pages/Privacy.tsx"));
const NotFound = lazyPage(() => import("./pages/NotFound.tsx"));
// Hidden design reference (noindex).
const StyleGuide = lazyPage(() => import("./pages/StyleGuide.tsx"));

// Articles also fetch their own text, so the article arrives in one go.
let preloadArticle: ((pathname: string) => Promise<void> | undefined) | undefined;
const Article = lazyPage(() =>
  import("./pages/Article.tsx").then((m) => {
    preloadArticle = m.preloadArticle;
    return m;
  }),
);

type PageRoute = {
  path: string;
  element: ReactNode;
  /** Download everything this page needs before it shows. */
  preload: (pathname: string) => Promise<unknown>;
};

const page = (path: string, Page: { preload: () => Promise<void> }, element: ReactNode): PageRoute => ({
  path,
  element,
  preload: () => Page.preload(),
});

const PAGES: PageRoute[] = [
  page("/", Index, <Index />),
  page("/childrens-parties", ChildrensParties, <ChildrensParties />),
  page("/milestone-celebrations", Milestones, <Milestones />),
  page("/corporate-brand-styling", CorporateAndBrand, <CorporateAndBrand />),
  page("/balloon-installations", BalloonInstallations, <BalloonInstallations />),
  page("/christmas-door-garlands", ChristmasDoorways, <ChristmasDoorways />),
  page("/commercial-christmas-decorations", ChristmasDoorways, <ChristmasDoorways variant="business" />),
  page("/our-work", OurWork, <OurWork />),
  ...TOWNS.map((t) => page(`/party-styling-${t.slug}`, LocationPage, <LocationPage />)),
  page("/journal", Journal, <Journal />),
  {
    // Unknown or not-yet-published articles show the 404 page from Article.
    path: "/journal/:slug",
    element: <Article />,
    preload: (pathname) => Article.preload().then(() => preloadArticle?.(pathname)),
  },
  page("/welcome", Welcome, <Welcome />),
  page("/contact", Contact, <Contact />),
  page("/privacy", Privacy, <Privacy />),
  page("/style-guide", StyleGuide, <StyleGuide />),
  // ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE
  page("*", NotFound, <NotFound />),
];

/** Download the code for the page at this address (and its article text). */
export const preloadRoute = (pathname: string): Promise<unknown> => {
  const match = matchRoutes(PAGES, pathname)?.[0]?.route as PageRoute | undefined;
  return match ? match.preload(pathname) : Promise.resolve();
};

/* Every link on the site is an ordinary page load, so the next page's code is
   fetched into the browser's cache as soon as a finger touches a link or a
   mouse rests on one; by the time the new page arrives its code is ready. */
const preloadOnIntent = (e: Event) => {
  const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!link || link.origin !== window.location.origin || link.pathname === window.location.pathname) return;
  preloadRoute(link.pathname).catch(() => {});
};
if (typeof document !== "undefined") {
  for (const type of ["pointerover", "touchstart", "focusin"]) {
    document.addEventListener(type, preloadOnIntent, { passive: true, capture: true });
  }
}

const AppShell = () => {
  // Same-page anchor links glide to their section (ordinary scrolling is native).
  useSmoothScroll();
  return (
    <BrowserRouter>
      <PageTransition />
      <Suspense fallback={null}>
        <Routes>
          {PAGES.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

/* The "message sent" note (sonner) is only needed after a form is sent, so
   its code loads on the visitor's first tap, click or key press, off the
   first view (and out of the prerendered pages' download lists). */
const Toaster = lazyPage(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));
const FIRST_INTERACTION = ["pointerdown", "keydown", "focusin"] as const;
const LateToaster = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const go = () => setOn(true);
    FIRST_INTERACTION.forEach((t) => window.addEventListener(t, go, { once: true, passive: true }));
    return () => FIRST_INTERACTION.forEach((t) => window.removeEventListener(t, go));
  }, []);
  return on ? (
    <Suspense fallback={null}>
      <Toaster />
    </Suspense>
  ) : null;
};

const App = () => (
  <>
    <LateToaster />
    <AppShell />
    <CookieBanner />
  </>
);

export default App;
