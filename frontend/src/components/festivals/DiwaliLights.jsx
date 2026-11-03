import React, { useMemo, useState, useEffect } from "react";
import { festivalConfig } from "../../config/festivalConfig";
import { DiyaDecoration } from "./DiyaDecoration";
import { generateParticles } from "./FirecrackerEffect";

/**
 * Header / Navbar decorative string lights & small glowing diyas
 */
export const DiwaliHeaderLights = () => {
  const { enabled, effects } = festivalConfig.diwali;
  if (!enabled || !effects.headerLights) return null;

  return (
    <div className="diwali-header-lights" aria-hidden="true" data-testid="diwali-header-lights">
      <DiyaDecoration size="xs" />
      <div className="diwali-header-garland">
        {Array.from({ length: 16 }).map((_, idx) => (
          <span key={idx} className="diwali-light-bulb" />
        ))}
      </div>
      <DiyaDecoration size="xs" />
    </div>
  );
};

/**
 * Main Hero Section festive background sparkles & occasional background firework
 */
export const DiwaliHeroSparkles = () => {
  const { enabled, effects, settings } = festivalConfig.diwali;
  const [ambientBurst, setAmbientBurst] = useState(null);

  const sparkles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${5 + ((i * 7) % 90)}%`,
      top: `${12 + ((i * 11) % 76)}%`,
      size: `${3 + (i % 3)}px`,
      delay: `${(i * 0.4).toFixed(2)}s`,
      duration: `${4.4 + (i % 3) * 0.8}s`,
    }));
  }, []);

  useEffect(() => {
    if (!enabled || !effects.backgroundEffects) return undefined;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    let cleanupTimer;
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      const leftPct = 15 + Math.random() * 70;
      const topPct = 18 + Math.random() * 45;
      setAmbientBurst({
        id: Date.now(),
        left: `${leftPct}%`,
        top: `${topPct}%`,
        particles: generateParticles(12),
      });
      cleanupTimer = setTimeout(() => setAmbientBurst(null), settings.animationDuration);
    }, 11000);

    return () => {
      clearInterval(interval);
      if (cleanupTimer) clearTimeout(cleanupTimer);
    };
  }, [enabled, effects.backgroundEffects, settings.animationDuration]);

  if (!enabled || (!effects.heroSparkles && !effects.backgroundEffects)) return null;

  return (
    <div className="diwali-hero-effects" aria-hidden="true" data-testid="diwali-hero-sparkles">
      {effects.heroSparkles &&
        sparkles.map((sp) => (
          <span
            key={sp.id}
            className="diwali-hero-sparkle"
            style={{
              left: sp.left,
              top: sp.top,
              width: sp.size,
              height: sp.size,
              animationDelay: sp.delay,
              animationDuration: sp.duration,
            }}
          />
        ))}

      {effects.backgroundEffects && ambientBurst && (
        <div
          key={ambientBurst.id}
          className="diwali-ambient-burst"
          style={{ left: ambientBurst.left, top: ambientBurst.top }}
        >
          <div className="diwali-firework-core" />
          {ambientBurst.particles.map((p) => (
            <span
              key={p.id}
              className="diwali-firework-particle"
              style={{
                "--tx": p.tx,
                "--ty": p.ty,
                "--particle-color": p.color,
                "--burst-duration": `${settings.animationDuration}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Footer decorative diyas & warm golden glow
 */
export const DiwaliFooterDiyas = () => {
  const { enabled, effects } = festivalConfig.diwali;
  if (!enabled || !effects.footerDiyas) return null;

  return (
    <div className="diwali-footer-strip" aria-hidden="true" data-testid="diwali-footer-diyas">
      <span className="diwali-footer-glow-line" />
      <DiyaDecoration size="sm" />
      <DiyaDecoration size="md" />
      <DiyaDecoration size="sm" />
      <span className="diwali-footer-glow-line" />
    </div>
  );
};

export const DiwaliLights = ({ variant = "header" }) => {
  if (variant === "hero") return <DiwaliHeroSparkles />;
  if (variant === "footer") return <DiwaliFooterDiyas />;
  return <DiwaliHeaderLights />;
};

export default DiwaliLights;
