import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

// Google reCAPTCHA v2 "I'm not a robot" checkbox (explicit rendering, no extra dependency).
// Only the PUBLIC site key lives here; the secret key is read by the backend (RECAPTCHA_SECRET_KEY).
const SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
const WIDGET_WIDTH = 304; // fixed width of Google's checkbox widget
const WIDGET_HEIGHT = 78;

let loader;
const loadScript = () => {
  if (!SITE_KEY) return Promise.reject(new Error("missing-site-key"));
  if (window.grecaptcha?.render) return new Promise((resolve) => window.grecaptcha.ready(resolve));
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.onload = () => window.grecaptcha.ready(resolve);
      s.onerror = () => { loader = null; reject(new Error("load")); };
      document.head.appendChild(s);
    });
  }
  return loader;
};

export const Recaptcha = forwardRef(({ error, onChange }, ref) => {
  const { theme } = useTheme();
  const wrap = useRef(null);
  const host = useRef(null);
  const widgetId = useRef(null);
  const [loadError, setLoadError] = useState("");
  const [expired, setExpired] = useState(false);
  const [scale, setScale] = useState(1);

  // Render the checkbox. Re-created when the theme changes because Google fixes light/dark at render time.
  useEffect(() => {
    let cancelled = false;
    setLoadError("");
    loadScript().then(() => {
      const el = host.current;
      if (cancelled || !el || el.hasChildNodes()) return;
      widgetId.current = window.grecaptcha.render(el, {
        sitekey: SITE_KEY,
        theme: theme === "dark" ? "dark" : "light",
        callback: () => { setExpired(false); onChange?.(true); },
        "expired-callback": () => { setExpired(true); onChange?.(false); },
        "error-callback": () => setLoadError("Human verification hit a network problem. Please try again."),
      });
    }).catch((err) => {
      if (!cancelled) setLoadError(err?.message === "missing-site-key"
        ? "Human verification is not configured (REACT_APP_RECAPTCHA_SITE_KEY is missing)."
        : "Human verification could not load. Check your connection or disable blockers, then try again.");
    });
    return () => { cancelled = true; widgetId.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Shrink the fixed-width widget on narrow screens so it never overflows the form card.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / WIDGET_WIDTH) || 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    getToken: () => {
      try { return widgetId.current === null ? "" : window.grecaptcha.getResponse(widgetId.current) || ""; } catch { return ""; }
    },
    reset: () => {
      try { if (widgetId.current !== null) window.grecaptcha.reset(widgetId.current); } catch { /* widget not ready */ }
      setExpired(false);
    },
  }));

  const message = error || loadError || (expired ? "Verification expired. Please tick the checkbox again." : "");

  return (
    <div data-testid="captcha" className="text-xs text-muted-foreground leading-5">
      <p className="font-semibold uppercase tracking-wider mb-2">Human verification</p>
      <div ref={wrap} className="w-full max-w-[304px]" style={{ height: WIDGET_HEIGHT * scale }}>
        <div key={theme} ref={host} data-testid="captcha-widget" style={{ width: WIDGET_WIDTH, transform: `scale(${scale})`, transformOrigin: "0 0" }} />
      </div>
      {message && <p role="alert" className="mt-1 text-destructive" data-testid="captcha-error">{message}</p>}
    </div>
  );
});

// Current checkbox token ("" when the box has not been ticked or has expired).
export const getCaptchaToken = (ref) => ref.current?.getToken() || "";

export default Recaptcha;
