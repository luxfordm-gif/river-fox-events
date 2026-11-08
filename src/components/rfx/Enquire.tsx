import { useState } from "react";
import { toast } from "sonner";

type EnquireProps = {
  defaultEventType?: "Children's party" | "Milestone celebration" | "Corporate event" | "Other";
  venuePlaceholder?: string;
};

const Enquire = ({
  defaultEventType = "Children's party",
  venuePlaceholder = "e.g. at home in Cobham",
}: EnquireProps = {}) => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    try {
      const data = new FormData(form);
      // Stamp the page the enquiry came from so Laura knows which page
      // the enquirer was on when reading the email.
      data.set("page", window.location.pathname);
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
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", { send_to: "AW-18210626936/xqXACO264L0cEPi6wOtD" });
      }
      toast.success("Thank you - your enquiry has been received. I'll be in touch within 1-2 working days to discuss your event in more detail. Laura");
      form.reset();
    } catch (err) {
      toast.error("Sorry - something went wrong. Please email Riverfoxevents@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquire" className="rfx-section dark rfx-enquire" aria-labelledby="enquire-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start rfx-md-stack">
          {/* Left: heading + intro + availability card. Sticky on desktop so it
              follows the reader down the long form. */}
          <div className="pt-2 mb-6 lg:mb-0 text-center lg:text-left flex flex-col items-center lg:items-stretch lg:sticky lg:top-28 lg:self-start">
            <h2
              id="enquire-heading"
              className="t-h2"
            >
              Let's create something{" "}
              <em className="t-accent">
                beautiful.
              </em>
            </h2>
            <p
              className="t-lead max-w-[460px] mt-7"
              style={{ color: "hsl(var(--on-deep-soft))" }}
            >
              Celebrations begin from £300, each one tailored to your
              brief.{" "}
              <span style={{ color: "hsl(var(--on-deep))" }}>
                We take on a limited number of events each month
              </span>
              , so book early to secure your date, or call Laura on{" "}
              <a
                href="tel:+447872114191"
                className="underline underline-offset-4 whitespace-nowrap"
                style={{ color: "hsl(var(--on-deep))" }}
              >
                07872 114191
              </a>
              .
            </p>
          </div>

          {/* Right: form - wired to Netlify Forms (see index.html for build-time
              detection of field names; submissions are emailed via Forms →
              Notifications in the Netlify dashboard). */}
          <form
            className="form-wrap"
            name="enquire"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={onSubmit}
          >
            <input type="hidden" name="form-name" value="enquire" />
            <p className="hidden" aria-hidden="true">
              <label>
                Don't fill this out: <input name="bot-field" />
              </label>
            </p>
            <div className="hidden md:block mb-5 text-left">
              <h3 className="t-h3 text-primary">
                Tell me about your celebration
              </h3>
              <p className="hidden lg:block t-body-sm text-ink-soft mt-1">
                Complete the form below and I'll be in touch to discuss
                your event in more detail.
              </p>
            </div>
            <div className="form-grid">
              <label className="form-row">
                <span className="lbl">Full name</span>
                <input type="text" name="name" placeholder="Your full name" required />
              </label>
              <label className="form-row">
                <span className="lbl">Email address</span>
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label className="form-row">
                <span className="lbl">Phone number (optional)</span>
                <input type="tel" name="phone" placeholder="07…" />
              </label>
              <label className="form-row">
                <span className="lbl">Event date</span>
                <input type="date" name="date" />
              </label>
              <label className="form-row full">
                <span className="lbl">Event location / venue</span>
                <input type="text" name="venue" placeholder={venuePlaceholder} />
              </label>
              <label className="form-row full">
                <span className="lbl">Type of event</span>
                <select name="type" defaultValue={defaultEventType}>
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
                <select name="budget" defaultValue="Under £300">
                  <option>Under £300</option>
                  <option>£300 – £460</option>
                  <option>£460 – £800</option>
                  <option>£800 – £1,500</option>
                  <option>£1,500+</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label className="form-row">
                <span className="lbl">How did you hear about us? (optional)</span>
                <select name="referral" defaultValue="Google">
                  <option>Google</option>
                  <option>Recommendation</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>Used before</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            <div className="flex justify-center lg:justify-end items-center mt-6 gap-4 flex-wrap text-center">
              <button
                type="submit"
                disabled={submitting}
                className="btn-solid-rf accent disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send enquiry"} <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Enquire;
