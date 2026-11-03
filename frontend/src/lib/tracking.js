import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "./api";
import { CONSENT_EVENT, hasAnalyticsConsent } from "./consent";

const KEY = "nexcare-visitor";
const getId = () => {
  let id = localStorage.getItem(KEY);
  if (!id) { id = uuidv4(); localStorage.setItem(KEY, id); }
  return id;
};

// Records page views only after the visitor opts in to analytics cookies.
export const useVisitTracking = (path) => {
  const startRef = useRef(Date.now());
  const [enabled, setEnabled] = useState(hasAnalyticsConsent);

  useEffect(() => {
    const on = () => setEnabled(hasAnalyticsConsent());
    window.addEventListener(CONSENT_EVENT, on);
    return () => window.removeEventListener(CONSENT_EVENT, on);
  }, []);

  useEffect(() => {
    if (!enabled || path.startsWith("/admin")) return;
    const visitorId = getId();
    api.post("/track/visit", { visitor_id: visitorId, path, referrer: document.referrer.slice(0, 300) }).catch(() => {});
    startRef.current = Date.now();
    const flush = () => {
      const sec = Math.min(600, Math.round((Date.now() - startRef.current) / 1000));
      if (sec > 0) api.post("/track/heartbeat", { visitor_id: visitorId, path, seconds: sec }).catch(() => {});
      startRef.current = Date.now();
    };
    const interval = setInterval(flush, 30000);
    return () => { clearInterval(interval); flush(); };
  }, [path, enabled]);
};

export const trackBrochure = () => { if (hasAnalyticsConsent()) api.post("/track/brochure").catch(() => {}); };
