"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { AboutProps } from "@/types";

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

    return matches.map((content, index) => (
      <div
        key={index}
        data-paragraph
        className="relative scroll-mt-24"
        style={{ paddingLeft: "24px" }}
      >
        {/* Green dot indicator */}
        <div
          className="keyboard-indicator absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-muted)" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    ));
  }, [about]);

  return (
    <motion.div
      className={cn("w-full scroll-mt-24", className)}
      id="about"
      style={{ color: "var(--color-muted)" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-4">{paragraphs}</div>
    </motion.div>
  );
}
