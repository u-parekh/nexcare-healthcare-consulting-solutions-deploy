import { Compass, Leaf, HeartPulse, Users } from "lucide-react";

const PILLARS = [
  { icon: HeartPulse, t: "Patient-first by default", d: "Every design decision is interrogated against measurable patient outcomes — flow, infection control, dignity, recovery." },
  { icon: Leaf, t: "Sustainable infrastructure", d: "Net-zero pathways, low-embodied-carbon materials, biophilic interiors and passive design strategies." },
  { icon: Users, t: "Built with care-givers", d: "Frontline nurses, surgeons and operators co-author our briefs. No design is shipped without their sign-off." },
  { icon: Compass, t: "Future-ready operations", d: "Modular layouts, digital twins and integrated data spines — built for the hospital that doesn't exist yet." },
];

const Vision = () => (
  <div data-testid="vision-page">
    <section className="relative py-32 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand w-[500px] h-[500px] top-10 left-1/3 opacity-30 animate-pulse-glow" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Our Vision</p>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl mx-auto leading-[1.02] text-balance">
          To make great care, <span className="text-brand">spatially possible</span> — everywhere.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-7">
          By 2035 we want NEXCARE-built hospitals to serve 1M patients a year — sustainably, equitably, and beautifully.
        </p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-6">
      {PILLARS.map((p) => (
        <div key={p.t} className="p-8 rounded-lg bg-card border border-border hover:border-brand transition-colors">
          <p.icon className="w-9 h-9 text-brand mb-4" strokeWidth={1.6} />
          <h3 className="font-display font-bold text-2xl mb-3">{p.t}</h3>
          <p className="text-muted-foreground leading-7">{p.d}</p>
        </div>
      ))}
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <img src="https://images.pexels.com/photos/20242798/pexels-photo-20242798.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="future of healthcare" className="rounded-lg border border-border"/>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">The Manifesto</p>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 mb-6">Healing is a system, not a building.</h2>
          <p className="text-muted-foreground leading-7 mb-4">A hospital is a stack of decisions — site, staffing, flow, sterility, daylight, data. Get the stack right, and outcomes compound.</p>
          <p className="text-muted-foreground leading-7">We approach every brief as a system to engineer — not a facade to render. That difference shows up in the recovery rates of the facilities we deliver.</p>
        </div>
      </div>
    </section>
  </div>
);

export default Vision;
