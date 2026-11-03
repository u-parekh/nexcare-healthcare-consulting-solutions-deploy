import { motion, useReducedMotion } from "framer-motion";
import { Stethoscope, Hospital, HeartPulse, Activity, ShieldCheck, FileText, Syringe, Building2 } from "lucide-react";

const ICONS = [Stethoscope, Hospital, HeartPulse, Activity, ShieldCheck, FileText, Syringe, Building2];
const LAYERS = [6, 5, 4, 3, 2, 1];

// NEXCARE-inspired 3D logo centrepiece with floating healthcare artifacts (CSS 3D + Framer Motion).
export const HeroCenterpiece = () => {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto w-[min(100%,20rem)] sm:w-full sm:max-w-md aspect-square" data-testid="hero-centerpiece">
      <div className="absolute inset-[12%] rounded-full overflow-hidden border border-border shadow-2xl">
        <img src="/images/hero-hospital-planning.webp" alt="NEXCARE Healthcare Consulting"
          width="1050" height="1400" fetchPriority="high" className="w-full h-full object-cover opacity-35 dark:opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--background)/0.2),hsl(var(--background)/0.85)_70%)]" />
      </div>
      <motion.div animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[6%] rounded-full border-2 border-dashed border-brand/35" />
      <motion.div animate={reduce ? {} : { rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-brand-2/40" />
      <div className="absolute inset-[28%] rounded-full bg-gradient-to-br from-brand/40 to-brand-2/40 blur-3xl hero-pulse" />

      <div className="absolute inset-0 grid place-items-center [perspective:900px]">
        <motion.div className="relative w-[46%] [transform-style:preserve-3d]"
          animate={reduce ? {} : { rotateY: [-28, 28, -28], rotateX: [8, -6, 8], y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
          {LAYERS.map((z) => (
            <img key={z} src="/images/logo-icon.webp" alt="" aria-hidden width="420" height="337"
              className="absolute inset-0 w-full h-auto" style={{ transform: `translateZ(-${z * 2}px)`, filter: `brightness(${0.55 + z * 0.03})` }} />
          ))}
          <img src="/images/logo-icon.webp" alt="NEXCARE emblem" width="420" height="337"
            className="relative w-full h-auto drop-shadow-[0_20px_35px_rgba(14,74,138,0.45)]" style={{ transform: "translateZ(2px)" }} />
        </motion.div>
      </div>

      {ICONS.map((Icon, i) => {
        const a = (i / ICONS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.div key={i} aria-hidden
            className="absolute grid place-items-center w-10 h-10 sm:w-12 sm:h-12 -ml-5 -mt-5 sm:-ml-6 sm:-mt-6 rounded-xl border border-border bg-card/85 backdrop-blur shadow-lg"
            style={{ left: `${50 + 42 * Math.cos(a)}%`, top: `${50 + 42 * Math.sin(a)}%` }}
            animate={reduce ? {} : { y: [0, i % 2 ? -6 : 6, 0] }} transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}>
            <Icon className={`w-5 h-5 ${i % 2 ? "text-brand-2" : "text-brand"}`} strokeWidth={1.8} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeroCenterpiece;
