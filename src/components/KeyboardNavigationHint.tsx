"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/i18n/types";

interface KeyboardNavigationHintProps {
  isKeyboardMode?: boolean;
  actionHint?: string | null;
  actionColor?: string | null;
  dictionary: Dictionary;
}

// Helper to check if a color is too dark
const isColorDark = (hex: string | null): boolean => {
  if (!hex || !hex.startsWith("#")) return false;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return false;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.3;
};

export const KeyboardNavigationHint = ({
  isKeyboardMode = false,
  actionHint = null,
  actionColor = null,
  dictionary,
}: KeyboardNavigationHintProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateNavigationHeight = () => {
      const height = Math.ceil(node.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--keyboard-navigation-hint-height",
        `${height}px`,
      );
    };

    updateNavigationHeight();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateNavigationHeight)
        : null;

    observer?.observe(node);
    window.addEventListener("resize", updateNavigationHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateNavigationHeight);
      document.documentElement.style.removeProperty(
        "--keyboard-navigation-hint-height",
      );
    };
  }, []);

  // For dark colors, use a light alternative
  const isDark = useMemo(() => isColorDark(actionColor), [actionColor]);
  const displayColor = isDark
    ? "rgba(255, 255, 255, 0.85)"
    : actionColor || "var(--color-accent)";
  const borderDisplayColor = isDark
    ? "rgba(255, 255, 255, 0.4)"
    : actionColor
      ? `color-mix(in srgb, ${actionColor} 36%, var(--color-border))`
      : "rgba(255,255,255,0.15)";

  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        opacity: isKeyboardMode ? 0.9 : 0.4,
        transition: "opacity 0.3s ease",
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Navigation hint */}
        <div className="flex items-center gap-2">
          {/* Keys */}
          <div className="flex gap-1">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: isKeyboardMode
                  ? "var(--color-primary)"
                  : "var(--color-muted)",
                transition: "all 0.2s ease",
              }}
            >
              ↑
            </div>
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: isKeyboardMode
                  ? "var(--color-primary)"
                  : "var(--color-muted)",
                transition: "all 0.2s ease",
              }}
            >
              ↓
            </div>
          </div>

          {/* Text */}
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{
              color: isKeyboardMode
                ? "var(--color-primary)"
                : "var(--color-muted)",
              transition: "color 0.2s ease",
            }}
          >
            {dictionary.keyboard.navigate}
          </span>
        </div>

        {/* Enter hint - only visible when keyboard mode is active and there's an action */}
        <AnimatePresence>
          {isKeyboardMode && actionHint && (
            <motion.div
              key="action-hint-container"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Enter key */}
              <motion.div
                className="px-2 h-6 rounded flex items-center justify-center text-xs font-mono"
                style={{
                  backgroundColor: isDark
                    ? "var(--color-card-hover)"
                    : "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
                animate={{
                  color: displayColor,
                  borderColor: borderDisplayColor,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                ⏎
              </motion.div>

              {/* Text with crossfade animation */}
              <span
                className="text-[10px] uppercase tracking-wider relative overflow-hidden"
                style={{
                  minWidth: "60px",
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={actionHint}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, color: displayColor }}
                    exit={{ opacity: 0, y: -8, position: "absolute" }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {actionHint}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
