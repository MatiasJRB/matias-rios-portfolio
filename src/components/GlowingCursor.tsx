"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function GlowingCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

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

  if (!mounted) return null;

  const glowColor =
    theme === "dark"
      ? isHovering
        ? "rgba(0, 238, 144, 0.25)" // Verde cuando hover
        : "rgba(51, 49, 123, 0.2)" // Violeta normal
      : isHovering
      ? "rgba(0, 238, 144, 0.2)" // Verde cuando hover
      : "rgba(59, 130, 246, 0.15)"; // Azul normal

  const gradientSize = isHovering ? "40%" : theme === "dark" ? "35%" : "25%";

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen -z-10 transition-all duration-300"
      style={{
        background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, ${glowColor} 0%, transparent ${gradientSize})`,
      }}
    ></div>
  );
}
