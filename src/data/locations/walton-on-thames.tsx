import { makeLocation } from "./_makeLocation";

const waltonOnThames = makeLocation({
  slug: "walton-on-thames",
  cityName: "Walton-on-Thames",
  region: "Surrey",
  nearbyVillages: [
    "Hersham",
    "Weybridge",
    "Oatlands",
    "Whiteley Village",
    "Sunbury",
    "Shepperton",
  ],
  areas: [
    "Walton-on-Thames",
    "Hersham",
    "Weybridge",
    "Oatlands",
    "Whiteley Village",
    "Sunbury",
    "Shepperton",
    "Esher",
    "Cobham",
    "East Molesey",
    "West Molesey",
    "Hampton",
  ],
  mapQuery: "Walton-on-Thames,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Walton-on-Thames",
    "Hersham",
    "Oatlands",
    "Sunbury",
    "Shepperton",
    "Surrey",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        Walton-on-Thames sits on a beautiful stretch of the river
        between Weybridge and Hampton Court — riverside parties,
        garden gatherings and family celebrations are part of the
        regular rhythm here.
      </p>
      <p>
        The river is the organising fact of styling in Walton — and
        the source of most of the area's prettiest at-home
        celebrations. Riverside properties along Walton Lane and the
        roads off it deliver garden parties that lean into the
        landscape, with looser meadow florals and natural-fibre
        finishes that suit the setting better than anything more
        polished. Oatlands Park brings the family-residential
        rhythm: christenings, first birthdays, milestone garden
        gatherings. Hersham and the Whiteley Village edge sit on a
        slightly different register — quieter, more village-feel.
        We design accordingly.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Walton celebrations span first birthdays in family gardens around Oatlands Park, christenings at riverside homes along Walton Lane, milestone moments at private venues, and corporate launches at the area's landmark spaces. Brooklands and Mercedes-Benz World sit just along the road.",
  uniquePresenceAnswer:
    "Yes — Walton-on-Thames is part of our regular Surrey coverage. The patch runs across Walton riverside, Oatlands Park, Hersham and the Whiteley Village edge, with Weybridge a short hop along the road. Notable venues nearby include Brooklands and Mercedes-Benz World.",
  uniqueExtraFaqs: [
    {
      q: "Do you cover riverside parties in Walton?",
      a: "Yes — riverside celebrations are part of the Walton rhythm. Whether it's a party at a home looking onto the Thames, a Walton Lane garden, or a venue along the river, share the location in your enquiry and we'll come back with how we'd style the space.",
    },
    {
      q: "Are the Oatlands Park celebrations within your area?",
      a: "Yes — Oatlands Park and the surrounding family-residential roads are part of the regular Walton patch. Most celebrations there happen at home — christenings, first birthdays, milestone garden gatherings — and we install on-site, manage the day discreetly, and clear after the last guest has left.",
    },
  ],
});

export default waltonOnThames;
