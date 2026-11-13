import { useEffect, useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { REVIEWS, type Review } from "@/seo/routes";

const Stars = () => (
  <span className="tcard-stars" aria-label="Five stars">
    {"★★★★★"}
  </span>
);

type TestimonialsCarouselProps = {
  /** Show a chosen subset of reviews. Defaults to every review. */
  reviews?: Review[];
};

const TestimonialsCarousel = ({ reviews = REVIEWS }: TestimonialsCarouselProps = {}) => {
  const [api, setApi] = useState<CarouselApi>();
  // Moves on by one screenful (three cards on desktop) every 6 seconds,
  // gliding rather than jumping; pauses while the pointer is over it and
  // never runs with reduced motion (Matt, 2026-11-08).
  const plugins = useMemo(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return [];
    return [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })];
  }, []);
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="-mx-6 sm:-mx-8 md:mx-0">
      <Carousel
        opts={{ align: "center", loop: true, containScroll: "trimSnaps", slidesToScroll: "auto", duration: 40 }}
        plugins={plugins}
        setApi={setApi}
        className="-my-4 md:px-16 lg:px-12"
      >
        {/* Vertical room inside the carousel's clipping box so the card's
            hover lift and shadow aren't cut off; -my-4 on the carousel takes
            it back out of the layout. From tablet up the cards also sit
            12px in from both sides of that box (half the 24px gap each
            side), so the outer cards' outlines are never on the clipping
            edge and don't vanish mid-slide (Matt, 2026-11-13). */}
        <CarouselContent className="-ml-4 md:ml-0 py-4">
          {reviews.map((t, i) => (
            <CarouselItem
              key={i}
              className="pl-4 md:px-3 basis-[86%] md:basis-1/2 lg:basis-1/3"
            >
              <figure className="tcard fade-up h-full">
                <Stars />
                <blockquote className="tcard-quote t-body text-ink-soft">
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
        <CarouselPrevious className="hidden md:flex sm:left-2 lg:-left-6" />
        <CarouselNext className="hidden md:flex sm:right-2 lg:-right-6" />
      </Carousel>

      <div
        className="carousel-dots md:hidden"
        role="tablist"
        aria-label="Reviews pagination"
      >
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-label={`Go to review ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`tcard-dot ${i === selected ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
