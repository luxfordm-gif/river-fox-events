import { makeLocation } from "./_makeLocation";

const reigate = makeLocation({
  slug: "reigate",
  cityName: "Reigate",
  region: "Surrey",
  images: {
    heroFan: ["stubbs-gender-reveal", "dinosaur-ayaan", "veuve-disco"],
    galleryMain: "40th-rose-gold",
    galleryThumbs: ["naming-harvey-daisy", "jungle-elephant", "baby-shower-bloom"],
  },
  uniqueSeoTitle: "Reigate Party & Event Stylist | River Fox Events",
  uniqueSeoDescription:
    "Layered tablescapes, milestone parties and at-home celebrations in Reigate. Personally designed and installed by Laura.",
  uniqueHeroSub: (
    <>
      Sketched, styled, installed. Studio-led celebrations in Reigate and the
      surrounding villages.
    </>
  ),
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
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Reigate party stylist designing tailored
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the RH2
        postcode. Every celebration is built from scratch around your
        brief — concept, balloon installations, backdrops, signage,
        cake table and tablescape, all installed and broken down by
        us.
      </p>
      <p>
        Our studio is in Horley, fifteen minutes south, which makes
        Reigate one of the closest towns we cover. That proximity
        means flexible install windows, late-night breakdowns and the
        kind of last-minute adjustments that aren't realistic from a
        stylist further afield.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Reigate celebrations split between family at-home work on
        Reigate Hill and across the Reigate Heath residential roads,
        milestone events at private homes throughout Banstead and
        Tadworth, and country-house weddings at Hartsfield Manor and
        Nutfield Priory. We scale the styling to either: a single
        statement installation for an intimate party, or a full multi-
        zone styling across reception rooms, gardens and marquees.
      </p>
    </>
  ),
  uniqueLocalProse: {
    eyebrow: "STYLING IN REIGATE",
    heading: (
      <>
        Fifteen minutes{" "}
        <em className="italic font-light text-accent-warm">from us.</em>
      </>
    ),
    body: (
      <>
        <p>
          Reigate is fifteen minutes from the studio — closer than
          Cobham, closer than Esher, closer than the towns that shape
          most Surrey stylists' work. That proximity changes what's
          possible on the day: extra installations sourced and added
          on the morning, layout changes absorbed without panic,
          breakdowns at midnight that don't blow up the next day.
        </p>
        <p>
          The work itself splits between intimate at-home celebrations
          on Reigate Hill and the Heath, and country-house weddings at
          Hartsfield Manor and Nutfield Priory. Residential briefs
          usually one statement installation and a tablescape; the
          weddings run multi-zone across reception rooms, gardens,
          marquees. Different scale, same hands.
        </p>
      </>
    ),
  },
});

export default reigate;
