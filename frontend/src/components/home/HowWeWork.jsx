import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ClipboardCheck, SearchCheck, Lightbulb, PencilRuler, Hammer, LifeBuoy } from "lucide-react";
import Reveal from "../Reveal";

const STEPS = [
  { icon: ClipboardCheck, title: "Consultation", desc: "Understand your vision, context and goals." },
  { icon: SearchCheck, title: "Assessment", desc: "Site audit, demand study and readiness review." },
  { icon: Lightbulb, title: "Strategy", desc: "Service mix, capex envelope and roadmap." },
  { icon: PencilRuler, title: "Design", desc: "Master-plan, architecture and clinical briefs." },
  { icon: Hammer, title: "Implementation", desc: "Construction oversight, equipment, HR ramp-up." },
  { icon: LifeBuoy, title: "Support", desc: "SOPs and continuous quality." },
];

const StepCard = ({ s }) => (
  <div className="h-full rounded-xl border border-border bg-card/80 p-5 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] hover:border-brand hover:-translate-y-1 transition-[transform,border-color] duration-300">
    <div className="flex items-center lg:flex-col lg:items-start gap-3 mb-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><s.icon className="w-5 h-5" strokeWidth={1.8} /></div>
      <h3 className="font-display font-bold text-lg xl:text-base break-words">{s.title}</h3>
    </div>
    <p className="text-sm text-muted-foreground leading-6">{s.desc}</p>
  </div>
);

const Marker = ({ n }) => (
  <div className="relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-brand/40 bg-card text-sm font-bold text-brand shadow-sm">{n}</div>
);

export const HowWeWork = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="border-t border-border bg-card/30 py-24" data-testid="how-we-work">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 03 — How we work</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 mb-14 max-w-2xl">A clear path, from brief to operations.</h2>
        </Reveal>
        <div ref={ref} className="relative">
          {/* Desktop: horizontal line through markers */}
          <div className="hidden lg:block absolute left-[calc(100%/12)] right-[calc(100%/12)] top-5 h-1 -translate-y-1/2 rounded-full bg-border" aria-hidden>
            <motion.div style={{ scaleX: progress }} className="h-full origin-left rounded-full bg-gradient-to-r from-brand to-brand-2" data-testid="work-progress-h" />
          </div>
          {/* Mobile/tablet: vertical line through markers */}
          <div className="lg:hidden absolute left-5 top-5 bottom-5 w-1 -translate-x-1/2 rounded-full bg-border" aria-hidden>
            <motion.div style={{ scaleY: progress }} className="w-full h-full origin-top rounded-full bg-gradient-to-b from-brand to-brand-2" data-testid="work-progress-v" />
          </div>
          <ol className="grid gap-6 lg:grid-cols-6 lg:gap-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.07} data-testid={`step-${i}`} className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-5">
                <Marker n={i + 1} />
                <div className="flex-1 w-full lg:text-left"><StepCard s={s} /></div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
