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
      ? "rgba(51, 49, 123, 0.15)" // Color violeta para modo oscuro
      : "rgba(0, 238, 144, 0.1)"; // Color verde suave para modo claro

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-[0]"
      style={{
        background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, ${glowColor} 0%, rgba(0, 0, 0, 0) 30%)`,
      }}
    ></div>
  );
}
