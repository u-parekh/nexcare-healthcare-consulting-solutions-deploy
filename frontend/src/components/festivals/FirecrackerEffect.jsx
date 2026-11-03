import React, { useState, useEffect, useCallback, useRef } from "react";
import { festivalConfig } from "../../config/festivalConfig";

// High-contrast festive colors visible on both light (#F8FAF9) and dark (#080C11) backgrounds
const FIREWORK_PALETTE = [
  "#f59e0b", // Amber Gold
  "#ea580c", // Deep Saffron Orange
  "#dc2626", // Kumkum Crimson
  "#d97706", // Goldenrod
  "#10b981", // Festive Emerald
  "#ec4899", // Rangoli Pink
];

const INTERACTIVE_ELEMENTS_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "option",
  "label",
  "summary",
  "details",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[contenteditable='true']",
  "[data-testid='captcha']",
  "[data-testid='floating-controls']",
  ".no-fireworks",
].join(",");

export const generateParticles = (count) => {
  return Array.from({ length: count }).map((_, index) => {
    const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.22;
    const distance = 34 + Math.random() * 56;
    return {
      id: index,
      tx: `${Math.cos(angle) * distance}px`,
      ty: `${Math.sin(angle) * distance}px`,
      color: FIREWORK_PALETTE[index % FIREWORK_PALETTE.length],
    };
  });
};

export const FireworkBurstNode = ({ x, y, particles, duration, style }) => (
  <div
    className="diwali-firework-burst"
    style={{ left: `${x}px`, top: `${y}px`, ...style }}
    aria-hidden="true"
  >
    <div className="diwali-firework-core" />
    {particles.map((p) => (
      <span
        key={p.id}
        className="diwali-firework-particle"
        style={{
          "--tx": p.tx,
          "--ty": p.ty,
          "--particle-color": p.color,
          "--burst-duration": `${duration}ms`,
        }}
      />
    ))}
  </div>
);

export const FirecrackerEffect = ({ reducedMotion = false }) => {
  const { enabled, effects, settings } = festivalConfig.diwali;
  const [bursts, setBursts] = useState([]);
  const activeTimers = useRef(new Set());

  const triggerBurst = useCallback(
    (clientX, clientY) => {
      const isMobile = window.innerWidth <= 640;
      const count = isMobile
        ? Math.min(12, settings.maxFireworkParticles)
        : settings.maxFireworkParticles;

      const burstId = `${Date.now()}-${Math.random()}`;
      const nextBurst = {
        id: burstId,
        x: clientX,
        y: clientY,
        particles: generateParticles(count),
      };

      setBursts((prev) => {
        const limit = settings.maxSimultaneousBursts || 4;
        const sliced = prev.length >= limit ? prev.slice(1) : prev;
        return [...sliced, nextBurst];
      });

      const timer = setTimeout(() => {
        setBursts((prev) => prev.filter((item) => item.id !== burstId));
        activeTimers.current.delete(timer);
      }, settings.animationDuration);

      activeTimers.current.add(timer);
    },
    [settings.animationDuration, settings.maxFireworkParticles, settings.maxSimultaneousBursts]
  );

  useEffect(() => {
    if (!enabled || !effects.clickFireworks || reducedMotion) {
      return undefined;
    }

    const timers = activeTimers.current;

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target && typeof e.target.closest === "function") {
        if (e.target.closest(INTERACTIVE_ELEMENTS_SELECTOR)) return;
      }
      triggerBurst(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, [enabled, effects.clickFireworks, reducedMotion, triggerBurst]);

  if (!enabled || !effects.clickFireworks || reducedMotion) return null;

  return (
    <>
      {bursts.map((b) => (
        <FireworkBurstNode
          key={b.id}
          x={b.x}
          y={b.y}
          particles={b.particles}
          duration={settings.animationDuration}
        />
      ))}
    </>
  );
};

export default FirecrackerEffect;
