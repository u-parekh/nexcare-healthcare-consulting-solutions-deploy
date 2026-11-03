import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { startAssessment, completeAssessment } from "../lib/api";
import { getService } from "../data/services";
import { validators, normalize, apiError, fieldErrors } from "../lib/validation";
import FormField from "../components/FormField";
import Recaptcha, { getCaptchaToken } from "../components/Recaptcha";
import Seo from "../components/Seo";

const Q = [
  { q: "What stage is your hospital project in?", opts: [{ l: "Idea / Feasibility", w: ["feasibility-business-analytics", "healthcare-consulting"] }, { l: "Design & approvals", w: ["hospital-planning-design", "surgical-biomedical-pharmacy"] }, { l: "Operating", w: ["quality-assurance", "maintenance-it"] }, { l: "Expansion / Upgrade", w: ["feasibility-business-analytics", "hospital-planning-design"] }] },
  { q: "Top operational pain right now?", opts: [{ l: "Patient flow & layout", w: ["hospital-planning-design"] }, { l: "EMR / Software inefficiency", w: ["software-hms-guidance"] }, { l: "Quality / Audits", w: ["quality-assurance"] }, { l: "Records hard to find", w: ["mrd-digitization"] }] },
  { q: "Are you accredited (NABH / JCI / similar)?", opts: [{ l: "Yes — maintaining", w: ["quality-assurance"] }, { l: "In progress", w: ["quality-assurance", "mrd-digitization"] }, { l: "Planning to start", w: ["healthcare-consulting", "quality-assurance"] }, { l: "Not on roadmap", w: ["healthcare-consulting"] }] },
  { q: "How are your medical records managed?", opts: [{ l: "Fully digital & indexed", w: ["software-hms-guidance"] }, { l: "Mix of paper and digital", w: ["mrd-digitization"] }, { l: "Mostly paper files", w: ["mrd-digitization", "server-data-planning"] }, { l: "No dedicated MRD", w: ["mrd-digitization", "healthcare-consulting"] }] },
  { q: "How would you rate your hospital website?", opts: [{ l: "Modern and effective", w: ["software-hms-guidance"] }, { l: "Outdated", w: ["hospital-website-digital"] }, { l: "No website yet", w: ["hospital-website-digital"] }, { l: "Not sure", w: ["hospital-website-digital", "healthcare-consulting"] }] },
  { q: "Have you done a financial feasibility / DPR?", opts: [{ l: "Yes — recent", w: ["healthcare-consulting"] }, { l: "Outdated", w: ["feasibility-business-analytics"] }, { l: "Never done", w: ["feasibility-business-analytics"] }, { l: "In progress", w: ["feasibility-business-analytics", "healthcare-consulting"] }] },
  { q: "Bed strength of the facility?", opts: [{ l: "<100", w: ["hospital-planning-design", "healthcare-consulting"] }, { l: "100–300", w: ["hospital-planning-design", "quality-assurance"] }, { l: "300–600", w: ["server-data-planning", "quality-assurance"] }, { l: "600+", w: ["server-data-planning", "software-hms-guidance"] }] },
  { q: "Biggest infrastructure concern?", opts: [{ l: "Equipment & OT readiness", w: ["surgical-biomedical-pharmacy"] }, { l: "Server / Network", w: ["server-data-planning"] }, { l: "Building condition", w: ["hospital-planning-design"] }, { l: "Power & HVAC reliability", w: ["maintenance-it"] }] },
  { q: "How is your pharmacy run?", opts: [{ l: "In-house, running well", w: ["quality-assurance"] }, { l: "In-house, stock issues", w: ["surgical-biomedical-pharmacy"] }, { l: "Considering outsourcing", w: ["surgical-biomedical-pharmacy"] }, { l: "No pharmacy yet", w: ["surgical-biomedical-pharmacy", "hospital-planning-design"] }] },
  { q: "Strategic priority for next 12 months?", opts: [{ l: "Expand capacity", w: ["hospital-planning-design", "feasibility-business-analytics"] }, { l: "Operational excellence", w: ["healthcare-consulting", "quality-assurance"] }, { l: "Digital transformation", w: ["hospital-website-digital", "software-hms-guidance"] }, { l: "Cost optimisation", w: ["feasibility-business-analytics", "maintenance-it"] }] },
];
const STORE = "nexcare-assessment";
const fresh = () => ({ step: 0, answers: [], ref: uuidv4(), session: null, info: { name: "", email: "", phone: "" } });
const toItems = (ans) => ans.map((oi, qi) => ({ question: Q[qi].q, answer: Q[qi].opts[oi].l }));

