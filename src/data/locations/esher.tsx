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
        River Fox Events is an Esher party stylist designing bespoke
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the KT10
        postcode. Every celebration is built from scratch around your
        brief — concept, balloon installations, backdrops, signage,
        cake table and tablescape, all installed and broken down by
        us.
      </p>
      <p>
        Our studio is in Horley and Esher sits firmly in our regular
        Surrey coverage. Full install and breakdown handled, every
        detail designed and managed personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Esher celebrations split between family at-home work across
        the village, Hinchley Wood and Claygate, milestone dinners at
        the high-street restaurants, and large-scale corporate and
        wedding work at Sandown Park. We scale the styling to either:
        a single statement installation for an intimate celebration,
        or a full multi-zone styling for a corporate hospitality day
        across multiple rooms.
      </p>
    </>
  ),
  uniquePresenceAnswer:
    "Yes — Esher and the wider area are part of our regular coverage. We cover Esher village, Hinchley Wood, Claygate, Long Ditton and Thames Ditton, plus venue work at Sandown Park and the high-street restaurants. East and West Molesey are also within easy reach. Mention your venue or postcode in your enquiry and we'll come back with a styling proposal designed for your space.",
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
