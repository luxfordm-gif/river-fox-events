import TestimonialsCarousel from "./TestimonialsCarousel";
import { REVIEWS } from "@/seo/routes";

export const QUOTES = REVIEWS;

type TestimonialsProps = {
  noDivider?: boolean;
  paddingTop?: string;
  paddingBottom?: string;
};

const Testimonials = ({
  noDivider = false,
  paddingTop,
  paddingBottom,
}: TestimonialsProps = {}) => {
  return (
    <section
      id="kindness"
      className="rfx-section"
      style={{ paddingTop, paddingBottom }}
      aria-labelledby="kindness-heading"
    >
      <div className="container-rfx">
        {!noDivider && (
          <div className="hairline mb-12 md:mb-16 hidden md:block" aria-hidden="true" />
        )}
        <div className="text-center mb-8 md:mb-10">
          <h2
            id="kindness-heading"
            className="font-serif-rf"
            style={{
              fontSize: "clamp(40px, 4.2vw, 76px)",
              lineHeight: 1.04,
              fontWeight: 300,
              letterSpacing: "-0.025em",
            }}
          >
            Kind <em className="italic font-light text-accent-warm">words.</em>
          </h2>
          <div className="mt-4">
            <a
              href="https://www.google.com/maps/search/Lollipop+Balloons+Horley"
              target="_blank"
              rel="noopener noreferrer"
              className="tcard-readall"
            >
              Read all reviews on Google →
            </a>
          </div>
        </div>

        <TestimonialsCarousel />

      </div>
    </section>
  );
};

export default Testimonials;
