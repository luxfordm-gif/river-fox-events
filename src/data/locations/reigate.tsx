import { makeLocation } from "./_makeLocation";

const reigate = makeLocation({
  slug: "reigate",
  cityName: "Reigate",
  region: "Surrey",
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
        Reigate sits where the North Downs meet Surrey's commuter belt
        — the villages around Reigate Hill and the Heath. A pace of
        celebration that blends town and country, which we like.
      </p>
      <p>
        From our Horley studio Reigate is barely fifteen minutes north
        — the closest of the established Surrey towns to us, which
        makes it part of our day-to-day rhythm rather than a stretch.
        Most enquiries land at family homes across the Reigate Hill
        residential roads, at Reigate Priory and the Heath, and at
        the country-house venues set into the surrounding villages.
        Christmas at Hartsfield Manor and the spring–summer wedding
        season at Nutfield Priory bracket the busiest parts of our
        Reigate calendar.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Reigate celebrations span family parties around Reigate Priory and the Heath, milestone birthdays at private homes across the area, and christenings throughout the surrounding villages. Country-house venues nearby include Hartsfield Manor and Nutfield Priory.",
  uniquePresenceAnswer:
    "Yes — Reigate, Redhill and the wider area sit within our regular coverage. The patch runs across Reigate Hill, Reigate Heath, the Priory area and into Banstead and Tadworth. Country-house venues in the surrounding area include Hartsfield Manor and Nutfield Priory.",
  uniqueExtraFaqs: [
    {
      q: "Are country-house venues like Hartsfield Manor or Nutfield Priory within your area?",
      a: "Yes — both sit firmly within our Reigate patch. If your celebration is at one of the country-house venues around Reigate, share the venue and date in your enquiry and we'll come back with how we'd approach the styling.",
    },
    {
      q: "How quickly can you reach Reigate from your Horley studio?",
      a: "Reigate is one of our closest towns — fifteen minutes north up the A23/A217. Because we're so close, we offer flexible install windows, late-night breakdowns and the kind of last-minute adjustments (extra balloons, layout tweaks, walking the room with you the day before) that aren't realistic from a stylist further afield.",
    },
  ],
});

export default reigate;
