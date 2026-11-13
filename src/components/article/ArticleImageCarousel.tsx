import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export type ArticleCarouselImage = {
  src: string;
  alt: string;
  caption?: string;
};

type Aspect = "video" | "3/2" | "4/3" | "square" | "4/5";

const ASPECT_CLASS: Record<Aspect, string> = {
  video: "aspect-video",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  square: "aspect-square",
  "4/5": "aspect-[4/5]",
};

type Props = {
  images: ArticleCarouselImage[];
  /** Optional cap on carousel width. Defaults to 1120px to match ArticleImage. */
  width?: number | "full";
  /** Autoplay interval in ms. Defaults to 4500. */
  intervalMs?: number;
  /** Aspect ratio of each slide. Defaults to "3/2" (gentler than 16:9). */
  aspect?: Aspect;
};

const ArticleImageCarousel = ({
  images,
  width = 1120,
  intervalMs = 4500,
  aspect = "3/2",
}: Props) => {
  const autoplay = useRef(
    Autoplay({ delay: intervalMs, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
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

  const cap = width === "full" ? "100%" : `${width}px`;

  return (
    <figure
      className="mx-auto article-pad md:px-12 article-block"
      style={{ maxWidth: cap }}
    >
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
        setApi={setApi}
        className="relative"
      >
        <CarouselContent className="ml-0">
          {images.map((img, i) => (
            <CarouselItem key={i} className="pl-0 basis-full">
              <div className={`${ASPECT_CLASS[aspect]} overflow-hidden rounded-large`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {img.caption && (
                <figcaption className="t-meta media-to-caption text-center italic text-ink-soft max-w-[640px] mx-auto">
                  {img.caption}
                </figcaption>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-3" />
        <CarouselNext className="hidden md:flex right-3" />
      </Carousel>

      <div
        className="flex justify-center icon-gap media-to-caption"
        role="tablist"
        aria-label="Gallery pagination"
      >
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-label={`Go to image ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`tcard-dot ${i === selected ? "is-active" : ""}`}
          />
        ))}
      </div>
    </figure>
  );
};

export default ArticleImageCarousel;
