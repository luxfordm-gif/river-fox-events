import { useEffect, useState } from "react";
import { toast } from "sonner";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import { useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
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
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", { send_to: "AW-18210626936/xqXACO264L0cEPi6wOtD" });
      }
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
    <div className="min-h-screen flex flex-col bg-background text-foreground nav-solid">
      <Nav />
      <main className="flex-1">
        <section className="pt-[106px] md:pt-[122px] pb-24 md:pb-32" aria-labelledby="contact-heading">
          <div className="container-rfx">
            {/* Centered heading above the grid */}
            <header className="text-center pt-6 md:pt-10 pb-16 md:pb-24">
              <h1
                id="contact-heading"
                className="font-serif-rf max-w-[18ch] mx-auto"
                style={{
                  fontSize: "clamp(48px, 6vw, 88px)",
                  lineHeight: 1.0,
                  fontWeight: 300,
                  letterSpacing: "-0.028em",
                  textWrap: "balance",
                }}
              >
                Let's create something{" "}
                <em className="italic font-light text-accent-warm">
                  beautiful.
                </em>
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
              {/* Left: intro copy + direct contact methods */}
              <div className="text-center lg:text-left">
                <p
                  className="text-[16px] md:text-[17px] leading-[1.65] text-ink-soft max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  Share a few details via our enquiry form and I'll be in
                  touch to discuss your plans. Alternatively you can get in
                  touch via email or phone below.
                </p>
                <p
                  className="text-[15.5px] leading-[1.65] text-ink-soft mt-5 max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  Each event is bespoke and tailored to your space, style and
                  vision. We take on a limited number of bookings each month
                  to ensure every detail is carefully considered.
                </p>
                <p
                  className="text-[15.5px] leading-[1.65] text-ink-soft mt-5 max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  Most celebrations begin from £460, with larger or more
                  bespoke designs typically ranging from{" "}
                  <span className="whitespace-nowrap">£1,200 - £2,500+</span>.
                </p>
                <p
                  className="text-[15.5px] leading-[1.65] text-ink mt-5 max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  I look forward to hearing what you have in mind.
                </p>

                <div className="hairline mt-10 max-w-[460px] mx-auto lg:mx-0" aria-hidden="true" />

                <ul className="mt-8 flex flex-col gap-4 items-center lg:items-start">
                  <li>
                    <div className="font-mono-rf text-[10px] tracking-[0.24em] uppercase text-ink-soft mb-1.5">
                      WhatsApp
                    </div>
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Message Laura on WhatsApp"
                      className="font-serif-rf text-[22px] md:text-[24px] text-ink no-underline hover:underline underline-offset-4"
                    >
                      {WHATSAPP_DISPLAY}
                    </a>
                  </li>
                  <li>
                    <div className="font-mono-rf text-[10px] tracking-[0.24em] uppercase text-ink-soft mb-1.5">
                      Email
                    </div>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="font-serif-rf text-[22px] md:text-[24px] text-ink no-underline hover:underline underline-offset-4 break-all"
                    >
                      {EMAIL}
                    </a>
                  </li>
                  <li>
                    <div className="font-mono-rf text-[10px] tracking-[0.24em] uppercase text-ink-soft mb-1.5">
                      Instagram
                    </div>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif-rf text-[22px] md:text-[24px] text-ink no-underline hover:underline underline-offset-4"
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
                <div className="form-grid">
                  <label className="form-row">
                    <span className="lbl">Full name</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      required
                    />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Email address</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
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
                    <input
                      type="text"
                      name="venue"
                      placeholder="e.g. at home in Cobham"
                    />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Type of event</span>
                    <select name="type" defaultValue="Children's party">
                      <option>Children's party</option>
                      <option>Milestone celebration</option>
                      <option>Corporate / brand event</option>
                    </select>
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Tell me about your vision</span>
                    <textarea
                      name="vision"
                      rows={5}
                      placeholder="Theme, colours, inspiration, or anything you already have in mind"
                    />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Planned investment</span>
                    <select name="budget" defaultValue="£460 – £1,200">
                      <option>£460 – £1,200</option>
                      <option>£1,200 – £2,000</option>
                      <option>£2,000 – £3,000</option>
                      <option>£3,000+</option>
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
                <div className="flex justify-center lg:justify-end mt-6">
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
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
