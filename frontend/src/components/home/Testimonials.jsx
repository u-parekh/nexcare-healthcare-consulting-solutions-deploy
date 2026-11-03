import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Pause, Play } from "lucide-react";
import Reveal from "../Reveal";
import { TESTIMONIALS } from "../../data/testimonials";

const DELAY = 4000; // autoplay interval in milliseconds
// Entries without approved === true are shown with a visible "Draft" badge (see data/testimonials.js).
const ITEMS = TESTIMONIALS;

const FeedbackRequest = () => (
  <Reveal className="nx-cta p-8 md:p-12 text-center" data-testid="reviews-empty">
    <Quote className="w-9 h-9 text-brand/40 mx-auto mb-4" aria-hidden />
    <p className="font-display font-bold text-2xl">Client stories are on their way.</p>
    <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-7">We only publish feedback that clients have approved for publication. Worked with NEXCARE? We'd value hearing about your experience.</p>
    <Link to="/contact" state={{ service: "Other / General Inquiry", message: "Feedback about working with NEXCARE: " }} data-testid="reviews-share-feedback" className="nx-cta-btn mt-6">Share your feedback</Link>
  </Reveal>
);

export const Testimonials = () => (
  <section className="py-24 border-t border-border bg-card/30" data-testid="reviews" aria-label="Client testimonials">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <Reveal className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 04 — Client testimonials</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 max-w-2xl">Trusted by healthcare professionals.</h2>
      </Reveal>
      {ITEMS.length ? <Carousel items={ITEMS} /> : <FeedbackRequest />}
    </div>
  </section>
);

const Carousel = ({ items }) => {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef(null);
  const active = !paused && !hovering && !reduce && items.length > 1;

  useEffect(() => {
    if (!embla) return;
    const on = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", on); on();
    return () => embla.off("select", on);
  }, [embla]);

  // A single interval at a time: it is cleared and recreated whenever the slide changes (manual or automatic),
  // the user starts/stops interacting, pauses, or the reduced-motion preference changes.
  useEffect(() => {
    clearInterval(timer.current);
    if (embla && active) timer.current = setInterval(() => embla.scrollNext(), DELAY);
    return () => clearInterval(timer.current);
  }, [embla, active, selected]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div aria-roledescription="carousel" onKeyDown={(e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }}>
        <div className="flex justify-end items-center gap-2 mb-6">
            <button onClick={() => setPaused((p) => !p)} data-testid="reviews-pause" aria-label={paused ? "Resume auto-rotation" : "Pause auto-rotation"}
              className="grid place-items-center w-11 h-11 rounded-full border border-border hover:border-brand hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button onClick={prev} data-testid="reviews-prev" aria-label="Previous testimonial" className="grid place-items-center w-11 h-11 rounded-full border border-border hover:border-brand hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} data-testid="reviews-next" aria-label="Next testimonial" className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-brand to-brand-2 text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ChevronRight className="w-5 h-5" /></button>
          </div>
        <div className="overflow-hidden" ref={emblaRef} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)} onBlurCapture={() => setHovering(false)}
          onTouchStart={() => setHovering(true)} onTouchEnd={() => setHovering(false)} onTouchCancel={() => setHovering(false)}>
          <div className="flex" aria-live={active ? "off" : "polite"}>
            {items.map((r, i) => (
              <div key={i} data-testid={`review-${i}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}
                className="shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 px-2">
                <figure className="relative h-full p-7 rounded-lg border border-border bg-card/70 backdrop-blur-md shadow-sm hover:shadow-lg hover:border-brand transition-[box-shadow,border-color]">
                  <Quote className="absolute top-5 right-5 w-8 h-8 text-brand/20" aria-hidden />
                  {r.approved !== true && (
                    <p data-testid={`review-draft-${i}`} className="mb-4 inline-block max-w-[calc(100%-3rem)] rounded-full border border-brand-2/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-2">Draft &mdash; pending client approval</p>
                  )}
                  <blockquote className="text-muted-foreground leading-7 mb-6 break-words">&ldquo;{r.text}&rdquo;</blockquote>
                  <figcaption>
                    <p className="font-display font-bold break-words">{r.name || r.role}</p>
                    <p className="text-xs text-muted-foreground break-words">{[r.name && r.role, r.org].filter(Boolean).join(", ")}</p>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Choose testimonial">
          {items.map((_, i) => (
            <button key={i} role="tab" aria-selected={selected === i} aria-label={`Go to testimonial ${i + 1}`} onClick={() => embla?.scrollTo(i)}
              data-testid={`review-dot-${i}`} className={`h-2.5 rounded-full transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selected === i ? "w-8 bg-brand" : "w-2.5 bg-border hover:bg-brand/50"}`} />
          ))}
        </div>
    </div>
  );
};

export default Testimonials;
