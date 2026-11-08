import { useEffect, useState } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import { ARTICLES, summariseArticle } from "@/data/articles";
import type { ArticleSummary } from "@/data/articles";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { applyMeta } from "@/seo/headTags";

const PAGE_SIZE = 8;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

type CardProps = {
  article: ArticleSummary & {
    cardImage?: string;
    cardImagePosition?: string;
    category?: string;
  };
  /** First card spans wider on desktop for editorial feel. */
  feature?: boolean;
};

const JournalCard = ({ article, feature = false }: CardProps) => {
  const href = `/journal/${article.slug}/`;
  return (
    <a
      href={href}
      className={`group block ${feature ? "md:col-span-2" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-ink/5 ${
          feature ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        {article.cardImage ? (
          <img
            src={article.cardImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
            style={
              article.cardImagePosition
                ? { objectPosition: article.cardImagePosition }
                : undefined
            }
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-soft t-body-sm">
            River Fox Events
          </div>
        )}
      </div>

      <div className="mt-4 md:mt-5">
        {article.category && (
          <div className="t-eyebrow text-ink-soft">
            {article.category}
          </div>
        )}
        <h2
          className={`${feature ? "t-h3" : "t-h4"} text-ink group-hover:text-accent-warm transition-colors mt-2 md:mt-3`}
          style={{ textWrap: "balance" }}
        >
          {article.title}
        </h2>
        <p className="mt-2 md:mt-3 t-body-sm text-ink-soft">
          {article.teaser}
        </p>
        <div className="mt-3 md:mt-4 t-eyebrow text-ink-soft">
          {formatDate(article.publishedAt)} · {article.readMinutes} min read
        </div>
      </div>
    </a>
  );
};

const Journal = () => {
  useFadeUp();
  useNavScroll();

  const [visible, setVisible] = useState(PAGE_SIZE);

  // ARTICLES is a Article[] (with Body); strip Body for the index.
  const summaries = ARTICLES.map(summariseArticle) as (ArticleSummary & {
    cardImage?: string;
    cardImagePosition?: string;
    category?: string;
  })[];
  const shown = summaries.slice(0, visible);
  const hasMore = visible < summaries.length;

  useEffect(() => {
    applyMeta({
      title: "Journal | River Fox Events",
      description:
        "Notes from the studio - event styling trends, behind-the-scenes from Surrey celebrations, and thinking on what makes a room feel right.",
      path: "/journal/",
    });
  }, []);

  // TODO (filter): once we have ~10 articles across multiple categories,
  // surface the unique `category` values as toggle chips above the grid
  // and filter `summaries` before slicing. Keep the "show more" behaviour
  // operating on the filtered list.

  return (
    <div className="min-h-screen page-paper text-ink nav-solid nav-paper">
      <Nav />

      <main>
        {/* Header */}
        <PageHeader
          divider
          title="Journal"
          intro="Notes from the studio - trends, behind-the-scenes, and the thinking behind the celebrations we style."
        />

        {/* Grid */}
        <section className="container-rfx pb-20 md:pb-28">
          <ul
            className="grid gap-y-10 md:gap-y-16 gap-x-6 md:gap-x-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((a, i) => (
              <li key={a.slug} className="contents md:block">
                {/* On mobile we render a denser horizontal-ish layout
                    via a separate component branch; on desktop the
                    full card. Keep DOM order accessible. */}
                <div className="hidden md:block">
                  <JournalCard
                    article={a}
                    feature={i === 0 && shown.length > 1}
                  />
                </div>
                <div className="md:hidden">
                  <a
                    href={`/journal/${a.slug}/`}
                    className="group flex gap-4 items-stretch border-b border-ink/10 pb-6"
                  >
                    <div className="relative w-[40%] aspect-[4/5] overflow-hidden bg-ink/5 flex-shrink-0">
                      {a.cardImage && (
                        <img
                          src={a.cardImage}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={
                            a.cardImagePosition
                              ? { objectPosition: a.cardImagePosition }
                              : undefined
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      {a.category && (
                        <div className="t-eyebrow text-ink-soft">
                          {a.category}
                        </div>
                      )}
                      <h2
                        className="t-h4 text-ink mt-1.5"
                        style={{ textWrap: "balance" }}
                      >
                        {a.title}
                      </h2>
                      <p className="mt-1.5 t-body-sm text-ink-soft line-clamp-3">
                        {a.teaser}
                      </p>
                      <div
                        className="mt-auto pt-2 t-eyebrow text-ink-soft"
                      >
                        {formatDate(a.publishedAt)} · {a.readMinutes} min
                      </div>
                    </div>
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-12 md:mt-16 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="t-eyebrow text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-cream transition-colors px-7 py-3"
              >
                Show more
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Journal;
