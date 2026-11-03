import React from "react";

const SIZE_MAP = {
  xs: 20,
  sm: 24,
  md: 30,
  lg: 38,
};

export const DiyaDecoration = ({ size = "sm", className = "" }) => {
  const px = SIZE_MAP[size] || SIZE_MAP.sm;

  return (
    <span
      className={`diwali-diya ${className}`}
      aria-hidden="true"
      role="presentation"
      data-testid="diwali-diya"
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="diwali-diya-svg"
      >
        {/* Warm Ambient Glow Halo */}
        <circle
          cx="32"
          cy="20"
          r="14"
          fill="var(--diwali-glow)"
          className="diwali-diya-halo"
        />

        {/* Outer Saffron Flame */}
        <path
          d="M32 6C32 6 23 16 23 23.2C23 28.4 27 32.2 32 32.2C37 32.2 41 28.4 41 23.2C41 16 32 6 32 6Z"
          fill="var(--diwali-flame-outer)"
          className="diwali-diya-flame-outer"
        />

        {/* Inner Golden Flame Core */}
        <path
          d="M32 12.5C32 12.5 27 18.8 27 23.2C27 26.2 29.2 28.6 32 28.6C34.8 28.6 37 26.2 37 23.2C37 18.8 32 12.5 32 12.5Z"
          fill="var(--diwali-flame-inner)"
          className="diwali-diya-flame-inner"
        />

        {/* Traditional Clay Diya Base */}
        <path
          d="M10 34C10 34 18.5 39 32 39C45.5 39 54 34 54 34C52 46 43 54 32 54C21 54 12 46 10 34Z"
          fill="var(--diwali-clay)"
          stroke="var(--diwali-clay-highlight)"
          strokeWidth="2"
        />

        {/* Decorative Golden Rim */}
        <path
          d="M10 34C19 37.5 45 37.5 54 34"
          stroke="var(--diwali-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

export default DiyaDecoration;
