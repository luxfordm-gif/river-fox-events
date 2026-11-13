import { ReactNode } from "react";
import { LOCATIONS } from "@/data/locations";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";

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
    Areas I{" "}
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
    I'm based in Horley and cover the whole of Surrey and into London.
    Wherever the celebration is, I come to you, set everything up before
    guests arrive and pack it all down once it's over.
  </>
);

const CPLocations = ({
  areas = DEFAULT_AREAS,
  intro = DEFAULT_INTRO,
  mapQuery = "Surrey,England,UK&z=9",
  mapTitle = "Map of Surrey, England - areas covered by River Fox Events",
  eyebrow,
  heading = DEFAULT_HEADING,
  paddingTop,
  paddingBottom,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 columns-gap items-center">
          {/* Left - copy + areas list */}
          <div className="flex flex-col items-start text-left fade-up">
            {eyebrow && (
              <div className="t-overline text-ink-soft eyebrow-above">
                {eyebrow}
              </div>
            )}
            <SectionHeading id="cp-locations-heading" align="left">{heading}</SectionHeading>
            <SectionIntro size="small" align="left">{intro}</SectionIntro>

            <ul className="text-to-content grid grid-cols-2 col-gap w-full measure-lead border-t border-divider">
              {areas.map((a, i) => {
                const slug = SLUG_BY_CITY.get(a);
                const link = slug && slug !== currentSlug;
                return (
                  <li
                    key={a}
                    className="flex items-baseline icon-gap row-pad-y border-b border-divider t-body text-ink"
                  >
                    <span className="t-overline text-ink-soft">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link ? (
                      <a
                        href={`/party-styling-${slug}/`}
                        className="text-ink text-link"
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
          <div className="w-full overflow-hidden rounded-large border border-divider shadow-[0_22px_44px_-22px_hsl(var(--text-primary)/0.18)] fade-up">
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
