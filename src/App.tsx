import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Index from "./pages/Index.tsx";
import ChildrensParties from "./pages/ChildrensParties.tsx";
import Milestones from "./pages/Milestones.tsx";
import CorporateAndBrand from "./pages/CorporateAndBrand.tsx";
import BalloonInstallations from "./pages/BalloonInstallations.tsx";
import LocationPage from "./pages/LocationPage.tsx";
import Article from "./pages/Article.tsx";
import Journal from "./pages/Journal.tsx";
import Welcome from "./pages/Welcome.tsx";
import Contact from "./pages/Contact.tsx";
import Privacy from "./pages/Privacy.tsx";
import ChristmasDoorways from "./pages/ChristmasDoorways.tsx";
import OurWork from "./pages/OurWork.tsx";
import CookieBanner from "@/components/rfx/CookieBanner";
import { LOCATIONS } from "./data/locations";
import { ARTICLES } from "./data/articles";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppShell = () => {
  // Same-page anchor links glide to their section (ordinary scrolling is native).
  useSmoothScroll();
  return (
    <BrowserRouter>
      <PageTransition />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/childrens-parties" element={<ChildrensParties />} />
        <Route path="/milestone-celebrations" element={<Milestones />} />
        <Route path="/corporate-brand-styling" element={<CorporateAndBrand />} />
        <Route path="/balloon-installations" element={<BalloonInstallations />} />
        <Route path="/christmas-door-garlands" element={<ChristmasDoorways />} />
        <Route path="/our-work" element={<OurWork />} />
        {LOCATIONS.map((loc) => (
          <Route
            key={loc.slug}
            path={`/party-styling-${loc.slug}`}
            element={<LocationPage />}
          />
        ))}
        <Route path="/journal" element={<Journal />} />
        {ARTICLES.map((a) => (
          <Route
            key={a.slug}
            path={`/journal/${a.slug}`}
            element={<Article />}
          />
        ))}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppShell />
      <CookieBanner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

