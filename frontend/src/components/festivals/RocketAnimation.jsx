import React, { useState, useEffect, useRef, useCallback } from "react";
import { festivalConfig } from "../../config/festivalConfig";
import { generateParticles, FireworkBurstNode } from "./FirecrackerEffect";

export const RocketAnimation = ({ reducedMotion = false }) => {
  const { enabled, effects, settings } = festivalConfig.diwali;
  const [rocket, setRocket] = useState(null);
  const [explosion, setExplosion] = useState(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  const launchSingleRocket = useCallback(() => {
    if (typeof document !== "undefined" && document.hidden) return;

    const isMobile = window.innerWidth <= 640;
    // Launch along left or right side margin so central content is never covered
    const sideX = Math.random() > 0.5 ? 10 + Math.random() * 10 : 80 + Math.random() * 10;
    const flightDuration = 1750;
    const travelRatio = 0.72 + Math.random() * 0.1;
    const driftPx = (Math.random() - 0.5) * 22;

    const nextRocket = {
      id: Date.now(),
      xPercent: sideX,
      travelYvh: -Math.round(travelRatio * 100),
      driftPx,
      flightDuration,
    };

    setRocket(nextRocket);

    const explodeTimer = setTimeout(() => {
      setRocket(null);

      const burstX = (window.innerWidth * sideX) / 100 + driftPx;
      const burstY = window.innerHeight * (1 - travelRatio);
      const count = isMobile ? 12 : Math.min(20, settings.maxFireworkParticles);

      setExplosion({
        id: `rocket-burst-${Date.now()}`,
        x: burstX,
        y: burstY,
        particles: generateParticles(count),
      });

      const cleanupTimer = setTimeout(() => {
        setExplosion(null);
      }, settings.animationDuration);

      timersRef.current.push(cleanupTimer);
    }, flightDuration - 70);

    timersRef.current.push(explodeTimer);
  }, [settings.animationDuration, settings.maxFireworkParticles]);

  useEffect(() => {
    if (!enabled || !effects.rocketLaunch || reducedMotion) {
      return undefined;
    }

    const firstLaunch = setTimeout(launchSingleRocket, 4200);
    const interval = setInterval(
      launchSingleRocket,
      Math.max(8000, settings.rocketInterval || 15000)
    );

    timersRef.current.push(firstLaunch);

    return () => {
      clearInterval(interval);
      clearTimers();
    };
  }, [enabled, effects.rocketLaunch, settings.rocketInterval, reducedMotion, launchSingleRocket]);

  if (!enabled || !effects.rocketLaunch || reducedMotion) return null;

  return (
    <>
      {rocket && (
        <div
          key={rocket.id}
          className="diwali-rocket-wrapper"
          style={{
            "--rocket-x": `${rocket.xPercent}%`,
            "--rocket-travel-y": `${rocket.travelYvh}vh`,
            "--rocket-drift": `${rocket.driftPx}px`,
            "--rocket-duration": `${rocket.flightDuration}ms`,
          }}
          aria-hidden="true"
          data-testid="diwali-rocket"
        >
          <div className="diwali-rocket-body">
            <div className="diwali-rocket-tail" />
          </div>
        </div>
      )}

      {explosion && (
        <FireworkBurstNode
          key={explosion.id}
          x={explosion.x}
          y={explosion.y}
          particles={explosion.particles}
          duration={settings.animationDuration}
        />
      )}
    </>
  );
};

export default RocketAnimation;
