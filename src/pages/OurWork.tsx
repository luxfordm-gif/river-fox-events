import { useEffect } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta, breadcrumbSchema, removeJsonLd, upsertJsonLd } from "@/seo/headTags";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { GALLERY, resolvePhoto } from "@/data/gallery";
import type { GalleryEvent, GallerySection } from "@/data/gallery";

/**
 * /our-work/ - a curated gallery of Laura's real events, grouped by occasion.
 * All content comes from src/data/gallery.ts; this file is layout only.
 */

/* One event: a large lead photo, up to two smaller tiles beneath, caption. */
const EventCard = ({ event, compact }: { event: GalleryEvent; compact?: boolean }) => {
  const [lead, ...rest] = event.photos.map(resolvePhoto);
  const extras = rest.slice(0, 2);
  return (
    <figure className="gallery-event fade-up m-0">
      <div className="overflow-hidden rounded-[10px] bg-ink/5">
        <img
          src={lead.src}
          srcSet={lead.srcSet}
          sizes={
            compact
              ? "(min-width: 1440px) 330px, (min-width: 768px) 23vw, 46vw"
              : "(min-width: 1440px) 440px, (min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
          }
          alt={lead.alt}
          width={lead.width}
          height={lead.height}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
          style={compact ? { aspectRatio: "4 / 5", objectFit: "cover", objectPosition: lead.position } : undefined}
        />
      </div>
      {extras.length > 0 && (
        <div className={`grid gap-2 md:gap-3 mt-2 md:mt-3 ${extras.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {extras.map((p) => (
            <div key={p.source} className="overflow-hidden rounded-[10px] bg-ink/5">
              <img
                src={p.src}
                srcSet={p.srcSet}
                sizes={
                  extras.length === 1
                    ? "(min-width: 1440px) 440px, (min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
                    : "(min-width: 1440px) 220px, (min-width: 1280px) 15vw, (min-width: 768px) 22vw, 46vw"
                }
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                className="block w-full h-full object-cover"
                style={{
                  aspectRatio: extras.length === 1 ? "16 / 10" : "1 / 1",
                  objectPosition: p.position,
                }}
              />
            </div>
          ))}
        </div>
      )}
      <figcaption className="mt-3 md:mt-4">
        <span
          className="block font-serif-rf text-ink"
          style={{
            fontSize: compact ? "clamp(17px, 1.4vw, 20px)" : "var(--fs-h4)",
            lineHeight: 1.2,
            fontWeight: 400,
            letterSpacing: "-0.012em",
            textWrap: "balance",
          }}
        >
          {event.title}
        </span>
        {event.place && (
          <span
            className="block mt-1.5 font-mono-rf text-[10px] md:text-[10.5px] tracking-[0.22em] uppercase text-ink-soft"
            style={{ fontWeight: 600 }}
          >
            {event.place}
          </span>
        )}
      </figcaption>
    </figure>
  );
};

const Section = ({ section, index }: { section: GallerySection; index: number }) => (
  <section
    id={section.id}
    className={`rfx-section gallery-section ${index % 2 === 0 ? "white" : ""}`}
    aria-labelledby={`${section.id}-heading`}
  >
    <div className="container-rfx">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-12 mb-10 md:mb-14 items-end">
        <h2
          id={`${section.id}-heading`}
          className="font-serif-rf fade-up m-0"
          style={{
            fontSize: "var(--fs-h2)",
            lineHeight: 1.04,
            fontWeight: 300,
            letterSpacing: "-0.025em",
          }}
        >
          {section.titleLead}{" "}
          <em className="italic font-light text-accent-warm">{section.titleAccent}</em>
        </h2>
        <div className="pb-2">
          <p className="text-[15.5px] leading-[1.6] text-ink-soft m-0 max-w-[46ch]">
            {section.intro}
          </p>
          <a href={section.link.href} className="btn-link-rf mt-4" style={{ fontWeight: 600 }}>
            {section.link.label} <span className="arr">→</span>
          </a>
        </div>
      </div>

      {section.compact ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
          {section.events.map((e) => (
            <EventCard key={e.title} event={e} compact />
          ))}
        </div>
      ) : (
        <div className="gallery-masonry">
          {section.events.map((e) => (
            <EventCard key={e.title} event={e} />
          ))}
        </div>
      )}
    </div>
  </section>
);

const OurWork = () => {
  useFadeUp();
  useNavScroll();

  useEffect(() => {
    const route = findRoute("/our-work")!;
    applyMeta(route);

    const breadcrumbId = "rfx-jsonld-bc-our-work";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);
    return () => removeJsonLd(breadcrumbId);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground nav-solid">
      <Nav />
      <main>
        <header className="container-rfx pt-[106px] md:pt-[122px] pb-10 md:pb-14 text-center">
          <h1
            className="font-serif-rf max-w-[16ch] mx-auto"
            style={{
              fontSize: "var(--fs-h1)",
              lineHeight: 1.02,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Our work, by occasion.
          </h1>
          <p
            className="mt-5 md:mt-7 max-w-[46ch] mx-auto text-[16px] md:text-[19px] leading-[1.55] text-ink-soft"
            style={{ textWrap: "pretty" }}
          >
            Real parties and events Laura has styled across Surrey, grouped so
            you can find the kind of day you have in mind.
          </p>
          <nav aria-label="Jump to an occasion" className="mt-8 md:mt-10 flex flex-wrap justify-center gap-2 md:gap-3">
            {GALLERY.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="no-underline-fx font-mono-rf text-[10.5px] md:text-[11px] tracking-[0.2em] uppercase text-ink border border-ink/20 hover:border-ink rounded-[4px] px-4 py-2.5 transition-colors"
                style={{ fontWeight: 600 }}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </header>

        {GALLERY.map((s, i) => (
          <Section key={s.id} section={s} index={i} />
        ))}

        <section className="rfx-section" aria-labelledby="our-work-cta">
          <div className="container-rfx text-center">
            <h2
              id="our-work-cta"
              className="font-serif-rf fade-up m-0 mx-auto max-w-[18ch]"
              style={{
                fontSize: "var(--fs-h2)",
                lineHeight: 1.04,
                fontWeight: 300,
                letterSpacing: "-0.025em",
                textWrap: "balance",
              }}
            >
              Have a date <em className="italic font-light text-accent-warm">in mind?</em>
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.6] text-ink-soft max-w-[44ch] mx-auto">
              Tell Laura the date and the occasion, and she will come back to
              you with ideas and a quote.
            </p>
            <a
              href={ENQUIRE_HREF}
              onClick={handleEnquireClick}
              className="btn-solid-rf accent mt-8"
            >
              Reserve your date <span>→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurWork;
