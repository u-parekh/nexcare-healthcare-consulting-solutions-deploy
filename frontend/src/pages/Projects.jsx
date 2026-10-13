import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  { img: "https://images.pexels.com/photos/7250788/pexels-photo-7250788.jpeg", title: "Aurora Multispecialty", cat: "Multispecialty", meta: "40 beds • Pune, IN", year: "2025" },
  { img: "https://images.pexels.com/photos/14558558/pexels-photo-14558558.jpeg", title: "Helix Cardiac Centre", cat: "Specialty", year: "2025" },
  { img: "https://images.pexels.com/photos/8442514/pexels-photo-8442514.jpeg", title: "Meridian Cancer Institute", cat: "Specialty", meta: "30 beds", year: "2025" },
  { img: "https://images.pexels.com/photos/9574453/pexels-photo-9574453.jpeg", title: "Vesper Children's Hospital", cat: "Pediatric", meta: "15 beds ", year: "2025" },
  { img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80", title: "Northpoint General", cat: "Multispecialty", meta: "50 beds", year: "2026" },
  { img: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg", title: "Riverbend Wellness", cat: "Wellness", meta: "40 beds", year: "2026" },
  { img: "https://images.pexels.com/photos/34093126/pexels-photo-34093126.jpeg", title: "Synergy Eye Hospital", cat: "Specialty", meta: "50 beds", year: "2026" },
  { img: "https://images.pexels.com/photos/8460220/pexels-photo-8460220.jpeg", title: "Atlas Orthopaedic", cat: "Specialty", meta: "20 beds", year: "2026" },
];

const CATS = ["All", "Multispecialty", "Specialty", "Pediatric", "Wellness"];

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  return (
    <div data-testid="projects-page">
      <section className="relative py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Projects</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl leading-[1.02]">
            Too many successful briefs. <span className="text-brand">One craft.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">A selection of healthcare environments shaped through clinical insight, operational rigor and design discipline.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-wrap gap-2" data-testid="projects-filter">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              data-testid={`filter-${c.toLowerCase()}`}
              className={`px-4 py-2 rounded-md text-sm font-semibold border transition-colors ${
                filter === c
                  ? "bg-brand text-white border-brand"
                  : "bg-card border-border hover:border-brand"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="projects-grid">
        {list.map((p, i) => (
          <article key={p.title} className="group" data-testid={`project-${i}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-brand">{p.cat}</div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl">{p.title}</h3>
                  <p className="text-xs opacity-80 mt-1">{p.meta} • {p.year}</p>
                </div>
                <ArrowUpRight className="w-6 h-6 transition-transform group-hover:rotate-45"/>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Projects;
