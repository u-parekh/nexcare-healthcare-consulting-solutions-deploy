import { useEffect, useState } from "react";

const TypingHero = ({ messages, underlines, switchMs = 10000, typeMs = 55, eraseMs = 28 }) => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing"); // typing | hold | erasing

  useEffect(() => {
    const full = messages[idx];
    let t;
    if (phase === "typing") {
      if (text.length < full.length) t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeMs);
      else t = setTimeout(() => setPhase("hold"), switchMs - typeMs * full.length);
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("erasing"), 100);
    } else if (phase === "erasing") {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), eraseMs);
      else { setIdx((idx + 1) % messages.length); setPhase("typing"); }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx, messages, switchMs, typeMs, eraseMs]);

  const underline = underlines[idx];
  const render = () => {
    if (!underline || !text.includes(underline)) {
      return <span>{text}<span className="inline-block w-[3px] h-[0.9em] align-middle bg-brand ml-1 animate-pulse"/></span>;
    }
    const parts = text.split(underline);
    return (
      <span>
        {parts[0]}
        <span className="relative inline-block text-brand-2">
          {underline.slice(0, Math.max(0, text.length - parts[0].length - (parts[1]?.length || 0)))}
          <span className="absolute -bottom-1 left-0 right-0 h-1 bg-brand-2/50 rounded-full shimmer"/>
        </span>
        {parts[1] || ""}
        <span className="inline-block w-[3px] h-[0.9em] align-middle bg-brand ml-1 animate-pulse"/>
      </span>
    );
  };

  return <span data-testid="typing-hero">{render()}</span>;
};

export default TypingHero;
