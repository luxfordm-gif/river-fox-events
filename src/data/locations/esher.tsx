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
  uniqueWhatWeDoBody: (
    <>
      <p>
        Esher's mix of village high street, Sandown Park horizon and
        the Claygate edge gives us a wide range of settings to design
        for — from cake-table christenings at home through to large-
        scale activations at landmark venues.
      </p>
      <p>
        Each part of Esher has its own pattern. The village high
        street and the family residential roads off it deliver the
        bulk of the at-home christenings and first birthdays.
        Hinchley Wood and Claygate lean into garden parties and
        marquee weekends. Sandown Park, on the racecourse side,
        brings the corporate hospitality days, the larger-format
        weddings and the higher-volume brand activations — a
        completely different design challenge to a 20-guest sit-
        down dinner in a Thames Ditton townhouse.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Esher celebrations span children's parties across Hinchley Wood and Claygate, milestone birthdays at Esher's high-street restaurants, and family events at private homes throughout the area. Sandown Park sits within the area as one of Surrey's best-known event venues.",
  uniquePresenceAnswer:
    "Yes — Esher and the wider area are part of our regular coverage. The patch runs from Esher village across Hinchley Wood, Claygate, Long Ditton and Thames Ditton. Notable venues in the area include Sandown Park, with East and West Molesey also within easy reach.",
  uniqueExtraFaqs: [
    {
      q: "Is Sandown Park within your coverage area?",
      a: "Yes — Sandown Park sits right in our Esher patch. Whatever room or marquee you're booking there, share your brief in your enquiry and we'll come back with a tailored styling proposal for the space.",
    },
    {
      q: "Do you handle corporate hospitality days at Sandown?",
      a: "Yes — corporate hospitality at Sandown is a regular thread in our Esher work. The Eclipse Suite, the Surrey Hall and the boxes each take a different design approach; share your brand assets, expected guest count and the timing window when you enquire and we'll come back with an installation plan that suits both the space and the audience.",
    },
  ],
});

export default esher;
