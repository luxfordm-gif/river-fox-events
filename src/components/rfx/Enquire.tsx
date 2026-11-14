import { useState } from "react";
import { toast } from "sonner";
import { trackFormSent } from "@/lib/track";
import { whatsappHref } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/rfx/SectionHeading";

/* WhatsApp button beside the form, on every device: it opens WhatsApp Web on
   a computer, where the phone number can't be tapped (Matt, 2026-11-13). */
const ENQUIRE_WHATSAPP = whatsappHref("Hi Laura, I'd like a quote for an event. My date and postcode are ");

type EnquireProps = {
  defaultEventType?: "" | "Children's party" | "Milestone celebration" | "Corporate event" | "Other";
  venuePlaceholder?: string;
};

const Enquire = ({
  defaultEventType = "",
  venuePlaceholder = "e.g. at home in Cobham",
}: EnquireProps = {}) => {
  const [submitting, setSubmitting] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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
      // Google Ads conversion (live site only) and GA4 generate_lead, only
      // after a confirmed send (src/lib/track.ts). Read before form.reset()
      // below clears the fields.
      trackFormSent(form);
      /* A toast, so the form card keeps its height (Matt, 2026-11-14). */
      toast.success("Thank you - your enquiry has been received. I'll be in touch within 1 to 2 working days to discuss your event in more detail. Laura");
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
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] columns-gap items-start">
          {/* Left: heading + intro + availability card. Sticky on desktop so it
              follows the reader down the long form. */}
          <div className="pt-2 text-center lg:text-left flex flex-col items-center lg:items-stretch lg:sticky lg:top-28 lg:self-start">
            <SectionHeading id="enquire-heading" align="lg-left">
              Let's create something{" "}
              <em className="t-accent">
                beautiful.
              </em>
            </SectionHeading>
            <p
              className="t-lead measure-lead heading-to-text text-ink-faint"
            >
              Celebrations start from £300 and every one is quoted to your
              brief.{" "}
              <span className="text-on-deep">
                I take on a limited number each month
              </span>
              , so book early, or call me on{" "}
              <a
                href="tel:+447872114191"
                className="text-link whitespace-nowrap text-on-deep"
              >
                07872 114191
              </a>
              .
            </p>
            <div className="text-to-action">
              <a href={ENQUIRE_WHATSAPP} className="btn-ghost-rf on-dark">
                WhatsApp Laura
              </a>
            </div>
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
            <div className="hidden md:block form-title text-left">
              <h3 className="t-h4 text-primary">
                Tell me about your celebration
              </h3>
              <p className="hidden lg:block t-small text-ink-soft title-to-text">
                Complete the form below and I'll be in touch to discuss
                your event in more detail.
              </p>
            </div>
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
                <span className="lbl">Message</span>
                <textarea
                  name="vision"
                  rows={3}
                  placeholder="Theme, colours, inspiration, or anything you already have in mind"
                />
              </label>
            </div>
            {/* Optional extras, folded away. Untouched ones send blank, so
                Laura never sees an answer the customer didn't choose. */}
            <div id="enquire-more-details" hidden={!moreOpen}>
            <div className="form-grid form-more">
              <label className="form-row full">
                <span className="lbl">Event location / venue</span>
                <input type="text" name="venue" placeholder={venuePlaceholder} />
              </label>
              <label className="form-row full">
                <span className="lbl">Type of event</span>
                <select name="type" defaultValue={defaultEventType === "Corporate event" ? "Corporate / brand event" : defaultEventType}>
                  <option value="">Choose one</option>
                  <option>Children's party</option>
                  <option>Milestone celebration</option>
                  <option>Corporate / brand event</option>
                </select>
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
            </div>
            {/* The toggle and the button share one row, as on the Christmas form. */}
            <div className="form-actions flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                aria-expanded={moreOpen}
                data-form-extras
                aria-controls="enquire-more-details"
                onClick={() => setMoreOpen((o) => !o)}
                className="t-label text-primary w-full sm:w-auto text-left text-pretty py-3 sm:py-0"
              >
                {moreOpen ? "− Fewer details" : "+ Add more details for a quicker quote (optional)"}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-solid-rf accent w-full sm:w-auto justify-center shrink-0 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Request my quote"} <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Enquire;
