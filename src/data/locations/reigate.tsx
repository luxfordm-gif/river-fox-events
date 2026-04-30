import { makeLocation } from "./_makeLocation";

const reigate = makeLocation({
  slug: "reigate",
  cityName: "Reigate",
  region: "Surrey",
  nearbyVillages: [
    "Redhill",
    "Banstead",
    "Tadworth",
    "Betchworth",
    "Brockham",
    "Dorking",
  ],
  areas: [
    "Reigate",
    "Redhill",
    "Banstead",
    "Tadworth",
    "Betchworth",
    "Leigh",
    "Brockham",
    "Dorking",
    "Horley",
    "Earlswood",
    "Merstham",
    "Salfords",
  ],
  mapQuery: "Reigate,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Reigate",
    "Redhill",
    "Banstead",
    "Tadworth",
    "Betchworth",
    "Surrey",
  ],
});

export default reigate;
