import ArticleShareLinks from "./ArticleShareLinks";

type Props = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  readMinutes: number;
  authorName?: string;
  /** Absolute URL to this article - used for share links. */
  url: string;
};

/**
 * Editorial article hero: eyebrow → big centred serif title → optional
 * subtitle → byline + meta → faint divider with social share row.
 *
 * Sized to feel ChatGPT-style: title balanced to ~20ch, subtitle to ~40ch,
 * with generous whitespace above and below.
 */
const ArticleHero = ({
  title,
  subtitle,
  publishedAt,
  readMinutes,
  authorName = "Laura",
  url,
}: Props) => {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="container-rfx pt-6 md:pt-10 pb-10 md:pb-12 text-center">
      <a
        href="/journal/"
        className="t-eyebrow inline-block text-ink hover:opacity-70 transition-opacity"
      >
        Journal
      </a>

      <h1
        className="t-h1 max-w-[20ch] mx-auto mt-7 md:mt-9"
        style={{ textWrap: "balance" }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="t-lead mt-6 max-w-[44ch] mx-auto text-ink-soft italic"
          style={{ textWrap: "pretty" }}
        >
          {subtitle}
        </p>
      )}

      <div className="t-eyebrow mt-10 text-ink-soft">
        By {authorName} · {formattedDate} · {readMinutes} min read
      </div>

      <div className="mt-7 md:mt-9 flex items-center gap-5 max-w-[460px] mx-auto px-2">
        <span
          className="h-px flex-1"
          aria-hidden="true"
          style={{ background: "hsl(var(--accent-warm) / 0.45)" }}
        />
        <ArticleShareLinks url={url} title={title} />
        <span
          className="h-px flex-1"
          aria-hidden="true"
          style={{ background: "hsl(var(--accent-warm) / 0.45)" }}
        />
      </div>
    </header>
  );
};

export default ArticleHero;
