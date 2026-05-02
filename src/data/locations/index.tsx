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
import eastGrinstead from "./east-grinstead";
import lingfield from "./lingfield";
import crawley from "./crawley";
import horsham from "./horsham";
import haywardsHeath from "./haywards-heath";
import tunbridgeWells from "./tunbridge-wells";
import sevenoaks from "./sevenoaks";
import forestRow from "./forest-row";
import lewes from "./lewes";
import brightonAndHove from "./brighton-and-hove";

export const LOCATIONS: LocationConfig[] = [
  // Surrey
  oxted,
  cobham,
  weybridge,
  esher,
  reigate,
  oxshott,
  guildford,
  waltonOnThames,
  dorking,
  // Sussex/Kent corridor
  eastGrinstead,
  lingfield,
  crawley,
  horsham,
  haywardsHeath,
  tunbridgeWells,
  sevenoaks,
  forestRow,
  lewes,
  brightonAndHove,
];

export const findLocation = (slug: string): LocationConfig | undefined =>
  LOCATIONS.find((l) => l.slug === slug);
