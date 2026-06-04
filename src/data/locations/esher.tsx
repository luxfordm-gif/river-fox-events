import { makeLocation } from "./_makeLocation";

const esher = makeLocation({
  slug: "esher",
  cityName: "Esher",
  region: "Surrey",
  images: {
    heroFan: ["stubbs-gender-reveal", "pastel-safari-anaya", "jungle-elephant"],
    galleryMain: "wonka-chocolate-arch",
    galleryThumbs: ["fairy-kayla", "40th-rose-gold", "veuve-disco"],
  },
  uniqueSeoTitle: "Esher Party & Event Stylist | River Fox Events",
  uniqueSeoDescription:
    "Personally designed celebrations at Sandown Park, Claygate and across Esher. Considered parties and milestones, installed and managed by Laura.",
  uniqueHeroSub: (
    <>
      Personally led styling in Esher. From first idea to final breakdown, every
      detail handled.
    </>
  ),
  uniqueUspBody:
    "Polished, cohesive celebrations are what Esher clients return for. Each design centres on statement installations and considered detail, tailored to your venue and vision, with a finish that reads as calm and distinctive by the time your first guest arrives.",
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
        River Fox Events is an Esher party stylist designing tailored
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the KT10
        postcode. Every celebration is individually designed around your
        brief - concept, balloon installations, backdrops, signage,
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
  uniqueLocalProse: {
    eyebrow: "STYLING IN ESHER",
    heading: (
      <>
        On the ground{" "}
        <em className="italic font-light text-accent-warm">here.</em>
      </>
    ),
    body: (
      <>
        <p>
          Sandown Park anchors a lot of our Esher work - the Eclipse
          Suite, Surrey Hall and the boxes each ask for something
          different, and a stylist who hasn't worked the building
          before learns that the hard way. The off-site work splits
          between milestone dinners at the high-street restaurants and
          at-home parties across the village, which run from intimate
          to genuinely large.
        </p>
        <p>
          Different briefs, same approach: one designer, one install
          team, one point of contact from the first call to the
          breakdown.
        </p>
      </>
    ),
  },
});

export default esher;
