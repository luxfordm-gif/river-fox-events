import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { breadcrumbTrail } from "@/seo/headTags";

/**
 * The small breadcrumb trail above the headline on the service pages, the
 * town pages and /services/ (Matt, 2026-11-24):
 *   Home › Services › Children's parties
 *   Home › Areas I cover › Cobham
 *
 * The names and links come from routes.ts (`breadcrumbName`,
 * `breadcrumbParent`) through the same `breadcrumbTrail()` the
 * BreadcrumbList JSON-LD is built from, so the visible trail and the schema
 * can't drift apart. Every item is a link except the current page.
 *
 * Quiet on purpose: Meta size, body grey, the site's one text-link style,
 * centred like the heroes, with the
 * eyebrow gap down to the headline. Shown at /style-guide/ S24.
 */
const Breadcrumbs = ({ path, className = "" }: { path: string; className?: string }) => {
  const trail = breadcrumbTrail(path);
  if (trail.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" data-track-location="breadcrumb" className={`crumbs eyebrow-above ${className}`}>
      <ol className="t-meta flex flex-wrap items-center justify-center icon-gap text-ink-soft">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <Fragment key={c.path}>
              <li className="inline-flex">
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {c.name}
                  </span>
                ) : (
                  <a href={c.path} className="text-link">
                    {c.name}
                  </a>
                )}
              </li>
              {!last && (
                <li aria-hidden="true" className="inline-flex text-ink-faint">
                  <ChevronRight size={11} strokeWidth={1.5} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
