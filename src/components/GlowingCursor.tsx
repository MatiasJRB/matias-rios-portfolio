"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function GlowingCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  if (!mounted) return null;
  const glowColor =
    theme === "dark"
      ? "rgba(51, 49, 123, 0.2)" // Color violeta para modo oscuro
      : "rgba(59, 130, 246, 0.15)"; // Color azul más visible para modo claro

  const gradientSize = theme === "dark" ? "35%" : "25%"; // Gradiente más concentrado en modo claro

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-[0]"
      style={{
        background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, ${glowColor} 0%, transparent ${gradientSize})`,
      }}
    ></div>
  );
}
