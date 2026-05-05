import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { REVIEWS } from "@/seo/routes";

export const QUOTES = REVIEWS;

const Stars = () => (
  <span className="tcard-stars" aria-label="Five stars">
    {"★★★★★"}
  </span>
);

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

        <Carousel
          opts={{ align: "start", loop: true }}
          className="px-9 sm:px-12 md:px-16 lg:px-12"
        >
          <CarouselContent className="-ml-6">
            {QUOTES.map((t, i) => (
              <CarouselItem
                key={i}
                className="pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <figure className="tcard fade-up h-full">
                  <Stars />
                  <blockquote className="tcard-quote font-thin text-ink-soft">
                    {t.q}
                  </blockquote>
                  <figcaption className="tcard-meta">
                    <span className="name">{t.a}</span>
                    {t.href ? (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tcard-link"
                        aria-label={`Read ${t.a}'s review on Google`}
                      >
                        via Google ↗
                      </a>
                    ) : (
                      <span />
                    )}
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 sm:left-2 lg:-left-6" />
          <CarouselNext className="right-0 sm:right-2 lg:-right-6" />
        </Carousel>

      </div>
    </section>
  );
};

export default Testimonials;
