"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { MagneticButton } from "./AdvancedEffects";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div
        className="w-32 h-9 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--color-surface)" }}
      />
    );
  }

  const themes = [
    { name: "light", icon: FaSun, label: "Light" },
    { name: "dark", icon: FaMoon, label: "Dark" },
    { name: "system", icon: FaDesktop, label: "System" },
  ];
  return (
    <div
      className="flex items-center rounded-full p-1 transition-all duration-300 border shadow-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.name;

        return (
          <MagneticButton key={themeOption.name} strength={0.35}>
            <button
              onClick={() => {
                setTheme(themeOption.name);
              }}
              className="relative flex items-center justify-center w-8 h-7 rounded-full transition-all duration-200 ease-in-out cursor-pointer"
              style={{
                backgroundColor: isActive
                  ? "var(--color-background)"
                  : "transparent",
                color: isActive ? "var(--color-text)" : "var(--color-muted)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive ? "0 1px 3px var(--shadow)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.color = "var(--color-text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.color = "var(--color-muted)";
                }
              }}
              aria-label={`Switch to ${themeOption.label} theme`}
              title={`${themeOption.label} theme ${
                themeOption.name === "system" && systemTheme
                  ? `(currently ${systemTheme})`
                  : ""
              }`}
            >
              <Icon size={12} />
            </button>
          </MagneticButton>
        );
      })}
    </div>
  );
}
