import { Fragment } from "react";
import { ChevronRight, House } from "lucide-react";
import { breadcrumbTrail } from "@/seo/headTags";

/**
 * The small breadcrumb trail at the top left of the service pages, the town
 * pages and /services/ (Matt, 2026-11-24):
 *   Home › Services › Children's parties
 *   Home › Areas I cover › Cobham
 *
 * The names and links come from routes.ts (`breadcrumbName`,
 * `breadcrumbParent`) through the same `breadcrumbTrail()` the
 * BreadcrumbList JSON-LD is built from, so the visible trail and the schema
 * can't drift apart. Every item is a link except the current page.
 *
 * Place it as the first child of the page's top section. Pinned (the
 * default): top left, its left edge in line with the nav's Home (the
 * wordmark on phones); from tablet up in its own strip just under the nav,
 * on phones above the headline. Home shows as a house icon (Lucide, the
 * site's stroke icon set) named "Home" for screen readers. Quiet on purpose: Meta size, body grey,
 * the site's one text-link style. Shown at /style-guide/ S24.
 */
const Breadcrumbs = ({ path, pinned = true }: { path: string; pinned?: boolean }) => {
  const trail = breadcrumbTrail(path);
  if (trail.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" data-track-location="breadcrumb" className={pinned ? "crumbs crumbs--pinned" : "crumbs"}>
      <ol className="t-meta flex flex-wrap items-center icon-gap text-ink-soft">
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
                  <a
                    href={c.path}
                    className={i === 0 ? "crumbs__home inline-flex" : "text-link"}
                    aria-label={i === 0 ? c.name : undefined}
                  >
                    {/* Home is a house icon from the site's one stroke icon
                        set, Lucide (Matt, 2026-11-24); it still reads "Home". */}
                    {i === 0 ? <House size={14} strokeWidth={1.5} aria-hidden="true" /> : c.name}
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
