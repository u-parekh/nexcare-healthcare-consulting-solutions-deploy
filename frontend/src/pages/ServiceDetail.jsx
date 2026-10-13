import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Building } from "lucide-react";
import { SERVICES, getService } from "../data/services";
import Reveal from "../components/Reveal";
import Seo, { SITE_URL } from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";
import NotFound from "./NotFound";

const Section = ({ eyebrow, title, children, alt, testid }) => (
  <section className={`py-20 border-t border-border ${alt ? "bg-card/30" : ""}`} data-testid={testid}>
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">{eyebrow}</p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 mb-10">{title}</h2>
      </Reveal>
      {children}
    </div>
  </section>
);

const CheckGrid = ({ items }) => (
  <div className="grid sm:grid-cols-2 gap-5">
    {items.map((b, i) => (
      <Reveal key={b} delay={i * 0.06} className="flex items-start gap-3 p-5 rounded-lg border border-border bg-card">
        <CheckCircle2 className="w-5 h-5 text-brand-2 mt-0.5 shrink-0" />
        <p className="text-sm leading-6 text-foreground/90">{b}</p>
      </Reveal>
    ))}
  </div>
);

const ServiceDetail = () => {
  const { slug } = useParams();
  const data = getService(slug);
  if (!data) return <NotFound />;
  const Icon = data.icon;
  const idx = SERVICES.indexOf(data);
  const prev = SERVICES[(idx - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];
  const crumbs = [{ to: "/", label: "Home" }, { to: "/services", label: "Services" }, { to: `/services/${slug}`, label: data.title }];
  const ld = [breadcrumbLd(crumbs), {
    "@context": "https://schema.org", "@type": "Service", name: data.title, description: data.overview, serviceType: data.title,
    provider: { "@type": "Organization", name: "Nexcare Healthcare Consulting", url: SITE_URL }, areaServed: ["Gujarat", "India"],
  }];

  return (
    <div className="overflow-x-hidden" key={slug}>
      <Seo title={`${data.title} | Hospital Services`} description={`${data.tagline} ${data.short}`.slice(0, 160)}
        path={`/services/${slug}`} image={data.img} jsonLd={ld} />
      <section className="relative py-16 border-b border-border overflow-hidden" data-testid="service-hero">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-blob bg-brand w-[380px] h-[380px] -top-24 -left-24 opacity-30" />
        <div className="glow-blob bg-brand-2 w-[320px] h-[320px] -bottom-24 right-0 opacity-25" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Breadcrumbs items={crumbs} />
            <Reveal className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 border border-brand/30 mt-8 mb-6"><Icon className="w-8 h-8 text-brand" /></Reveal>
            <Reveal as="h1" delay={0.05} className="font-display font-extrabold text-3xl sm:text-5xl leading-tight text-balance">{data.title}</Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-7">{data.tagline}</Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" state={{ service: data.title }} data-testid="service-inquire" className="nx-cta-btn">Inquire about this service <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/services" data-testid="service-back" className="inline-flex items-center gap-2 px-6 py-3.5 border-2 border-border rounded-md font-semibold hover:border-brand hover:text-brand transition-colors"><ArrowLeft className="w-4 h-4" /> All services</Link>
            </Reveal>
          </div>
          <Reveal dir="right" className="rounded-xl p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
            <img src={data.img} alt={data.imgAlt} width="1200" height="800" className="w-full rounded-[10px] object-cover aspect-[4/3]" />
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Service Overview" title="What this service covers" testid="service-scope">
        <Reveal as="p" className="max-w-3xl -mt-4 mb-10 text-foreground/90 leading-8 text-lg">{data.overview}</Reveal>
        <CheckGrid items={data.scope} />
      </Section>
      <Section eyebrow="Key Benefits" title="Why it matters" alt testid="service-benefits"><CheckGrid items={data.benefits} /></Section>
      <Section eyebrow="Use Cases" title="Where it helps in healthcare" testid="service-usecases">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.useCases.map((u, i) => (
            <Reveal key={u} delay={i * 0.06} className="p-5 rounded-lg border border-border bg-card hover:border-brand transition-colors">
              <Building className="w-6 h-6 text-brand mb-3" /><p className="text-sm leading-6">{u}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section eyebrow="Process" title="How we deliver" alt testid="service-process">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.process.map((step, i) => (
            <Reveal key={step} delay={i * 0.1} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-brand to-brand-2 text-white grid place-items-center font-display font-bold">{i + 1}</div>
              <p className="mt-4 font-semibold">{step}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          {data.tech.map((t) => <span key={t} className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium">{t}</span>)}
        </div>
      </Section>
      <Section eyebrow="Related" title="Related services" testid="service-related">
        <div className="grid sm:grid-cols-3 gap-5">
          {data.related.map(getService).map((r) => (
            <Link key={r.slug} to={`/services/${r.slug}`} data-testid={`related-${r.slug}`} className="group p-5 rounded-lg border border-border bg-card hover:border-brand transition-colors">
              <r.icon className="w-6 h-6 text-brand mb-3" /><h3 className="font-display font-bold group-hover:text-brand transition-colors">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{r.short}</p>
            </Link>
          ))}
        </div>
        <nav aria-label="Service navigation" className="mt-12 grid sm:grid-cols-2 gap-4">
          <Link to={`/services/${prev.slug}`} data-testid="service-prev" className="p-5 rounded-lg border border-border hover:border-brand transition-colors"><span className="text-xs text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Previous service</span><p className="font-semibold mt-1">{prev.title}</p></Link>
          <Link to={`/services/${next.slug}`} data-testid="service-next" className="p-5 rounded-lg border border-border hover:border-brand transition-colors sm:text-right"><span className="text-xs text-muted-foreground inline-flex items-center gap-1">Next service <ArrowRight className="w-3 h-3" /></span><p className="font-semibold mt-1">{next.title}</p></Link>
        </nav>
      </Section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <Reveal dir="zoom" className="nx-cta p-10 md:p-16 text-center" data-testid="service-cta-card">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl">Ready to discuss {data.title}?</h2>
          <p className="mt-4 text-muted-foreground leading-7 max-w-xl mx-auto">Tell us about your facility — our team aims to respond within 1–2 business days.</p>
          <Link to="/contact" state={{ service: data.title }} data-testid="service-cta-contact" className="nx-cta-btn mt-8">Request Consultation <ArrowRight className="w-4 h-4" /></Link>
        </Reveal>
      </section>
    </div>
  );
};

export default ServiceDetail;
