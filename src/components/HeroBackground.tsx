"use client";

import { useEffect, useRef, useState } from "react";

interface VantaEffect {
  destroy: () => void;
}

interface HeroBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function HeroBackground({
  children,
  className = "",
}: HeroBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);

  useEffect(() => {
    let effect: VantaEffect | null = null;

    const initVanta = async () => {
      if (vantaRef.current && !vantaEffect) {
        try {
          // Import p5 and make it available globally
          const p5Module = await import("p5");
          const p5Constructor = p5Module.default;

          // Make p5 available globally for Vanta
          if (typeof window !== "undefined") {
            (window as any).p5 = p5Constructor;
          }

          // @ts-expect-error Vanta.js does not have TypeScript types
          const TOPOLOGY = (await import("vanta/dist/vanta.topology.min"))
            .default;

          effect = TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x000000, // Negro puro para más oscuridad
            color: 0x00ff94, // Primary neon green from portfolio
            maxDistance: 20.0, // Menos conexiones = más oscuro
            spacing: 18.0, // Más espacio entre puntos = menos denso
          }) as VantaEffect;

          setVantaEffect(effect);
        } catch (error) {
          console.error("Failed to initialize Vanta effect:", error);
        }
      }
    };

    initVanta();

    return () => {
      if (effect) {
        effect.destroy();
      }
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={vantaRef} className={`absolute inset-0 ${className}`}>
      {children}
    </div>
  );
}
