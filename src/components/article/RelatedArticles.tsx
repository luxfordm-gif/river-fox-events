import type { ArticleSummary } from "@/data/articles";

type Props = {
  items: ArticleSummary[];
};

/**
 * "More to read" list at the foot of an article. Renders nothing if there
 * are no related items so the first-ever article doesn't ship a half-empty
 * section.
 *
 * Card layout: small thumbnail on the left (using `cardImage`), title +
 * teaser + read-more on the right. Single column on mobile, two columns
 * from md+. Same horizontal card shape across breakpoints — feels
 * editorial-list rather than a Pinterest-style grid.
 *
 * Related items are *manually curated* via each article's `relatedSlugs`
 * array in src/data/articles/index.tsx — not auto previous/next or
 * latest. See `findRelated` for the lookup.
 */
const RelatedArticles = ({ items }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="max-w-[1120px] mx-auto px-6 md:px-12 my-16 md:my-24">
      <div
        className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-8 text-center"
        style={{ fontWeight: 600 }}
      >
        More to read
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {items.map((a) => (
          <a
            key={a.slug}
            href={`/journal/${a.slug}/`}
            className="group flex gap-4 md:gap-5 items-start"
          >
            {a.cardImage && (
              <div
                className="shrink-0 w-[112px] md:w-[140px] aspect-square overflow-hidden rounded-[10px] bg-surface-alt"
                aria-hidden="true"
              >
                <img
                  src={a.cardImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ objectPosition: a.cardImagePosition ?? "center" }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3
                className="font-serif-rf text-ink group-hover:text-accent-warm transition-colors"
                style={{
                  fontSize: "clamp(20px, 1.8vw, 24px)",
                  lineHeight: 1.2,
                  fontWeight: 400,
                  letterSpacing: "-0.012em",
                }}
              >
                {a.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-ink-soft line-clamp-3">
                {a.teaser}
              </p>
              <span
                className="mt-3 inline-block font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink-soft group-hover:text-ink transition-colors"
                style={{ fontWeight: 600 }}
              >
                Read →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
