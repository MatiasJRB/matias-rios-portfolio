"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

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
      className="flex items-center rounded-full p-1 transition-[background-color,border-color,box-shadow] duration-300 border shadow-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.name;

        return (
          <button
            key={themeOption.name}
            onClick={() => {
              setTheme(themeOption.name);
            }}
            className="control-hover relative flex h-7 w-8 cursor-pointer items-center justify-center rounded-full"
            style={{
              backgroundColor: isActive
                ? "var(--color-background)"
                : "transparent",
              color: isActive ? "var(--color-text)" : "var(--color-muted)",
              boxShadow: isActive ? "0 1px 3px var(--shadow)" : "none",
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
        );
      })}
    </div>
  );
}
