import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { LogoMark } from "./LogoMark";
import { SERVICES as SERVICE_DATA } from "../data/services";

const SERVICES = SERVICE_DATA.map((s) => ({ slug: s.slug, label: s.title }));

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  /*{ to: "/projects", label: "Projects" },*/
  { to: "/blog", label: "Blog" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const navigate = useNavigate();

  const goService = (slug) => {
    setOpen(false); setServicesOpen(false); setMobileServicesOpen(false);
    navigate(`/services/${slug}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link" onClick={() => window.scrollTo({ top: 0 })}>
          <LogoMark className="h-9 w-auto"/>
        </Link>
        <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
          <NavLink to="/" data-testid="nav-home"
            className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "text-brand bg-accent" : "text-foreground/70 hover:text-foreground hover:bg-accent/60"}`}>
            Home
          </NavLink>

          {/* Services dropdown — hover on desktop */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            data-testid="nav-services-wrap"
          >
            <button
              className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-foreground/70 hover:text-foreground hover:bg-accent/60 inline-flex items-center gap-1"
              data-testid="nav-services"
              onClick={() => navigate("/services")}
              onFocus={() => setServicesOpen(true)}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}/>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full pt-2 w-80" data-testid="services-dropdown">
                <div className="rounded-lg border border-border bg-card shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto" onBlur={(e) => { if (!e.currentTarget.parentElement.parentElement.contains(e.relatedTarget)) setServicesOpen(false); }}>
                  {SERVICES.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => goService(s.slug)}
                      data-testid={`dropdown-${s.slug}`}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-accent hover:text-brand transition-colors border-b border-border/60 last:border-b-0"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {NAV.filter((n) => n.to !== "/").map((n) => (
            <NavLink key={n.to} to={n.to} data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) => `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "text-brand bg-accent" : "text-foreground/70 hover:text-foreground hover:bg-accent/60"}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} data-testid="theme-toggle" aria-label="toggle theme" className="p-2 rounded-md hover:bg-accent transition-colors">
            {theme === "dark" ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          </button>
          <Link to="/assessment" data-testid="nav-cta" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand-2 text-white text-sm font-semibold hover:translate-y-[-1px] transition-all">
            Take an Assessment
          </Link>
          <button className="lg:hidden p-2 rounded-md hover:bg-accent" onClick={() => setOpen(!open)} data-testid="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 max-h-[calc(100vh-4rem)] overflow-y-auto" data-testid="mobile-menu">
          <div className="px-6 py-3 flex flex-col">
            <NavLink to="/" onClick={() => setOpen(false)} data-testid="mnav-home"
              className={({ isActive }) => `px-2 py-3 text-sm border-b border-border/60 ${isActive ? "text-brand" : "text-foreground/80"}`}>
              Home
            </NavLink>

            {/* Mobile Services accordion */}
            <button
              className="px-2 py-3 text-sm border-b border-border/60 text-foreground/80 flex items-center justify-between"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              data-testid="mnav-services-toggle"
            >
              Services <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}/>
            </button>
            {mobileServicesOpen && (
              <div className="pl-3 flex flex-col" data-testid="mobile-services-accordion">
                {SERVICES.map((s) => (
                  <button key={s.slug} onClick={() => goService(s.slug)} data-testid={`mdropdown-${s.slug}`}
                    className="text-left px-2 py-2.5 text-sm text-muted-foreground hover:text-brand border-b border-border/40 last:border-b-0">
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {NAV.filter((n) => n.to !== "/").map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} data-testid={`mnav-${n.label.toLowerCase()}`}
                className={({ isActive }) => `px-2 py-3 text-sm border-b border-border/60 ${isActive ? "text-brand" : "text-foreground/80"}`}>
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
