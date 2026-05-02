import type { ReactNode } from "react";
import type { IncludedItem } from "@/components/rfx/CPIncluded";

export type LocationRevealSection = {
  headline: ReactNode;
  body: ReactNode;
  /** When set, renders a 2-column numbered serif list inside the content area. */
  themesList?: string[];
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
  /** ph-warm or ph-blush — subtle background tint on the image card. */
  tone?: string;
};

export type PricingTier = { price: string; label: string; body: string };

export type LocationFAQ = { q: string; a: string };

export type LocationConfig = {
  slug: string;
  cityName: string;
  region: string;
  seoTitle: string;
  seoDescription: string;
  hero: {
    lines: ReactNode[];
    sub: ReactNode;
    image?: string;
    imageAlt?: string;
  };
  whatWeDo: LocationRevealSection;
  occasions: LocationRevealSection;
  gallery: {
    eyebrow?: string;
    heading?: ReactNode;
    intro?: ReactNode;
    mainImage: string;
    mainImageAlt: string;
    images: { src: string; alt: string }[];
  };
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
