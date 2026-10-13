import { Stethoscope, Building2, MonitorSmartphone, Workflow, SlidersHorizontal, TrendingUp } from "lucide-react";
import Reveal from "../Reveal";

// Homepage "Why choose NexCare?" section. Copy describes only services NexCare offers; no client counts, awards,
// certifications or guaranteed outcomes. Entrance animations reuse <Reveal> (plays once, staggered, and
// <MotionConfig reducedMotion="user"> in App.js removes the movement for visitors who prefer reduced motion).
const BENEFITS = [
  { icon: Stethoscope, title: "Healthcare-Focused Expertise",
    desc: "Solutions shaped around healthcare operations, hospital administration, patient-service workflows, and the practical needs of healthcare organizations." },
  { icon: Building2, title: "Hospital Planning and Development Support",
    desc: "Support for healthcare entrepreneurs and organizations exploring hospital planning, facility requirements, operational workflows, and development priorities." },
  { icon: MonitorSmartphone, title: "Digital Healthcare Solutions",
    desc: "Practical digital solutions, including healthcare websites and medical record digitization, to support information accessibility and organized workflows." },
  { icon: Workflow, title: "Operational Efficiency",
    desc: "An emphasis on identifying process gaps, improving administrative coordination, and supporting more structured hospital operations." },
  { icon: SlidersHorizontal, title: "Tailored Consulting Approach",
    desc: "Recommendations aligned with each organization's objectives, operational requirements, project scope, and available resources." },
  { icon: TrendingUp, title: "Long-Term Improvement Mindset",
    desc: "Support focused on sustainable processes, continuous improvement, and adapting healthcare operations to changing organizational needs." },
];

export const WhyChooseNexcare = () => (
  <section aria-labelledby="why-nexcare-heading" className="border-t border-border py-24" data-testid="why-choose">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <Reveal className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/02 —Why NEXCARE</p>
        <h2 id="why-nexcare-heading" className="font-display font-extrabold text-4xl sm:text-5xl mt-3 max-w-3xl text-balance">
          Why choose NEXCARE for your healthcare consulting needs?
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-12 max-w-3xl text-base sm:text-lg text-muted-foreground leading-7">
          Nexcare supports hospitals, healthcare providers, and healthcare entrepreneurs with practical consulting and digital solutions designed around their operational needs. From hospital planning and medical record digitization to healthcare technology and process improvement, our approach focuses on helping healthcare organizations build efficient, organized, and future-ready operations.
        </p>
      </Reveal>
      {/* role="list" keeps list semantics in Safari/VoiceOver, which drops them when list-style is removed */}
      <ul role="list" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENEFITS.map((b, i) => (
          <Reveal as="li" key={b.title} delay={(i % 3) * 0.08} className="h-full" data-testid={`why-card-${i}`}>
            <div className="h-full rounded-xl p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] via-[hsl(var(--brand)/0.35)] to-[hsl(var(--brand-2))] hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_hsl(var(--brand)/0.6)] transition-[transform,box-shadow] duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="h-full rounded-[10px] bg-card p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand/10 text-brand">
                  <b.icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 leading-snug">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-6">{b.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default WhyChooseNexcare;
