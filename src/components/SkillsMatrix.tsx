"use client";

import React, { useState } from "react";
import { cn } from "@/utils";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";
import type { Dictionary } from "@/i18n/types";

interface CapabilityArea {
  key:
    | "systemDesign"
    | "productEngineering"
    | "technicalLeadership"
    | "aiFirstDevelopment";
  color: string;
}

const CAPABILITIES: CapabilityArea[] = [
  {
    key: "systemDesign",
    color: "var(--color-primary)",
  },
  {
    key: "productEngineering",
    color: "var(--color-accent-blue)",
  },
  {
    key: "technicalLeadership",
    color: "var(--color-tertiary)",
  },
  {
    key: "aiFirstDevelopment",
    color: "var(--color-accent)",
  },
];

interface SkillsMatrixProps {
  className?: string;
  dictionary?: Dictionary;
}

const SkillsMatrix: React.FC<SkillsMatrixProps> = ({
  className,
  dictionary,
}) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleBlur = React.useCallback((e: React.FocusEvent) => {
    // Only clear if focus is leaving the entire skills container
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setHoveredArea(null);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("w-full border-y", className)}
      style={{ borderColor: "var(--color-border)" }}
      onBlur={handleBlur}
    >
      {CAPABILITIES.map((area, index) => {
        const animation = getSlideInAnimation(index);
        const isHovered = hoveredArea === area.key;
        const label = dictionary?.skills?.[area.key]?.label ?? area.key;
        const description = dictionary?.skills?.[area.key]?.description ?? "";
        const ecosystems = dictionary?.skills?.[area.key]?.ecosystems ?? [];

        return (
          <div
            key={area.key}
            data-skill-area
            data-skill-color={area.color}
            className={`${animation.className} cursor-default border-b py-7 outline-none last:border-b-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-primary)]`}
            style={{ ...animation.style, borderColor: "var(--color-border)" }}
            tabIndex={0}
            role="group"
            aria-label={label}
            onMouseEnter={() => setHoveredArea(area.key)}
            onMouseLeave={() => setHoveredArea(null)}
            onFocus={() => setHoveredArea(area.key)}
          >
            {/* Area label */}
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <span
                data-skill-label
                className="font-display text-2xl font-semibold leading-none tracking-[-0.02em] md:text-3xl"
                style={{
                  color: isHovered ? area.color : "var(--color-text)",
                  transition: "color 220ms ease-out",
                }}
              >
                {label}
              </span>
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: area.color }}
              />
            </div>

            {/* Description */}
            <p
              data-skill-description
              className="mb-4 max-w-[65ch] text-base leading-[1.7]"
              style={{
                color: "var(--color-muted)",
              }}
            >
              {description}
            </p>

            {/* Ecosystem tags */}
            <p
              className="text-sm font-semibold leading-relaxed"
              style={{ color: isHovered ? area.color : "var(--color-muted)" }}
            >
              {ecosystems.join(" · ")}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsMatrix;
