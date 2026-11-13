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
    <header className="container-rfx article-hero text-center">
      <a
        href="/journal/"
        className="t-overline inline-block text-ink hover:opacity-70 transition-opacity"
      >
        Journal
      </a>

      <h1
        className="t-h1 max-w-[20ch] mx-auto eyebrow-to-title"
        style={{ textWrap: "balance" }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="t-lead heading-to-text max-w-[44ch] mx-auto text-ink-soft italic"
          style={{ textWrap: "pretty" }}
        >
          {subtitle}
        </p>
      )}

      <div className="t-overline text-to-content text-ink-soft">
        By {authorName} · {formattedDate} · {readMinutes} min read
      </div>

      <div className="text-to-action flex items-center inline-gap max-w-[460px] mx-auto">
        <span
          className="h-px flex-1"
          aria-hidden="true"
          style={{ background: "hsl(var(--accent-dark) / 0.45)" }}
        />
        <ArticleShareLinks url={url} title={title} />
        <span
          className="h-px flex-1"
          aria-hidden="true"
          style={{ background: "hsl(var(--accent-dark) / 0.45)" }}
        />
      </div>
    </header>
  );
};

export default ArticleHero;
