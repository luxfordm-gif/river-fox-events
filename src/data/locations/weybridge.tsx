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
  uniqueWhatWeDoBody: (
    <>
      <p>
        Weybridge has a particular feel — St George's Hill, Brooklands
        and the riverside between them — and the celebrations we
        design here lean into that. Garden parties, milestone
        moments, riverside christenings at home.
      </p>
      <p>
        Each pocket of Weybridge brings its own register. St George's
        Hill private estate properties tend toward properly polished
        landmark celebrations — full marquee weekends, multi-zone
        installations, sit-down dinners that need a stylist to
        handle the room rather than just dress it. Oatlands Park has
        a family-residential lean — christenings, first-birthday
        garden parties, the milestone moments that mark the
        calendar. Riverside properties along the Thames bring some
        of the prettiest at-home celebrations we style anywhere.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Weybridge celebrations span private homes on St George's Hill and Oatlands Park, riverside properties looking onto the Thames, and the Hersham/Whiteley Village edge. Notable nearby venues include Brooklands Museum, the Heritage Centre and Mercedes-Benz World a short hop along the road.",
  uniquePresenceAnswer:
    "Yes — Weybridge and the surrounding area sit firmly within our coverage. The patch runs from St George's Hill and Oatlands Park through to riverside Walton, and into Hersham and Whiteley Village. Notable venues nearby include Brooklands Museum, the Heritage Centre and Mercedes-Benz World.",
  uniqueExtraFaqs: [
    {
      q: "Are venues like Brooklands or Mercedes-Benz World within your area?",
      a: "Yes — both sit firmly within the Weybridge patch we cover. Whatever your venue, share the detail in your enquiry — a Brooklands Museum room, an MBW activation, a private home on St George's Hill — and we'll come back with how we'd style it.",
    },
    {
      q: "Do you cover St George's Hill private estate celebrations?",
      a: "Yes — St George's Hill is one of the most-asked-about parts of our Weybridge coverage. The private estate properties typically host across multiple zones (drawing rooms, kitchens, gardens, marquees) and we install across all of them in a single morning, manage the day discreetly, and clear afterwards. Mention the property and the day in your enquiry and we'll talk through how we'd approach it.",
    },
  ],
});

export default weybridge;
