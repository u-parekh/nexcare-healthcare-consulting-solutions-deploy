import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, Mail, Phone, Download } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { brochureURL, BROCHURE_FILENAME, trackBrochure } from "../lib/api";
import { OPEN_PREFS_EVENT } from "../lib/consent";

const Footer = () => (
  <footer className="relative mt-24 border-t border-border bg-card" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LogoMark className="h-9 w-auto"/>
        </div>
        <p className="text-sm text-muted-foreground leading-6 max-w-xs mb-4">
          Healthcare consulting and hospital planning partners — designing spaces that heal, operate and scale.
        </p>
        
        <a href={brochureURL} download={BROCHURE_FILENAME} onClick={trackBrochure} data-testid="footer-brochure" className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-brand text-brand rounded-md text-sm font-semibold hover:bg-brand hover:text-white transition-colors">
          <Download className="w-4 h-4"/> Download Brochure
        </a>
      </div>

      <div>
        <h2 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Company</h2>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[["/about","About"],["/about#vision","Our Vision"],["/services","Services"],/*["/projects","Projects"],*/["/blog","Blog"],["/career","Career"]].map(([h,l])=>(
            <li key={h}><Link className="hover:text-brand transition-colors" to={h}>{l}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Resources</h2>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[["/assessment","Take an Assessment"],["/contact","Contact"],["/privacy-policy","Privacy Policy"],["/sitemap","Sitemap"]].map(([h,l])=>(
            <li key={h}><Link className="hover:text-brand transition-colors" to={h} data-testid={`footer-link-${h.slice(1)}`}>{l}</Link></li>
          ))}
          <li><button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_PREFS_EVENT))} className="hover:text-brand transition-colors" data-testid="footer-cookie-prefs">Cookie preferences</button></li>
        </ul>
      </div>

      <div>
        <h2 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Contact</h2>
        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
          <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-brand"/> <a href="mailto:info@nexcareconsulting.com" className="hover:text-brand">info@nexcareconsulting.com</a></li>
          <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-brand"/> <a href="tel:+919664662760" className="hover:text-brand">+91 9664662760</a></li>
        </ul>
        <div className="flex gap-3">
          {[
            { i: Linkedin, h: "https://linkedin.com", k: "linkedin" },
            { i: Instagram, h: "https://www.instagram.com/nexcare_04healthcaresolution?igsh=MWNzZjZ0ZnB3N3M4dg%3D%3D&utm_source=qr", k: "instagram" },
            { i: Facebook, h: "https://facebook.com", k: "facebook" },
          ].map(({ i: Ic, h, k }) => (
            <a key={k} href={h} target="_blank" rel="noreferrer" data-testid={`social-${k}`} aria-label={k}
               className="grid place-items-center w-9 h-9 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-brand hover:border-brand transition-colors">
              <Ic className="w-4 h-4"/>
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} NEXCARE Healthcare Consulting Solutions. All rights reserved.</p>
        <p className="font-display tracking-widest">DESIGN • DEVELOPMENT • MAINTENANCE BY <a href="https://umang-parekh.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-brand" color="brand" >UMANG</a></p>
      </div>
    </div>
  </footer>
);

export default Footer;
