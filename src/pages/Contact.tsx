import { useEffect, useState } from "react";
import { toast } from "sonner";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import PageHeader from "@/components/rfx/PageHeader";
import { useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { trackLead } from "@/lib/track";
import {
  applyMeta,
  breadcrumbSchema,
  contactPageSchema,
  removeJsonLd,
  upsertJsonLd,
} from "@/seo/headTags";

const WHATSAPP_NUMBER = "447872114191";
const WHATSAPP_DISPLAY = "07872 114191";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Laura%2C%20I%27m%20enquiring%20about%20River%20Fox%20Events`;
const EMAIL = "Riverfoxevents@gmail.com";
const INSTAGRAM_HANDLE = "@riverfox_events";
const INSTAGRAM_URL = "https://www.instagram.com/riverfox_events/";

const Contact = () => {
  useNavScroll();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const route = findRoute("/contact")!;
    applyMeta(route);

    const breadcrumbId = "rfx-jsonld-bc-contact";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);

    const contactPageId = "rfx-jsonld-contactpage";
    upsertJsonLd(contactPageId, contactPageSchema(route.path, route.description));

    return () => {
      removeJsonLd(breadcrumbId);
      removeJsonLd(contactPageId);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    try {
      const data = new FormData(form);
      const body = new URLSearchParams(
        Array.from(data.entries()).map(([k, v]) => [k, String(v)])
      ).toString();
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      // Google Ads conversion - only fires on a confirmed submission, and the
      // typeof guard means it no-ops when the Google tag is blocked by consent.
      if (typeof window.gtag === "function" && window.location.hostname === "riverfoxevents.co.uk") {
        window.gtag("event", "conversion", { send_to: "AW-18210626936/xqXACO264L0cEPi6wOtD" });
      }
      // GA4 lead, sent only after Accept on the cookie banner (src/lib/track.ts).
      // Read before form.reset() below clears the fields.
      trackLead(form);
      toast.success("Thank you - your enquiry has been received. I'll be in touch within 1-2 working days to discuss your event in more detail. Laura");
      form.reset();
    } catch (err) {
      toast.error(
        "Sorry - something went wrong. Please email Riverfoxevents@gmail.com directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col page-paper text-foreground nav-solid nav-paper">
      <Nav />
      <main className="flex-1">
        <PageHeader
          divider
          id="contact-heading"
          title={
            <>
              Let's create something{" "}
              <em className="t-accent">beautiful.</em>
            </>
          }
        />
        <section className="after-page-header section-bottom" aria-labelledby="contact-heading">
          <div className="container-rfx">

            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] columns-gap items-start">
              {/* Left: intro copy + direct contact methods */}
              <div className="text-center lg:text-left">
                <p
                  className="t-body text-ink max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  Share a few details in the enquiry form and I'll be in
                  touch to talk through your plans.
                </p>
                <p
                  className="t-body text-ink text-to-text max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  Celebrations start from £300, with larger designs
                  from{" "}
                  <span className="whitespace-nowrap">£600 - £1,500+</span>.
                </p>

                <div className="hairline text-to-content max-w-[460px] mx-auto lg:mx-0" aria-hidden="true" />

                <ul className="text-to-content flex flex-col stack-gap items-center lg:items-start">
                  <li>
                    <div className="t-overline text-ink-soft label-to-title">
                      WhatsApp
                    </div>
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Message Laura on WhatsApp"
                      className="t-h5 text-ink text-link"
                    >
                      {WHATSAPP_DISPLAY}
                    </a>
                  </li>
                  <li>
                    <div className="t-overline text-ink-soft label-to-title">
                      Email
                    </div>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="t-h5 text-ink text-link break-all"
                    >
                      {EMAIL}
                    </a>
                  </li>
                  <li>
                    <div className="t-overline text-ink-soft label-to-title">
                      Instagram
                    </div>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="t-h5 text-ink text-link"
                    >
                      {INSTAGRAM_HANDLE}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Right: form */}
              <form
                className="form-wrap w-full"
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={onSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden" aria-hidden="true">
                  <label>
                    Don't fill this out: <input name="bot-field" />
                  </label>
                </p>
                {/* The full form here: people come to Contact on purpose. The
                    short form with "Add more details" is for the home and
                    service pages (Matt, 2026-11-13). Dropdowns start blank, so
                    Laura only sees answers the customer chose. */}
                <div className="form-grid">
                  <label className="form-row">
                    <span className="lbl">Full name</span>
                    <input type="text" name="name" placeholder="Your full name" autoComplete="name" required />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Email address</span>
                    <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Phone (optional)</span>
                    <input type="tel" name="phone" placeholder="07…" autoComplete="tel" />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Event date</span>
                    <input type="date" name="date" />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Event location / venue</span>
                    <input type="text" name="venue" placeholder="e.g. at home in Cobham" />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Type of event</span>
                    <select name="type" defaultValue="">
                      <option value="">Choose one</option>
                      <option>Children's party</option>
                      <option>Milestone celebration</option>
                      <option>Corporate / brand event</option>
                    </select>
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Tell me about your vision</span>
                    <textarea
                      name="vision"
                      rows={4}
                      placeholder="Theme, colours, inspiration, or anything you already have in mind"
                    />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Planned investment</span>
                    <select name="budget" defaultValue="">
                      <option value="">Choose one</option>
                      <option>Under £300</option>
                      <option>£300 – £600</option>
                      <option>£600 – £1,000</option>
                      <option>£1,000 – £1,500</option>
                      <option>£1,500+</option>
                      <option>Not sure yet</option>
                    </select>
                  </label>
                  <label className="form-row">
                    <span className="lbl">How did you hear about us?</span>
                    <select name="referral" defaultValue="">
                      <option value="">Choose one</option>
                      <option>Google</option>
                      <option>Recommendation</option>
                      <option>Facebook</option>
                      <option>Instagram</option>
                      <option>Used before</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <div className="form-actions flex justify-center lg:justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-solid-rf accent w-full sm:w-auto justify-center disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send enquiry"} <span>→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
