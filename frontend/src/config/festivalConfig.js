export const festivalConfig = {
  diwali: {
    // Set `enabled: false` after Diwali to disable all festival decorations,
    // click fireworks, rocket animations, event listeners, and timers.
    enabled: true,

    effects: {
      headerLights: true,
      footerDiyas: true,
      heroSparkles: true,
      clickFireworks: true,
      rocketLaunch: true,
      backgroundEffects: true,
    },

    settings: {
      rocketInterval: 15000,
      maxFireworkParticles: 24,
      maxSimultaneousBursts: 4,
      animationDuration: 1500,
    },
  },
};

export default festivalConfig;
