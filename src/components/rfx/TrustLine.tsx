/* Trust line under a hero button (Matt, 2026-11-13): five stars, Google
   reviews, and the brand-book numbers. On service pages and the homepage it
   links to Laura's Google reviews; on ad landing pages it stays plain so
   visitors don't leave. `onDark` is for the video hero. */
const GOOGLE_REVIEWS = "https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6";

type TrustLineProps = {
  linked?: boolean;
  onDark?: boolean;
  className?: string;
};

const TrustLine = ({ linked = false, onDark = false, className = "" }: TrustLineProps) => {
  const reviews = linked ? (
    <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer" className="text-link">
      Google reviews
    </a>
  ) : (
    "Google reviews"
  );
  return (
    <p className={`trust-line t-meta ${onDark ? "trust-line--dark" : "text-ink-soft"} ${className}`}>
      <span className={onDark ? "" : "text-accent-warm"} aria-hidden="true">★★★★★</span>{" "}
      <span className="sr-only">Five-star </span>
      {reviews}
      {/* Phones: the numbers drop to a second line, never split. */}
      <span className="hidden sm:inline"> · </span>
      <br className="sm:hidden" />
      <span className="whitespace-nowrap">400+ events styled · 8 years in Surrey</span>
    </p>
  );
};

export default TrustLine;
