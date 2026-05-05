import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { REVIEWS } from "@/seo/routes";

const Stars = () => (
  <span className="tcard-stars" aria-label="Five stars">
    {"★★★★★"}
  </span>
);

const TestimonialsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
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
        opts={{ align: "center", loop: true, containScroll: "trimSnaps" }}
        setApi={setApi}
        className="md:px-16 lg:px-12"
      >
        <CarouselContent className="-ml-4 md:-ml-6">
          {REVIEWS.map((t, i) => (
            <CarouselItem
              key={i}
              className="pl-4 md:pl-6 basis-[86%] md:basis-1/2 lg:basis-1/3"
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
        <CarouselPrevious className="hidden md:flex sm:left-2 lg:-left-6" />
        <CarouselNext className="hidden md:flex sm:right-2 lg:-right-6" />
      </Carousel>

      <div
        className="flex md:hidden justify-center gap-2 mt-6"
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
