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
const INSTAGRAM_HANDLE = "@riverfoxevents";
const INSTAGRAM_URL = "https://www.instagram.com/riverfoxevents/";

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
      toast.success("Thank you — Laura will be in touch personally.");
      form.reset();
    } catch (err) {
      toast.error(
        "Sorry — something went wrong. Please email Riverfoxevents@gmail.com directly."
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
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
              {/* Left: heading + direct contact methods */}
              <div className="text-center lg:text-left">
                <h1
                  id="contact-heading"
                  className="font-serif-rf"
                  style={{
                    fontSize: "clamp(48px, 6vw, 88px)",
                    lineHeight: 1.0,
                    fontWeight: 300,
                    letterSpacing: "-0.028em",
                    textWrap: "balance",
                  }}
                >
                  Hey,{" "}
                  <em className="italic font-light text-accent-warm">
                    let's talk.
                  </em>
                </h1>
                <p
                  className="text-[16px] md:text-[17px] leading-[1.65] text-ink-soft mt-7 max-w-[460px] mx-auto lg:mx-0"
                  style={{ textWrap: "pretty" }}
                >
                  Send a quick note and I'll be in touch personally — or reach
                  me directly on the channel that suits you best.
                </p>

                <ul className="mt-10 flex flex-col gap-4 items-center lg:items-start">
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
                  <label className="form-row full">
                    <span className="lbl">Name</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      required
                    />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Email</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Your message</span>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="A few words — I'll reply personally."
                      required
                    />
                  </label>
                </div>
                <div className="flex justify-center lg:justify-end mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-solid-rf accent disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send message"} <span>→</span>
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