const score = (answers) => {
  const map = {};
  answers.forEach((oi, qi) => Q[qi].opts[oi].w.forEach((s) => { map[s] = (map[s] || 0) + 1; }));
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return { map, recommended: sorted.slice(0, 3).map(([s]) => s) };
};

const InfoForm = ({ st, setSt, onBack }) => {
  const [info, setInfo] = useState(st.info);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const capRef = useRef(null);
  const set = (k) => (e) => { setInfo({ ...info, [k]: k === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value }); setErrors({ ...errors, [k]: "" }); };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const errs = {};
    ['name', 'email', 'phone'].forEach((k) => { const m = validators[k](info[k]); if (m) errs[k] = m; });
    setErrors(errs); setFormError("");
    if (Object.keys(errs).length) return;
    setBusy(true);
    const clean = { name: normalize.name(info.name), email: normalize.email(info.email), phone: normalize.phone(info.phone) };
    try {
      const captcha = getCaptchaToken(capRef);
      if (!captcha) { setErrors((er) => ({ ...er, captcha: "Please tick “I’m not a robot” before continuing." })); return; }
      const res = await startAssessment({ ...clean, client_ref: st.ref, answers: toItems(st.answers.slice(0, 5)), captcha_token: captcha });
      setSt({ ...st, info: clean, session: res, step: 5 });
    } catch (err) {
      setErrors(fieldErrors(err)); setFormError(apiError(err)); setInfo({ ...info, ...clean });
      capRef.current?.reset(); // a v2 token is single-use
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-6 py-20">
      <form onSubmit={submit} noValidate className="w-full max-w-md p-6 sm:p-8 rounded-lg border border-border bg-card relative overflow-hidden" data-testid="quiz-info-form">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-2/20 blur-3xl rounded-full" />
        <Sparkles className="w-7 h-7 text-brand-2 mb-3" />
        <h1 className="font-display font-extrabold text-2xl">Halfway there — quick details.</h1>
        <p className="text-sm text-muted-foreground mt-2 mb-6">Your first five answers are saved. Share your details to continue and receive your personalised scorecard.</p>
        <div className="space-y-4 relative">
          <FormField id="qf-name" label="Full name" error={errors.name} data-testid="qf-name" autoComplete="name" placeholder="John Doe" maxLength={80} value={info.name} onChange={set("name")} />
          <FormField id="qf-email" label="Email address" type="email" error={errors.email} data-testid="qf-email" autoComplete="email" placeholder="john.doe@example.com" value={info.email} onChange={set("email")} />
          <FormField id="qf-phone" label="Phone number" type="tel" inputMode="numeric" error={errors.phone} data-testid="qf-phone" autoComplete="tel-national" placeholder="10-digit mobile no." value={info.phone} onChange={set("phone")} />
          <Recaptcha ref={capRef} error={errors.captcha || errors.captcha_token} onChange={(ok) => ok && setErrors((er) => ({ ...er, captcha: "" }))} />
        </div>
        {formError && <p role="alert" className="mt-3 text-sm text-destructive" data-testid="qf-error">{formError}</p>}
        <button data-testid="qf-continue" disabled={busy} className="mt-6 w-full py-3 rounded-md bg-brand-2 text-white font-semibold disabled:opacity-60">{busy ? "Saving…" : "Continue assessment"}</button>
        <button type="button" onClick={onBack} data-testid="qf-back" className="mt-3 w-full py-2 text-sm text-muted-foreground hover:text-brand inline-flex items-center justify-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to question 5</button>
      </form>
    </div>
  );
};

