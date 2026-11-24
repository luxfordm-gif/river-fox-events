import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SERVICES_FAQS } from "@/data/servicesFaqs";

/** /services/ FAQs: the linked answer shown on the page says exactly what the
 *  plain answer in the FAQPage schema says, and the calm-voice basics hold
 *  (docs/voice.md): no em dashes, exclamation marks or prices. */
const text = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ").trim();

describe("services FAQs", () => {
  it("each linked answer matches its plain answer word for word", () => {
    for (const f of SERVICES_FAQS.filter((f) => f.aNode)) {
      expect(text(renderToStaticMarkup(<>{f.aNode}</>)), f.q).toBe(f.a);
    }
  });
  it("keeps to the calm voice and shows no prices", () => {
    for (const f of SERVICES_FAQS) {
      expect(`${f.q} ${f.a}`, f.q).not.toMatch(/[—!£]/);
    }
  });
});
