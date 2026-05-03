import { useState } from "react";
import { toast } from "sonner";

const CHECKLIST = [
  "Events from £460",
  "Surrey, London & surrounding areas",
];

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
      // Stamp the page the enquiry came from so Laura knows which page Mark
      // is looking at when reading the email.
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
      toast.success("Thank you — Laura will be in touch personally.");
      form.reset();
    } catch (err) {
      toast.error("Sorry — something went wrong. Please email Riverfoxevents@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquire" className="rfx-section dark rfx-enquire" aria-labelledby="enquire-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start rfx-md-stack">
          {/* Left: heading + checklist */}
          <div className="pt-2 text-center lg:text-left flex flex-col items-center lg:items-stretch lg:h-full">
            <h2
              id="enquire-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(48px, 4.2vw, 80px)",
                lineHeight: 0.96,
                fontWeight: 300,
                letterSpacing: "-0.03em",
              }}
            >
              Let's make something{" "}
              <em className="italic font-light text-accent-warm">
                worth remembering.
              </em>
            </h2>
            <p
              className="text-[15.5px] leading-[1.7] max-w-[460px] mt-7"
              style={{ color: "hsl(var(--on-deep-soft))" }}
            >
              Share your vision and I'll be in touch personally — not a
              template, a proper bespoke proposal.
            </p>

            <ul className="mt-7 max-w-[460px] w-full space-y-1.5 mx-auto lg:mx-0">
              {CHECKLIST.map((c) => (
                <li
                  key={c}
                  className="flex items-center justify-center lg:justify-start gap-3 text-[14.5px] leading-[1.3]"
                  style={{ color: "hsl(var(--on-deep))" }}
                >
                  <span
                    className="hidden lg:inline-block w-3 h-px shrink-0"
                    style={{ background: "hsl(var(--accent-warm))" }}
                    aria-hidden="true"
                  />
                  {c}
                </li>
              ))}
            </ul>

            <div
              className="mt-9 lg:mt-auto p-5 max-w-[460px] w-full rounded-md text-center lg:text-left mx-auto lg:mx-0"
              style={{
                border: "1px solid hsl(var(--accent-warm) / 0.55)",
                color: "hsl(var(--on-deep))",
              }}
            >
              <div
                className="font-mono-rf text-[10px] tracking-[0.22em] uppercase mb-2"
                style={{ color: "hsl(var(--accent-warm))" }}
              >
                Limited availability
              </div>
              <p className="text-[13.5px] leading-[1.6]">
                To give every celebration the attention it deserves, we work
                with a limited number of clients each month.
              </p>
            </div>
          </div>

          {/* Right: form — wired to Netlify Forms (see index.html for build-time
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
            <div className="mb-5 text-center lg:text-left">
              <h3
                className="font-serif-rf text-primary"
                style={{
                  fontSize: "clamp(26px, 3vw, 34px)",
                  lineHeight: 1.18,
                  fontWeight: 400,
                  letterSpacing: "-0.018em",
                }}
              >
                Tell me about your celebration
              </h3>
              <p className="hidden lg:block text-[13px] text-ink-soft mt-1">
                Every field is bespoke to you — no templates.
              </p>
            </div>
            <div className="form-grid">
              <label className="form-row">
                <span className="lbl">Name</span>
                <input type="text" name="name" placeholder="Your full name" required />
              </label>
              <label className="form-row">
                <span className="lbl">Email</span>
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label className="form-row">
                <span className="lbl">Event date</span>
                <input type="date" name="date" />
              </label>
              <label className="form-row">
                <span className="lbl">Event type</span>
                <select name="type" defaultValue={defaultEventType}>
                  <option>Children's party</option>
                  <option>Milestone celebration</option>
                  <option>Corporate event</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="form-row full">
                <span className="lbl">Venue / location</span>
                <input type="text" name="venue" placeholder={venuePlaceholder} />
              </label>
              <label className="form-row full">
                <span className="lbl">Approximate budget</span>
                <select name="budget" defaultValue="£460 – £800">
                  <option>£460 – £800</option>
                  <option>£800 – £1,200</option>
                  <option>£1,200 – £2,500</option>
                  <option>£2,500 – £5,000</option>
                  <option>£5,000+</option>
                </select>
              </label>
              <label className="form-row full">
                <span className="lbl">Tell me about your vision</span>
                <textarea
                  name="vision"
                  rows={4}
                  placeholder="A few notes, colours, ideas, or a Pinterest link…"
                />
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