const Result = ({ st, onReset }) => {
  const { recommended, map } = score(st.answers);
  return (
    <div className="min-h-[80vh] py-20 px-6" data-testid="quiz-result">
      <div className="max-w-3xl mx-auto">
        <CheckCircle2 className="w-16 h-16 text-brand-2 mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Your Scorecard</p>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-3">Recommended for {st.info.name.split(" ")[0]}.</h1>
        <p className="mt-4 text-muted-foreground max-w-xl leading-7">Your assessment has been saved. Based on your answers, these NEXCARE services are most relevant to your organisation.</p>
        <div className="mt-10 grid gap-4">
          {recommended.map((slug, i) => (
            <Link to={`/services/${slug}`} key={slug} data-testid={`rec-${i}`} className="group p-6 rounded-lg border border-border bg-card hover:border-brand transition-colors flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-2 font-bold">Recommendation {i + 1}</p>
                <h2 className="font-display font-bold text-2xl mt-1">{getService(slug)?.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">Match score: {map[slug]} / {Q.length}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-brand group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <button onClick={onReset} data-testid="quiz-retry" className="inline-flex items-center gap-2 px-5 py-3 border border-border rounded-md font-semibold text-sm hover:border-brand"><RotateCcw className="w-4 h-4" /> Retake</button>
          <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-3 bg-brand text-white rounded-md font-semibold text-sm">Talk to us <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
};

const Quiz = () => {
  const [st, setSt] = useState(() => { try { return JSON.parse(sessionStorage.getItem(STORE)) || fresh(); } catch { return fresh(); } });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { sessionStorage.setItem(STORE, JSON.stringify(st)); }, [st]);

  const finish = async (answers) => {
    setSaving(true); setError("");
    try {
      await completeAssessment(st.session.id, { token: st.session.token, answers: toItems(answers), recommended: score(answers).recommended });
      setSt({ ...st, answers, done: true });
    } catch (err) {
      if (err?.response?.status === 409) setSt({ ...st, answers, done: true });
      else { setError(apiError(err, "We couldn't save your answers. Please try again.")); setSt({ ...st, answers }); }
    } finally { setSaving(false); }
  };

  const choose = (oi) => {
    if (saving) return;
    const answers = [...st.answers.slice(0, st.step), oi, ...st.answers.slice(st.step + 1)];
    if (st.step === 4 && !st.session) return setSt({ ...st, answers, step: "info" });
    if (st.step === Q.length - 1) return finish(answers);
    setSt({ ...st, answers, step: st.step + 1 });
  };
  const back = () => setSt({ ...st, step: st.step === "info" ? 4 : Math.max(st.session ? 5 : 0, st.step - 1) });
  const reset = () => setSt(fresh());

  if (st.done) return <Result st={st} onReset={reset} />;
  if (st.step === "info") return <InfoForm st={st} setSt={setSt} onBack={back} />;
  const cur = Q[st.step];
  const canBack = st.step > (st.session ? 5 : 0);

  return (
    <div className="min-h-[80vh] py-16 px-6" data-testid="quiz-page">
      <Seo title="Free Hospital Readiness Assessment" path="/assessment" description="Answer 10 quick questions to find the NEXCARE services best suited to your hospital or clinic — planning, NABH, MRD, equipment and digital." />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-2 font-bold">Assessment</p>
          <p className="text-sm text-muted-foreground" data-testid="quiz-progress">Question {st.step + 1} of {Q.length}</p>
        </div>
        <div className="h-1.5 bg-accent rounded-full overflow-hidden mb-10" role="progressbar" aria-valuemin={1} aria-valuemax={Q.length} aria-valuenow={st.step + 1}>
          <div className="h-full bg-gradient-to-r from-brand to-brand-2 transition-[width] duration-500" style={{ width: `${((st.step + 1) / Q.length) * 100}%` }} />
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-8 text-balance">{cur.q}</h1>
        <div className="grid sm:grid-cols-2 gap-3">
          {cur.opts.map((o, oi) => (
            <button key={oi} onClick={() => choose(oi)} disabled={saving} data-testid={`q-opt-${oi}`} aria-pressed={st.answers[st.step] === oi}
              className={`text-left p-5 rounded-lg border bg-card hover:border-brand hover:bg-accent/40 transition-colors group disabled:opacity-60 ${st.answers[st.step] === oi ? "border-brand ring-2 ring-brand/30" : "border-border"}`}>
              <div className="flex items-center justify-between gap-3"><span className="font-medium">{o.l}</span><ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[opacity,transform] text-brand" /></div>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-destructive" data-testid="quiz-error">{error}</p>}
        {canBack && <button onClick={back} data-testid="quiz-back" className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-brand"><ArrowLeft className="w-4 h-4" /> Previous question</button>}
      </div>
    </div>
  );
};

export default Quiz;
