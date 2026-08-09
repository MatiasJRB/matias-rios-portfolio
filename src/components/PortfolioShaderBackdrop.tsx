"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const DARK_COLORS = ["#101419", "#243e4c", "#3f675f", "#171e23"];
const LIGHT_COLORS = ["#f2efe6", "#b7c8b4", "#d8bd91", "#faf8f2"];

export default function PortfolioShaderBackdrop() {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;
  const speed = prefersReducedMotion ? 0 : 0.07;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <MeshGradient
        colors={colors}
        speed={speed}
        distortion={0.48}
        swirl={0.32}
        grainMixer={0.18}
        grainOverlay={isDark ? 0.08 : 0.035}
        rotation={-14}
        scale={1.35}
        maxPixelCount={1200 * 900}
        className="portfolio-shader-blob portfolio-shader-blob-primary"
      />

      <MeshGradient
        colors={[colors[1], colors[3], colors[0], colors[2]]}
        speed={prefersReducedMotion ? 0 : -0.045}
        distortion={0.38}
        swirl={0.5}
        grainMixer={0.16}
        grainOverlay={isDark ? 0.07 : 0.03}
        rotation={24}
        scale={1.2}
        maxPixelCount={1000 * 760}
        className="portfolio-shader-blob portfolio-shader-blob-secondary"
      />

      <div className="portfolio-shader-grid" />

      <div className="portfolio-shader-vignette" />
    </div>
  );
}
