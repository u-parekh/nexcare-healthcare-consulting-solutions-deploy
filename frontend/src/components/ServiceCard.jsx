import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

// Service card with blue→green gradient border; used on Home and Services.
export const ServiceCard = ({ s, i = 0, index }) => (
  <Reveal delay={(i % 3) * 0.08} className="h-full">
    <Link to={`/services/${s.slug}`} data-testid={`svc-card-${s.slug}`}
      className="group block h-full rounded-xl p-[1.5px] bg-gradient-to-br from-[hsl(var(--brand))] via-[hsl(var(--brand)/0.35)] to-[hsl(var(--brand-2))] hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_hsl(var(--brand)/0.6)] transition-[transform,box-shadow] duration-300">
      <div className="h-full flex flex-col rounded-[10px] bg-card overflow-hidden">
        <div className="relative h-44 overflow-hidden">
          <img src={s.img} alt={s.imgAlt} loading="lazy" width="1200" height="800"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          {index && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-brand to-brand-2 text-white text-[11px] font-bold">{index}</span>}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <s.icon className="w-7 h-7 text-brand mb-3" strokeWidth={1.6} />
          <h3 className="font-display font-bold text-lg mb-2 leading-snug">{s.title}</h3>
          <p className="text-sm text-muted-foreground leading-6 flex-1">{s.short}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:text-brand-2 transition-colors">
            Explore Service <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  </Reveal>
);

export default ServiceCard;
