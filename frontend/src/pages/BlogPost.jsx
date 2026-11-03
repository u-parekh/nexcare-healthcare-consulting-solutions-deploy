import { Fragment } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Quote } from "lucide-react";
import { POSTS, getPost } from "../data/blog";
import { getService } from "../data/services";
import Reveal from "../components/Reveal";
import Seo, { SITE_URL } from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";
import { fmtDate } from "./Blog";
import NotFound from "./NotFound";

// Renders [label](/path) as internal links.
const Rich = ({ text }) => text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
  const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  return m ? <Link key={i} to={m[2]}>{m[1]}</Link> : <Fragment key={i}>{part}</Fragment>;
});

const Block = ({ b }) => {
  if (b.h2) return <h2>{b.h2}</h2>;
  if (b.h3) return <h3>{b.h3}</h3>;
  if (b.ul) return <ul>{b.ul.map((li) => <li key={li}><Rich text={li} /></li>)}</ul>;
  if (b.quote) return (
    <blockquote className="relative my-8 p-6 rounded-lg border-l-4 border-brand-2 bg-gradient-to-r from-brand/10 to-brand-2/5 font-display text-xl leading-8">
      <Quote className="w-6 h-6 text-brand/40 mb-2" aria-hidden />{b.quote}
    </blockquote>
  );
  return <p><Rich text={b.p} /></p>;
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <NotFound />;
  const idx = POSTS.indexOf(post);
  const prev = POSTS[idx - 1];
  const next = POSTS[idx + 1];
  const relatedPosts = POSTS.filter((p) => p !== post).slice(0, 3);
  const crumbs = [{ to: "/", label: "Home" }, { to: "/blog", label: "Blog" }, { to: `/blog/${slug}`, label: post.title }];
  const ld = [breadcrumbLd(crumbs), {
    "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description,
    image: `${SITE_URL}${post.img}`, datePublished: post.date, dateModified: post.date,
    author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: "Nexcare Healthcare Consulting", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`, keywords: post.keywords.join(", "),
  }];

  return (
    <article className="overflow-x-hidden" data-testid="blog-post" key={slug}>
      <Seo title={post.seoTitle} description={post.description} path={`/blog/${slug}`} image={post.img} type="article" keywords={post.keywords} jsonLd={ld} />
      <meta property="article:published_time" content={post.date} />
      <header className="relative border-b border-border py-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-blob bg-brand w-[360px] h-[360px] -top-24 -left-20 opacity-25" />
        <div className="glow-blob bg-brand-2 w-[300px] h-[300px] bottom-0 right-0 opacity-20" />
        <div className="relative max-w-4xl mx-auto px-6">
          <Breadcrumbs items={crumbs} />
          <p className="text-xs uppercase tracking-widest text-brand-2 font-bold mt-8">{post.cat}</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl mt-3 leading-tight text-balance">{post.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-8">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>By {post.author}</span><time dateTime={post.date}>{fmtDate(post.date)}</time>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.read} read</span>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 -mb-4 mt-10">
        <Reveal dir="zoom" className="rounded-xl p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]">
          <img src={post.img} alt={post.imgAlt} width="1400" height="900" className="w-full max-h-[480px] object-cover rounded-[10px]" />
        </Reveal>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-14 prose-nx" data-testid="blog-content">
        {post.blocks.map((b, i) => <Block key={i} b={b} />)}
      </div>

      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display font-bold text-lg mb-4">Related NEXCARE services</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {post.related.map(getService).map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="p-4 rounded-lg border border-border hover:border-brand transition-colors text-sm font-semibold">{s.title}</Link>
            ))}
          </div>
        </div>
        <div className="nx-cta mt-8 p-8 text-center" data-testid="blog-cta-card">
          <h2 className="font-display font-extrabold text-2xl">Planning your next step?</h2>
          <p className="text-muted-foreground mt-2">Talk to NEXCARE about your hospital or clinic.</p>
          <Link to="/contact" data-testid="blog-cta" className="nx-cta-btn mt-5">Request a consultation <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <nav aria-label="Article navigation" className="mt-10 grid sm:grid-cols-2 gap-4">
          {prev ? <Link to={`/blog/${prev.slug}`} data-testid="blog-prev" className="p-5 rounded-lg border border-border hover:border-brand"><span className="text-xs text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Previous article</span><p className="font-semibold mt-1 text-sm">{prev.title}</p></Link> : <span />}
          {next && <Link to={`/blog/${next.slug}`} data-testid="blog-next" className="p-5 rounded-lg border border-border hover:border-brand sm:text-right"><span className="text-xs text-muted-foreground inline-flex items-center gap-1">Next article <ArrowRight className="w-3 h-3" /></span><p className="font-semibold mt-1 text-sm">{next.title}</p></Link>}
        </nav>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand"><ArrowLeft className="w-4 h-4" /> Back to all articles</Link>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <h2 className="font-display font-extrabold text-2xl mb-6">Related articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedPosts.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
              <img src={p.img} alt={p.imgAlt} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-lg border border-border" />
              <h3 className="font-display font-bold mt-3 group-hover:text-brand transition-colors">{p.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};

export default BlogPost;
