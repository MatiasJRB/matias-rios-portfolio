"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export default function CinematicEffects() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;

    const updatePointer = (event: PointerEvent) => {
      root.style.setProperty("--cinematic-x", `${event.clientX}px`);
      root.style.setProperty("--cinematic-y", `${event.clientY}px`);
    };

    const updateScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      root.style.setProperty("--cinematic-scroll", progress.toFixed(4));
    };

    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
    }

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    updateScroll();

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      root.style.removeProperty("--cinematic-scroll");
      root.style.removeProperty("--cinematic-x");
      root.style.removeProperty("--cinematic-y");
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div className="cinematic-progress" aria-hidden="true" />
      <div className="cinematic-spotlight" aria-hidden="true" />
      <div className="cinematic-top-fade" aria-hidden="true" />
      <div className="cinematic-bottom-fade" aria-hidden="true" />
      <div className="cinematic-grain" aria-hidden="true" />
    </>
  );
}
