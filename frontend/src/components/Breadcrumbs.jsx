import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "./Seo";

export const breadcrumbLd = (items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: `${SITE_URL}${it.to}` })),
});

export const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground" data-testid="breadcrumbs">
    <ol className="flex flex-wrap items-center gap-1.5">
      {items.map((it, i) => (
        <li key={it.to} className="inline-flex items-center gap-1.5">
          {i < items.length - 1 ? (
            <><Link to={it.to} className="hover:text-brand transition-colors">{it.label}</Link><ChevronRight className="w-3.5 h-3.5" aria-hidden /></>
          ) : (
            <span aria-current="page" className="text-foreground font-medium line-clamp-1">{it.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
