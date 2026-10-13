import { Compass, Leaf, HeartPulse, Users, Target, Gem, Briefcase } from "lucide-react";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";

const PILLARS = [
  { icon: HeartPulse, t: "Patient-first by default", d: "Every design decision is interrogated against measurable patient outcomes — flow, infection control, dignity, recovery." },
  { icon: Leaf, t: "Sustainable infrastructure", d: "Net-zero pathways, low-embodied-carbon materials, biophilic interiors and passive design strategies." },
  { icon: Users, t: "Built with care-givers", d: "Frontline nurses, surgeons and operators co-author our briefs. No design is shipped without their sign-off." },
  { icon: Compass, t: "Future-ready operations", d: "Modular layouts, digital twins and integrated data spines — built for the hospital that doesn't exist yet." },
];

const VALUES = ["Integrity in every recommendation", "Patient safety before convenience", "Practical, implementable advice", "Collaboration with clinical teams", "Continuous learning"];
const EXPERTISE = ["Hospital planning & design", "NABH preparation & quality systems", "Medical records & MRD", "Equipment & pharmacy planning", "Hospital websites & digital planning", "Feasibility & analytics"];

// Only details supplied for Dr. Het are shown. No employment dates, degrees or titles beyond these are published;
// overlapping dates from the source are intentionally omitted until confirmed.
const EXPERIENCE = [
  { org: "Tricolour Hospitals", role: "Assistant Manager, Medical Administration",
    points: ["Workforce planning, corporate communications and business analysis."] },
  { org: "VIROC Super Speciality Orthopaedic Hospital", role: "OPD Incharge",
    points: ["Managed hospital operations and performance reporting.", "Supported NABH digital compliance, quality governance and operational dashboards.", "Supported incident reporting, root-cause analysis, corrective and preventive actions, workforce planning, audits and continuous improvement."] },
  { org: "Parul Sevashram Hospital", role: "Assistant" },
];
const SKILLS = ["Hospital Operations", "Medical Administration", "NABH Compliance", "Quality Management", "Data Analysis and Reporting", "Workforce Planning", "Business Analysis", "Corporate Communications"];

const SECTIONS = [["intro", "Who we are"], ["mission", "Mission"], ["vision", "Vision"], ["values", "Values & expertise"], ["leadership", "Leadership"]];
const crumbs = [{ to: "/", label: "Home" }, { to: "/about", label: "About & Vision" }];

const Profile = () => (
  <Reveal className="mt-14 rounded-xl p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]" data-testid="het-profile">
    <article className="rounded-[10px] bg-card p-6 sm:p-10">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Professional profile</p>
      <h3 className="font-display font-extrabold text-3xl mt-2">Dr. Het Limbachiya</h3>
      <p className="text-muted-foreground mt-1">B.H.M.S, MBA in Hospital Management</p>
      <h4 className="font-display font-bold text-lg mt-8 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-brand" /> Experience</h4>
      <ol className="relative border-l-2 border-brand/30 ml-2 space-y-8">
        {EXPERIENCE.map((e) => (
          <li key={e.org} className="pl-6 relative">
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-brand to-brand-2 ring-4 ring-card" aria-hidden />
            <p className="font-display font-bold text-lg">{e.role}</p>
            <p className="text-brand font-semibold text-sm">{e.org}</p>
            {e.points && <ul className="mt-3 space-y-1.5 text-sm text-foreground/85 list-disc pl-4">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>}
          </li>
        ))}
      </ol>
      <h4 className="font-display font-bold text-lg mt-10 mb-4">Relevant skills</h4>
      <ul className="flex flex-wrap gap-2" data-testid="het-skills">
        {SKILLS.map((s) => <li key={s} className="px-3 py-1.5 rounded-full border border-brand/30 bg-brand/5 text-sm">{s}</li>)}
      </ul>
    </article>
  </Reveal>
);

