"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 100,
  className = "",
  style = {},
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className} style={style}>
      {displayedText}
      {currentIndex < text.length && (
        <span
          className="inline-block w-[2px] h-[1em] ml-1 animate-pulse"
          style={{ backgroundColor: "var(--color-primary)" }}
        />
      )}
    </span>
  );
};
