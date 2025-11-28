import { useState, useEffect } from "react";

/**
 * Hook personalizado para detectar media queries
 * @param query - Media query string (ej: "(min-width: 768px)")
 * @returns boolean indicando si la media query coincide
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Usar addEventListener en lugar del método deprecated
    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  // Evitar hidratación incorrecta en SSR
  if (!mounted) {
    return false;
  }

  return matches;
}

// Hooks predefinidos para breakpoints comunes
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useIsTablet = () => useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsPrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
