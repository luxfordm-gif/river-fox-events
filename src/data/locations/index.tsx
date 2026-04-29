import type { LocationConfig } from "./types";
import oxted from "./oxted";

export const LOCATIONS: LocationConfig[] = [oxted];

export const findLocation = (slug: string): LocationConfig | undefined =>
  LOCATIONS.find((l) => l.slug === slug);
