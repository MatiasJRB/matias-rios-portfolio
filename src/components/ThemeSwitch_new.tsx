"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className="w-28 h-9 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
    );
  }

  const themes = [
    { name: "light", icon: FaSun, label: "Light" },
    { name: "dark", icon: FaMoon, label: "Dark" },
  ];

  return (
    <div className="flex items-center rounded-full p-1 transition-all duration-300 border shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isActive = theme === themeOption.name;

        return (
          <button
            key={themeOption.name}
            onClick={() => setTheme(themeOption.name)}
            className={`
              relative flex items-center justify-center w-8 h-7 rounded-full
              transition-all duration-200 ease-in-out              ${
                isActive
                  ? "shadow-sm scale-105 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  : "hover:scale-110 bg-transparent text-gray-500 dark:text-gray-400"
              }
            `}
            aria-label={`Switch to ${themeOption.label} theme`}
            title={`${themeOption.label} theme`}
          >
            <Icon size={12} />
          </button>
        );
      })}
    </div>
  );
}
