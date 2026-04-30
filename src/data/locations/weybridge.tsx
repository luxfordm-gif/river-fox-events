import { makeLocation } from "./_makeLocation";

const weybridge = makeLocation({
  slug: "weybridge",
  cityName: "Weybridge",
  region: "Surrey",
  nearbyVillages: [
    "Walton-on-Thames",
    "Hersham",
    "Oatlands",
    "Whiteley Village",
    "Brooklands",
    "Cobham",
  ],
  areas: [
    "Weybridge",
    "Walton-on-Thames",
    "Hersham",
    "Oatlands",
    "Whiteley Village",
    "Cobham",
    "Esher",
    "Byfleet",
    "Addlestone",
    "Chertsey",
    "Shepperton",
    "Sunbury",
  ],
  mapQuery: "Weybridge,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Weybridge",
    "Walton-on-Thames",
    "Hersham",
    "Oatlands",
    "Whiteley Village",
    "Surrey",
  ],
});

export default weybridge;
