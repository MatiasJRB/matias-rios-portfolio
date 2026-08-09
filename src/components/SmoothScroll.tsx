"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling with a delay to ensure it doesn't interfere with initial scroll restoration
    // This prevents the "drift" issue where scroll position accumulates error on reload
    const timeoutId = setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return null;
}
