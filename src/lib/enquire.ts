import type { MouseEvent } from "react";

export const ENQUIRE_HREF = "/#enquire";

export function handleEnquireClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

  const target = document.getElementById("enquire");
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#enquire") {
      history.replaceState(null, "", "#enquire");
    }
    return;
  }

  if (window.location.pathname === "/") {
    e.preventDefault();
    window.location.assign("/#enquire");
  }
}
