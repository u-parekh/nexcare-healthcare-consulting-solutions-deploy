import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { POSTS, UPCOMING_TOPICS } from "../data/blog";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";

const PER_PAGE = 6;
const crumbs = [{ to: "/", label: "Home" }, { to: "/blog", label: "Blog" }];
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const Card = ({ p, i }) => (
  <Reveal delay={(i % 3) * 0.08}>
    <Link to={`/blog/${p.slug}`} className="group block" data-testid={`blog-card-${p.slug}`}>
      <div className="aspect-[4/3] overflow-hidden rounded-lg p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
        <img src={p.img} alt={p.imgAlt} loading="lazy" className="w-full h-full rounded-[7px] object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <p className="text-xs uppercase tracking-widest text-brand-2 font-bold mt-4">{p.cat}</p>
      <h2 className="font-display font-bold text-xl mt-2 group-hover:text-brand transition-colors">{p.title}</h2>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <time dateTime={p.date}>{fmtDate(p.date)}</time><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.read}</span>
      </div>
    </Link>
  </Reveal>
);

const Blog = () => {
  const [page, setPage] = useState(1);
  const feat = POSTS.find((p) => p.featured);
  const rest = POSTS.filter((p) => p !== feat);
  const pages = Math.max(1, Math.ceil(rest.length / PER_PAGE));
  const visible = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div data-testid="blog-page">
      <Seo title="Healthcare Insights: Hospital Planning, NABH & Digital Health Blog" path="/blog" jsonLd={breadcrumbLd(crumbs)}
        description="Practical articles on hospital planning and design, NABH accreditation, medical record digitization and hospital digital transformation from NEXCARE." />
      <section className="relative border-b border-border py-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-blob bg-brand w-[380px] h-[380px] -top-24 right-10 opacity-25" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <Breadcrumbs items={crumbs} />
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mt-8">Insights</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl mt-4 max-w-3xl leading-[1.02]">Field notes from a Nexcare.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-7">Practical thinking on hospital planning, design quality, accreditation readiness and the future of care delivery.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <Reveal>
          <Link to={`/blog/${feat.slug}`} className="grid lg:grid-cols-12 gap-8 group" data-testid="blog-featured">
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-lg p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
              <img src={feat.img} alt={feat.imgAlt} className="w-full h-full rounded-[7px] object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-brand-2 font-bold">{feat.cat} • Featured</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-4 group-hover:text-brand transition-colors">{feat.title}</h2>
              <p className="text-muted-foreground mt-4 leading-7">{feat.excerpt}</p>
              <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                <time dateTime={feat.date}>{fmtDate(feat.date)}</time><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {feat.read}</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-brand font-semibold w-fit">Read article <ArrowRight className="w-4 h-4" /></span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((p, i) => <Card key={p.slug} p={p} i={i} />)}
      </section>
      {pages > 1 && (
        <nav aria-label="Blog pagination" className="max-w-7xl mx-auto px-6 lg:px-10 pb-12 flex justify-center gap-2" data-testid="blog-pagination">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? "page" : undefined}
              className={`w-10 h-10 rounded-md border ${page === i + 1 ? "bg-brand text-white border-brand" : "border-border hover:border-brand"}`}>{i + 1}</button>
          ))}
        </nav>
      )}

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="rounded-lg border border-dashed border-border p-6">
          <h2 className="font-display font-bold text-lg">Upcoming topics</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{UPCOMING_TOPICS.map((t) => <li key={t} className="px-3 py-1.5 rounded-full bg-accent text-sm text-muted-foreground">{t}</li>)}</ul>
        </div>
      </section>
    </div>
  );
};

export default Blog;
