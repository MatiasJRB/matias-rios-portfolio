import { ANIMATION } from "@/design-tokens";
import { CSSProperties } from "react";

/**
 * Hook para aplicar animación slide-in consistente en toda la aplicación
 * @param index - Índice del elemento en la secuencia (0, 1, 2, ...)
 * @param baseDelay - Delay base antes de la primera animación (por defecto usa ANIMATION.delay.initial)
 * @returns Objeto con className y style para aplicar al elemento
 */
export function useSlideInAnimation(
  index: number = 0,
  baseDelay: number = ANIMATION.delay.initial
) {
  const delay = baseDelay + index * ANIMATION.delay.stagger;

  return {
    className: "animate-slide-in opacity-0",
    style: {
      animationDelay: `${delay}s`,
      animationFillMode: "forwards",
    } as CSSProperties,
  };
}

/**
 * Genera className y style para animación slide-in (para uso sin hook)
 */
export function getSlideInAnimation(
  index: number = 0,
  baseDelay: number = ANIMATION.delay.initial
) {
  const delay = baseDelay + index * ANIMATION.delay.stagger;

  return {
    className: "animate-slide-in opacity-0",
    style: {
      animationDelay: `${delay}s`,
      animationFillMode: "forwards",
    } as CSSProperties,
  };
}
