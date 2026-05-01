import { makeLocation } from "./_makeLocation";

const esher = makeLocation({
  slug: "esher",
  cityName: "Esher",
  region: "Surrey",
  nearbyVillages: [
    "Claygate",
    "Hinchley Wood",
    "Long Ditton",
    "Thames Ditton",
    "Hersham",
    "Cobham",
  ],
  areas: [
    "Esher",
    "Claygate",
    "Hinchley Wood",
    "Long Ditton",
    "Thames Ditton",
    "Hersham",
    "Cobham",
    "Oxshott",
    "Walton-on-Thames",
    "East Molesey",
    "West Molesey",
    "Surbiton",
  ],
  mapQuery: "Esher,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Esher",
    "Claygate",
    "Hinchley Wood",
    "Long Ditton",
    "Thames Ditton",
    "Surrey",
  ],
  uniqueWhatWeDoLead:
    "Esher's KT10 mix of village high street, Sandown Park horizon and the Claygate edge gives us a wide range of settings to design for — from cake-table christenings at home through to large-scale activations at landmark venues.",
  uniqueOccasionsLead:
    "Esher celebrations span children's parties across Hinchley Wood and Claygate, milestone birthdays at Esher's high-street restaurants, and family events at private homes throughout KT10. Sandown Park sits within the area as one of Surrey's best-known event venues.",
  uniquePresenceAnswer:
    "Yes — Esher and the wider KT10 area are part of our regular coverage. The patch runs from Esher village across Hinchley Wood, Claygate, Long Ditton and Thames Ditton. Notable venues in the area include Sandown Park, with East and West Molesey also within easy reach.",
  uniqueExtraFaq: {
    q: "Is Sandown Park within your coverage area?",
    a: "Yes — Sandown Park sits right in our Esher patch. Whatever room or marquee you're booking there, share your brief in your enquiry and we'll come back with a tailored styling proposal for the space.",
  },
});

export default esher;
