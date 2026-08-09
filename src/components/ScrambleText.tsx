"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "01{}[]<>/\\|+=_*";

interface ScrambleTextProps {
  text: string;
  active?: boolean;
  className?: string;
}

export default function ScrambleText({
  text,
  active = false,
  className,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const previousActive = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplayText(text);
      previousActive.current = active;
      return;
    }

    if (!active) {
      setDisplayText(text);
      previousActive.current = false;
      return;
    }

    if (previousActive.current) return;

    previousActive.current = true;
    let frame = 0;
    const totalFrames = 16;

    const interval = window.setInterval(() => {
      frame += 1;
      const revealIndex = Math.floor((frame / totalFrames) * text.length);

      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || index < revealIndex) return char;

            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join(""),
      );

      if (frame >= totalFrames) {
        window.clearInterval(interval);
        setDisplayText(text);
      }
    }, 24);

    return () => {
      window.clearInterval(interval);
    };
  }, [active, text]);

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", minWidth: `${text.length}ch` }}
    >
      {displayText}
    </span>
  );
}
