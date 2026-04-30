import type { LocationConfig } from "./types";
import oxted from "./oxted";
import cobham from "./cobham";
import weybridge from "./weybridge";
import esher from "./esher";
import reigate from "./reigate";

export const LOCATIONS: LocationConfig[] = [
  oxted,
  cobham,
  weybridge,
  esher,
  reigate,
];

export const findLocation = (slug: string): LocationConfig | undefined =>
  LOCATIONS.find((l) => l.slug === slug);
