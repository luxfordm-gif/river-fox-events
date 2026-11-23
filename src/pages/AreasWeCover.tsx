import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import TrustLine from "@/components/rfx/TrustLine";
import Enquire from "@/components/rfx/Enquire";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { useNavScroll } from "@/hooks/useRiverFox";
import { TOWNS } from "@/data/locations/towns";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  upsertJsonLd,
} from "@/seo/headTags";

/** The towns come from the light list in towns.ts, in its order: the first
    ten are Surrey, the rest are the Sussex and west Kent side. */
const SURREY_COUNT = 10;
const GROUPS = [
  { title: "Surrey", towns: TOWNS.slice(0, SURREY_COUNT) },
  { title: "Sussex and west Kent", towns: TOWNS.slice(SURREY_COUNT) },
];

const MAP_QUERY = "Surrey,England,UK&z=9";

const AreasWeCover = () => {
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/areas-we-cover")!;
    applyMeta(route);

    const breadcrumbId = "rfx-jsonld-bc-areas-we-cover";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);
    return () => removeJsonLd(breadcrumbId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main className="flex-1">
        <PageHeader
          divider
          id="areas-heading"
          title={
            <>
              Areas I <em className="t-accent">cover.</em>
            </>
          }
          intro="Based in Horley, I style parties and events across Surrey and London, and into Sussex and west Kent. Wherever the celebration is, I come to you."
        >
          <TrustLine linked className="text-to-action" />
        </PageHeader>
        <section className="after-page-header section-bottom" aria-labelledby="areas-heading">
          <div className="container-rfx">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] columns-gap items-start">
              {/* Left: the towns, each with its own page */}
              <div data-track-location="areas-list">
                {GROUPS.map((g, i) => (
                  <div key={g.title} className={i > 0 ? "text-to-content" : undefined}>
                    <h2 className="t-h5 text-ink">{g.title}</h2>
                    <ul className="heading-to-content grid grid-cols-1 sm:grid-cols-2 col-gap w-full border-t border-divider">
                      {g.towns.map((t) => (
                        <li
                          key={t.slug}
                          className="row-pad-y border-b border-divider t-body text-ink"
                        >
                          <a href={`/party-styling-${t.slug}/`} className="text-ink text-link">
                            {t.cityName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="t-small text-ink-soft text-to-content measure-lead">
                  Don't see your town? Ask. I travel further for the right
                  event, so <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="text-link">send me the details</a>.
                </p>
              </div>

              {/* Right: map */}
              <div className="w-full overflow-hidden rounded-large border border-divider shadow-soft">
                <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                  <iframe
                    title="Map of Surrey, England - areas covered by River Fox Events"
                    src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
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
        <Enquire venuePlaceholder="e.g. at home in Cobham" />
      </main>
      <Footer />
    </div>
  );
};

export default AreasWeCover;
