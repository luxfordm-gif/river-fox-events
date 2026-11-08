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
 * teaser + read-more on the right. One column at every width, at the
 * article text width. Same horizontal card shape across breakpoints -
 * feels editorial-list rather than a Pinterest-style grid.
 *
 * Related items are *manually curated* via each article's `relatedSlugs`
 * array in src/data/articles/index.tsx - not auto previous/next or
 * latest. See `findRelated` for the lookup.
 */
const RelatedArticles = ({ items }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    // Same 720px column as the article text and the end panel, so all three
    // share one left and right edge (Matt, 2026-11-07).
    <section className="max-w-[720px] mx-auto px-6 my-16 md:my-24">
      <div
        className="t-overline text-ink-soft mb-8 text-center"
      >
        More to read
      </div>
      <div className="grid grid-cols-1 gap-8 md:gap-10">
        {items.map((a) => (
          <a
            key={a.slug}
            href={`/journal/${a.slug}/`}
            className="group flex gap-4 md:gap-5 items-start"
          >
            {a.cardImage && (
              <div
                className="shrink-0 w-[112px] md:w-[140px] aspect-square overflow-hidden rounded-large bg-surface-alt"
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
            <div className="flex-1 min-w-0 card-text">
              <h3
                className="t-h5 text-ink group-hover:text-accent-warm transition-colors"
              >
                {a.title}
              </h3>
              <p className="t-small title-to-text text-ink-soft line-clamp-3">
                {a.teaser}
              </p>
              <span
                className="t-overline mt-3 inline-block text-ink-soft group-hover:text-ink transition-colors"
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
