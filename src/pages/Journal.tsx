import { useEffect, useState } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import { ARTICLES, summariseArticle } from "@/data/articles";
import type { ArticleSummary } from "@/data/articles";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { applyMeta } from "@/seo/headTags";

/* Articles shown before "Show more" (Matt, 2026-11-09). Phones: 8, then 8
   more each press. Tablet and desktop: 12, then 12 more. Cards sit three
   to a row on desktop and two on tablets, so 12 fills complete rows on
   both with no empty space at the end. */
const PAGE_SIZE = 8;
const DESKTOP_FIRST = 12;
const DESKTOP_MORE = 12;

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
      className={`group flex flex-col h-full ${feature ? "md:col-span-2" : ""}`}
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
          <div className="absolute inset-0 flex items-center justify-center text-ink-soft t-small">
            River Fox Events
          </div>
        )}
      </div>

      {/* Fills the card so the date line sits at the foot, level across a row (Matt, 2026-11-08). */}
      <div className="mt-4 md:mt-5 card-text flex-1 flex flex-col">
        {article.category && (
          <div className="t-overline text-ink-soft">
            {article.category}
          </div>
        )}
        <h2
          className={`${feature ? "t-h4" : "t-h5"} text-ink group-hover:text-accent-warm transition-colors mt-2 md:mt-3`}
          style={{ textWrap: "balance" }}
        >
          {article.title}
        </h2>
        <p className="title-to-text t-small text-ink-soft">
          {article.teaser}
        </p>
        <div className="mt-auto pt-3 md:pt-4 t-overline text-ink-soft">
          {formatDate(article.publishedAt)} · {article.readMinutes} min read
        </div>
      </div>
    </a>
  );
};

const Journal = () => {
  useFadeUp();
  useNavScroll();

  // How many times "Show more" has been pressed. Phones show PAGE_SIZE more
  // each time; tablet and desktop show DESKTOP_FIRST, then DESKTOP_MORE more.
  const [pages, setPages] = useState(0);
  const visible = PAGE_SIZE * (pages + 1);
  const visibleDesktop = DESKTOP_FIRST + DESKTOP_MORE * pages;

  // ARTICLES is a Article[] (with Body); strip Body for the index.
  const summaries = ARTICLES.map(summariseArticle) as (ArticleSummary & {
    cardImage?: string;
    cardImagePosition?: string;
    category?: string;
  })[];
  // Every article is rendered so its link is in the prerendered HTML (and
  // crawlable); the ones past `visible` are hidden until "Show more".
  const shown = summaries;
  const hasMore = visible < summaries.length;
  const hasMoreDesktop = visibleDesktop < summaries.length;
  // Each card shows on phones, on tablet/desktop, both or neither.
  const itemClass = (i: number) => {
    const phone = i < visible;
    const desk = i < visibleDesktop;
    if (phone && desk) return "contents md:block";
    if (desk) return "hidden md:block";
    if (phone) return "contents md:hidden";
    return "hidden";
  };
  const moreClass =
    hasMore && hasMoreDesktop ? "flex" : hasMore ? "flex md:hidden" : "hidden md:flex";

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
          intro="Notes from the studio - trends, behind-the-scenes, and the thinking behind the celebrations I style."
        />

        {/* Grid */}
        <section className="container-rfx pb-20 md:pb-28">
          <ul
            className="grid gap-y-10 md:gap-y-16 gap-x-6 md:gap-x-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((a, i) => (
              <li key={a.slug} className={itemClass(i)}>
                {/* On mobile we render a denser horizontal-ish layout
                    via a separate component branch; on desktop the
                    full card. Keep DOM order accessible. */}
                <div className="hidden md:block md:h-full">
                  <JournalCard
                    article={a}
                    feature={i === 0 && summaries.length > 1}
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
                        <div className="t-overline text-ink-soft">
                          {a.category}
                        </div>
                      )}
                      <h2
                        className="t-h5 text-ink mt-1.5"
                        style={{ textWrap: "balance" }}
                      >
                        {a.title}
                      </h2>
                      <p className="title-to-text t-small text-ink-soft line-clamp-3">
                        {a.teaser}
                      </p>
                      <div
                        className="mt-auto pt-2 t-overline text-ink-soft"
                      >
                        {formatDate(a.publishedAt)} · {a.readMinutes} min
                      </div>
                    </div>
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {(hasMore || hasMoreDesktop) && (
            <div className={`mt-12 md:mt-16 ${moreClass} justify-center`}>
              <button
                type="button"
                onClick={() => setPages((p) => p + 1)}
                className="t-overline text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-cream transition-colors px-7 py-3"
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
