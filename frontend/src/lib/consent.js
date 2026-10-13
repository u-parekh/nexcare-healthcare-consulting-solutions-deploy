const KEY = "nexcare-consent";
export const CONSENT_EVENT = "nexcare-consent-change";
export const OPEN_PREFS_EVENT = "nexcare-open-cookie-prefs";

export const getConsent = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem("nexcare-cookies");
    if (legacy) return { essential: true, analytics: legacy === "accepted", ts: Date.now() };
  } catch { /* ignore */ }
  return null;
};

export const setConsent = (analytics) => {
  const val = { essential: true, analytics, ts: Date.now(), version: 1 };
  localStorage.setItem(KEY, JSON.stringify(val));
  localStorage.removeItem("nexcare-cookies");
  if (!analytics) localStorage.removeItem("nexcare-visitor");
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: val }));
  if (analytics && window.__nxLoadAnalytics) window.__nxLoadAnalytics();
};

export const hasAnalyticsConsent = () => !!getConsent()?.analytics;
