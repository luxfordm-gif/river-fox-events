/**
 * The town pages as a light list: slug and name only (speed pass,
 * 2026-11-13). The footer, the "Areas I cover" links and the router need just
 * these, so they no longer pull every town's full page copy into the code
 * every visitor downloads; that now loads only on town pages.
 *
 * Same towns, same order as LOCATIONS in ./index.tsx. Add a new town in both
 * places; src/test/towns.test.ts fails if they drift apart.
 */
export type Town = { slug: string; cityName: string };

export const TOWNS: Town[] = [
  // Surrey
  { slug: "oxted", cityName: "Oxted" },
  { slug: "cobham", cityName: "Cobham" },
  { slug: "weybridge", cityName: "Weybridge" },
  { slug: "esher", cityName: "Esher" },
  { slug: "reigate", cityName: "Reigate" },
  { slug: "oxshott", cityName: "Oxshott" },
  { slug: "guildford", cityName: "Guildford" },
  { slug: "walton-on-thames", cityName: "Walton-on-Thames" },
  { slug: "dorking", cityName: "Dorking" },
  { slug: "epsom", cityName: "Epsom" },
  // Sussex/Kent corridor
  { slug: "east-grinstead", cityName: "East Grinstead" },
  { slug: "lingfield", cityName: "Lingfield" },
  { slug: "crawley", cityName: "Crawley" },
  { slug: "horsham", cityName: "Horsham" },
  { slug: "haywards-heath", cityName: "Haywards Heath" },
  { slug: "tunbridge-wells", cityName: "Tunbridge Wells" },
  { slug: "sevenoaks", cityName: "Sevenoaks" },
  { slug: "forest-row", cityName: "Forest Row" },
  { slug: "lewes", cityName: "Lewes" },
  { slug: "brighton-and-hove", cityName: "Brighton & Hove" },
];
