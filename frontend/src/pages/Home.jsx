import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, ChevronRight, ChevronDown } from "lucide-react";
import HeroParticles from "../components/HeroParticles";
import AutoCarousel from "../components/AutoCarousel";
import HeroCenterpiece from "../components/home/HeroCenterpiece";
import HowWeWork from "../components/home/HowWeWork";
import Testimonials from "../components/home/Testimonials";
import FAQSection, { faqLd } from "../components/home/FAQSection";
import WhyChooseNexcare from "../components/home/WhyChooseNexcare";
import ServiceCard from "../components/ServiceCard";
import Reveal from "../components/Reveal";
import Seo, { SITE_URL } from "../components/Seo";
import { SERVICES } from "../data/services";
import { brochureURL, BROCHURE_FILENAME, trackBrochure } from "../lib/api";

const PROJECTS = [
  { img: "https://images.pexels.com/photos/7250788/pexels-photo-7250788.jpeg?auto=compress&cs=tinysrgb&w=900", title: "Aurora Multispecialty", category: "Hospital Planning", meta: "40 beds", desc: "A phased master plan for a 40-bed tertiary care network designed around staff flow and patient recovery." },
  { img: "https://images.pexels.com/photos/14558558/pexels-photo-14558558.jpeg?auto=compress&cs=tinysrgb&w=900", title: "Helix Cardiac Centre", category: "Healthcare Consulting", desc: "Clinical operations and accreditation strategy for a highly specialized cardiac institute in the GCC." },
  { img: "https://images.pexels.com/photos/8442514/pexels-photo-8442514.jpeg?auto=compress&cs=tinysrgb&w=900", title: "Meridian Cancer Institute", category: "Quality Assurance", desc: "A quality-led commissioning roadmap for a cancer-focused facility with advanced digital workflows." },
  { img: "https://images.pexels.com/photos/9574453/pexels-photo-9574453.jpeg?auto=compress&cs=tinysrgb&w=900", title: "Vesper Children's Hospital", category: "Software & HMS", desc: "A pediatric care environment shaped around family experience, infection control and smart operations." },
];

const HOME_SERVICE_COUNT = 5;

const homeLd = [
  { "@context": "https://schema.org", "@type": "WebSite", name: "Nexcare Healthcare Consulting Solutions", url: SITE_URL },
  faqLd,
];

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden" data-testid="hero">
    <div className="absolute inset-0 grid-pattern opacity-40 dark:opacity-20" />
    <HeroParticles />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,144,226,0.28),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(63,181,73,0.28),transparent_38%)]" />
    <div className="glow-blob bg-brand w-[420px] h-[420px] -top-24 -left-24 opacity-40 hero-pulse" />
    <div className="glow-blob bg-brand-2 w-[380px] h-[380px] bottom-0 right-0 opacity-35 hero-pulse [animation-delay:2s]" />

    <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-16 pb-28 lg:py-20 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand/20 bg-white/70 dark:bg-background/60 backdrop-blur text-brand-2 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6BCB3D] animate-pulse" />
          Healthcare Consulting • Hospital Planning & Design
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-[1.02] mt-2 text-balance">
          Shaping the <span className="text-brand-2">Future</span> of Healthcare
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-xl leading-7">
          NEXCARE is a healthcare consulting partner that helps hospitals and clinics across India with hospital planning, NABH preparation, medical record digitization and digital transformation.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/assessment" data-testid="hero-cta-assess" className="group inline-flex items-center gap-2 px-6 py-3.5 bg-brand-2 text-white font-semibold rounded-md hover:translate-y-[-2px] hover:shadow-[0_12px_28px_-8px_rgba(63,181,73,0.6)] transition-all">
            Take an Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" data-testid="hero-cta-start" className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand text-white font-semibold rounded-md hover:translate-y-[-2px] hover:shadow-[0_12px_28px_-8px_hsl(var(--brand)/0.6)] transition-all">
            Start a Project <ArrowRight className="w-4 h-4" />
          </Link>
          <a href={brochureURL} download={BROCHURE_FILENAME} onClick={trackBrochure} data-testid="hero-brochure" className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-border bg-card/70 backdrop-blur rounded-md font-semibold hover:border-brand hover:text-brand transition-colors">
            <Download className="w-4 h-4" /> Download Brochure
          </a>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="lg:col-span-5 w-full flex justify-center">
        <HeroCenterpiece />
      </motion.div>
    </div>
    <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none" aria-hidden data-testid="hero-scroll-indicator">
      <div className="flex flex-col items-center gap-1.5 motion-safe:animate-bounce opacity-50">
        <span className="text-[10px] uppercase tracking-[.2em] text-foreground/50">Scroll</span>
        <ChevronDown className="w-4 h-4 text-foreground/50" />
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24" data-testid="services-section">
    <Reveal className="mb-12">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 01 — Our Services</p>
      <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 max-w-2xl">Featured services from our healthcare company.</h2>
    </Reveal>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.slice(0, HOME_SERVICE_COUNT).map((s, i) => <ServiceCard key={s.slug} s={s} i={i} index={s.isNew ? "New" : undefined} />)}
    </div>
    <Reveal className="mt-12 flex justify-center">
      <Link to="/services" data-testid="explore-services" className="nx-cta-btn">
        Explore All Services <ChevronRight className="w-4 h-4" />
      </Link>
    </Reveal>
  </section>
);

/*const ProjectsReel = () => (
  <section className="py-24 border-t border-border" data-testid="reel-projects">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">/ 03 — Recent work</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 max-w-2xl">Hospitals as instruments of healing.</h2>
      </Reveal>
    </div>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <AutoCarousel delay={4000}>
        {PROJECTS.map((p) => (
          <Link to="/projects" key={p.title} className="group shrink-0 basis-[85%] sm:basis-[55%] lg:basis-[32%] px-2">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border bg-card/80 shadow-sm">
              <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs uppercase tracking-widest text-brand-2 mb-1">{p.category}</p>
                <h3 className="font-display font-bold text-2xl">{p.title}</h3>
                <p className="text-sm opacity-80 mt-1">{p.meta}</p>
                <p className="text-sm text-white/70 mt-2 leading-6">{p.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </AutoCarousel>
    </div>
  </section>
);*/

const Home = () => (
  <div className="overflow-x-hidden">
    <Seo title="Nexcare Healthcare Consulting & Hospital Planning in Gujarat, India"
      description="Nexcare offers healthcare consulting, hospital planning and design, NABH preparation support, medical record digitization, MRD services and hospital website development across Gujarat and India."
      path="/" jsonLd={homeLd} />
    <Hero />
    <ServicesSection />
    <WhyChooseNexcare />
    <HowWeWork />
   {/* <ProjectsReel />*/}
    <Testimonials />
    <FAQSection />
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
      <Reveal dir="zoom" className="nx-cta p-10 md:p-16" data-testid="home-cta-card">
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display font-extrabold text-4xl">Have a brief? Let's plan it together.</h2>
            <p className="mt-4 text-muted-foreground leading-7">Tell us about your project — our team aims to respond within 1–2 business days.</p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/contact" data-testid="home-cta-contact" className="nx-cta-btn">
              Start a Conversation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
);

export default Home;
