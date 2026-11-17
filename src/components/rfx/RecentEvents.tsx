import { SectionHeading } from "@/components/rfx/SectionHeading";
import { RECENT_EVENTS } from "@/data/recentEvents";
import "@/styles/home-sections.css";

/* Home page "Recent events" (Matt, 2026-11-17): Laura's latest work from
   Instagram, three events (src/data/recentEvents.ts). From tablet up it is a
   bento, a large lead photo beside two stacked ones, ending on one line;
   on phones it is a swipe row with the next card peeking in. */
const RecentEvents = () => (
  <section id="recent-events" className="rfx-section white" aria-labelledby="recent-heading">
    <div className="container-rfx">
      <div className="heading-to-content text-center flex flex-col items-center">
        <SectionHeading id="recent-heading">
          Recent <em className="t-accent">events.</em>
        </SectionHeading>
      </div>

      <div className="recent-grid">
        {RECENT_EVENTS.map((event, i) => (
          <article key={event.kind} className={`recent-event ${i === 0 ? "recent-lead" : ""}`}>
            <div className="recent-img rounded-large">
              <img
                src={event.src}
                srcSet={event.srcSet}
                sizes="(min-width: 768px) 40vw, 80vw"
                alt={event.alt}
                style={{ objectPosition: event.position }}
                loading="lazy"
                decoding="async"
                width={1000}
                height={1000}
              />
            </div>
            <div className="recent-copy">
              <p className="t-overline text-ink">{event.kind}</p>
              <p className="t-small md:t-body text-ink-soft">{event.line}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="text-to-content flex justify-center">
        <a href="/our-work/" className="btn-ghost-rf">
          See our work <span className="t-icon">→</span>
        </a>
      </div>
    </div>
  </section>
);

export default RecentEvents;
