import React, { useState, useEffect } from "react";
import { festivalConfig } from "../../config/festivalConfig";
import { FirecrackerEffect } from "./FirecrackerEffect";
import { RocketAnimation } from "./RocketAnimation";
import "./DiwaliEffects.css";

export const DiwaliEffects = () => {
  const { enabled } = festivalConfig.diwali;
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="diwali-effects-layer" aria-hidden="true" data-testid="diwali-effects-layer">
      <FirecrackerEffect reducedMotion={reducedMotion} />
      <RocketAnimation reducedMotion={reducedMotion} />
    </div>
  );
};

export default DiwaliEffects;
