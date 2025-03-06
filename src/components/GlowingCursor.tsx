"use client";
import { useEffect, useState } from "react";

export default function GlowingCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    console.log("GlowingCursor mounted");
    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-[0]"
      style={{
        background: `radial-gradient(circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(51, 49, 123, 0.15) 0%, rgba(0, 0, 0, 0) 30%)`,
      }}
    ></div>
  );
}
