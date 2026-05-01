import type { LocationConfig } from "./types";
import oxted from "./oxted";
import cobham from "./cobham";
import weybridge from "./weybridge";
import esher from "./esher";
import reigate from "./reigate";
import oxshott from "./oxshott";
import guildford from "./guildford";
import waltonOnThames from "./walton-on-thames";
import dorking from "./dorking";

export const LOCATIONS: LocationConfig[] = [
  oxted,
  cobham,
  weybridge,
  esher,
  reigate,
  oxshott,
  guildford,
  waltonOnThames,
  dorking,
];

export const findLocation = (slug: string): LocationConfig | undefined =>
  LOCATIONS.find((l) => l.slug === slug);
