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
          <div className="hairline divider-gap hidden md:block" aria-hidden="true" />
        )}
        <div className="text-center heading-to-content">
          <h2
            id="kindness-heading"
            className="t-h2"
          >
            Kind <em className="t-accent">words.</em>
          </h2>
          <div className="heading-to-text">
            <a
              href="https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6"
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
