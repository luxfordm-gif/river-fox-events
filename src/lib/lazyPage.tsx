import { lazy, type ComponentType } from "react";

/**
 * A page (or article body) whose code downloads only when it's needed
 * (speed pass, 2026-11-13). Before this every page and every journal article
 * was in one 915KB file that each visitor downloaded on their first page.
 *
 * `preload()` starts the download early: main.tsx waits for the current
 * page's code before React takes over the prerendered HTML (so there's no
 * blank flash), and App.tsx starts it when a finger or mouse lands on a link.
 * Once loaded, the page renders straight away, without a loading state.
 */
export type LazyPage<P extends object = object> = ComponentType<P> & {
  preload: () => Promise<void>;
};

const RELOAD_KEY = "rfx-reloaded-at";
function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

export function lazyPage<P extends object = object>(
  load: () => Promise<{ default: ComponentType<P> }>,
): LazyPage<P> {
  let Loaded: ComponentType<P> | null = null;
  let pending: Promise<void> | null = null;
  const preload = () =>
    (pending ??= load().then(
      (m) => {
        Loaded = m.default;
      },
      (err) => {
        pending = null; // a failed download (patchy signal) can be retried
        throw err;
      },
    ));
  const Lazy = lazy(() =>
    preload().then(
      () => ({ default: Loaded as ComponentType<P> }),
      (err) => {
        // A tab left open across a new release asks for code files that no
        // longer exist. Load the page afresh instead (at most once a minute,
        // so a real outage can't loop).
        if (reloadOnce()) return new Promise<never>(() => {});
        throw err;
      },
    ),
  ) as unknown as ComponentType<P>;
  const Page = (props: P) => (Loaded ? <Loaded {...props} /> : <Lazy {...props} />);
  return Object.assign(Page, { preload });
}
