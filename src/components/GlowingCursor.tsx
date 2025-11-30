"use client";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

export default function GlowingCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();
  const normalLayerRef = useRef<HTMLDivElement>(null);
  const hoverLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mostrar el cursor solo en el cliente
    if (containerRef.current) {
      containerRef.current.style.opacity = "1";
    }

    const updateCursor = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Actualizar posición directamente en el DOM para evitar re-renders
      if (normalLayerRef.current) {
        normalLayerRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, var(--glow-color-normal), transparent 40%)`;
      }
      if (hoverLayerRef.current) {
        hoverLayerRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, var(--glow-color-hover), transparent 40%)`;
      }

      // Detectar si está sobre un elemento interactivo
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.classList.contains("cursor-pointer");

      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  const glowColorNormal =
    theme === "dark" ? "rgba(51, 49, 123, 0.15)" : "rgba(59, 130, 246, 0.1)";
  const glowColorHover =
    theme === "dark" ? "rgba(0, 238, 144, 0.2)" : "rgba(0, 238, 144, 0.15)";

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      style={
        {
          opacity: 0,
          "--glow-color-normal": glowColorNormal,
          "--glow-color-hover": glowColorHover,
        } as React.CSSProperties
      }
    >
      {/* Capa normal */}
      <div
        ref={normalLayerRef}
        className="absolute inset-0"
        style={{
          opacity: isHovering ? 0 : 1,
          transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      {/* Capa hover */}
      <div
        ref={hoverLayerRef}
        className="absolute inset-0"
        style={{
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
