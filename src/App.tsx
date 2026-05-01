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
import LocationPage from "./pages/LocationPage.tsx";
import Article from "./pages/Article.tsx";
import { LOCATIONS } from "./data/locations";
import { ARTICLES } from "./data/articles";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppShell = () => {
  // Site-wide smooth-scroll hijack — slows scroll for premium feel.
  useSmoothScroll();
  return (
    <BrowserRouter>
      <PageTransition />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/childrens-parties" element={<ChildrensParties />} />
        <Route path="/milestone-celebrations" element={<Milestones />} />
        <Route path="/corporate-brand-styling" element={<CorporateAndBrand />} />
        {LOCATIONS.map((loc) => (
          <Route
            key={loc.slug}
            path={`/party-styling-${loc.slug}`}
            element={<LocationPage />}
          />
        ))}
        {ARTICLES.map((a) => (
          <Route
            key={a.slug}
            path={`/journal/${a.slug}`}
            element={<Article />}
          />
        ))}
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

