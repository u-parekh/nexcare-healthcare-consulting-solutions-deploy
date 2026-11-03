import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Switch } from "./ui/switch";
import { getConsent, setConsent, OPEN_PREFS_EVENT } from "../lib/consent";

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!getConsent()) setShow(true);
    const open = () => { setAnalytics(!!getConsent()?.analytics); setCustom(true); setShow(true); };
    window.addEventListener(OPEN_PREFS_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFS_EVENT, open);
  }, []);

  // Lift floating controls above the banner so they never overlap.
  useEffect(() => {
    const root = document.documentElement;
    if (!show || !ref.current) { root.style.setProperty("--cookie-h", "0px"); return; }
    const ro = new ResizeObserver(() => root.style.setProperty("--cookie-h", `${ref.current.offsetHeight + 32}px`));
    ro.observe(ref.current);
    return () => { ro.disconnect(); root.style.setProperty("--cookie-h", "0px"); };
  }, [show, custom]);

  const decide = (val) => { setConsent(val); setShow(false); setCustom(false); };
  if (!show) return null;

  return (
    <div ref={ref} role="dialog" aria-label="Cookie preferences" aria-live="polite"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[60] p-5 rounded-lg border border-border bg-card shadow-2xl backdrop-blur" data-testid="cookie-banner">
      <div className="flex items-start gap-3">
        <Cookie className="w-6 h-6 text-brand-2 shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1">
          <h2 className="font-display font-bold text-sm mb-1">Cookies & privacy</h2>
          <p className="text-xs text-muted-foreground leading-5">
            We use cookies to improve your browsing experience, analyze website traffic, and understand how visitors interact with our website. Read our{" "}
            <Link to="/privacy-policy" className="text-brand underline underline-offset-2" data-testid="cookie-privacy-link">Privacy Policy</Link>.
          </p>
          {custom && (
            <div className="mt-3 space-y-2 text-xs" data-testid="cookie-prefs">
              <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-accent/60">
                <span><strong>Essential</strong> — always on</span>
                <Switch checked disabled aria-label="Essential cookies (always on)" />
              </div>
              <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-accent/60">
                <label htmlFor="cookie-analytics"><strong>Analytics</strong> — page visits & device type</label>
                <Switch id="cookie-analytics" checked={analytics} onCheckedChange={setAnalytics} data-testid="cookie-analytics-toggle" />
              </div>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {custom ? (
              <button onClick={() => decide(analytics)} data-testid="cookie-save" className="px-4 py-2 bg-brand text-white rounded-md text-xs font-semibold hover:opacity-90">Save preferences</button>
            ) : (
              <>
                <button onClick={() => decide(true)} data-testid="cookie-accept" className="px-4 py-2 bg-brand text-white rounded-md text-xs font-semibold hover:opacity-90">Accept all</button>
                <button onClick={() => decide(false)} data-testid="cookie-decline" className="px-4 py-2 border border-border rounded-md text-xs font-semibold hover:border-brand">Essential only</button>
                <button onClick={() => setCustom(true)} data-testid="cookie-customize" className="px-4 py-2 text-xs font-semibold text-brand hover:underline">Customize</button>
              </>
            )}
          </div>
        </div>
        <button onClick={() => decide(!!getConsent()?.analytics)} aria-label="Close cookie banner (essential only)" data-testid="cookie-close" className="p-1 rounded hover:bg-accent"><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export default CookieBanner;
