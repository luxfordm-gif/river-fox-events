import { useEffect, useState } from "react";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
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
          <div className="absolute inset-0 flex items-center justify-center text-ink-soft text-sm">
            River Fox Events
          </div>
        )}
      </div>

      <div className="mt-4 md:mt-5">
        {article.category && (
          <div
            className="font-mono-rf text-[10px] md:text-[10.5px] tracking-[0.28em] uppercase text-ink-soft"
            style={{ fontWeight: 600 }}
          >
            {article.category}
          </div>
        )}
        <h2
          className={`font-serif-rf text-ink group-hover:text-accent-warm transition-colors mt-2 md:mt-3 ${
            feature ? "" : ""
          }`}
          style={{
            fontSize: feature
              ? "clamp(26px, 2.6vw, 36px)"
              : "clamp(20px, 1.8vw, 26px)",
            lineHeight: 1.16,
            fontWeight: 400,
            letterSpacing: "-0.014em",
            textWrap: "balance",
          }}
        >
          {article.title}
        </h2>
        <p
          className={`mt-2 md:mt-3 text-ink-soft leading-[1.6] ${
            feature ? "text-[15px] md:text-[16px]" : "text-[14px] md:text-[14.5px]"
          }`}
        >
          {article.teaser}
        </p>
        <div
          className="mt-3 md:mt-4 font-mono-rf text-[10.5px] tracking-[0.22em] uppercase text-ink-soft"
          style={{ fontWeight: 600 }}
        >
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
        "Notes from the studio — event styling trends, behind-the-scenes from Surrey celebrations, and thinking on what makes a room feel right.",
      path: "/journal/",
    });
  }, []);

  // TODO (filter): once we have ~10 articles across multiple categories,
  // surface the unique `category` values as toggle chips above the grid
  // and filter `summaries` before slicing. Keep the "show more" behaviour
  // operating on the filtered list.

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Nav />

      <main>
        {/* Header */}
        <header className="container-rfx pt-24 md:pt-32 pb-10 md:pb-14 text-center">
          <div
            className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft"
            style={{ fontWeight: 600 }}
          >
            River Fox Events
          </div>
          <h1
            className="font-serif-rf max-w-[14ch] mx-auto mt-5 md:mt-6"
            style={{
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 1.02,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Journal
          </h1>
          <p
            className="mt-5 md:mt-7 max-w-[44ch] mx-auto text-[16px] md:text-[19px] leading-[1.55] text-ink-soft font-serif-rf font-light italic"
            style={{ textWrap: "pretty" }}
          >
            Notes from the studio — trends, behind-the-scenes, and the
            thinking behind the celebrations we style.
          </p>
        </header>

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
                        <div
                          className="font-mono-rf text-[9.5px] tracking-[0.26em] uppercase text-ink-soft"
                          style={{ fontWeight: 600 }}
                        >
                          {a.category}
                        </div>
                      )}
                      <h2
                        className="font-serif-rf text-ink mt-1.5"
                        style={{
                          fontSize: "19px",
                          lineHeight: 1.2,
                          fontWeight: 400,
                          letterSpacing: "-0.012em",
                          textWrap: "balance",
                        }}
                      >
                        {a.title}
                      </h2>
                      <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-soft line-clamp-3">
                        {a.teaser}
                      </p>
                      <div
                        className="mt-auto pt-2 font-mono-rf text-[9.5px] tracking-[0.22em] uppercase text-ink-soft"
                        style={{ fontWeight: 600 }}
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
                className="font-mono-rf text-[11px] tracking-[0.22em] uppercase text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-cream transition-colors px-7 py-3"
                style={{ fontWeight: 600 }}
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
