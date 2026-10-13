import { useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

// Generic auto-playing, infinite-loop, pause-on-hover carousel.
const AutoCarousel = ({ children, className = "", delay = 3500 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const timerRef = useRef(null);

  const play = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, delay);
  }, [emblaApi, delay]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    play();
    return stop;
  }, [emblaApi, play, stop]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      ref={emblaRef}
      onMouseEnter={stop}
      onMouseLeave={play}
      data-testid="auto-carousel"
    >
      <div className="flex">{children}</div>
    </div>
  );
};

export default AutoCarousel;
