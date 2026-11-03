import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, RotateCcw, LogOut } from "lucide-react";
import { brochureURL, BROCHURE_FILENAME, trackBrochure } from "../lib/api";

const OPTIONS = {
  services: { label: "Services", text: "Nexcare offers 10 services, including Medical Record Digitization & MRD, Surgical & Biomedical Equipment and Outsourced Pharmacy, Hospital Website Development, Hospital Planning & Design and Quality Assurance.", links: [["View all services", "/services"]] },
  about: { label: "About NexCare", text: "Nexcare is a healthcare consulting and hospital-planning company helping hospitals and clinics plan, improve and digitise their operations.", links: [["About & vision", "/about"]] },
  contact: { label: "Contact", text: "Email info@nexcareconsulting.com or call +91 9664662760. You can also send an inquiry through our contact form.", links: [["Open contact form", "/contact"]] },
  brochure: { label: "Download Brochure", text: "Here is our company brochure (PDF).", download: true },
  planning: { label: "Hospital Planning", text: "We support demand studies, service mix, zoning, patient flow, MEP coordination and phased master plans.", links: [["Hospital Planning & Design", "/services/hospital-planning-design"]] },
  nabh: { label: "NABH Support", text: "We help hospitals prepare for NABH assessment with gap assessments, documentation support, training plans and mock audits. Accreditation decisions are made by NABH.", links: [["Quality Assurance", "/services/quality-assurance"], ["NABH guide", "/blog/nabh-accreditation-india-practical-guide"]] },
  mrd: { label: "Medical Record Digitization", text: "Our MRD services cover outsourced records management, digitization, indexing, secure cloud storage planning and retrieval workflows.", links: [["MRD Services", "/services/mrd-digitization"]] },
  team: { label: "Talk to the Team", text: "I'm an automated guide, not a live agent. To reach a person, send an inquiry and our team aims to respond within 1–2 business days, or call +91 9664662760.", links: [["Send an inquiry", "/contact"]] },
};

const KEYWORDS = [
  [["nabh", "accredit", "jci"], "nabh"], [["record", "mrd", "digiti", "file"], "mrd"], [["brochure", "pdf", "download"], "brochure"],
  [["plan", "design", "build", "construct"], "planning"], [["contact", "email", "phone", "call", "reach"], "contact"],
  [["about", "who", "company", "vision"], "about"], [["team", "human", "person", "agent", "talk"], "team"], [["service", "offer", "help"], "services"],
];
const EXIT_WORDS = ["exit", "quit", "bye", "goodbye", "end", "stop"];
const GREETING = { from: "bot", text: "Hi! I'm Nexa, NEXCARE's automated guide. Pick a topic below or type a question. Type \"exit\" anytime to end the chat." };

const match = (t) => { for (const [ks, key] of KEYWORDS) if (ks.some((k) => t.includes(k))) return key; return null; };

