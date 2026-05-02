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
        River Fox Events is a Weybridge party stylist designing
        bespoke children's parties, milestone birthdays, christenings,
        baby showers, weddings and corporate styling across the KT13
        postcode. Every celebration is built from scratch around your
        brief — concept, balloon installations, backdrops, signage,
        cake table and tablescape, all installed and broken down by
        us.
      </p>
      <p>
        Our studio is in Horley and Weybridge sits firmly in our
        regular Surrey coverage. Same-day install and breakdown, full
        management on the day, and every detail designed and
        delivered personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Weybridge celebrations split between family at-home work on
        St George's Hill and across Oatlands Park, riverside
        celebrations along the Thames, and venue events at Brooklands
        Museum and Mercedes-Benz World. We scale the styling to
        either: a single statement installation for an intimate
        celebration, or a full multi-zone styling across drawing
        rooms, gardens and marquees.
      </p>
    </>
  ),
  uniquePresenceAnswer:
    "Yes — Weybridge and the surrounding area sit firmly within our coverage. We cover St George's Hill, Oatlands Park, riverside Walton, Hersham and Whiteley Village, plus venue work at Brooklands Museum, the Heritage Centre and Mercedes-Benz World. Mention your venue or postcode in your enquiry and we'll come back with a styling proposal designed for your space.",
  uniqueLocalProse: {
    eyebrow: "STYLING IN WEYBRIDGE",
    heading: (
      <>
        Three lanes{" "}
        <em className="italic font-light text-accent-warm">of work.</em>
      </>
    ),
    body: (
      <>
        <p>
          Weybridge celebrations tend to fall into three groups. There
          are the private at-home events on St George's Hill and across
          Oatlands Park, where properties have the space to host across
          drawing rooms, gardens and marquees. There's the riverside
          work along the Thames. And there's the venue side — Brooklands
          Museum, the Heritage Centre and Mercedes-Benz World — each
          with their own logistics and brand cues.
        </p>
        <p>
          The town is a comfortable drive from the studio via the A3 and
          the A317, which keeps install and breakdown windows realistic.
          Same-morning installs, late-night clears once the last guest
          has left, and the kind of small on-the-day adjustments — an
          extra balloon column, a tablescape tweak — that aren't workable
          from a stylist further afield. The same applies across
          Walton-on-Thames, Hersham and Whiteley Village.
        </p>
        <p>
          Most enquiries arrive with a date, a venue and a rough sense
          of the feel. From there we shape every detail together —
          palette, installations, signage, tablescape, the install and
          the clear-down. Laura designs and runs every celebration
          personally.
        </p>
      </>
    ),
  },
  uniqueExtraFaqs: [
    {
      q: "Are venues like Brooklands or Mercedes-Benz World within your area?",
      a: "Yes — both sit firmly within the Weybridge patch we cover. Whatever your venue, share the detail in your enquiry — a Brooklands Museum room, an MBW activation, a private home on St George's Hill — and we'll come back with how we'd style it.",
    },
    {
      q: "Do you cover St George's Hill private estate celebrations?",
      a: "Yes — St George's Hill is one of the most-asked-about parts of our Weybridge coverage. The private estate properties typically host across multiple zones (drawing rooms, kitchens, gardens, marquees) and we install across all of them in a single morning, manage the day discreetly, and clear afterwards.",
    },
  ],
});

export default weybridge;
