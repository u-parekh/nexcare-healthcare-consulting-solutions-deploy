import { Link } from "react-router-dom";
import { ArrowRight, Building2, FolderArchive, Globe2, Stethoscope, Lightbulb, Users, GraduationCap, HeartHandshake } from "lucide-react";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";

const FOCUS = [
  { i: Stethoscope, t: "Healthcare consulting", d: "Strategy, operations and quality systems for hospitals and clinics." },
  { i: Building2, t: "Hospital planning & operations", d: "Planning new facilities and improving how existing ones run." },
  { i: FolderArchive, t: "Medical records & technology", d: "MRD services, record digitization and healthcare technology." },
  { i: Globe2, t: "Digital transformation", d: "Hospital websites, digital presence and patient communication." },
];
const WHO = ["Healthcare professionals", "Hospital administrators", "Digital & web specialists", "Consulting professionals"];
const CULTURE = [
  { i: GraduationCap, t: "Learning", d: "We learn from every hospital we work with and share it with the team." },
  { i: Lightbulb, t: "Innovation", d: "We look for practical ideas that make care safer and operations simpler." },
  { i: Users, t: "Collaboration", d: "Clinicians, planners and technologists working side by side." },
  { i: HeartHandshake, t: "Responsible healthcare development", d: "Honest advice that puts patient safety and long-term value first." },
];
// Supplied career illustrations. object-contain keeps each illustration fully visible (no cropping);
// the tile background matches each image's own backdrop so any letterboxing is seamless.
const CAREER_IMAGES = [
  { src: "/images/career-1.webp", h: 900, bg: "#ffffff", alt: "Manager and colleague discussing reports and performance charts at a desk" },
  { src: "/images/career-2.webp", h: 1200, bg: "#dfebf9", alt: "Team member working at a desk with a monitor, a wall clock and a plant" },
  { src: "/images/career-3.webp", h: 800, bg: "#ffffff", alt: "Two colleagues reviewing a quality checklist and analytics charts with a magnifying glass" },
  { src: "/images/career-4.webp", h: 1200, bg: "#ffffff", alt: "Professional presenting a growth chart with a rising arrow and healthcare plus icons" },
];
const crumbs = [{ to: "/", label: "Home" }, { to: "/career", label: "Careers" }];

const Career = () => (
  <div data-testid="career-page">
    <Seo title="Careers at Nexcare Healthcare Consulting Solutions" path="/career" jsonLd={breadcrumbLd(crumbs)}
      description="Nexcare is a growing healthcare consulting and hospital-planning startup. Share an expression of interest to collaborate with our team." />
    <section className="relative py-24 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand-2 w-[420px] h-[420px] top-10 right-1/4 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <Breadcrumbs items={crumbs} />
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mt-8">Careers</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 leading-[1.02]">Build the spaces that heal.</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-7">Nexcare is a growing healthcare consulting and hospital planning startup. We bring together hospital planning, operational improvement, medical records, technology and digital transformation to help healthcare facilities work better.</p>
          <div className="mt-8 inline-flex items-center rounded-full border border-brand/20 bg-card/70 px-4 py-2 text-sm font-semibold text-brand-2" data-testid="career-status">We are not hiring currently, but we welcome thoughtful introductions.</div>
        </div>
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {CAREER_IMAGES.map((img, i) => (
            <img key={img.src} src={img.src} alt={img.alt} width="1200" height={img.h} loading={i === 0 ? "eager" : "lazy"} decoding="async"
              style={{ backgroundColor: img.bg }}
              className={`rounded-lg aspect-square object-contain border border-border ${["", "mt-8", "-mt-4", "mt-4"][i]}`} />
          ))}
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
      <Reveal><p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">What we do</p><h2 className="font-display font-extrabold text-4xl mb-12">Our focus areas.</h2></Reveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FOCUS.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.06} className="p-6 rounded-lg border border-border bg-card hover:border-brand transition-colors">
            <p.i className="w-7 h-7 text-brand mb-3" strokeWidth={1.6} /><h3 className="font-display font-bold">{p.t}</h3><p className="text-sm text-muted-foreground mt-2 leading-6">{p.d}</p>
          </Reveal>
        ))}
      </div>
    </section>

    <section className="bg-card/40 border-y border-border py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mb-3">Collaborate with us</p>
          <h2 className="font-display font-extrabold text-4xl">Who we'd like to hear from.</h2>
          <p className="text-muted-foreground mt-4 leading-7">As we grow, we're open to conversations with people who share our purpose. These are expressions of interest — not confirmed job openings.</p>
          <ul className="mt-6 space-y-3">{WHO.map((w) => <li key={w} className="flex gap-3 items-center"><span className="w-2 h-2 rounded-full bg-gradient-to-br from-brand to-brand-2" />{w}</li>)}</ul>
        </Reveal>
        <Reveal delay={0.1} className="grid sm:grid-cols-2 gap-4">
          {CULTURE.map((p) => (
            <div key={p.t} className="p-6 rounded-lg border border-border bg-card"><p.i className="w-7 h-7 text-brand mb-3" strokeWidth={1.6} /><h3 className="font-display font-bold">{p.t}</h3><p className="text-sm text-muted-foreground mt-2 leading-6">{p.d}</p></div>
          ))}
        </Reveal>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
      <Reveal dir="zoom" className="nx-cta p-10 md:p-14" data-testid="career-cta-card">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl max-w-2xl">Share an expression of interest.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl">Tell us about your background and how you'd like to collaborate. Choose "Other / General Inquiry" and start your message with "Careers".</p>
        <Link to="/contact" state={{ service: "Other / General Inquiry", message: "Careers — expression of interest: " }} data-testid="career-apply" className="nx-cta-btn mt-6">
          Send expression of interest <ArrowRight className="w-4 h-4" />
        </Link>
      </Reveal>
    </section>
  </div>
);

export default Career;
