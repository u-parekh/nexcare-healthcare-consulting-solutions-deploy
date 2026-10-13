import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Phone, Send, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { submitContact, brochureURL, BROCHURE_FILENAME, trackBrochure } from "../lib/api";
import { SERVICE_OPTIONS } from "../data/services";
import { validators, normalize, apiError, fieldErrors } from "../lib/validation";
import FormField from "../components/FormField";
import Recaptcha, { getCaptchaToken } from "../components/Recaptcha";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";

const crumbs = [{ to: "/", label: "Home" }, { to: "/contact", label: "Contact" }];
const FIELDS = ["name", "email", "phone", "service", "message"];

const validate = (form) => {
  const e = {};
  FIELDS.forEach((k) => { const m = k === "service" ? validators.service(form[k], SERVICE_OPTIONS) : validators[k](form[k]); if (m) e[k] = m; });
  return e;
};

const Success = ({ result, onReset }) => (
  <div className="p-10 rounded-lg border border-brand/40 bg-card text-center" data-testid="contact-success" role="status">
    <CheckCircle2 className="w-14 h-14 text-brand-2 mx-auto mb-4" />
    <h2 className="font-display font-extrabold text-3xl">{result.duplicate ? "We already have this inquiry." : "Inquiry received."}</h2>
    <p className="text-muted-foreground mt-3">Your inquiry has been safely stored (ref. {result.id.slice(0, 8)}). Our team aims to respond within 1–2 business days.</p>
    {result.acknowledgement_email === "event_accepted" ? (
      <p className="mt-3 text-sm text-brand-2" data-testid="contact-email-requested">A confirmation email has been requested and should reach your inbox shortly. Please check your spam folder if you don't see it.</p>
    ) : (
      <p className="mt-3 text-sm text-muted-foreground inline-flex items-start gap-2" data-testid="contact-email-pending"><AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" /> We couldn't send a confirmation email right now — your inquiry is still with our team.</p>
    )}
    <div><button onClick={onReset} className="mt-6 px-5 py-2.5 rounded-md border border-border hover:border-brand text-sm font-semibold" data-testid="contact-send-another">Send another</button></div>
  </div>
);

const Contact = () => {
  const { state } = useLocation();
  const empty = { name: "", email: "", phone: "", service: SERVICE_OPTIONS.includes(state?.service) ? state.service : "", message: state?.message || "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [hp, setHp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState("");
  const capRef = useRef(null);

  const set = (k) => (e) => {
    const v = k === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };
  const blur = (k) => () => setErrors((er) => ({ ...er, [k]: validate(form)[k] || "" }));

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    const errs = validate(form);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) { document.getElementById(`cf-${Object.keys(errs)[0]}`)?.focus(); return; }
    setLoading(true);
    try {
      const captcha = getCaptchaToken(capRef);
      if (!captcha) { setErrors((er) => ({ ...er, captcha: "Please tick “I’m not a robot” before sending." })); return; }
      const payload = { name: normalize.name(form.name), email: normalize.email(form.email), phone: normalize.phone(form.phone), service: form.service, message: normalize.message(form.message), captcha_token: captcha, website: hp };
      setResult(await submitContact(payload));
      setForm(empty);
      capRef.current?.reset();
    } catch (err) {
      setErrors(fieldErrors(err));
      setFormError(apiError(err, "Submission failed. Please try again."));
      capRef.current?.reset(); // a v2 token is single-use, so the visitor ticks the box again
    } finally { setLoading(false); }
  };

  return (
    <div data-testid="contact-page">
      <Seo title="Contact Nexcare — Request a Healthcare Consultation" path="/contact" jsonLd={breadcrumbLd(crumbs)}
        description="Contact Nexcare for hospital planning, NABH preparation, MRD services, equipment planning or hospital website development. Email info@nexcareconsulting.com or call +91 9664662760." />
      <section className="relative py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="glow-blob bg-brand w-[480px] h-[480px] -top-32 left-1/4 opacity-30 animate-pulse-glow" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <Breadcrumbs items={crumbs} />
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold mt-8">Contact</p>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl mt-4 max-w-4xl leading-[1.02]">Tell us about your <span className="text-brand">project.</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-7">Share your brief — feasibility, design, accreditation or operations. Our team aims to respond within 1–2 business days.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <a href="mailto:info@nexcareconsulting.com" data-testid="contact-email-card" className="nx-cta block p-6">
            <Mail className="w-6 h-6 text-brand mb-3" /><p className="font-display font-bold">Email</p><p className="text-muted-foreground text-sm mt-1">info@nexcareconsulting.com</p>
          </a>
          <a href="tel:+919664662760" data-testid="contact-phone-card" className="nx-cta block p-6">
            <Phone className="w-6 h-6 text-brand mb-3" /><p className="font-display font-bold">Phone</p><p className="text-muted-foreground text-sm mt-1">+91 9664662760</p>
          </a>
          <a href={brochureURL} download={BROCHURE_FILENAME} onClick={trackBrochure} data-testid="contact-brochure" className="flex items-center gap-2 px-5 py-4 border-2 border-brand text-brand rounded-md font-semibold hover:bg-brand hover:text-white transition-colors w-fit">
            <Download className="w-4 h-4" /> Download Brochure
          </a>
        </div>

        <div className="lg:col-span-7">
          {result ? <Success result={result} onReset={() => setResult(null)} /> : (
            <form onSubmit={submit} noValidate className="p-6 sm:p-8 rounded-lg border border-border bg-card space-y-5" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-5">
                <FormField id="cf-name" label="Full name" error={errors.name} data-testid="cf-name" autoComplete="name" placeholder="John Doe" maxLength={80} value={form.name} onChange={set("name")} onBlur={blur("name")} />
                <FormField id="cf-email" label="Email address" type="email" error={errors.email} data-testid="cf-email" autoComplete="email" placeholder="john.doe@example.com" maxLength={254} value={form.email} onChange={set("email")} onBlur={blur("email")} />
                <FormField id="cf-phone" label="Phone number" type="tel" inputMode="numeric" error={errors.phone} data-testid="cf-phone" autoComplete="tel-national" placeholder="10-digit mobile no." value={form.phone} onChange={set("phone")} onBlur={blur("phone")} />
                <FormField id="cf-service" label="Service" as="select" error={errors.service} data-testid="cf-service" value={form.service} onChange={set("service")} onBlur={blur("service")}>
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </FormField>
              </div>
              <FormField id="cf-message" label="Message" as="textarea" rows={6} error={errors.message} data-testid="cf-message" maxLength={2000} placeholder="Tell us about your project, timeline and what you'd like help with…" value={form.message} onChange={set("message")} onBlur={blur("message")} />
              <div className="hidden" aria-hidden><label htmlFor="cf-website">Website</label><input id="cf-website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></div>
              <Recaptcha ref={capRef} error={errors.captcha || errors.captcha_token} onChange={(ok) => ok && setErrors((er) => ({ ...er, captcha: "" }))} />
              {formError && <p role="alert" className="text-sm text-destructive" data-testid="cf-form-error">{formError}</p>}
              <button type="submit" data-testid="cf-submit" disabled={loading} className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand text-white rounded-md font-semibold hover:translate-y-[-2px] transition-transform disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Sending…" : <>Send Message <Send className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