const About = () => (
  <div data-testid="about-page">
    <Seo title="About Nexcare — Mission, Vision & Leadership" path="/about" jsonLd={breadcrumbLd(crumbs)}
      description="Learn about Nexcare, a healthcare consulting and hospital planning company in Gujarat — our mission, vision, values, expertise and leadership." />
    <section id="intro" className="relative py-24 border-b border-border overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand-2 w-[400px] h-[400px] -bottom-24 right-10 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <Breadcrumbs items={crumbs} />
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mt-8">About NEXCARE</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 leading-[1.02] text-balance">
            Building the trust <span className="text-brand">in healthcare.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-7">
            We are clinicians, architects and operators — united by the belief that the built environment of healthcare directly shapes patient outcomes.
          </p>
        </div>
        <Reveal dir="right" className="lg:col-span-5">
          <div className="relative">
            <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full" />
            <img src="/images/healthcare-consulting.webp" alt="NEXCARE healthcare consulting team reviewing a hospital master-plan" width="1200" height="1200" className="relative w-full rounded-lg border border-border shadow-2xl" />
          </div>
        </Reveal>
      </div>
    </section>

    <nav aria-label="About page sections" className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur" data-testid="about-subnav">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex gap-1 overflow-x-auto py-2">
        {SECTIONS.map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 px-3 py-1.5 rounded-md text-sm text-foreground/70 hover:text-brand hover:bg-accent">{l}</a>)}
      </div>
    </nav>

    <section id="mission" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-10 items-center scroll-mt-32">
      <Reveal>
        <Target className="w-10 h-10 text-brand mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Our Mission</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3">Help hospitals plan, operate and grow with confidence.</h2>
      </Reveal>
      <Reveal delay={0.1} className="text-muted-foreground leading-8 text-lg">
        We bring hospital planning, quality systems, records management and digital capability together so healthcare leaders can make practical decisions that improve patient experience and operational efficiency.
      </Reveal>
    </section>

    <div id="vision" data-testid="vision-section" className="scroll-mt-32">
      <section className="relative py-32 border-y border-border overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-blob bg-brand w-[500px] h-[500px] top-10 left-1/3 opacity-30 animate-pulse-glow" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Our Vision</p>
          <Reveal as="h2" className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl mx-auto leading-[1.02] text-balance">
            To make great care, <span className="text-brand">spatially possible</span> — everywhere.
          </Reveal>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-7">
            By 2035 we want NEXCARE-built hospitals to serve 1M patients a year — sustainably, equitably, and beautifully.
          </p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid md:grid-cols-2 gap-6">
        {PILLARS.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.08} className="p-8 rounded-lg bg-card border border-border hover:border-brand transition-colors">
            <p.icon className="w-9 h-9 text-brand mb-4" strokeWidth={1.6} />
            <h3 className="font-display font-bold text-2xl mb-3">{p.t}</h3>
            <p className="text-muted-foreground leading-7">{p.d}</p>
          </Reveal>
        ))}
      </section>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal dir="left"><img src="images/Modern Hospital.webp" alt="Future of healthcare facility design" loading="lazy" className="rounded-lg border border-border" /></Reveal>
          <Reveal dir="right">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">The Manifesto</p>
            <h3 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 mb-6">Healing is a system, not a building.</h3>
            <p className="text-muted-foreground leading-7 mb-4">A hospital is a stack of decisions — site, staffing, flow, sterility, daylight, data. Get the stack right, and outcomes compound.</p>
            <p className="text-muted-foreground leading-7">We approach every brief as a system to engineer — not a facade to render. That difference shows up in the recovery rates of the facilities we deliver.</p>
          </Reveal>
        </div>
      </section>
    </div>

    <section id="values" className="border-y border-border bg-card/30 py-24 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12">
        <Reveal>
          <Gem className="w-9 h-9 text-brand mb-4" />
          <h2 className="font-display font-extrabold text-4xl">Our values</h2>
          <ul className="mt-6 space-y-3">{VALUES.map((v) => <li key={v} className="flex gap-3 items-start"><span className="mt-2 w-2 h-2 rounded-full bg-brand-2 shrink-0" />{v}</li>)}</ul>
        </Reveal>
        <Reveal delay={0.1}>
          <Compass className="w-9 h-9 text-brand mb-4" />
          <h2 className="font-display font-extrabold text-4xl">Our expertise</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">{EXPERTISE.map((e) => <div key={e} className="p-4 rounded-lg border border-border bg-card text-sm font-medium">{e}</div>)}</div>
        </Reveal>
      </div>
    </section>

    <section id="leadership" className="py-24 scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">Leadership</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl">Multidisciplinary by experience.</h2>
        <Profile />
      </div>
    </section>
  </div>
);

export default About;
