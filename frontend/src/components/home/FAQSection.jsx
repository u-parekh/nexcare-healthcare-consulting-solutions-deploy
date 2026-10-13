import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Reveal from "../Reveal";
import { FAQS } from "../../data/faqs";

export const faqLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const FAQSection = () => (
  <section className="py-24 border-t border-border" data-testid="faq-section" aria-labelledby="faq-heading">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
      <Reveal className="lg:col-span-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 05 — FAQ</p>
        <h2 id="faq-heading" className="font-display font-extrabold text-4xl sm:text-5xl mt-3">Questions hospitals ask us.</h2>
        <p className="mt-4 text-muted-foreground leading-7">Straight answers about our healthcare consulting, hospital planning, NABH preparation and digital services.</p>
      </Reveal>
      <Reveal className="lg:col-span-8" delay={0.1}>
        <Accordion type="single" collapsible className="rounded-xl border border-border bg-card/70 px-5">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
              <AccordionTrigger data-testid={`faq-q-${i}`} className="text-left font-display font-bold text-base hover:no-underline hover:text-brand">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-7 text-sm" data-testid={`faq-a-${i}`}>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
);

export default FAQSection;
