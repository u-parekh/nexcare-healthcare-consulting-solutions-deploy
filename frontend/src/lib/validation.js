const NAME_RE = /^[\p{L}\p{M}]+(?:[ .'-]+[\p{L}\p{M}]+)*\.?$/u;
const EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/;

export const normalize = {
  name: (v) => v.trim().replace(/\s+/g, " "),
  email: (v) => v.trim().toLowerCase(),
  phone: (v) => v.trim(),
  message: (v) => v.trim(),
};

export const validators = {
  name: (v) => {
    const s = normalize.name(v);
    if (!s) return "Full name is required.";
    if (s.length < 2 || s.length > 80) return "Name must be between 2 and 80 characters.";
    if (!NAME_RE.test(s)) return "Use letters only — no digits or special characters.";
    return "";
  },
  email: (v) => {
    const s = normalize.email(v);
    if (!s) return "Email address is required.";
    if (s.length > 254 || !EMAIL_RE.test(s)) return "Enter a valid email address, e.g. name@hospital.com.";
    return "";
  },
  phone: (v) => {
    const s = normalize.phone(v);
    if (!s) return "Phone number is required.";
    if (!/^\d{10}$/.test(s)) return "Enter exactly 10 digits, without spaces or country code.";
    return "";
  },
  service: (v, options) => (!v ? "Please select a service." : !options.includes(v) ? "Please select a valid service." : ""),
  message: (v) => {
    const s = normalize.message(v);
    if (!s) return "Message is required.";
    if ((s.match(/[\p{L}\p{N}]/gu) || []).length < 3) return "Message must contain at least 3 meaningful characters.";
    if (s.length > 2000) return "Message must be 2000 characters or fewer.";
    return "";
  },
};

export const apiError = (err, fallback = "Something went wrong. Please try again.") => {
  const d = err?.response?.data?.detail;
  if (!d) return fallback;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => (e?.msg || "").replace(/^Value error, /, "")).filter(Boolean).join(" ");
  return fallback;
};

// Maps FastAPI 422 errors to field-level messages
export const fieldErrors = (err) => {
  const d = err?.response?.data?.detail;
  const out = {};
  if (Array.isArray(d)) d.forEach((e) => { const k = e?.loc?.[1]; if (k) out[k] = (e.msg || "").replace(/^Value error, /, ""); });
  return out;
};
