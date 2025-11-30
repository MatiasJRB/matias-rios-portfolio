// Constantes de navegación
export const NAV_ITEMS = [
  { id: "about", labelKey: "about" },
  { id: "history", labelKey: "experience" },
] as const;

// Mapeo de logos de empresas
export const COMPANY_LOGOS: Record<string, string> = {
  Mangxo: "/images/work/mango.png",
  Geome7ric: "/images/work/geome7ric.png",
  Kalkomey: "/images/work/kalkomey.png",
  Nuqlea: "/images/work/nuqlea.png",
};

// Colores del sistema (referencia a CSS variables)
export const THEME_COLORS = {
  primary: "var(--color-primary)",
  accent: "var(--color-accent)",
  text: "var(--color-text)",
  muted: "var(--color-muted)",
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  border: "var(--color-border)",
  borderAccent: "var(--color-border-accent)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
} as const;

// Breakpoints para responsive design
export const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
} as const;

// Duraciones de animación
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
} as const;

// Configuración de IntersectionObserver
export const INTERSECTION_CONFIG = {
  threshold: 0.5,
  rootMargin: "0px",
} as const;
