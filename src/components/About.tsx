"use client";

import { cn } from "@/utils";
import { motion } from "framer-motion";
import { useMemo, useEffect, useRef } from "react";
import type { AboutProps } from "@/types";

export default function About({
  className,
  about,
}: AboutProps & { about: string }) {
  const scrollRootRef = useRef<Element | null>(null);

  useEffect(() => {
    // Obtener el contenedor de scroll correcto
    const rightColumn = document.querySelector('.right-column');
    scrollRootRef.current = rightColumn;
  }, []);
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
      <motion.div
        key={index}
        data-paragraph
        className="relative scroll-mt-24"
        style={{ paddingLeft: "24px" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px", root: scrollRootRef }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Green dot indicator with glow */}
        <div
          className="keyboard-indicator absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-opacity duration-200"
          style={{ 
            opacity: 0,
            background: "var(--color-primary)",
            boxShadow: "0 0 10px var(--color-primary)"
          }}
        />
        <p
          className="text-base md:text-lg leading-relaxed font-medium"
          style={{ color: "var(--color-muted)" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>
    ));
  }, [about]);

  return (
    <motion.div
      className={cn("w-full scroll-mt-24", className)}
      id="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px", root: scrollRootRef }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-6">{paragraphs}</div>
    </motion.div>
  );
}
