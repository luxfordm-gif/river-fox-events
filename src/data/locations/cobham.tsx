import { makeLocation } from "./_makeLocation";

const cobham = makeLocation({
  slug: "cobham",
  cityName: "Cobham",
  region: "Surrey",
  nearbyVillages: [
    "Oxshott",
    "Stoke d'Abernon",
    "Downside",
    "Effingham",
    "Esher",
    "Weybridge",
  ],
  areas: [
    "Cobham",
    "Oxshott",
    "Stoke d'Abernon",
    "Downside",
    "Effingham",
    "Leatherhead",
    "Bookham",
    "Esher",
    "Weybridge",
    "Walton-on-Thames",
    "Hersham",
    "Claygate",
  ],
  mapQuery: "Cobham,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Cobham",
    "Oxshott",
    "Stoke d'Abernon",
    "Downside",
    "Effingham",
    "Surrey",
  ],
});

export default cobham;
