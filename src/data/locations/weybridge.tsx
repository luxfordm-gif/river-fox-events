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
  uniqueWhatWeDoLead:
    "Weybridge KT13 has a particular feel — St George's Hill, Brooklands and the riverside between them — and the celebrations we design here lean into that. Garden parties, milestone moments, riverside christenings at home.",
  uniqueOccasionsLead:
    "Weybridge celebrations span private homes on St George's Hill and Oatlands Park, riverside properties looking onto the Thames, and the Hersham/Whiteley Village edge. Notable nearby venues include Brooklands Museum, the Heritage Centre and Mercedes-Benz World a short hop along the road.",
  uniquePresenceAnswer:
    "Yes — Weybridge KT13 and the surrounding area sit firmly within our coverage. The patch runs from St George's Hill and Oatlands Park through to riverside Walton, and into Hersham and Whiteley Village. Notable venues nearby include Brooklands Museum, the Heritage Centre and Mercedes-Benz World.",
  uniqueExtraFaq: {
    q: "Are venues like Brooklands or Mercedes-Benz World within your area?",
    a: "Yes — both sit firmly within the Weybridge patch we cover. Whatever your venue, share the detail in your enquiry — a Brooklands Museum room, an MBW activation, a private home on St George's Hill — and we'll come back with how we'd style it.",
  },
});

export default weybridge;
