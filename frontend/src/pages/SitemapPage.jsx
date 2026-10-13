import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";
import { POSTS } from "../data/blog";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";

const crumbs = [{ to: "/", label: "Home" }, { to: "/sitemap", label: "Sitemap" }];
const GROUPS = [
  ["Main pages", [["/", "Home"], ["/about", "About & Vision"], ["/services", "Services"], ["/projects", "Projects"], ["/blog", "Blog"], ["/career", "Careers"], ["/assessment", "Assessment"], ["/contact", "Contact"]]],
  ["Services", SERVICES.map((s) => [`/services/${s.slug}`, s.title])],
  ["Blog articles", POSTS.map((p) => [`/blog/${p.slug}`, p.title])],
  ["Legal", [["/privacy-policy", "Privacy Policy"]]],
];

const SitemapPage = () => (
  <div data-testid="sitemap-page">
    <Seo title="Sitemap" path="/sitemap" description="All public pages on the NEXCARE website: services, blog articles, careers, assessment, contact and privacy policy." jsonLd={breadcrumbLd(crumbs)} />
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <Breadcrumbs items={crumbs} />
      <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-8">Sitemap</h1>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {GROUPS.map(([title, links]) => (
          <div key={title}>
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-brand-2 mb-4">{title}</h2>
            <ul className="space-y-2 text-sm">{links.map(([to, l]) => <li key={to}><Link to={to} className="hover:text-brand transition-colors">{l}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mt-12 text-sm text-muted-foreground">
        Contact: <a className="text-brand" href="mailto:info@nexcareconsulting.com">info@nexcareconsulting.com</a> · +91 9664662760 · <a className="text-brand" href="/sitemap.xml">XML sitemap</a>
      </div>
    </section>
  </div>
);

export default SitemapPage;
