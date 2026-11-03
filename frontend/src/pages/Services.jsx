import { Download } from "lucide-react";
import { brochureURL, BROCHURE_FILENAME, trackBrochure } from "../lib/api";
import { SERVICES } from "../data/services";
import ServiceCard from "../components/ServiceCard";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";

const crumbs = [{ to: "/", label: "Home" }, { to: "/services", label: "Services" }];

const Services = () => (
  <div data-testid="services-page">
    <Seo title="Healthcare Consulting Services in Gujarat & India" path="/services"
      description="Explore NEXCARE's services: MRD & medical record digitization, surgical & biomedical equipment and outsourced pharmacy, hospital website development, hospital planning & design, NABH quality support and more."
      jsonLd={breadcrumbLd(crumbs)} />
    <section className="relative py-24 border-b border-border overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="glow-blob bg-brand w-[460px] h-[460px] -top-32 right-1/4 opacity-30" />
      <div className="glow-blob bg-brand-2 w-[360px] h-[360px] bottom-0 -left-20 opacity-25" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <Breadcrumbs items={crumbs} />
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mt-8">Services</p>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl leading-[1.02] text-balance">
          End-to-end expertise across the <span className="text-brand">healthcare</span> value chain.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">
          Ten disciplines, one integrated team — bringing together clinical insight, hospital planning, records management and digital craft.
        </p>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="services-grid">
      {SERVICES.map((s, i) => <ServiceCard key={s.slug} s={s} i={i} index={String(i + 1).padStart(2, "0")} />)}
    </section>

    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
      <Reveal className="nx-cta p-10 md:p-14" data-testid="services-cta-card">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl max-w-xl">Get a complete capability brief.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl">Our brochure covers services, methodology and sectors.</p>
        <a href={brochureURL} download={BROCHURE_FILENAME} onClick={trackBrochure} data-testid="services-brochure" className="nx-cta-btn mt-6">
          <Download className="w-4 h-4" /> Download Brochure (PDF)
        </a>
      </Reveal>
    </section>
  </div>
);

export default Services;
