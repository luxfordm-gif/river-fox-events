import { useState } from "react";
import studioImg from "@/assets/laura-portrait.webp";
import { SectionHeading } from "@/components/rfx/SectionHeading";
import "@/styles/home-sections.css";

/* Home page "Meet Laura" (slimmed 2026-11-17): a photo, a heading, the first
   paragraph and a link that opens the rest in place. The stats block went; a
   full About page comes later and will take this link over. On phones the pink
   panel runs edge to edge with the photo inset, on larger screens it is a
   rounded panel (home-sections.css). */
const About = () => {
  const [open, setOpen] = useState(false);

  return (
    <section id="about" className="rfx-section about-section" aria-labelledby="about-heading">
      <div className="container-rfx">
        <div className="about-card">
          <div className="about-photo rounded-large">
            {/*
              SEO REMINDER: alt text must describe what is in the photo
              (max 125 characters, no brand name - CLAUDE.md).
            */}
            <img
              src={studioImg}
              alt="Laura, the founder and stylist, photographed amongst Surrey bluebells in a branded tee"
              loading="lazy"
              decoding="async"
              width={1200}
              height={1499}
            />
          </div>

          <div>
            <SectionHeading id="about-heading" align="left">
              One stylist. <em className="t-accent">Every event.</em>
            </SectionHeading>

            <p className="t-body heading-to-text text-ink measure-lead">
              <strong>
                I started River Fox Events after running a teepee sleepover business and realising how much I loved
                creating moments that stay with you.
              </strong>
            </p>

            {/* Always in the page; its height and fade ease open with the button. */}
            <div className={`about-more ${open ? "open" : ""}`} id="about-more" aria-hidden={!open}>
              <div className="about-more-inner">
                <div className="t-body paragraphs text-ink-soft measure-lead">
                  <p>
                    It's never just been about balloons. It's the feeling when your child walks into a space made just
                    for them, and the tiny details they (and you) remember years later.
                  </p>
                  <p>
                    Today I style parties, balloon installations and celebrations across Surrey and London, and keep
                    the business small so I'm hands-on with every event.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="about-more"
              onClick={() => setOpen((o) => !o)}
              className="btn-link-rf t-label text-to-action"
            >
              {open ? "Less about Laura" : "More about Laura"}{" "}
              <span className={`about-plus ${open ? "open" : ""}`} aria-hidden="true">
                +
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
