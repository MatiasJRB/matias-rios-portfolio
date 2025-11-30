"use client";

interface KeyboardNavigationHintProps {
  isKeyboardMode?: boolean;
}

export const KeyboardNavigationHint = ({
  isKeyboardMode = false,
}: KeyboardNavigationHintProps) => {
  return (
    <div
      className="fixed right-6 bottom-6 z-40 pointer-events-none"
      style={{
        opacity: isKeyboardMode ? 0.9 : 0.4,
        transition: "opacity 0.3s ease",
      }}
    >
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
    </div>
  );
};
