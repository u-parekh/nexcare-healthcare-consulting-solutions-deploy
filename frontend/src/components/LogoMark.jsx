import { useTheme } from "./ThemeProvider";

// Both theme logos are trimmed of transparent margins and share the SAME intrinsic size (1000x267),
// so with the same height class they render at identical width/height and switching theme never shifts the layout.
const LOGO_SIZE = { width: 1000, height: 267 };
const LOGOS = {
  light: { src: "/logo.png?v=2", ...LOGO_SIZE },
  dark: { src: "/images/logo-dark.webp?v=3", ...LOGO_SIZE },
};

export const LogoMark = ({ className = "w-9 h-9" }) => {
  const { theme } = useTheme();
  const logo = theme === "dark" ? LOGOS.dark : LOGOS.light;
  return (
    <img
      src={logo.src}
      alt="NEXCARE — Healthcare Consulting Solutions"
      width={logo.width} height={logo.height}
      className={`${className} object-contain object-left`}
      data-testid="logo-mark"
      data-theme-logo={theme}
    />
  );
};

export const LogoWordmark = ({ className = "" }) => (
  <span className={`font-display font-extrabold tracking-tight ${className}`}>
    NEX<span style={{ color: "#3FB549" }}>CARE</span>
  </span>
);
