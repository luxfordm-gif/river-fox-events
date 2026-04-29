import type { ReactNode } from "react";
import type { IncludedItem } from "@/components/rfx/CPIncluded";

export type DetailRow = { label: string; value: string };

export type LocationCopyBlock = {
  eyebrow: string;
  headline: ReactNode;
  body?: ReactNode;
  rows?: DetailRow[];
  themePills?: string[];
  closingLine?: ReactNode;
  tone?: "white" | "warm" | "blush";
};

export type PricingTier = { price: string; label: string; body: string };

export type LocationFAQ = { q: string; a: string };

export type LocationConfig = {
  slug: string;
  cityName: string;
  seoTitle: string;
  seoDescription: string;
  hero: {
    lines: ReactNode[];
    sub: ReactNode;
    image?: string;
    imageAlt?: string;
  };
  whatWeDo: LocationCopyBlock;
  occasions: LocationCopyBlock;
  themes: LocationCopyBlock;
  included: {
    eyebrow: string;
    heading: ReactNode;
    items: IncludedItem[];
    closingLine: ReactNode;
  };
  pricing: {
    heading: ReactNode;
    tiers: PricingTier[];
    footnote: string;
  };
  faqs: LocationFAQ[];
  nearby: {
    eyebrow: string;
    heading: ReactNode;
    intro: ReactNode;
    areas: string[];
    mapQuery: string;
    mapTitle: string;
  };
  jsonLdAreaServed: string[];
};
