"use client";

import { useEffect } from "react";

export const SkipToContent = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content with Tab key on page load
      if (e.key === "Tab" && !e.shiftKey) {
        const skipLink = document.getElementById("skip-to-content");
        if (skipLink && document.activeElement === document.body) {
          skipLink.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.getElementById("main-content");
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      id="skip-to-content"
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] 
                 focus:px-4 focus:py-2 focus:rounded-md focus:font-medium
                 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "var(--color-background)",
      }}
    >
      Skip to main content
    </a>
  );
};
