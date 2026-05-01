import ArticleShareLinks from "./ArticleShareLinks";

type Props = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  readMinutes: number;
  authorName?: string;
  /** Absolute URL to this article — used for share links. */
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
    <header className="container-rfx pt-24 md:pt-32 pb-10 md:pb-12 text-center">
      <a
        href="/journal/"
        className="inline-block font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink hover:opacity-70 transition-opacity"
        style={{ fontWeight: 600 }}
      >
        Journal
      </a>

      <h1
        className="font-serif-rf max-w-[20ch] mx-auto mt-7 md:mt-9"
        style={{
          fontSize: "clamp(44px, 5.5vw, 80px)",
          lineHeight: 1.04,
          fontWeight: 500,
          letterSpacing: "-0.025em",
          textWrap: "balance",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="mt-6 max-w-[44ch] mx-auto text-[18px] md:text-[20px] leading-[1.5] text-ink-soft font-serif-rf font-light italic"
          style={{ textWrap: "pretty" }}
        >
          {subtitle}
        </p>
      )}

      <div className="mt-10 font-mono-rf text-[11px] tracking-[0.2em] uppercase text-ink-soft">
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
