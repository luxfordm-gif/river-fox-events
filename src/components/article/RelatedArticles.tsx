import type { ArticleSummary } from "@/data/articles";

type Props = {
  items: ArticleSummary[];
};

/**
 * "More to read" grid at the foot of an article. Renders nothing until
 * there are at least one related article — useful so the first article
 * doesn't ship a half-empty section.
 *
 * Each card: title + 1-line teaser + read-more link. Keep it simple;
 * articles are SEO-driven, not magazine-style.
 */
const RelatedArticles = ({ items }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-[1120px] mx-auto px-6 md:px-12 my-16 md:my-24">
      <div className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-6 text-center"
           style={{ fontWeight: 600 }}>
        More to read
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {items.map((a) => (
          <a
            key={a.slug}
            href={`/journal/${a.slug}/`}
            className="block group"
          >
            <h3
              className="font-serif-rf text-ink group-hover:text-accent-warm transition-colors"
              style={{
                fontSize: "clamp(22px, 2vw, 28px)",
                lineHeight: 1.18,
                fontWeight: 400,
                letterSpacing: "-0.012em",
              }}
            >
              {a.title}
            </h3>
            <p className="mt-3 text-[14.5px] leading-[1.65] text-ink-soft">
              {a.teaser}
            </p>
            <span
              className="mt-4 inline-block font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink-soft group-hover:text-ink transition-colors"
              style={{ fontWeight: 600 }}
            >
              Read →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
