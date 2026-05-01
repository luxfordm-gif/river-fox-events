import { useState } from "react";
import { Linkedin, Twitter, Link2, Check } from "lucide-react";

type Props = {
  url: string;
  title: string;
};

/**
 * Inline social-share row for the article hero. Three icons:
 * X/Twitter, LinkedIn and copy-to-clipboard. Deliberately small and
 * minimal — the article title is the centrepiece, not the share row.
 */
const ArticleShareLinks = ({ url, title }: Props) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older browsers without clipboard API — silently fail; X / LinkedIn
      // links still work.
    }
  };

  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const iconClass =
    "inline-flex items-center justify-center w-9 h-9 rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-background transition-colors";

  return (
    <div className="inline-flex items-center gap-3" aria-label="Share this article">
      <a href={x} target="_blank" rel="noreferrer" className={iconClass} aria-label="Share on X">
        <Twitter className="w-4 h-4" />
      </a>
      <a href={linkedin} target="_blank" rel="noreferrer" className={iconClass} aria-label="Share on LinkedIn">
        <Linkedin className="w-4 h-4" />
      </a>
      <button type="button" onClick={onCopy} className={iconClass} aria-label="Copy link">
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default ArticleShareLinks;
