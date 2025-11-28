// Design Tokens - Sistema centralizado de diseño

// Spacing system (8px base unit)
export const SPACING = {
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "3rem", // 48px
  "2xl": "4rem", // 64px
  "3xl": "6rem", // 96px
} as const;

// Layout spacing (responsive)
export const LAYOUT = {
  mobile: {
    px: "1rem", // 16px
    py: "1rem", // 16px
    containerPx: "1rem", // 16px
    sectionGap: "2rem", // 32px
  },
  tablet: {
    px: "2rem", // 32px
    py: "2rem", // 32px
    containerPx: "3rem", // 48px
    sectionGap: "3rem", // 48px
  },
  desktop: {
    px: "3rem", // 48px
    py: "3rem", // 48px
    containerPx: "6rem", // 96px
    sectionGap: "4rem", // 64px
  },
} as const;

// Typography scale
export const TYPOGRAPHY = {
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Border radius
export const RADIUS = {
  none: "0",
  sm: "0.25rem", // 4px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  full: "9999px",
} as const;

// Shadows
export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  glow: "0 0 20px rgba(0, 238, 144, 0.3)",
} as const;

// Z-index layers
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  header: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

// Transitions
export const TRANSITIONS = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  timing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

// Grid & Container
export const CONTAINER = {
  maxWidth: "1280px", // max-w-screen-xl
  gutters: {
    mobile: "1rem", // 16px
    tablet: "2rem", // 32px
    desktop: "3rem", // 48px
  },
} as const;

// Utility function to get responsive spacing
export const getResponsiveSpacing = (size: "mobile" | "tablet" | "desktop") => {
  return LAYOUT[size];
};