const BotMessage = ({ m, onNav }) => (
  <div className="max-w-[88%] px-3 py-2 rounded-lg text-sm leading-5 bg-accent text-foreground rounded-bl-sm">
    {m.text}
    {(m.links?.length || m.download) && (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {m.links?.map(([l, to]) => <Link key={to} to={to} onClick={onNav} className="px-2.5 py-1 rounded-full bg-brand text-white text-xs font-semibold hover:opacity-90">{l}</Link>)}
        {m.download && <a href={brochureURL} download={BROCHURE_FILENAME} onClick={trackBrochure} data-testid="chatbot-brochure" className="px-2.5 py-1 rounded-full bg-brand-2 text-white text-xs font-semibold">Download PDF</a>}
      </div>
    )}
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [ended, setEnded] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([GREETING]);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs, open]);

  const reply = (key) => setMsgs((m) => [...m, { from: "bot", ...OPTIONS[key] }]);
  const end = () => { setEnded(true); setMsgs((m) => [...m, { from: "bot", text: "Thanks for chatting with NEXCARE. This conversation has ended — you can restart it anytime." }]); };
  const restart = () => { setEnded(false); setMsgs([GREETING]); };
  const choose = (key) => { setMsgs((m) => [...m, { from: "user", text: OPTIONS[key].label }]); setTimeout(() => reply(key), 300); };

  const send = () => {
    const text = input.trim().slice(0, 300);
    if (!text || ended) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text }]);
    const t = text.toLowerCase();
    if (EXIT_WORDS.includes(t.replace(/[^a-z]/g, ""))) { setTimeout(end, 250); return; }
    const key = match(t);
    setTimeout(() => (key ? reply(key) : setMsgs((m) => [...m, { from: "bot", text: "I can help with the topics below. For anything else, please use the contact form and our team will get back to you.", links: [["Contact us", "/contact"]] }])), 350);
  };

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-[340px] max-w-[calc(100vw-2rem)] h-[min(500px,70vh)] bg-card border border-border rounded-2xl shadow-[0_24px_70px_-24px_rgba(15,23,42,0.45)] flex flex-col overflow-hidden"
          data-testid="chatbot-window" role="dialog" aria-label="NEXCARE chat guide">
          <div className="px-4 py-3 bg-gradient-to-r from-brand to-brand-2 text-white flex items-center gap-3">
            <div className="grid place-items-center w-8 h-8 rounded-full bg-white/15 font-display font-bold" aria-hidden>N</div>
            <div className="flex-1">
              <p className="font-display font-bold text-sm">Nexa Guide</p>
              <p className="text-xs opacity-85">Automated FAQ assistant</p>
            </div>
            {!ended && <button onClick={end} data-testid="chatbot-end" aria-label="End conversation" className="p-1.5 rounded-md hover:bg-white/15"><LogOut className="w-4 h-4" /></button>}
            <button onClick={() => setOpen(false)} data-testid="chatbot-close" aria-label="Close chat" className="p-1.5 rounded-md hover:bg-white/15"><X className="w-4 h-4" /></button>
          </div>
          <div ref={ref} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-background" data-testid="chatbot-messages" aria-live="polite">
            {msgs.map((m, i) => m.from === "bot"
              ? <BotMessage key={i} m={m} onNav={() => setOpen(false)} />
              : <div key={i} className="max-w-[85%] ml-auto px-3 py-2 rounded-lg text-sm leading-5 bg-brand text-white rounded-br-sm">{m.text}</div>)}
            {!ended && (
              <div className="flex flex-wrap gap-1.5 pt-1" data-testid="chatbot-options">
                {Object.entries(OPTIONS).map(([k, o]) => (
                  <button key={k} onClick={() => choose(k)} data-testid={`chatbot-opt-${k}`} className="px-2.5 py-1 rounded-full border border-brand/40 text-xs font-medium hover:bg-brand hover:text-white transition-colors">{o.label}</button>
                ))}
              </div>
            )}
          </div>
          {ended ? (
            <div className="p-3 border-t border-border bg-card" data-testid="chatbot-ended">
              <button onClick={restart} data-testid="chatbot-restart" className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-md bg-brand text-white text-sm font-semibold"><RotateCcw className="w-4 h-4" /> Restart conversation</button>
            </div>
          ) : (
            <form className="p-3 border-t border-border flex gap-2 bg-card" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <label htmlFor="chatbot-input" className="sr-only">Type your message</label>
              <input id="chatbot-input" data-testid="chatbot-input" value={input} maxLength={300} onChange={(e) => setInput(e.target.value)}
                placeholder='Ask a question or type "exit"' className="flex-1 min-w-0 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand" />
              <button type="submit" data-testid="chatbot-send" aria-label="Send message" className="grid place-items-center w-10 h-10 rounded-md bg-brand text-white hover:opacity-90"><Send className="w-4 h-4" /></button>
            </form>
          )}
        </div>
      )}
      <button onClick={() => setOpen(!open)} data-testid="chatbot-toggle" aria-expanded={open} aria-label={open ? "Close chat" : "Open chat"}
        className="grid place-items-center w-14 h-14 rounded-full bg-brand text-white shadow-[0_18px_40px_-10px_hsl(var(--brand)/0.7)] hover:scale-105 transition-transform">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default Chatbot;
