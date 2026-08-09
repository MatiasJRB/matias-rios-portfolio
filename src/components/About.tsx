"use client";

import { cn } from "@/utils";
import { useMemo } from "react";
import type { AboutProps } from "@/types";
import { getSlideInAnimation } from "@/hooks/useSlideInAnimation";

export default function About({
  className,
  about,
}: AboutProps & { about: string }) {
  // Extract paragraph content using regex (works on both server and client)
  const paragraphs = useMemo(() => {
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    const matches: string[] = [];
    let match;

    while ((match = paragraphRegex.exec(about)) !== null) {
      matches.push(match[1]);
    }

    // If no <p> tags found, treat the whole content as one paragraph
    if (matches.length === 0 && about.trim()) {
      matches.push(about);
    }

    return matches.map((content, index) => {
      const animation = getSlideInAnimation(index);
      return (
        <div
          key={index}
          data-paragraph
          className={`relative scroll-mt-24 ${animation.className}`}
          style={animation.style}
        >
          <p
            className="max-w-[68ch] text-base font-normal leading-[1.75]"
            style={{ color: "var(--color-muted)" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );
    });
  }, [about]);

  return (
    <div className={cn("w-full scroll-mt-24", className)}>
      <div className="space-y-6">{paragraphs}</div>
    </div>
  );
}
