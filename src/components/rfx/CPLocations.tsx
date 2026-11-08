import { ReactNode } from "react";
import { LOCATIONS } from "@/data/locations";

type CPLocationsProps = {
  areas?: string[];
  intro?: ReactNode;
  mapQuery?: string;
  mapTitle?: string;
  eyebrow?: string;
  heading?: ReactNode;
  paddingTop?: string;
  paddingBottom?: string;
  /** Slug of the current location page, if any. We'll skip linking the
   *  current city to itself - every other matching area gets a link. */
  currentSlug?: string;
};

// Town name → location-page slug. Used to convert plain area names in the
// bullet list into internal links wherever we have a dedicated page -
// boosts cross-linking between every service page, every location page
// and every other location page that shares a town.
const SLUG_BY_CITY = new Map(LOCATIONS.map((l) => [l.cityName, l.slug]));

const DEFAULT_HEADING: ReactNode = (
  <>
    Areas we{" "}
    <em className="t-accent">cover.</em>
  </>
);

const DEFAULT_AREAS = [
  "Cobham",
  "Weybridge",
  "Esher",
  "Oxshott",
  "Guildford",
  "Reigate",
  "Walton-on-Thames",
  "Dorking",
  "Epsom",
  "Oxted",
  "East Grinstead",
  "Horsham",
];

const DEFAULT_INTRO: ReactNode = (
  <>
    Based in Surrey and travelling across the county and into London for
    clients who care about the difference that detail makes. Wherever the
    celebration, we come to you - set up before guests arrive and packed
    down once the day is done.
  </>
);

const CPLocations = ({
  areas = DEFAULT_AREAS,
  intro = DEFAULT_INTRO,
  mapQuery = "Surrey,England,UK&z=9",
  mapTitle = "Map of Surrey, England - areas covered by River Fox Events",
  eyebrow,
  heading = DEFAULT_HEADING,
  paddingTop = "48px",
  paddingBottom = "72px",
  currentSlug,
}: CPLocationsProps = {}) => {
  return (
    <section
      id="locations"
      className="rfx-section white"
      style={{ paddingTop, paddingBottom }}
      aria-labelledby="cp-locations-heading"
    >
      <div className="container-rfx">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - copy + areas list */}
          <div className="flex flex-col items-start text-left fade-up">
            {eyebrow && (
              <div className="t-eyebrow text-ink-soft mb-4">
                {eyebrow}
              </div>
            )}
            <h2
              id="cp-locations-heading"
              className="t-h2"
              style={{ textWrap: "balance" }}
            >
              {heading}
            </h2>
            <p
              className="mt-6 t-lead text-ink-soft max-w-[520px]"
              style={{ textWrap: "pretty" }}
            >
              {intro}
            </p>

            <ul className="mt-10 grid grid-cols-2 gap-x-12 w-full max-w-[520px] border-t border-ink/15">
              {areas.map((a, i) => {
                const slug = SLUG_BY_CITY.get(a);
                const link = slug && slug !== currentSlug;
                return (
                  <li
                    key={a}
                    className="flex items-baseline gap-3 py-3 border-b border-ink/15 t-h4 text-ink"
                  >
                    <span className="t-eyebrow text-ink-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link ? (
                      <a
                        href={`/party-styling-${slug}/`}
                        className="text-ink hover:underline underline-offset-4 decoration-ink/40"
                      >
                        {a}
                      </a>
                    ) : (
                      a
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right - map covering the whole of Surrey */}
          <div className="w-full overflow-hidden rounded-chip border border-ink/15 shadow-[0_22px_44px_-22px_hsl(var(--ink)/0.18)] fade-up">
            <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
              <iframe
                title={mapTitle}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0 grayscale-[0.15]"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CPLocations;
