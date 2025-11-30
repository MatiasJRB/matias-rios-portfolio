"use client";

import type { Locale } from "@/i18n/config";

interface KeyboardNavigationHintProps {
  isKeyboardMode?: boolean;
  actionHint?: string | null;
  lang: Locale;
}

export const KeyboardNavigationHint = ({
  isKeyboardMode = false,
  actionHint = null,
  lang: _lang,
}: KeyboardNavigationHintProps) => {
  return (
    <div
      className="fixed right-6 bottom-6 z-40 pointer-events-none"
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
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
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
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
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
            navegar
          </span>
        </div>

        {/* Enter hint - only visible when keyboard mode is active and there's an action */}
        {isKeyboardMode && actionHint && (
          <div className="flex items-center gap-2">
            {/* Enter key */}
            <div
              className="px-2 h-6 rounded flex items-center justify-center text-xs font-mono"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "var(--color-accent)",
                transition: "all 0.2s ease",
              }}
            >
              ⏎
            </div>

            {/* Text */}
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{
                color: "var(--color-accent)",
                transition: "color 0.2s ease",
              }}
            >
              {actionHint}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
